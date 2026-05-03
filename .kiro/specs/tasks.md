# Implementation Plan

## Overview

This implementation plan follows the bugfix workflow methodology: first write tests to explore and understand the bugs (Bug Condition), then write tests to preserve existing behavior (Preservation), and finally implement the fix with validation.

---

## Tasks

- [x] 1. Write bug condition exploration tests (Hook File Validation)
  - **Property 1: Bug Condition** - Invalid Hook Files Are Accepted
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bugs exist
  - **Scoped PBT Approach**: For deterministic bugs, scope properties to concrete failing cases to ensure reproducibility
  - Test that invalid JSON hook files are saved without validation errors (from Bug Condition in design)
  - Test that hook files with missing required fields are saved without schema validation
  - Test that hook files with invalid event types are saved without validation
  - Test that hook files with invalid action types are saved without validation
  - The test assertions should match the Expected Behavior Properties from design (validation errors with line/column info)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Write bug condition exploration tests (Steering File Management)
  - **Property 1: Bug Condition** - Large Steering Files Lack Navigation Support
  - **CRITICAL**: These tests MUST FAIL on unfixed code - failure confirms the bugs exist
  - **DO NOT attempt to fix the tests or the code when they fail**
  - **NOTE**: These tests encode the expected behavior - they will validate the fix when they pass after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bugs exist
  - Test that steering files over 500 lines lack navigation support (from Bug Condition in design)
  - Test that large steering files are loaded entirely into context regardless of task relevance
  - Test that backup files accumulate without cleanup
  - The test assertions should match the Expected Behavior Properties from design (navigation support, selective loading, backup cleanup)
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (this is correct - it proves the bugs exist)
  - Document counterexamples found to understand root cause
  - Mark task complete when tests are written, run, and failures are documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 3. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Hook System Functionality Preserved
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for valid hook files (cases where isBugCondition returns false)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Valid hook files trigger correctly based on event types
    - Hook actions (askAgent, runCommand) execute with correct parameters
    - Glob pattern matching works for file patterns
    - Multiple hooks execute in correct order
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Steering File System Functionality Preserved
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for valid steering files
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Steering files with frontmatter metadata parse correctly
    - Files with `inclusion: always` auto-load into agent context
    - Markdown content renders correctly
    - Agent receives same guidance from steering files
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.5, 3.6, 3.7, 3.8_

- [x] 5. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - File System Operations Preserved
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for file system operations
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - New hook files are recognized and loaded automatically
    - New steering files are indexed via auto-indexing hooks
    - File deletions are handled gracefully without errors
    - File path/pattern modifications update references correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.9, 3.10, 3.11, 3.12_

- [x] 6. Implement Hook File Validation System

  - [x] 6.1 Create JSON schema for hook files
    - Create `.kiro/schemas/hook.schema.json` with complete hook structure definition
    - Define required fields: name, version, description, when, then
    - Define valid event types enum: fileEdited, fileCreated, fileDeleted, userTriggered, promptSubmit, agentStop, preToolUse, postToolUse, preTaskExecution, postTaskExecution
    - Define valid action types enum: askAgent, runCommand
    - Define conditional requirements (patterns for file events, toolTypes for tool events)
    - Include descriptions for all fields
    - _Bug_Condition: isBugCondition(input) where input.type == "FileWrite" AND input.path MATCHES "*.kiro.hook" AND (NOT isValidJSON(input.content) OR NOT matchesHookSchema(input.content))_
    - _Expected_Behavior: Validation errors with line/column information for syntax errors, clear messages for schema violations_
    - _Preservation: All valid hook files continue to work without modification_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.2 Create hook validation utility
    - Create `.kiro/utils/validateHook.ts` with validation functions
    - Implement `isValidJSON(content: string)` - parse JSON and catch syntax errors with line/column info
    - Implement `matchesHookSchema(content: string)` - validate against hook.schema.json using JSON schema validator
    - Implement `formatValidationErrors(errors: ValidationError[])` - format errors with clear messages and locations
    - Export `validateHookFile(content: string): ValidationResult` as main validation function
    - Return structured validation result with success flag, errors array, and formatted error messages
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: expectedBehavior(result) from design - clear validation errors before file write_
    - _Preservation: Validation only prevents NEW invalid files, existing files continue to work_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.3 Integrate validation into file write operations
    - Modify agent system prompt / tool wrappers to add validation layer
    - Wrap `fsWrite` tool: when writing to `*.kiro.hook`, validate content first
    - Wrap `strReplace` tool: when modifying `*.kiro.hook`, validate result first
    - Wrap `createHook` tool: validate generated hook JSON before writing
    - If validation fails: reject operation, display errors to user, preserve edit buffer
    - If validation succeeds: proceed with file write operation
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: expectedBehavior(result) from design - validation before save_
    - _Preservation: Valid hook files write successfully as before_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 6.4 Verify bug condition exploration tests now pass (Hook Validation)
    - **Property 1: Expected Behavior** - Hook File Validation Works
    - **IMPORTANT**: Re-run the SAME tests from task 1 - do NOT write new tests
    - The tests from task 1 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 1
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - Verify invalid JSON is rejected with clear error messages
    - Verify missing required fields are caught with schema validation
    - Verify invalid event types are rejected with valid options shown
    - Verify invalid action types are rejected with valid options shown
    - _Requirements: Expected Behavior Properties from design - 2.1, 2.2, 2.3, 2.4_

  - [x] 6.5 Verify preservation tests still pass (Hook System)
    - **Property 2: Preservation** - Hook System Functionality Preserved
    - **IMPORTANT**: Re-run the SAME tests from task 3 - do NOT write new tests
    - Run preservation property tests from step 3
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm valid hook files trigger correctly
    - Confirm hook actions execute properly
    - Confirm pattern matching works
    - Confirm multiple hooks execute in order
    - _Requirements: Preservation Requirements from design - 3.1, 3.2, 3.3, 3.4_

