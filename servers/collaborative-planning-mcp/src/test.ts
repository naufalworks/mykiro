#!/usr/bin/env node
/**
 * Test suite for Collaborative Planning MCP
 */

import 'dotenv/config';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample data for testing
const COMPLEX_TASK = `Build a real-time collaborative code editor with the following features:
- Multi-user editing with operational transformation
- Syntax highlighting for 10+ languages
- Live cursor tracking
- Chat and video integration
- Version control integration
- Plugin system for extensions`;

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Design system architecture',
    description: 'Design overall system architecture and tech stack',
    estimatedTime: '2 days',
    dependencies: [],
    priority: 'high',
    skills: ['architecture', 'system-design'],
  },
  {
    id: 'task-2',
    title: 'Implement WebSocket server',
    description: 'Build real-time communication layer',
    estimatedTime: '3 days',
    dependencies: ['task-1'],
    priority: 'high',
    skills: ['backend', 'websockets'],
  },
  {
    id: 'task-3',
    title: 'Build operational transformation engine',
    description: 'Implement OT algorithm for conflict resolution',
    estimatedTime: '5 days',
    dependencies: ['task-1'],
    priority: 'high',
    skills: ['algorithms', 'distributed-systems'],
  },
  {
    id: 'task-4',
    title: 'Create frontend editor component',
    description: 'Build React-based code editor UI',
    estimatedTime: '4 days',
    dependencies: ['task-1'],
    priority: 'high',
    skills: ['frontend', 'react'],
  },
];

const SAMPLE_PLAN = {
  subtasks: SAMPLE_TASKS,
  criticalPath: ['task-1', 'task-3', 'task-2'],
  parallelizable: [['task-2', 'task-3', 'task-4']],
  totalEstimate: '2-3 weeks',
};

let mcpProcess: any;
let requestId = 1;

/**
 * Start MCP server
 */
function startMCPServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const serverPath = join(__dirname, '../dist/index.js');
    mcpProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    });

    mcpProcess.stderr.on('data', (data: Buffer) => {
      const message = data.toString();
      if (message.includes('running')) {
        resolve();
      }
    });

    mcpProcess.on('error', reject);

    setTimeout(() => resolve(), 2000);
  });
}

/**
 * Send MCP request via stdio
 */
async function sendMCPRequest(method: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      jsonrpc: '2.0',
      id: requestId++,
      method,
      params,
    };

    let responseData = '';

    const onData = (data: Buffer) => {
      responseData += data.toString();
      try {
        const response = JSON.parse(responseData);
        mcpProcess.stdout.removeListener('data', onData);
        if (response.error) {
          reject(new Error(JSON.stringify(response.error)));
        } else {
          resolve(response.result);
        }
      } catch (e) {
        // Incomplete JSON, wait for more data
      }
    };

    mcpProcess.stdout.on('data', onData);

    mcpProcess.stdin.write(JSON.stringify(request) + '\n');

    setTimeout(() => {
      mcpProcess.stdout.removeListener('data', onData);
      reject(new Error('Request timeout'));
    }, 30000);
  });
}

/**
 * Test: Initialize MCP server
 */
async function testInitialize() {
  console.log('\n=== Test: Initialize ===');
  try {
    const result = await sendMCPRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-client', version: '1.0.0' },
    });
    console.log('✓ Server initialized:', result.serverInfo.name);
  } catch (error) {
    console.error('✗ Initialize failed:', error);
  }
}

/**
 * Test: List tools
 */
async function testListTools() {
  console.log('\n=== Test: List Tools ===');
  try {
    const result = await sendMCPRequest('tools/list', {});
    console.log(`✓ Found ${result.tools.length} tools:`);
    result.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
  } catch (error) {
    console.error('✗ List tools failed:', error);
  }
}

/**
 * Test: Decompose Task
 */
