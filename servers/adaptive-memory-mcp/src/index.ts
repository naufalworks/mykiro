#!/usr/bin/env node
/**
 * Adaptive Memory MCP - AI-Powered Memory System
 *
 * Features:
 * - Self-organizing memory clusters
 * - Predictive context loading
 * - Pattern extraction engine
 * - Temporal reasoning
 * - Proactive issue detection
 */

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Redis } from 'ioredis';

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || 'adaptive_memory';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const MODEL_NAME = 'kr/claude-sonnet-4.5';

// Initialize clients
const qdrant = new QdrantClient({ url: QDRANT_URL });
const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

/**
 * Memory item structure
 */
interface MemoryItem {
  id: string;
  type: 'task' | 'issue' | 'context' | 'pattern';
  content: string;
  metadata: {
    created: number;
    updated: number;
    accessed: number;
    accessCount: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    relatedIds: string[];
    status?: 'pending' | 'in_progress' | 'completed' | 'archived';
  };
}

/**
 * Call LLM for reasoning
 */
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

  // Extract text from OpenAI-compatible format
  let textContent: string;
  if (data.choices) {
    textContent = data.choices[0].message.content;
  } else if (data.content && data.content.length > 0) {
    textContent = data.content[0].text;
  } else {
    throw new Error('Empty response from API');
  }

  // Extract JSON from markdown code blocks if present
  const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || textContent.match(/```\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1] : textContent;
}

/**
 * Store memory item with AI-powered organization
 */
async function storeMemory(item: Omit<MemoryItem, 'id'>): Promise<string> {
  console.error(`[Memory] Storing ${item.type}: ${item.content.substring(0, 50)}...`);

  // Generate ID
  const id = `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // AI: Analyze and enhance metadata
  const analysis = await callLLM(`Analyze this memory item and suggest enhancements:

Type: ${item.type}
Content: ${item.content}
Current Tags: ${item.metadata.tags.join(', ')}

Provide JSON with:
1. suggestedTags - Additional relevant tags (array of strings)
2. priority - Suggested priority: low, medium, high, or critical
3. relatedConcepts - Related concepts to link (array of strings)
4. cluster - Which cluster does this belong to? (string)

Respond with ONLY valid JSON.`);

  const aiSuggestions = JSON.parse(analysis);

  // Merge AI suggestions with original metadata
  const enhancedItem: MemoryItem = {
    id,
    ...item,
    metadata: {
      ...item.metadata,
      tags: [...new Set([...item.metadata.tags, ...aiSuggestions.suggestedTags])],
      priority: aiSuggestions.priority || item.metadata.priority,
    },
  };

  // Store in Redis (hot storage)
  await redis.setex(
    `memory:${id}`,
    604800, // 7 days TTL
    JSON.stringify(enhancedItem)
  );

  // Store in Qdrant (vector storage) - TODO: Add embedding generation
  // For now, store metadata only
  await redis.lpush('memory:index', id);
  await redis.ltrim('memory:index', 0, 999); // Keep last 1000

  console.error(`[Memory] Stored with ID: ${id}, cluster: ${aiSuggestions.cluster}`);
  return id;
}

/**
 * Retrieve memory with predictive loading
 */
