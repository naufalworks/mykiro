#!/usr/bin/env node
import { analyzeSteeringFiles, generateReport } from './analyzeSteeringFiles';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CLI for steering file analysis
 * Usage: node analyzeSteeringFilesCLI.js <directory> [--output <file>]
 */

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node analyzeSteeringFilesCLI.js <directory> [--output <file>]');
    console.error('');
    console.error('Examples:');
    console.error('  node analyzeSteeringFilesCLI.js ~/.kiro/steering');
    console.error('  node analyzeSteeringFilesCLI.js .kiro/steering --output analysis-report.md');
    process.exit(1);
  }
  
  const directory = args[0];
  let outputFile: string | null = null;
  
  // Check for --output flag
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputFile = args[outputIndex + 1];
  }
  
  // Validate directory
  if (!fs.existsSync(directory)) {
    console.error(`Error: Directory not found: ${directory}`);
    process.exit(1);
  }
  
  if (!fs.statSync(directory).isDirectory()) {
    console.error(`Error: Not a directory: ${directory}`);
    process.exit(1);
  }
  
  // Analyze
  console.log(`Analyzing steering files in: ${directory}`);
  console.log('');
  
  try {
    const report = analyzeSteeringFiles(directory);
    const markdown = generateReport(report.files);
    
    // Output
    if (outputFile) {
      fs.writeFileSync(outputFile, markdown);
      console.log(`✅ Report saved to: ${outputFile}`);
    } else {
      console.log(markdown);
    }
    
    // Exit with appropriate code
    if (report.summary.urgent > 0 || report.summary.shouldSplit > 0) {
      process.exit(1); // Indicate action needed
    } else {
      process.exit(0);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
