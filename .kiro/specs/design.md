# Hooks & Steering Editing Improvements Bugfix Design

## Overview

This design addresses two critical usability issues in the Kiro agent system: (1) lack of JSON validation when editing `.kiro.hook` files, leading to syntax errors and runtime failures, and (2) difficulty managing large steering markdown files (600-1143 lines) that consume excessive context budget and are hard to navigate. The fix will implement pre-save JSON schema validation for hooks and provide tooling/guidance for modularizing large steering files, while preserving all existing functionality.

**Fix Approach:**
- Add JSON schema validation layer before hook file writes
- Provide clear validation error messages with line/column information
- Create steering file analysis tool to identify optimization opportunities
- Document modularization patterns for large steering files
- Maintain backward compatibility with all existing hooks and steering files

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when invalid JSON is saved to hook files OR when large steering files (>500 lines) are difficult to navigate/edit
- **Property (P)**: The desired behavior - hook files are validated before save with clear errors, and steering files have navigation/modularization support
- **Preservation**: Existing hook triggering, steering file loading, and all file system operations must remain unchanged
- **Hook Schema**: JSON schema defining valid structure for `.kiro.hook` files (name, version, description, when, then fields)
- **Validation Layer**: Pre-save validation that checks JSON syntax and schema compliance before writing hook files
- **Steering File Modularization**: Pattern for splitting large steering files into focused sub-files while maintaining semantic coherence

## Bug Details

### Bug Condition

The bug manifests in two distinct scenarios:

**Scenario 1: Hook File Editing**
When a user manually edits a `.kiro.hook` file and saves it, the system accepts invalid JSON without validation, causing runtime errors when the hook is triggered. The file write operation succeeds even with syntax errors (missing commas, quotes, brackets) or schema violations (missing required fields).

**Scenario 2: Steering File Management**
When a user opens or edits large steering files (>500 lines), they experience navigation difficulties, risk accidental modifications to unrelated sections, and the files consume excessive context budget when loaded by the agent.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type FileWriteOperation OR FileOpenOperation
  OUTPUT: boolean
  
  IF input.type == "FileWrite" AND input.path MATCHES "*.kiro.hook" THEN
    RETURN NOT isValidJSON(input.content) OR NOT matchesHookSchema(input.content)
  END IF
  
  IF input.type == "FileOpen" AND input.path MATCHES "*.kiro/steering/*.md" THEN
    lineCount := countLines(input.content)
    RETURN lineCount > 500 AND NOT hasNavigationSupport(input.editor)
  END IF
  
  RETURN false
END FUNCTION

FUNCTION isValidJSON(content)
  TRY
    parsed := JSON.parse(content)
    RETURN true
  CATCH SyntaxError
    RETURN false
  END TRY
END FUNCTION

FUNCTION matchesHookSchema(content)
  parsed := JSON.parse(content)
  requiredFields := ["name", "version", "description", "when", "then"]
  
  FOR EACH field IN requiredFields DO
    IF NOT parsed.hasOwnProperty(field) THEN
      RETURN false
    END IF
  END FOR
  
  IF NOT isValidEventType(parsed.when.type) THEN
    RETURN false
  END IF
  
  IF NOT isValidActionType(parsed.then.type) THEN
    RETURN false
  END IF
  
  RETURN true
