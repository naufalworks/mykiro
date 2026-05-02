---
name: MCP Powers Skills Integration
description: Complete integration of MCP servers, Powers, and Skills
type: global
inclusion: always
priority: critical
---

# MCP, Powers & Skills Integration - Global Rules

## Overview

This file defines how Kiro integrates:
- **MCP Servers** (Model Context Protocol) - Core capabilities
- **Powers** - Specialized on-demand tools
- **Skills** - Built-in commands

---

## MCP Servers (Always Active)

### 1. Sequential Thinking MCP

**Purpose**: Multi-step planning and impact analysis

**When to Use**: Before ANY code change

**Process:**
```
Step 1: Analyze Current State
├─ What exists now
├─ Current architecture
├─ Existing patterns
└─ Dependencies

Step 2: Design Solution
├─ What will change
├─ New files/components
├─ Modified files
└─ Integration points

Step 3: Impact Assessment
├─ Breaking changes
├─ Performance impact
├─ Dependencies affected
├─ Tests needed
└─ Risk level

Step 4: Execution Plan
├─ Step-by-step actions
├─ Order of operations
├─ Validation steps
└─ Rollback plan
```

**Example Usage:**
```
User: "Refactor auth system"

→ Sequential Thinking MCP activates:

Step 1: Current State Analysis
├─ AuthService.ts: 450 lines, handles 5 responsibilities
├─ Used by: 12 files across the codebase
├─ Tests: 15 test cases, 85% coverage
└─ Dependencies: jsonwebtoken, bcrypt

Step 2: Solution Design
├─ Split into 3 focused modules:
│   ├─ AuthService.ts (core, 150 lines)
│   ├─ TokenManager.ts (tokens, 100 lines)
│   └─ AuthValidator.ts (validation, 80 lines)
├─ Create types file (50 lines)
└─ Update 12 dependent files

Step 3: Impact Assessment
├─ Breaking changes: None (same exports)
├─ Performance: No impact
├─ Tests: Need to update imports in 15 tests
├─ Risk: Medium (many dependents)
└─ Estimated time: 2 hours

Step 4: Execution Plan
Phase 1: Create new modules (30 min)
Phase 2: Move code to modules (45 min)
Phase 3: Update imports (30 min)
Phase 4: Run tests and validate (15 min)

Proceed with Phase 1?
```

---

### 2. Memory MCP

**Purpose**: Track issues, tasks, and context forever

**When to Use**: Always running in background

**Capabilities:**
```
Storage:
├─ Active memory (hot)
├─ Archived memory (cold)
└─ Vector embeddings (Qdrant)

Operations:
├─ Store task/issue
├─ Update status
├─ Search semantically
├─ Recall from archive
└─ Generate embeddings
```

**Auto-Operations:**
```
On Task Complete:
├─ Generate embedding (Ollama 768-dim)
├─ Store in Qdrant
├─ Update JSON index
├─ Cache in Redis
└─ Schedule archiving (30 days)

On Issue Detected:
├─ Create issue record
├─ Categorize by priority
├─ Generate embedding
├─ Store in Qdrant
└─ Report to user (based on priority)

On Search Query:
├─ Check Redis cache
├─ Search Qdrant (semantic)
├─ Search JSON index (keyword)
├─ Rank results
└─ Cache for next time
```

**Example Usage:**
```
User: "What was that auth issue from last month?"

→ Memory MCP activates:

1. Check Redis cache: Miss
2. Search Qdrant: "auth issue last month"
   └─ Found: ISS-001 (92% similarity)
3. Load from archive/2026-03/
4. Cache in Redis (24h TTL)
5. Return to user

Result:
📋 ISS-001: Auth token validation vulnerability
Status: Resolved on 2026-03-20
Fix: Added JWT signature verification
Files: 3 changed, 5 tests added
```

---

### 3. Semantic Search MCP

**Purpose**: Fast context retrieval from codebase

**When to Use**: After clarification, before planning

**Technology:**
```
Vector DB: Qdrant
Embeddings: Ollama (768-dim)
Cache: Redis
Speed: 50-200ms
```

