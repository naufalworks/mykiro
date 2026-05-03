# Steering File Guidelines

## Overview

Steering files provide guidance and context to the Kiro agent. This guide explains best practices for creating, organizing, and maintaining steering files to ensure optimal performance and usability.

## File Size Guidelines

### Recommended Limits

- **Ideal**: < 500 lines per file
- **Acceptable**: 500-700 lines (review for split opportunities)
- **Should Split**: 700-1000 lines (recommend splitting)
- **Urgent**: ≥ 1000 lines (strongly recommend immediate splitting)

### Why Size Matters

Large steering files cause several issues:

1. **Context Budget**: Each file consumes tokens from the agent's context window
2. **Navigation**: Difficult to find specific sections in large files
3. **Maintenance**: Higher risk of accidental modifications
4. **Performance**: Slower loading and processing times
5. **Relevance**: Agent loads entire file even when only part is needed

### Token Usage Estimates

- 500 lines ≈ 2,500-3,000 tokens
- 1000 lines ≈ 5,000-6,000 tokens
- 1500 lines ≈ 7,500-9,000 tokens

**Context Budget**: Agent has ~200,000 tokens total. Large steering files can consume 5-10% of available context.

## Modularization Patterns

### When to Split

Split a steering file when:

- File exceeds 700 lines
- File covers multiple distinct topics
- Sections are independently useful
- Different sections apply to different tasks
- Navigation becomes difficult

### How to Split

#### Pattern 1: Topic-Based Split

Split by major topics into focused files:

```
# Before (1000 lines)
workflow.md
  - Clarification
  - Context Gathering
  - Planning
  - Execution
  - Validation

# After (5 files, ~200 lines each)
workflow-clarification.md
workflow-context.md
workflow-planning.md
workflow-execution.md
workflow-validation.md
```

#### Pattern 2: Hierarchical Split

Keep overview in main file, details in sub-files:

```
# Main file: architecture.md (200 lines)
- Overview
- Key principles
- Quick reference
- Links to detailed guides

# Detail files:
architecture-file-structure.md
architecture-naming-conventions.md
architecture-module-boundaries.md
```

#### Pattern 3: Use Case Split

Split by when the guidance is needed:

```
# Before: code-standards.md (700 lines)

# After:
code-standards-overview.md      # General principles
code-standards-functions.md     # Function design
code-standards-testing.md       # Testing guidelines
code-standards-security.md      # Security practices
```

### Maintaining Coherence

When splitting files:

1. **Keep related content together** - Don't split mid-topic
2. **Use clear file names** - Name should indicate content
3. **Add cross-references** - Link related files
4. **Update frontmatter** - Set appropriate inclusion rules
5. **Test after splitting** - Verify agent still has needed context

## Navigation Tips

### Use Markdown Outline

Most editors provide outline/TOC views:

- **VS Code**: Outline panel (Cmd/Ctrl + Shift + O)
- **Cursor**: Document outline in sidebar
- **Vim**: Use markdown plugins with TOC support

### Section Links

Add a table of contents at the top of large files:

```markdown
# Workflow Guide

## Table of Contents

- [Phase 1: Clarification](#phase-1-clarification)
- [Phase 2: Context Gathering](#phase-2-context-gathering)
- [Phase 3: Planning](#phase-3-planning)
- [Phase 4: Execution](#phase-4-execution)

## Phase 1: Clarification
...
```

### Search Within File

Use editor search (Cmd/Ctrl + F) to jump to specific sections.

### Bookmarks

Use editor bookmarks to mark frequently accessed sections.

## Context Budget Optimization

### Selective Loading Patterns

#### Pattern 1: Conditional Inclusion

Use frontmatter to control when files load:

```yaml
---
inclusion: fileMatch
fileMatchPattern: "**/*.test.ts"
---

# Testing Guidelines

This file only loads when test files are in context.
```

#### Pattern 2: Manual Inclusion

For specialized guidance, use manual inclusion:

```yaml
---
inclusion: manual
---

# Advanced Debugging Techniques

User must explicitly include this file with #steering-debugging
```

#### Pattern 3: Always Include (Use Sparingly)

Only for essential, frequently-needed guidance:

```yaml
---
inclusion: always
---

# Core Workflow

This loads in every conversation.
```

### Selective Loading Best Practices

1. **Default to manual inclusion** for specialized topics
2. **Use fileMatch** for file-type-specific guidance
3. **Reserve always** for core principles only
4. **Keep always-included files small** (< 300 lines)

## Backup Cleanup Procedures

### Automatic Cleanup

A hook automatically cleans up old backup files:

- **Trigger**: When `.backup` files are created
- **Action**: Archive backups older than 7 days
- **Location**: `~/.kiro/archive/steering-backups/`

### Manual Cleanup

To manually clean up backups:

```bash
# Find old backups
find ~/.kiro/steering -name "*.backup" -mtime +7

# Archive old backups
mkdir -p ~/.kiro/archive/steering-backups
find ~/.kiro/steering -name "*.backup" -mtime +7 -exec mv {} ~/.kiro/archive/steering-backups/ \;

# Or delete old backups
find ~/.kiro/steering -name "*.backup" -mtime +7 -delete
```

### Backup Best Practices

1. **Don't commit backups** - Add `*.backup` to `.gitignore`
2. **Review before deleting** - Check backup isn't needed
3. **Archive important versions** - Move to archive instead of deleting
4. **Use version control** - Git is better than backup files

## File Structure Best Practices

### Frontmatter

Always include frontmatter with metadata:

```yaml
---
name: "Workflow Guidelines"
description: "Complete workflow process for agent execution"
priority: high
inclusion: always
tags: [workflow, process, methodology]
version: 2.0
lastUpdated: 2026-05-03
---
```

