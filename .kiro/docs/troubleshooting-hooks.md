# Troubleshooting Hooks Guide

## Overview

This guide helps you diagnose and fix common errors when creating or editing hook files (`.kiro.hook`). Each error includes an explanation, example, and step-by-step fix procedure.

---

## Quick Validation

Before troubleshooting, validate your hook file:

```bash
node .kiro/utils/validateHookCLI.js path/to/your-hook.kiro.hook
```

This will show you exactly what's wrong and where.

---

## Common JSON Syntax Errors

### Error 1: Missing Comma

**Error Message:**
```
JSON Syntax Error at line 3, column 3:
Expected ',' or '}' after property value in JSON
```

**Cause:** Missing comma between object properties or array items.

**Example (Broken):**
```json
{
  "name": "Test Hook"
  "version": "1.0.0"
}
```

**Fix:**
Add comma after `"Test Hook"`:
```json
{
  "name": "Test Hook",
  "version": "1.0.0"
}
```

**Step-by-Step:**
1. Look at the line number in the error (line 3)
2. Check the previous line (line 2) for missing comma
3. Add comma at the end of the line before the error
4. Save and validate again

---

### Error 2: Missing Quotes

**Error Message:**
```
JSON Syntax Error at line 2, column 10:
Unexpected token in JSON
```

**Cause:** String values must be wrapped in double quotes.

**Example (Broken):**
```json
{
  "name": test-hook,
  "version": "1.0.0"
}
```

**Fix:**
Add quotes around `test-hook`:
```json
{
  "name": "test-hook",
  "version": "1.0.0"
}
```

**Step-by-Step:**
1. Look at the line and column number
2. Check if the value is wrapped in double quotes
3. Add double quotes around the value
4. Save and validate again

---

### Error 3: Unclosed Array

**Error Message:**
```
JSON Syntax Error at line 8, column 1:
Unexpected end of JSON input
```

**Cause:** Array opened with `[` but not closed with `]`.

**Example (Broken):**
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"
  }
}
```

**Fix:**
Close the array with `]`:
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  }
}
```

**Step-by-Step:**
1. Find all `[` in your file
2. Count the matching `]`
3. If counts don't match, find the unclosed array
4. Add `]` before the closing brace
5. Save and validate again

---

### Error 4: Unclosed Object

**Error Message:**
```
JSON Syntax Error at line 10, column 1:
Unexpected end of JSON input
```

**Cause:** Object opened with `{` but not closed with `}`.

**Example (Broken):**
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
}
```

**Fix:**
Close the `then` object with `}`:
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

**Step-by-Step:**
1. Find all `{` in your file
2. Count the matching `}`
3. If counts don't match, find the unclosed object
4. Add `}` at the appropriate location
5. Save and validate again

---

### Error 5: Trailing Comma

**Error Message:**
```
JSON Syntax Error at line 6, column 3:
Trailing comma in JSON
```

**Cause:** Extra comma after the last item in an array or object.

**Example (Broken):**
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"],
  }
}
```

