---
name: Workflow Subagents
description: Subagent delegation patterns and contextFiles requirements
type: global
inclusion: manual
priority: high
version: 2.0
lastUpdated: 2026-05-03
---

# Workflow - Subagent Delegation

## When to Delegate to Subagents

**Use subagents for:**
- Spec workflow execution (requirements-first, design-first, bugfix)
- Large context gathering tasks
- Complex multi-step operations
- Specialized workflows that need focused execution

**Don't delegate for:**
- Simple, direct tasks
- Single file changes
- Quick clarifications
- Tasks you can complete in current context

---

## Critical Rule: Always Pass Context Files

**MANDATORY**: When invoking subagents, ALWAYS include `contextFiles` parameter with relevant files.

**Why this matters:**
- Subagents start with empty context
- Without context files, they can't see spec documents, code, or previous work
- This causes them to ask redundant questions or make incorrect assumptions

**How to pass context:**

```typescript
invokeSubAgent({
  name: "spec-task-execution",
  prompt: "Execute task 3.1: Create Anthropic data model types",
  explanation: "Delegating task execution to specialized subagent",
  contextFiles: [
    { path: ".kiro/specs/claudeflow/requirements.md" },
    { path: ".kiro/specs/claudeflow/design.md" },
    { path: ".kiro/specs/claudeflow/tasks.md" },
    { path: "claudeflow/src/types/index.ts" }  // If relevant existing code
  ]
})
```

---

## Context Files Selection Guide

### For spec workflow subagents:

```
ALWAYS include:
├─ .kiro/specs/{feature-name}/requirements.md (or bugfix.md)
├─ .kiro/specs/{feature-name}/design.md
├─ .kiro/specs/{feature-name}/tasks.md
└─ .kiro/specs/{feature-name}/.config.kiro

OPTIONALLY include:
├─ Relevant existing code files
├─ Related configuration files
└─ Architecture documentation
```

### For task execution subagents:

```
ALWAYS include:
├─ All spec files (requirements, design, tasks)
├─ Files being modified
└─ Related test files

OPTIONALLY include:
├─ Similar components for reference
├─ Shared types/utilities
└─ Configuration files
```

### For context-gatherer subagent:

```
MINIMAL context:
├─ User's question/issue description
└─ Any specific files mentioned

Let the subagent discover the rest
```

---

## Example: Correct Subagent Invocation

```typescript
// ✅ CORRECT - Includes context files
await invokeSubAgent({
  name: "feature-requirements-first-workflow",
  preset: "requirements",
  prompt: `Continue with ClaudeFlow spec.
  
  Feature: Intelligent API router for Anthropic Claude models
  Current phase: Requirements document created, need design next`,
  
  explanation: "Delegating to requirements-first workflow subagent to create design document",
  
  contextFiles: [
    { path: ".kiro/specs/claudeflow/requirements.md" },
    { path: ".kiro/specs/claudeflow/.config.kiro" },
    { path: "claudeflow/package.json" },
    { path: "claudeflow/tsconfig.json" }
  ]
})

// ❌ WRONG - No context files
await invokeSubAgent({
  name: "feature-requirements-first-workflow",
  preset: "requirements",
  prompt: "Continue with ClaudeFlow spec",
  explanation: "Delegating to workflow subagent"
  // Missing contextFiles!
})
```

---

## Context File Line Ranges

**When to use line ranges:**

```typescript
// For large files, include only relevant sections
contextFiles: [
  { 
    path: ".kiro/specs/claudeflow/design.md",
    startLine: 100,
    endLine: 300
  }
]

// For complete context, omit line ranges
contextFiles: [
  { path: ".kiro/specs/claudeflow/requirements.md" }
]
```

**Default behavior:**
- If no line range specified → Include entire file
- Prefer full files unless file is very large (>2000 lines)

---

## Subagent Response Handling

**After subagent completes:**

1. **Check for success/failure**
   - Did subagent complete the task?
   - Were there any errors?

2. **Extract key information**
   - What files were created/modified?
   - What decisions were made?
   - Are there follow-up actions needed?

3. **Report to user**
   - Summarize what subagent accomplished
   - Highlight any issues or blockers
   - Suggest next steps

**Example:**
```
✅ Subagent completed design document creation

Summary:
├─ Created: .kiro/specs/claudeflow/design.md
├─ Components designed: 14 core components
├─ Architecture: Pipeline pattern with middleware
└─ Time: 5 minutes

Next steps:
└─ Ready to proceed with task implementation (Phase 2)

Would you like to continue with task execution?
```

---

## Common Mistakes to Avoid

**❌ Don't:**
- Invoke subagent without contextFiles
- Pass only partial context (missing spec files)
- Forget to include .config.kiro file
- Pass too many irrelevant files (noise)
- Use subagents for simple tasks

