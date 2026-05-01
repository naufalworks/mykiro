# Intelligent Context MCP - Installation Guide

## ✅ Status: Ready for Integration

All enhanced features tested and working:
- ✅ Multi-hop reasoning with Sonnet 4.5
- ✅ Intelligent query analysis
- ✅ Context assembly and summarization
- ✅ Predictive context loading
- ✅ Dependency graph understanding
- ✅ Pattern extraction from history

---

## Installation for Kiro IDE

### Step 1: Verify Prerequisites

Ensure these services are running:

```bash
# Check Qdrant
curl http://localhost:6333/collections

# Check Redis
redis-cli ping

# Should return: PONG
```

### Step 2: Add MCP Server to Kiro IDE

Add this configuration to your Kiro IDE settings (usually `~/.kiro/settings/mcp.json`):

```json
{
  "mcpServers": {
    "intelligent-context": {
      "command": "node",
      "args": [
        "/Users/azfar.naufal/Documents/kiro_project/intelligent-context-mcp/dist/index.js"
      ],
      "env": {
        "VOYAGE_API_KEY": "pa-YeJ1pTIVrOiA4bQ-wnrd3j4Smhu2XWbhF8coDtFjmiK",
        "ANTHROPIC_API_KEY": "sk-6005783058ec762b-ej7cxd-99255e97",
        "ANTHROPIC_BASE_URL": "http://3.68.219.151:20128/v1",
        "QDRANT_URL": "http://localhost:6333",
        "QDRANT_COLLECTION": "code_context",
        "REDIS_HOST": "localhost",
        "REDIS_PORT": "6379"
      }
    }
  }
}
```

### Step 3: Restart Kiro IDE

Restart Kiro IDE to load the new MCP server.

### Step 4: Verify Installation

In Kiro IDE, the following tools should be available:

1. **intelligent_search** - AI-powered search with multi-hop reasoning
2. **search_context** - Fast basic semantic search
3. **find_similar** - Find similar code snippets
4. **extract_patterns** - Learn from search history

---

## Available Tools

### 1. intelligent_search (Recommended)

**Full AI-powered search with reasoning**

```json
{
  "query": "find authentication with JWT validation",
  "limit": 5
}
```

**Returns:**
- Query analysis (intent, strategy)
- Search results with scores
- Context assembly (summary, key findings)
- Dependency analysis
- Predictive suggestions (what you'll need next)

**Use when:** You need complete context and understanding

---

### 2. search_context (Fast)

**Basic semantic search without AI reasoning**

```json
{
  "query": "JWT validation",
  "limit": 5
}
```

**Returns:**
- Search results with similarity scores
- File paths and descriptions

**Use when:** Quick lookups, you know exactly what you need

---

### 3. find_similar

**Find code similar to a snippet or description**

```json
{
  "code_or_description": "async function handleLogin(email, password)",
  "limit": 3
}
```

**Returns:**
- Similar code snippets
- Similarity scores

**Use when:** Finding examples or similar implementations

---

### 4. extract_patterns

**Analyze search history and learn patterns**

```json
{}
```

**Returns:**
- Common search patterns
- Frequent concepts
- Suggested steering rules

**Use when:** Optimizing your workflow, understanding your codebase usage

---

## Configuration

### Model Configuration

- **Model:** `kr/claude-sonnet-4.5`
- **Endpoint:** Bedrock via MITM proxy
- **Format:** OpenAI-compatible (non-streaming)

### Embeddings

- **Provider:** Voyage AI
- **Model:** voyage-4-large
- **Dimensions:** 1024
- **Cost:** ~$1-2/year for typical usage

### Reasoning (AI Features)

- **Provider:** Bedrock (via proxy)
- **Model:** Claude Sonnet 4.5
- **Cost:** ~$0.006-0.012 per intelligent search
- **Estimated:** ~$220-450/year for 100 searches/day

### Caching Strategy

- **Basic searches:** 24h TTL in Redis
- **Intelligent searches:** 1h TTL (more dynamic)
- **Search history:** Last 100 searches stored

---

## Performance

### Speed Targets

- **Basic search:** 50-200ms (cached) / 500-1000ms (uncached)
- **Intelligent search:** 3-8 seconds (includes AI reasoning)
- **Pattern extraction:** 2-5 seconds

### Accuracy

- **Semantic search:** High (voyage-4-large embeddings)
- **Intent understanding:** Very high (Sonnet 4.5)
- **Dependency detection:** High (AI-powered analysis)

---

## Troubleshooting

### MCP Server Won't Start

```bash
# Check if services are running
docker ps | grep qdrant
redis-cli ping

# Check logs
node dist/index.js 2>&1 | head -20
```

### No Results Found

```bash
# Check if collection has data
curl http://localhost:6333/collections/code_context

# Re-index sample data
npm test
```

### API Errors

```bash
# Test Voyage AI
curl https://api.voyageai.com/v1/embeddings \
  -H "Authorization: Bearer $VOYAGE_API_KEY" \
  -d '{"input":["test"],"model":"voyage-4-large"}'

# Test Bedrock endpoint
curl http://3.68.219.151:20128/v1/messages \
  -H "x-api-key: sk-6005783058ec762b-ej7cxd-99255e97" \
  -d '{"model":"kr/claude-sonnet-4.5","max_tokens":50,"messages":[{"role":"user","content":"hi"}],"stream":false}'
```

---

## Next Steps

1. **Index your codebase** - Add your actual project files to Qdrant
2. **Test intelligent search** - Try complex queries
3. **Monitor patterns** - Use extract_patterns to learn usage
4. **Optimize** - Adjust caching based on your workflow

---

## Files Reference

- **Source:** `/Users/azfar.naufal/Documents/kiro_project/intelligent-context-mcp/src/`
- **Compiled:** `/Users/azfar.naufal/Documents/kiro_project/intelligent-context-mcp/dist/`
- **Config:** `/Users/azfar.naufal/Documents/kiro_project/intelligent-context-mcp/.env`
- **Tests:** `npm test` (basic) / `npm run test:enhanced` (AI features)

---

## Support

For issues or questions:
1. Check logs: `node dist/index.js 2>&1`
2. Verify services: Qdrant, Redis, Voyage AI, Bedrock
3. Review test output: `npm run test:enhanced`
