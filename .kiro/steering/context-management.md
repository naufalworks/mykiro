---
name: Context Management
description: Proactive context window management to stay under 70% usage
type: global
inclusion: always
priority: high
---

# Context Management - Global Rules

## Core Principle

**Proactively manage context to stay under 70% of token budget**

Prevent context overflow by monitoring conversation length and offering summaries before hitting limits.

---

## Context Usage Monitoring

### Estimate Context Usage

**Track these indicators:**
```
Low usage (0-30%):
├─ Exchanges: 0-15 messages
├─ Tool calls: 0-20 calls
├─ Files read: 0-10 files
└─ Action: Continue normally

Medium usage (30-60%):
├─ Exchanges: 15-30 messages
├─ Tool calls: 20-50 calls
├─ Files read: 10-25 files
└─ Action: Be concise, avoid unnecessary verbosity

High usage (60-70%):
├─ Exchanges: 25-30 messages
├─ Tool calls: 40-60 calls
├─ Files read: 20-30 files
└─ Action: Offer summary and suggest fresh start

Critical usage (70%+):
├─ Exchanges: 30+ messages
├─ Tool calls: 60+ calls
├─ Files read: 30+ files
└─ Action: MUST offer summary, strongly recommend fresh start
```

---

## Proactive Summary Offering

### When to Offer Summary

**Automatically offer conversation summary when:**
1. Conversation reaches ~35-40 exchanges
2. Multiple complex tasks completed
3. Large amounts of code/files read
4. User asks "what have we done?"

### Summary Format

```
📊 Conversation Summary (Context: ~70%)

## Tasks Completed
1. [Task 1] - Status, files affected
2. [Task 2] - Status, files affected
3. [Task 3] - Status, files affected

## Key Decisions Made
- [Decision 1]
- [Decision 2]

## Files Modified
- [File 1] - Changes
- [File 2] - Changes

## Next Steps
- [Suggestion 1]
- [Suggestion 2]

---

💡 **Recommendation**: We're approaching 70% context usage (~140k tokens).
Consider starting a fresh conversation for your next task.

Would you like to:
1. Continue in this conversation (will hit 80-90% soon)
2. Start fresh with this summary as reference
```

---

## Context-Aware Behavior

### When Context is High (60-70%)

**Adjust behavior:**
- ✅ Be more concise in responses
- ✅ Avoid unnecessary explanations
- ✅ Skip redundant examples
- ✅ Focus on essential information only
- ✅ Offer summary proactively

**Don't sacrifice:**
- ❌ Workflow compliance (still follow 8 phases)
- ❌ MCP tool usage (still use intelligent-context, etc.)
- ❌ Approval requirements (still wait for "yes")
- ❌ Error handling (still recover properly)

### When Context is Critical (70%+)

**Mandatory actions:**
1. Complete current task
2. Offer comprehensive summary
3. Strongly recommend starting fresh
4. Explain benefits of fresh start

**Format:**
```
⚠️ Context Usage: ~70% (approaching limit)

I've completed [current task]. Before continuing, I recommend starting
a fresh conversation because:

✅ Better performance (faster responses)
✅ Cleaner context (no old information)
✅ More headroom (full 200k tokens available)
✅ Avoid mid-task auto-compaction

I can provide a summary of everything we've done to carry forward.
Would you like me to generate it?
```

---

## Conversation Length Tracking

### Self-Monitoring

**Keep mental count of:**
- User messages received
- Agent responses sent
- Tool calls made
- Files read/written

**Checkpoints:**
```
Every 10 exchanges:
└─ Assess if conversation is focused or wandering

Every 15 exchanges:
└─ Consider if tasks could be split into new conversation

Every 20 exchanges:
└─ Prepare to offer summary

At 25-30 exchanges:
└─ MUST offer summary and recommend fresh start
```

---

## Benefits of Fresh Conversations

**Explain to user:**
```
Starting a fresh conversation provides:

1. Performance
   ├─ Faster response times
   ├─ Less context to process
   └─ More efficient token usage

2. Quality
   ├─ Cleaner context (no old/irrelevant info)
   ├─ Better focus on current task
   └─ Reduced confusion from past discussions

3. Reliability
   ├─ Avoid mid-task auto-compaction
   ├─ Prevent context overflow
   └─ Maintain full workflow capability

4. Organization
   ├─ Clear task boundaries
   ├─ Easier to reference later
   └─ Better conversation history
```

---

## When NOT to Suggest Fresh Start

**Continue in same conversation when:**
- Task is almost complete (1-2 exchanges left)
- User is in the middle of approval process
- Critical debugging in progress
- Context is still under 60%

**Use judgment:**
- Don't interrupt important work
- Don't suggest fresh start repeatedly
- Wait for natural breakpoints

---

## Key Principles

1. **Monitor Proactively** - Track conversation length continuously
2. **Offer Early** - Suggest summary at 60-70%, not 80-90%
3. **Be Helpful** - Explain benefits of fresh start
4. **Stay Focused** - Be concise when context is high
5. **Complete Tasks** - Finish current work before suggesting fresh start

---

## Example: Proactive Summary Offer

```
User: "Can you help me with another feature?"

Agent: "I'd be happy to help! However, I notice we're at ~25 exchanges
in this conversation (approaching 70% context usage).

We've completed:
✅ Steering file optimization (10/10)
✅ Pre-execution hook creation
✅ Git commit and push

For best performance on your new feature, I recommend starting a fresh
conversation. I can provide a summary of our work to carry forward.

Would you like to:
1. Start fresh (recommended for new feature)
2. Continue here (we have ~10-15 exchanges left before auto-compaction)
"
```

---

## Summary

**Goal**: Stay under 70% context usage through proactive management

**Method**: 
- Monitor conversation length
- Offer summaries at 60-70%
- Recommend fresh starts at natural breakpoints
- Be concise when context is high

**Result**: Better performance, cleaner context, avoid mid-task compaction