**Search Strategy:**
```
Layer 1: Redis Cache (Hot)
├─ Check recent queries
├─ Speed: <10ms
└─ Hit rate: ~40%

Layer 2: Qdrant Vector Search (Warm)
├─ Semantic similarity search
├─ Speed: 50-200ms
└─ Accuracy: High

Layer 3: JSON Index (Cold)
├─ Keyword + metadata search
├─ Speed: 100-300ms
└─ Fallback for exact matches
```

**Example Usage:**
```
User: "Add logout button" (after clarification)

→ Semantic Search MCP activates:

Query: "logout button navigation confirmation text icon"

Layer 1: Redis
└─ Cache miss

Layer 2: Qdrant
├─ Searching 1,247 items...
└─ Found:
    ├─ TASK-001: "Add login button" (92% similar)
    ├─ TASK-089: "Add signup button" (88% similar)
    └─ Button component (85% similar)

Layer 3: Context Assembly
├─ Button component: Available
├─ useAuth hook: Has logout() method
├─ Navigation component: Target location
└─ Similar pattern: TASK-001 (successful)

Cache in Redis (24h TTL)

Result: Complete context in 150ms
```

---

### 4. Code Analysis MCP

**Purpose**: Detect issues, analyze complexity, assess risk

**When to Use**: During planning phase, before execution

**Capabilities:**
```
Security Analysis:
├─ SQL injection vulnerabilities
├─ XSS vulnerabilities
├─ Authentication issues
├─ Authorization issues
└─ Insecure dependencies

Code Quality:
├─ Complexity analysis
├─ Code smells
├─ Duplicate code
├─ Dead code
└─ Style violations

Performance:
├─ Inefficient algorithms
├─ Memory leaks
├─ N+1 queries
└─ Unnecessary re-renders

Dependencies:
├─ Outdated packages
├─ Security vulnerabilities
├─ Breaking changes
└─ Unused dependencies
```

**Example Usage:**
```
User: "Add user profile page" (during planning)

→ Code Analysis MCP activates:

Analyzing codebase...

⚠️ Issues Found:

[CRITICAL] SQL Injection in UserService
├─ Location: src/services/UserService.ts:89
├─ Issue: String concatenation in query
├─ Impact: High - data breach possible
└─ Recommendation: Use parameterized queries

[HIGH] Missing authentication on profile endpoint
├─ Location: src/api/routes/profile.ts:15
├─ Issue: No auth middleware
├─ Impact: Medium - unauthorized access
└─ Recommendation: Add auth middleware

[MEDIUM] Inefficient user lookup
├─ Location: src/services/UserService.ts:45
├─ Issue: O(n) search in array
├─ Impact: Low - slow for large datasets
└─ Recommendation: Use Map or database index

Your request: Add user profile page
├─ Can proceed: Yes (with caution)
├─ Recommendation: Fix critical issue first
└─ Risk: Medium (auth issue affects this feature)

Would you like to:
1. Fix critical issue first, then add profile page
2. Add profile page with proper auth (recommended)
3. Show detailed issue analysis
```

---

## Powers (Load On-Demand)

### Design Powers

**Figma Power**
```
When to Load:
├─ User mentions Figma
├─ User provides Figma URL
└─ Implementing from design

Capabilities:
├─ Fetch design specs
├─ Extract colors, fonts, spacing
├─ Generate component structure
└─ Export assets

Example:
User: "Implement this design: figma.com/file/abc123"
→ Load Figma Power
→ Fetch design specs
→ Generate component code
```

**Miro Power**
```
When to Load:
├─ User mentions Miro
├─ User provides Miro board URL
└─ Working from diagrams

Capabilities:
├─ Fetch board content
├─ Extract architecture diagrams
├─ Parse flow charts
└─ Generate code structure

Example:
User: "Implement the flow from this Miro board"
→ Load Miro Power
→ Parse diagram
→ Generate implementation plan
```

---

### Development Powers

