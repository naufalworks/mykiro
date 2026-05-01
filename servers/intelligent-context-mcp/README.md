# Intelligent Context MCP

AI-powered context retrieval with multi-hop reasoning, powered by Voyage-4-large embeddings and Qdrant vector search.

## Features

- **Multi-hop Reasoning**: Intelligent context assembly from multiple sources
- **Semantic Search**: Voyage-4-large (1024-dim) embeddings for accurate code understanding
- **Redis Caching**: Fast retrieval with adaptive TTL
- **Qdrant Integration**: Efficient vector storage and search

## Prerequisites

- Node.js 18+
- Qdrant running on localhost:6333
- Redis running on localhost:6379
- Voyage AI API key

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```
VOYAGE_API_KEY=your-voyage-api-key
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=code_context
REDIS_HOST=localhost
REDIS_PORT=6379
```

## Usage

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm start
```

## Tools

### search_context

Intelligent multi-hop context search with semantic understanding.

**Parameters:**
- `query` (string, required): Natural language query
- `limit` (number, optional): Max results (default: 5)

**Example:**
```json
{
  "query": "authentication middleware with JWT validation",
  "limit": 5
}
```

### find_similar

Find code similar to a given snippet or description.

**Parameters:**
- `code_or_description` (string, required): Code or description
- `limit` (number, optional): Max results (default: 3)

**Example:**
```json
{
  "code_or_description": "async function handleLogin()",
  "limit": 3
}
```

## Architecture

```
User Query
    ↓
Redis Cache (Check)
    ↓ (miss)
Voyage-4-large (Generate embedding)
    ↓
Qdrant (Vector search)
    ↓
Redis Cache (Store, 24h TTL)
    ↓
Return Results
```

## License

ISC
