# Kiro Intelligent MCP Suite

> AI-powered Model Context Protocol (MCP) servers for Kiro IDE - Intelligent context search, adaptive memory, predictive analysis, and collaborative planning.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

## 🚀 Features

### 1. Intelligent Context MCP
Multi-hop reasoning and semantic search for finding related code and documentation.

**Tools:**
- `intelligent_search` - AI-powered semantic search with multi-hop reasoning
- `search_context` - Find related code and documentation
- `find_similar` - Locate similar code patterns
- `extract_patterns` - Identify architectural patterns

### 2. Adaptive Memory MCP
Self-organizing memory system with AI-powered clustering and tagging.

**Tools:**
- `store_memory` - Save with AI-powered metadata generation
- `retrieve_memory` - Context-aware memory search
- `organize_memories` - AI-driven memory organization

### 3. Predictive Analysis MCP
Impact prediction, security analysis, performance prediction, and architecture validation.

**Tools:**
- `predict_impact` - Analyze change impact, risk level, breaking changes
- `analyze_security` - Detect vulnerabilities, OWASP violations, security score
- `predict_performance` - Find bottlenecks, complexity analysis, optimizations
- `validate_architecture` - Validate patterns, coupling, maintainability

### 4. Collaborative Planning MCP
Task decomposition, agent coordination, and workflow orchestration.

**Tools:**
- `decompose_task` - Break down complex tasks with dependencies
- `coordinate_agents` - Assign tasks, identify bottlenecks
- `orchestrate_workflow` - Plan execution order, manage dependencies
- `track_progress` - Monitor progress, identify blockers
- `optimize_workflow` - Improve workflow based on feedback

**Total: 16 AI-powered tools**

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** (for Qdrant and Redis)
- **Kiro IDE** (latest version)

### API Keys Required

- **Anthropic API Key** (or Bedrock endpoint)
- **Voyage AI API Key** (for embeddings)

## 🔧 Installation

### Quick Install

```bash
# Clone the repository
git clone https://github.com/naufalworks/kiro-intelligent-mcp-suite.git
cd kiro-intelligent-mcp-suite

# Set environment variables
export ANTHROPIC_API_KEY="your-api-key"
export ANTHROPIC_BASE_URL="http://3.68.219.151:20128/v1"  # Optional: custom endpoint
export VOYAGE_API_KEY="your-voyage-api-key"

# Run installation script
chmod +x install.sh
./install.sh
```

The installation script will:
1. ✅ Check prerequisites (Node.js, npm, Docker)
2. ✅ Start infrastructure services (Qdrant, Redis)
3. ✅ Install and build all MCP servers
4. ✅ Configure Kiro IDE globally
5. ✅ Run tests to verify installation

### Manual Installation

If you prefer manual installation, see [docs/MANUAL_INSTALL.md](docs/MANUAL_INSTALL.md).

## 🎯 Quick Start

After installation, restart Kiro IDE and verify the servers are loaded:

### Example 1: Find Authentication Code
```typescript
// Use intelligent_search
{
  "query": "user authentication, login, session management",
  "depth": 3
}
```

### Example 2: Analyze Security
```typescript
// Use analyze_security before committing
{
  "code": "function login(username, password) { ... }",
  "context": "User authentication endpoint"
}
```

### Example 3: Plan Complex Feature
```typescript
// Use decompose_task
{
  "task": "Add real-time notifications with WebSocket support",
  "context": "React frontend, Node.js backend, 50k active users"
}
```

See [docs/QUICK_START.md](docs/QUICK_START.md) for more examples.

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[API Reference](docs/API.md)** - Complete tool documentation
- **[Architecture](docs/ARCHITECTURE.md)** - Technical implementation details
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Kiro IDE                           │
└─────────────────────────────────────────────────────────┘
                          │
                          │ MCP Protocol (stdio)
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Intelligent  │  │  Adaptive    │  │ Predictive   │
│   Context    │  │   Memory     │  │  Analysis    │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Qdrant     │  │    Redis     │  │   Bedrock    │
│ (Vector DB)  │  │   (Cache)    │  │ (AI Model)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Technology Stack

- **AI Model**: Claude Sonnet 4.5 via Bedrock
- **Vector Database**: Qdrant (semantic search)
- **Cache**: Redis (performance optimization)
- **Embeddings**: Voyage AI (voyage-4-large, 1024 dimensions)
- **Protocol**: MCP via stdio transport
- **Language**: TypeScript

## 🔍 Performance

| Operation | First Call | Cached |
|-----------|-----------|--------|
| intelligent_search | 2-5s | <500ms |
| store_memory | 1-2s | N/A |
| analyze_security | 3-8s | 1-2s |
| decompose_task | 5-15s | 2-3s |

## 🛠️ Development

### Project Structure

```
kiro-intelligent-mcp-suite/
├── servers/
│   ├── intelligent-context-mcp/
│   ├── adaptive-memory-mcp/
│   ├── predictive-analysis-mcp/
│   └── collaborative-planning-mcp/
├── docs/
│   ├── QUICK_START.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── TROUBLESHOOTING.md
├── install.sh
├── uninstall.sh
├── README.md
└── LICENSE
```

### Building from Source

```bash
# Install dependencies for all servers
cd servers/intelligent-context-mcp && npm install && npm run build
cd ../adaptive-memory-mcp && npm install && npm run build
cd ../predictive-analysis-mcp && npm install && npm run build
cd ../collaborative-planning-mcp && npm install && npm run build
```

### Running Tests

```bash
# Test individual server
cd servers/intelligent-context-mcp
npm test

# Test all servers
./test-all.sh
```

## 🐛 Troubleshooting

### MCP Server Not Responding

```bash
# Check Docker services
docker ps | grep -E "qdrant|redis"

# Test server manually
cd servers/intelligent-context-mcp
npm run dev
```

### Slow Responses

```bash
# Check Redis connection
redis-cli ping

# Check Qdrant
curl http://localhost:6333/collections
```

See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for more solutions.

## 🔄 Updating

```bash
# Pull latest changes
git pull origin main

# Reinstall
./install.sh
```

## 🗑️ Uninstallation

```bash
# Run uninstall script
./uninstall.sh
```

This will:
- Remove MCP servers from Kiro IDE configuration
- Optionally stop Docker services
- Backup your configuration before removal

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Powered by [Claude Sonnet 4.5](https://www.anthropic.com/)
- Vector search by [Qdrant](https://qdrant.tech/)
- Embeddings by [Voyage AI](https://www.voyageai.com/)

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/naufalworks/kiro-intelligent-mcp-suite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/naufalworks/kiro-intelligent-mcp-suite/discussions)
- **Documentation**: [docs/](docs/)

## 🗺️ Roadmap

- [ ] Add streaming support for long-running analyses
- [ ] Implement cross-MCP communication
- [ ] Build monitoring dashboard
- [ ] Add telemetry and analytics
- [ ] Create VS Code extension
- [ ] Support for additional AI models

---

**Made with ❤️ for the Kiro IDE community**

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: 2026-05-02