**React Component Power**
```
When to Load:
├─ Creating React components
├─ Refactoring components
└─ Component-heavy tasks

Capabilities:
├─ Generate component boilerplate
├─ Follow project patterns
├─ Create prop types
├─ Generate tests
└─ Apply styling

Example:
User: "Create LoginButton component"
→ Load React Component Power
→ Generate component following architecture.md
→ Create types file
→ Generate tests
→ Apply styles
```

**API Testing Power (Postman)**
```
When to Load:
├─ Testing APIs
├─ Creating API collections
└─ Debugging API issues

Capabilities:
├─ Create Postman collections
├─ Generate test cases
├─ Run API tests
├─ Export results
└─ Debug requests

Example:
User: "Test the auth API endpoints"
→ Load Postman Power
→ Create collection
→ Generate test cases
→ Run tests
→ Report results
```

**Context7 Power**
```
When to Load:
├─ Need documentation
├─ Learning new library
└─ API reference needed

Capabilities:
├─ Search documentation
├─ Find code examples
├─ Get API references
└─ Explain concepts

Example:
User: "How do I use React Query?"
→ Load Context7 Power
→ Search React Query docs
→ Find relevant examples
→ Explain usage
```

---

### Database Powers

**Supabase Power**
```
When to Load:
├─ Working with Supabase
├─ Database operations
└─ Auth with Supabase

Capabilities:
├─ Query database
├─ Create tables
├─ Set up auth
├─ Manage storage
└─ Real-time subscriptions

Example:
User: "Add user table to Supabase"
→ Load Supabase Power
→ Create table schema
→ Set up RLS policies
→ Generate TypeScript types
```

**Firebase Power**
```
When to Load:
├─ Working with Firebase
├─ Firestore operations
└─ Firebase auth

Capabilities:
├─ Query Firestore
├─ Set up authentication
├─ Manage storage
├─ Cloud functions
└─ Real-time listeners

Example:
User: "Set up Firebase auth"
→ Load Firebase Power
→ Configure auth providers
→ Generate auth hooks
→ Set up security rules
```

---

### Deployment Powers

**Netlify Power**
```
When to Load:
├─ Deploying to Netlify
├─ Configuring builds
└─ Setting up redirects

Capabilities:
├─ Deploy site
├─ Configure build settings
├─ Set up redirects
├─ Manage environment variables
└─ Check deploy status

Example:
User: "Deploy to Netlify"
→ Load Netlify Power
→ Configure netlify.toml
→ Set up build command
→ Deploy site
→ Report URL
```

**Vercel Power**
```
When to Load:
├─ Deploying to Vercel
├─ Configuring Next.js
└─ Setting up domains

Capabilities:
├─ Deploy application
├─ Configure vercel.json
├─ Set up domains
├─ Manage environment variables
└─ Check deployment status

Example:
User: "Deploy Next.js app to Vercel"
→ Load Vercel Power
→ Configure deployment
→ Deploy application
→ Report URL
```

---

### Observability Powers

**Datadog Power**
```
When to Load:
├─ Checking logs
├─ Monitoring metrics
└─ Debugging production issues

Capabilities:
├─ Query logs
├─ Check metrics
├─ View traces
├─ Analyze errors
└─ Create dashboards

Example:
User: "Check error logs from last hour"
→ Load Datadog Power
→ Query logs
→ Filter errors
→ Analyze patterns
→ Report findings
```

**Sentry Power**
```
When to Load:
├─ Debugging errors
├─ Checking error rates
└─ Analyzing stack traces

Capabilities:
├─ Query errors
├─ View stack traces
├─ Check error trends
├─ Analyze user impact
└─ Create issues

Example:
User: "What errors are users seeing?"
→ Load Sentry Power
→ Query recent errors
→ Analyze frequency
→ Show stack traces
→ Suggest fixes
```

---

## Skills (Built-in Commands)

### Code Quality Skills

**/lint**
```
Purpose: Check code style and quality
When: After writing code, before committing
Usage: Automatic during validation phase

Example:
After creating LoginButton.tsx
→ Run /lint
→ Check for style violations
→ Report issues
→ Fix automatically if possible
```

