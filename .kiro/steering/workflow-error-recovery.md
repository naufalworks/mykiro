---
name: Workflow Error Recovery
description: Tool parameter error recovery and failure loop prevention
type: global
inclusion: manual
priority: high
version: 2.0
lastUpdated: 2026-05-03
---

# Workflow - Error Recovery

## Tool Parameter Error Recovery (CRITICAL)

### When Tool Invocation Fails

**MANDATORY Recovery Process:**

1. **STOP** - Do not retry immediately
2. **ANALYZE** - Identify missing/incorrect parameter
3. **FIX** - Determine correct parameter value
4. **RETRY** - Call tool with corrected parameters
5. **VERIFY** - Confirm success

---

## Common Tool Errors & Fixes

### Missing `text` parameter in `fsWrite`

```
❌ WRONG (causes infinite loop):
fsWrite({ path: "file.md" })
→ Error: Missing text parameter
→ "I need to provide text content"
→ fsWrite({ path: "file.md" })  // Same broken call
→ INFINITE LOOP

✅ CORRECT:
fsWrite({ path: "file.md" })
→ Error: Missing text parameter
→ Analyze: "text parameter required"
→ Generate: Create actual file content
→ fsWrite({ path: "file.md", text: "# Actual Content\n\nDetails here..." })
→ Success
```

### Missing required parameter (any tool)

```
1. Read error message carefully
2. Identify which parameter is missing
3. Determine appropriate value for that parameter
4. Retry with ALL required parameters included
```

---

## FORBIDDEN Actions

**NEVER do these:**
- ❌ Retry exact same broken call
- ❌ Say "I need to fix X" then not fix X
- ❌ Acknowledge error but retry without changes
- ❌ Loop more than 2 times on same error

**ALWAYS do these:**
- ✅ Fix the error BEFORE retrying
- ✅ Change the parameters
- ✅ Verify fix will work
- ✅ If stuck after 2 attempts, ask user for help

---

## Failure Loop Recognition

### Detecting Failure Loops

**Signs you're in a failure loop:**
- Same error appears 2+ times
- Making same tool call repeatedly
- Acknowledging error but not fixing it
- Trying incremental patches instead of root cause fix

**Example of failure loop:**
```
❌ Wrong approach:
Attempt 1: Call tool → Error
Attempt 2: Tweak slightly → Same error
Attempt 3: Tweak again → Same error
Attempt 4: Keep trying variations...
```

**Correct approach:**
```
✅ Right approach:
Attempt 1: Call tool → Error
Analyze: What's the root cause?
Attempt 2: Fix root cause → Success

OR if still failing:
Attempt 2: Try different approach → Error
Analyze: Why are both approaches failing?
Ask user: "I've tried X and Y, both failed because Z. 
          Should I try approach W or do you have another suggestion?"
```

---

## Root Cause Analysis

### When Approach Fails Twice

**Stop and diagnose:**

1. **What's the actual problem?**
   - Not just the symptom
   - The underlying cause

2. **Why did both attempts fail?**
   - Same root cause?
   - Different issues?
   - Wrong assumption?

3. **What's fundamentally different approach?**
   - Not just tweaking parameters
   - Different strategy entirely
   - Different tool or method

**Example:**
```
Problem: "Add authentication to API"

❌ Wrong (incremental patching):
Attempt 1: Add middleware → Error: Missing auth config
Attempt 2: Add config → Error: Missing token validation
Attempt 3: Add validation → Error: Missing user lookup
→ Endless patches, never addressing root cause

✅ Right (root cause fix):
Attempt 1: Add middleware → Error: Missing auth config
Analyze: "We need complete auth system, not just middleware"
Attempt 2: Implement complete auth system (config + validation + lookup)
→ Success
```

---

## Error Recovery Patterns

### Pattern 1: Missing Parameter

```
Error: "Missing required parameter 'text'"

Recovery:
1. Identify: text parameter is required
2. Generate: Create appropriate content
3. Retry: Call with text parameter included
4. Verify: Check success
```

### Pattern 2: Invalid Parameter Value

```
Error: "Invalid value for parameter 'priority'"

Recovery:
1. Identify: priority value is invalid
2. Check: What are valid values?
3. Fix: Use valid value
4. Retry: Call with correct value
5. Verify: Check success
```

### Pattern 3: Wrong Tool

```
Error: Tool doesn't support this operation

Recovery:
1. Identify: Using wrong tool
2. Research: What's the right tool?
3. Switch: Use correct tool
4. Retry: Call correct tool
5. Verify: Check success
```

### Pattern 4: Dependency Missing

```
Error: "File not found" or "Module not found"

Recovery:
1. Identify: Dependency is missing
2. Create: Create missing dependency first
3. Retry: Call original operation
4. Verify: Check success
```

---

## When to Ask for Help

**Ask user for help when:**
- Stuck after 2 failed attempts
- Root cause is unclear
- Multiple approaches all fail
- User input needed to proceed
- Tradeoffs require user decision

