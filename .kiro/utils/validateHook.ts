import Ajv, { ErrorObject } from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Validation result interface
 */
export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  formattedErrors: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  type: 'syntax' | 'schema';
  message: string;
  line?: number;
  column?: number;
  path?: string;
  details?: string;
}

/**
 * Hook schema interface
 */
export interface HookSchema {
  enabled?: boolean;
  name: string;
  version: string;
  description: string;
  when: {
    type: string;
    patterns?: string[];
    toolTypes?: string;
  };
  then: {
    type: string;
    prompt?: string;
    command?: string;
    timeout?: number;
  };
}

/**
 * Find the workspace root by looking for .kiro directory
 */
function findWorkspaceRoot(): string {
  let currentDir = process.cwd();
  
  // If we're already inside .kiro directory, go up to workspace root
  if (currentDir.includes('.kiro')) {
    // Find the .kiro directory in the path
    const parts = currentDir.split(path.sep);
    const kiroIndex = parts.findIndex(p => p === '.kiro');
    if (kiroIndex !== -1) {
      // Return the path up to (but not including) .kiro
      return parts.slice(0, kiroIndex).join(path.sep) || path.sep;
    }
  }
  
  // Otherwise, search upwards for .kiro directory
  while (currentDir !== path.dirname(currentDir)) {
    const kiroPath = path.join(currentDir, '.kiro');
    if (fs.existsSync(kiroPath) && fs.statSync(kiroPath).isDirectory()) {
      // Make sure this .kiro directory contains schemas
      const schemasPath = path.join(kiroPath, 'schemas');
      if (fs.existsSync(schemasPath)) {
        return currentDir;
      }
    }
    currentDir = path.dirname(currentDir);
  }
  
  // Fallback to current directory
  return process.cwd();
}

/**
 * Load the hook JSON schema
 */
