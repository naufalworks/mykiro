---
name: Workflow Core
description: Essential workflow principles and 8-phase overview
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Workflow Core - Essential Principles

## Core Principle

**NEVER execute code changes without explicit approval**

Work like a professional developer collaborating with a colleague, not an autonomous agent.

---

## Phase Dependency Rules (MANDATORY)

**ABSOLUTE REQUIREMENTS - ZERO EXCEPTIONS:**

```
Phase 1 (Clarify) → MUST complete before Phase 2
Phase 2 (Search)  → MUST complete before Phase 3
Phase 3 (Detect)  → MUST complete before Phase 4
Phase 4 (Plan)    → MUST complete before Phase 5
Phase 5 (Approve) → MUST complete before Phase 6
Phase 6 (Execute) → MUST complete before Phase 7
Phase 7 (Validate)→ MUST complete before Phase 8
Phase 8 (Archive) → Final phase
```

### Enforcement Checklist (Verify Before EVERY File Operation)

Before calling `fsWrite`, `strReplace`, `fsAppend`, or `deleteFile`:

```
✅ Phase 1: Requirements 100% clear
✅ Phase 2: mcp_intelligent_context_intelligent_search called
✅ Phase 3: mcp_predictive_analysis_analyze_security called
✅ Phase 4: mcp_sequential_thinking_sequentialthinking called
✅ Phase 5: User explicitly approved ("yes"/"proceed"/"go ahead")

If ANY ❌ exists: STOP. Complete missing phases first.
```

### Consequences of Skipping Phases

If you skip phases:
- ❌ Execution WILL fail
- ❌ You WILL create bugs
- ❌ You WILL waste user's time
- ⚠️ You MUST go back and complete skipped phases

**NO SHORTCUTS. Follow the workflow or STOP.**

---

## Spec Task Execution (MANDATORY)

### Critical Rule for Specs

When working with specs that have multiple tasks:

**EACH TASK MUST GO THROUGH THE FULL WORKFLOW**

---

## ⚠️ CRITICAL: TASK EXECUTION LOOP ⚠️

**THIS IS THE MOST IMPORTANT RULE FOR SPEC EXECUTION**

### Visual Workflow Pattern

```
╔═══════════════════════════════════════════════════════════════╗
║                    CORRECT PATTERN                            ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Spec Start                                                   ║
║      ↓                                                        ║
║  Task 1 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5 ──→  ║
║             (Search)    (Detect)    (Plan)      (Approve)     ║
║      ↓                                                        ║
║  Task 2 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5 ──→  ║
║             (Search)    (Detect)    (Plan)      (Approve)     ║
║      ↓                                                        ║
║  Task 3 ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5 ──→  ║
║             (Search)    (Detect)    (Plan)      (Approve)     ║
║                                                               ║
║  ✅ EACH TASK GETS FULL WORKFLOW                              ║
╚═══════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════╗
║                    ❌ WRONG PATTERN ❌                         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Spec Start ──→ Phase 2 ──→ Phase 3 ──→ Phase 4 ──→ Phase 5  ║
║                 (Search)    (Detect)    (Plan)    (Approve)   ║
║      ↓                                                        ║
║  Task 1 executes                                              ║
║  Task 2 executes  ← NO WORKFLOW! ❌                           ║
║  Task 3 executes  ← NO WORKFLOW! ❌                           ║
║                                                               ║
║  ❌ THIS WILL INTRODUCE BUGS AND SECURITY ISSUES              ║
╚═══════════════════════════════════════════════════════════════╝
```

### Task Execution Loop

```
Spec Start → Task 1 → Phases 2-8 → Complete
                    ↓
                Task 2 → Phases 2-8 → Complete
                    ↓
                Task 3 → Phases 2-8 → Complete
```

