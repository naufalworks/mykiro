/**
 * Bug Condition Exploration Tests - Hook File Validation
 * 
 * UPDATED: These tests now verify the validation utility works correctly
 * 
 * Purpose: Verify that invalid hook files are rejected with clear error messages
 * Expected Outcome: All tests PASS (validation is working)
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { describe, it, expect } from 'vitest';
import { validateHookFile } from '../utils/validateHook';
import * as fs from 'fs';
import * as path from 'path';

describe('Bug Condition: Invalid Hook Files Are Rejected by Validation', () => {
  describe('JSON Syntax Validation', () => {
    it('should reject hook file with missing comma', () => {
      const invalidHook = `{
  "name": "test-hook"
  "version": "1"
}`;
      
      const result = validateHookFile(invalidHook);
      
      // Should fail validation
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].type).toBe('syntax');
      expect(result.errors[0].line).toBeDefined();
      expect(result.errors[0].column).toBeDefined();
      expect(result.formattedErrors).toContain('JSON Syntax Errors');
    });

    it('should reject hook file with missing quotes', () => {
      const invalidHook = `{
  "name": test-hook,
  "version": "1"
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors[0].type).toBe('syntax');
      expect(result.formattedErrors).toContain('JSON Syntax Errors');
    });

    it('should reject hook file with unclosed array', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.md"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors[0].type).toBe('syntax');
      expect(result.formattedErrors).toContain('JSON Syntax Errors');
    });

    it('should reject hook file with unclosed object', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "when": {
    "type": "fileEdited"
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors[0].type).toBe('syntax');
      expect(result.formattedErrors).toContain('JSON Syntax Errors');
    });
  });

  describe('Schema Validation - Missing Required Fields', () => {
    it('should reject hook file missing "description" field', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1"
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Missing required field: description'))).toBe(true);
      expect(result.formattedErrors).toContain('Schema Validation Errors');
    });

    it('should reject hook file missing "when" field', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook"
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Missing required field: when'))).toBe(true);
      expect(result.formattedErrors).toContain('Schema Validation Errors');
    });

    it('should reject hook file missing "then" field', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Missing required field: then'))).toBe(true);
      expect(result.formattedErrors).toContain('Schema Validation Errors');
    });

    it('should reject hook file missing all required fields', () => {
      const invalidHook = `{
  "enabled": true
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(3); // At least 3 missing fields
      expect(result.formattedErrors).toContain('Schema Validation Errors');
    });
  });

  describe('Schema Validation - Invalid Event Types', () => {
    it('should reject hook file with invalid event type', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "invalidEvent"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Test"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid value'))).toBe(true);
      expect(result.formattedErrors).toContain('fileEdited');
    });

    it('should reject hook file with typo in event type', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "fileEditted"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Test"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid value'))).toBe(true);
    });
  });

  describe('Schema Validation - Invalid Action Types', () => {
    it('should reject hook file with invalid action type', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "invalidAction",
    "prompt": "Test"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid value'))).toBe(true);
      expect(result.formattedErrors).toContain('askAgent');
    });

    it('should reject hook file with typo in action type', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts"]
  },
  "then": {
    "type": "askagent",
    "prompt": "Test"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors.some(e => e.message.includes('Invalid value'))).toBe(true);
    });
  });

  describe('Complex Pattern Arrays', () => {
    it('should reject hook file with malformed pattern array', () => {
      const invalidHook = `{
  "name": "test-hook",
  "version": "1",
  "description": "Test hook",
  "when": {
    "type": "fileEdited",
    "patterns": ["~/.kiro/steering/*.md"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Test"
  }
}`;
      
      const result = validateHookFile(invalidHook);
      
      expect(result.success).toBe(false);
      expect(result.errors[0].type).toBe('syntax');
      expect(result.formattedErrors).toContain('JSON Syntax Errors');
    });
  });
});

/**
 * Test Execution Notes:
 * 
 * EXPECTED OUTCOME: ALL TESTS PASS
 * 
 * This confirms the validation utility is working correctly!
 * 
 * Current behavior (with fix):
 * - validateHookFile() checks JSON syntax and schema compliance
 * - Invalid hook files are rejected with clear error messages
 * - Error messages include line/column numbers for syntax errors
 * - Error messages list missing required fields
 * - Error messages show valid options for invalid enum values
 * 
 * Integration:
 * - The validation utility is available at .kiro/utils/dist/validateHookCLI.js
 * - Agents should call this utility before writing hook files
 * - If validation fails, display errors and do not write the file
 * - If validation passes, proceed with file write operation
 */
