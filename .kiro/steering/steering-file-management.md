---
name: "Steering File Management"
description: "Guidelines for agents when creating or modifying steering files"
priority: high
inclusion: fileMatch
fileMatchPattern: "**/.kiro/steering/*.md"
tags: [steering, management, guidelines]
version: 1.0
lastUpdated: 2026-05-03
---

# Steering File Management - Agent Guidelines

## Overview

When creating or modifying steering files, follow these guidelines to ensure optimal performance and usability.

## File Size Awareness

### Check File Size Before Editing

Before modifying a steering file, check its current size:

```bash
wc -l ~/.kiro/steering/filename.md
```

### Size Thresholds

- **< 500 lines**: ✅ Optimal - proceed with edits
- **500-700 lines**: ⚠️ Review - suggest splitting if adding significant content
- **700-1000 lines**: 🔶 Should split - strongly recommend splitting before major additions
- **≥ 1000 lines**: 🚨 Urgent - must split before any additions

### When to Suggest Splitting

Suggest splitting when:
- File exceeds 700 lines
- User is about to add significant content (>100 lines) to a file >500 lines
- File covers multiple distinct topics
- Navigation is becoming difficult

### How to Suggest Splitting

**Format:**
```
⚠️ Steering File Size Notice

The file `filename.md` is currently XXX lines (recommended: <500 lines).

I recommend splitting this file before making changes:

Suggested approach:
1. Create focused sub-files:
   - filename-topic1.md
   - filename-topic2.md
   - filename-topic3.md

2. Keep overview in main file with links to details

3. Use selective loading (fileMatch or manual inclusion)

Would you like me to:
1. Proceed with current file (not recommended)
2. Help split the file first (recommended)
3. Show detailed split recommendations
```

## Modularization Recommendations

### Analyze Before Recommending

Use the analysis tool to get specific recommendations:

```bash
node .kiro/utils/dist/analyzeSteeringFilesCLI.js ~/.kiro/steering
```

### Present Split Recommendations

When suggesting splits, provide:
1. **Current metrics**: Line count, token usage, complexity
2. **Specific split points**: Which sections to separate
3. **Proposed structure**: New file names and organization
4. **Benefits**: Improved navigation, reduced context usage

### Example Recommendation

```
📊 Analysis Results for workflow.md:
- Current size: 1,144 lines (~6,452 tokens)
- Status: 🚨 Urgent - needs splitting

Recommended split:
1. workflow-overview.md (200 lines)
   - Keep: Core principles, quick reference
   - Inclusion: always

2. workflow-phases.md (400 lines)
   - Keep: Phase 1-8 detailed steps
   - Inclusion: manual

3. workflow-subagents.md (300 lines)
   - Keep: Subagent delegation patterns
   - Inclusion: manual

4. workflow-examples.md (244 lines)
   - Keep: Example workflows
   - Inclusion: manual

Benefits:
✅ Reduced context usage (only overview always loaded)
✅ Easier navigation (focused files)
✅ Selective loading (load only what's needed)
```

## Selective Loading Guidance

### Choose Appropriate Inclusion Type

**Always Include** (use sparingly):
```yaml
---
inclusion: always
---
```
- Only for core principles (<300 lines)
- Frequently needed in every conversation
- Examples: core-behavior.md, workflow-overview.md

**File Match** (recommended for specific contexts):
```yaml
---
inclusion: fileMatch
fileMatchPattern: "**/*.test.ts"
---
```
- For file-type-specific guidance
- Examples: testing guidelines, language-specific rules

**Manual** (default for specialized topics):
```yaml
---
inclusion: manual
---
```
- For specialized or advanced topics
- User explicitly includes with #filename
- Examples: debugging guides, advanced patterns

### Recommend Selective Loading

When creating new steering files, suggest:
```
I recommend using `inclusion: manual` for this file because:
- It covers specialized topic (not needed in every conversation)
- It's XXX lines (selective loading reduces context usage)
- Users can include it with #filename when needed

Alternative: Use `inclusion: fileMatch` with pattern "**/*.test.ts" 
if this guidance is specific to test files.
```

## Backup Cleanup

### Automatic Cleanup

A hook automatically cleans up old backups:
- Triggers when `.backup` files are created
- Archives backups older than 7 days
- Location: `~/.kiro/archive/steering-backups/`

### Manual Cleanup

If user asks about backup files:
```bash
# Find old backups
find ~/.kiro/steering -name "*.backup" -mtime +7

# Archive them
mkdir -p ~/.kiro/archive/steering-backups
find ~/.kiro/steering -name "*.backup" -mtime +7 -exec mv {} ~/.kiro/archive/steering-backups/ \;
```

## Navigation Assistance

### Provide Section Links

When referencing large files, provide direct section links:

