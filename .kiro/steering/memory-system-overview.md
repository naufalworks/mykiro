---
name: Memory System Overview
description: Core principles, priority system, and when to store/retrieve
type: global
inclusion: always
priority: critical
version: 2.0
lastUpdated: 2026-05-03
---

# Memory System - Overview

## Core Principle

**Forever Memory with Efficient Recall**

Track everything, archive intelligently, recall instantly.

---

## Memory Architecture (Quick Reference)

### Three-Tier System

```
~/.kiro/memory/
├── active/              (Hot - Always loaded, ~50KB)
│   ├── issues.json      (Current issues)
│   ├── tasks.json       (Current tasks)
│   └── context.json     (Recent context)
│
├── archive/             (Cold - Compressed, loaded on demand)
│   └── YYYY-MM/         (Monthly archives)
│
└── index/               (Search index - Instant lookup)
    ├── issues-index.json
    ├── tasks-index.json
    └── keywords.json
```

### Storage Layers

```
Layer 1: Redis Cache (Hot - In-Memory)
├── Speed: <10ms
└── Recent queries (last 24h)

Layer 2: Qdrant Vector DB (Warm - Semantic Search)
├── Speed: 50-200ms
└── All embeddings (1024-dim via Voyage API)

Layer 3: JSON Files (Cold - Disk)
├── Speed: 100-300ms
└── Active + archived memory
```

---

## Issue Priority System

### Priority Levels

**CRITICAL**
```
Definition:
├─ Security vulnerabilities
├─ Data loss risk
├─ System-breaking bugs
└─ Production outages

Action:
├─ Report immediately
├─ Recommend fix first
├─ Block risky operations
└─ Never auto-archive

Retention:
└─ Forever in active (even after resolved)
```

**HIGH**
```
Definition:
├─ Breaking changes
├─ Major bugs
├─ Authentication/Authorization issues
└─ Performance degradation

Action:
├─ Report during planning
├─ Assess impact on current task
├─ Recommend addressing soon
└─ Track in active memory

Retention:
├─ Active: Until resolved
└─ Archive: After 90 days (keep summary)
```

**MEDIUM**
```
Definition:
├─ Performance issues
├─ Minor bugs
├─ Code quality problems
└─ Missing features

Action:
├─ Report if related to task
├─ Mention count if unrelated
└─ Details on request

Retention:
├─ Active: 30 days
└─ Archive: After 30 days
```

**LOW**
```
Definition:
├─ Tech debt
├─ Improvements
├─ Optimizations
└─ Nice-to-have features

Action:
├─ Track silently
├─ Report count on request
└─ Details on explicit request

Retention:
├─ Active: 7 days
└─ Archive: After 7 days
```

**BACKLOG**
```
Definition:
├─ Ideas
├─ Future features
├─ Experimental concepts
└─ Long-term improvements

Action:
├─ Track silently
├─ Report on explicit request
└─ Never block current work

Retention:
├─ Active: Until user reviews
└─ Archive: After 90 days
```

---

## When to Store Memory

### Always Store

**Task Completion:**
```typescript
mcp_adaptive_memory_store_memory({
  type: "task",
  content: "Created LoginButton component with loading state and error handling. Files: LoginButton.tsx, LoginButton.types.ts, LoginButton.test.tsx. Tests: 4 passing.",
  priority: "medium",
  tags: ["ui", "auth", "component", "react"]
})
```

**Issue Detection:**
```typescript
mcp_adaptive_memory_store_memory({
  type: "issue",
  content: "SQL injection vulnerability in UserService.ts line 89. String concatenation in query. Needs parameterized queries.",
  priority: "critical",
  tags: ["security", "sql", "vulnerability"]
})
```

**Pattern Identification:**
```typescript
mcp_adaptive_memory_store_memory({
  type: "pattern",
  content: "Button loading state pattern: useState + disabled during loading + loading text/spinner. Used in 5 components successfully.",
  priority: "low",
  tags: ["pattern", "ui", "button", "loading"]
})
```

**User Request:**
```typescript
// When user says "remember this" or "track this"
mcp_adaptive_memory_store_memory({
  type: "context",
  content: "[User's content to remember]",
  priority: "medium",
  tags: ["user-requested"]
})
```

### Never Store

- Failed attempts
- Temporary debugging
- User says "don't track this"
- Exploratory work that didn't succeed

---

## When to Retrieve Memory

### Use intelligent-context MCP (Phase 2)

**For code/pattern search:**
```typescript
mcp_intelligent_context_intelligent_search({
  query: "authentication token validation with JWT",
  limit: 5
})
```

### Use adaptive-memory MCP (When needed)

