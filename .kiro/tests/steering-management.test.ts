/**
 * Bug Condition Exploration Tests - Steering File Management
 * 
 * UPDATED: Tests now verify the analysis utility implementation
 * 
 * Purpose: Verify that steering file analysis utility provides recommendations and metrics
 * Expected Outcome: All tests PASS (proving the fix works)
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  analyzeSteeringFile,
  analyzeSteeringFiles,
  countLines,
  analyzeComplexity,
  suggestSplitPoints,
  estimateContextUsage,
  generateReport
} from '../utils/analyzeSteeringFiles';

describe('Steering File Analysis Utility', () => {
  const testSteeringDir = path.join(__dirname, '../test-steering');
  
  beforeEach(() => {
    // Create test steering directory
    if (!fs.existsSync(testSteeringDir)) {
      fs.mkdirSync(testSteeringDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup test steering files
    if (fs.existsSync(testSteeringDir)) {
      fs.rmSync(testSteeringDir, { recursive: true, force: true });
    }
  });

  describe('File Size Analysis and Recommendations', () => {
    it('should analyze files over 500 lines and provide review recommendations', () => {
      // Create a large steering file (600 lines)
      const largeContent = generateSteeringFile(600);
      const filePath = path.join(testSteeringDir, 'large-file.md');
      fs.writeFileSync(filePath, largeContent);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should provide recommendations for files over 500 lines
      expect(fileInfo.status).toBe('review');
      expect(fileInfo.recommendations.length).toBeGreaterThan(0);
      expect(fileInfo.recommendations.some(r => r.includes('getting large'))).toBe(true);
    });

    it('should recommend splitting for files 700-1000 lines', () => {
      // Create a very large steering file (850 lines)
      const veryLargeContent = generateSteeringFile(850);
      const filePath = path.join(testSteeringDir, 'very-large-file.md');
      fs.writeFileSync(filePath, veryLargeContent);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should recommend splitting
      expect(fileInfo.status).toBe('split');
      expect(fileInfo.recommendations.some(r => r.includes('should be split'))).toBe(true);
    });

    it('should urgently recommend splitting for files over 1000 lines', () => {
      // Create an extremely large steering file (1200 lines)
      const extremelyLargeContent = generateSteeringFile(1200);
      const filePath = path.join(testSteeringDir, 'extremely-large-file.md');
      fs.writeFileSync(filePath, extremelyLargeContent);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should urgently recommend splitting
      expect(fileInfo.status).toBe('urgent');
      expect(fileInfo.recommendations.some(r => r.includes('urgently needs splitting'))).toBe(true);
    });

    it('should count lines correctly', () => {
      const content = generateSteeringFile(600);
      const filePath = path.join(testSteeringDir, 'line-count-test.md');
      fs.writeFileSync(filePath, content);
      
      const lineCount = countLines(filePath);
      
      // Should count lines accurately (allowing for section headers added by generator)
      expect(lineCount).toBeGreaterThan(590);
      expect(lineCount).toBeLessThan(650);
    });
  });

  describe('Complexity Analysis', () => {
    it('should analyze markdown complexity metrics', () => {
      const content = `---
name: Test Steering
---

# Section 1

Content here

## Subsection 1.1

More content

### Deep subsection

Even more content

\`\`\`typescript
const code = 'example';
\`\`\`

- List item 1
- List item 2

[Link text](https://example.com)
`;
      
      const filePath = path.join(testSteeringDir, 'complex.md');
      fs.writeFileSync(filePath, content);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should analyze complexity
      expect(fileInfo.complexity).toBeDefined();
      expect(fileInfo.complexity.sections).toBeGreaterThan(0);
      expect(fileInfo.complexity.codeBlocks).toBeGreaterThan(0);
      expect(fileInfo.complexity.lists).toBeGreaterThan(0);
      expect(fileInfo.complexity.links).toBeGreaterThan(0);
    });

    it('should detect high nesting depth', () => {
      const content = `# Level 1
## Level 2
### Level 3
#### Level 4
##### Level 5
`;
      
      const complexity = analyzeComplexity(content);
      
      expect(complexity.maxNestingDepth).toBeGreaterThanOrEqual(4);
    });

    it('should suggest split points for large sections', () => {
      // Create content with large sections
      let content = '# Section 1\n';
      for (let i = 0; i < 250; i++) {
        content += `Line ${i}\n`;
      }
      content += '\n# Section 2\n';
      for (let i = 0; i < 250; i++) {
        content += `Line ${i}\n`;
      }
      
      const suggestions = suggestSplitPoints(content);
      
      // Should suggest splitting large sections
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('Split'))).toBe(true);
    });
  });

  describe('Token Estimation', () => {
    it('should estimate token usage for file content', () => {
      const content = generateSteeringFile(1143); // workflow.md size
      
      const estimatedTokens = estimateContextUsage(content);
      
      // Should provide token estimate (rough: 1 token ≈ 4 characters)
      expect(estimatedTokens).toBeGreaterThan(0);
      expect(estimatedTokens).toBeGreaterThan(10000); // Large file should have many tokens
    });

    it('should include token estimates in file analysis', () => {
      const content = generateSteeringFile(600);
      const filePath = path.join(testSteeringDir, 'token-test.md');
      fs.writeFileSync(filePath, content);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      expect(fileInfo.estimatedTokens).toBeGreaterThan(0);
    });
  });

  describe('Backup File Detection', () => {
    it('should detect backup files in directory', () => {
      // Create a backup file
      const backupPath = path.join(testSteeringDir, 'test-file.md.backup');
      fs.writeFileSync(backupPath, 'Backup content');
      
      // Create a regular file
      const regularPath = path.join(testSteeringDir, 'regular-file.md');
      fs.writeFileSync(regularPath, 'Regular content');
      
      // Analyze directory - should exclude backup files
      const report = analyzeSteeringFiles(testSteeringDir);
      
      // Should only count non-backup files
      expect(report.totalFiles).toBe(1);
      expect(report.files.some(f => f.name === 'regular-file.md')).toBe(true);
      expect(report.files.some(f => f.name.includes('.backup'))).toBe(false);
    });
  });

  describe('Directory Analysis', () => {
    it('should analyze all steering files in directory', () => {
      // Create multiple files of different sizes
      const files = [
        { name: 'small.md', lines: 300 },
        { name: 'medium.md', lines: 600 },
        { name: 'large.md', lines: 900 },
        { name: 'huge.md', lines: 1200 }
      ];
      
      files.forEach(file => {
        const content = generateSteeringFile(file.lines);
        const filePath = path.join(testSteeringDir, file.name);
        fs.writeFileSync(filePath, content);
      });
      
      const report = analyzeSteeringFiles(testSteeringDir);
      
      // Should analyze all files
      expect(report.totalFiles).toBe(4);
      expect(report.files.length).toBe(4);
      
      // Should categorize by status
      expect(report.summary.good).toBeGreaterThan(0); // small.md
      expect(report.summary.needsReview).toBeGreaterThan(0); // medium.md
      expect(report.summary.shouldSplit).toBeGreaterThan(0); // large.md
      expect(report.summary.urgent).toBeGreaterThan(0); // huge.md
    });

    it('should provide overall recommendations', () => {
      const files = [
        { name: 'large1.md', lines: 900 },
        { name: 'large2.md', lines: 1100 }
      ];
      
      files.forEach(file => {
        const content = generateSteeringFile(file.lines);
        const filePath = path.join(testSteeringDir, file.name);
        fs.writeFileSync(filePath, content);
      });
      
      const report = analyzeSteeringFiles(testSteeringDir);
      
      // Should provide recommendations
      expect(report.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate markdown report', () => {
      const files = [
        { name: 'test1.md', lines: 400 },
        { name: 'test2.md', lines: 800 }
      ];
      
      files.forEach(file => {
        const content = generateSteeringFile(file.lines);
        const filePath = path.join(testSteeringDir, file.name);
        fs.writeFileSync(filePath, content);
      });
      
      const report = analyzeSteeringFiles(testSteeringDir);
      const markdown = generateReport(report.files);
      
      // Should generate valid markdown
      expect(markdown).toContain('# Steering Files Analysis Report');
      expect(markdown).toContain('## Summary');
      expect(markdown).toContain('## All Files');
      expect(markdown).toContain('test1.md');
      expect(markdown).toContain('test2.md');
    });
  });

  describe('File Size and Metrics Display', () => {
    it('should display file size in KB', () => {
      const content = generateSteeringFile(500);
      const filePath = path.join(testSteeringDir, 'sized-file.md');
      fs.writeFileSync(filePath, content);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should provide file size
      expect(fileInfo.sizeBytes).toBeGreaterThan(0);
    });

    it('should display line count', () => {
      const content = generateSteeringFile(732); // architecture.md size
      const filePath = path.join(testSteeringDir, 'architecture-size.md');
      fs.writeFileSync(filePath, content);
      
      const fileInfo = analyzeSteeringFile(filePath);
      
      // Should provide accurate line count (allowing for section headers added by generator)
      expect(fileInfo.lineCount).toBeGreaterThan(720);
      expect(fileInfo.lineCount).toBeLessThan(800);
    });

    it('should identify files needing optimization', () => {
      // Create multiple files of different sizes
      const files = [
        { name: 'small.md', lines: 300 },
        { name: 'medium.md', lines: 600 },
        { name: 'large.md', lines: 900 },
        { name: 'huge.md', lines: 1200 }
      ];
      
      files.forEach(file => {
        const content = generateSteeringFile(file.lines);
        const filePath = path.join(testSteeringDir, file.name);
        fs.writeFileSync(filePath, content);
      });
      
      const report = analyzeSteeringFiles(testSteeringDir);
      
      // Should identify files needing attention
      const needsAttention = report.files.filter(f => f.status !== 'good');
      expect(needsAttention.length).toBeGreaterThan(0);
      expect(needsAttention.some(f => f.name === 'large.md')).toBe(true);
      expect(needsAttention.some(f => f.name === 'huge.md')).toBe(true);
    });
  });
});

// Helper functions

function generateSteeringFile(lines: number): string {
  let content = `---
name: Test Steering File
description: Generated test file
type: global
inclusion: always
priority: critical
---

# Test Steering File

`;
  
  for (let i = 0; i < lines - 10; i++) {
    if (i % 50 === 0) {
      content += `\n## Section ${Math.floor(i / 50) + 1}\n\n`;
    }
    content += `Line ${i + 1}: This is test content for the steering file.\n`;
  }
  
  return content;
}

/**
 * Test Execution Notes:
 * 
 * UPDATED OUTCOME: ALL TESTS SHOULD PASS
 * 
 * These tests now verify the actual implementation:
 * - analyzeSteeringFile() provides file analysis with recommendations
 * - countLines() counts lines accurately
 * - analyzeComplexity() returns complexity metrics
 * - suggestSplitPoints() provides split recommendations
 * - estimateContextUsage() calculates token estimates
 * - analyzeSteeringFiles() analyzes entire directories
 * - generateReport() creates markdown reports
 * 
 * The implementation provides:
 * - File size and line count analysis
 * - Status categorization (good, review, split, urgent)
 * - Recommendations for large files
 * - Complexity metrics (sections, nesting, code blocks, etc.)
 * - Token usage estimation
 * - Split point suggestions
 * - Directory-level analysis and reporting
 */