**✅ Do:**
- Always include all relevant spec files
- Include existing code being modified
- Keep context focused and relevant
- Use subagents for complex workflows
- Handle subagent responses properly

---

## Debugging Context Issues

**If subagent asks redundant questions:**
```
Problem: Subagent doesn't have context
Solution: Check if contextFiles were passed
Fix: Re-invoke with proper contextFiles
```

**If subagent makes wrong assumptions:**
```
Problem: Missing critical context files
Solution: Review what files were passed
Fix: Add missing spec/code files to contextFiles
```

**If subagent can't find files:**
```
Problem: Incorrect file paths in contextFiles
Solution: Verify paths are relative to workspace root
Fix: Correct the file paths and re-invoke
```

---

## Subagent Workflow Integration

```
1. CLARIFY → Ask until 100% clear
2. SEARCH → Get complete context using intelligent-context MCP
3. DETECT → Find issues automatically using predictive-analysis MCP
4. PLAN → Create detailed plan using sequential-thinking MCP
5. APPROVE → Wait for explicit "yes"
6. EXECUTE → Use Powers & Skills
   ├─ For complex workflows: Delegate to subagent WITH contextFiles
   ├─ For simple tasks: Execute directly
   └─ Always pass relevant context when delegating
7. VALIDATE → Test everything
8. ARCHIVE → Update memory using adaptive-memory MCP
9. REPORT → Show results and next steps
```

**Critical reminder: ALWAYS pass contextFiles when invoking subagents!**

---

## Available Subagents

### general-task-execution
**Purpose**: General-purpose sub-agent with access to all tools
**Use for**: Arbitrary tasks, parallel work streams
**Context needed**: Task description + relevant files

### context-gatherer
**Purpose**: Analyzes repository structure to identify relevant files
**Use for**: Repository understanding, bug investigation, component interaction analysis
**Context needed**: Minimal - user's question + specific files mentioned
**When to use**: ONCE per query at the beginning, before making changes

### custom-agent-creator
**Purpose**: Create and configure new custom agents
**Use for**: Defining specialized agents for recurring task patterns
**Context needed**: Agent requirements and specifications

---

## Best Practices

1. **Use context-gatherer first** - When starting work on unfamiliar codebase
2. **Pass complete context** - Include all relevant spec and code files
3. **Don't overuse** - Simple tasks don't need subagents
4. **Trust output** - Avoid redundantly re-reading files they analyzed
5. **Proactive usage** - Use based on task type, not just when requested
6. **Only in Autopilot** - Sub-agents are only available in Autopilot mode

---

## Example Workflows

### Example 1: Spec Task Execution

```typescript
// User: "Continue with task 3.1 in ClaudeFlow spec"

// Step 1: Gather context files
const contextFiles = [
  { path: ".kiro/specs/claudeflow/requirements.md" },
  { path: ".kiro/specs/claudeflow/design.md" },
  { path: ".kiro/specs/claudeflow/tasks.md" },
  { path: ".kiro/specs/claudeflow/.config.kiro" },
  { path: "claudeflow/src/types/index.ts" }
];

// Step 2: Invoke subagent
await invokeSubAgent({
  name: "spec-task-execution",
  prompt: "Execute task 3.1: Create Anthropic data model types",
  explanation: "Delegating task execution to specialized subagent",
  contextFiles: contextFiles
});

// Step 3: Handle response
// - Check if task completed
// - Report to user
// - Suggest next steps
```

### Example 2: Bug Investigation

```typescript
// User: "Fix the login bug"

// Step 1: Use context-gatherer first
await invokeSubAgent({
  name: "context-gatherer",
  prompt: "Investigate login bug - find all related auth files and components",
  explanation: "Using context-gatherer to identify relevant files before fixing",
  contextFiles: [
    // Minimal context - let it discover
  ]
});

// Step 2: Review gathered context
// Step 3: Fix the bug with full context
```

### Example 3: Complex Feature

```typescript
// User: "Add OAuth authentication"

// Step 1: Use context-gatherer
await invokeSubAgent({
  name: "context-gatherer",
  prompt: "Find existing auth system and identify integration points for OAuth",
  explanation: "Gathering context for OAuth integration",
  contextFiles: []
});

// Step 2: Plan with gathered context
// Step 3: Execute with full understanding
```

---

## Summary

**Key Points:**
1. Always pass contextFiles when invoking subagents
2. Include all relevant spec files and code
3. Use context-gatherer for unfamiliar codebases
4. Trust subagent output, don't redundantly verify
5. Only use subagents for complex tasks
6. Handle responses properly and report to user

**Result**: Efficient delegation with complete context and proper coordination.

