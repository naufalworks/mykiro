---
name: MCP Powers Skills Integration (Corrected)
description: Actual MCP servers and tools available in this Kiro instance
type: global
inclusion: always
priority: critical
---

# MCP, Powers & Skills Integration - CORRECTED

## Overview

This file defines the **ACTUAL** MCP servers installed and how to use them.

---

## Installed MCP Servers

### 1. Sequential Thinking (`sequential-thinking`)

**Tool**: `mcp_sequential_thinking_sequentialthinking`

**Purpose**: Multi-step reasoning and planning with revision capability

**When to Use**: 
- Before ANY complex code change
- When planning multi-step solutions
- When you need to revise your thinking
- For impact analysis

**How to Use**:
```typescript
// Start thinking process
mcp_sequential_thinking_sequentialthinking({
  thought: "Analyzing current auth system structure...",
  thoughtNumber: 1,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  isRevision: false
})

// Continue with next thought
mcp_sequential_thinking_sequentialthinking({
  thought: "Identified 3 main responsibilities that should be separated...",
  thoughtNumber: 2,
  totalThoughts: 5,
  nextThoughtNeeded: true,
  isRevision: false
})

// Revise if needed
mcp_sequential_thinking_sequentialthinking({
  thought: "Wait, I need to reconsider the token management approach...",
  thoughtNumber: 3,
  totalThoughts: 6, // Adjusted total
  nextThoughtNeeded: true,
  isRevision: true,
  revisesThought: 2
})
```

**Example Workflow**:
```
User: "Refactor the auth system"

Step 1: Use sequential thinking to plan
├─ Thought 1: Analyze current state
├─ Thought 2: Identify problems
├─ Thought 3: Design solution
├─ Thought 4: Assess impact
└─ Thought 5: Create execution plan

Step 2: Present plan to user
Step 3: Wait for approval
Step 4: Execute
```

---

### 2. Intelligent Context (`intelligent-context`)

**Tools**:
- `mcp_intelligent_context_intelligent_search` - AI-powered semantic search
- `mcp_intelligent_context_search_context` - Fast basic search
- `mcp_intelligent_context_find_similar` - Find similar code
- `mcp_intelligent_context_extract_patterns` - Learn from search history

**Purpose**: Fast context retrieval with semantic understanding

**When to Use**:
- After clarifying requirements
- Before planning implementation
- When looking for existing patterns
- When searching for similar past work

**How to Use**:
```typescript
// AI-powered search (use for complex queries)
mcp_intelligent_context_intelligent_search({
  query: "authentication token validation with JWT",
  limit: 5
})

// Fast search (use for simple lookups)
mcp_intelligent_context_search_context({
  query: "login button component",
  limit: 5
})

// Find similar code
mcp_intelligent_context_find_similar({
  code_or_description: "async function that handles user login with error handling",
  limit: 3
})

// Extract patterns from search history
mcp_intelligent_context_extract_patterns({})
```

**Example Workflow**:
```
User: "Add logout button"

Step 1: Clarify requirements
Step 2: Search for context
├─ intelligent_search("logout button navigation patterns")
├─ find_similar("login button component")
└─ Assemble context

Step 3: Plan with context
Step 4: Execute
```

---

### 3. Adaptive Memory (`adaptive-memory`)

**Tools**:
- `mcp_adaptive_memory_store_memory` - Store tasks/issues/context
- `mcp_adaptive_memory_retrieve_memory` - Retrieve with AI understanding
- `mcp_adaptive_memory_organize_memories` - Auto-organize and cluster

**Purpose**: Track everything forever with intelligent recall

**When to Use**:
- When task completes (store automatically)
- When issue detected (store automatically)
- When user asks "what did we do..." (retrieve)
- Weekly for organization (organize)

**How to Use**:
```typescript
// Store a completed task
mcp_adaptive_memory_store_memory({
  type: "task",
  content: "Created LoginButton component with loading state and error handling. Files: LoginButton.tsx, LoginButton.types.ts, LoginButton.test.tsx. Tests: 4 passing.",
  priority: "medium",
  tags: ["ui", "auth", "component", "react"]
})

// Store an issue
mcp_adaptive_memory_store_memory({
  type: "issue",
  content: "SQL injection vulnerability in UserService.ts line 89. String concatenation in query. Needs parameterized queries.",
  priority: "critical",
  tags: ["security", "sql", "vulnerability"]
})

// Retrieve memories
mcp_adaptive_memory_retrieve_memory({
  query: "auth issues from last month",
  limit: 5
})

// Organize memories (weekly)
mcp_adaptive_memory_organize_memories({})
```

