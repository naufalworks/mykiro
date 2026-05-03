# Hook File Validation Guide

## Overview

Hook files (`.kiro.hook`) must follow a specific JSON structure to work correctly. This guide explains how to validate hook files before saving them to prevent runtime errors.

## Validation Utility

A validation utility is available at `.kiro/utils/dist/validateHookCLI.js` that checks:
- JSON syntax (missing commas, quotes, brackets)
- Schema compliance (required fields, valid values)
- Conditional requirements (patterns for file events, toolTypes for tool events)

## Usage

### Validate a Hook File

```bash
node .kiro/utils/dist/validateHookCLI.js path/to/hook.kiro.hook
```

### Validate Hook Content from stdin

```bash
echo '{ "name": "test", "version": "1" }' | node .kiro/utils/dist/validateHookCLI.js --stdin
```

### Validate Before Writing (Recommended)

When creating or modifying hook files, always validate the content first:

```bash
# Save your hook content to a temporary file
cat > /tmp/my-hook.json << 'EOF'
{
  "enabled": true,
  "name": "My Hook",
  "version": "1.0.0",
  "description": "Description here",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review this change"
  }
}
EOF

# Validate it
node .kiro/utils/dist/validateHookCLI.js /tmp/my-hook.json

# If validation passes, copy to hooks directory
cp /tmp/my-hook.json .kiro/hooks/my-hook.kiro.hook
```

## Hook File Structure

### Required Fields

Every hook file must have these fields:

```json
{
  "name": "string (required)",
  "version": "string (required)",
  "description": "string (required)",
  "when": {
    "type": "string (required)"
  },
  "then": {
    "type": "string (required)"
  }
}
```

### Optional Fields

- `enabled`: boolean (default: true) - Whether the hook is active

### Event Types (`when.type`)

Valid event types:
- `fileEdited` - Triggered when a file is saved (requires `patterns`)
- `fileCreated` - Triggered when a file is created (requires `patterns`)
- `fileDeleted` - Triggered when a file is deleted (requires `patterns`)
- `userTriggered` - Manually triggered by user
- `promptSubmit` - Triggered when user sends a message
- `agentStop` - Triggered when agent execution completes
- `preToolUse` - Triggered before a tool is executed (requires `toolTypes`)
- `postToolUse` - Triggered after a tool is executed (requires `toolTypes`)
- `preTaskExecution` - Triggered before a spec task starts
- `postTaskExecution` - Triggered after a spec task completes

### Action Types (`then.type`)

Valid action types:
- `askAgent` - Send a prompt to the agent (requires `prompt` field)
- `runCommand` - Execute a shell command (requires `command` field)

### Conditional Requirements

**File-based events** (`fileEdited`, `fileCreated`, `fileDeleted`) require:
```json
{
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]  // Array of glob patterns
  }
}
```

**Tool-based events** (`preToolUse`, `postToolUse`) require:
```json
{
  "when": {
    "type": "preToolUse",
    "toolTypes": "write"  // String: "read", "write", "shell", "web", "spec", "*", or regex
  }
}
```

**askAgent action** requires:
```json
{
  "then": {
    "type": "askAgent",
    "prompt": "Your prompt here"  // Non-empty string
  }
}
```

**runCommand action** requires:
```json
{
  "then": {
    "type": "runCommand",
    "command": "npm run lint",  // Non-empty string
    "timeout": 60  // Optional: timeout in seconds
  }
}
```

## Common Validation Errors

### 1. Missing Comma

**Error:**
```
JSON Syntax Errors:
  • Line 2, Column 18: Expected ',' or '}' after property value
```

**Fix:** Add comma between properties
```json
// ❌ Wrong
{
  "name": "test" "version": "1"
}

// ✅ Correct
{
  "name": "test",
  "version": "1"
}
```

### 2. Missing Required Fields

**Error:**
```
Schema Validation Errors:
  • Missing required field: description
  • Missing required field: when
  • Missing required field: then
```

**Fix:** Add all required fields
```json
// ❌ Wrong
{
  "name": "test",
  "version": "1"
}

// ✅ Correct
{
  "name": "test",
  "version": "1",
  "description": "Test hook",
  "when": { "type": "userTriggered" },
  "then": { "type": "askAgent", "prompt": "Test" }
}
```

### 3. Invalid Event Type

**Error:**
```
Schema Validation Errors:
  • /when/type: Invalid value for /when/type
    Value must be one of: fileEdited, fileCreated, fileDeleted, ...
```

**Fix:** Use a valid event type
```json
// ❌ Wrong
{
  "when": { "type": "invalidEvent" }
}

// ✅ Correct
{
  "when": { "type": "fileEdited", "patterns": ["*.ts"] }
}
```

### 4. Missing Conditional Fields

**Error:**
```
Schema Validation Errors:
  • /when/patterns: Event type 'fileEdited' requires 'patterns' field
```

**Fix:** Add required conditional fields
```json
// ❌ Wrong
{
  "when": { "type": "fileEdited" }
}

// ✅ Correct
{
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  }
}
```

## Examples

### Valid Hook: File Edit Trigger

```json
{
  "enabled": true,
  "name": "Lint TypeScript Files",
  "version": "1.0.0",
  "description": "Run linter when TypeScript files are edited",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint",
    "timeout": 30
  }
}
```

### Valid Hook: Pre-Tool Use Trigger

```json
{
  "enabled": true,
  "name": "Review Write Operations",
  "version": "1.0.0",
  "description": "Ask agent to review before writing files",
  "when": {
    "type": "preToolUse",
    "toolTypes": "write"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review this write operation for safety"
  }
}
```

### Valid Hook: Task Completion Trigger

```json
{
  "enabled": true,
  "name": "Run Tests After Task",
  "version": "1.0.0",
  "description": "Run test suite after completing a spec task",
  "when": {
    "type": "postTaskExecution"
  },
  "then": {
    "type": "runCommand",
    "command": "npm test"
  }
}
```

## Integration with Agent Workflow

When the agent creates or modifies hook files, it should:

1. **Generate the hook content** as a JSON string
2. **Validate using the CLI utility** before writing
3. **If validation fails**: Display errors to user, do not write file
4. **If validation passes**: Write the file to `.kiro/hooks/`

This prevents invalid hooks from being saved and causing runtime errors.

## Troubleshooting

### Validation utility not found

If you get "command not found" or "module not found":

```bash
# Compile the TypeScript utilities
cd .kiro/utils
npm install
npx tsc
```

### Schema file not found

If you get "Hook schema not found":

```bash
# Verify schema exists
ls -la .kiro/schemas/hook.schema.json

# If missing, the schema should be at:
# .kiro/schemas/hook.schema.json
```

### Permission denied

If you get permission errors:

```bash
# Make CLI executable
chmod +x .kiro/utils/dist/validateHookCLI.js
```

## Best Practices

1. **Always validate before saving** - Use the CLI utility to check hook files
2. **Use descriptive names** - Make hook names clear and specific
3. **Add detailed descriptions** - Explain what the hook does and why
4. **Test hooks after creation** - Trigger the hook to verify it works
5. **Keep hooks focused** - One hook should do one thing well
6. **Use version numbers** - Increment version when modifying hooks
7. **Document complex patterns** - Add comments explaining regex or glob patterns

## See Also

- [Hook File Format Documentation](.kiro/docs/hook-file-format.md) - Detailed format specification
- [Troubleshooting Hooks](.kiro/docs/troubleshooting-hooks.md) - Common issues and solutions
- [Hook Schema](.kiro/schemas/hook.schema.json) - JSON schema definition