**For EACH task:**
1. **CLARIFY** (Phase 1) - If task requirements unclear
2. **SEARCH** (Phase 2) - `mcp_intelligent_context_intelligent_search`
3. **DETECT** (Phase 3) - `mcp_predictive_analysis_analyze_security`
4. **PLAN** (Phase 4) - `mcp_sequential_thinking_sequentialthinking`
5. **APPROVE** (Phase 5) - Wait for explicit "yes"
6. **EXECUTE** (Phase 6) - Implement the task
7. **VALIDATE** (Phase 7) - Run tests
8. **ARCHIVE** (Phase 8) - `mcp_adaptive_memory_store_memory`

---

## 🛑 STOP AND CHECK - BEFORE EVERY TASK ��

**Before executing ANY task in a spec, you MUST verify ALL of these:**

```
╔═══════════════════════════════════════════════════════════════╗
║           MANDATORY CHECKLIST FOR THIS TASK                   ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✅ Phase 2: Called mcp_intelligent_context_intelligent_search║
║              Query: "[specific context for THIS task]"        ║
║              Result: Found relevant code/patterns             ║
║                                                               ║
║  ✅ Phase 3: Called mcp_predictive_analysis_analyze_security  ║
║              Analyzed: Code relevant to THIS task             ║
║              Result: Security/performance issues identified   ║
║                                                               ║
║  ✅ Phase 4: Called mcp_sequential_thinking_sequentialthinking║
║              Created: Detailed plan for THIS task             ║
║              Result: Step-by-step execution plan              ║
║                                                               ║
║  ✅ Phase 5: User approved THIS specific task                 ║
║              Showed: Complete plan to user                    ║
║              Received: "yes" / "proceed" / "go ahead"         ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║  IF ANY ❌ EXISTS: STOP IMMEDIATELY                           ║
║  DO NOT PROCEED TO PHASE 6 (EXECUTE)                          ║
║  COMPLETE MISSING PHASES FOR THIS TASK FIRST                  ║
╚═══════════════════════════════════════════════════════════════╝
```

**This checklist applies to EVERY task, not just the first one.**

**If you skip phases, you WILL:**
- ❌ Introduce security vulnerabilities
- ❌ Miss existing patterns and duplicate code
- ❌ Use suboptimal approaches
- ❌ Create bugs that could have been prevented
- ❌ Waste the user's time with rework

**NEVER execute a task without completing phases 2-8 first.**

---

### Enforcement Checklist (Per Task)

Before executing ANY task in a spec:

```
✅ Phase 2: Called mcp_intelligent_context_intelligent_search for THIS task
✅ Phase 3: Called mcp_predictive_analysis_analyze_security for THIS task
✅ Phase 4: Called mcp_sequential_thinking_sequentialthinking for THIS task
✅ Phase 5: User approved THIS specific task

If ANY ❌ exists: STOP. Complete missing phases for THIS task.
```

### Why This Matters

**Problem:**
```
❌ WRONG: Workflow runs once at spec start
Spec Start → Phases 1-5 → Task 1 executes
                       → Task 2 executes (no workflow!)
                       → Task 3 executes (no workflow!)
```

**Solution:**
```
✅ CORRECT: Workflow runs for each task
Spec Start → Task 1 → Phases 2-8
          → Task 2 → Phases 2-8
          → Task 3 → Phases 2-8
```

### Example: 3-Task Spec

```
Task 1: Create data models
├─ Phase 2: Search for existing models
├─ Phase 3: Detect security issues
├─ Phase 4: Plan implementation
├─ Phase 5: Get approval
├─ Phase 6: Create files
├─ Phase 7: Run tests
└─ Phase 8: Archive

Task 2: Create API endpoints
├─ Phase 2: Search for API patterns (NEW search for THIS task)
├─ Phase 3: Detect issues (NEW analysis for THIS task)
├─ Phase 4: Plan endpoints (NEW plan for THIS task)
├─ Phase 5: Get approval (NEW approval for THIS task)
├─ Phase 6: Create endpoints
├─ Phase 7: Run tests
└─ Phase 8: Archive

Task 3: Add tests
├─ Phase 2: Search for test patterns (NEW search for THIS task)
├─ Phase 3: Detect issues (NEW analysis for THIS task)
├─ Phase 4: Plan tests (NEW plan for THIS task)
├─ Phase 5: Get approval (NEW approval for THIS task)
├─ Phase 6: Write tests
├─ Phase 7: Run tests
└─ Phase 8: Archive
```