**Auto-Store Rules**:
```
ALWAYS store when:
├─ Task completes successfully
├─ Issue detected (any priority)
├─ Pattern identified
└─ User explicitly asks to remember

NEVER store:
├─ Failed attempts
├─ Temporary debugging
└─ User says "don't track this"
```

---

### 4. Predictive Analysis (`predictive-analysis`)

**Tools**:
- `mcp_predictive_analysis_predict_impact` - Predict what will break
- `mcp_predictive_analysis_analyze_security` - Deep security scan
- `mcp_predictive_analysis_predict_performance` - Performance analysis
- `mcp_predictive_analysis_validate_architecture` - Architecture validation

**Purpose**: Detect issues before they happen

**When to Use**:
- During planning phase (before execution)
- When modifying critical code
- Before refactoring
- When user asks for impact analysis

**How to Use**:
```typescript
// Predict impact of changes
mcp_predictive_analysis_predict_impact({
  code: "// Current AuthService code...",
  change: "// Proposed refactored code..."
})

// Security analysis
mcp_predictive_analysis_analyze_security({
  code: "// Code to analyze...",
  context: "User authentication endpoint"
})

// Performance prediction
mcp_predictive_analysis_predict_performance({
  code: "// Code to analyze...",
  context: "High-traffic API endpoint"
})

// Architecture validation
mcp_predictive_analysis_validate_architecture({
  code: "// Code to validate...",
  patterns: ["MVC", "Repository Pattern"]
})
```

**Example Workflow**:
```
User: "Refactor auth system"

Step 1: Sequential thinking (plan)
Step 2: Predictive analysis
├─ analyze_security(current code)
├─ predict_impact(current vs proposed)
├─ predict_performance(proposed code)
└─ validate_architecture(proposed code)

Step 3: Report findings
Step 4: Get approval
Step 5: Execute
```

---

### 5. Filesystem MCP (Global & Workspace)

**Tools**:
- `mcp_filesystem_global_read_text_file` - Read file contents
- `mcp_filesystem_global_read_multiple_files` - Read multiple files at once
- `mcp_filesystem_global_list_directory` - List directory contents
- `mcp_filesystem_global_search_files` - Search for files by pattern
- `mcp_filesystem_global_get_file_info` - Get file metadata
- `mcp_filesystem_global_directory_tree` - Get directory tree structure

**Purpose**: Reliable file operations with better error handling

**When to Use**:
- **ALWAYS** when reading files (Phase 2, Phase 6)
- **PREFER** over built-in readFile, readMultipleFiles, listDirectory
- When file operations are failing with built-in tools

**How to Use**:
```typescript
// Read a single file
mcp_filesystem_global_read_text_file({
  path: "/Users/username/.kiro/settings/mcp.json"
})

// Read multiple files
mcp_filesystem_global_read_multiple_files({
  paths: [
    "/path/to/file1.md",
    "/path/to/file2.md"
  ]
})

// List directory
mcp_filesystem_global_list_directory({
  path: "/Users/username/.kiro"
})

// Search for files
mcp_filesystem_global_search_files({
  path: "/Users/username/workspace",
  pattern: "*.md"
})
```

**Configuration**:
- **Global**: `filesystem-global` - Restricted to `~/.kiro`
- **Workspace**: `filesystem-workspace` - Restricted to workspace directory

**Security**: Read-only operations in autoApprove. Write operations require confirmation.

---

## Complete Workflow Integration

### Example: "Add logout button"

