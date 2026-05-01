#!/usr/bin/env node
/**
 * Test suite for Predictive Analysis MCP
 */

import 'dotenv/config';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample code for testing
const SAMPLE_CODE = `
function processUserData(userId: string) {
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  const result = db.execute(query);
  return result;
}
`;

const PROPOSED_CHANGE = `
function processUserData(userId: string) {
  const query = "SELECT * FROM users WHERE id = ?";
  const result = db.execute(query, [userId]);
  return result;
}
`;

const PERFORMANCE_CODE = `
function findUsers(filters: any) {
  const allUsers = db.query("SELECT * FROM users");
  return allUsers.filter(user => {
    return Object.keys(filters).every(key => user[key] === filters[key]);
  });
}
`;

const ARCHITECTURE_CODE = `
class UserService {
  constructor(private db: Database, private cache: Cache, private logger: Logger) {}

  async getUser(id: string) {
    const cached = await this.cache.get(id);
    if (cached) return cached;

    const user = await this.db.query("SELECT * FROM users WHERE id = ?", [id]);
    await this.cache.set(id, user);
    return user;
  }
}
`;

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
 * Test: Predict Impact
 */
async function testPredictImpact() {
  console.log('\n=== Test: Predict Impact ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'predict_impact',
      arguments: {
        code: SAMPLE_CODE,
        change: PROPOSED_CHANGE,
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Impact Analysis:');
    console.log(`  Risk Level: ${analysis.riskLevel}`);
    console.log(`  Affected Files: ${analysis.affectedFiles?.length || 0}`);
    console.log(`  Breaking Changes: ${analysis.breakingChanges?.length || 0}`);
    console.log(`  Estimated Effort: ${analysis.estimatedEffort}`);

    if (analysis.recommendations?.length > 0) {
      console.log('  Recommendations:');
      analysis.recommendations.forEach((rec: string) => {
        console.log(`    - ${rec}`);
      });
    }
  } catch (error) {
    console.error('✗ Predict impact failed:', error);
  }
}

/**
 * Test: Analyze Security
 */
async function testAnalyzeSecurity() {
  console.log('\n=== Test: Analyze Security ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'analyze_security',
      arguments: {
        code: SAMPLE_CODE,
        context: 'User authentication system',
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Security Analysis:');
    console.log(`  Security Score: ${analysis.securityScore}/100`);
    console.log(`  Vulnerabilities Found: ${analysis.vulnerabilities?.length || 0}`);

    if (analysis.vulnerabilities?.length > 0) {
      console.log('  Critical Issues:');
      analysis.vulnerabilities.forEach((vuln: any) => {
        console.log(`    - [${vuln.severity}] ${vuln.type}: ${vuln.description}`);
      });
    }

    if (analysis.complianceIssues?.length > 0) {
      console.log('  Compliance Issues:');
      analysis.complianceIssues.forEach((issue: string) => {
        console.log(`    - ${issue}`);
      });
    }
  } catch (error) {
    console.error('✗ Analyze security failed:', error);
  }
}

/**
 * Test: Predict Performance
 */
async function testPredictPerformance() {
  console.log('\n=== Test: Predict Performance ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'predict_performance',
      arguments: {
        code: PERFORMANCE_CODE,
        context: 'High-traffic API endpoint',
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Performance Analysis:');
    console.log(`  Performance Score: ${analysis.performanceScore}/100`);
    console.log(`  Complexity: ${analysis.complexity}`);
    console.log(`  Scalability: ${analysis.scalability}`);

    if (analysis.bottlenecks?.length > 0) {
      console.log('  Bottlenecks:');
      analysis.bottlenecks.forEach((bottleneck: any) => {
        console.log(`    - ${bottleneck.location}: ${bottleneck.issue}`);
        console.log(`      Impact: ${bottleneck.impact}`);
        console.log(`      Fix: ${bottleneck.fix}`);
      });
    }

    if (analysis.optimizations?.length > 0) {
      console.log('  Optimizations:');
      analysis.optimizations.forEach((opt: string) => {
        console.log(`    - ${opt}`);
      });
    }
  } catch (error) {
    console.error('✗ Predict performance failed:', error);
  }
}

/**
 * Test: Validate Architecture
 */
async function testValidateArchitecture() {
  console.log('\n=== Test: Validate Architecture ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'validate_architecture',
      arguments: {
        code: ARCHITECTURE_CODE,
        patterns: ['Dependency Injection', 'Repository Pattern', 'Caching'],
      },
    });

    const analysis = JSON.parse(result.content[0].text);
    console.log('✓ Architecture Analysis:');
    console.log(`  Cohesion Score: ${analysis.cohesionScore}/100`);
    console.log(`  Maintainability Score: ${analysis.maintainabilityScore}/100`);

    if (analysis.violations?.length > 0) {
      console.log('  Pattern Violations:');
      analysis.violations.forEach((violation: any) => {
        console.log(`    - ${violation.pattern}: ${violation.issue}`);
        console.log(`      Fix: ${violation.fix}`);
      });
    }

    if (analysis.couplingIssues?.length > 0) {
      console.log('  Coupling Issues:');
      analysis.couplingIssues.forEach((issue: string) => {
        console.log(`    - ${issue}`);
      });
    }

    if (analysis.recommendations?.length > 0) {
      console.log('  Recommendations:');
      analysis.recommendations.forEach((rec: string) => {
        console.log(`    - ${rec}`);
      });
    }
  } catch (error) {
    console.error('✗ Validate architecture failed:', error);
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
  console.log('Starting Predictive Analysis MCP Tests...');

  try {
    await startMCPServer();
    console.log('✓ MCP server started');

    await testInitialize();
    await testListTools();

    await new Promise(resolve => setTimeout(resolve, 1000));
    await testPredictImpact();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testAnalyzeSecurity();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testPredictPerformance();

    await new Promise(resolve => setTimeout(resolve, 2000));
    await testValidateArchitecture();

    console.log('\n=== All Tests Complete ===');
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    cleanup();
  }
}

runTests().catch(console.error);
