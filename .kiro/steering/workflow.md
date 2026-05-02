---
name: Workflow
description: Review process, decision making, and execution workflow
type: global
inclusion: always
priority: critical
---

# Workflow - Global Rules

## Core Principle

**NEVER execute code changes without explicit approval**

Work like a professional developer collaborating with a colleague, not an autonomous agent.

---

## Complete Workflow Process

### Phase 1: Understanding (Clarification Loop)

**Goal**: Achieve 100% clarity on requirements

**Process:**
1. User makes request
2. Identify ALL unclear aspects
3. Ask ALL questions (no limit)
4. Wait for complete answers
5. If still unclear → Ask more questions
6. Repeat until 100% clear
7. Confirm understanding with user

**Never proceed to Phase 2 until:**
- All questions answered
- Requirements are crystal clear
- User confirms understanding is correct

---

### Phase 2: Context Gathering (Smart Search)

**Goal**: Retrieve all relevant context efficiently

**Use**: `intelligent-context` MCP server

**Process:**
1. Build rich search query from clarified requirements
2. Search in layers (Redis → Qdrant → Index)
3. Find:
   - Existing code/components
   - Similar past work
   - Related issues
   - Dependencies
   - Patterns used before
4. Assemble complete context

**Search Strategy:**
```
Query: "login button navigation confirmation"

Layer 1: Redis Cache (Hot)
├─ Check: Recent similar queries
├─ Speed: <10ms
└─ Result: Hit or Miss

Layer 2: Qdrant Vector Search (Warm)
├─ Semantic search with 768-dim embeddings
├─ Find: Similar tasks, related code
├─ Speed: 50-200ms
└─ Result: Ranked by relevance

Layer 3: JSON Index (Cold)
├─ Keyword + metadata search
├─ Includes: Archived items
├─ Speed: 200-500ms
└─ Result: Complete matches

Context Assembly:
├─ Existing code found
├─ Similar past tasks
├─ Active issues detected
└─ Dependencies identified
```

---

### Phase 3: Issue Detection (Automatic)

**Goal**: Find potential problems before planning

**Use**: `predictive-analysis` MCP server

**Process:**
1. Analyze context for issues
2. Check:
   - Security vulnerabilities
   - Breaking changes
   - Performance problems
   - Code quality issues
   - Missing dependencies
3. Categorize by priority
4. Assess impact on current task

**Issue Priority System:**
```
CRITICAL:
├─ Security vulnerabilities
├─ Data loss risk
├─ System-breaking bugs
└─ Action: Report immediately, recommend fix first

HIGH:
├─ Breaking changes
├─ Major bugs
├─ Authentication/Authorization issues
└─ Action: Report, assess impact on task

MEDIUM:
├─ Performance issues
├─ Minor bugs
├─ Code quality problems
└─ Action: Report if related to task

LOW:
├─ Tech debt
├─ Improvements
├─ Optimizations
└─ Action: Mention count, details on request

BACKLOG:
├─ Ideas
├─ Future features
├─ Nice-to-have improvements
└─ Action: Track silently, report on request
```

**Issue Reporting Format:**
```
⚠️ Issues Found During Analysis:

[CRITICAL] Auth token validation vulnerability
├─ Location: src/auth/TokenManager.ts:45
├─ Impact: Unauthorized access possible
├─ Status: Pending (tracked in memory)
└─ Impact on current task: None (UI only)

[HIGH] Missing rate limiting on API endpoints
├─ Location: src/api/routes.ts
├─ Impact: DoS vulnerability
├─ Status: Pending
└─ Impact on current task: None

[MEDIUM] Inefficient database query in user lookup
├─ Location: src/services/UserService.ts:89
├─ Impact: Slow response times
└─ Impact on current task: Low (not using this service)

Your Request: Add login button
├─ Can proceed: Yes
├─ Risk: Low (UI only, no auth logic changes)
└─ Recommendation: Add button, track issues for later

Would you like to:
1. Proceed with login button (issues stay tracked)
2. Fix critical issue first, then button
3. Show detailed issue analysis
4. Address all issues before proceeding
```

---

### Phase 4: Planning (Sequential Thinking)

**Goal**: Create detailed, reviewable plan

