---
name: Memory System Technical
description: Technical configuration, search layers, and maintenance procedures
type: global
inclusion: manual
priority: low
version: 2.0
lastUpdated: 2026-05-03
---

# Memory System - Technical Configuration

## Configuration

### Qdrant Setup

```json
{
  "host": "localhost",
  "port": 6333,
  "collection": "kiro_memory",
  "vector_size": 768,
  "distance": "Cosine",
  "on_disk_payload": true
}
```

**Purpose**: Vector database for semantic search
**Embedding Model**: Ollama nomic-embed-text (768 dimensions)
**Search Speed**: 50-200ms
**Storage**: ~3KB per item

### Redis Setup

```json
{
  "host": "localhost",
  "port": 6379,
  "db": 0,
  "ttl_strategy": "adaptive",
  "ttl_hot": 604800,
  "ttl_warm": 86400,
  "ttl_cold": 3600,
  "access_threshold_hot": 5,
  "access_threshold_warm": 2
}
```

**Purpose**: Hot cache for frequently accessed items
**TTL Strategy**: Adaptive based on access patterns
**Search Speed**: <10ms
**Storage**: In-memory

### Ollama Setup

```json
{
  "host": "localhost",
  "port": 11434,
  "model": "nomic-embed-text",
  "dimensions": 768,
  "batch_size": 32
}
```

**Purpose**: Generate embeddings for semantic search
**Model**: nomic-embed-text
**Dimensions**: 768
**Batch Processing**: 32 items at a time

---

## Search & Recall System

### Search Layers

**Layer 1: Redis Cache (Fastest)**
```
Query: "auth button login"
├─ Check: Cached queries
├─ Speed: <10ms
└─ Result: Hit or Miss

If Hit:
└─ Return cached results

If Miss:
└─ Proceed to Layer 2
```

**Layer 2: Qdrant Vector Search (Fast)**
```
Query: "auth button login"
├─ Generate embedding (Ollama)
├─ Semantic search in Qdrant
├─ Find similar items (cosine similarity)
├─ Speed: 50-200ms
└─ Result: Ranked by relevance

Results:
├─ Exact matches (95-100% similarity)
├─ High matches (80-94% similarity)
├─ Medium matches (60-79% similarity)
└─ Low matches (40-59% similarity)

Cache result in Redis for next time
```

**Layer 3: JSON Index (Fallback)**
```
Query: "auth button login"
├─ Keyword search in index
├─ Metadata filtering
├─ Speed: 100-300ms
└─ Result: Exact keyword matches

Use when:
├─ Vector search fails
├─ Need exact keyword match
└─ Searching by ID or metadata
```

---

## Adaptive Cache TTL

### TTL Strategy

**Hot Queries (accessed >5 times/day):**
```
TTL: 7 days (604800 seconds)
Reason: Frequently used, keep in cache
Examples:
├─ "auth system"
├─ "button component"
└─ "login flow"
```

**Warm Queries (accessed 2-5 times/day):**
```
TTL: 24 hours (86400 seconds)
Reason: Regularly used, refresh daily
Examples:
├─ "user profile"
├─ "api endpoints"
└─ "test utilities"
```

**Cold Queries (accessed once):**
```
TTL: 1 hour (3600 seconds)
Reason: Rarely used, don't waste memory
Examples:
├─ "old migration script"
├─ "deprecated component"
└─ "archived feature"
```

**Active Context (current work):**
```
TTL: Until task completes
Reason: Needed throughout task
Examples:
├─ Current task context
├─ Related files
└─ Active issues
```

### TTL Adjustment

```
Access tracking:
├─ Count accesses per query
├─ Track last access time
└─ Adjust TTL dynamically

Promotion:
Cold → Warm: After 2 accesses in 24h
Warm → Hot: After 5 accesses in 24h

Demotion:
Hot → Warm: No access in 7 days
Warm → Cold: No access in 24h
Cold → Expire: After TTL
```

---

## Memory Maintenance

### Daily Cleanup (Automatic)

```
1. Check completed tasks > 30 days
   └─ Archive eligible tasks

2. Check resolved issues > 30/90 days
   └─ Archive based on priority

3. Update Redis cache
   ├─ Remove expired entries
   └─ Adjust TTLs based on access

4. Compress old archives > 1 year
   └─ .json → .json.gz

5. Update indexes
   └─ Rebuild if needed

6. Generate statistics
   └─ For reporting

Run time: ~5 minutes
Frequency: Daily at 2 AM local time
```

### Weekly Analysis (Automatic)

```
1. Identify success patterns
   └─ Tasks completed efficiently

2. Identify problem patterns
   └─ Recurring issues

3. Suggest steering updates
   └─ Based on patterns

4. Generate insights report
   └─ For user review

Run time: ~15 minutes
Frequency: Weekly on Sunday
```

---

## Storage Estimates

### Per-Item Storage

```
Active memory:
├─ Issue: ~2KB (JSON)
├─ Task: ~1.5KB (JSON)
└─ Context: ~3KB (JSON)

Qdrant:
├─ Vector: 768 dimensions × 4 bytes = 3KB
├─ Metadata: ~500 bytes
└─ Total: ~3.5KB per item

Redis:
├─ Cached query: ~1KB
├─ TTL metadata: ~100 bytes
└─ Total: ~1.1KB per cached query

Archive:
├─ Compressed JSON: ~500 bytes per item
└─ Metadata: ~200 bytes
```

### Total Storage Estimates

```
For 100,000 items:
├─ Active: 50KB (current items only)
├─ Index: 50MB (metadata)
├─ Qdrant: 300MB (vectors + metadata)
├─ Archives: 100MB (compressed)
└─ Redis: 50MB (hot cache)

Total: ~500MB (very manageable)
```

### Growth Rate

