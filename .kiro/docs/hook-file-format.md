# Hook File Format Documentation

## Overview

Hook files (`.kiro.hook`) are JSON configuration files that define automated agent actions triggered by IDE events. This document provides a comprehensive guide to the hook file format, validation rules, and best practices.

---

## File Structure

### Basic Structure

```json
{
  "name": "Hook Name",
  "version": "1.0.0",
  "description": "What this hook does",
  "when": {
    "type": "eventType",
    "patterns": ["file-patterns"]
  },
  "then": {
    "type": "actionType",
    "prompt": "Action details"
  }
}
```

---

## Required Fields

### 1. `name` (string, required)

The display name of the hook.

**Rules:**
- Must be a non-empty string
- Should be descriptive and concise
- Displayed in the Agent Hooks UI

**Examples:**
```json
"name": "Lint on Save"
"name": "Review Write Operations"
"name": "Run Tests After Task"
```

---

### 2. `version` (string, required)

Semantic version of the hook configuration.

**Rules:**
- Must follow semantic versioning (e.g., "1.0.0")
- Used for tracking hook changes

**Examples:**
```json
"version": "1.0.0"
"version": "2.1.3"
```

---

### 3. `description` (string, required)

A clear description of what the hook does.

**Rules:**
- Must be a non-empty string
- Should explain the hook's purpose in natural language
- Helps users understand the hook's behavior

**Examples:**
```json
"description": "Automatically runs linting when TypeScript files are saved"
"description": "Reviews write operations before execution to ensure safety"
```

---

### 4. `when` (object, required)

Defines the event that triggers the hook.

**Structure:**
```json
"when": {
  "type": "eventType",
  "patterns": ["optional-patterns"],
  "toolTypes": ["optional-tool-types"]
}
```

**Required sub-fields:**
- `type` (string, required): The event type (see Event Types below)

**Optional sub-fields:**
- `patterns` (array, required for file events): File glob patterns
- `toolTypes` (array, required for tool events): Tool type categories or regex patterns

---

### 5. `then` (object, required)

Defines the action to take when the hook is triggered.

**Structure:**
```json
"then": {
  "type": "actionType",
  "prompt": "for askAgent",
  "command": "for runCommand",
  "timeout": 60
}
```

**Required sub-fields:**
- `type` (string, required): The action type (see Action Types below)

**Conditional sub-fields:**
- `prompt` (string, required for askAgent): The prompt to send to the agent
- `command` (string, required for runCommand): The shell command to execute
- `timeout` (number, optional for runCommand): Timeout in seconds (default: 60)

---

## Event Types

### File Events

#### `fileEdited`
Triggered when a file is saved after editing.

**Requires:** `patterns` field

