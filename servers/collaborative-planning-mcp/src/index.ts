#!/usr/bin/env node
/**
 * Collaborative Planning MCP - AI-Powered Multi-Agent Coordination
 *
 * Features:
 * - Task decomposition (break complex tasks into subtasks)
 * - Agent coordination (assign tasks to specialized agents)
 * - Workflow orchestration (manage dependencies and execution order)
 * - Progress tracking (monitor task completion and blockers)
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
 * Call LLM for planning
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
 * Decompose complex task into subtasks
 */
async function decomposeTask(task: string, context?: string): Promise<any> {
  console.error('[Decompose] Breaking down task...');

  const analysis = await callLLM(`Decompose this complex task into manageable subtasks:

Task:
${task}

${context ? `Context: ${context}` : ''}

Provide JSON with:
1. subtasks - Array of {id, title, description, estimatedTime, dependencies (array of task IDs), priority (high/medium/low), skills (array of required skills)}
2. criticalPath - Array of task IDs that form the critical path
3. parallelizable - Array of arrays showing which tasks can run in parallel
4. totalEstimate - Overall time estimate (string)
5. risks - Potential risks and mitigation strategies (array of {risk, mitigation})

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Assign tasks to specialized agents
 */
async function coordinateAgents(tasks: any[], availableAgents?: string[]): Promise<any> {
  console.error('[Coordinate] Assigning tasks to agents...');

  const analysis = await callLLM(`Coordinate task assignment across specialized agents:

Tasks:
${JSON.stringify(tasks, null, 2)}

${availableAgents ? `Available Agents: ${availableAgents.join(', ')}` : ''}

Provide JSON with:
1. assignments - Array of {taskId, agentType, reasoning, estimatedStart, estimatedEnd}
2. agentTypes - Recommended agent types needed (array of {type, count, skills})
3. bottlenecks - Potential resource bottlenecks (array of strings)
4. optimizations - Suggestions to improve parallelization (array of strings)
5. timeline - Gantt-style timeline (array of {agent, tasks (array of {taskId, start, end})})

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Orchestrate workflow execution
 */
async function orchestrateWorkflow(plan: any, currentState?: any): Promise<any> {
  console.error('[Orchestrate] Planning workflow execution...');

  const analysis = await callLLM(`Orchestrate the execution of this workflow:

Plan:
${JSON.stringify(plan, null, 2)}

${currentState ? `Current State: ${JSON.stringify(currentState, null, 2)}` : ''}

Provide JSON with:
1. executionOrder - Ordered array of task IDs to execute
2. readyTasks - Tasks ready to start now (array of task IDs)
3. blockedTasks - Tasks blocked by dependencies (array of {taskId, blockedBy (array of task IDs)})
4. nextActions - Immediate next steps (array of strings)
5. checkpoints - Key milestones to verify (array of {milestone, tasks (array of task IDs), criteria})

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Track progress and identify blockers
 */
async function trackProgress(plan: any, completedTasks: string[], issues?: any[]): Promise<any> {
  console.error('[Track] Analyzing progress...');

  const analysis = await callLLM(`Track progress and identify blockers:

Plan:
${JSON.stringify(plan, null, 2)}

Completed Tasks: ${completedTasks.join(', ')}

${issues ? `Issues: ${JSON.stringify(issues, null, 2)}` : ''}

Provide JSON with:
1. progressPercent - Overall completion percentage (number)
2. completedMilestones - Milestones achieved (array of strings)
3. blockers - Current blockers (array of {taskId, blocker, severity (high/medium/low), suggestedAction})
4. atRisk - Tasks at risk of delay (array of {taskId, reason, impact})
5. recommendations - Actions to get back on track (array of strings)
6. estimatedCompletion - Updated completion estimate (string)

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

/**
 * Optimize workflow based on feedback
 */
async function optimizeWorkflow(plan: any, feedback: any): Promise<any> {
  console.error('[Optimize] Improving workflow...');

  const analysis = await callLLM(`Optimize this workflow based on feedback:

Current Plan:
${JSON.stringify(plan, null, 2)}

Feedback:
${JSON.stringify(feedback, null, 2)}

Provide JSON with:
1. optimizedPlan - Updated plan with improvements (same structure as original)
2. changes - What changed and why (array of {change, reasoning})
3. expectedImpact - Expected improvements (array of strings)
4. tradeoffs - Any tradeoffs made (array of strings)
5. alternativeApproaches - Other approaches considered (array of {approach, pros, cons})

Respond with ONLY valid JSON.`, 2048);

  return JSON.parse(analysis);
}

// Create MCP server
const server = new Server(
  {
    name: 'collaborative-planning-mcp',
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
        name: 'decompose_task',
        description: 'Break down complex task into subtasks with dependencies, priorities, and time estimates',
        inputSchema: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description: 'Complex task to decompose',
            },
            context: {
              type: 'string',
              description: 'Additional context (optional)',
            },
          },
          required: ['task'],
        },
      },
      {
        name: 'coordinate_agents',
        description: 'Assign tasks to specialized agents, identify bottlenecks, optimize parallelization',
        inputSchema: {
          type: 'object',
          properties: {
            tasks: {
              type: 'array',
              description: 'Array of tasks to assign',
            },
            availableAgents: {
              type: 'array',
              items: { type: 'string' },
              description: 'Available agent types (optional)',
            },
          },
          required: ['tasks'],
        },
      },
      {
        name: 'orchestrate_workflow',
        description: 'Plan workflow execution order, identify ready tasks, manage dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            plan: {
              type: 'object',
              description: 'Workflow plan to orchestrate',
            },
            currentState: {
              type: 'object',
              description: 'Current execution state (optional)',
            },
          },
          required: ['plan'],
        },
      },
      {
        name: 'track_progress',
        description: 'Monitor progress, identify blockers, estimate completion, recommend actions',
        inputSchema: {
          type: 'object',
          properties: {
            plan: {
              type: 'object',
              description: 'Original plan',
            },
            completedTasks: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of completed task IDs',
            },
            issues: {
              type: 'array',
              description: 'Known issues (optional)',
            },
          },
          required: ['plan', 'completedTasks'],
        },
      },
      {
        name: 'optimize_workflow',
        description: 'Improve workflow based on feedback, suggest alternatives, analyze tradeoffs',
        inputSchema: {
          type: 'object',
          properties: {
            plan: {
              type: 'object',
              description: 'Current workflow plan',
            },
            feedback: {
              type: 'object',
              description: 'Feedback on current plan (performance, issues, constraints)',
            },
          },
          required: ['plan', 'feedback'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'decompose_task') {
      const { task, context } = args as any;
      const result = await decomposeTask(task, context);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'coordinate_agents') {
      const { tasks, availableAgents } = args as any;
      const result = await coordinateAgents(tasks, availableAgents);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'orchestrate_workflow') {
      const { plan, currentState } = args as any;
      const result = await orchestrateWorkflow(plan, currentState);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'track_progress') {
      const { plan, completedTasks, issues } = args as any;
      const result = await trackProgress(plan, completedTasks, issues);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'optimize_workflow') {
      const { plan, feedback } = args as any;
      const result = await optimizeWorkflow(plan, feedback);

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
  console.error('Starting Collaborative Planning MCP server...');
  console.error(`Redis: ${REDIS_HOST}:${REDIS_PORT}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Collaborative Planning MCP server running!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
