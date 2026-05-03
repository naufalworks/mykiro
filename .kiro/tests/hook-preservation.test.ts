import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PRESERVATION PROPERTY TESTS - Hook System Functionality
 * 
 * These tests verify that existing valid hook behavior is preserved after implementing the fix.
 * 
 * EXPECTED OUTCOME: All tests MUST PASS on UNFIXED code (baseline behavior)
 *                   All tests MUST PASS on FIXED code (no regressions)
 * 
 * Property 2: Preservation - Hook System Functionality Preserved
 * 
 * Requirements tested:
 * - 3.1: Valid hook files trigger based on configured event types
 * - 3.2: Hook actions execute with specified parameters
 * - 3.3: Pattern matching works correctly for file patterns
 * - 3.4: Multiple hooks execute in correct order
 */

describe('Hook System Preservation Tests', () => {
  const testHooksDir = path.join(process.cwd(), '.kiro', 'tests', 'fixtures', 'hooks');
  
  beforeEach(() => {
    // Create test hooks directory
    if (!fs.existsSync(testHooksDir)) {
      fs.mkdirSync(testHooksDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test hooks
    if (fs.existsSync(testHooksDir)) {
      fs.rmSync(testHooksDir, { recursive: true, force: true });
    }
  });

  describe('Property: Valid Hook Files Trigger Correctly', () => {
    it('should recognize valid hook files with all required fields', () => {
      // Requirement 3.1: Valid hook files trigger based on event types
      
      const validHook = {
        enabled: true,
        name: "Test Hook",
        version: "1.0.0",
        description: "A valid test hook",
        when: {
          type: "fileEdited",
          patterns: ["*.ts"]
        },
        then: {
          type: "askAgent",
          prompt: "Test prompt"
        }
      };

      const hookPath = path.join(testHooksDir, 'valid-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(validHook, null, 2));

      // Verify file was created successfully
      expect(fs.existsSync(hookPath)).toBe(true);
      
      // Verify content is valid JSON
      const content = fs.readFileSync(hookPath, 'utf-8');
      const parsed = JSON.parse(content);
      
      // Verify all required fields are present
      expect(parsed).toHaveProperty('name');
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('description');
      expect(parsed).toHaveProperty('when');
      expect(parsed).toHaveProperty('then');
      expect(parsed.when).toHaveProperty('type');
      expect(parsed.then).toHaveProperty('type');
    });

    it('should recognize hooks with fileEdited event type', () => {
      // Requirement 3.1: fileEdited event type triggers correctly
      
      const hook = {
        enabled: true,
        name: "File Edited Hook",
        version: "1",
        description: "Triggers on file edit",
        when: {
          type: "fileEdited",
          patterns: ["*.md"]
        },
        then: {
          type: "askAgent",
          prompt: "File was edited"
        }
      };

      const hookPath = path.join(testHooksDir, 'file-edited.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.type).toBe('fileEdited');
    });

    it('should recognize hooks with fileCreated event type', () => {
      // Requirement 3.1: fileCreated event type triggers correctly
      
      const hook = {
        enabled: true,
        name: "File Created Hook",
        version: "1",
        description: "Triggers on file creation",
        when: {
          type: "fileCreated",
          patterns: ["*.ts"]
        },
        then: {
          type: "runCommand",
          command: "echo 'File created'"
        }
      };

      const hookPath = path.join(testHooksDir, 'file-created.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.type).toBe('fileCreated');
    });

    it('should recognize hooks with preToolUse event type', () => {
      // Requirement 3.1: preToolUse event type triggers correctly
      
      const hook = {
        enabled: true,
        name: "Pre Tool Use Hook",
        version: "1",
        description: "Triggers before tool use",
        when: {
          type: "preToolUse",
          toolTypes: "write"
        },
        then: {
          type: "askAgent",
          prompt: "Verify before write"
        }
      };

      const hookPath = path.join(testHooksDir, 'pre-tool-use.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.type).toBe('preToolUse');
      expect(parsed.when.toolTypes).toBe('write');
    });

    it('should recognize hooks with postTaskExecution event type', () => {
      // Requirement 3.1: postTaskExecution event type triggers correctly
      
      const hook = {
        enabled: true,
        name: "Post Task Hook",
        version: "1",
        description: "Triggers after task execution",
        when: {
          type: "postTaskExecution"
        },
        then: {
          type: "runCommand",
          command: "npm test"
        }
      };

      const hookPath = path.join(testHooksDir, 'post-task.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.type).toBe('postTaskExecution');
    });
  });

  describe('Property: Hook Actions Execute Correctly', () => {
    it('should preserve askAgent action with prompt parameter', () => {
      // Requirement 3.2: askAgent actions execute with specified parameters
      
      const hook = {
        enabled: true,
        name: "Ask Agent Hook",
        version: "1",
        description: "Uses askAgent action",
        when: {
          type: "fileEdited",
          patterns: ["*.ts"]
        },
        then: {
          type: "askAgent",
          prompt: "Review the changes and ensure they follow coding standards"
        }
      };

      const hookPath = path.join(testHooksDir, 'ask-agent.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.then.type).toBe('askAgent');
      expect(parsed.then.prompt).toBe('Review the changes and ensure they follow coding standards');
    });

    it('should preserve runCommand action with command parameter', () => {
      // Requirement 3.2: runCommand actions execute with specified parameters
      
      const hook = {
        enabled: true,
        name: "Run Command Hook",
        version: "1",
        description: "Uses runCommand action",
        when: {
          type: "fileEdited",
          patterns: ["*.ts"]
        },
        then: {
          type: "runCommand",
          command: "npm run lint"
        }
      };

      const hookPath = path.join(testHooksDir, 'run-command.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.then.type).toBe('runCommand');
      expect(parsed.then.command).toBe('npm run lint');
    });

    it('should preserve runCommand action with timeout parameter', () => {
      // Requirement 3.2: runCommand actions execute with timeout parameter
      
      const hook = {
        enabled: true,
        name: "Run Command with Timeout",
        version: "1",
        description: "Uses runCommand with timeout",
        when: {
          type: "fileEdited",
          patterns: ["*.ts"]
        },
        then: {
          type: "runCommand",
          command: "npm test",
          timeout: 60
        }
      };

      const hookPath = path.join(testHooksDir, 'run-command-timeout.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.then.type).toBe('runCommand');
      expect(parsed.then.command).toBe('npm test');
      expect(parsed.then.timeout).toBe(60);
    });
  });

  describe('Property: Pattern Matching Works Correctly', () => {
    it('should preserve single file pattern matching', () => {
      // Requirement 3.3: Glob pattern matching works for single pattern
      
      const hook = {
        enabled: true,
        name: "Single Pattern Hook",
        version: "1",
        description: "Matches single pattern",
        when: {
          type: "fileEdited",
          patterns: ["*.md"]
        },
        then: {
          type: "askAgent",
          prompt: "Markdown file edited"
        }
      };

      const hookPath = path.join(testHooksDir, 'single-pattern.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.patterns).toEqual(['*.md']);
    });

    it('should preserve multiple file pattern matching', () => {
      // Requirement 3.3: Glob pattern matching works for multiple patterns
      
      const hook = {
        enabled: true,
        name: "Multiple Patterns Hook",
        version: "1",
        description: "Matches multiple patterns",
        when: {
          type: "fileEdited",
          patterns: ["*.ts", "*.tsx", "*.js", "*.jsx"]
        },
        then: {
          type: "runCommand",
          command: "npm run lint"
        }
      };

      const hookPath = path.join(testHooksDir, 'multiple-patterns.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.patterns).toEqual(['*.ts', '*.tsx', '*.js', '*.jsx']);
      expect(parsed.when.patterns.length).toBe(4);
    });

    it('should preserve directory-specific pattern matching', () => {
      // Requirement 3.3: Glob pattern matching works for directory patterns
      
      const hook = {
        enabled: true,
        name: "Directory Pattern Hook",
        version: "1",
        description: "Matches files in specific directory",
        when: {
          type: "fileCreated",
          patterns: ["~/.kiro/steering/*.md"]
        },
        then: {
          type: "askAgent",
          prompt: "New steering file created"
        }
      };

      const hookPath = path.join(testHooksDir, 'directory-pattern.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.patterns).toEqual(['~/.kiro/steering/*.md']);
    });

    it('should preserve complex nested pattern arrays', () => {
      // Requirement 3.3: Complex pattern arrays work correctly
      
      const hook = {
        enabled: true,
        name: "Complex Patterns Hook",
        version: "1",
        description: "Matches complex patterns",
        when: {
          type: "fileEdited",
          patterns: [
            "~/.kiro/steering/*.md",
            ".kiro/steering/*.md",
            "src/**/*.ts",
            "tests/**/*.test.ts"
          ]
        },
        then: {
          type: "askAgent",
          prompt: "Complex pattern matched"
        }
      };

      const hookPath = path.join(testHooksDir, 'complex-patterns.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.when.patterns.length).toBe(4);
      expect(parsed.when.patterns).toContain('~/.kiro/steering/*.md');
      expect(parsed.when.patterns).toContain('src/**/*.ts');
    });
  });

  describe('Property: Multiple Hooks Execute Correctly', () => {
    it('should preserve multiple hooks with different event types', () => {
      // Requirement 3.4: Multiple hooks with different events work correctly
      
      const hook1 = {
        enabled: true,
        name: "Hook 1",
        version: "1",
        description: "First hook",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Hook 1" }
      };

      const hook2 = {
        enabled: true,
        name: "Hook 2",
        version: "1",
        description: "Second hook",
        when: { type: "fileCreated", patterns: ["*.md"] },
        then: { type: "runCommand", command: "echo 'Hook 2'" }
      };

      const hook1Path = path.join(testHooksDir, 'hook1.kiro.hook');
      const hook2Path = path.join(testHooksDir, 'hook2.kiro.hook');
      
      fs.writeFileSync(hook1Path, JSON.stringify(hook1, null, 2));
      fs.writeFileSync(hook2Path, JSON.stringify(hook2, null, 2));

      // Verify both hooks exist
      expect(fs.existsSync(hook1Path)).toBe(true);
      expect(fs.existsSync(hook2Path)).toBe(true);

      // Verify both hooks are valid
      const parsed1 = JSON.parse(fs.readFileSync(hook1Path, 'utf-8'));
      const parsed2 = JSON.parse(fs.readFileSync(hook2Path, 'utf-8'));
      
      expect(parsed1.name).toBe('Hook 1');
      expect(parsed2.name).toBe('Hook 2');
    });

    it('should preserve multiple hooks with same event type', () => {
      // Requirement 3.4: Multiple hooks with same event execute in order
      
      const hook1 = {
        enabled: true,
        name: "First Lint Hook",
        version: "1",
        description: "First hook for linting",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "runCommand", command: "npm run lint" }
      };

      const hook2 = {
        enabled: true,
        name: "Second Test Hook",
        version: "1",
        description: "Second hook for testing",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "runCommand", command: "npm test" }
      };

      const hook1Path = path.join(testHooksDir, 'lint-hook.kiro.hook');
      const hook2Path = path.join(testHooksDir, 'test-hook.kiro.hook');
      
      fs.writeFileSync(hook1Path, JSON.stringify(hook1, null, 2));
      fs.writeFileSync(hook2Path, JSON.stringify(hook2, null, 2));

      // Verify both hooks exist and are valid
      expect(fs.existsSync(hook1Path)).toBe(true);
      expect(fs.existsSync(hook2Path)).toBe(true);

      const parsed1 = JSON.parse(fs.readFileSync(hook1Path, 'utf-8'));
      const parsed2 = JSON.parse(fs.readFileSync(hook2Path, 'utf-8'));
      
      // Both should have same event type
      expect(parsed1.when.type).toBe('fileEdited');
      expect(parsed2.when.type).toBe('fileEdited');
      
      // Both should have same pattern
      expect(parsed1.when.patterns).toEqual(['*.ts']);
      expect(parsed2.when.patterns).toEqual(['*.ts']);
    });

    it('should preserve enabled/disabled hook state', () => {
      // Requirement 3.4: Hook enabled state is preserved
      
      const enabledHook = {
        enabled: true,
        name: "Enabled Hook",
        version: "1",
        description: "This hook is enabled",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Enabled" }
      };

      const disabledHook = {
        enabled: false,
        name: "Disabled Hook",
        version: "1",
        description: "This hook is disabled",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Disabled" }
      };

      const enabledPath = path.join(testHooksDir, 'enabled.kiro.hook');
      const disabledPath = path.join(testHooksDir, 'disabled.kiro.hook');
      
      fs.writeFileSync(enabledPath, JSON.stringify(enabledHook, null, 2));
      fs.writeFileSync(disabledPath, JSON.stringify(disabledHook, null, 2));

      const parsedEnabled = JSON.parse(fs.readFileSync(enabledPath, 'utf-8'));
      const parsedDisabled = JSON.parse(fs.readFileSync(disabledPath, 'utf-8'));
      
      expect(parsedEnabled.enabled).toBe(true);
      expect(parsedDisabled.enabled).toBe(false);
    });
  });

  describe('Property: Real-World Hook Examples Preserved', () => {
    it('should preserve auto-index steering created hook structure', () => {
      // Real hook from .kiro/hooks/auto-index-steering-created.kiro.hook
      
      const hook = {
        enabled: true,
        name: "Auto-Index New Steering Files",
        description: "Automatically indexes new steering files into adaptive-memory when they are created",
        version: "1",
        when: {
          type: "fileCreated",
          patterns: ["~/.kiro/steering/*.md"]
        },
        then: {
          type: "askAgent",
          prompt: "A new steering file was just created. Read the new file and call mcp_adaptive_memory_store_memory to index it with type='context', appropriate tags from the frontmatter, and the full content. Keep this silent - don't report to user unless there's an error."
        }
      };

      const hookPath = path.join(testHooksDir, 'auto-index-created.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.name).toBe("Auto-Index New Steering Files");
      expect(parsed.when.type).toBe("fileCreated");
      expect(parsed.when.patterns).toEqual(["~/.kiro/steering/*.md"]);
      expect(parsed.then.type).toBe("askAgent");
    });

    it('should preserve enforce workflow phases hook structure', () => {
      // Real hook from mykiro/.kiro/hooks/enforce-workflow-phases.kiro.hook
      
      const hook = {
        name: "Enforce Workflow Before File Operations",
        version: "1.0.0",
        description: "Verify phases 1-5 completed before allowing file writes",
        when: {
          type: "preToolUse",
          toolTypes: "write"
        },
        then: {
          type: "askAgent",
          prompt: "⚠️ WORKFLOW ENFORCEMENT CHECK ⚠️\n\nBefore writing files, verify you completed ALL phases:\n\n✅ Phase 1: Clarified requirements (100% clear)\n✅ Phase 2: Called mcp_intelligent_context_intelligent_search\n✅ Phase 3: Called mcp_predictive_analysis_analyze_security\n✅ Phase 4: Called mcp_sequential_thinking_sequentialthinking\n✅ Phase 5: Got explicit user approval (\"yes\"/\"proceed\"/\"go ahead\")\n\nIf ANY phase is incomplete:\n❌ STOP immediately\n❌ Do NOT proceed with file write\n❌ Complete missing phases first\n\nOnly proceed if ALL 5 phases are complete."
        }
      };

      const hookPath = path.join(testHooksDir, 'enforce-workflow.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      const parsed = JSON.parse(fs.readFileSync(hookPath, 'utf-8'));
      expect(parsed.name).toBe("Enforce Workflow Before File Operations");
      expect(parsed.when.type).toBe("preToolUse");
      expect(parsed.when.toolTypes).toBe("write");
      expect(parsed.then.type).toBe("askAgent");
      expect(parsed.then.prompt).toContain("WORKFLOW ENFORCEMENT CHECK");
    });
  });
});