```
═══════════════════════════════════════════════════════════════

PHASE 1: CLARIFICATION
└─ Ask questions until 100% clear

PHASE 2: CONTEXT GATHERING
├─ Use: mcp_intelligent_context_intelligent_search
├─ Query: "logout button navigation confirmation patterns"
└─ Result: Found similar LoginButton, useAuth hook

PHASE 3: ISSUE DETECTION
├─ Use: mcp_predictive_analysis_analyze_security
├─ Scan: Current auth system
└─ Report: No critical issues found

PHASE 4: PLANNING
├─ Use: mcp_sequential_thinking_sequentialthinking
├─ Thought 1: Analyze current state
├─ Thought 2: Design solution
├─ Thought 3: Assess impact
├─ Thought 4: Create execution plan
└─ Present plan to user

PHASE 5: APPROVAL
└─ Wait for explicit "yes"

PHASE 6: EXECUTION
├─ Create LogoutButton.tsx
├─ Create LogoutButton.types.ts
├─ Create LogoutButton.test.tsx
└─ Update exports

PHASE 7: VALIDATION
├─ Run tests
├─ Check types
├─ Run linter
└─ Report results

PHASE 8: COMPLETION
├─ Use: mcp_adaptive_memory_store_memory
├─ Store: Task completion with details
└─ Report success

═══════════════════════════════════════════════════════════════
```

---

## Powers (Via MCP)

### Context7 Power

**Available via**: `power-context7-context7` MCP server

**Purpose**: Search documentation for libraries and frameworks

**When to Use**:
- User asks "How do I use [library]?"
- Need API documentation
- Learning new framework

**How to Use**:
```typescript
// Activate the power first
kiroPowers({
  action: "activate",
  powerName: "context7"
})

// Then use its tools (will be shown in activation response)
kiroPowers({
  action: "use",
  powerName: "context7",
  serverName: "context7",
  toolName: "search_docs", // Example - check actual tool names
  arguments: { query: "React Query mutations" }
})
```

---

## Skills (Built-in Commands)

**Note**: Skills like `/lint`, `/test`, `/refactor` are **conceptual** in your steering files. They represent actions you should take, not actual commands.

**How to interpret**:
- `/lint` → Run `npm run lint` or equivalent
- `/test` → Run `npm test` or equivalent
- `/refactor` → Use sequential thinking + predictive analysis
- `/document` → Generate JSDoc comments
- `/commit` → Create git commit with conventional format

---

## Key Principles

1. **Use Sequential Thinking for Planning** - Always before complex changes
2. **Use Intelligent Context for Search** - After clarification, before planning
3. **Use Adaptive Memory for Tracking** - Store all completed work and issues
4. **Use Predictive Analysis for Safety** - Check security and impact during planning
5. **Use Collaborative Planning for Complex Tasks** - Break down and coordinate

---

## When to Use Each MCP

| Phase | MCP Server | Tool |
|-------|-----------|------|
| Clarification | - | Ask questions |
| Context Gathering | intelligent-context | intelligent_search |
| Context Gathering | filesystem | read_text_file, list_directory |
| Issue Detection | predictive-analysis | analyze_security |
| Planning | sequential-thinking | sequentialthinking |
| Impact Analysis | predictive-analysis | predict_impact |
| Execution (Read) | filesystem | read_text_file, list_directory |
| Execution (Write) | - | fsWrite, strReplace (built-in) |
| Validation | - | Run tests |
| Completion | adaptive-memory | store_memory |

---

## Critical Rules

1. **ALWAYS use sequential thinking before complex changes**
2. **ALWAYS search for context before planning**
3. **ALWAYS store completed tasks in memory**
4. **ALWAYS analyze security for auth/data changes**
5. **ALWAYS wait for approval before execution**

---

## Troubleshooting

### If MCP tool fails:
1. Check if server is running (mcp.json)
2. Check tool name is correct
3. Check required parameters
4. Fall back to manual process
5. Report issue to user

### If unsure which MCP to use:
1. Planning → sequential-thinking
2. Search → intelligent-context
3. Security → predictive-analysis
4. Memory → adaptive-memory
5. Complex tasks → collaborative-planning

---

## Summary

**You have 5 powerful MCP servers installed:**

✅ **sequential-thinking** - Multi-step planning with revision
✅ **intelligent-context** - AI-powered semantic search
✅ **adaptive-memory** - Forever memory with intelligent recall
✅ **predictive-analysis** - Security, performance, impact analysis
✅ **filesystem** - Reliable file operations with better error handling

**Use them in this order:**
1. Clarify → 2. Search (intelligent-context + filesystem) → 3. Detect (predictive-analysis) → 4. Plan (sequential-thinking) → 5. Approve → 6. Execute (filesystem for read, built-in for write) → 7. Validate → 8. Store (adaptive-memory)

**Result**: Professional, intelligent, safe development workflow