- [x] 7. Implement Steering File Management System

  - [x] 7.1 Create steering file analysis utility
    - Create `.kiro/utils/analyzeSteeringFiles.ts` with analysis functions
    - Implement `countLines(filePath: string)` - count lines in steering file
    - Implement `analyzeComplexity(content: string)` - identify sections, subsections, nesting depth
    - Implement `suggestSplitPoints(content: string)` - suggest logical split points for large files
    - Implement `estimateContextUsage(content: string)` - estimate token usage for file
    - Implement `generateReport(files: SteeringFile[])` - generate markdown report with recommendations
    - Export `analyzeSteeringFiles(directory: string): AnalysisReport` as main function
    - _Bug_Condition: isBugCondition(input) where input.type == "FileOpen" AND input.path MATCHES "*.kiro/steering/*.md" AND lineCount > 500_
    - _Expected_Behavior: Navigation support, modularization recommendations, selective loading_
    - _Preservation: All steering files continue to load and function as before_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x] 7.2 Create steering file guidelines documentation
    - Create `.kiro/docs/steering-file-guidelines.md` with best practices
    - Document file size guidelines: ideal <500 lines, max 700 lines
    - Document modularization patterns: split by topic, use includes, maintain coherence
    - Document navigation tips: use markdown outline, section links, search-within-file
    - Document context budget optimization: selective loading patterns, relevant sections only
    - Document backup cleanup procedures: automatic archival after 7 days
    - Include examples of well-structured steering files
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: Clear guidance for managing large steering files_
    - _Preservation: Existing steering files continue to work_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x] 7.3 Create backup cleanup hook
    - Create `.kiro/hooks/cleanup-steering-backups.kiro.hook` with auto-cleanup logic
    - Configure hook to trigger on fileCreated event for `*.backup` files in steering directories
    - Hook action: askAgent to check for backups older than 7 days
    - If old backups found: archive to `~/.kiro/archive/steering-backups/` or delete
    - Keep operation silent unless errors occur
    - Test hook triggers correctly on backup file creation
    - _Bug_Condition: isBugCondition(input) from design - backup file accumulation_
    - _Expected_Behavior: Automatic cleanup of old backup files_
    - _Preservation: Backup file creation still works, only cleanup is added_
    - _Requirements: 2.9_

  - [x] 7.4 Update agent system prompt for steering file management
    - Add guidance for checking steering file sizes before editing
    - Add prompts to suggest splitting when files exceed 700 lines
    - Add logic for selective loading: load only relevant sections based on task context
    - Add automatic backup cleanup: archive backups older than 7 days
    - Add navigation assistance: provide section links when referencing large files
    - Document size thresholds: 500-700 lines suggest review, 700-1000 recommend split, 1000+ strongly recommend
    - _Bug_Condition: isBugCondition(input) from design_
    - _Expected_Behavior: Agent provides navigation support and modularization recommendations_
    - _Preservation: Agent continues to load and use steering files as before_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x] 7.5 Verify bug condition exploration tests now pass (Steering Files)
    - **Property 1: Expected Behavior** - Steering File Management Works
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - The tests from task 2 encode the expected behavior
    - When these tests pass, it confirms the expected behavior is satisfied
    - Run bug condition exploration tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms bugs are fixed)
    - Verify large files have navigation support or modularization recommendations
    - Verify selective loading works for task-relevant sections
    - Verify backup cleanup works for old backup files
    - _Requirements: Expected Behavior Properties from design - 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

  - [x] 7.6 Verify preservation tests still pass (Steering System)
    - **Property 2: Preservation** - Steering File System Functionality Preserved
    - **IMPORTANT**: Re-run the SAME tests from tasks 4 and 5 - do NOT write new tests
    - Run preservation property tests from steps 4 and 5
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm frontmatter parsing works correctly
    - Confirm auto-loading with `inclusion: always` works
    - Confirm markdown rendering works
    - Confirm agent receives same guidance
    - Confirm file system operations work correctly
    - _Requirements: Preservation Requirements from design - 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12_

