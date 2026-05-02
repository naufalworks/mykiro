---
name: Auto-Indexing System
description: Automatic background indexing of steering files into adaptive-memory
type: global
inclusion: manual
priority: medium
---

# Auto-Indexing System for Steering Files

## Overview

This system automatically indexes steering files into adaptive-memory whenever they are created, edited, or deleted. It works silently in the background without manual intervention.

---

## How It Works

### File-Based Hooks

Three hooks monitor `~/.kiro/steering/*.md` files:

1. **auto-index-steering-edited** (fileEdited event)
   - Triggers when a steering file is modified
   - Reads the updated file
   - Updates the index in adaptive-memory
   - Silent operation (no user notification)

2. **auto-index-steering-created** (fileCreated event)
   - Triggers when a new steering file is added
   - Reads the new file
   - Indexes it into adaptive-memory
   - Silent operation (no user notification)

3. **auto-index-steering-deleted** (fileDeleted event)
   - Triggers when a steering file is removed
   - Notes the deletion internally
   - Old memories naturally become less relevant over time
   - Silent operation (no user notification)

---

## Efficiency

**Zero overhead when no changes occur**
- Hooks only trigger on actual file changes
- No periodic checking or polling
- No latency added to user messages
- Much more efficient than the old promptSubmit approach

**Old approach (removed):**
- Used promptSubmit hook (ran before EVERY user message)
- Checked for file changes even when nothing changed
- Added latency to every interaction
- Inefficient and intrusive

**New approach (current):**
- File-based hooks (only trigger on actual changes)
- Zero overhead when files are unchanged
- Instant indexing when files are modified
- True "auto discovery" functionality

---

## What Gets Indexed

When a steering file is indexed, the system stores:

**Type:** `context`
**Content:** Full file content including frontmatter
**Tags:** Extracted from frontmatter + ["steering", "documentation", "global-rules"]
**Priority:** Based on frontmatter priority field

**Example:**
```typescript
mcp_adaptive_memory_store_memory({
  type: "context",
  content: "Full content of workflow.md including frontmatter...",
  priority: "critical",
  tags: ["steering", "workflow", "global-rules", "documentation"]
})
```

---

## Memory Storage

Indexed steering files are stored in:

**Qdrant Vector DB:**
- 1024-dimensional embeddings (Voyage API)
- Semantic search enabled
- Fast retrieval (50-200ms)

**Redis Cache:**
- Hot cache for frequently accessed content
- Adaptive TTL (1h - 7d based on access patterns)
- Ultra-fast retrieval (<10ms)

**JSON Index:**
- Metadata and keywords
- Fallback search layer
- Persistent storage

---

## Benefits

✅ **Automatic Discovery**
- New steering files are indexed immediately
- No manual commands needed
- Works like "auto summarized" feature

✅ **Always Up-to-Date**
- Edits are re-indexed automatically
- Index stays synchronized with files
- No stale content

✅ **Efficient**
- Zero overhead when no changes
- Only processes changed files
- No impact on user experience

✅ **Silent Operation**
- Works in background
- No notifications unless errors
- Seamless user experience

✅ **Intelligent Recall**
- Semantic search via Qdrant
- Fast retrieval via Redis cache
- Complete search via JSON index

---

## Verification

To verify the system is working:

1. **Check hooks are enabled:**
   ```bash
   ls ~/.kiro/hooks/ | grep auto-index-steering
   ```
   Should show 3 hooks: created, edited, deleted

2. **Test by editing a steering file:**
   - Edit any file in `~/.kiro/steering/`
   - Save the file
   - Hook triggers automatically (silent)
   - File is re-indexed in adaptive-memory

3. **Query indexed content:**
   ```typescript
   mcp_adaptive_memory_retrieve_memory({
     query: "workflow rules",
     limit: 5
   })
   ```
   Should return relevant steering file content

---

## Troubleshooting

### Hook not triggering

**Check hook is enabled:**
- Open `.kiro/hooks/auto-index-steering-edited.kiro.hook`
- Verify `"enabled": true`

**Check file pattern:**
- Hooks watch `~/.kiro/steering/*.md`
- Only `.md` files are indexed
- Files must be in the steering directory

### Content not indexed

**Check adaptive-memory MCP:**
- Verify adaptive-memory server is running
- Check `~/.kiro/settings/mcp.json`
- Ensure Qdrant and Redis are accessible

**Check for errors:**
- Hooks report errors if indexing fails
- Check Kiro logs for error messages

---

## Maintenance

**No maintenance required!**

The system is fully automatic:
- Hooks are always active
- No periodic tasks needed
- No manual indexing required
- No cleanup needed (old memories naturally age out)

---

## Implementation Details

**Created:** 2026-05-02
**Version:** 1.0
**Status:** Active

**Files:**
- `.kiro/hooks/auto-index-steering-edited.kiro.hook`
- `.kiro/hooks/auto-index-steering-created.kiro.hook`
- `.kiro/hooks/auto-index-steering-deleted.kiro.hook`

**Dependencies:**
- adaptive-memory MCP server
- Qdrant vector database
- Redis cache
- Voyage API (for embeddings)

---

## Summary

The auto-indexing system provides true "auto discovery" for steering files:

1. **Create/edit a steering file** → Automatically indexed
2. **Delete a steering file** → Gracefully handled
3. **Query for content** → Fast semantic search
4. **Zero overhead** → Only processes actual changes
5. **Silent operation** → Works in background

**Result:** Your steering files are always indexed and searchable without any manual intervention!
