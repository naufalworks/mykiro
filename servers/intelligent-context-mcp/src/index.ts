#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Redis } from 'ioredis';
import {
  analyzeQuery,
  assembleContext,
  extractPatterns,
  predictNextContext,
  analyzeDependencies,
} from './reasoning.js';

// Configuration
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY || '';
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || 'code_context';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Initialize clients
const qdrant = new QdrantClient({ url: QDRANT_URL });
const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

// Voyage AI embedding function
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: 'voyage-4-large',
    }),
  });

  if (!response.ok) {
    throw new Error(`Voyage AI API error: ${response.statusText}`);
  }

  const data = await response.json() as { data: Array<{ embedding: number[] }> };
  return data.data[0].embedding;
}

// Multi-hop context search with intelligent reasoning
async function intelligentSearch(query: string, limit: number = 5): Promise<any> {
  console.error(`[IntelligentSearch] Starting for: "${query}"`);

  // Step 1: Analyze query with LLM
  console.error('[IntelligentSearch] Analyzing query intent...');
  const analysis = await analyzeQuery(query);
  console.error(`[IntelligentSearch] Intent: ${analysis.intent}`);
  console.error(`[IntelligentSearch] Strategy: ${analysis.searchStrategy}`);

  // Step 2: Check Redis cache
  const cacheKey = `intelligent:${query}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.error('[IntelligentSearch] Cache hit!');
    return JSON.parse(cached);
  }

  console.error('[IntelligentSearch] Cache miss, performing intelligent search...');

  // Step 3: Multi-hop search based on strategy
  let allResults: any[] = [];

  if (analysis.searchStrategy === 'multi-hop') {
    // Search for main query
    const mainResults = await multiHopSearch(query, limit);
    allResults.push(...mainResults);

    // Search for related concepts
    for (const concept of analysis.relatedConcepts.slice(0, 2)) {
      console.error(`[IntelligentSearch] Searching related concept: ${concept}`);
      const relatedResults = await multiHopSearch(concept, 2);
      allResults.push(...relatedResults);
    }
  } else {
    // Single-hop search
    allResults = await multiHopSearch(query, limit);
  }

  // Step 4: Assemble context with LLM
  console.error('[IntelligentSearch] Assembling context...');
  const context = await assembleContext(query, allResults);

  // Step 5: Predict next context needs
  console.error('[IntelligentSearch] Predicting next needs...');
  const prediction = await predictNextContext(query, allResults);

  // Step 6: Analyze dependencies if code found
  let dependencies = null;
  const codeSnippets = allResults
    .filter((r) => r.payload?.code)
    .slice(0, 3)
    .map((r) => ({
      file: r.payload.file,
      code: r.payload.code,
    }));

  if (codeSnippets.length > 0) {
    console.error('[IntelligentSearch] Analyzing dependencies...');
    dependencies = await analyzeDependencies(codeSnippets);
  }

  // Step 7: Build intelligent response
  const intelligentResponse = {
    query,
    analysis,
    results: allResults.map((r: any) => ({
      score: r.score,
      payload: r.payload,
    })),
    context,
    prediction,
    dependencies,
    count: allResults.length,
  };

  // Step 8: Cache results (1h TTL for intelligent results)
  await redis.setex(cacheKey, 3600, JSON.stringify(intelligentResponse));

  // Step 9: Store search history for pattern extraction
  await storeSearchHistory(query, allResults);

  console.error(`[IntelligentSearch] Complete! Found ${allResults.length} results`);
  return intelligentResponse;
}

// Basic multi-hop search (used by intelligent search)
async function multiHopSearch(query: string, limit: number = 5): Promise<any[]> {
  console.error(`[MultiHop] Starting search for: "${query}"`);

  // Step 1: Check Redis cache
  const cacheKey = `context:${query}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.error('[MultiHop] Cache hit!');
    return JSON.parse(cached);
  }

  console.error('[MultiHop] Cache miss, generating embedding...');

  // Step 2: Generate embedding
  const embedding = await generateEmbedding(query);

  // Step 3: Search Qdrant
  console.error('[MultiHop] Searching Qdrant...');
  const searchResult = await qdrant.search(QDRANT_COLLECTION, {
    vector: embedding,
    limit,
    with_payload: true,
  });

  // Step 4: Cache results (24h TTL)
  await redis.setex(cacheKey, 86400, JSON.stringify(searchResult));

  console.error(`[MultiHop] Found ${searchResult.length} results`);
  return searchResult;
}

// Store search history for pattern learning
async function storeSearchHistory(query: string, results: any[]): Promise<void> {
  const historyKey = 'search:history';
  const entry = JSON.stringify({
    query,
    timestamp: Date.now(),
    resultCount: results.length,
  });

  // Store in Redis list (keep last 100)
  await redis.lpush(historyKey, entry);
  await redis.ltrim(historyKey, 0, 99);
}

// Create MCP server
const server = new Server(
  {
    name: 'intelligent-context-mcp',
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
        name: 'intelligent_search',
        description: 'AI-powered intelligent context search with multi-hop reasoning, dependency analysis, and predictive loading. Uses Sonnet 4.5 to understand intent and assemble complete context.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Natural language query describing what you are looking for',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              default: 5,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'search_context',
        description: 'Basic semantic search (fast, no AI reasoning). Use for simple lookups.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Natural language query describing what you are looking for',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 5)',
              default: 5,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'find_similar',
        description: 'Find code similar to a given snippet or description',
        inputSchema: {
          type: 'object',
          properties: {
            code_or_description: {
              type: 'string',
              description: 'Code snippet or description to find similar items',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 3)',
              default: 3,
            },
          },
          required: ['code_or_description'],
        },
      },
      {
        name: 'extract_patterns',
        description: 'Analyze search history and extract patterns to improve future searches',
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
    if (name === 'intelligent_search') {
      const { query, limit = 5 } = args as { query: string; limit?: number };

      const results = await intelligentSearch(query, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    }

    if (name === 'search_context') {
      const { query, limit = 5 } = args as { query: string; limit?: number };

      const results = await multiHopSearch(query, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query,
              results: results.map((r: any) => ({
                score: r.score,
                payload: r.payload,
              })),
              count: results.length,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'find_similar') {
      const { code_or_description, limit = 3 } = args as {
        code_or_description: string;
        limit?: number
      };

      const results = await multiHopSearch(code_or_description, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query: code_or_description,
              similar_items: results.map((r: any) => ({
                score: r.score,
                payload: r.payload,
              })),
              count: results.length,
            }, null, 2),
          },
        ],
      };
    }

    if (name === 'extract_patterns') {
      // Get search history from Redis
      const historyKey = 'search:history';
      const history = await redis.lrange(historyKey, 0, 99);

      const searchHistory = history.map((h) => {
        const entry = JSON.parse(h);
        return {
          query: entry.query,
          results: [], // We don't store full results in history
        };
      });

      const patterns = await extractPatterns(searchHistory);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(patterns, null, 2),
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
  console.error('Starting Intelligent Context MCP server...');
  console.error(`Qdrant: ${QDRANT_URL}`);
  console.error(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);
  console.error(`Collection: ${QDRANT_COLLECTION}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Intelligent Context MCP server running!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