**Never skip phases between tasks. Each task is independent and requires full workflow.**

---

**For detailed guidance on spec task workflow, see: `.kiro/docs/spec-task-workflow.md`**

---

## 8-Phase Workflow Overview

### Phase 1: Clarify
**Goal**: Achieve 100% clarity on requirements
**Action**: Ask questions until crystal clear
**MCP**: None
**Output**: Confirmed understanding

### Phase 2: Search
**Goal**: Retrieve all relevant context
**Action**: Semantic search for existing code/patterns
**MCP**: `mcp_intelligent_context_intelligent_search`
**Output**: Complete context assembled

### Phase 3: Detect
**Goal**: Find potential problems before planning
**Action**: Analyze for security/performance/architecture issues
**MCP**: `mcp_predictive_analysis_analyze_security`
**Output**: Issues categorized by priority

### Phase 4: Plan
**Goal**: Create detailed, reviewable plan
**Action**: Multi-step reasoning with revision capability
**MCP**: `mcp_sequential_thinking_sequentialthinking`
**Optional**: `mcp_collaborative_planning_decompose_task` (for complex tasks >1 hour)
**Output**: Detailed execution plan

### Phase 5: Approve
**Goal**: Get explicit user approval
**Action**: Wait for "yes", "proceed", or "go ahead"
**MCP**: None
**Output**: User approval received

### Phase 6: Execute
**Goal**: Execute approved plan precisely
**Action**: Create/modify files, run commands
**MCP**: None (use Powers if needed)
**Output**: Changes implemented

### Phase 7: Validate
**Goal**: Ensure changes work correctly
**Action**: Run tests, check types, lint, build
**MCP**: None
**Output**: All validations pass

### Phase 8: Archive
**Goal**: Archive work and update memory
**Action**: Store in adaptive-memory system
**MCP**: `mcp_adaptive_memory_store_memory`
**Output**: Task/issue stored, indexed, cached

---

## Quick Reference: When to Use Each MCP

| Phase | MCP Server | Tool | When |
|-------|-----------|------|------|
| 2 | intelligent-context | intelligent_search | Always (after clarification) |
| 3 | predictive-analysis | analyze_security | Always (before planning) |
| 4 | sequential-thinking | sequentialthinking | Always (for planning) |
| 4 | collaborative-planning | decompose_task | Complex tasks (>1 hour) |
| 8 | adaptive-memory | store_memory | Always (after completion) |

---

## Key Workflow Principles

1. **Clarity First** - Understand completely before acting
2. **Plan Before Execute** - Think through the approach
3. **Approval Required** - Never autonomous execution
4. **Communicate Always** - Keep user informed
5. **Validate Everything** - Test before reporting success
6. **Handle Errors Gracefully** - Stop, report, suggest solutions
7. **Archive Automatically** - Keep memory system updated

---

## Workflow Summary

```
1. CLARIFY → Ask until 100% clear
2. SEARCH → Get complete context (intelligent-context MCP)
3. DETECT → Find issues automatically (predictive-analysis MCP)
4. PLAN → Create detailed plan (sequential-thinking MCP)
5. APPROVE → Wait for explicit "yes"
6. EXECUTE → Use Powers & Skills
7. VALIDATE → Test everything
8. ARCHIVE → Update memory (adaptive-memory MCP)
9. REPORT → Show results and next steps
```

**Never skip steps. Never assume approval. Always communicate.**

---

## For Detailed Information

- **Detailed phase explanations**: See #workflow-phases-detailed.md
- **Subagent delegation**: See #workflow-subagents.md
- **Error recovery**: See #workflow-error-recovery.md
- **MCP documentation**: See #mcp-powers-skills.md