function loadHookSchema(): any {
  const workspaceRoot = findWorkspaceRoot();
  const schemaPath = path.join(workspaceRoot, '.kiro', 'schemas', 'hook.schema.json');
  
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Hook schema not found at: ${schemaPath}`);
  }
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  return JSON.parse(schemaContent);
}

/**
 * Validate JSON syntax and return parsed object or error
 */
export function isValidJSON(content: string): { valid: boolean; parsed?: any; error?: ValidationError } {
  try {
    const parsed = JSON.parse(content);
    return { valid: true, parsed };
  } catch (error: any) {
    // Extract line and column from error message
    const match = error.message.match(/position (\d+)/);
    let line: number | undefined;
    let column: number | undefined;
    
    if (match) {
      const position = parseInt(match[1], 10);
      const lines = content.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    
    return {
      valid: false,
      error: {
        type: 'syntax',
        message: error.message,
        line,
        column,
        details: 'Invalid JSON syntax'
      }
    };
  }
}

/**
 * Validate hook content against JSON schema
 */
export function matchesHookSchema(content: string): { valid: boolean; errors?: ValidationError[] } {
  // First validate JSON syntax
  const jsonValidation = isValidJSON(content);
  if (!jsonValidation.valid) {
    return { valid: false, errors: [jsonValidation.error!] };
  }
  
  const parsed = jsonValidation.parsed;
  const errors: ValidationError[] = [];
  
  // Load and validate against schema
  try {
    const schema = loadHookSchema();
    const ajv = new Ajv({ allErrors: true, verbose: true });
    const validate = ajv.compile(schema);
    const valid = validate(parsed);
    
    if (!valid && validate.errors) {
      // Convert AJV errors to our format
      for (const error of validate.errors) {
        errors.push(convertAjvError(error, parsed));
      }
    }
    
    // Additional custom validations
    const customErrors = performCustomValidations(parsed);
    errors.push(...customErrors);
    
    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  } catch (error: any) {
    return {
      valid: false,
      errors: [{
        type: 'schema',
        message: `Schema validation error: ${error.message}`,
        details: error.message
      }]
    };
  }
}

/**
 * Convert AJV error to our ValidationError format
 */
function convertAjvError(error: ErrorObject, parsed: any): ValidationError {
  let message = '';
  let details = '';
  
  switch (error.keyword) {
    case 'required':
      const missingProp = error.params.missingProperty;
      message = `Missing required field: ${missingProp}`;
      details = `The field '${missingProp}' is required but was not found`;
      break;
      
    case 'enum':
      const allowedValues = error.params.allowedValues;
      message = `Invalid value for ${error.instancePath || 'field'}`;
      details = `Value must be one of: ${allowedValues.join(', ')}`;
      break;
      
    case 'type':
      message = `Invalid type for ${error.instancePath || 'field'}`;
      details = `Expected ${error.params.type}, got ${typeof error.data}`;
      break;
      
    case 'minLength':
      message = `Value too short for ${error.instancePath || 'field'}`;
      details = `Minimum length is ${error.params.limit}`;
      break;
      
    case 'pattern':
      message = `Invalid format for ${error.instancePath || 'field'}`;
      details = `Value does not match required pattern`;
      break;
      
    default:
      message = error.message || 'Validation error';
      details = JSON.stringify(error.params);
  }
  
  return {
    type: 'schema',
    message,
    path: error.instancePath,
    details
  };
}

/**
 * Perform custom validations beyond JSON schema
 */
function performCustomValidations(parsed: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate file-based events have patterns
  if (parsed.when && ['fileEdited', 'fileCreated', 'fileDeleted'].includes(parsed.when.type)) {
    if (!parsed.when.patterns || !Array.isArray(parsed.when.patterns) || parsed.when.patterns.length === 0) {
      errors.push({
        type: 'schema',
        message: `Event type '${parsed.when.type}' requires 'patterns' field`,
        path: '/when/patterns',
        details: `File-based events (fileEdited, fileCreated, fileDeleted) must have at least one pattern`
      });
    }
  }
  
  // Validate tool-based events have toolTypes
  if (parsed.when && ['preToolUse', 'postToolUse'].includes(parsed.when.type)) {
    if (!parsed.when.toolTypes || typeof parsed.when.toolTypes !== 'string' || parsed.when.toolTypes.trim() === '') {
      errors.push({
        type: 'schema',
        message: `Event type '${parsed.when.type}' requires 'toolTypes' field`,
        path: '/when/toolTypes',
        details: `Tool-based events (preToolUse, postToolUse) must have a toolTypes value`
      });
    }
  }
  
  // Validate askAgent action has prompt
  if (parsed.then && parsed.then.type === 'askAgent') {
    if (!parsed.then.prompt || typeof parsed.then.prompt !== 'string' || parsed.then.prompt.trim() === '') {
      errors.push({
        type: 'schema',
        message: `Action type 'askAgent' requires 'prompt' field`,
        path: '/then/prompt',
        details: `askAgent actions must have a non-empty prompt`
      });
    }
  }
  
  // Validate runCommand action has command
  if (parsed.then && parsed.then.type === 'runCommand') {
    if (!parsed.then.command || typeof parsed.then.command !== 'string' || parsed.then.command.trim() === '') {
      errors.push({
        type: 'schema',
        message: `Action type 'runCommand' requires 'command' field`,
        path: '/then/command',
        details: `runCommand actions must have a non-empty command`
      });
    }
  }
  
  return errors;
}

/**
 * Format validation errors into human-readable string
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return '';
  }
  
  const lines: string[] = ['❌ Hook Validation Failed:', ''];
  
  // Group errors by type
  const syntaxErrors = errors.filter(e => e.type === 'syntax');
  const schemaErrors = errors.filter(e => e.type === 'schema');
  
  if (syntaxErrors.length > 0) {
    lines.push('JSON Syntax Errors:');
    for (const error of syntaxErrors) {
      if (error.line && error.column) {
        lines.push(`  • Line ${error.line}, Column ${error.column}: ${error.message}`);
      } else {
        lines.push(`  • ${error.message}`);
      }
      if (error.details) {
        lines.push(`    ${error.details}`);
      }
    }
    lines.push('');
  }
  
  if (schemaErrors.length > 0) {
    lines.push('Schema Validation Errors:');
    for (const error of schemaErrors) {
      if (error.path) {
        lines.push(`  • ${error.path}: ${error.message}`);
      } else {
        lines.push(`  • ${error.message}`);
      }
      if (error.details) {
        lines.push(`    ${error.details}`);
      }
    }
    lines.push('');
  }
  
  lines.push('Please fix these errors and try again.');
  lines.push('');
  lines.push('Valid event types: fileEdited, fileCreated, fileDeleted, userTriggered, promptSubmit, agentStop, preToolUse, postToolUse, preTaskExecution, postTaskExecution');
  lines.push('Valid action types: askAgent, runCommand');
  
  return lines.join('\n');
}

/**
 * Main validation function - validates hook file content
 */
export function validateHookFile(content: string): ValidationResult {
  // First validate JSON syntax
  const jsonValidation = isValidJSON(content);
  if (!jsonValidation.valid) {
    const errors = [jsonValidation.error!];
    return {
      success: false,
      errors,
      formattedErrors: formatValidationErrors(errors)
    };
  }
  
  // Then validate against schema
  const schemaValidation = matchesHookSchema(content);
  if (!schemaValidation.valid) {
    return {
      success: false,
      errors: schemaValidation.errors || [],
      formattedErrors: formatValidationErrors(schemaValidation.errors || [])
    };
  }
  
  // All validations passed
  return {
    success: true,
    errors: [],
    formattedErrors: ''
  };
}

/**
 * Validate a hook file by path
 */
export function validateHookFilePath(filePath: string): ValidationResult {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      errors: [{
        type: 'syntax',
        message: `File not found: ${filePath}`,
        details: 'The specified hook file does not exist'
      }],
      formattedErrors: `❌ File not found: ${filePath}`
    };
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return validateHookFile(content);
}