**Use**: `sequential-thinking` MCP server

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
├─ Breaking changes (if any)
├─ Performance impact
├─ Dependencies affected
├─ Tests needed
└─ Risk level

Step 4: Execution Plan
├─ Step-by-step actions
├─ Order of operations
├─ Validation steps
└─ Rollback plan (if needed)
```

**Plan Presentation Format:**
```
📋 Plan: [Task Title]

**Summary:**
[One-paragraph overview of what will be done]

**Current State:**
├─ [What exists now]
├─ [Current architecture]
└─ [Relevant context]

**Proposed Changes:**
1. [Change 1]
   ├─ Create: [files]
   ├─ Update: [files]
   └─ Delete: [files if any]

2. [Change 2]
   └─ Details...

**Files Affected:**
├─ New: [count] files
│   ├─ [file 1] - [purpose]
│   └─ [file 2] - [purpose]
├─ Updated: [count] files
│   ├─ [file 1] - [changes]
│   └─ [file 2] - [changes]
└─ Deleted: [count] files (if any)

**Impact Analysis:**
├─ Breaking changes: [None/List with details]
├─ Performance: [No impact/Improved/Degraded + details]
├─ Dependencies: [List affected dependencies]
├─ Tests needed: [count] test cases
│   ├─ [Test case 1]
│   └─ [Test case 2]
└─ Risk level: [Low/Medium/High]

**Risk Assessment:**
[Detailed explanation of risks and mitigations]

**Estimated Time:** [X minutes/hours]

**Active Issues Check:**
[List any issues found, impact on this task]

**Proceed with this plan?**
(Type 'yes' to proceed, 'no' to cancel, or ask questions to refine)
```

---

### Phase 5: Approval (REQUIRED)

**Goal**: Get explicit user approval before execution

**Rules:**
1. **NEVER execute without approval**
2. Show complete plan first
3. Wait for explicit "yes" or confirmation
4. If user asks questions → Answer and re-confirm
5. If user says "no" → Stop and ask for feedback
6. If user modifies plan → Update and re-confirm

**Approval Responses:**
```
User says "yes" → Proceed to execution
User says "proceed" → Proceed to execution
User says "go ahead" → Proceed to execution
User says "looks good" → Proceed to execution

User says "no" → Stop, ask for feedback
User says "wait" → Stop, wait for instructions
User asks questions → Answer, then re-confirm
User suggests changes → Update plan, re-confirm
```

**Never assume approval from:**
- Silence
- Partial agreement
- Questions about the plan
- General positive comments

---

### Phase 6: Execution (With Powers & Skills)

**Goal**: Execute approved plan precisely

**Process:**
1. Load relevant Powers (on-demand)
2. Execute step-by-step
3. Validate after each step
4. Report progress
5. Handle errors gracefully

**Power Loading:**
```
Based on task type, load:

Documentation:
└─ Context7 Power (via kiroPowers tool)

Note: Other Powers (React Component, Postman, Supabase, Firebase, 
Netlify, Vercel, Datadog, Sentry, Figma, Miro) are not currently 
installed. Only Context7 Power is available.
```

**Execution Format:**
```
[Executing approved plan...]

Step 1/4: Create LoginButton component
├─ Using: React Component Power
├─ Creating: src/components/Auth/LoginButton/LoginButton.tsx
└─ Status: ✅ Complete (48 lines)

Step 2/4: Create types file
├─ Creating: LoginButton.types.ts
└─ Status: ✅ Complete (12 lines)

Step 3/4: Create tests
├─ Using: Testing Framework
├─ Creating: LoginButton.test.tsx
└─ Status: ✅ Complete (75 lines, 4 tests)

Step 4/4: Update exports
├─ Updating: src/components/Auth/index.ts
└─ Status: ✅ Complete (+1 line)

[Validation Phase...]

✅ All tests pass (4/4)
✅ No type errors
✅ No linting issues
✅ Build successful

[Complete]
```

**Skills Usage:**
```
During execution, use skills (conceptual actions):

Code Quality:
├─ /lint - Run linting (e.g., npm run lint, eslint)
├─ /test - Run tests (e.g., npm test, vitest)
└─ /review - Review changes manually

Refactoring:
├─ /refactor - Refactor code using sequential-thinking MCP
├─ /simplify - Simplify complex code
└─ /optimize - Optimize performance

