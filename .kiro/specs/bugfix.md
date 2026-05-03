# Bugfix Requirements Document

## Introduction

This document addresses critical usability issues with editing JSON hook files and managing long markdown steering files in the Kiro agent system. Users experience frequent JSON syntax errors when manually editing `.kiro.hook` files, and struggle to navigate and edit large steering markdown files (600-1143 lines). These issues significantly impact productivity and increase the risk of configuration errors.

**Affected Components:**
- Hook files: `.kiro/hooks/*.kiro.hook` (JSON format)
- Steering files: `.kiro/steering/*.md` (Markdown format, 108-1143 lines)

**Impact:**
- High error rate when editing hook configurations
- Difficulty navigating and maintaining large steering files
- Reduced productivity due to manual error correction
- Risk of broken hooks due to invalid JSON

---

## Bug Analysis

### Current Behavior (Defect)

#### 1. JSON Hook File Editing Issues

**1.1** WHEN a user manually edits a `.kiro.hook` file THEN the system provides no real-time validation feedback, allowing syntax errors (missing commas, quotes, brackets) to be saved

**1.2** WHEN a user saves a `.kiro.hook` file with invalid JSON THEN the system accepts the file without validation, causing runtime errors when the hook is triggered

**1.3** WHEN a user edits complex pattern arrays in hook files (e.g., `"patterns": ["~/.kiro/steering/*.md"]`) THEN the JSON structure is error-prone due to nested quotes and brackets

**1.4** WHEN a user needs to modify hook configuration THEN they must manually edit raw JSON with no schema assistance or autocomplete

#### 2. Long Markdown Steering File Management Issues

**2.1** WHEN a user opens `workflow.md` (1143 lines) THEN they must scroll extensively to find specific sections, with no quick navigation

**2.2** WHEN a user opens `issue-tracking.md` (927 lines) THEN the file length makes it difficult to understand the overall structure and locate specific content

**2.3** WHEN a user opens `architecture.md` (732 lines) THEN the monolithic structure makes it hard to focus on specific architectural concerns

**2.4** WHEN a user edits long steering files THEN they risk breaking markdown formatting or accidentally modifying unrelated sections

**2.5** WHEN steering files are loaded into agent context THEN large files (600-1143 lines) consume significant context budget, reducing available space for task-specific information

**2.6** WHEN backup files exist (e.g., `mcp-powers-skills.md.backup`) THEN they clutter the directory and may cause confusion about which file is active

---

### Expected Behavior (Correct)

#### 1. JSON Hook File Editing - Validation & Safety

**2.1** WHEN a user edits a `.kiro.hook` file THEN the system SHALL provide JSON schema validation with clear error messages indicating the exact location and nature of syntax errors

**2.2** WHEN a user saves a `.kiro.hook` file with invalid JSON THEN the system SHALL reject the save operation and display validation errors before the file is written

**2.3** WHEN a user edits hook pattern arrays THEN the system SHALL provide schema-aware editing assistance (autocomplete, syntax highlighting, bracket matching)

**2.4** WHEN a user creates or modifies a hook THEN the system SHALL validate against the hook schema (required fields: name, version, description, when, then)

#### 2. Long Markdown Steering File Management - Navigation & Organization

**2.5** WHEN a user opens a steering file over 500 lines THEN the system SHALL provide quick navigation via table of contents, section jumping, or file splitting recommendations

**2.6** WHEN a user needs to reference specific sections of long steering files THEN the system SHALL support modular organization (splitting into focused sub-files or using includes)

**2.7** WHEN steering files are loaded into agent context THEN the system SHALL load only relevant sections based on the current task, not entire monolithic files

**2.8** WHEN a user edits steering files THEN the system SHALL provide markdown validation to prevent formatting errors

**2.9** WHEN backup files exist in steering directories THEN the system SHALL automatically clean up or archive old backups to prevent directory clutter

**2.10** WHEN a user views the steering directory THEN the system SHALL display file sizes and line counts to help identify files that need optimization

---

### Unchanged Behavior (Regression Prevention)

#### 3. Hook System Functionality

**3.1** WHEN a valid `.kiro.hook` file exists THEN the system SHALL CONTINUE TO trigger hooks based on the configured event types (fileEdited, fileCreated, fileDeleted, etc.)

**3.2** WHEN a hook is triggered THEN the system SHALL CONTINUE TO execute the configured action (askAgent, runCommand) with the specified parameters

**3.3** WHEN hook patterns match files THEN the system SHALL CONTINUE TO correctly identify matching files using glob patterns

**3.4** WHEN multiple hooks are configured THEN the system SHALL CONTINUE TO execute all matching hooks in the correct order

#### 4. Steering File System Functionality

**3.5** WHEN steering files contain frontmatter metadata THEN the system SHALL CONTINUE TO parse and use the metadata (name, description, type, inclusion, priority)

**3.6** WHEN steering files are marked with `inclusion: always` THEN the system SHALL CONTINUE TO automatically load them into agent context

**3.7** WHEN steering files contain markdown content THEN the system SHALL CONTINUE TO correctly parse and display the formatted content

**3.8** WHEN the agent references steering files THEN the system SHALL CONTINUE TO provide the same guidance and rules as before any optimization

#### 5. File System Operations

**3.9** WHEN users create new hook files THEN the system SHALL CONTINUE TO recognize and load them automatically

**3.10** WHEN users create new steering files THEN the system SHALL CONTINUE TO index them via the auto-indexing hooks

**3.11** WHEN users delete hook or steering files THEN the system SHALL CONTINUE TO handle the removal gracefully without errors

**3.12** WHEN users modify file paths or patterns THEN the system SHALL CONTINUE TO update references correctly
