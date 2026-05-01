# API Reference - Kiro Intelligent MCP Suite

Complete reference for all 16 AI-powered tools across 4 MCP servers.

---

## Intelligent Context MCP

### intelligent_search

AI-powered semantic search with multi-hop reasoning to find related concepts.

**Input:**
```typescript
{
  query: string;        // Search query
  depth?: number;       // Reasoning depth (1-3, default: 2)
  maxResults?: number;  // Max results (default: 10)
}
```

**Output:**
```typescript
{
  results: Array<{
    content: string;
    score: number;
    metadata: object;
  }>;
  reasoning: string;
  relatedConcepts: string[];
  confidence: number;
}
```

**Example:**
```typescript
{
  "query": "user authentication and session management",
  "depth": 3,
  "maxResults": 10
}
```

---

### search_context

Find related code and documentation for a given context.

**Input:**
```typescript
{
  context: string;      // Context to search
  includeCode?: boolean;    // Include code snippets (default: true)
  includeDocs?: boolean;    // Include documentation (default: true)
}
```

**Output:**
```typescript
{
  code: Array<{file: string, snippet: string, relevance: number}>;
  documentation: Array<{title: string, content: string}>;
  summary: string;
}
```

---

### find_similar

Locate similar code patterns in the codebase.

**Input:**
```typescript
{
  code: string;         // Code snippet to match
  threshold?: number;   // Similarity threshold (0-1, default: 0.7)
}
```

**Output:**
```typescript
{
  matches: Array<{
    file: string;
    code: string;
    similarity: number;
    explanation: string;
  }>;
}
```

---

### extract_patterns

Identify architectural patterns and design principles.

**Input:**
```typescript
{
  code: string;         // Code to analyze
  context?: string;     // Additional context
}
```

**Output:**
```typescript
{
  patterns: Array<{
    name: string;
    description: string;
    examples: string[];
  }>;
  principles: string[];
  recommendations: string[];
}
```

---

## Adaptive Memory MCP

### store_memory

Save information with AI-powered metadata generation.

**Input:**
```typescript
{
  content: string;      // Content to store
  context?: string;     // Current work context
}
```

**Output:**
```typescript
{
  id: string;
  tags: string[];       // AI-generated tags
  priority: number;     // AI-assigned priority (0-100)
  cluster: string;      // AI-assigned cluster
  relatedIds: string[]; // Related memory IDs
}
```

**Example:**
```typescript
{
  "content": "API rate limit is 1000 requests per minute, resets at midnight UTC",
  "context": "Working on payment service API client"
}
```

---

### retrieve_memory

Context-aware memory search.

**Input:**
```typescript
{
  query: string;        // Search query
  context?: string;     // Current context
  limit?: number;       // Max results (default: 10)
}
```

**Output:**
```typescript
{
  memories: Array<{
    id: string;
    content: string;
    relevance: number;
    tags: string[];
    accessed: number;
  }>;
  suggestions: string[];
}
```

---

### organize_memories

AI-driven memory organization and clustering.

**Input:**
```typescript
{
  strategy?: 'cluster' | 'priority' | 'temporal';  // Organization strategy
}
```

**Output:**
```typescript
{
  clusters: Array<{
    name: string;
    memoryIds: string[];
    theme: string;
  }>;
  archived: string[];   // Low-priority memories archived
  recommendations: string[];
}
```

---

## Predictive Analysis MCP

### predict_impact

Analyze the impact of code changes.

**Input:**
```typescript
{
  code: string;         // Current code
  change: string;       // Proposed change
}
```

**Output:**
```typescript
{
  affectedFiles: string[];
  breakingChanges: string[];
  testUpdates: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  estimatedEffort: string;
}
```

**Example:**
```typescript
{
  "code": "function login(user, pass) { ... }",
  "change": "Add OAuth2 support"
}
```

---

### analyze_security

Deep security analysis with vulnerability detection.

**Input:**
```typescript
{
  code: string;         // Code to analyze
  context?: string;     // Security context
}
```

**Output:**
```typescript
{
  vulnerabilities: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location: string;
    fix: string;
  }>;
  securityScore: number;  // 0-100 (100 = most secure)
  recommendations: string[];
  complianceIssues: string[];  // OWASP, CWE violations
}
```

---

### predict_performance

Predict performance issues and bottlenecks.

**Input:**
```typescript
{
  code: string;         // Code to analyze
  context?: string;     // Usage context (e.g., "high-traffic API")
}
```

**Output:**
```typescript
{
  bottlenecks: Array<{
    location: string;
    issue: string;
    impact: string;
    fix: string;
  }>;
  complexity: string;   // Time/space complexity
  scalability: string;
  optimizations: string[];
  performanceScore: number;  // 0-100 (100 = best)
}
```

---

### validate_architecture

Validate architecture and design patterns.

**Input:**
```typescript
{
  code: string;         // Code to validate
  patterns?: string[];  // Expected patterns (optional)
}
```