### Document Structure

Use consistent structure:

```markdown
---
frontmatter here
---

# Title

## Overview
Brief description of file purpose

## Table of Contents
(For files > 300 lines)

## Main Content
Organized into logical sections

## Examples
Concrete examples of concepts

## Troubleshooting
Common issues and solutions

## See Also
Links to related files
```

### Heading Hierarchy

Use consistent heading levels:

- `#` - File title (one per file)
- `##` - Major sections
- `###` - Subsections
- `####` - Details (use sparingly)

Avoid deep nesting (> 4 levels).

## Examples of Well-Structured Files

### Example 1: Small, Focused File

```markdown
---
name: "Git Commit Guidelines"
inclusion: fileMatch
fileMatchPattern: ".git/**"
---

# Git Commit Guidelines

## Commit Message Format

Use conventional commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- refactor: Code refactoring

## Examples

✅ Good: "feat: add user authentication"
❌ Bad: "updated stuff"

## See Also
- [Code Standards](./code-standards.md)
```

**Why it works**: 
- Single focused topic
- Clear, actionable guidance
- Conditional loading (only when needed)
- Under 50 lines

### Example 2: Modular Large Topic

```markdown
# Main file: testing-overview.md (150 lines)
---
name: "Testing Overview"
inclusion: always
---

# Testing Guidelines

## Quick Reference
- Unit tests: Test individual functions
- Integration tests: Test component interactions
- E2E tests: Test full user flows

## Detailed Guides
- [Unit Testing Guide](./testing-unit.md)
- [Integration Testing Guide](./testing-integration.md)
- [E2E Testing Guide](./testing-e2e.md)

---

# Detail file: testing-unit.md (200 lines)
---
name: "Unit Testing Guide"
inclusion: fileMatch
fileMatchPattern: "**/*.test.ts"
---

# Unit Testing Guide

[Detailed unit testing guidance...]
```

**Why it works**:
- Overview always available
- Details load only when needed
- Each file focused and manageable
- Clear navigation between files

## Analysis Tool

Use the steering file analysis tool to check your files:

```bash
# Analyze all steering files
node .kiro/utils/dist/analyzeSteeringFilesCLI.js ~/.kiro/steering

# Save report to file
node .kiro/utils/dist/analyzeSteeringFilesCLI.js ~/.kiro/steering --output report.md
```

The tool provides:
- Line counts and token estimates
- Complexity metrics
- Split recommendations
- Status for each file

## Migration Guide

### Splitting an Existing Large File

1. **Analyze the file**
   ```bash
   node .kiro/utils/dist/analyzeSteeringFilesCLI.js ~/.kiro/steering
   ```

2. **Identify logical sections**
   - Look for major headings (##)
   - Group related content
   - Consider use cases

3. **Create new files**
   - Use descriptive names
   - Add appropriate frontmatter
   - Set inclusion rules

4. **Update main file**
   - Keep overview/quick reference
   - Add links to detail files
   - Update frontmatter

5. **Test**
   - Verify agent has needed context
   - Check cross-references work
   - Confirm selective loading works

6. **Archive old file**
   ```bash
   mv old-file.md ~/.kiro/archive/steering-backups/old-file-$(date +%Y%m%d).md
   ```

### Example Migration

**Before**: `workflow.md` (1144 lines)

**After**:
- `workflow-overview.md` (200 lines) - Always included
- `workflow-clarification.md` (200 lines) - Manual
- `workflow-context.md` (200 lines) - Manual
- `workflow-planning.md` (200 lines) - Manual
- `workflow-execution.md` (200 lines) - Manual
- `workflow-validation.md` (144 lines) - Manual

**Result**: 
- Same content, better organized
- Reduced context usage (only overview always loaded)
- Easier navigation
- Simpler maintenance

## Common Mistakes to Avoid

### ❌ Don't: Create Too Many Small Files

```
workflow-phase1-step1.md (50 lines)
workflow-phase1-step2.md (50 lines)
workflow-phase1-step3.md (50 lines)
```

**Problem**: Too fragmented, hard to navigate

**Solution**: Group related steps into one file (150 lines)

### ❌ Don't: Split Mid-Topic

```
# file1.md
## Error Handling
### Try-Catch Blocks
[content...]

# file2.md
### Error Types
[content...]
```

**Problem**: Related content separated

**Solution**: Keep entire "Error Handling" topic in one file

### ❌ Don't: Use Always-Include for Everything

```yaml
---
inclusion: always
---
```

**Problem**: Wastes context budget

**Solution**: Use conditional or manual inclusion

### ❌ Don't: Forget Cross-References

**Problem**: Users can't find related content

**Solution**: Add "See Also" sections with links

## Maintenance Checklist

### Weekly
- [ ] Check for backup files older than 7 days
- [ ] Review files that changed recently

### Monthly
- [ ] Run analysis tool
- [ ] Review files flagged for splitting
- [ ] Update outdated content
- [ ] Check cross-references still valid

### Quarterly
- [ ] Major review of all steering files
- [ ] Consider reorganization if needed
- [ ] Update guidelines based on usage patterns
- [ ] Archive obsolete files

## Getting Help

If you're unsure how to organize steering files:

1. **Run the analysis tool** - Get specific recommendations
2. **Check examples** - Look at well-structured files
3. **Start small** - Split one large file first
4. **Test frequently** - Verify agent still works correctly
5. **Iterate** - Refine organization based on experience

## Summary

**Key Principles**:
1. Keep files under 500 lines when possible
2. Split by topic or use case
3. Use selective loading to reduce context usage
4. Maintain clear navigation and cross-references
5. Clean up backups regularly
6. Use the analysis tool to monitor file health

**Remember**: The goal is to provide the agent with the right information at the right time, without overwhelming the context budget.