```
Typical usage:
├─ 10 tasks per day
├─ 5 issues per day
├─ 15 items per day total

Annual growth:
├─ Items: 5,475 per year
├─ Storage: ~27MB per year
└─ 10 years: ~270MB
```

---

## When Memory is Full

**Never happens** - Memory grows indefinitely

**But if storage is limited:**
1. Compress old archives (.json → .json.gz)
2. Move very old archives to cold storage
3. Keep indexes and embeddings
4. Everything remains searchable
5. Decompress on-demand when accessed

**Compression ratios:**
```
JSON → JSON.gz:
├─ Typical: 5:1 compression
├─ 100MB → 20MB
└─ Still searchable via index
```

---

## Performance Optimization

### Embedding Generation

**Batch Processing:**
```
Single item: ~100ms
Batch of 32: ~500ms (15ms per item)
Recommendation: Batch when possible
```

**Caching:**
```
Cache embeddings for:
├─ Frequently searched queries
├─ Common patterns
└─ Active context

Result: 90% cache hit rate
```

### Vector Search

**Optimization:**
```
Index type: HNSW (Hierarchical Navigable Small World)
├─ Fast approximate search
├─ 50-200ms for 100k vectors
└─ 95%+ accuracy

Parameters:
├─ ef_construct: 100
├─ m: 16
└─ ef: 64
```

### Redis Cache

**Optimization:**
```
Eviction policy: allkeys-lru
├─ Least Recently Used
├─ Automatic cleanup
└─ No manual intervention

Memory limit: 512MB
├─ Adjust based on system
├─ Monitor usage
└─ Scale if needed
```

---

## Monitoring

### Key Metrics

**Search Performance:**
```
├─ Redis hit rate: >80% (good)
├─ Qdrant search time: <200ms (good)
├─ Index search time: <300ms (good)
└─ Overall latency: <250ms (good)
```

**Storage Usage:**
```
├─ Active memory: <100KB (good)
├─ Qdrant size: Monitor growth
├─ Redis memory: <512MB (good)
└─ Archive size: Monitor growth
```

**Cache Efficiency:**
```
├─ Hot queries: >5 accesses/day
├─ Warm queries: 2-5 accesses/day
├─ Cold queries: 1 access/day
└─ TTL adjustments: Automatic
```

### Health Checks

**Daily:**
```
1. Check Qdrant connection
2. Check Redis connection
3. Check Ollama connection
4. Verify index integrity
5. Check archive accessibility
```

**Weekly:**
```
1. Analyze search performance
2. Review cache hit rates
3. Check storage growth
4. Identify optimization opportunities
5. Generate health report
```

---

## Troubleshooting

### Slow Search Performance

**Symptoms:**
- Search takes >500ms
- Redis cache misses
- Qdrant timeouts

**Solutions:**
1. Check Qdrant index health
2. Increase Redis memory
3. Optimize query patterns
4. Batch embedding generation
5. Review network latency

### High Memory Usage

**Symptoms:**
- Redis memory >512MB
- System memory pressure
- Slow performance

**Solutions:**
1. Reduce Redis TTL for cold queries
2. Increase eviction rate
3. Archive more aggressively
4. Compress old data
5. Scale Redis if needed

### Missing Search Results

**Symptoms:**
- Expected items not found
- Incomplete search results
- Index inconsistencies

**Solutions:**
1. Rebuild index
2. Regenerate embeddings
3. Check archive integrity
4. Verify Qdrant collection
5. Review search query

---

## Backup & Recovery

### Backup Strategy

**Daily:**
```
1. Backup active memory
   └─ ~/.kiro/memory/active/

2. Backup indexes
   └─ ~/.kiro/memory/index/

3. Backup Qdrant snapshots
   └─ Qdrant built-in snapshots

4. Backup Redis (optional)
   └─ Can be regenerated
```

**Weekly:**
```
1. Full archive backup
   └─ ~/.kiro/memory/archive/

2. Verify backup integrity
3. Test restore procedure
4. Rotate old backups
```

### Recovery Procedure

**If active memory lost:**
```
1. Restore from latest backup
2. Rebuild index from active + archive
3. Regenerate embeddings
4. Warm up Redis cache
5. Verify search functionality
```

**If Qdrant lost:**
```
1. Restore Qdrant snapshot
2. If no snapshot: Regenerate all embeddings
3. Rebuild collection
4. Verify search accuracy
5. Warm up cache
```

**If Redis lost:**
```
1. No action needed (cache only)
2. Will rebuild automatically
3. Performance impact temporary
4. Cache warms up over time
```

---

## Scaling Considerations

### When to Scale

**Qdrant:**
```
Scale when:
├─ >1M vectors
├─ Search time >500ms
├─ Memory pressure
└─ High query volume

Options:
├─ Increase resources
├─ Shard collection
└─ Distributed setup
```

**Redis:**
```
Scale when:
├─ Memory >80% capacity
├─ High eviction rate
├─ Cache hit rate <70%
└─ High query volume

Options:
├─ Increase memory
├─ Redis cluster
└─ Multiple instances
```

**Storage:**
```
Scale when:
├─ Archive >10GB
├─ Slow archive access
├─ Disk space limited
└─ Backup time >1 hour

Options:
├─ Compress aggressively
├─ Move to object storage
└─ Tiered storage
```

---

## Summary

**This file contains:**
- Qdrant, Redis, Ollama configuration
- Search layer implementation details
- Adaptive cache TTL strategy
- Maintenance procedures
- Storage estimates and growth
- Performance optimization
- Monitoring and health checks
- Troubleshooting guides
- Backup and recovery procedures
- Scaling considerations

**For other information:**
- **Overview and principles**: See #memory-system-overview.md
- **Schemas and formats**: See #memory-system-schemas.md

