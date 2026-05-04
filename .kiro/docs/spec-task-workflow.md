# Spec Task Workflow Guide

## Overview

This guide provides comprehensive documentation on the **per-task workflow requirement** for spec execution. When executing specs with multiple tasks, each task MUST go through the complete workflow phases 2-8 before execution.

**Critical Rule**: EACH TASK = FULL WORKFLOW

---

## Table of Contents

1. [Why Per-Task Workflow Matters](#why-per-task-workflow-matters)
2. [The 8-Phase Workflow](#the-8-phase-workflow)
3. [Correct vs Incorrect Patterns](#correct-vs-incorrect-patterns)
4. [Phase-by-Phase Guide](#phase-by-phase-guide)
5. [Common Mistakes](#common-mistakes)
6. [Troubleshooting](#troubleshooting)
7. [Examples](#examples)

---

## Why Per-Task Workflow Matters

### The Problem

When executing a spec with multiple tasks, there's a tendency to treat the workflow phases as a one-time setup that applies to the entire spec. This leads to:

- **Task 1**: Gets full workflow (Search, Detect, Plan, Approve)
- **Task 2**: Executes directly WITHOUT workflow phases ❌
- **Task 3**: Executes directly WITHOUT workflow phases ❌

### The Consequences

Skipping workflow phases for tasks 2, 3, 4, etc. causes:

1. **Security Vulnerabilities**: No security analysis means vulnerabilities slip through
2. **Missed Patterns**: No context search means duplicating existing code
3. **Suboptimal Approaches**: No planning means using inefficient solutions
4. **No User Control**: No approval means user can't review before execution
5. **Lost Knowledge**: No archiving means memory system doesn't learn

### The Solution

**Each task is independent and requires the full workflow:**

```
Task 1 → Search → Detect → Plan → Approve → Execute → Validate → Archive
Task 2 → Search → Detect → Plan → Approve → Execute → Validate → Archive
Task 3 → Search → Detect → Plan → Approve → Execute → Validate → Archive
```

---

## The 8-Phase Workflow

### Phase 1: Clarify (If Needed)
- **Goal**: Ensure task requirements are 100% clear
- **Action**: Ask questions if anything is unclear
- **When**: Only if task description is ambiguous
- **Output**: Crystal clear understanding of what to build

### Phase 2: Search (MANDATORY)
- **Goal**: Find relevant context for THIS specific task
- **Action**: Call `mcp_intelligent_context_intelligent_search`
- **Query**: Context specific to THIS task (not generic)
- **Output**: Existing code, patterns, dependencies relevant to THIS task

**Example queries:**
- Task: "Create LoginButton" → Query: "button components with loading states and error handling"
- Task: "Add API endpoint" → Query: "API endpoint patterns with authentication and validation"
- Task: "Write tests" → Query: "test patterns for React components with async operations"

### Phase 3: Detect (MANDATORY)
- **Goal**: Find potential issues BEFORE planning
- **Action**: Call `mcp_predictive_analysis_analyze_security`
- **Analyze**: Code relevant to THIS task
- **Output**: Security, performance, and architecture issues

**What to analyze:**
- Existing code that will be modified
- Similar code that provides context
- Dependencies that will be used

### Phase 4: Plan (MANDATORY)
- **Goal**: Create detailed, reviewable plan for THIS task
- **Action**: Call `mcp_sequential_thinking_sequentialthinking`
- **Create**: Step-by-step execution plan
- **Output**: Detailed plan with files, changes, risks, impact

**Plan should include:**
- Files to create/modify
- Approach and reasoning
- Potential risks
- Impact on existing code
- Testing strategy

### Phase 5: Approve (MANDATORY)
- **Goal**: Get explicit user approval for THIS task
- **Action**: Present plan and wait for approval
- **Wait for**: "yes", "proceed", or "go ahead"
- **Output**: User approval received

**Never proceed without approval!**

### Phase 6: Execute
- **Goal**: Implement THIS task according to approved plan
- **Action**: Create/modify files, run commands
- **Follow**: The approved plan exactly
- **Output**: Changes implemented

### Phase 7: Validate
- **Goal**: Ensure THIS task's changes work correctly
- **Action**: Run tests, check types, lint
- **Verify**: All validations pass
- **Output**: Confirmation that changes work

### Phase 8: Archive (MANDATORY)
- **Goal**: Store THIS task's completion in memory
- **Action**: Call `mcp_adaptive_memory_store_memory`
- **Store**: Task details, files modified, approach used
- **Output**: Task archived for future reference

---

## Correct vs Incorrect Patterns

### ❌ INCORRECT: Workflow Once at Spec Level

```
Spec Start
    ↓
Phase 2: Search (once for entire spec)
Phase 3: Detect (once for entire spec)
Phase 4: Plan (once for entire spec)
Phase 5: Approve (once for entire spec)
    ↓
Task 1: Execute
Task 2: Execute  ← NO WORKFLOW!
Task 3: Execute  ← NO WORKFLOW!
```

**Why this is wrong:**
- Task 2 doesn't search for its specific context
- Task 3 doesn't get security analysis
- Tasks execute without individual approval
- No per-task archiving

### ✅ CORRECT: Workflow Per Task

```
Spec Start
    ↓
Task 1
    ├─ Phase 2: Search (for Task 1)
    ├─ Phase 3: Detect (for Task 1)
    ├─ Phase 4: Plan (for Task 1)
    ├─ Phase 5: Approve (for Task 1)
    ├─ Phase 6: Execute Task 1
    ├─ Phase 7: Validate Task 1
    └─ Phase 8: Archive Task 1
    ↓
Task 2
    ├─ Phase 2: Search (for Task 2) ← NEW SEARCH
    ├─ Phase 3: Detect (for Task 2) ← NEW ANALYSIS
    ├─ Phase 4: Plan (for Task 2) ← NEW PLAN
    ├─ Phase 5: Approve (for Task 2) ← NEW APPROVAL
    ├─ Phase 6: Execute Task 2
    ├─ Phase 7: Validate Task 2
    └─ Phase 8: Archive Task 2
    ↓
Task 3
    ├─ Phase 2: Search (for Task 3) ← NEW SEARCH
    ├─ Phase 3: Detect (for Task 3) ← NEW ANALYSIS
    ├─ Phase 4: Plan (for Task 3) ← NEW PLAN
    ├─ Phase 5: Approve (for Task 3) ← NEW APPROVAL
    ├─ Phase 6: Execute Task 3
    ├─ Phase 7: Validate Task 3
    └─ Phase 8: Archive Task 3
```

**Why this is correct:**
- Each task gets context specific to its needs
- Each task gets security analysis
- Each task gets individual approval
- Each task is archived separately

---

## Phase-by-Phase Guide

### Before Starting Any Task

**STOP AND CHECK:**

```
╔═══════════════════════════════════════════════════════════════╗
║           MANDATORY CHECKLIST FOR THIS TASK                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ☐ Phase 2: Called mcp_intelligent_context_intelligent_search║
║              Query: "[specific context for THIS task]"        ║
║                                                               ║
║  ☐ Phase 3: Called mcp_predictive_analysis_analyze_security  ║
║              Analyzed: Code relevant to THIS task             ║
║                                                               ║
║  ☐ Phase 4: Called mcp_sequential_thinking_sequentialthinking║
║              Created: Detailed plan for THIS task             ║
║                                                               ║
║  ☐ Phase 5: User approved THIS specific task                 ║
║              Received: "yes" / "proceed" / "go ahead"         ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  IF ANY ☐ IS UNCHECKED: STOP IMMEDIATELY                     ║
║  DO NOT PROCEED TO PHASE 6 (EXECUTE)                          ║
║  COMPLETE MISSING PHASES FOR THIS TASK FIRST                  ║
╚═══════════════════════════════════════════════════════════════╝
```

### During Task Execution

1. **Mark task as in_progress**: Call `taskStatus(task, "in_progress")`
2. **Execute phases 2-5**: Complete all workflow phases
3. **Execute task**: Implement according to approved plan
4. **Validate**: Run tests and checks
5. **Archive**: Call `mcp_adaptive_memory_store_memory`
6. **Mark task as completed**: Call `taskStatus(task, "completed")`

### After Task Completion

Before moving to the next task:
- Verify current task is fully complete
- Verify all tests pass
- Verify task is marked as completed
- **Reset workflow state**: Next task starts fresh with Phase 2

---

## Common Mistakes

### Mistake 1: Treating Workflow as Spec-Level Setup

**Wrong thinking:**
> "I already did the search/detect/plan at the beginning, so I can just execute all tasks now."

**Correct thinking:**
> "Each task needs its own search/detect/plan because each task has different context needs."

### Mistake 2: Reusing Previous Task's Context

**Wrong thinking:**
> "Task 1 was about authentication, Task 2 is also about authentication, so I can reuse the context."

**Correct thinking:**
> "Even if tasks are related, each task needs its own context search to find specific patterns and code relevant to that task."

### Mistake 3: Batch Approval

**Wrong thinking:**
> "I'll show the user all 3 tasks at once and get approval for everything."

**Correct thinking:**
> "Each task needs individual approval so the user can review the specific plan and provide feedback."

### Mistake 4: Skipping Phases for "Simple" Tasks

**Wrong thinking:**
> "Task 3 is just adding a test file, it's simple, I don't need to search/detect/plan."

**Correct thinking:**
> "Even simple tasks need workflow phases to ensure best practices, find test patterns, and get user approval."

### Mistake 5: Forgetting to Archive

**Wrong thinking:**
> "The task is done, I can move to the next one."

**Correct thinking:**
> "I must call mcp_adaptive_memory_store_memory to archive this task's completion before moving on."

---

## Troubleshooting

### How to Identify When Phases Are Being Skipped

**Signs you're skipping phases:**
- You're executing Task 2 or 3 without calling MCP tools
- You're not waiting for user approval between tasks
- You're not seeing "Phase 2", "Phase 3", "Phase 4" in your workflow
- You're executing multiple tasks in quick succession

**How to verify phases were completed:**
- Check conversation history for MCP tool calls
- Verify you called `mcp_intelligent_context_intelligent_search` for THIS task
- Verify you called `mcp_predictive_analysis_analyze_security` for THIS task
- Verify you called `mcp_sequential_thinking_sequentialthinking` for THIS task
- Verify you received user approval for THIS task

### What to Do If You Realize You Skipped Phases

**If you're about to execute a task and realize you skipped phases:**

1. **STOP immediately** - Do not proceed with execution
2. **Acknowledge the mistake** - Tell the user you need to complete workflow phases
3. **Go back to Phase 2** - Start the workflow for THIS task
4. **Complete all phases** - Search, Detect, Plan, Approve
5. **Then execute** - Only after all phases are complete

**Example:**
```
"I apologize - I was about to execute Task 2 without completing the workflow phases. 
Let me do this correctly:

Phase 2: Searching for context relevant to Task 2...
[Call mcp_intelligent_context_intelligent_search]

Phase 3: Analyzing security for Task 2...
[Call mcp_predictive_analysis_analyze_security]

Phase 4: Creating plan for Task 2...
[Call mcp_sequential_thinking_sequentialthinking]

Phase 5: Here's the plan for Task 2. May I proceed?"
```

### Recovery Procedures

**If you've already executed a task without workflow phases:**

1. **Acknowledge the issue** - Be transparent with the user
2. **Assess the damage** - Check if the implementation has issues
3. **Retroactive analysis** - Run security analysis on what was created
4. **Offer to redo** - Suggest redoing the task with proper workflow
5. **Learn from it** - Archive the mistake to avoid repeating it

---

## Examples

### Example 1: Authentication Feature (3 Tasks)

**Spec**: Add user authentication system

**Task 1: Create AuthService**

```
Phase 2 (Search):
├─ Query: "authentication service patterns with token management"
├─ Found: Existing API client patterns, token storage utilities
└─ Context: 5 relevant files

Phase 3 (Detect):
├─ Analyzed: Existing auth-related code
├─ Issues: None found
└─ Recommendations: Use existing token storage utility

Phase 4 (Plan):
├─ Create: src/services/AuthService.ts
├─ Create: src/services/AuthService.types.ts
├─ Create: src/services/AuthService.test.ts
├─ Approach: Use existing API client, add token management
└─ Risk: Low - new code, no breaking changes

Phase 5 (Approve):
├─ Presented plan to user
└─ Received: "yes, proceed"

Phase 6 (Execute):
├─ Created AuthService.ts (150 lines)
├─ Created AuthService.types.ts (30 lines)
└─ Created AuthService.test.ts (80 lines)

Phase 7 (Validate):
├─ Tests: 8 passing
├─ Types: No errors
└─ Lint: No issues

Phase 8 (Archive):
└─ Stored: "Created AuthService with token management. 3 files, 8 tests passing."
```

**Task 2: Create LoginForm Component**

```
Phase 2 (Search): ← NEW SEARCH FOR TASK 2
├─ Query: "form components with validation and loading states"
├─ Found: Existing form patterns, validation utilities, Button component
└─ Context: 6 relevant files

Phase 3 (Detect): ← NEW ANALYSIS FOR TASK 2
├─ Analyzed: Form patterns and validation code
├─ Issues: None found
└─ Recommendations: Use existing validation utility

Phase 4 (Plan): ← NEW PLAN FOR TASK 2
├─ Create: src/components/LoginForm/LoginForm.tsx
├─ Create: src/components/LoginForm/LoginForm.types.ts
├─ Create: src/components/LoginForm/LoginForm.test.tsx
├─ Approach: Use AuthService from Task 1, existing Button component
└─ Risk: Low - integrates with Task 1's AuthService

Phase 5 (Approve): ← NEW APPROVAL FOR TASK 2
├─ Presented plan to user
└─ Received: "looks good, proceed"

Phase 6 (Execute):
├─ Created LoginForm.tsx (120 lines)
├─ Created LoginForm.types.ts (20 lines)
└─ Created LoginForm.test.tsx (90 lines)

Phase 7 (Validate):
├─ Tests: 10 passing
├─ Types: No errors
└─ Lint: No issues

Phase 8 (Archive): ← NEW ARCHIVE FOR TASK 2
└─ Stored: "Created LoginForm component with validation. Integrates with AuthService. 3 files, 10 tests passing."
```

**Task 3: Add Authentication Tests**

```
Phase 2 (Search): ← NEW SEARCH FOR TASK 3
├─ Query: "integration test patterns for authentication flows"
├─ Found: Existing test utilities, mock patterns
└─ Context: 4 relevant files

Phase 3 (Detect): ← NEW ANALYSIS FOR TASK 3
├─ Analyzed: Test utilities and patterns
├─ Issues: None found
└─ Recommendations: Use existing test utilities

Phase 4 (Plan): ← NEW PLAN FOR TASK 3
├─ Create: src/tests/auth.integration.test.ts
├─ Approach: Test full login/logout flow, error cases
└─ Risk: Low - test-only changes

Phase 5 (Approve): ← NEW APPROVAL FOR TASK 3
├─ Presented plan to user
└─ Received: "yes"

Phase 6 (Execute):
└─ Created auth.integration.test.ts (150 lines)

Phase 7 (Validate):
├─ Tests: 12 passing
└─ Coverage: 95%

Phase 8 (Archive): ← NEW ARCHIVE FOR TASK 3
└─ Stored: "Added integration tests for authentication. 12 tests covering login, logout, errors. 95% coverage."
```

### Example 2: What NOT to Do

**❌ WRONG APPROACH:**

```
Spec: Add authentication system (3 tasks)

Phase 2: Search for "authentication patterns" (once)
Phase 3: Analyze security (once)
Phase 4: Plan all 3 tasks (once)
Phase 5: Get approval for all 3 tasks (once)

Execute Task 1: Create AuthService
Execute Task 2: Create LoginForm  ← NO WORKFLOW!
Execute Task 3: Add tests  ← NO WORKFLOW!

Archive: "Completed authentication feature"
```

**Why this is wrong:**
- Task 2 didn't search for form-specific patterns
- Task 3 didn't search for test-specific patterns
- No individual approval for Tasks 2 and 3
- No per-task archiving

---

## Summary

### Key Principles

1. **Each task = Full workflow** - No exceptions
2. **Phases 2-8 repeat for each task** - Not just once at spec level
3. **Context is task-specific** - Search for what THIS task needs
4. **Approval is per-task** - User reviews each task individually
5. **Archive each task** - Memory system learns from each completion

### Quick Checklist

Before executing ANY task:
- ✅ Called `mcp_intelligent_context_intelligent_search` for THIS task
- ✅ Called `mcp_predictive_analysis_analyze_security` for THIS task
- ✅ Called `mcp_sequential_thinking_sequentialthinking` for THIS task
- ✅ Got user approval for THIS task

After completing ANY task:
- ✅ Validated the changes (tests, types, lint)
- ✅ Called `mcp_adaptive_memory_store_memory` for THIS task
- ✅ Marked task as completed

### Remember

**If you skip workflow phases, you WILL:**
- ❌ Introduce security vulnerabilities
- ❌ Miss existing patterns
- ❌ Use suboptimal approaches
- ❌ Create bugs
- ❌ Waste user's time

**NEVER execute a task without completing phases 2-8 first.**

---

## Related Documentation

- **Workflow Core**: See `.kiro/steering/workflow-core.md` for essential workflow principles
- **Workflow Phases Detailed**: See `.kiro/steering/workflow-phases-detailed.md` for detailed phase explanations
- **MCP Documentation**: See `.kiro/steering/mcp-powers-skills.md` for MCP tool usage

---

**Last Updated**: 2026-05-04
**Version**: 1.0.0