**For task/issue history:**
```typescript
mcp_adaptive_memory_retrieve_memory({
  query: "auth issues from last month",
  limit: 5
})
```

**When user asks:**
- "What did we do with...?"
- "What was that issue...?"
- "How did we handle...?"
- "Show me previous work on..."

---

## Search Strategy

### Three-Layer Search

**Layer 1: Redis Cache (Fastest)**
```
Query: "auth button login"
├─ Check: Cached queries
├─ Speed: <10ms
└─ Result: Hit or Miss
```

**Layer 2: Qdrant Vector Search (Fast)**
```
Query: "auth button login"
├─ Generate embedding
├─ Semantic search in Qdrant
├─ Speed: 50-200ms
└─ Result: Ranked by relevance
```

**Layer 3: JSON Index (Fallback)**
```
Query: "auth button login"
├─ Keyword search in index
├─ Speed: 100-300ms
└─ Result: Exact keyword matches
```

---

## Adaptive Cache TTL

### TTL Strategy

**Hot Queries (accessed >5 times/day):**
```
TTL: 7 days
Examples: "auth system", "button component", "login flow"
```

**Warm Queries (accessed 2-5 times/day):**
```
TTL: 24 hours
Examples: "user profile", "api endpoints", "test utilities"
```

**Cold Queries (accessed once):**
```
TTL: 1 hour
Examples: "old migration script", "deprecated component"
```

**Active Context (current work):**
```
TTL: Until task completes
Examples: Current task context, related files, active issues
```

---

## Auto-Archiving Rules

**Completed Tasks:**
```
Age: 30 days after completion
Action: Move to archive/YYYY-MM/tasks.json
Result: Still searchable, just not in active memory
```

**Resolved Issues:**
```
Critical/High: 90 days after resolution (keep summary in active)
Medium/Low: 30 days after resolution (full archive)
Result: Always searchable via Qdrant + index
```

**Success Patterns:**
```
Age: 6 months after completion
Action: Extract pattern, suggest adding to steering
Result: Pattern becomes best practice
```

---

## Reporting Format

### Active Issues Report

```
�� Active Issues Summary

CRITICAL (1):
└─ ISS-001: Auth token validation vulnerability
   Location: src/auth/TokenManager.ts:45
   Age: 2 hours
   Impact: High - unauthorized access possible

HIGH (2):
├─ ISS-002: Missing rate limiting on API
└─ ISS-003: Inefficient database queries

MEDIUM (5): [Show on request]
LOW (12): [Show on request]
BACKLOG (8): [Show on request]

Total: 28 issues tracked
```

### Task Progress Report

```
📊 Task Progress

In Progress (3):
├─ TASK-156: Refactor auth system (2 hours)
├─ TASK-157: Add rate limiting (30 minutes)
└─ TASK-158: Update documentation (15 minutes)

Completed Today (4):
├─ TASK-001: Add login button (25 min)
└─ ... (3 more)

Total: 35 tasks tracked
```

---

## Key Memory Principles

1. **Track Everything** - Never lose information
2. **Archive Intelligently** - Keep active memory clean
3. **Recall Instantly** - Fast search via Qdrant + Redis
4. **Forever Accessible** - Nothing is truly deleted
5. **Adaptive Caching** - Optimize based on usage
6. **Automatic Maintenance** - No manual cleanup needed
7. **Pattern Learning** - Extract best practices

---

## Quick Reference

### Store Memory (Phase 8)
```typescript
mcp_adaptive_memory_store_memory({
  type: "task" | "issue" | "context" | "pattern",
  content: "Detailed description",
  priority: "critical" | "high" | "medium" | "low",
  tags: ["relevant", "tags"]
})
```

### Retrieve Memory (When needed)
```typescript
mcp_adaptive_memory_retrieve_memory({
  query: "Natural language query",
  limit: 5
})
```

### Organize Memory (Weekly)
```typescript
mcp_adaptive_memory_organize_memories({})
```

---

## For Detailed Information

- **Schemas and formats**: See #memory-system-schemas.md
- **Technical configuration**: See #memory-system-technical.md
- **MCP documentation**: See #mcp-powers-skills.md

---

## Storage Estimates

```
Active memory: ~50KB (always loaded)
Index: ~5MB per 10,000 items
Qdrant: ~3KB per item (768-dim vector)
Archives: ~1KB per item (compressed)

For 100,000 items:
├─ Active: 50KB
├─ Index: 50MB
├─ Qdrant: 300MB
└─ Archives: 100MB (compressed)
Total: ~450MB (very manageable)
```

**Memory never fills up** - grows indefinitely with intelligent archiving.

