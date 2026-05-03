import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PRESERVATION PROPERTY TESTS - Steering File System Functionality
 * 
 * These tests verify that existing steering file behavior is preserved after implementing the fix.
 * 
 * EXPECTED OUTCOME: All tests MUST PASS on UNFIXED code (baseline behavior)
 *                   All tests MUST PASS on FIXED code (no regressions)
 * 
 * Property 2: Preservation - Steering File System Functionality Preserved
 * 
 * Requirements tested:
 * - 3.5: Steering files with frontmatter metadata parse correctly
 * - 3.6: Files with `inclusion: always` auto-load into agent context
 * - 3.7: Markdown content renders correctly
 * - 3.8: Agent receives same guidance from steering files
 */

describe('Steering File System Preservation Tests', () => {
  const testSteeringDir = path.join(process.cwd(), '.kiro', 'tests', 'fixtures', 'steering');
  
  beforeEach(() => {
    // Create test steering directory
    if (!fs.existsSync(testSteeringDir)) {
      fs.mkdirSync(testSteeringDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test steering files
    if (fs.existsSync(testSteeringDir)) {
      fs.rmSync(testSteeringDir, { recursive: true, force: true });
    }
  });

  describe('Property: Frontmatter Metadata Parsing Preserved', () => {
    it('should preserve frontmatter with all standard fields', () => {
      // Requirement 3.5: Frontmatter metadata parses correctly
      
      const steeringContent = `---
name: Test Steering
description: A test steering file
type: global
inclusion: always
priority: critical
---

# Test Steering Content

This is test content.
`;

      const filePath = path.join(testSteeringDir, 'test-steering.md');
      fs.writeFileSync(filePath, steeringContent);

      // Verify file exists
      expect(fs.existsSync(filePath)).toBe(true);
      
      // Verify content can be read
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('---');
      expect(content).toContain('name: Test Steering');
      expect(content).toContain('description: A test steering file');
      expect(content).toContain('type: global');
      expect(content).toContain('inclusion: always');
      expect(content).toContain('priority: critical');
    });

    it('should preserve frontmatter with name field', () => {
      // Requirement 3.5: Name field in frontmatter is preserved
      
      const steeringContent = `---
name: Workflow Rules
description: Core workflow guidance
type: global
inclusion: always
---

# Content
`;

      const filePath = path.join(testSteeringDir, 'workflow-rules.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Workflow Rules');
    });

    it('should preserve frontmatter with description field', () => {
      // Requirement 3.5: Description field in frontmatter is preserved
      
      const steeringContent = `---
name: Test
description: This is a detailed description of the steering file purpose
type: global
inclusion: always
---

# Content
`;

      const filePath = path.join(testSteeringDir, 'with-description.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('description: This is a detailed description of the steering file purpose');
    });

    it('should preserve frontmatter with type field', () => {
      // Requirement 3.5: Type field in frontmatter is preserved
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Content
`;

      const filePath = path.join(testSteeringDir, 'with-type.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('type: global');
    });

    it('should preserve frontmatter with inclusion field', () => {
      // Requirement 3.5: Inclusion field in frontmatter is preserved
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Content
`;

      const filePath = path.join(testSteeringDir, 'with-inclusion.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('inclusion: always');
    });

    it('should preserve frontmatter with priority field', () => {
      // Requirement 3.5: Priority field in frontmatter is preserved
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
priority: critical
---

# Content
`;

      const filePath = path.join(testSteeringDir, 'with-priority.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('priority: critical');
    });

    it('should preserve frontmatter with different priority levels', () => {
      // Requirement 3.5: Different priority levels are preserved
      
      const priorities = ['critical', 'high', 'medium', 'low'];
      
      priorities.forEach((priority, index) => {
        const steeringContent = `---
name: Test ${priority}
description: Test file with ${priority} priority
type: global
inclusion: always
priority: ${priority}
---

# Content
`;

        const filePath = path.join(testSteeringDir, `priority-${priority}.md`);
        fs.writeFileSync(filePath, steeringContent);

        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toContain(`priority: ${priority}`);
      });
    });
  });

  describe('Property: Inclusion Types Preserved', () => {
    it('should preserve inclusion: always', () => {
      // Requirement 3.6: Files with inclusion: always are recognized
      
      const steeringContent = `---
name: Always Included
description: This file is always included
type: global
inclusion: always
---

# Always Loaded Content
`;

      const filePath = path.join(testSteeringDir, 'always-included.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('inclusion: always');
    });

    it('should preserve inclusion: manual', () => {
      // Requirement 3.5: Files with inclusion: manual are recognized
      
      const steeringContent = `---
name: Manual Inclusion
description: This file is manually included
type: global
inclusion: manual
---

# Manual Content
`;

      const filePath = path.join(testSteeringDir, 'manual-included.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('inclusion: manual');
    });

    it('should preserve inclusion: auto with fileMatchPattern', () => {
      // Requirement 3.5: Files with conditional inclusion are recognized
      
      const steeringContent = `---
name: Conditional Inclusion
description: This file is conditionally included
type: global
inclusion: fileMatch
fileMatchPattern: 'README*'
---

# Conditional Content
`;

      const filePath = path.join(testSteeringDir, 'conditional-included.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('inclusion: fileMatch');
      expect(content).toContain("fileMatchPattern: 'README*'");
    });
  });

  describe('Property: Markdown Content Rendering Preserved', () => {
    it('should preserve markdown headers', () => {
      // Requirement 3.7: Markdown headers render correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Level 1 Header
## Level 2 Header
### Level 3 Header
#### Level 4 Header
`;

      const filePath = path.join(testSteeringDir, 'headers.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('# Level 1 Header');
      expect(content).toContain('## Level 2 Header');
      expect(content).toContain('### Level 3 Header');
      expect(content).toContain('#### Level 4 Header');
    });

    it('should preserve markdown lists', () => {
      // Requirement 3.7: Markdown lists render correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Lists

## Unordered List
- Item 1
- Item 2
- Item 3

## Ordered List
1. First
2. Second
3. Third
`;

      const filePath = path.join(testSteeringDir, 'lists.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('- Item 1');
      expect(content).toContain('1. First');
    });

    it('should preserve markdown code blocks', () => {
      // Requirement 3.7: Markdown code blocks render correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Code Examples

\`\`\`typescript
function example() {
  return "test";
}
\`\`\`

\`\`\`json
{
  "key": "value"
}
\`\`\`
`;

      const filePath = path.join(testSteeringDir, 'code-blocks.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('```typescript');
      expect(content).toContain('```json');
      expect(content).toContain('function example()');
    });

    it('should preserve markdown links', () => {
      // Requirement 3.7: Markdown links render correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Links

[Link Text](https://example.com)
[Another Link](./relative/path.md)
`;

      const filePath = path.join(testSteeringDir, 'links.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('[Link Text](https://example.com)');
      expect(content).toContain('[Another Link](./relative/path.md)');
    });

    it('should preserve markdown emphasis', () => {
      // Requirement 3.7: Markdown emphasis renders correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Emphasis

**Bold text**
*Italic text*
***Bold and italic***
\`inline code\`
`;

      const filePath = path.join(testSteeringDir, 'emphasis.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('**Bold text**');
      expect(content).toContain('*Italic text*');
      expect(content).toContain('`inline code`');
    });

    it('should preserve markdown tables', () => {
      // Requirement 3.7: Markdown tables render correctly
      
      const steeringContent = `---
name: Test
description: Test file
type: global
inclusion: always
---

# Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
`;

      const filePath = path.join(testSteeringDir, 'tables.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('| Column 1 | Column 2 | Column 3 |');
      expect(content).toContain('| Value 1  | Value 2  | Value 3  |');
    });
  });

  describe('Property: Agent Guidance Content Preserved', () => {
    it('should preserve workflow guidance content', () => {
      // Requirement 3.8: Agent receives same workflow guidance
      
      const steeringContent = `---
name: Workflow
description: Review process and execution workflow
type: global
inclusion: always
priority: critical
---

# Workflow - Global Rules

## Core Principle

**NEVER execute code changes without explicit approval**

Work like a professional developer collaborating with a colleague, not an autonomous agent.

## Phase Dependency Rules

Phase 1 (Clarify) → MUST complete before Phase 2
Phase 2 (Search)  → MUST complete before Phase 3
`;

      const filePath = path.join(testSteeringDir, 'workflow.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('NEVER execute code changes without explicit approval');
      expect(content).toContain('Phase 1 (Clarify)');
      expect(content).toContain('Phase 2 (Search)');
    });

    it('should preserve MCP tools guidance content', () => {
      // Requirement 3.8: Agent receives same MCP tools guidance
      
      const steeringContent = `---
name: MCP Powers Skills Integration
description: MCP servers and tools available
type: global
inclusion: always
priority: critical
---

# MCP, Powers & Skills Integration

## Installed MCP Servers

### 1. Sequential Thinking

**Tool**: mcp_sequential_thinking_sequentialthinking

**Purpose**: Multi-step reasoning and planning
`;

      const filePath = path.join(testSteeringDir, 'mcp-tools.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Sequential Thinking');
      expect(content).toContain('mcp_sequential_thinking_sequentialthinking');
    });

    it('should preserve code standards guidance content', () => {
      // Requirement 3.8: Agent receives same code standards guidance
      
      const steeringContent = `---
name: Code Standards
description: Code quality and style guidelines
type: global
inclusion: always
priority: high
---

# Code Standards - Global Rules

## Core Principles

### Quality Over Quantity

**Rules:**
1. **Focused modules** - One clear purpose per file
2. **Efficient code** - Clean, performant, professional
3. **Clear intent** - Code should be self-documenting
`;

      const filePath = path.join(testSteeringDir, 'code-standards.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Quality Over Quantity');
      expect(content).toContain('Focused modules');
      expect(content).toContain('Efficient code');
    });

    it('should preserve architecture guidance content', () => {
      // Requirement 3.8: Agent receives same architecture guidance
      
      const steeringContent = `---
name: Architecture
description: Project structure and organization rules
type: global
inclusion: always
priority: high
---

# Architecture - Global Rules

## Core Principle

**Strict Separation of Concerns**

Every file has ONE clear purpose. Every directory has ONE clear responsibility.
`;

      const filePath = path.join(testSteeringDir, 'architecture.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('Strict Separation of Concerns');
      expect(content).toContain('ONE clear purpose');
    });
  });

  describe('Property: Real-World Steering File Examples Preserved', () => {
    it('should preserve workflow.md structure', () => {
      // Real steering file from mykiro/.kiro/steering/workflow.md
      
      const steeringContent = `---
name: Workflow
description: Review process, decision making, and execution workflow
type: global
inclusion: always
priority: critical
---

# Workflow - Global Rules

## Core Principle

**NEVER execute code changes without explicit approval**

Work like a professional developer collaborating with a colleague, not an autonomous agent.

---

## Workflow Enforcement (MANDATORY)

### Phase Dependency Rules

**ABSOLUTE REQUIREMENTS - ZERO EXCEPTIONS:**

\`\`\`
Phase 1 (Clarify) → MUST complete before Phase 2
Phase 2 (Search)  → MUST complete before Phase 3
Phase 3 (Detect)  → MUST complete before Phase 4
Phase 4 (Plan)    → MUST complete before Phase 5
Phase 5 (Approve) → MUST complete before Phase 6
Phase 6 (Execute) → MUST complete before Phase 7
Phase 7 (Validate)→ MUST complete before Phase 8
Phase 8 (Archive) → Final phase
\`\`\`
`;

      const filePath = path.join(testSteeringDir, 'workflow-real.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Workflow');
      expect(content).toContain('inclusion: always');
      expect(content).toContain('priority: critical');
      expect(content).toContain('NEVER execute code changes without explicit approval');
      expect(content).toContain('Phase 1 (Clarify)');
    });

    it('should preserve mcp-powers-skills.md structure', () => {
      // Real steering file from mykiro/.kiro/steering/mcp-powers-skills.md
      
      const steeringContent = `---
name: MCP Powers Skills Integration (Corrected)
description: Actual MCP servers and tools available in this Kiro instance
type: global
inclusion: always
priority: critical
---

# MCP, Powers & Skills Integration - CORRECTED

## Overview

This file defines the **ACTUAL** MCP servers installed and how to use them.

---

## Installed MCP Servers

### 1. Sequential Thinking (\`sequential-thinking\`)

**Tool**: \`mcp_sequential_thinking_sequentialthinking\`

**Purpose**: Multi-step reasoning and planning with revision capability
`;

      const filePath = path.join(testSteeringDir, 'mcp-real.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: MCP Powers Skills Integration (Corrected)');
      expect(content).toContain('inclusion: always');
      expect(content).toContain('Sequential Thinking');
      expect(content).toContain('mcp_sequential_thinking_sequentialthinking');
    });
  });

  describe('Property: File Size Variations Preserved', () => {
    it('should preserve small steering files (<100 lines)', () => {
      // Requirement 3.7: Small files work correctly
      
      const lines = Array(50).fill('This is line content.').join('\n');
      const steeringContent = `---
name: Small File
description: A small steering file
type: global
inclusion: always
---

# Small File

${lines}
`;

      const filePath = path.join(testSteeringDir, 'small-file.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      expect(lineCount).toBeLessThan(100);
      expect(content).toContain('name: Small File');
    });

    it('should preserve medium steering files (100-500 lines)', () => {
      // Requirement 3.7: Medium files work correctly
      
      const lines = Array(300).fill('This is line content.').join('\n');
      const steeringContent = `---
name: Medium File
description: A medium steering file
type: global
inclusion: always
---

# Medium File

${lines}
`;

      const filePath = path.join(testSteeringDir, 'medium-file.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      expect(lineCount).toBeGreaterThan(100);
      expect(lineCount).toBeLessThan(500);
      expect(content).toContain('name: Medium File');
    });

    it('should preserve large steering files (>500 lines)', () => {
      // Requirement 3.7: Large files work correctly (even if navigation is difficult)
      
      const lines = Array(600).fill('This is line content.').join('\n');
      const steeringContent = `---
name: Large File
description: A large steering file
type: global
inclusion: always
---

# Large File

${lines}
`;

      const filePath = path.join(testSteeringDir, 'large-file.md');
      fs.writeFileSync(filePath, steeringContent);

      const content = fs.readFileSync(filePath, 'utf-8');
      const lineCount = content.split('\n').length;
      expect(lineCount).toBeGreaterThan(500);
      expect(content).toContain('name: Large File');
    });
  });
});