**Example:**
```json
{
  "name": "Lint TypeScript on Save",
  "version": "1.0.0",
  "description": "Run linting when TypeScript files are saved",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

#### `fileCreated`
Triggered when a new file is created.

**Requires:** `patterns` field

**Example:**
```json
{
  "name": "Auto-index Steering Files",
  "version": "1.0.0",
  "description": "Automatically index new steering files",
  "when": {
    "type": "fileCreated",
    "patterns": ["~/.kiro/steering/*.md"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Index the newly created steering file"
  }
}
```

#### `fileDeleted`
Triggered when a file is deleted.

**Requires:** `patterns` field

**Example:**
```json
{
  "name": "Clean Up References",
  "version": "1.0.0",
  "description": "Remove references to deleted files",
  "when": {
    "type": "fileDeleted",
    "patterns": ["src/**/*.ts"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Check for and remove references to the deleted file"
  }
}
```

---

### Agent Events

#### `promptSubmit`
Triggered when a user submits a message to the agent.

**Does not require:** `patterns` or `toolTypes`

**Example:**
```json
{
  "name": "Enforce Workflow",
  "version": "1.0.0",
  "description": "Remind agent to follow workflow phases",
  "when": {
    "type": "promptSubmit"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Remember to follow the 8-phase workflow"
  }
}
```

#### `agentStop`
Triggered when an agent execution completes.

**Does not require:** `patterns` or `toolTypes`

**Example:**
```json
{
  "name": "Archive Completed Work",
  "version": "1.0.0",
  "description": "Archive work after agent completes",
  "when": {
    "type": "agentStop"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Archive the completed work to memory"
  }
}
```

---

### Tool Events

#### `preToolUse`
Triggered before a tool is about to be executed.

**Requires:** `toolTypes` field

**Use cases:**
- Access control and authorization checks
- Parameter validation
- Safety checks before write operations

**Example:**
```json
{
  "name": "Review Write Operations",
  "version": "1.0.0",
  "description": "Review write operations before execution",
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Verify this write operation follows coding standards"
  }
}
```

#### `postToolUse`
Triggered after a tool has been executed.

**Requires:** `toolTypes` field

**Use cases:**
- Review tool execution results
- Suggest improvements
- Log operations

**Example:**
```json
{
  "name": "Review Tool Results",
  "version": "1.0.0",
  "description": "Review tool execution results",
  "when": {
    "type": "postToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review the tool execution result and suggest improvements"
  }
}
```

---

### Task Events

#### `preTaskExecution`
Triggered before a spec task status is set to in_progress.

**Does not require:** `patterns` or `toolTypes`

**Example:**
```json
{
  "name": "Review Task Requirements",
  "version": "1.0.0",
  "description": "Review task requirements before starting",
  "when": {
    "type": "preTaskExecution"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review the task requirements before starting"
  }
}
```

#### `postTaskExecution`
Triggered after a spec task status is set to completed.

**Does not require:** `patterns` or `toolTypes`

**Example:**
```json
{
  "name": "Run Tests After Task",
  "version": "1.0.0",
  "description": "Run tests after task completes",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "runCommand",
    "command": "npm run test"
  }
}
```

---

### User Events

#### `userTriggered`
Triggered manually by the user clicking a button.

**Does not require:** `patterns` or `toolTypes`

**Example:**
```json
{
  "name": "Manual Build",
  "version": "1.0.0",
  "description": "Manually trigger a build",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "runCommand",
    "command": "npm run build"
  }
}
```

---

## Action Types

### `askAgent`

Sends a prompt to the agent for processing.

**Required fields:**
- `prompt` (string): The message to send to the agent

**Example:**
```json
"then": {
  "type": "askAgent",
  "prompt": "Review this code change for potential issues"
}
```

**Use cases:**
- Request agent analysis
- Trigger agent workflows
- Ask for recommendations

---

### `runCommand`

Executes a shell command.

**Required fields:**
- `command` (string): The shell command to execute

**Optional fields:**
- `timeout` (number): Timeout in seconds (default: 60, set to 0 to disable)

**Example:**
```json
"then": {
  "type": "runCommand",
  "command": "npm run lint",
  "timeout": 120
}
```

**Use cases:**
- Run linters
- Execute tests
- Build projects
- Run scripts

---

## Pattern Matching

### File Patterns

File patterns use glob syntax for matching file paths.

**Glob Syntax:**
- `*` - Matches any characters except `/`
- `**` - Matches any characters including `/` (recursive)
- `?` - Matches a single character
- `[abc]` - Matches any character in the set
- `{a,b}` - Matches any of the alternatives

**Examples:**
```json
"patterns": ["*.ts"]                    // All TypeScript files in root
"patterns": ["src/**/*.ts"]             // All TypeScript files in src/ recursively
"patterns": ["*.ts", "*.tsx"]           // TypeScript and TSX files
"patterns": ["~/.kiro/steering/*.md"]   // Steering files in home directory
"patterns": ["src/**/*.{ts,tsx}"]       // TypeScript files using alternatives
```

---

### Tool Type Patterns

Tool type patterns can be:
1. **Built-in categories**: Predefined tool categories
2. **Regex patterns**: Custom patterns to match tool names

**Built-in Categories:**
- `read` - Read operations (readFile, readMultipleFiles, etc.)
- `write` - Write operations (fsWrite, strReplace, fsAppend, deleteFile)
- `shell` - Shell operations (executeBash, controlBashProcess)
- `web` - Web operations (remote_web_search, webFetch)
- `spec` - Spec operations (taskStatus, etc.)
- `*` - All tools

**Regex Patterns:**
For MCP tools, use regex patterns to match tool names:
```json
"toolTypes": [".*sql.*"]        // Matches any tool with "sql" in the name
"toolTypes": [".*database.*"]   // Matches any tool with "database" in the name
"toolTypes": ["mcp_.*"]         // Matches all MCP tools
```

**Examples:**
```json
"toolTypes": ["write"]                  // All write operations
"toolTypes": ["read", "write"]          // Read and write operations
"toolTypes": ["*"]                      // All tools
"toolTypes": [".*sql.*"]                // MCP tools with "sql" in name
```

---

## Validation Rules

### JSON Syntax

Hook files must be valid JSON:
- Proper quotes around strings
- Commas between array/object items
- Matching brackets and braces
- No trailing commas

**Common Errors:**
```json
// ❌ Missing comma
{
  "name": "Test"
  "version": "1.0.0"
}

