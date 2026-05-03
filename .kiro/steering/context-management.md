---
name: Context Management
description: Manual context estimation and proactive summary offering
type: global
inclusion: always
priority: high
version: 2.1
lastUpdated: 2026-05-03
---

# Context Management - Global Rules

## Core Principle

**I will manually estimate context usage and proactively offer summaries**

I don't have access to real-time token counts. Instead, I estimate based on conversation indicators and offer summaries when I think we're approaching limits.

---

## Manual Context Estimation

### How I Estimate Context Usage

**I use rough heuristics to estimate (not measure) context usage:**

```
Low usage (estimated 0-30%):
├─ Exchanges: 0-15 messages
├─ Tool calls: 0-20 calls
├─ Files read: 0-10 files
└─ My action: Continue normally

Medium usage (estimated 30-60%):
├─ Exchanges: 15-30 messages
├─ Tool calls: 20-50 calls
├─ Files read: 10-25 files
└─ My action: Be concise, avoid unnecessary verbosity

High usage (estimated 60-70%):
├─ Exchanges: 25-30 messages
├─ Tool calls: 40-60 calls
├─ Files read: 20-30 files
└─ My action: Offer summary and suggest fresh start

Critical usage (estimated 70%+):
├─ Exchanges: 30+ messages
├─ Tool calls: 60+ calls
├─ Files read: 30+ files
└─ My action: MUST offer summary, strongly recommend fresh start
```

**Important Notes:**
- These are **rough estimates**, not precise measurements
- I cannot see actual token counts or context window usage
- My estimates may be inaccurate (could be off by 20-30%)
- **Better indicator:** If responses slow down, that's a sign of high context usage
- This is **guidance for me to follow**, not an automatic system feature

---

## Proactive Summary Offering

### When I'll Offer Summaries

**I will proactively offer to summarize when I estimate we're approaching 70%:**

1. Around 25-30 message exchanges
2. After reading 20+ files
3. After 50+ tool calls
4. When conversation feels "heavy" with lots of context
5. Multiple complex tasks completed
6. User asks "what have we done?"

**Note:** This is based on my manual estimation, not automatic detection. I may offer too early or too late.

### Summary Format

When I estimate we're at ~70%, I'll offer:

```
📊 Conversation Summary (Estimated Context: ~70%)

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

💡 **Recommendation**: Based on my estimation (~25-30 exchanges, ~50 tool calls), 
we may be approaching 70% context usage.

Consider starting a fresh conversation for your next task.

Would you like to:
1. Continue in this conversation (may hit limits soon)
2. Start fresh with this summary as reference
```

**Disclaimer:** My estimate may be inaccurate. If you notice responses are still fast, we likely have more room.

---

## Context-Aware Behavior

### When Context Feels High (estimated 60-70%)

**I'll adjust my behavior:**
- ✅ Be more concise in responses
- ✅ Avoid unnecessary explanations
- ✅ Skip redundant examples
- ✅ Focus on essential information only
- ✅ Offer summary proactively

**I won't sacrifice:**
- ❌ Workflow compliance (still follow phases)
- ❌ MCP tool usage (still use intelligent-context, etc.)
- ❌ Approval requirements (still wait for "yes")
- ❌ Error handling (still recover properly)

### When Context Feels Critical (estimated 70%+)

**I'll take these actions:**
1. Complete current task
2. Offer comprehensive summary
3. Strongly recommend starting fresh
4. Explain benefits of fresh start

**Format:**
```
⚠️ Estimated Context Usage: ~70% (based on ~30 exchanges, ~60 tool calls)

I've completed [current task]. Before continuing, I recommend starting
a fresh conversation because:

✅ Better performance (faster responses)
✅ Cleaner context (no old information)
✅ More headroom (full 200k tokens available)
✅ Avoid mid-task auto-compaction

I can provide a summary of everything we've done to carry forward.
Would you like me to generate it?
```

**Note:** If responses are still fast, my estimate may be conservative.

---

## Conversation Length Tracking

### How I Track Manually

**I keep a mental count of:**
- User messages received
- Agent responses sent
- Tool calls made
- Files read/written

**My checkpoints:**
```
Every 10 exchanges:
└─ Assess if conversation is focused or wandering

Every 15 exchanges:
└─ Consider if tasks could be split into new conversation

Every 20 exchanges:
└─ Prepare to offer summary

At 25-30 exchanges:
└─ Offer summary and recommend fresh start
```

**Limitations:**
- I may lose count during complex tasks
- My estimates are rough approximations
- I can't see actual token usage
- Better to rely on response speed as an indicator

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

1. **Estimate Proactively** - Track conversation length continuously (but manually)
2. **Offer Early** - Suggest summary at estimated 60-70%, not 80-90%
3. **Be Helpful** - Explain benefits of fresh start
4. **Stay Focused** - Be concise when context feels high
5. **Complete Tasks** - Finish current work before suggesting fresh start
6. **Be Honest** - Acknowledge when my estimates may be inaccurate

---

## Reality Check

**What I CAN do:**
- ✅ Count messages manually
- ✅ Estimate based on conversation complexity
- ✅ Offer summaries proactively
- ✅ Recommend fresh starts at natural breakpoints

**What I CANNOT do:**
- ❌ See actual token counts
- ❌ Monitor real-time context usage
- ❌ Automatically trigger at 70%
- ❌ Know precise context window percentage

**Trust response speed over my estimates.** If responses are fast, we have room. If responses slow down, that's the real indicator of high context usage.

---

## Example: Proactive Summary Offer

```
User: "Can you help me with another feature?"

Agent: "I'd be happy to help! However, I notice we're at ~25 exchanges
in this conversation (my rough estimate suggests we may be approaching 
60-70% context usage, though I can't measure this precisely).

We've completed:
✅ Steering file optimization (10/10)
✅ Pre-execution hook creation
✅ Git commit and push

For best performance on your new feature, I recommend starting a fresh
conversation. I can provide a summary of our work to carry forward.

Would you like to:
1. Start fresh (recommended for new feature)
2. Continue here (we likely have room, but my estimate may be off)

Note: If responses are still fast, we probably have more headroom than 
I estimated."
```

---

## Summary

**Goal**: Manually estimate context usage and offer summaries proactively

**Method**: 
- Count messages and tool calls manually
- Estimate based on rough heuristics
- Offer summaries at estimated 60-70%
- Recommend fresh starts at natural breakpoints
- Be concise when context feels high

**Reality**: This is manual estimation, not automatic monitoring. Trust response speed over my estimates.

**Result**: Better performance, cleaner context, avoid mid-task compaction (when estimates are accurate)
