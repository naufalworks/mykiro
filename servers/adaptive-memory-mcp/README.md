# Adaptive Memory MCP

AI-powered memory system with self-organizing clusters, predictive loading, and pattern learning.

## Features

- **Self-Organizing Clusters** - AI automatically categorizes and groups related memories
- **Predictive Context Loading** - Anticipates what you'll need next
- **Pattern Extraction** - Learns from your workflow and suggests improvements
- **Temporal Reasoning** - Understands time-based queries ("recent", "last week")
- **Proactive Issue Detection** - Warns about potential problems before you encounter them

## Tools

### 1. store_memory

Store tasks, issues, context, or patterns with AI-powered enhancement.

```json
{
  "type": "task",
  "content": "Build authentication system with JWT",
  "tags": ["auth", "api"],
  "priority": "high"
}
```

**AI Enhancement:**
- Suggests additional relevant tags
- Adjusts priority based on content
- Identifies related concepts
- Assigns to appropriate cluster

### 2. retrieve_memory

Retrieve memories with natural language queries.

```json
{
  "query": "database problems",
  "limit": 5
}
```

**AI Understanding:**
- Analyzes query intent
- Extracts keywords
- Filters by relevant types
- Updates access metadata

### 3. organize_memories

Organize all memories into self-organizing clusters.

```json
{}
```

**Returns:**
- Clusters with descriptions
- Pattern insights
- Actionable recommendations

## Test Results

```
✅ Qdrant connected
✅ Redis connected
✅ Bedrock API working
✅ Memory storage with AI enhancement
✅ Memory retrieval with query analysis
✅ Memory organization with clustering
```

## Configuration

- **Model:** kr/claude-sonnet-4.5 (Bedrock)
- **Storage:** Redis (hot) + Qdrant (vector)
- **TTL:** 7 days for hot storage
- **Index:** Last 1000 memories

## Installation

See `INSTALLATION.md` for Kiro IDE integration.

## Status

**Ready for integration** - All tests passing ✅