**Fix:**
Remove the comma after `["*.ts"]`:
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  }
}
```

**Step-by-Step:**
1. Look at the line number in the error
2. Check if there's a comma before `}` or `]`
3. Remove the trailing comma
4. Save and validate again

---

## Schema Validation Errors

### Error 6: Missing Required Field

**Error Message:**
```
Schema Validation Error:
Missing required property: description
```

**Cause:** A required field is not present in the hook file.

**Required Fields:**
- `name`
- `version`
- `description`
- `when`
- `then`

**Example (Broken):**
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

**Fix:**
Add the missing `description` field:
```json
{
  "name": "Test Hook",
  "version": "1.0.0",
  "description": "Run linting on TypeScript files",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

**Step-by-Step:**
1. Read the error message to identify the missing field
2. Add the field with an appropriate value
3. Save and validate again

---

### Error 7: Invalid Event Type

**Error Message:**
```
Schema Validation Error:
Invalid value for 'when.type': "fileEditted"
Valid values: fileEdited, fileCreated, fileDeleted, userTriggered, promptSubmit, agentStop, preToolUse, postToolUse, preTaskExecution, postTaskExecution
```

**Cause:** The event type is not one of the valid options (often a typo).

**Valid Event Types:**
- `fileEdited` (not "fileEditted")
- `fileCreated`
- `fileDeleted`
- `userTriggered`
- `promptSubmit`
- `agentStop`
- `preToolUse`
- `postToolUse`
- `preTaskExecution`
- `postTaskExecution`

**Example (Broken):**
```json
{
  "when": {
    "type": "fileEditted"
  }
}
```

**Fix:**
Correct the typo to `fileEdited`:
```json
{
  "when": {
    "type": "fileEdited"
  }
}
```

**Step-by-Step:**
1. Read the error message to see the invalid value
2. Check the list of valid event types
3. Correct the typo or use the correct event type
4. Save and validate again

---

### Error 8: Invalid Action Type

**Error Message:**
```
Schema Validation Error:
Invalid value for 'then.type': "askagent"
Valid values: askAgent, runCommand
```

**Cause:** The action type is not one of the valid options (often a typo).

**Valid Action Types:**
- `askAgent` (camelCase, not "askagent")
- `runCommand` (camelCase, not "runcommand")

**Example (Broken):**
```json
{
  "then": {
    "type": "askagent",
    "prompt": "Review this code"
  }
}
```

**Fix:**
Correct to `askAgent` (camelCase):
```json
{
  "then": {
    "type": "askAgent",
    "prompt": "Review this code"
  }
}
```

**Step-by-Step:**
1. Read the error message to see the invalid value
2. Check the list of valid action types
3. Use the correct camelCase format
4. Save and validate again

---

### Error 9: Missing Conditional Field (patterns)

**Error Message:**
```
Schema Validation Error:
Missing required property 'patterns' for event type 'fileEdited'
```

**Cause:** File events require a `patterns` field to specify which files to watch.

**Events Requiring `patterns`:**
- `fileEdited`
- `fileCreated`
- `fileDeleted`

**Example (Broken):**
```json
{
  "when": {
    "type": "fileEdited"
  }
}
```

**Fix:**
Add the `patterns` field:
```json
{
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.tsx"]
  }
}
```

**Step-by-Step:**
1. Identify the event type
2. If it's a file event, add the `patterns` field
3. Specify file glob patterns as an array of strings
4. Save and validate again

---

### Error 10: Missing Conditional Field (toolTypes)

**Error Message:**
```
Schema Validation Error:
Missing required property 'toolTypes' for event type 'preToolUse'
```

**Cause:** Tool events require a `toolTypes` field to specify which tools to watch.

**Events Requiring `toolTypes`:**
- `preToolUse`
- `postToolUse`

**Example (Broken):**
```json
{
  "when": {
    "type": "preToolUse"
  }
}
```

**Fix:**
Add the `toolTypes` field:
```json
{
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  }
}
```

**Step-by-Step:**
1. Identify the event type
2. If it's a tool event, add the `toolTypes` field
3. Specify tool categories or regex patterns as an array
4. Save and validate again

---

### Error 11: Missing Conditional Field (prompt)

**Error Message:**
```
Schema Validation Error:
Missing required property 'prompt' for action type 'askAgent'
```

**Cause:** `askAgent` actions require a `prompt` field.

**Example (Broken):**
```json
{
  "then": {
    "type": "askAgent"
  }
}
```

**Fix:**
Add the `prompt` field:
```json
{
  "then": {
    "type": "askAgent",
    "prompt": "Review this code change for potential issues"
  }
}
```

**Step-by-Step:**
1. Identify the action type
2. If it's `askAgent`, add the `prompt` field
3. Provide a clear prompt for the agent
4. Save and validate again

---

### Error 12: Missing Conditional Field (command)

**Error Message:**
```
Schema Validation Error:
Missing required property 'command' for action type 'runCommand'
```

**Cause:** `runCommand` actions require a `command` field.

**Example (Broken):**
```json
{
  "then": {
    "type": "runCommand"
  }
}
```

**Fix:**
Add the `command` field:
```json
{
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

**Step-by-Step:**
1. Identify the action type
2. If it's `runCommand`, add the `command` field
3. Provide the shell command to execute
4. Save and validate again

---

## Type Errors

### Error 13: Wrong Type for Field

**Error Message:**
```
Schema Validation Error:
Property 'timeout' must be a number, got string
```

**Cause:** Field has the wrong data type.

**Example (Broken):**
```json
{
  "then": {
    "type": "runCommand",
    "command": "npm run lint",
    "timeout": "60"
  }
}
```

**Fix:**
Change `"60"` (string) to `60` (number):
```json
{
  "then": {
    "type": "runCommand",
    "command": "npm run lint",
    "timeout": 60
  }
}
```

**Step-by-Step:**
1. Read the error to identify the field and expected type
2. Remove quotes for numbers
3. Add quotes for strings
4. Use `[]` for arrays, `{}` for objects
5. Save and validate again

---

## Testing Your Hook

After fixing errors, test your hook:

### 1. Validate the File
```bash
node .kiro/utils/validateHookCLI.js .kiro/hooks/your-hook.kiro.hook
```

Expected output:
```
✅ Hook file is valid!
```

### 2. Test the Hook Trigger

**For file events:**
1. Edit/create/delete a file matching the pattern
2. Check if the hook triggers

**For tool events:**
1. Perform an operation that uses the specified tool
2. Check if the hook triggers

**For agent events:**
1. Submit a prompt or wait for agent to stop
2. Check if the hook triggers

### 3. Verify the Action

**For askAgent:**
- Check that the agent receives the prompt
- Verify the agent responds appropriately

**For runCommand:**
- Check that the command executes
- Verify the command output is correct

---

## Common Patterns and Solutions

### Pattern 1: Hook Not Triggering

**Possible Causes:**
1. File pattern doesn't match
2. Hook is disabled
3. Event type is wrong

**Solution:**
1. Check the `patterns` field matches your files
2. Verify hook is enabled in the UI
3. Confirm event type is correct for your use case

---

### Pattern 2: Command Fails to Execute

**Possible Causes:**
1. Command not found
2. Timeout too short
3. Working directory is wrong

**Solution:**
1. Test command in terminal first
2. Increase `timeout` value
3. Use absolute paths in command

---

### Pattern 3: Agent Doesn't Respond

**Possible Causes:**
1. Prompt is unclear
2. Agent is busy
3. Hook conflicts with another hook

**Solution:**
1. Make prompt more specific
2. Wait for agent to complete current task
3. Check for conflicting hooks

---

## Validation Checklist

Before saving your hook file, verify:

- [ ] Valid JSON syntax (no missing commas, quotes, brackets)
- [ ] All required fields present (name, version, description, when, then)
- [ ] Event type is valid and spelled correctly
- [ ] Action type is valid and spelled correctly
- [ ] Conditional fields present (patterns for file events, toolTypes for tool events)
- [ ] Conditional fields present (prompt for askAgent, command for runCommand)
- [ ] Field types are correct (strings in quotes, numbers without quotes)
- [ ] File patterns use correct glob syntax
- [ ] Commands are valid shell commands

---

## Getting Help

If you're still stuck:

1. **Validate your hook file:**
   ```bash
   node .kiro/utils/validateHookCLI.js path/to/hook.kiro.hook
   ```

2. **Check the schema:**
   `.kiro/schemas/hook.schema.json`

3. **Review examples:**
   - [Hook File Format Documentation](./hook-file-format.md)
   - Example hooks in `.kiro/hooks/`

4. **Common issues:**
   - JSON syntax errors → Use a JSON validator
   - Schema errors → Check required fields
   - Hook not triggering → Verify patterns and event type

---

## Quick Reference

### Valid Event Types
```
fileEdited, fileCreated, fileDeleted
userTriggered, promptSubmit, agentStop
preToolUse, postToolUse
preTaskExecution, postTaskExecution
```

### Valid Action Types
```
askAgent, runCommand
```

### Required Fields
```
name, version, description, when, then
```

### Conditional Fields
```
patterns (for file events)
toolTypes (for tool events)
prompt (for askAgent)
command (for runCommand)
```

---

**Last Updated:** 2026-05-03