- [x] 8. Create Documentation

  - [x] 8.1 Create hook file format documentation
    - Create `.kiro/docs/hook-file-format.md` with comprehensive format guide
    - Document hook file structure: required fields, optional fields, field purposes
    - Document valid event types: when to use each type, examples for each
    - Document valid action types: askAgent vs runCommand, parameters for each
    - Document pattern matching: glob patterns, file patterns, tool type patterns
    - Include examples of valid hook files for common use cases
    - Document JSON schema location and how to use it
    - _Bug_Condition: Users lack clear documentation for hook file format_
    - _Expected_Behavior: Clear, comprehensive documentation for hook file format_
    - _Preservation: Documentation is additive, doesn't change existing behavior_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 8.2 Create hook troubleshooting guide
    - Create `.kiro/docs/troubleshooting-hooks.md` with error resolution guide
    - Document common JSON syntax errors: missing commas, quotes, brackets, unclosed arrays/objects
    - Document schema validation errors: missing required fields, invalid field values, incorrect types
    - Document how to read validation error messages: line/column numbers, error descriptions
    - Provide step-by-step fix procedures for each error type
    - Include before/after examples of corrections
    - Document how to test hook files after fixing errors
    - _Bug_Condition: Users struggle to fix validation errors_
    - _Expected_Behavior: Clear troubleshooting guide for common errors_
    - _Preservation: Documentation is additive, doesn't change existing behavior_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 9. Checkpoint - Ensure all tests pass
  - Run all bug condition exploration tests - verify they now PASS (were failing before fix)
  - Run all preservation property tests - verify they still PASS (were passing before fix)
  - Run unit tests for validation utilities
  - Run unit tests for steering file analysis utilities
  - Run integration tests for hook file validation workflow
  - Run integration tests for steering file management workflow
  - Verify no regressions in existing hook functionality
  - Verify no regressions in existing steering file functionality
  - Ask user if any questions arise or if additional testing is needed

---

## Testing Notes

### Bug Condition Exploration (Tasks 1-2)

These tests MUST FAIL on unfixed code. They demonstrate the bugs exist by:
- Attempting to save invalid JSON hook files (should fail validation but doesn't)
- Attempting to save hook files with missing required fields (should fail schema validation but doesn't)
- Opening large steering files (should provide navigation support but doesn't)
- Loading large steering files into context (should load selectively but loads entirely)

**Expected outcome**: Tests FAIL before fix, PASS after fix

### Preservation Testing (Tasks 3-5)

These tests MUST PASS on unfixed code. They capture existing correct behavior by:
- Verifying valid hook files trigger correctly
- Verifying hook actions execute properly
- Verifying steering files load and parse correctly
- Verifying file system operations work correctly

**Expected outcome**: Tests PASS before fix, PASS after fix (no regressions)

### Property-Based Testing Strategy

Property-based testing is used for preservation tests because:
- Preservation is about universal properties ("for all valid inputs")
- PBT generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides stronger guarantees that behavior is unchanged

### Test Execution Order

1. Write exploration tests (tasks 1-2) - expect FAILURE
2. Write preservation tests (tasks 3-5) - expect SUCCESS
3. Implement fixes (tasks 6-7)
4. Re-run exploration tests - expect SUCCESS (bugs fixed)
5. Re-run preservation tests - expect SUCCESS (no regressions)

---

## Implementation Notes

### Hook File Validation

The validation layer intercepts file write operations for `*.kiro.hook` files and validates:
1. JSON syntax (catches missing commas, quotes, brackets)
2. Schema compliance (catches missing required fields, invalid values)
3. Provides clear error messages with line/column information

### Steering File Management

The management system provides:
1. Analysis utility to identify large files and suggest optimizations
2. Guidelines documentation for best practices
3. Backup cleanup hook for automatic maintenance
4. Agent prompt updates for navigation support and selective loading

### Backward Compatibility

All changes are backward compatible:
- Existing valid hook files continue to work without modification
- Existing steering files continue to load and function as before
- Validation only prevents NEW invalid files from being created
- All file system operations remain unchanged

---

## Success Criteria

- [ ] Invalid hook files are rejected with clear validation errors
- [ ] Valid hook files continue to work without modification
- [ ] Large steering files have navigation support or modularization recommendations
- [ ] Steering files load selectively based on task relevance
- [ ] Old backup files are cleaned up automatically
- [ ] All existing hook functionality is preserved
- [ ] All existing steering file functionality is preserved
- [ ] All tests pass (exploration tests now pass, preservation tests still pass)
- [ ] Documentation is complete and clear
