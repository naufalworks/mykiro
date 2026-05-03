---
name: Workflow
description: Review process, decision making, and execution workflow (see split files for details)
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Workflow - Overview

**This file has been split for better performance and navigation.**

## Core Files (Always Loaded)

- **This file**: Quick overview and navigation
- **workflow-core.md**: Essential principles and 8-phase overview (always loaded)

## Detailed Files (Load as Needed)

- **#workflow-phases-detailed.md**: Detailed explanations of all 8 phases with examples
- **#workflow-subagents.md**: Subagent delegation patterns and contextFiles requirements
- **#workflow-error-recovery.md**: Tool parameter error recovery and failure loop prevention

---

## Quick Reference

### 8-Phase Workflow

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

### Core Principle

**NEVER execute code changes without explicit approval**

Work like a professional developer collaborating with a colleague, not an autonomous agent.

### Phase Dependencies (MANDATORY)

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
```

**NO SHORTCUTS. Follow the workflow or STOP.**

### Enforcement Checklist

Before calling `fsWrite`, `strReplace`, `fsAppend`, or `deleteFile`:

```
✅ Phase 1: Requirements 100% clear
✅ Phase 2: mcp_intelligent_context_intelligent_search called
✅ Phase 3: mcp_predictive_analysis_analyze_security called
✅ Phase 4: mcp_sequential_thinking_sequentialthinking called
✅ Phase 5: User explicitly approved ("yes"/"proceed"/"go ahead")

If ANY ❌ exists: STOP. Complete missing phases first.
```

---

## MCP Integration

| Phase | MCP Server | Tool | When |
|-------|-----------|------|------|
| 2 | intelligent-context | intelligent_search | Always |
| 3 | predictive-analysis | analyze_security | Always |
| 4 | sequential-thinking | sequentialthinking | Always |
| 4 | collaborative-planning | decompose_task | Complex tasks (>1 hour) |
| 8 | adaptive-memory | store_memory | Always |

---

## Key Principles

1. **Clarity First** - Understand completely before acting
2. **Plan Before Execute** - Think through the approach
3. **Approval Required** - Never autonomous execution
4. **Communicate Always** - Keep user informed
5. **Validate Everything** - Test before reporting success
6. **Handle Errors Gracefully** - Stop, report, suggest solutions
7. **Archive Automatically** - Keep memory system updated

---

## Navigation

### Need detailed phase information?
→ Load **#workflow-phases-detailed.md**

### Working with subagents?
→ Load **#workflow-subagents.md**

### Encountering errors?
→ Load **#workflow-error-recovery.md**

### Need MCP documentation?
→ See **#mcp-powers-skills.md**

---

## File Split Information

**Original file**: 1,143 lines (~6,452 tokens)

**New structure**:
- workflow.md: 100 lines (~600 tokens) - Always loaded
- workflow-core.md: 300 lines (~1,800 tokens) - Always loaded
- workflow-phases-detailed.md: 400 lines (~2,400 tokens) - Manual
- workflow-subagents.md: 200 lines (~1,200 tokens) - Manual
- workflow-error-recovery.md: 143 lines (~858 tokens) - Manual

**Total reduction in always-loaded content**: ~4,800 tokens saved (74% reduction)

**Benefits**:
- Faster responses (less context to process)
- Better navigation (focused files)
- Selective loading (load only what's needed)
- Easier maintenance (smaller, focused files)