async function testDecomposeTask() {
  console.log('\n=== Test: Decompose Task ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'decompose_task',
      arguments: {
        task: COMPLEX_TASK,
        context: 'Team of 5 developers, 3-month timeline',
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Task Decomposition:');
    console.log(`  Total Subtasks: ${analysis.subtasks?.length || 0}`);
    console.log(`  Critical Path: ${analysis.criticalPath?.length || 0} tasks`);
    console.log(`  Total Estimate: ${analysis.totalEstimate}`);

    if (analysis.subtasks?.length > 0) {
      console.log('  Key Subtasks:');
      analysis.subtasks.slice(0, 5).forEach((task: any) => {
        console.log(`    - [${task.priority}] ${task.title} (${task.estimatedTime})`);
      });
    }

    if (analysis.risks?.length > 0) {
      console.log('  Risks:');
      analysis.risks.forEach((risk: any) => {
        console.log(`    - ${risk.risk}`);
        console.log(`      Mitigation: ${risk.mitigation}`);
      });
    }
  } catch (error) {
    console.error('✗ Decompose task failed:', error);
  }
}

/**
 * Test: Coordinate Agents
 */
async function testCoordinateAgents() {
  console.log('\n=== Test: Coordinate Agents ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'coordinate_agents',
      arguments: {
        tasks: SAMPLE_TASKS,
        availableAgents: ['backend-specialist', 'frontend-specialist', 'architect', 'devops'],
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Agent Coordination:');
    console.log(`  Assignments: ${analysis.assignments?.length || 0}`);

    if (analysis.assignments?.length > 0) {
      console.log('  Task Assignments:');
      analysis.assignments.forEach((assignment: any) => {
        console.log(`    - ${assignment.taskId} → ${assignment.agentType}`);
        console.log(`      Reasoning: ${assignment.reasoning}`);
      });
    }

    if (analysis.bottlenecks?.length > 0) {
      console.log('  Bottlenecks:');
      analysis.bottlenecks.forEach((bottleneck: string) => {
        console.log(`    - ${bottleneck}`);
      });
    }

    if (analysis.optimizations?.length > 0) {
      console.log('  Optimizations:');
      analysis.optimizations.forEach((opt: string) => {
        console.log(`    - ${opt}`);
      });
    }
  } catch (error) {
    console.error('✗ Coordinate agents failed:', error);
  }
}

/**
 * Test: Orchestrate Workflow
 */
async function testOrchestrate() {
  console.log('\n=== Test: Orchestrate Workflow ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'orchestrate_workflow',
      arguments: {
        plan: SAMPLE_PLAN,
        currentState: { completed: [], inProgress: [] },
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Workflow Orchestration:');
    console.log(`  Execution Order: ${analysis.executionOrder?.length || 0} tasks`);
    console.log(`  Ready Tasks: ${analysis.readyTasks?.length || 0}`);
    console.log(`  Blocked Tasks: ${analysis.blockedTasks?.length || 0}`);

    if (analysis.readyTasks?.length > 0) {
      console.log('  Ready to Start:');
      analysis.readyTasks.forEach((taskId: string) => {
        console.log(`    - ${taskId}`);
      });
    }

    if (analysis.nextActions?.length > 0) {
      console.log('  Next Actions:');
      analysis.nextActions.forEach((action: string) => {
        console.log(`    - ${action}`);
      });
    }

    if (analysis.checkpoints?.length > 0) {
      console.log('  Checkpoints:');
      analysis.checkpoints.forEach((checkpoint: any) => {
        console.log(`    - ${checkpoint.milestone}`);
      });
    }
  } catch (error) {
    console.error('✗ Orchestrate workflow failed:', error);
  }
}

/**
 * Test: Track Progress
 */
async function testTrackProgress() {
  console.log('\n=== Test: Track Progress ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'track_progress',
      arguments: {
        plan: SAMPLE_PLAN,
        completedTasks: ['task-1', 'task-2'],
        issues: [
          { taskId: 'task-3', issue: 'OT algorithm more complex than expected', severity: 'high' },
        ],
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Progress Tracking:');
    console.log(`  Progress: ${analysis.progressPercent}%`);
    console.log(`  Estimated Completion: ${analysis.estimatedCompletion}`);

    if (analysis.completedMilestones?.length > 0) {
      console.log('  Completed Milestones:');
      analysis.completedMilestones.forEach((milestone: string) => {
        console.log(`    ✓ ${milestone}`);
      });
    }

    if (analysis.blockers?.length > 0) {
      console.log('  Blockers:');
      analysis.blockers.forEach((blocker: any) => {
        console.log(`    - [${blocker.severity}] ${blocker.taskId}: ${blocker.blocker}`);
        console.log(`      Action: ${blocker.suggestedAction}`);
      });
    }

    if (analysis.recommendations?.length > 0) {
      console.log('  Recommendations:');
      analysis.recommendations.forEach((rec: string) => {
        console.log(`    - ${rec}`);
      });
    }
  } catch (error) {
    console.error('✗ Track progress failed:', error);
  }
}

/**
 * Test: Optimize Workflow
 */
async function testOptimizeWorkflow() {
  console.log('\n=== Test: Optimize Workflow ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'optimize_workflow',
      arguments: {
        plan: SAMPLE_PLAN,
        feedback: {
          performance: 'Task-3 taking longer than expected',
          constraints: 'One developer unavailable for 2 weeks',
          goals: 'Need to deliver MVP 2 weeks earlier',
        },
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Workflow Optimization:');

    if (analysis.changes?.length > 0) {
      console.log('  Changes Made:');
      analysis.changes.forEach((change: any) => {
        console.log(`    - ${change.change}`);
        console.log(`      Why: ${change.reasoning}`);
      });
    }

    if (analysis.expectedImpact?.length > 0) {
      console.log('  Expected Impact:');
      analysis.expectedImpact.forEach((impact: string) => {
        console.log(`    - ${impact}`);
      });
    }

    if (analysis.tradeoffs?.length > 0) {
      console.log('  Tradeoffs:');
      analysis.tradeoffs.forEach((tradeoff: string) => {
        console.log(`    - ${tradeoff}`);
      });
    }
  } catch (error) {
    console.error('✗ Optimize workflow failed:', error);
  }
}

/**
 * Cleanup
 */
function cleanup() {
  if (mcpProcess) {
    mcpProcess.kill();
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting Collaborative Planning MCP Tests...');

  try {
    await startMCPServer();
    console.log('✓ MCP server started');

    await testInitialize();
    await testListTools();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDecomposeTask();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testCoordinateAgents();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testOrchestrate();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testTrackProgress();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testOptimizeWorkflow();

    console.log('\n=== All Tests Complete ===');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    cleanup();
  }
}

runTests().catch(console.error);