**/test**
```
Purpose: Run tests
When: After code changes, before committing
Usage: Automatic during validation phase

Example:
After modifying AuthService
→ Run /test
→ Execute all related tests
→ Report results
→ Show coverage
```

**/review**
```
Purpose: Review code changes
When: Before committing, on request
Usage: Manual or automatic

Example:
User: "Review my changes"
→ Run /review
→ Analyze changes
→ Check for issues
→ Suggest improvements
```

---

### Refactoring Skills

**/refactor**
```
Purpose: Refactor code
When: Code is complex or violates standards
Usage: On request

Example:
User: "Refactor this function"
→ Run /refactor
→ Analyze function
→ Suggest improvements
→ Show refactored version
→ Wait for approval
```

**/simplify**
```
Purpose: Simplify complex code
When: Code is hard to understand
Usage: On request

Example:
User: "Simplify this logic"
→ Run /simplify
→ Analyze complexity
→ Simplify logic
→ Maintain functionality
→ Show simplified version
```

**/optimize**
```
Purpose: Optimize performance
When: Performance issues detected
Usage: On request, after profiling

Example:
User: "Optimize this query"
→ Run /optimize
→ Analyze performance
→ Suggest optimizations
→ Show optimized version
→ Benchmark improvements
```

---

### Documentation Skills

**/document**
```
Purpose: Generate documentation
When: Code lacks documentation
Usage: On request

Example:
User: "Document this API"
→ Run /document
→ Analyze code
→ Generate JSDoc comments
→ Create README
→ Add usage examples
```

**/explain**
```
Purpose: Explain code
When: User needs understanding
Usage: On request

Example:
User: "Explain this function"
→ Run /explain
→ Analyze function
→ Explain purpose
→ Describe parameters
→ Show usage examples
```

---

### Git Skills

**/commit**
```
Purpose: Create git commit
When: Changes are ready
Usage: On request

Example:
User: "Commit these changes"
→ Run /commit
→ Analyze changes
→ Generate commit message
→ Show message for approval
→ Create commit
```

**/pr**
```
Purpose: Create pull request
When: Branch is ready
Usage: On request

Example:
User: "Create PR"
→ Run /pr
→ Analyze branch changes
→ Generate PR title and description
→ Show for approval
→ Create PR
→ Return PR URL
```

---

## Complete Integration Flow

### Example: "Add logout button"

```
═══════════════════════════════════════════════════════════════

PHASE 1: CLARIFICATION
└─ Ask questions until 100% clear
   (core-behavior.md)

PHASE 2: CONTEXT GATHERING
├─ Semantic Search MCP activates
├─ Query: "logout button navigation confirmation"
├─ Search: Redis → Qdrant → Index
└─ Result: Complete context in 150ms

PHASE 3: ISSUE DETECTION
├─ Code Analysis MCP activates
├─ Scan: Security, quality, performance
└─ Report: Issues found (if any)

PHASE 4: PLANNING
├─ Sequential Thinking MCP activates
├─ Step 1: Analyze current state
├─ Step 2: Design solution
├─ Step 3: Assess impact
├─ Step 4: Create execution plan
└─ Show detailed plan to user

PHASE 5: APPROVAL
└─ Wait for explicit "yes"

PHASE 6: EXECUTION
├─ Load React Component Power
├─ Generate component (architecture.md)
├─ Create types file
├─ Create tests
└─ Update exports

PHASE 7: VALIDATION
├─ Run /lint (check style)
├─ Run /test (run tests)
├─ Check build
└─ Report results

PHASE 8: COMPLETION
├─ Memory MCP activates
├─ Generate embedding (Ollama)
├─ Store in Qdrant
├─ Update index
├─ Cache in Redis
└─ Report success

═══════════════════════════════════════════════════════════════
```

---

## Power Loading Strategy

### Automatic Loading

```
Kiro automatically loads powers based on:
├─ Keywords in user request
├─ File types being worked on
├─ Context from search
└─ Task requirements

Examples:
"Implement Figma design" → Load Figma Power
"Test API endpoints" → Load Postman Power
"Deploy to Netlify" → Load Netlify Power
"Check Datadog logs" → Load Datadog Power
```