**Output:**
```typescript
{
  violations: Array<{
    pattern: string;
    issue: string;
    fix: string;
  }>;
  couplingIssues: string[];
  cohesionScore: number;        // 0-100
  maintainabilityScore: number; // 0-100
  recommendations: string[];
}
```

---

## Collaborative Planning MCP

### decompose_task

Break down complex tasks into manageable subtasks.

**Input:**
```typescript
{
  task: string;         // Complex task description
  context?: string;     // Project context
}
```

**Output:**
```typescript
{
  subtasks: Array<{
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    dependencies: string[];  // Task IDs
    priority: 'high' | 'medium' | 'low';
    skills: string[];
  }>;
  criticalPath: string[];  // Task IDs on critical path
  parallelizable: string[][];  // Tasks that can run in parallel
  totalEstimate: string;
  risks: Array<{risk: string, mitigation: string}>;
}
```

**Example:**
```typescript
{
  "task": "Build real-time collaborative code editor",
  "context": "Team of 5 developers, 3-month timeline"
}
```

---

### coordinate_agents

Assign tasks to specialized agents.

**Input:**
```typescript
{
  tasks: Array<{id, title, skills}>;
  availableAgents?: string[];  // Agent types available
}
```

**Output:**
```typescript
{
  assignments: Array<{
    taskId: string;
    agentType: string;
    reasoning: string;
    estimatedStart: string;
    estimatedEnd: string;
  }>;
  agentTypes: Array<{type: string, count: number, skills: string[]}>;
  bottlenecks: string[];
  optimizations: string[];
  timeline: Array<{agent: string, tasks: Array<{taskId, start, end}>}>;
}
```

---

### orchestrate_workflow

Plan workflow execution order and manage dependencies.

**Input:**
```typescript
{
  plan: object;         // Workflow plan from decompose_task
  currentState?: object;  // Current execution state
}
```

**Output:**
```typescript
{
  executionOrder: string[];  // Ordered task IDs
  readyTasks: string[];      // Tasks ready to start now
  blockedTasks: Array<{taskId: string, blockedBy: string[]}>;
  nextActions: string[];
  checkpoints: Array<{
    milestone: string;
    tasks: string[];
    criteria: string;
  }>;
}
```

---

### track_progress

Monitor progress and identify blockers.

**Input:**
```typescript
{
  plan: object;         // Original plan
  completedTasks: string[];  // Completed task IDs
  issues?: Array<{taskId, issue, severity}>;
}
```

**Output:**
```typescript
{
  progressPercent: number;
  completedMilestones: string[];
  blockers: Array<{
    taskId: string;
    blocker: string;
    severity: 'high' | 'medium' | 'low';
    suggestedAction: string;
  }>;
  atRisk: Array<{taskId: string, reason: string, impact: string}>;
  recommendations: string[];
  estimatedCompletion: string;
}
```

---

### optimize_workflow

Improve workflow based on feedback.

**Input:**
```typescript
{
  plan: object;         // Current plan
  feedback: object;     // Performance, issues, constraints
}
```

**Output:**
```typescript
{
  optimizedPlan: object;  // Updated plan
  changes: Array<{change: string, reasoning: string}>;
  expectedImpact: string[];
  tradeoffs: string[];
  alternativeApproaches: Array<{
    approach: string;
    pros: string[];
    cons: string[];
  }>;
}
```

---

## Response Times

| Tool | First Call | Cached |
|------|-----------|--------|
| intelligent_search | 2-5s | <500ms |
| search_context | 1-3s | <300ms |
| find_similar | 1-2s | <200ms |
| extract_patterns | 2-4s | <500ms |
| store_memory | 1-2s | N/A |
| retrieve_memory | 500ms-1s | <100ms |
| organize_memories | 3-5s | N/A |
| predict_impact | 3-5s | 1-2s |
| analyze_security | 3-8s | 1-2s |
| predict_performance | 3-8s | 1-2s |
| validate_architecture | 3-8s | 1-2s |
| decompose_task | 5-15s | 2-3s |
| coordinate_agents | 3-8s | 1-2s |
| orchestrate_workflow | 2-5s | 1-2s |
| track_progress | 2-4s | 1-2s |
| optimize_workflow | 5-10s | 2-3s |

---

## Error Handling

All tools return errors in this format:

```typescript
{
  error: string;
  code: string;
  details?: object;
}
```

Common error codes:
- `INVALID_INPUT` - Invalid parameters
- `API_ERROR` - AI model API error
- `TIMEOUT` - Request timeout
- `RATE_LIMIT` - Rate limit exceeded
- `SERVICE_UNAVAILABLE` - Infrastructure service down

---

## Best Practices

1. **Use appropriate depth**: Higher depth = more thorough but slower
2. **Cache results**: Most tools cache responses for 1 hour
3. **Batch related queries**: Combine similar queries when possible
4. **Provide context**: More context = better AI reasoning
5. **Handle errors gracefully**: Always check for error responses

---

**Last Updated**: 2026-05-02
