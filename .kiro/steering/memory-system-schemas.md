---
name: Memory System Schemas
description: Detailed schemas for issues, tasks, and index structures
type: global
inclusion: manual
priority: medium
version: 2.0
lastUpdated: 2026-05-03
---

# Memory System - Schemas & Formats

## Issue Schema

### Active Issue Format

```json
{
  "id": "ISS-001",
  "title": "Auth token validation vulnerability",
  "description": "JWT tokens not properly validated, allowing potential unauthorized access",
  "priority": "critical",
  "status": "pending",
  "created": "2026-04-30T07:00:00Z",
  "updated": "2026-04-30T07:00:00Z",
  "location": {
    "file": "src/auth/TokenManager.ts",
    "line": 45,
    "function": "validateToken"
  },
  "impact": {
    "severity": "high",
    "description": "Unauthorized access possible",
    "affected_features": ["authentication", "authorization"],
    "breaking_change": false
  },
  "detection": {
    "method": "automatic",
    "detected_during": "planning",
    "related_task": "TASK-001"
  },
  "tags": ["security", "auth", "jwt", "vulnerability"],
  "related_issues": [],
  "related_tasks": [],
  "notes": [],
  "resolution": null
}
```

### Resolved Issue Format

```json
{
  "id": "ISS-001",
  "status": "resolved",
  "resolved": "2026-04-30T09:00:00Z",
  "resolution": {
    "method": "fixed",
    "description": "Added proper JWT validation with signature verification",
    "fixed_in": "TASK-045",
    "files_changed": [
      "src/auth/TokenManager.ts",
      "src/auth/TokenValidator.ts"
    ],
    "tests_added": 5,
    "verified": true
  },
  "archive_after": "2026-07-30T09:00:00Z"
}
```

---

## Task Schema

### Active Task Format

```json
{
  "id": "TASK-001",
  "title": "Add login button component",
  "description": "Create reusable login button with loading state and proper error handling",
  "status": "pending",
  "priority": "medium",
  "created": "2026-04-30T07:00:00Z",
  "updated": "2026-04-30T07:00:00Z",
  "estimated_time": "30 minutes",
  "actual_time": null,
  "files_affected": [],
  "dependencies": [],
  "blocks": [],
  "blocked_by": [],
  "tags": ["ui", "auth", "component", "button"],
  "related_issues": [],
  "related_tasks": [],
  "notes": []
}
```

### Completed Task Format

```json
{
  "id": "TASK-001",
  "status": "completed",
  "completed": "2026-04-30T07:30:00Z",
  "actual_time": "25 minutes",
  "result": {
    "files_created": [
      "src/components/Auth/LoginButton/LoginButton.tsx",
      "src/components/Auth/LoginButton/LoginButton.types.ts",
      "src/components/Auth/LoginButton/LoginButton.test.tsx",
      "src/components/Auth/LoginButton/index.ts"
    ],
    "files_updated": [
      "src/components/Auth/index.ts"
    ],
    "files_deleted": [],
    "lines_added": 124,
    "tests_added": 4,
    "tests_passing": true,
    "build_successful": true
  },
  "embedding_id": "emb_001",
  "archive_after": "2026-05-30T07:30:00Z"
}
```

---

## Index Structure

### Tasks Index

```json
{
  "TASK-001": {
    "title": "Add login button component",
    "status": "completed",
    "priority": "medium",
    "created": "2026-04-30T07:00:00Z",
    "completed": "2026-04-30T07:30:00Z",
    "location": "active",
    "archive_path": null,
    "embedding_id": "emb_001",
    "keywords": ["login", "button", "auth", "component", "ui"],
    "tags": ["ui", "auth", "component"],
    "files": ["LoginButton.tsx", "LoginButton.types.ts"],
    "quick_summary": "Created login button with loading state"
  },
  "TASK-002": {
    "title": "Fix auth vulnerability",
    "status": "completed",
    "location": "archive",
    "archive_path": "archive/2026-03/tasks.json",
    "keywords": ["auth", "security", "vulnerability", "fix"],
    "quick_summary": "Fixed JWT validation vulnerability"
  }
}
```

### Issues Index

