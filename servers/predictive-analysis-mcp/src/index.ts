#!/usr/bin/env node
/**
 * Predictive Analysis MCP - AI-Powered Code Analysis
 *
 * Features:
 * - Impact prediction (what breaks if you change this)
 * - Security reasoning (detect vulnerabilities)
 * - Performance prediction (identify bottlenecks)
 * - Architecture validation (check design patterns)
 */

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Redis } from 'ioredis';

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const MODEL_NAME = 'kr/claude-sonnet-4.5';

// Initialize Redis
const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

/**
 * Call LLM for analysis
 */
async function callLLM(prompt: string, maxTokens: number = 2048): Promise<string> {
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

/**
 * Predict impact of code changes
 */
async function predictImpact(code: string, change: string): Promise<any> {
  console.error('[Impact] Analyzing change impact...');

  const analysis = await callLLM(`Analyze the impact of this code change:

Current Code:
${code}

Proposed Change:
${change}

Provide JSON with:
1. affectedFiles - Files that will be impacted (array of strings)
2. breakingChanges - What will break? (array of strings)
3. testUpdates - Tests that need updating (array of strings)
4. riskLevel - low, medium, high, or critical
5. recommendations - How to mitigate risks (array of strings)
6. estimatedEffort - Time estimate (string)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Analyze security vulnerabilities
 */
async function analyzeSecurity(code: string, context?: string): Promise<any> {
  console.error('[Security] Analyzing for vulnerabilities...');

  const analysis = await callLLM(`Perform security analysis on this code:

Code:
${code}

${context ? `Context: ${context}` : ''}

Provide JSON with:
1. vulnerabilities - Array of {type, severity, description, location, fix}
2. securityScore - 0-100 (100 = most secure)
3. recommendations - Security improvements (array of strings)
4. complianceIssues - OWASP/standards violations (array of strings)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Predict performance issues
 */
async function predictPerformance(code: string, context?: string): Promise<any> {
  console.error('[Performance] Analyzing performance...');

  const analysis = await callLLM(`Analyze performance characteristics of this code:

Code:
${code}

${context ? `Context: ${context}` : ''}

Provide JSON with:
1. bottlenecks - Array of {location, issue, impact, fix}
2. complexity - Time/space complexity (string)
3. scalability - How it scales (string)
4. optimizations - Suggested improvements (array of strings)
5. performanceScore - 0-100 (100 = best)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Validate architecture and design patterns
 */
async function validateArchitecture(code: string, patterns?: string[]): Promise<any> {
  console.error('[Architecture] Validating design...');

  const analysis = await callLLM(`Validate the architecture and design patterns in this code:

Code:
${code}

${patterns ? `Expected Patterns: ${patterns.join(', ')}` : ''}

Provide JSON with:
1. violations - Design pattern violations (array of {pattern, issue, fix})
2. couplingIssues - Tight coupling problems (array of strings)
3. cohesionScore - 0-100 (100 = best cohesion)
4. maintainabilityScore - 0-100 (100 = most maintainable)
5. recommendations - Architecture improvements (array of strings)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

// Create MCP server
const server = new Server(
  {
    name: 'predictive-analysis-mcp',
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
        name: 'predict_impact',
        description: 'Predict the impact of code changes - what will break, what needs updating, risk level',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Current code',
            },
            change: {
              type: 'string',
              description: 'Proposed change or new code',
            },
          },
          required: ['code', 'change'],
        },
      },
      {
        name: 'analyze_security',
        description: 'Deep security analysis - detect vulnerabilities, OWASP violations, security score',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze',
            },
            context: {
              type: 'string',
              description: 'Additional context (optional)',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'predict_performance',
        description: 'Predict performance issues - bottlenecks, complexity, scalability, optimizations',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to analyze',
            },
            context: {
              type: 'string',
              description: 'Usage context (optional)',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'validate_architecture',
        description: 'Validate architecture and design patterns - coupling, cohesion, maintainability',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code to validate',
            },
            patterns: {
              type: 'array',
              items: { type: 'string' },
              description: 'Expected design patterns (optional)',
            },
          },
          required: ['code'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'predict_impact') {
      const { code, change } = args as any;
      const result = await predictImpact(code, change);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'analyze_security') {
      const { code, context } = args as any;
      const result = await analyzeSecurity(code, context);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'predict_performance') {
      const { code, context } = args as any;
      const result = await predictPerformance(code, context);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'validate_architecture') {
      const { code, patterns } = args as any;
      const result = await validateArchitecture(code, patterns);

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
  console.error('Starting Predictive Analysis MCP server...');
  console.error(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Predictive Analysis MCP server running!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
