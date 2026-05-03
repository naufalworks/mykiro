---
name: Issue Tracking
description: Memory system, issue tracking, and forever recall (see split files for details)
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Issue Tracking & Memory System - Overview

**This file has been split for better performance and navigation.**

## Core Files (Always Loaded)

- **This file**: Quick overview and navigation
- **memory-system-overview.md**: Core principles, priority system, when to store/retrieve (always loaded)

## Detailed Files (Load as Needed)

- **#memory-system-schemas.md**: Detailed schemas for issues, tasks, and index structures
- **#memory-system-technical.md**: Technical configuration, search layers, and maintenance

---

## Core Principle

**Forever Memory with Efficient Recall**

Track everything, archive intelligently, recall instantly.

---

## Quick Reference

### Priority Levels

```
CRITICAL → Report immediately, never archive
HIGH     → Report during planning, archive after 90 days
MEDIUM   → Report if related, archive after 30 days
LOW      → Track silently, archive after 7 days
BACKLOG  → Track silently, archive after 90 days
```

### When to Store Memory

**Always store:**
- Task completion (Phase 8)
- Issue detection (Phase 3)
- Pattern identification
- User requests ("remember this")

**Never store:**
- Failed attempts
- Temporary debugging
- User says "don't track this"

### When to Retrieve Memory

**Use intelligent-context MCP (Phase 2):**
```typescript
mcp_intelligent_context_intelligent_search({
  query: "authentication token validation with JWT",
  limit: 5
})
```

**Use adaptive-memory MCP (When needed):**
```typescript
mcp_adaptive_memory_retrieve_memory({
  query: "auth issues from last month",
  limit: 5
})
```

---

## Storage Architecture

### Three-Tier System

```
Layer 1: Redis Cache (Hot)
├─ Speed: <10ms
└─ Recent queries (last 24h)

Layer 2: Qdrant Vector DB (Warm)
├─ Speed: 50-200ms
└─ Semantic search (1024-dim embeddings)

Layer 3: JSON Files (Cold)
├─ Speed: 100-300ms
└─ Active + archived memory
```

---

## Auto-Archiving

**Completed Tasks:**
```
Age: 30 days after completion
Action: Move to archive/YYYY-MM/
Result: Still searchable via Qdrant + index
```

**Resolved Issues:**
```
Critical/High: 90 days (keep summary in active)
Medium/Low: 30 days (full archive)
Result: Always searchable
```

---

## Key Principles

1. **Track Everything** - Never lose information
2. **Archive Intelligently** - Keep active memory clean
3. **Recall Instantly** - Fast search via Qdrant + Redis
4. **Forever Accessible** - Nothing is truly deleted
5. **Adaptive Caching** - Optimize based on usage
6. **Automatic Maintenance** - No manual cleanup needed
7. **Pattern Learning** - Extract best practices

---

## Navigation

### Need detailed schemas?
→ Load **#memory-system-schemas.md**

### Need technical configuration?
→ Load **#memory-system-technical.md**

### Need MCP documentation?
→ See **#mcp-powers-skills.md**

---

## File Split Information

**Original file**: 927 lines (~4,469 tokens)

**New structure**:
- issue-tracking.md: 100 lines (~600 tokens) - Always loaded
- memory-system-overview.md: 200 lines (~1,200 tokens) - Always loaded
- memory-system-schemas.md: 400 lines (~2,400 tokens) - Manual
- memory-system-technical.md: 327 lines (~1,869 tokens) - Manual

**Total reduction in always-loaded content**: ~2,669 tokens saved (60% reduction)

**Benefits**:
- Faster responses (less context to process)
- Better navigation (focused files)
- Selective loading (load only what's needed)
- Easier maintenance (smaller, focused files)