// ✅ Correct
{
  "name": "Test",
  "version": "1.0.0"
}
```

---

### Schema Validation

Hook files are validated against a JSON schema:
- All required fields must be present
- Field types must match (string, number, array, object)
- Event types must be valid
- Action types must be valid
- Conditional fields must be present when required

**Validation Location:**
`.kiro/schemas/hook.schema.json`

---

## Complete Examples

### Example 1: Lint on Save
```json
{
  "name": "Lint on Save",
  "version": "1.0.0",
  "description": "Automatically runs linting when TypeScript files are saved",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

### Example 2: Review Write Operations
```json
{
  "name": "Review Write Operations",
  "version": "1.0.0",
  "description": "Review write operations before execution",
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Verify this write operation follows our coding standards"
  }
}
```

### Example 3: Run Tests After Task
```json
{
  "name": "Run Tests After Task",
  "version": "1.0.0",
  "description": "Run tests after task completes",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "runCommand",
    "command": "npm run test",
    "timeout": 300
  }
}
```

### Example 4: Auto-index Steering Files
```json
{
  "name": "Auto-index Steering Files",
  "version": "1.0.0",
  "description": "Automatically index new steering files",
  "when": {
    "type": "fileCreated",
    "patterns": ["~/.kiro/steering/*.md", ".kiro/steering/*.md"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Index the newly created steering file and update the steering index"
  }
}
```

---

## Best Practices

### 1. Clear Naming
- Use descriptive names that explain what the hook does
- Keep names concise (under 50 characters)

### 2. Specific Patterns
- Use specific file patterns to avoid unnecessary triggers
- Prefer `src/**/*.ts` over `**/*.ts` when possible

### 3. Appropriate Actions
- Use `askAgent` for analysis and recommendations
- Use `runCommand` for automated tasks (linting, testing)

### 4. Timeout Configuration
- Set appropriate timeouts for long-running commands
- Default is 60 seconds
- Set to 0 to disable timeout (use with caution)

### 5. Testing
- Test hooks after creation to ensure they trigger correctly
- Verify commands execute successfully
- Check that patterns match intended files

---

## Troubleshooting

For common errors and how to fix them, see:
- [Troubleshooting Hooks Guide](./troubleshooting-hooks.md)

For validation errors, use:
- Validation CLI: `node .kiro/utils/validateHookCLI.js <hook-file>`
- JSON Schema: `.kiro/schemas/hook.schema.json`

---

## Related Documentation

- [Hook Validation Guide](./hook-validation-guide.md) - How to validate hook files
- [Troubleshooting Hooks](./troubleshooting-hooks.md) - Common errors and fixes
- [Steering File Guidelines](./steering-file-guidelines.md) - Managing steering files

---

**Last Updated:** 2026-05-03