### Manual Loading

```
User can explicitly request:
"Use Figma power to fetch this design"
"Load Postman power to test APIs"
"Use Context7 to find React Query docs"
```

### Power Unloading

```
Powers unload automatically:
├─ After task completion
├─ When no longer needed
└─ To free resources

Powers stay loaded:
├─ If task is ongoing
├─ If related tasks coming
└─ If explicitly requested
```

---

## MCP Communication

### MCP to MCP

```
MCPs can communicate:

Sequential Thinking → Code Analysis
└─ "Analyze this code before I plan"

Memory → Semantic Search
└─ "Search for similar past work"

Code Analysis → Memory
└─ "Store this issue for tracking"

Semantic Search → Memory
└─ "Cache this search result"
```

### MCP to Powers

```
MCPs can trigger powers:

Sequential Thinking → React Component Power
└─ "Load React power for component creation"

Code Analysis → Postman Power
└─ "Load Postman to test this API"

Memory → Context7 Power
└─ "Load Context7 to find documentation"
```

---

## Configuration

### MCP Servers Config

```json
{
  "mcp_servers": {
    "sequential_thinking": {
      "enabled": true,
      "auto_activate": true,
      "trigger": "before_code_change"
    },
    "memory": {
      "enabled": true,
      "auto_activate": true,
      "storage": {
        "qdrant": "localhost:6333",
        "redis": "localhost:6379",
        "ollama": "localhost:11434"
      }
    },
    "semantic_search": {
      "enabled": true,
      "auto_activate": true,
      "trigger": "after_clarification"
    },
    "code_analysis": {
      "enabled": true,
      "auto_activate": true,
      "trigger": "during_planning"
    }
  }
}
```

### Powers Config

```json
{
  "powers": {
    "auto_load": true,
    "installed": [
      "figma",
      "react-component",
      "postman",
      "context7",
      "supabase",
      "netlify",
      "datadog"
    ],
    "load_strategy": "on_demand",
    "unload_after": "task_complete"
  }
}
```

### Skills Config

```json
{
  "skills": {
    "auto_run": {
      "lint": "after_code_write",
      "test": "after_code_write",
      "review": "on_request"
    },
    "manual_only": [
      "refactor",
      "simplify",
      "optimize",
      "document"
    ]
  }
}
```

---

## Key Integration Principles

1. **MCPs Always Active** - Core capabilities always running
2. **Powers On-Demand** - Load only when needed
3. **Skills Automatic** - Run at appropriate times
4. **Seamless Communication** - MCPs, Powers, Skills work together
5. **User Control** - User can override any automation
6. **Efficient Resources** - Load/unload intelligently
7. **Complete Workflow** - All pieces work as one system

---

## Troubleshooting

### If MCP Fails

```
1. Report failure to user
2. Explain what failed
3. Suggest fallback approach
4. Continue with manual process
5. Log issue for investigation
```

### If Power Fails to Load

```
1. Report to user
2. Check if power is installed
3. Suggest manual alternative
4. Continue without power
5. Track issue
```

### If Skill Fails

```
1. Report failure
2. Show error details
3. Suggest manual approach
4. Continue workflow
5. Track issue
```

---

## Summary

**This system integrates:**

✅ **4 MCP Servers** (always active)
- Sequential Thinking (planning)
- Memory (tracking)
- Semantic Search (context)
- Code Analysis (quality)

✅ **10+ Powers** (on-demand)
- Design: Figma, Miro
- Dev: React, Postman, Context7
- Database: Supabase, Firebase
- Deploy: Netlify, Vercel
- Observability: Datadog, Sentry

✅ **10+ Skills** (automatic/manual)
- Quality: lint, test, review
- Refactor: refactor, simplify, optimize
- Docs: document, explain
- Git: commit, pr

**All working together following:**
- core-behavior.md (communication)
- code-standards.md (quality)
- workflow.md (process)
- architecture.md (structure)
- issue-tracking.md (memory)

**Result**: Professional, efficient, intelligent development environment