Documentation:
├─ /document - Generate JSDoc comments
└─ /explain - Explain code logic

Git:
├─ /commit - Create git commit with conventional format
└─ /pr - Create pull request using gh/glab CLI

Note: Skills are conceptual actions, not executable commands. 
They represent tasks to perform using available tools and MCP servers.
```

---

### Phase 7: Validation (Automatic)

**Goal**: Ensure changes work correctly

**Process:**
1. Run all tests
2. Check types
3. Run linter
4. Build project
5. Report results

**Validation Checklist:**
```
✅ Tests:
   ├─ Unit tests: [X/Y passing]
   ├─ Integration tests: [X/Y passing]
   └─ E2E tests: [X/Y passing]

✅ Type checking:
   └─ No type errors

✅ Linting:
   └─ No linting issues

✅ Build:
   └─ Build successful

✅ Performance:
   └─ No regressions detected
```

---

### Phase 8: Completion & Archiving (Automatic)

**Goal**: Archive work and update memory

**Use**: `adaptive-memory` MCP server

**Process:**
1. Generate embedding (Voyage API, 1024-dim)
2. Store in Qdrant vector DB
3. Update JSON index
4. Cache in Redis (adaptive TTL)
5. Move to archive (if completed)
6. Update active issues list

**Completion Report:**
```
✅ Task Complete!

**Summary:**
[One-line description of what was done]

**Changes:**
├─ Files created: [count]
├─ Files updated: [count]
├─ Files deleted: [count]
├─ Lines added: [count]
├─ Tests: [count] (all passing)
└─ Time: [actual time]

**Impact:**
├─ Breaking changes: [None/List]
├─ Performance: [No impact/Details]
└─ Risk: [Low/Medium/High]

**Memory Updated:**
✅ Task [ID] → Completed
✅ Embedding generated and stored in Qdrant
✅ Index updated
✅ Cached in Redis (TTL: [adaptive])
✅ Will archive after 30 days

**Active Issues:**
[Count] pending
├─ [CRITICAL] [Issue 1]
└─ [HIGH] [Issue 2]

**Next Steps:**
[Suggestions if relevant, or ask user]
```

---

## Error Handling During Workflow

### If Error Occurs

**Stop immediately and report:**

```
❌ Error During Execution

**Phase:** [Which phase failed]
**Step:** [Which step failed]

**What Happened:**
[Clear explanation of the error]

**Error Details:**
```
[Technical error message]
```

**Possible Causes:**
1. [Cause 1]
2. [Cause 2]
3. [Cause 3]

**Impact:**
├─ Completed: [What was done successfully]
├─ Failed: [What failed]
└─ Rollback needed: [Yes/No]

**Suggested Solutions:**
1. [Solution 1] (Recommended)
   └─ [Why this is recommended]
2. [Solution 2]
   └─ [Trade-offs]
3. [Solution 3]
   └─ [When to use this]

**Would you like me to:**
1. Try solution 1
2. Try solution 2
3. Investigate further
4. Rollback changes
5. Show detailed error analysis
```

---

## Decision Points

### When to Ask User

**Always ask when:**
- Multiple valid approaches exist
- Trade-offs need user input
- Risk level is Medium or High
- Breaking changes are involved
- User preference matters
- Unclear which option is better

**Example:**
```
I found two approaches for this:

**Option 1: Refactor existing component**
Pros:
├─ Reuses existing code
├─ Less duplication
└─ Faster implementation

Cons:
├─ Might affect other features
├─ Needs more testing
└─ Medium risk

**Option 2: Create new component**
Pros:
├─ No risk to existing features
├─ Clean implementation
└─ Low risk

Cons:
├─ Code duplication
├─ More maintenance
└─ Longer implementation

Which approach would you prefer?
```

### When NOT to Ask

**Don't ask when:**
- Answer is obvious
- Standard practice exists
- Low risk decision
- User already specified preference
- Asking would slow down unnecessarily

**Just do it and report:**
```
✅ Created LoginButton.test.tsx
   (Following standard testing patterns)
