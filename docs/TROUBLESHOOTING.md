# Troubleshooting Guide

Common issues and solutions for Kiro Intelligent MCP Suite.

---

## Installation Issues

### Node.js Version Error

**Problem**: `Error: Node.js version must be >= 18.0.0`

**Solution**:
```bash
# Check current version
node --version

# Install latest Node.js from https://nodejs.org/
# Or use nvm:
nvm install 18
nvm use 18
```

---

### Docker Not Running

**Problem**: `Cannot connect to Docker daemon`

**Solution**:
```bash
# Start Docker Desktop (macOS/Windows)
# Or start Docker service (Linux):
sudo systemctl start docker

# Verify Docker is running:
docker ps
```

---

### Permission Denied on install.sh

**Problem**: `Permission denied: ./install.sh`

**Solution**:
```bash
chmod +x install.sh
chmod +x uninstall.sh
./install.sh
```

---

## Runtime Issues

### MCP Server Not Responding

**Problem**: Tools not appearing in Kiro IDE or timing out

**Diagnosis**:
```bash
# 1. Check if servers are configured
cat ~/.kiro/settings/mcp.json

# 2. Check Docker services
docker ps | grep -E "qdrant|redis"

# 3. Test server manually
cd servers/intelligent-context-mcp
npm run dev
# Should see: "Intelligent Context MCP server running!"
```

**Solutions**:

1. **Restart Kiro IDE**:
   - Quit Kiro IDE completely
   - Restart and wait 10 seconds for servers to initialize

2. **Rebuild servers**:
   ```bash
   cd servers/intelligent-context-mcp
   npm run build
   ```

3. **Check logs**:
   ```bash
   # Kiro IDE logs (macOS)
   tail -f ~/Library/Logs/Kiro/mcp-*.log
   
   # Linux
   tail -f ~/.local/share/Kiro/logs/mcp-*.log
   ```

---

### Slow Response Times

**Problem**: Tools taking 30+ seconds to respond

**Diagnosis**:
```bash
# Check Redis connection
redis-cli ping
# Should return: PONG

# Check Qdrant
curl http://localhost:6333/health
# Should return: {"status":"ok"}

# Check Bedrock endpoint
curl -X POST http://3.68.219.151:20128/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -d '{"model":"kr/claude-sonnet-4.5","max_tokens":10,"messages":[{"role":"user","content":"hi"}]}'
```

**Solutions**:

1. **Clear Redis cache**:
   ```bash
   redis-cli FLUSHALL
   ```

2. **Restart Docker services**:
   ```bash
   docker restart qdrant redis
   ```

3. **Reduce query complexity**:
   - Use `depth: 1` instead of `depth: 3`
   - Reduce `maxResults` parameter
   - Provide more specific queries

---

### Vector Search Not Working

**Problem**: `intelligent_search` returns no results or errors

**Diagnosis**:
```bash
# Check Qdrant collections
curl http://localhost:6333/collections

# Check if code_context collection exists
curl http://localhost:6333/collections/code_context

# Check point count
curl http://localhost:6333/collections/code_context/points/count
```

**Solutions**:

1. **Index sample data**:
   ```bash
   cd servers/intelligent-context-mcp
   npm test  # This indexes sample code
   ```

2. **Recreate collection**:
   ```bash
   # Delete collection
   curl -X DELETE http://localhost:6333/collections/code_context
   
   # Restart server to recreate
   cd servers/intelligent-context-mcp
   npm run dev
   ```

3. **Check Qdrant logs**:
   ```bash
   docker logs qdrant
   ```

---

### Memory Issues

**Problem**: High memory usage or out-of-memory errors

**Solutions**:

1. **Increase Docker memory limit**:
   - Docker Desktop → Settings → Resources
   - Increase memory to 4GB+

2. **Clear old data**:
   ```bash
   # Clear Redis
   redis-cli FLUSHALL
   
   # Clear Qdrant (WARNING: deletes all data)
   curl -X DELETE http://localhost:6333/collections/code_context
   curl -X DELETE http://localhost:6333/collections/memories
   ```

3. **Restart services**:
   ```bash
   docker restart qdrant redis
   ```

---

## API Issues

### Invalid API Key

**Problem**: `401 Unauthorized` or `Invalid API key`

**Solution**:
```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Update in Kiro config
nano ~/.kiro/settings/mcp.json
# Update ANTHROPIC_API_KEY in each server's env

# Restart Kiro IDE
```

---

### Rate Limiting

**Problem**: `429 Too Many Requests`

**Solutions**:

1. **Wait and retry**: Rate limits reset after 1 minute
2. **Use caching**: Enable Redis caching (default)
3. **Reduce concurrent requests**: Process queries sequentially

---

### Bedrock Endpoint Unreachable

**Problem**: `ECONNREFUSED` or timeout errors

**Diagnosis**:
```bash
# Test endpoint
curl -v http://3.68.219.151:20128/v1/health

# Check network connectivity
ping 3.68.219.151
```

**Solutions**:

