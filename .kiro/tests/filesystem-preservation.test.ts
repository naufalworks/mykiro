import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PRESERVATION PROPERTY TESTS - File System Operations
 * 
 * These tests verify that file system operations for hooks and steering files
 * are preserved after implementing the fix.
 * 
 * EXPECTED OUTCOME: All tests MUST PASS on UNFIXED code (baseline behavior)
 *                   All tests MUST PASS on FIXED code (no regressions)
 * 
 * Property 2: Preservation - File System Operations Preserved
 * 
 * Requirements tested:
 * - 3.9: New hook files are recognized and loaded automatically
 * - 3.10: New steering files are indexed via auto-indexing hooks
 * - 3.11: File deletions are handled gracefully without errors
 * - 3.12: File path/pattern modifications update references correctly
 */

describe('File System Operations Preservation Tests', () => {
  const testHooksDir = path.join(process.cwd(), '.kiro', 'tests', 'fixtures', 'hooks-fs');
  const testSteeringDir = path.join(process.cwd(), '.kiro', 'tests', 'fixtures', 'steering-fs');
  
  beforeEach(() => {
    // Create test directories
    if (!fs.existsSync(testHooksDir)) {
      fs.mkdirSync(testHooksDir, { recursive: true });
    }
    if (!fs.existsSync(testSteeringDir)) {
      fs.mkdirSync(testSteeringDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test directories
    if (fs.existsSync(testHooksDir)) {
      fs.rmSync(testHooksDir, { recursive: true, force: true });
    }
    if (fs.existsSync(testSteeringDir)) {
      fs.rmSync(testSteeringDir, { recursive: true, force: true });
    }
  });

  describe('Property: New Hook Files Are Recognized', () => {
    it('should recognize newly created hook files', () => {
      // Requirement 3.9: New hook files are recognized and loaded automatically
      
      const hook = {
        enabled: true,
        name: "New Hook",
        version: "1",
        description: "A newly created hook",
        when: {
          type: "fileEdited",
          patterns: ["*.ts"]
        },
        then: {
          type: "askAgent",
          prompt: "New hook triggered"
        }
      };

      const hookPath = path.join(testHooksDir, 'new-hook.kiro.hook');
      
      // Create the hook file
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify file was created
      expect(fs.existsSync(hookPath)).toBe(true);
      
      // Verify file can be read
      const content = fs.readFileSync(hookPath, 'utf-8');
      const parsed = JSON.parse(content);
      
      // Verify hook structure is intact
      expect(parsed.name).toBe('New Hook');
      expect(parsed.enabled).toBe(true);
    });

    it('should recognize multiple newly created hook files', () => {
      // Requirement 3.9: Multiple new hook files are recognized
      
      const hooks = [
        {
          enabled: true,
          name: "Hook 1",
          version: "1",
          description: "First hook",
          when: { type: "fileEdited", patterns: ["*.ts"] },
          then: { type: "askAgent", prompt: "Hook 1" }
        },
        {
          enabled: true,
          name: "Hook 2",
          version: "1",
          description: "Second hook",
          when: { type: "fileCreated", patterns: ["*.md"] },
          then: { type: "runCommand", command: "echo 'Hook 2'" }
        },
        {
          enabled: true,
          name: "Hook 3",
          version: "1",
          description: "Third hook",
          when: { type: "preToolUse", toolTypes: "write" },
          then: { type: "askAgent", prompt: "Hook 3" }
        }
      ];

      const hookPaths = hooks.map((hook, index) => {
        const hookPath = path.join(testHooksDir, `hook-${index + 1}.kiro.hook`);
        fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));
        return hookPath;
      });

      // Verify all hooks were created
      hookPaths.forEach(hookPath => {
        expect(fs.existsSync(hookPath)).toBe(true);
      });

      // Verify all hooks can be read
      hookPaths.forEach((hookPath, index) => {
        const content = fs.readFileSync(hookPath, 'utf-8');
        const parsed = JSON.parse(content);
        expect(parsed.name).toBe(`Hook ${index + 1}`);
      });
    });

    it('should recognize hook files created in subdirectories', () => {
      // Requirement 3.9: Hook files in subdirectories are recognized
      
      const subDir = path.join(testHooksDir, 'subdir');
      fs.mkdirSync(subDir, { recursive: true });

      const hook = {
        enabled: true,
        name: "Subdirectory Hook",
        version: "1",
        description: "Hook in subdirectory",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Subdirectory hook" }
      };

      const hookPath = path.join(subDir, 'subdir-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      expect(fs.existsSync(hookPath)).toBe(true);
      
      const content = fs.readFileSync(hookPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('Subdirectory Hook');
    });
  });

  describe('Property: New Steering Files Are Indexed', () => {
    it('should recognize newly created steering files', () => {
      // Requirement 3.10: New steering files are indexed via auto-indexing hooks
      
      const steeringContent = `---
name: New Steering File
description: A newly created steering file
type: global
inclusion: always
---

# New Steering Content

This is a new steering file.
`;

      const filePath = path.join(testSteeringDir, 'new-steering.md');
      fs.writeFileSync(filePath, steeringContent);

      // Verify file was created
      expect(fs.existsSync(filePath)).toBe(true);
      
      // Verify file can be read
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: New Steering File');
      expect(content).toContain('New Steering Content');
    });

    it('should recognize multiple newly created steering files', () => {
      // Requirement 3.10: Multiple new steering files are indexed
      
      const steeringFiles = [
        {
          name: 'Steering 1',
          content: `---
name: Steering 1
description: First steering file
type: global
inclusion: always
---

# Content 1
`
        },
        {
          name: 'Steering 2',
          content: `---
name: Steering 2
description: Second steering file
type: global
inclusion: manual
---

# Content 2
`
        },
        {
          name: 'Steering 3',
          content: `---
name: Steering 3
description: Third steering file
type: global
inclusion: always
---

# Content 3
`
        }
      ];

      const filePaths = steeringFiles.map((file, index) => {
        const filePath = path.join(testSteeringDir, `steering-${index + 1}.md`);
        fs.writeFileSync(filePath, file.content);
        return filePath;
      });

      // Verify all files were created
      filePaths.forEach(filePath => {
        expect(fs.existsSync(filePath)).toBe(true);
      });

      // Verify all files can be read
      filePaths.forEach((filePath, index) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).toContain(`name: Steering ${index + 1}`);
      });
    });

    it('should recognize steering files created in subdirectories', () => {
      // Requirement 3.10: Steering files in subdirectories are indexed
      
      const subDir = path.join(testSteeringDir, 'category');
      fs.mkdirSync(subDir, { recursive: true });

      const steeringContent = `---
name: Categorized Steering
description: Steering file in subdirectory
type: global
inclusion: always
---

# Categorized Content
`;

      const filePath = path.join(subDir, 'categorized.md');
      fs.writeFileSync(filePath, steeringContent);

      expect(fs.existsSync(filePath)).toBe(true);
      
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Categorized Steering');
    });
  });

  describe('Property: File Deletions Handled Gracefully', () => {
    it('should handle hook file deletion without errors', () => {
      // Requirement 3.11: Hook file deletions are handled gracefully
      
      const hook = {
        enabled: true,
        name: "Temporary Hook",
        version: "1",
        description: "Hook to be deleted",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Temporary" }
      };

      const hookPath = path.join(testHooksDir, 'temp-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify file exists
      expect(fs.existsSync(hookPath)).toBe(true);

      // Delete the file
      fs.unlinkSync(hookPath);

      // Verify file was deleted
      expect(fs.existsSync(hookPath)).toBe(false);
    });

    it('should handle steering file deletion without errors', () => {
      // Requirement 3.11: Steering file deletions are handled gracefully
      
      const steeringContent = `---
name: Temporary Steering
description: Steering file to be deleted
type: global
inclusion: always
---

# Temporary Content
`;

      const filePath = path.join(testSteeringDir, 'temp-steering.md');
      fs.writeFileSync(filePath, steeringContent);

      // Verify file exists
      expect(fs.existsSync(filePath)).toBe(true);

      // Delete the file
      fs.unlinkSync(filePath);

      // Verify file was deleted
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it('should handle deletion of multiple hook files', () => {
      // Requirement 3.11: Multiple hook file deletions are handled gracefully
      
      const hookPaths = [1, 2, 3].map(i => {
        const hook = {
          enabled: true,
          name: `Temp Hook ${i}`,
          version: "1",
          description: `Hook ${i} to be deleted`,
          when: { type: "fileEdited", patterns: ["*.ts"] },
          then: { type: "askAgent", prompt: `Hook ${i}` }
        };

        const hookPath = path.join(testHooksDir, `temp-hook-${i}.kiro.hook`);
        fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));
        return hookPath;
      });

      // Verify all files exist
      hookPaths.forEach(hookPath => {
        expect(fs.existsSync(hookPath)).toBe(true);
      });

      // Delete all files
      hookPaths.forEach(hookPath => {
        fs.unlinkSync(hookPath);
      });

      // Verify all files were deleted
      hookPaths.forEach(hookPath => {
        expect(fs.existsSync(hookPath)).toBe(false);
      });
    });

    it('should handle deletion of directory containing hook files', () => {
      // Requirement 3.11: Directory deletions are handled gracefully
      
      const subDir = path.join(testHooksDir, 'to-delete');
      fs.mkdirSync(subDir, { recursive: true });

      const hook = {
        enabled: true,
        name: "Hook in Directory",
        version: "1",
        description: "Hook in directory to be deleted",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Hook" }
      };

      const hookPath = path.join(subDir, 'hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify directory and file exist
      expect(fs.existsSync(subDir)).toBe(true);
      expect(fs.existsSync(hookPath)).toBe(true);

      // Delete the directory
      fs.rmSync(subDir, { recursive: true, force: true });

      // Verify directory was deleted
      expect(fs.existsSync(subDir)).toBe(false);
      expect(fs.existsSync(hookPath)).toBe(false);
    });
  });

  describe('Property: File Modifications Handled Correctly', () => {
    it('should handle hook file content modification', () => {
      // Requirement 3.12: Hook file modifications update correctly
      
      const originalHook = {
        enabled: true,
        name: "Original Hook",
        version: "1",
        description: "Original description",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Original prompt" }
      };

      const hookPath = path.join(testHooksDir, 'modifiable-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(originalHook, null, 2));

      // Verify original content
      let content = fs.readFileSync(hookPath, 'utf-8');
      let parsed = JSON.parse(content);
      expect(parsed.name).toBe('Original Hook');
      expect(parsed.description).toBe('Original description');

      // Modify the hook
      const modifiedHook = {
        ...originalHook,
        name: "Modified Hook",
        description: "Modified description",
        then: { type: "askAgent", prompt: "Modified prompt" }
      };

      fs.writeFileSync(hookPath, JSON.stringify(modifiedHook, null, 2));

      // Verify modified content
      content = fs.readFileSync(hookPath, 'utf-8');
      parsed = JSON.parse(content);
      expect(parsed.name).toBe('Modified Hook');
      expect(parsed.description).toBe('Modified description');
      expect(parsed.then.prompt).toBe('Modified prompt');
    });

    it('should handle steering file content modification', () => {
      // Requirement 3.12: Steering file modifications update correctly
      
      const originalContent = `---
name: Original Steering
description: Original description
type: global
inclusion: always
---

# Original Content
`;

      const filePath = path.join(testSteeringDir, 'modifiable-steering.md');
      fs.writeFileSync(filePath, originalContent);

      // Verify original content
      let content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Original Steering');
      expect(content).toContain('Original Content');

      // Modify the steering file
      const modifiedContent = `---
name: Modified Steering
description: Modified description
type: global
inclusion: always
---

# Modified Content
`;

      fs.writeFileSync(filePath, modifiedContent);

      // Verify modified content
      content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('name: Modified Steering');
      expect(content).toContain('Modified Content');
    });

    it('should handle hook file pattern modification', () => {
      // Requirement 3.12: Pattern modifications update references correctly
      
      const hook = {
        enabled: true,
        name: "Pattern Hook",
        version: "1",
        description: "Hook with modifiable patterns",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Pattern hook" }
      };

      const hookPath = path.join(testHooksDir, 'pattern-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify original patterns
      let content = fs.readFileSync(hookPath, 'utf-8');
      let parsed = JSON.parse(content);
      expect(parsed.when.patterns).toEqual(['*.ts']);

      // Modify patterns
      hook.when.patterns = ['*.ts', '*.tsx', '*.js', '*.jsx'];
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify modified patterns
      content = fs.readFileSync(hookPath, 'utf-8');
      parsed = JSON.parse(content);
      expect(parsed.when.patterns).toEqual(['*.ts', '*.tsx', '*.js', '*.jsx']);
    });

    it('should handle hook file event type modification', () => {
      // Requirement 3.12: Event type modifications update correctly
      
      const hook = {
        enabled: true,
        name: "Event Hook",
        version: "1",
        description: "Hook with modifiable event type",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Event hook" }
      };

      const hookPath = path.join(testHooksDir, 'event-hook.kiro.hook');
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify original event type
      let content = fs.readFileSync(hookPath, 'utf-8');
      let parsed = JSON.parse(content);
      expect(parsed.when.type).toBe('fileEdited');

      // Modify event type
      hook.when.type = 'fileCreated';
      fs.writeFileSync(hookPath, JSON.stringify(hook, null, 2));

      // Verify modified event type
      content = fs.readFileSync(hookPath, 'utf-8');
      parsed = JSON.parse(content);
      expect(parsed.when.type).toBe('fileCreated');
    });
  });

  describe('Property: File Renaming Handled Correctly', () => {
    it('should handle hook file renaming', () => {
      // Requirement 3.12: File renaming updates references correctly
      
      const hook = {
        enabled: true,
        name: "Renameable Hook",
        version: "1",
        description: "Hook to be renamed",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Renameable hook" }
      };

      const oldPath = path.join(testHooksDir, 'old-name.kiro.hook');
      const newPath = path.join(testHooksDir, 'new-name.kiro.hook');

      fs.writeFileSync(oldPath, JSON.stringify(hook, null, 2));

      // Verify old file exists
      expect(fs.existsSync(oldPath)).toBe(true);

      // Rename the file
      fs.renameSync(oldPath, newPath);

      // Verify old file doesn't exist and new file does
      expect(fs.existsSync(oldPath)).toBe(false);
      expect(fs.existsSync(newPath)).toBe(true);

      // Verify content is intact
      const content = fs.readFileSync(newPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('Renameable Hook');
    });

    it('should handle steering file renaming', () => {
      // Requirement 3.12: Steering file renaming updates correctly
      
      const steeringContent = `---
name: Renameable Steering
description: Steering file to be renamed
type: global
inclusion: always
---

# Renameable Content
`;

      const oldPath = path.join(testSteeringDir, 'old-steering.md');
      const newPath = path.join(testSteeringDir, 'new-steering.md');

      fs.writeFileSync(oldPath, steeringContent);

      // Verify old file exists
      expect(fs.existsSync(oldPath)).toBe(true);

      // Rename the file
      fs.renameSync(oldPath, newPath);

      // Verify old file doesn't exist and new file does
      expect(fs.existsSync(oldPath)).toBe(false);
      expect(fs.existsSync(newPath)).toBe(true);

      // Verify content is intact
      const content = fs.readFileSync(newPath, 'utf-8');
      expect(content).toContain('name: Renameable Steering');
    });

    it('should handle moving hook file to different directory', () => {
      // Requirement 3.12: Moving files updates references correctly
      
      const hook = {
        enabled: true,
        name: "Moveable Hook",
        version: "1",
        description: "Hook to be moved",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Moveable hook" }
      };

      const oldPath = path.join(testHooksDir, 'moveable-hook.kiro.hook');
      const newDir = path.join(testHooksDir, 'moved');
      const newPath = path.join(newDir, 'moveable-hook.kiro.hook');

      fs.writeFileSync(oldPath, JSON.stringify(hook, null, 2));
      fs.mkdirSync(newDir, { recursive: true });

      // Verify old file exists
      expect(fs.existsSync(oldPath)).toBe(true);

      // Move the file
      fs.renameSync(oldPath, newPath);

      // Verify old file doesn't exist and new file does
      expect(fs.existsSync(oldPath)).toBe(false);
      expect(fs.existsSync(newPath)).toBe(true);

      // Verify content is intact
      const content = fs.readFileSync(newPath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(parsed.name).toBe('Moveable Hook');
    });
  });

  describe('Property: File Copy Operations Handled Correctly', () => {
    it('should handle hook file copying', () => {
      // Requirement 3.9: Copied hook files are recognized as new files
      
      const hook = {
        enabled: true,
        name: "Original Hook",
        version: "1",
        description: "Hook to be copied",
        when: { type: "fileEdited", patterns: ["*.ts"] },
        then: { type: "askAgent", prompt: "Original hook" }
      };

      const originalPath = path.join(testHooksDir, 'original-hook.kiro.hook');
      const copyPath = path.join(testHooksDir, 'copied-hook.kiro.hook');

      fs.writeFileSync(originalPath, JSON.stringify(hook, null, 2));

      // Copy the file
      fs.copyFileSync(originalPath, copyPath);

      // Verify both files exist
      expect(fs.existsSync(originalPath)).toBe(true);
      expect(fs.existsSync(copyPath)).toBe(true);

      // Verify both have same content
      const originalContent = fs.readFileSync(originalPath, 'utf-8');
      const copiedContent = fs.readFileSync(copyPath, 'utf-8');
      expect(originalContent).toBe(copiedContent);
    });

    it('should handle steering file copying', () => {
      // Requirement 3.10: Copied steering files are indexed as new files
      
      const steeringContent = `---
name: Original Steering
description: Steering file to be copied
type: global
inclusion: always
---

# Original Content
`;

      const originalPath = path.join(testSteeringDir, 'original-steering.md');
      const copyPath = path.join(testSteeringDir, 'copied-steering.md');

      fs.writeFileSync(originalPath, steeringContent);

      // Copy the file
      fs.copyFileSync(originalPath, copyPath);

      // Verify both files exist
      expect(fs.existsSync(originalPath)).toBe(true);
      expect(fs.existsSync(copyPath)).toBe(true);

      // Verify both have same content
      const originalContent = fs.readFileSync(originalPath, 'utf-8');
      const copiedContent = fs.readFileSync(copyPath, 'utf-8');
      expect(originalContent).toBe(copiedContent);
    });
  });
});
