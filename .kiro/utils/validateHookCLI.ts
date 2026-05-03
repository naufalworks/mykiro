#!/usr/bin/env node
import { validateHookFile } from './validateHook';
import * as fs from 'fs';

/**
 * CLI for hook validation
 * Usage: node validateHookCLI.js <file-path>
 * or: echo '<json-content>' | node validateHookCLI.js --stdin
 */

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node validateHookCLI.js <file-path>');
    console.error('   or: echo \'<json-content>\' | node validateHookCLI.js --stdin');
    process.exit(1);
  }
  
  let content: string;
  
  if (args[0] === '--stdin') {
    // Read from stdin
    content = fs.readFileSync(0, 'utf-8');
  } else {
    // Read from file
    const filePath = args[0];
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }
    content = fs.readFileSync(filePath, 'utf-8');
  }
  
  // Validate
  const result = validateHookFile(content);
  
  if (result.success) {
    console.log('✅ Hook validation passed');
    process.exit(0);
  } else {
    console.error(result.formattedErrors);
    process.exit(1);
  }
}

main();
