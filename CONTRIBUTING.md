# Contributing to Kiro Intelligent MCP Suite

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Project Structure](#project-structure)

## Code of Conduct

This project follows a Code of Conduct that all contributors are expected to adhere to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/kiro-intelligent-mcp-suite.git
   cd kiro-intelligent-mcp-suite
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/kiro-intelligent-mcp-suite.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (for Qdrant and Redis)
- Git

### Install Dependencies

```bash
# Install dependencies for all servers
cd servers/intelligent-context-mcp && npm install
cd ../adaptive-memory-mcp && npm install
cd ../predictive-analysis-mcp && npm install
cd ../collaborative-planning-mcp && npm install
```

### Start Infrastructure

```bash
# Start Qdrant
docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Start Redis
docker run -d --name redis -p 6379:6379 redis:latest
```

### Set Environment Variables

```bash
cp .env.example .env
# Edit .env with your API keys
```

## Making Changes

### Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

### Development Workflow

1. **Make your changes** in the appropriate server directory
2. **Build the server**:
   ```bash
   cd servers/your-server-mcp
   npm run build
   ```
3. **Test your changes**:
   ```bash
   npm test
   ```
4. **Test manually** with Kiro IDE if needed

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

**Examples:**
```
feat(intelligent-context): add support for TypeScript AST parsing

fix(adaptive-memory): resolve memory leak in clustering algorithm

docs(api): update intelligent_search examples
```

## Testing

### Run Tests

```bash
# Test individual server
cd servers/intelligent-context-mcp
npm test

# Test all servers
./test-all.sh
```

### Write Tests

When adding new features, include tests:

```typescript
// servers/your-server-mcp/src/test.ts

async function testYourFeature() {
  console.log('\n=== Test: Your Feature ===');
  try {
    const result = await sendMCPRequest('tools/call', {
      name: 'your_tool',
      arguments: { /* test args */ },
    });
    
    console.log('✓ Your feature works');
  } catch (error) {
    console.error('✗ Your feature failed:', error);
  }
}
```

### Manual Testing

1. Build your changes
2. Update `~/.kiro/settings/mcp.json` to point to your development build
3. Restart Kiro IDE
4. Test the tools in a real project

## Submitting Changes

### Before Submitting

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Documentation is updated
- [ ] Commit messages follow conventions

### Create Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Link to related issues (if any)
   - Screenshots/examples (if applicable)

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   How was this tested?
   
   ## Checklist
   - [ ] Code builds successfully
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] Follows code style
   ```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged

## Code Style

### TypeScript Style

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use async/await over promises
- Add JSDoc comments for public functions
- Use meaningful variable names

**Example:**
```typescript
/**
 * Analyze code for security vulnerabilities
 */
async function analyzeSecurity(code: string, context?: string): Promise<SecurityAnalysis> {
  console.error('[Security] Analyzing for vulnerabilities...');
  
  const analysis = await callLLM(`Analyze this code: ${code}`, 2048);
  return JSON.parse(analysis);
}
```

### File Organization

```typescript
// 1. Imports
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

// 2. Constants
const MODEL_NAME = 'kr/claude-sonnet-4.5';

// 3. Helper functions
async function callLLM(prompt: string): Promise<string> { }

// 4. Main functions
async function analyzeSecurity(code: string): Promise<any> { }

// 5. Server setup
const server = new Server({ /* ... */ });

// 6. Request handlers
server.setRequestHandler(/* ... */);

// 7. Main entry point
async function main() { }
```

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('[Error]', errorMessage);
  return {
    content: [{ type: 'text', text: `Error: ${errorMessage}` }],
    isError: true,
  };
}
```

## Project Structure

```
kiro-intelligent-mcp-suite/
├── servers/
│   ├── intelligent-context-mcp/
│   │   ├── src/
│   │   │   ├── index.ts          # Main server
│   │   │   ├── reasoning.ts      # AI reasoning
│   │   │   ├── vector.ts         # Vector operations
│   │   │   └── test.ts           # Tests
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── adaptive-memory-mcp/
│   ├── predictive-analysis-mcp/
│   └── collaborative-planning-mcp/
├── docs/
│   ├── API.md
│   ├── QUICK_START.md
│   ├── ARCHITECTURE.md
│   └── TROUBLESHOOTING.md
├── install.sh
├── uninstall.sh
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── .gitignore
```

## Adding a New Tool

1. **Add tool definition** in `server.setRequestHandler(ListToolsRequestSchema)`:
   ```typescript
   {
     name: 'your_tool',
     description: 'What your tool does',
     inputSchema: { /* ... */ }
   }
   ```

2. **Implement tool logic**:
   ```typescript
   async function yourTool(input: YourInput): Promise<YourOutput> {
     // Implementation
   }
   ```

3. **Add request handler** in `server.setRequestHandler(CallToolRequestSchema)`:
   ```typescript
   if (name === 'your_tool') {
     const result = await yourTool(args);
     return { content: [{ type: 'text', text: JSON.stringify(result) }] };
   }
   ```

4. **Add tests**:
   ```typescript
   async function testYourTool() { /* ... */ }
   ```

5. **Update documentation** in `docs/API.md`

## Adding a New Server

1. Create server directory: `servers/your-server-mcp/`
2. Copy structure from existing server
3. Implement your tools
4. Add to `install.sh`
5. Update main README.md
6. Add documentation

## Questions?

- **General questions**: [GitHub Discussions](https://github.com/yourusername/kiro-intelligent-mcp-suite/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/yourusername/kiro-intelligent-mcp-suite/issues)
- **Security issues**: Email maintainers directly

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Kiro Intelligent MCP Suite! 🎉
