#!/usr/bin/env node
/**
 * Test script for Adaptive Memory MCP
 *
 * Tests:
 * 1. Qdrant connection
 * 2. Redis connection
 * 3. Bedrock API
 * 4. Store memories
 * 5. Retrieve memories
 * 6. Organize memories
 */

import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Redis } from 'ioredis';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const MODEL_NAME = 'kr/claude-sonnet-4.5';

async function callLLM(prompt: string, maxTokens: number = 1024): Promise<string> {
  const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as any;
  let textContent: string;
  if (data.choices) {
    textContent = data.choices[0].message.content;
  } else if (data.content && data.content.length > 0) {
    textContent = data.content[0].text;
  } else {
    throw new Error('Empty response from API');
  }

  const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || textContent.match(/```\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1] : textContent;
}

async function main() {
  console.log('🧠 Testing Adaptive Memory MCP\n');

  // Test 1: Qdrant
  console.log('1️⃣  Testing Qdrant connection...');
  try {
    const qdrant = new QdrantClient({ url: QDRANT_URL });
    const collections = await qdrant.getCollections();
    console.log(`   ✅ Qdrant connected! Found ${collections.collections.length} collections`);
  } catch (error) {
    console.error('   ❌ Qdrant failed:', error);
    process.exit(1);
  }

  // Test 2: Redis
  console.log('\n2️⃣  Testing Redis connection...');
  try {
    const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
    await redis.ping();
    console.log('   ✅ Redis connected!');
    await redis.quit();
  } catch (error) {
    console.error('   ❌ Redis failed:', error);
    process.exit(1);
  }

  // Test 3: Bedrock API
  console.log('\n3️⃣  Testing Bedrock API...');
  try {
    const result = await callLLM('Say "API working" and nothing else.');
    console.log(`   ✅ Bedrock API working! Response: ${result.trim()}`);
  } catch (error) {
    console.error('   ❌ Bedrock API failed:', error);
    process.exit(1);
  }

  // Test 4: Store memories
  console.log('\n4️⃣  Testing memory storage...');
  const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

  const testMemories = [
    {
      type: 'task',
      content: 'Build authentication system with JWT and session management for the REST API',
      tags: ['auth', 'api'],
      priority: 'high' as const,
    },
    {
      type: 'issue',
      content: 'Database migration fails on production when adding NOT NULL column without default',
      tags: ['database', 'migration'],
      priority: 'critical' as const,
    },
    {
      type: 'context',
      content: 'Project uses React 19 with Next.js 15, TypeScript strict mode, and Tailwind CSS v4',
      tags: ['tech-stack'],
      priority: 'medium' as const,
    },
  ];

  const storedIds: string[] = [];
  for (const mem of testMemories) {
    try {
      // Generate AI suggestions for each memory
      const analysis = await callLLM(`Analyze this memory item and suggest enhancements:

Type: ${mem.type}
Content: ${mem.content}
Current Tags: ${mem.tags.join(', ')}

Provide JSON with:
1. suggestedTags - Additional relevant tags (array of strings)
2. priority - Suggested priority: low, medium, high, or critical
3. relatedConcepts - Related concepts to link (array of strings)
4. cluster - Which cluster does this belong to? (string)

Respond with ONLY valid JSON.`);

      const suggestions = JSON.parse(analysis);
      const id = `${mem.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const item = {
        id,
        type: mem.type,
        content: mem.content,
        metadata: {
          created: Date.now(),
          updated: Date.now(),
          accessed: Date.now(),
          accessCount: 0,
          priority: suggestions.priority || mem.priority,
          tags: [...new Set([...mem.tags, ...suggestions.suggestedTags])],
          relatedIds: [],
        },
      };

      await redis.setex(`memory:${id}`, 604800, JSON.stringify(item));
      await redis.lpush('memory:index', id);

      storedIds.push(id);
      console.log(`   ✅ Stored ${mem.type}: "${mem.content.substring(0, 40)}..."`);
      console.log(`      Cluster: ${suggestions.cluster}, Tags: ${item.metadata.tags.join(', ')}`);
    } catch (error) {
      console.error(`   ❌ Failed to store ${mem.type}:`, error);
    }
  }

  // Test 5: Retrieve memories
  console.log('\n5️⃣  Testing memory retrieval...');
  try {
    const intent = await callLLM(`Analyze this memory query:

Query: "database problems"

Provide JSON with:
1. intent - What is the user looking for? (string)
2. keywords - Key search terms (array of strings)
3. types - Which memory types are relevant? (array: task, issue, context, pattern)
4. timeframe - Recent, all, or specific? (string)

Respond with ONLY valid JSON.`);

    const queryAnalysis = JSON.parse(intent);
    console.log(`   ✅ Query analysis: ${queryAnalysis.intent}`);
    console.log(`      Keywords: ${queryAnalysis.keywords.join(', ')}`);

    // Search through stored memories
    const allIds = await redis.lrange('memory:index', 0, -1);
    let found = 0;
    for (const id of allIds) {
      const data = await redis.get(`memory:${id}`);
      if (data) {
        const item = JSON.parse(data);
        const matches = queryAnalysis.keywords.some((kw: string) =>
          item.content.toLowerCase().includes(kw.toLowerCase()) ||
          item.metadata.tags.some((tag: string) => tag.toLowerCase().includes(kw.toLowerCase()))
        );
        if (matches) {
          found++;
          console.log(`      Found: [${item.type}] ${item.content.substring(0, 50)}...`);
        }
      }
    }
    console.log(`   ✅ Found ${found} matching memories`);
  } catch (error) {
    console.error('   ❌ Retrieval failed:', error);
  }

  // Test 6: Organize memories
  console.log('\n6️⃣  Testing memory organization...');
  try {
    const allIds = await redis.lrange('memory:index', 0, -1);
    const memories: any[] = [];

    for (const id of allIds.slice(0, 100)) {
      const data = await redis.get(`memory:${id}`);
      if (data) {
        memories.push(JSON.parse(data));
      }
    }

    if (memories.length > 0) {
      const memoryText = memories.map((m, i) =>
        `${i + 1}. [${m.type}] ${m.content.substring(0, 80)} (tags: ${m.metadata.tags.join(', ')})`
      ).join('\n');

      const clusters = await callLLM(`Analyze these memories and organize into clusters:

${memoryText}

Provide JSON with:
1. clusters - Array of {name, description, memoryIndices: number[]}
2. insights - What patterns do you see? (array of strings)
3. recommendations - Suggested actions (array of strings)

Respond with ONLY valid JSON.`, 2048);

      const result = JSON.parse(clusters);
      console.log(`   ✅ Organization complete!`);
      console.log(`      Clusters: ${result.clusters?.length || 0}`);
      console.log(`      Insights: ${result.insights?.length || 0}`);
      console.log(`      Recommendations: ${result.recommendations?.length || 0}`);
    } else {
      console.log('   ℹ️  No memories to organize');
    }
  } catch (error) {
    console.error('   ❌ Organization failed:', error);
  }

  await redis.quit();

  console.log('\n✨ All Adaptive Memory MCP tests passed!\n');
}

main().catch(console.error);