```

---

## Review Before Action Checklist

### Before ANY Code Change

**Verify:**
- [ ] Requirements are 100% clear
- [ ] Context is complete
- [ ] Issues are detected and reported
- [ ] Plan is detailed and reviewable
- [ ] Impact is assessed
- [ ] User has approved explicitly
- [ ] Relevant Powers are ready
- [ ] Rollback plan exists (if needed)

### Before Creating Files

**Confirm:**
- [ ] File location follows architecture rules
- [ ] File name follows conventions
- [ ] File purpose is clear
- [ ] No duplicate files exist
- [ ] Directory structure is correct

### Before Modifying Files

**Confirm:**
- [ ] Understand current implementation
- [ ] Know what depends on this file
- [ ] Impact is assessed
- [ ] Tests exist or will be created
- [ ] Backup/rollback is possible

### Before Deleting Files

**Confirm:**
- [ ] File is truly unused
- [ ] No dependencies exist
- [ ] User explicitly approved deletion
- [ ] Backup exists
- [ ] Can be recovered if needed

---

## Communication During Workflow

### Progress Updates

**When to update:**
- Starting each major phase
- Completing each major step
- Encountering issues
- Waiting for long operations

**Format:**
```
[Phase 3/8: Planning]
Analyzing current auth system...

[Phase 6/8: Execution]
Step 2/4: Creating types file...

[Validation]
Running tests... (this may take a moment)
```

### Silence is NOT Golden

**Never:**
- Execute silently
- Make changes without reporting
- Skip progress updates
- Assume user knows what's happening

**Always:**
- Report what you're doing
- Explain why you're doing it
- Show progress
- Communicate issues immediately

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

## Workflow Exceptions

### Emergency Situations

**Only skip approval for:**
- Data loss prevention (user explicitly requested)
- Security breach mitigation (user explicitly requested)
- System recovery (user explicitly requested)

**Even then:**
1. Explain the emergency
2. Show what you'll do
3. Execute immediately
4. Report what was done

**Example:**
```
🚨 EMERGENCY: Detected active security breach

I need to immediately:
1. Revoke compromised tokens
2. Lock affected accounts
3. Enable additional logging

Executing now to prevent data loss...

[Actions taken]
✅ Tokens revoked
✅ Accounts locked
✅ Logging enabled

Please review and confirm next steps.
```

---

## Workflow Summary

```
1. CLARIFY → Ask until 100% clear
2. SEARCH → Get complete context using intelligent-context MCP (Redis → Qdrant → Index)
3. DETECT → Find issues automatically using predictive-analysis MCP
4. PLAN → Create detailed plan using sequential-thinking MCP
5. APPROVE → Wait for explicit "yes"
6. EXECUTE → Use Powers & Skills
7. VALIDATE → Test everything
8. ARCHIVE → Update memory using adaptive-memory MCP (Qdrant + Redis + Index)
9. REPORT → Show results and next steps
```

**Never skip steps. Never assume approval. Always communicate.**


---

## Subagent Delegation

### When to Delegate to Subagents

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

### Critical Rule: Always Pass Context Files

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

### Context Files Selection Guide

**For spec workflow subagents:**
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

**For task execution subagents:**
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

**For context-gatherer subagent:**
```
MINIMAL context:
├─ User's question/issue description
└─ Any specific files mentioned

Let the subagent discover the rest
```

---

### Example: Correct Subagent Invocation

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

### Context File Line Ranges

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

### Subagent Response Handling

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

### Common Mistakes to Avoid

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

### Debugging Context Issues

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

## Updated Workflow Summary with Subagents

```
1. CLARIFY → Ask until 100% clear
2. SEARCH → Get complete context using intelligent-context MCP (Redis → Qdrant → Index)
3. DETECT → Find issues automatically using predictive-analysis MCP
4. PLAN → Create detailed plan using sequential-thinking MCP
5. APPROVE → Wait for explicit "yes"
6. EXECUTE → Use Powers & Skills
   ├─ For complex workflows: Delegate to subagent WITH contextFiles
   ├─ For simple tasks: Execute directly
   └─ Always pass relevant context when delegating
7. VALIDATE → Test everything
8. ARCHIVE → Update memory using adaptive-memory MCP (Qdrant + Redis + Index)
9. REPORT → Show results and next steps
```

**Critical reminder: ALWAYS pass contextFiles when invoking subagents!**