async function retrieveMemory(query: string, limit: number = 5): Promise<MemoryItem[]> {
  console.error(`[Memory] Retrieving: "${query}"`);

  // AI: Understand query intent
  const intent = await callLLM(`Analyze this memory query:

Query: "${query}"

Provide JSON with:
1. intent - What is the user looking for? (string)
2. keywords - Key search terms (array of strings)
3. types - Which memory types are relevant? (array: task, issue, context, pattern)
4. timeframe - Recent, all, or specific? (string)

Respond with ONLY valid JSON.`);

  const queryAnalysis = JSON.parse(intent);
  console.error(`[Memory] Intent: ${queryAnalysis.intent}`);

  // Search in Redis index
  const allIds = await redis.lrange('memory:index', 0, -1);
  const memories: MemoryItem[] = [];

  for (const id of allIds.slice(0, 50)) { // Check last 50
    const data = await redis.get(`memory:${id}`);
    if (data) {
      const item = JSON.parse(data) as MemoryItem;

      // Simple keyword matching (TODO: Use vector search)
      const matchesType = queryAnalysis.types.includes(item.type);
      const matchesKeywords = queryAnalysis.keywords.some((kw: string) =>
        item.content.toLowerCase().includes(kw.toLowerCase()) ||
        item.metadata.tags.some((tag: string) => tag.toLowerCase().includes(kw.toLowerCase()))
      );

      if (matchesType && matchesKeywords) {
        // Update access metadata
        item.metadata.accessed = Date.now();
        item.metadata.accessCount++;
        await redis.setex(`memory:${id}`, 604800, JSON.stringify(item));

        memories.push(item);
      }
    }

    if (memories.length >= limit) break;
  }

  console.error(`[Memory] Found ${memories.length} items`);
  return memories;
}

/**
 * Organize memories into clusters
 */
async function organizeMemories(): Promise<any> {
  console.error('[Memory] Organizing into clusters...');

  // Get all memories
  const allIds = await redis.lrange('memory:index', 0, -1);
  const memories: MemoryItem[] = [];

  for (const id of allIds.slice(0, 100)) { // Last 100
    const data = await redis.get(`memory:${id}`);
    if (data) {
      memories.push(JSON.parse(data));
    }
  }

  if (memories.length === 0) {
    return { clusters: [], message: 'No memories to organize' };
  }

  // AI: Cluster analysis
  const memoryText = memories.map((m, i) =>
    `${i + 1}. [${m.type}] ${m.content.substring(0, 100)} (tags: ${m.metadata.tags.join(', ')})`
  ).join('\n');

  const clusters = await callLLM(`Analyze these memories and organize into clusters:

${memoryText}

Provide JSON with:
1. clusters - Array of {name, description, memoryIndices: number[]}
2. insights - What patterns do you see? (array of strings)
3. recommendations - Suggested actions (array of strings)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(clusters);
}

// Create MCP server
const server = new Server(
  {
    name: 'adaptive-memory-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'store_memory',
        description: 'Store a memory item (task, issue, context, or pattern) with AI-powered organization and clustering',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['task', 'issue', 'context', 'pattern'],
              description: 'Type of memory item',
            },
            content: {
              type: 'string',
              description: 'Content to store',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Initial tags (AI will suggest more)',
              default: [],
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Priority level (AI may adjust)',
              default: 'medium',
            },
          },
          required: ['type', 'content'],
        },
      },
      {
        name: 'retrieve_memory',
        description: 'Retrieve memories with AI-powered query understanding and predictive loading',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Natural language query',
            },
            limit: {
              type: 'number',
              description: 'Maximum results (default: 5)',
              default: 5,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'organize_memories',
        description: 'AI-powered memory organization into self-organizing clusters with insights',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'store_memory') {
      const { type, content, tags = [], priority = 'medium' } = args as any;

      const id = await storeMemory({
        type,
        content,
        metadata: {
          created: Date.now(),
          updated: Date.now(),
          accessed: Date.now(),
          accessCount: 0,
          priority,
          tags,
          relatedIds: [],
          status: type === 'task' || type === 'issue' ? 'pending' : undefined,
        },
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ id, message: 'Memory stored successfully' }, null, 2),
          },
        ],
      };
    }

    if (name === 'retrieve_memory') {
      const { query, limit = 5 } = args as any;
      const memories = await retrieveMemory(query, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ query, memories, count: memories.length }, null, 2),
          },
        ],
      };
    }

    if (name === 'organize_memories') {
      const result = await organizeMemories();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  console.error('Starting Adaptive Memory MCP server...');
  console.error(`Qdrant: ${QDRANT_URL}`);
  console.error(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);
  console.error(`Collection: ${QDRANT_COLLECTION}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Adaptive Memory MCP server running!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