```
See the "Error Handling" section in code-standards.md:
[Error Handling](#error-handling)

Or search for "Error Handling" in your editor (Cmd/Ctrl + F)
```

### Suggest Using Outline View

For large files, remind users about outline/TOC:
```
💡 Tip: Use your editor's outline view to navigate this file:
- VS Code: Outline panel (Cmd/Ctrl + Shift + O)
- Cursor: Document outline in sidebar
```

### Create Table of Contents

When creating files >300 lines, add a TOC:
```markdown
## Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
- [Section 3](#section-3)
```

## File Creation Best Practices

### Always Include Frontmatter

```yaml
---
name: "Descriptive Name"
description: "Brief description of file purpose"
priority: medium
inclusion: manual
tags: [relevant, tags, here]
version: 1.0
lastUpdated: 2026-05-03
---
```

### Use Consistent Structure

```markdown
# Title

## Overview
Brief description

## Table of Contents
(For files > 300 lines)

## Main Content
Organized sections

## Examples
Concrete examples

## See Also
Links to related files
```

### Keep Files Focused

Each file should have ONE clear purpose:
- ✅ Good: "Git Commit Guidelines"
- ❌ Bad: "Development Best Practices" (too broad)

## Monitoring and Maintenance

### Regular Analysis

Suggest running analysis periodically:
```
💡 Recommendation: Run steering file analysis to check file health:

node .kiro/utils/dist/analyzeSteeringFilesCLI.js ~/.kiro/steering

This will show:
- Files that need splitting
- Token usage estimates
- Specific recommendations
```

### Proactive Suggestions

When you notice issues:
```
⚠️ I notice several steering files are getting large:
- workflow.md: 1,144 lines (🚨 urgent)
- issue-tracking.md: 928 lines (🔶 should split)
- architecture.md: 733 lines (🔶 should split)

Would you like me to help split these files to improve performance?
```

## Example Interactions

### Example 1: User Wants to Add Content

**User**: "Add a section about error handling to code-standards.md"

**Agent Response**:
```
I'll add the error handling section. First, let me check the file size:

📊 Current size: 675 lines (⚠️ approaching limit)

Since we're adding ~50 lines to a file that's already 675 lines, I recommend:

Option 1 (Recommended): Split the file first
- Create code-standards-error-handling.md (new file)
- Keep code-standards.md as overview with link
- Benefits: Better organization, reduced context usage

Option 2: Add to current file
- File will be ~725 lines (🔶 should split)
- Will need splitting soon anyway

Which approach would you prefer?
```

### Example 2: User Creates New File

**User**: "Create a new steering file for database guidelines"

**Agent Response**:
```
I'll create database-guidelines.md. 

Recommended frontmatter:
---
name: "Database Guidelines"
description: "Best practices for database design and queries"
priority: medium
inclusion: fileMatch
fileMatchPattern: "**/*{.sql,.prisma,*Model.ts}"
tags: [database, sql, prisma]
version: 1.0
lastUpdated: 2026-05-03
---

I'm using `inclusion: fileMatch` so this file only loads when working 
with database-related files, reducing context usage.

Shall I proceed?
```

### Example 3: User Asks About Large File

**User**: "Why is my agent slow?"

**Agent Response**:
```
Let me check your steering files...

📊 Analysis Results:
- Total files: 9
- Total tokens: ~27,341
- Large files consuming context:
  - workflow.md: ~6,452 tokens (🚨 urgent)
  - issue-tracking.md: ~4,469 tokens (🔶 should split)
  - architecture.md: ~3,978 tokens (🔶 should split)

These 3 files alone consume ~15,000 tokens (~7.5% of context budget).

Recommendation: Split these files to improve performance.

Would you like me to:
1. Show detailed split recommendations
2. Help split one file as an example
3. Generate full analysis report
```

## Key Principles

1. **Check size before editing** - Prevent files from growing too large
2. **Suggest splitting proactively** - Don't wait for files to become urgent
3. **Provide specific recommendations** - Use analysis tool for concrete suggestions
4. **Use selective loading** - Reduce context usage with appropriate inclusion rules
5. **Maintain navigation aids** - TOC, section links, outline views
6. **Keep files focused** - One clear purpose per file
7. **Monitor regularly** - Suggest periodic analysis

## Tools Available

- **Analysis Tool**: `.kiro/utils/dist/analyzeSteeringFilesCLI.js`
- **Guidelines Doc**: `.kiro/docs/steering-file-guidelines.md`
- **Backup Cleanup Hook**: Automatic (7-day retention)

## Summary

When working with steering files:
- ✅ Check size before editing
- ✅ Suggest splitting when files exceed 700 lines
- ✅ Use selective loading to reduce context usage
- ✅ Provide navigation assistance for large files
- ✅ Include proper frontmatter in all files
- ✅ Run analysis tool periodically
- ✅ Keep files focused and well-organized