1. **Use alternative endpoint**:
   ```bash
   export ANTHROPIC_BASE_URL="https://api.anthropic.com"
   ```

2. **Check firewall/VPN**: Ensure endpoint is accessible

3. **Update config**:
   ```bash
   nano ~/.kiro/settings/mcp.json
   # Update ANTHROPIC_BASE_URL
   ```

---

## Data Issues

### Lost Memories

**Problem**: Stored memories not retrieving

**Diagnosis**:
```bash
# Check Qdrant memories collection
curl http://localhost:6333/collections/memories/points/count

# Check Redis keys
redis-cli KEYS "memory:*"
```

**Solutions**:

1. **Check collection exists**:
   ```bash
   curl http://localhost:6333/collections/memories
   ```

2. **Restore from backup** (if available):
   ```bash
   # Qdrant snapshots
   curl http://localhost:6333/collections/memories/snapshots
   ```

---

### Inconsistent Results

**Problem**: Same query returns different results

**Explanation**: This is expected behavior due to:
- AI model non-determinism
- Cache expiration
- Dynamic memory organization

**Solutions**:

1. **Use more specific queries**: Reduce ambiguity
2. **Increase cache TTL**: Edit server code to cache longer
3. **Pin important results**: Store critical findings in memory

---

## Configuration Issues

### Config Not Loading

**Problem**: Changes to `mcp.json` not taking effect

**Solutions**:

1. **Validate JSON syntax**:
   ```bash
   cat ~/.kiro/settings/mcp.json | jq .
   # Should parse without errors
   ```

2. **Check file permissions**:
   ```bash
   ls -la ~/.kiro/settings/mcp.json
   # Should be readable by your user
   ```

3. **Restart Kiro IDE**: Always restart after config changes

---

### Environment Variables Not Set

**Problem**: Servers can't find API keys

**Solutions**:

1. **Set in shell profile**:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   export ANTHROPIC_API_KEY="your-key"
   export VOYAGE_API_KEY="your-key"
   
   # Reload
   source ~/.zshrc
   ```

2. **Set in mcp.json**: Keys are already in config (preferred)

3. **Verify in Kiro**:
   - Check Kiro IDE → Settings → MCP Servers
   - Verify environment variables are set

---

## Performance Optimization

### Improve Response Times

1. **Enable caching** (default):
   - Redis caches AI responses for 1 hour
   - Qdrant caches vector searches

2. **Reduce query complexity**:
   ```typescript
   // Instead of:
   { query: "...", depth: 3, maxResults: 50 }
   
   // Use:
   { query: "...", depth: 2, maxResults: 10 }
   ```

3. **Batch related queries**:
   ```typescript
   // Instead of 3 separate queries:
   intelligent_search({ query: "auth" })
   intelligent_search({ query: "login" })
   intelligent_search({ query: "session" })
   
   // Use one combined query:
   intelligent_search({ query: "authentication, login, session" })
   ```

4. **Pre-index code**:
   ```bash
   # Index your codebase once
   cd servers/intelligent-context-mcp
   npm run index-codebase
   ```

---

## Getting Help

### Check Logs

```bash
# Kiro IDE logs
tail -f ~/Library/Logs/Kiro/mcp-*.log

# Docker logs
docker logs qdrant
docker logs redis

# Server stderr (if running manually)
cd servers/intelligent-context-mcp
npm run dev 2>&1 | tee server.log
```

### Debug Mode

Enable verbose logging:

```bash
# Edit server's index.ts
console.error('[DEBUG]', ...);

# Rebuild
npm run build

# Restart Kiro IDE
```

### Report Issues

When reporting issues, include:

1. **Environment**:
   ```bash
   node --version
   npm --version
   docker --version
   ```

2. **Logs**:
   - Kiro IDE logs
   - Docker logs
   - Server stderr

3. **Configuration**:
   ```bash
   cat ~/.kiro/settings/mcp.json
   # Redact API keys!
   ```

4. **Steps to reproduce**

---

## Common Error Messages

### `ECONNREFUSED`
- **Cause**: Service not running
- **Fix**: Start Docker services (`docker ps`)

### `ETIMEDOUT`
- **Cause**: Network timeout
- **Fix**: Check endpoint connectivity, increase timeout

### `Invalid JSON`
- **Cause**: Malformed config file
- **Fix**: Validate with `jq`, fix syntax errors

### `Collection not found`
- **Cause**: Qdrant collection doesn't exist
- **Fix**: Run tests to create collections

### `Out of memory`
- **Cause**: Insufficient Docker memory
- **Fix**: Increase Docker memory limit

---

## Still Having Issues?

1. **Check documentation**: [docs/](../docs/)
2. **Search issues**: [GitHub Issues](https://github.com/yourusername/kiro-intelligent-mcp-suite/issues)
3. **Ask community**: [GitHub Discussions](https://github.com/yourusername/kiro-intelligent-mcp-suite/discussions)
4. **File bug report**: Include logs and reproduction steps

---

**Last Updated**: 2026-05-02