```json
{
  "ISS-001": {
    "title": "Auth token validation vulnerability",
    "priority": "critical",
    "status": "resolved",
    "created": "2026-03-15T00:00:00Z",
    "resolved": "2026-03-20T00:00:00Z",
    "location": "archive",
    "archive_path": "archive/2026-03/issues.json",
    "embedding_id": "emb_101",
    "keywords": ["auth", "token", "validation", "security", "jwt"],
    "tags": ["security", "auth"],
    "quick_summary": "JWT validation vulnerability - fixed"
  }
}
```

### Keywords Index

```json
{
  "auth": {
    "tasks": ["TASK-001", "TASK-002", "TASK-045"],
    "issues": ["ISS-001", "ISS-002"],
    "count": 5
  },
  "button": {
    "tasks": ["TASK-001", "TASK-089", "TASK-156"],
    "issues": [],
    "count": 3
  },
  "security": {
    "tasks": ["TASK-045"],
    "issues": ["ISS-001", "ISS-003"],
    "count": 3
  }
}
```

---

## Context Cache Schema

### Active Context

```json
{
  "auth-system": {
    "files": [
      "src/auth/AuthService.ts",
      "src/auth/TokenManager.ts",
      "src/auth/AuthValidator.ts"
    ],
    "patterns": ["JWT", "OAuth", "Token refresh"],
    "last_analyzed": "2026-04-30T07:00:00Z",
    "issues_count": 1,
    "complexity": "medium",
    "test_coverage": "85%",
    "dependencies": ["jsonwebtoken", "bcrypt"],
    "related_tasks": ["TASK-001", "TASK-045"],
    "related_issues": ["ISS-001"]
  }
}
```

### Context Lifecycle

```
Creation:
└─ When first analyzed

Updates:
├─ When files change
├─ When issues detected
└─ When tasks complete

Expiration:
├─ After 7 days of no access
└─ Can be regenerated on demand

Storage:
├─ Active: active/context.json
├─ Cache: Redis (24h TTL)
└─ Archive: Not archived (regenerated as needed)
```

---

## Memory Update Process

### On Task Completion

```
1. Update task status to "completed"
2. Add completion metadata:
   ├─ Completion time
   ├─ Actual duration
   ├─ Files changed
   ├─ Tests added
   └─ Build status

3. Generate embedding (Ollama 768-dim)
   └─ Time: ~100ms

4. Store in Qdrant
   ├─ Vector + metadata
   └─ Time: ~50ms

5. Update JSON index
   ├─ Add to tasks-index.json
   ├─ Update keywords.json
   └─ Time: ~10ms

6. Cache in Redis
   ├─ Cache task details
   ├─ Cache related queries
   ├─ Adaptive TTL (based on access)
   └─ Time: ~5ms

7. Schedule archiving
   └─ Archive after 30 days

Total time: ~200ms
```

### On Issue Detection

```
1. Create issue record
   ├─ Generate unique ID
   ├─ Set priority
   ├─ Add location info
   └─ Add detection metadata

2. Add to active/issues.json
   └─ Categorize by priority

3. Generate embedding
   └─ For future semantic search

4. Store in Qdrant
   └─ With metadata

5. Update index
   └─ Add to issues-index.json

6. Report to user
   └─ Based on priority level
```

### On Issue Resolution

```
1. Update issue status to "resolved"
2. Add resolution metadata:
   ├─ Resolution method
   ├─ Fixed in task
   ├─ Files changed
   └─ Verification status

3. Update embedding
   └─ Include resolution info

4. Update Qdrant
   └─ Update metadata

5. Schedule archiving
   ├─ Critical/High: 90 days
   └─ Medium/Low: 30 days

6. Keep summary in active (Critical/High only)
```

---

## Recall Examples

### Recent Task

```
User: "What did we do with the login button?"

Search: "login button"
├─ Redis: Cache hit
└─ Result: TASK-001 (completed 2 hours ago)

Response:
✅ Found: TASK-001 "Add login button component"
Status: Completed 2 hours ago
Files: 4 created, 1 updated
Time: 25 minutes
Location: src/components/Auth/LoginButton/
```

### Old Task (Archived)