END FUNCTION
```

### Examples

**Hook File Editing Examples:**

1. **Missing comma in JSON**
   - Input: `{ "name": "test" "version": "1" }`
   - Current behavior: File saves, runtime error when hook triggers
   - Expected: Validation error before save: "Syntax error at line 1, column 18: Expected comma"

2. **Missing required field**
   - Input: `{ "name": "test", "version": "1" }` (missing "description", "when", "then")
   - Current behavior: File saves, hook never triggers
   - Expected: Validation error: "Missing required fields: description, when, then"

3. **Invalid event type**
   - Input: `{ "when": { "type": "invalidEvent" } }`
   - Current behavior: File saves, hook never triggers
   - Expected: Validation error: "Invalid event type 'invalidEvent'. Valid types: fileEdited, fileCreated, fileDeleted, userTriggered, promptSubmit, agentStop, preToolUse, postToolUse, preTaskExecution, postTaskExecution"

4. **Complex pattern array with syntax error**
   - Input: `{ "when": { "patterns": ["~/.kiro/steering/*.md" } }`
   - Current behavior: File saves with missing closing bracket, runtime error
   - Expected: Validation error: "Syntax error at line 1: Unclosed array"

**Steering File Management Examples:**

1. **Opening workflow.md (1143 lines)**
   - Current behavior: Opens in editor, must scroll extensively to find sections
   - Expected: Editor shows outline/TOC, or agent suggests splitting into modules

2. **Loading issue-tracking.md (927 lines) into context**
   - Current behavior: Entire file loaded, consumes ~30KB of context budget
   - Expected: Agent loads only relevant sections (e.g., "Issue Priority System" for priority-related tasks)

3. **Editing architecture.md (732 lines)**
   - Current behavior: Risk of accidentally modifying unrelated sections while scrolling
   - Expected: Markdown validation warns about structural changes, or file is split into focused modules

4. **Backup file clutter**
   - Current behavior: `mcp-powers-skills.md.backup` exists alongside active file
   - Expected: Backup automatically archived or cleaned up after 7 days

## Expected Behavior

### Hook File Validation (Bug Condition Scenario 1)

**For any** hook file write operation where the content is invalid JSON or violates the hook schema, the fixed system SHALL:

1. **Validate JSON syntax** before writing the file
2. **Validate schema compliance** against the hook schema definition
3. **Reject the write operation** if validation fails
4. **Display clear error messages** with:
   - Exact line and column number of syntax errors
   - Description of the error (missing comma, unclosed bracket, etc.)
   - List of missing required fields
   - Invalid field values with valid options
5. **Preserve the user's edit buffer** so they can fix errors without losing work

**Validation occurs:**
- Before `fsWrite` tool writes hook files
- Before `strReplace` tool modifies hook files
- When agent creates new hook files via `createHook` tool

### Steering File Management (Bug Condition Scenario 2)

**For any** steering file over 500 lines, the fixed system SHALL:

1. **Provide navigation support** via:
   - Markdown outline/TOC in editor
   - Section jump commands
   - Search within file
2. **Recommend modularization** when files exceed thresholds:
   - 500-700 lines: Suggest reviewing for split opportunities
   - 700-1000 lines: Recommend splitting into focused modules
   - 1000+ lines: Strongly recommend immediate modularization
3. **Support selective loading** where agent loads only relevant sections based on task context
4. **Validate markdown structure** to prevent formatting errors during edits
5. **Auto-cleanup backups** older than 7 days to prevent directory clutter

### Preservation Requirements

**Unchanged Behaviors:**
- Hook triggering based on event types must continue to work exactly as before
- Hook execution (askAgent, runCommand actions) must remain unchanged
- Glob pattern matching for file patterns must work identically
- Steering file frontmatter parsing must remain unchanged
- Steering files with `inclusion: always` must auto-load as before
- All file system operations (create, delete, modify) must work identically

**Scope:**
All hook files and steering files that are currently valid should continue to work without modification. The validation layer only prevents NEW invalid files from being created. Existing files (even if they would fail validation) continue to function until edited.

## Hypothesized Root Cause

Based on the bug description, the most likely issues are:

### Hook File Editing Issues

1. **No Validation Layer**: The file write operations (`fsWrite`, `strReplace`) do not include JSON validation before writing to disk
   - Files are written directly without syntax checking
   - No schema validation against hook structure requirements
   - Runtime errors only discovered when hooks are triggered

2. **No Schema Definition**: There is no formal JSON schema file defining the structure of `.kiro.hook` files
   - Developers must remember required fields manually
   - No autocomplete or IntelliSense support in editors
   - Schema violations are not caught until runtime

3. **Complex Nested Structures**: Hook files contain nested JSON with arrays and objects
   - Pattern arrays: `"patterns": ["~/.kiro/steering/*.md"]`
   - Event configuration: `"when": { "type": "fileEdited", "patterns": [...] }`
   - Action configuration: `"then": { "type": "askAgent", "prompt": "..." }`
   - Easy to miss commas, quotes, or brackets in nested structures

4. **No Editor Support**: Standard text editors treat `.kiro.hook` files as plain text
   - No syntax highlighting for JSON structure
   - No bracket matching or auto-closing
   - No real-time validation feedback

### Steering File Management Issues

1. **Monolithic File Design**: Steering files were created as single comprehensive documents
   - `workflow.md` covers entire workflow in one file (1143 lines)
   - `issue-tracking.md` covers all memory/tracking in one file (927 lines)
   - `architecture.md` covers all architecture rules in one file (732 lines)
   - No modular structure for focused loading

2. **No Navigation Tools**: Standard markdown editors lack advanced navigation for large files
   - No built-in outline view
   - No section jump functionality
   - No search-within-file in some editors
   - Scrolling is the only navigation method

3. **Context Budget Inefficiency**: Agent loads entire steering files regardless of task relevance
   - `inclusion: always` loads full file content
   - No selective section loading based on task context
   - Large files consume 20-30KB of context budget each
   - Reduces available space for task-specific information

4. **Backup File Accumulation**: Backup files are created but never cleaned up
   - `.backup` files remain indefinitely
   - No automatic archival or deletion
   - Causes directory clutter and confusion

## Correctness Properties

Property 1: Bug Condition - Hook File Validation

_For any_ file write operation where the target is a `.kiro.hook` file and the content is invalid JSON or violates the hook schema, the fixed system SHALL reject the write operation and display clear validation errors indicating the exact location and nature of the problem, preventing invalid hook files from being saved.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Bug Condition - Steering File Navigation Support

_For any_ steering file over 500 lines that is opened or edited, the fixed system SHALL provide navigation support (TOC, section jumping, or modularization recommendations) and support selective loading of relevant sections, making large files easier to work with and reducing context budget consumption.

**Validates: Requirements 2.5, 2.6, 2.7, 2.8, 2.9, 2.10**

Property 3: Preservation - Hook System Functionality

_For any_ valid hook file that exists before the fix, the fixed system SHALL continue to trigger and execute the hook exactly as before, preserving all hook functionality including event matching, pattern matching, and action execution.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

Property 4: Preservation - Steering File System Functionality

_For any_ steering file that exists before the fix, the fixed system SHALL continue to parse frontmatter, auto-load files with `inclusion: always`, and provide the same guidance to the agent, preserving all steering file functionality.

**Validates: Requirements 3.5, 3.6, 3.7, 3.8**

Property 5: Preservation - File System Operations

_For any_ file system operation (create, delete, modify) on hook or steering files, the fixed system SHALL handle the operation exactly as before, preserving all file system functionality including auto-indexing and reference updates.

**Validates: Requirements 3.9, 3.10, 3.11, 3.12**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

#### Part 1: Hook File Validation

**File**: `.kiro/schemas/hook.schema.json` (NEW)

**Purpose**: Define JSON schema for hook files

**Content**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "version", "description", "when", "then"],
  "properties": {
    "enabled": {
      "type": "boolean",
      "description": "Whether the hook is enabled"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "Human-readable name for the hook"
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+(\\.[0-9]+)*$",
      "description": "Version number (e.g., '1', '1.0', '1.0.0')"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "description": "Description of what the hook does"
    },
    "when": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "fileEdited",
            "fileCreated",
            "fileDeleted",
            "userTriggered",
            "promptSubmit",
            "agentStop",
            "preToolUse",
            "postToolUse",
            "preTaskExecution",
            "postTaskExecution"
          ]
        },
        "patterns": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "File patterns for file-based events"
        },
        "toolTypes": {
          "type": "string",
          "description": "Tool types for preToolUse/postToolUse events"
        }
      }
    },
    "then": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": ["askAgent", "runCommand"]
        },
        "prompt": {
          "type": "string",
          "description": "Prompt for askAgent action"
        },
        "command": {
          "type": "string",
          "description": "Command for runCommand action"
        },
        "timeout": {
          "type": "number",
          "description": "Timeout in seconds for runCommand"
        }
      }
    }
  }
}
```

**File**: `.kiro/utils/validateHook.ts` (NEW)

**Purpose**: Validation utility for hook files

**Specific Changes**:
1. **JSON Syntax Validation**: Parse JSON and catch syntax errors with line/column info
2. **Schema Validation**: Validate against hook.schema.json using JSON schema validator
3. **Error Formatting**: Format validation errors with clear messages and locations
4. **Export Validation Function**: `validateHookFile(content: string): ValidationResult`

**File**: Agent system prompt / tool wrappers (MODIFY)

**Purpose**: Add validation layer before hook file writes

**Specific Changes**:
1. **Wrap fsWrite**: When writing to `*.kiro.hook`, validate content first
2. **Wrap strReplace**: When modifying `*.kiro.hook`, validate result first
3. **Wrap createHook**: Validate generated hook JSON before writing
4. **Error Handling**: If validation fails, reject operation and show errors to user
5. **Preserve Edit Buffer**: Don't write file if validation fails, keep user's edits

#### Part 2: Steering File Management

**File**: `.kiro/docs/steering-file-guidelines.md` (NEW)

**Purpose**: Document best practices for steering file organization

**Content**:
- File size guidelines (ideal: <500 lines, max: 700 lines)
- Modularization patterns (split by topic, use includes)
- Navigation tips (use markdown outline, section links)
- Context budget optimization (selective loading patterns)
- Backup cleanup procedures

**File**: `.kiro/utils/analyzeSteeringFiles.ts` (NEW)

**Purpose**: Tool to analyze steering files and suggest optimizations

**Specific Changes**:
1. **File Size Analysis**: Count lines in all steering files
2. **Complexity Analysis**: Identify files with many sections/subsections
3. **Modularization Suggestions**: Suggest split points for large files
4. **Context Budget Estimation**: Estimate context usage for each file
5. **Report Generation**: Generate markdown report with recommendations

**File**: Agent system prompt (MODIFY)

**Purpose**: Add guidance for steering file management

**Specific Changes**:
1. **Size Awareness**: Check steering file sizes before editing
2. **Modularization Prompts**: Suggest splitting when files exceed 700 lines
3. **Selective Loading**: Load only relevant sections based on task context
4. **Backup Cleanup**: Automatically archive backups older than 7 days
5. **Navigation Assistance**: Provide section links when referencing large files

**File**: `.kiro/hooks/cleanup-steering-backups.kiro.hook` (NEW)

**Purpose**: Automatically clean up old backup files

**Content**:
```json
{
  "enabled": true,
  "name": "Cleanup Old Steering Backups",
  "version": "1",
  "description": "Automatically archive or delete steering file backups older than 7 days",
  "when": {
    "type": "fileCreated",
    "patterns": ["~/.kiro/steering/*.backup", ".kiro/steering/*.backup"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "A backup file was created. Check if any backup files in the steering directory are older than 7 days. If so, archive them to ~/.kiro/archive/steering-backups/ or delete them. Keep this silent unless there's an error."
  }
}
```

#### Part 3: Documentation Updates

**File**: `.kiro/docs/hook-file-format.md` (NEW)

**Purpose**: Document hook file format and validation rules

**Content**:
- Hook file structure explanation
- Required fields and their purposes
- Valid event types and when to use them
- Valid action types and their parameters
- Common validation errors and how to fix them
- Examples of valid hook files

**File**: `.kiro/docs/troubleshooting-hooks.md` (NEW)

**Purpose**: Troubleshooting guide for hook validation errors

**Content**:
- Common JSON syntax errors (missing commas, quotes, brackets)
- Schema validation errors (missing fields, invalid values)
- How to read validation error messages
- Step-by-step fix procedures
- Examples of before/after corrections

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bugs on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Create invalid hook files and large steering files, attempt to save/edit them on the UNFIXED system, and observe that validation is missing and navigation is difficult.

**Test Cases**:
1. **Invalid JSON Syntax Test**: Create hook file with missing comma, attempt to save (will succeed on unfixed code, should fail after fix)
2. **Missing Required Field Test**: Create hook file without "description" field, attempt to save (will succeed on unfixed code, should fail after fix)
3. **Invalid Event Type Test**: Create hook file with `"type": "invalidEvent"`, attempt to save (will succeed on unfixed code, should fail after fix)
4. **Large Steering File Navigation Test**: Open workflow.md (1143 lines) and attempt to navigate to specific section (will be difficult on unfixed code, should be easier after fix)
5. **Context Budget Test**: Load issue-tracking.md (927 lines) into agent context and measure token usage (will consume full file on unfixed code, should load selectively after fix)

**Expected Counterexamples**:
- Invalid hook files are saved without validation errors
- Large steering files are difficult to navigate without TOC/outline
- Entire steering files are loaded regardless of task relevance
- Possible causes: no validation layer, no navigation tools, no selective loading

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed system produces the expected behavior.

**Pseudocode:**
```
FOR ALL hookFileWrite WHERE NOT isValidJSON(content) OR NOT matchesHookSchema(content) DO
  result := attemptWrite_fixed(hookFileWrite)
  ASSERT result.success == false
  ASSERT result.errors.length > 0
  ASSERT result.errors[0].hasLineNumber == true
  ASSERT result.errors[0].hasDescription == true
END FOR

FOR ALL steeringFile WHERE lineCount(steeringFile) > 500 DO
  result := openFile_fixed(steeringFile)
  ASSERT result.hasNavigationSupport == true OR result.hasModularizationRecommendation == true
END FOR
```

**Test Cases**:

1. **JSON Syntax Validation**: Attempt to save hook file with syntax error
   - Input: `{ "name": "test" "version": "1" }`
   - Expected: Validation error with line/column: "Syntax error at line 1, column 18: Expected comma"

2. **Schema Validation**: Attempt to save hook file missing required fields
   - Input: `{ "name": "test", "version": "1" }`
   - Expected: Validation error: "Missing required fields: description, when, then"

3. **Invalid Event Type Validation**: Attempt to save hook with invalid event type
   - Input: `{ "when": { "type": "invalidEvent" } }`
   - Expected: Validation error: "Invalid event type 'invalidEvent'. Valid types: fileEdited, fileCreated, ..."

4. **Steering File Navigation**: Open workflow.md (1143 lines)
   - Expected: Editor shows outline/TOC OR agent suggests modularization

5. **Selective Loading**: Load issue-tracking.md for priority-related task
   - Expected: Only "Issue Priority System" section loaded, not entire file

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed system produces the same result as the original system.

**Pseudocode:**
```
FOR ALL hookFile WHERE isValidJSON(hookFile.content) AND matchesHookSchema(hookFile.content) DO
  ASSERT triggerHook_original(hookFile) == triggerHook_fixed(hookFile)
  ASSERT executeHook_original(hookFile) == executeHook_fixed(hookFile)
END FOR

FOR ALL steeringFile WHERE isValid(steeringFile) DO
  ASSERT loadSteeringFile_original(steeringFile) == loadSteeringFile_fixed(steeringFile)
  ASSERT parseSteeringFile_original(steeringFile) == parseSteeringFile_fixed(steeringFile)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all valid inputs

**Test Plan**: Observe behavior on UNFIXED code first for valid hook files and steering files, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Valid Hook Triggering Preservation**: Verify existing valid hooks continue to trigger correctly
   - Test: Create file matching pattern in valid hook, verify hook triggers
   - Expected: Same behavior before and after fix

2. **Hook Execution Preservation**: Verify hook actions execute correctly
   - Test: Trigger hook with askAgent action, verify agent receives prompt
   - Expected: Same behavior before and after fix

3. **Steering File Loading Preservation**: Verify steering files with `inclusion: always` auto-load
   - Test: Start agent session, verify workflow.md is loaded
   - Expected: Same behavior before and after fix

4. **Frontmatter Parsing Preservation**: Verify frontmatter metadata is parsed correctly
   - Test: Load steering file, check that name/description/priority are extracted
   - Expected: Same behavior before and after fix

5. **File System Operations Preservation**: Verify create/delete/modify operations work
   - Test: Create new hook file, verify it's recognized and loaded
   - Expected: Same behavior before and after fix

### Unit Tests

- Test JSON syntax validation with various syntax errors (missing commas, quotes, brackets)
- Test schema validation with missing required fields
- Test schema validation with invalid field values
- Test validation error message formatting (line numbers, descriptions)
- Test steering file size analysis (line counting, complexity metrics)
- Test modularization suggestion logic (split point identification)
- Test backup cleanup logic (age checking, archival)

### Property-Based Tests

- Generate random JSON structures and verify syntax validation catches all invalid JSON
- Generate random hook configurations and verify schema validation catches all invalid schemas
- Generate random valid hook files and verify they pass validation
- Generate random steering file sizes and verify navigation support is provided for files >500 lines
- Generate random file system operations and verify preservation of existing behavior

### Integration Tests

- Test full hook creation workflow: create hook via createHook tool, verify validation, verify triggering
- Test full hook editing workflow: edit existing hook, introduce error, verify validation prevents save
- Test full steering file workflow: open large file, navigate to section, edit, verify markdown validation
- Test backup cleanup workflow: create backup, wait 7 days (simulated), verify cleanup
- Test selective loading workflow: start task, verify only relevant steering sections loaded