**Format:**
```
❌ I've attempted this task twice:

Attempt 1: [Approach 1]
Result: [Error/Failure]

Attempt 2: [Approach 2]
Result: [Error/Failure]

Root cause analysis:
[What I think is causing the failures]

I need your input:
1. Should I try [Approach 3]?
2. Do you have a different approach in mind?
3. Is there context I'm missing?

What would you like me to do?
```

---

## Error Reporting Format

### Standard Error Report

```
❌ Error During [Phase/Operation]

**What happened:**
[Clear, non-technical explanation]

**Technical details:**
```
[Error message, stack trace if relevant]
```

**Root cause:**
[Analysis of why this happened]

**Impact:**
├─ Completed: [What succeeded]
├─ Failed: [What failed]
└─ Rollback needed: [Yes/No]

**Suggested solutions:**
1. [Solution 1] (Recommended)
   └─ Why: [Explanation]
   └─ Risk: [Low/Medium/High]

2. [Solution 2]
   └─ Why: [Explanation]
   └─ Risk: [Low/Medium/High]

3. [Solution 3]
   └─ Why: [Explanation]
   └─ Risk: [Low/Medium/High]

**What would you like me to do?**
```

---

## Recovery Strategies

### Strategy 1: Rollback and Retry

**When to use:**
- Partial changes were made
- Need clean slate
- Previous state was working

**Process:**
1. Rollback changes
2. Analyze what went wrong
3. Fix root cause
4. Retry with fix

### Strategy 2: Fix Forward

**When to use:**
- Rollback is difficult
- Changes are mostly correct
- Small fix needed

**Process:**
1. Identify what needs fixing
2. Apply targeted fix
3. Verify fix works
4. Continue

### Strategy 3: Alternative Approach

**When to use:**
- Current approach fundamentally flawed
- Better approach exists
- User suggests different method

**Process:**
1. Explain why current approach failed
2. Propose alternative
3. Get user approval
4. Execute alternative

---

## Prevention

### Before Making Changes

**Verify:**
- [ ] All required parameters identified
- [ ] Parameter values are valid
- [ ] Dependencies exist
- [ ] Approach is sound
- [ ] Have rollback plan

### During Execution

**Monitor:**
- [ ] Each step succeeds
- [ ] No warnings or errors
- [ ] Output is as expected
- [ ] Dependencies are satisfied

### After Errors

**Analyze:**
- [ ] What was the root cause?
- [ ] Could this have been prevented?
- [ ] Is there a pattern?
- [ ] Should approach change?

---

## Examples

### Example 1: Missing Parameter Recovery

```
// Attempt 1
fsWrite({ path: "config.json" })
→ Error: Missing required parameter 'text'

// Analysis
- fsWrite requires 'text' parameter
- Need to generate config content

// Attempt 2 (Fixed)
fsWrite({ 
  path: "config.json",
  text: JSON.stringify({ 
    apiKey: "placeholder",
    timeout: 5000 
  }, null, 2)
})
→ Success
```

### Example 2: Wrong Approach Recovery

```
// Attempt 1: Try to modify file that doesn't exist
strReplace({
  path: "src/config.ts",
  oldStr: "old value",
  newStr: "new value"
})
→ Error: File not found

// Attempt 2: Try to create file
fsWrite({ path: "src/config.ts", text: "new value" })
→ Error: Directory doesn't exist

// Analysis
- Root cause: Directory structure doesn't exist
- Need to create directory first

// Attempt 3 (Fixed)
1. Create directory: src/
2. Create file: src/config.ts
→ Success
```

### Example 3: Asking for Help

```
// Attempt 1: Add auth middleware
→ Error: Missing auth configuration

// Attempt 2: Add auth configuration
→ Error: Database connection required

// Analysis
- This requires complete auth system setup
- Multiple dependencies involved
- User input needed on approach

// Ask user
❌ I've attempted to add authentication twice:

Attempt 1: Added middleware
Result: Missing auth configuration

Attempt 2: Added configuration  
Result: Requires database connection

Root cause: Authentication requires complete system setup including:
- Auth middleware
- Configuration
- Database connection
- User model
- Token management

This is more complex than initially scoped. Would you like me to:
1. Implement complete auth system (estimated 2-3 hours)
2. Use existing auth library (faster, less custom)
3. Implement minimal auth first, expand later

What's your preference?
```

---

## Key Principles

1. **Stop and analyze** - Don't retry blindly
2. **Fix root cause** - Not just symptoms
3. **Ask after 2 attempts** - Don't loop endlessly
4. **Explain clearly** - Help user understand
5. **Suggest solutions** - Provide options
6. **Learn from errors** - Prevent recurrence

---

## Summary

**Error Recovery Process:**
1. Error occurs → STOP
2. Analyze root cause
3. Fix the cause (not symptom)
4. Retry with fix
5. If fails again → Ask user

**Never:**
- Retry same broken call
- Loop more than 2 times
- Patch symptoms instead of fixing cause

**Always:**
- Fix before retrying
- Analyze root cause
- Ask for help when stuck