```
User: "What was that auth issue from last month?"

Search: "auth issue last month"
├─ Redis: Cache miss
├─ Qdrant: Semantic search
│   └─ Found: ISS-001 (archived, 92% similarity)
└─ Load from archive/2026-03/

Response:
📋 Issue ISS-001 (Archived - Resolved)
┌─────────────────────────────────────────────────┐
│ Auth token validation vulnerability             │
│ Created: 2026-03-15                            │
│ Resolved: 2026-03-20                           │
│ Location: src/auth/TokenManager.ts:45         │
│ Fix: Added JWT signature verification         │
│ Files changed: 3                               │
│ Tests added: 5                                 │
└─────────────────────────────────────────────────┘

Related:
- TASK-045: Fixed auth vulnerability
- ISS-002: Added rate limiting (related)

Would you like to see the full details?
```

### Pattern Search

```
User: "How did we handle button loading states before?"

Search: "button loading state pattern"
├─ Qdrant: Semantic search
└─ Found: 5 similar tasks

Response:
Found 5 tasks with button loading patterns:

1. TASK-001: LoginButton (2 hours ago)
   └─ Pattern: useState + disabled during loading

2. TASK-089: SignupButton (1 week ago)
   └─ Pattern: useState + loading text change

3. TASK-156: SubmitButton (2 weeks ago)
   └─ Pattern: useState + spinner component

Most common pattern:
├─ useState for loading state
├─ Disable button during loading
├─ Show loading text or spinner
└─ Handle errors with try/catch

Would you like to see code examples?
```

---

## Archive Process

### Auto-Archiving Rules

**Completed Tasks:**
```
Age: 30 days after completion
├─ Move to archive/YYYY-MM/tasks.json
├─ Generate embedding (if not done)
├─ Store in Qdrant
├─ Update index
├─ Cache in Redis (adaptive TTL)
└─ Remove from active/tasks.json
```

**Resolved Issues:**
```
Critical/High:
├─ Age: 90 days after resolution
├─ Keep summary in active
├─ Full details in archive
└─ Always searchable

Medium/Low:
├─ Age: 30 days after resolution
├─ Full archive
└─ Searchable via index
```

**Success Patterns:**
```
Age: 6 months after completion
├─ Extract pattern
├─ Suggest adding to steering
├─ Archive original task
└─ Pattern becomes best practice
```

### Archive Process Steps

```
1. Check eligibility (age + status)
2. Generate embedding (Ollama 768-dim)
3. Store in Qdrant vector DB
4. Update JSON index
5. Cache in Redis (adaptive TTL)
6. Move to archive/YYYY-MM/
7. Remove from active/
8. Verify searchability
```

**Time:** ~200ms per item

---

## Field Definitions

### Issue Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (ISS-XXX) |
| title | string | Brief description |
| description | string | Detailed explanation |
| priority | enum | critical, high, medium, low, backlog |
| status | enum | pending, in-progress, resolved |
| created | ISO8601 | Creation timestamp |
| updated | ISO8601 | Last update timestamp |
| location | object | File, line, function |
| impact | object | Severity, description, affected features |
| detection | object | Method, phase, related task |
| tags | array | Searchable tags |
| related_issues | array | Related issue IDs |
| related_tasks | array | Related task IDs |
| notes | array | Additional notes |
| resolution | object | Resolution details (when resolved) |

### Task Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (TASK-XXX) |
| title | string | Brief description |
| description | string | Detailed explanation |
| status | enum | pending, in-progress, completed |
| priority | enum | critical, high, medium, low |
| created | ISO8601 | Creation timestamp |
| updated | ISO8601 | Last update timestamp |
| estimated_time | string | Estimated duration |
| actual_time | string | Actual duration (when completed) |
| files_affected | array | Files to be modified |
| dependencies | array | Task dependencies |
| blocks | array | Tasks blocked by this |
| blocked_by | array | Tasks blocking this |
| tags | array | Searchable tags |
| related_issues | array | Related issue IDs |
| related_tasks | array | Related task IDs |
| notes | array | Additional notes |
| result | object | Completion details (when completed) |

---

## Summary

**This file contains:**
- Complete JSON schemas for issues and tasks
- Index structure definitions
- Context cache format
- Memory update processes
- Recall examples
- Archive process details
- Field definitions

**For other information:**
- **Overview and principles**: See #memory-system-overview.md
- **Technical configuration**: See #memory-system-technical.md

