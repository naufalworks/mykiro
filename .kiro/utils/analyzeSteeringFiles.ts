import * as fs from 'fs';
import * as path from 'path';

/**
 * Steering file analysis result
 */
export interface SteeringFileAnalysis {
  path: string;
  name: string;
  lineCount: number;
  sizeBytes: number;
  complexity: ComplexityMetrics;
  recommendations: string[];
  estimatedTokens: number;
  status: 'good' | 'review' | 'split' | 'urgent';
}

/**
 * Complexity metrics for a steering file
 */
export interface ComplexityMetrics {
  sections: number;
  subsections: number;
  maxNestingDepth: number;
  codeBlocks: number;
  lists: number;
  links: number;
}

/**
 * Analysis report for all steering files
 */
export interface AnalysisReport {
  totalFiles: number;
  totalLines: number;
  totalTokens: number;
  files: SteeringFileAnalysis[];
  summary: {
    good: number;
    needsReview: number;
    shouldSplit: number;
    urgent: number;
  };
  recommendations: string[];
}

/**
 * Count lines in a file
 */
export function countLines(filePath: string): number {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

/**
 * Analyze complexity of markdown content
 */
export function analyzeComplexity(content: string): ComplexityMetrics {
  const lines = content.split('\n');
  
  let sections = 0;
  let subsections = 0;
  let maxNestingDepth = 0;
  let codeBlocks = 0;
  let lists = 0;
  let links = 0;
  
  let inCodeBlock = false;
  let currentDepth = 0;
  
  for (const line of lines) {
    // Code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) codeBlocks++;
      continue;
    }
    
    if (inCodeBlock) continue;
    
    // Headers
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)?.[0].length || 0;
      
      if (level === 1) {
        sections++;
        currentDepth = 1;
      } else if (level === 2) {
        subsections++;
        currentDepth = 2;
      } else if (level > 2) {
        currentDepth = level;
      }
      
      maxNestingDepth = Math.max(maxNestingDepth, currentDepth);
    }
    
    // Lists
    if (line.trim().match(/^[-*+]\s/) || line.trim().match(/^\d+\.\s/)) {
      lists++;
    }
    
    // Links
    const linkMatches = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (linkMatches) {
      links += linkMatches.length;
    }
  }
  
  return {
    sections,
    subsections,
    maxNestingDepth,
    codeBlocks,
    lists,
    links
  };
}

/**
 * Suggest split points for large files
 */
export function suggestSplitPoints(content: string): string[] {
  const lines = content.split('\n');
  const suggestions: string[] = [];
  
  let currentSection = '';
  let sectionStartLine = 0;
  let sectionLines = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Level 1 or 2 headers are potential split points
    if (line.match(/^#{1,2}\s/)) {
      // If previous section was large, suggest splitting it
      if (sectionLines > 200 && currentSection) {
        suggestions.push(
          `Split "${currentSection}" (lines ${sectionStartLine}-${i}, ${sectionLines} lines) into a separate file`
        );
      }
      
      // Start new section
      currentSection = line.replace(/^#+\s*/, '').trim();
      sectionStartLine = i + 1;
      sectionLines = 0;
    } else {
      sectionLines++;
    }
  }
  
  // Check last section
  if (sectionLines > 200 && currentSection) {
    suggestions.push(
      `Split "${currentSection}" (lines ${sectionStartLine}-${lines.length}, ${sectionLines} lines) into a separate file`
    );
  }
  
  return suggestions;
}

/**
 * Estimate token usage for content
 * Rough estimate: 1 token ≈ 4 characters
 */
export function estimateContextUsage(content: string): number {
  return Math.ceil(content.length / 4);
}

/**
 * Analyze a single steering file
 */
export function analyzeSteeringFile(filePath: string): SteeringFileAnalysis {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lineCount = countLines(filePath);
  const sizeBytes = Buffer.byteLength(content, 'utf-8');
  const complexity = analyzeComplexity(content);
  const estimatedTokens = estimateContextUsage(content);
  
  const recommendations: string[] = [];
  let status: 'good' | 'review' | 'split' | 'urgent' = 'good';
  
  // Determine status and recommendations based on line count
  if (lineCount < 500) {
    status = 'good';
    recommendations.push('✅ File size is optimal');
  } else if (lineCount >= 500 && lineCount < 700) {
    status = 'review';
    recommendations.push('⚠️ File is getting large - consider reviewing for split opportunities');
    recommendations.push(`Current size: ${lineCount} lines (recommended: <500 lines)`);
  } else if (lineCount >= 700 && lineCount < 1000) {
    status = 'split';
    recommendations.push('🔶 File should be split - exceeds recommended size');
    recommendations.push(`Current size: ${lineCount} lines (recommended: <500 lines)`);
    
    // Add specific split suggestions
    const splitPoints = suggestSplitPoints(content);
    if (splitPoints.length > 0) {
      recommendations.push('Suggested split points:');
      splitPoints.forEach(point => recommendations.push(`  • ${point}`));
    }
  } else {
    status = 'urgent';
    recommendations.push('🚨 File urgently needs splitting - significantly exceeds limits');
    recommendations.push(`Current size: ${lineCount} lines (recommended: <500 lines)`);
    
    // Add specific split suggestions
    const splitPoints = suggestSplitPoints(content);
    if (splitPoints.length > 0) {
      recommendations.push('Suggested split points:');
      splitPoints.forEach(point => recommendations.push(`  • ${point}`));
    }
  }
  
  // Complexity-based recommendations
  if (complexity.maxNestingDepth > 4) {
    recommendations.push(`⚠️ High nesting depth (${complexity.maxNestingDepth} levels) - consider flattening structure`);
  }
  
  if (complexity.sections > 10) {
    recommendations.push(`⚠️ Many top-level sections (${complexity.sections}) - consider grouping related sections`);
  }
  
  // Token usage recommendations
  if (estimatedTokens > 20000) {
    recommendations.push(`⚠️ High token usage (~${estimatedTokens.toLocaleString()} tokens) - consider selective loading`);
  }
  
  return {
    path: filePath,
    name: path.basename(filePath),
    lineCount,
    sizeBytes,
    complexity,
    recommendations,
    estimatedTokens,
    status
  };
}

/**
 * Generate markdown report from analysis
 */
export function generateReport(files: SteeringFileAnalysis[]): string {
  const lines: string[] = [];
  
  lines.push('# Steering Files Analysis Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  
  // Summary
  const summary = {
    good: files.filter(f => f.status === 'good').length,
    needsReview: files.filter(f => f.status === 'review').length,
    shouldSplit: files.filter(f => f.status === 'split').length,
    urgent: files.filter(f => f.status === 'urgent').length
  };
  
  const totalLines = files.reduce((sum, f) => sum + f.lineCount, 0);
  const totalTokens = files.reduce((sum, f) => sum + f.estimatedTokens, 0);
  
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Files**: ${files.length}`);
  lines.push(`- **Total Lines**: ${totalLines.toLocaleString()}`);
  lines.push(`- **Estimated Tokens**: ~${totalTokens.toLocaleString()}`);
  lines.push('');
  lines.push('### Status Breakdown');
  lines.push('');
  lines.push(`- ✅ **Good** (< 500 lines): ${summary.good} files`);
  lines.push(`- ⚠️ **Needs Review** (500-699 lines): ${summary.needsReview} files`);
  lines.push(`- 🔶 **Should Split** (700-999 lines): ${summary.shouldSplit} files`);
  lines.push(`- 🚨 **Urgent** (≥ 1000 lines): ${summary.urgent} files`);
  lines.push('');
  
  // Files needing attention
  const needsAttention = files.filter(f => f.status !== 'good');
  if (needsAttention.length > 0) {
    lines.push('## Files Needing Attention');
    lines.push('');
    
    // Sort by urgency
    const sorted = needsAttention.sort((a, b) => {
      const order = { urgent: 0, split: 1, review: 2, good: 3 };
      return order[a.status] - order[b.status];
    });
    
    for (const file of sorted) {
      const statusIcon = {
        good: '✅',
        review: '⚠️',
        split: '🔶',
        urgent: '🚨'
      }[file.status];
      
      lines.push(`### ${statusIcon} ${file.name}`);
      lines.push('');
      lines.push(`- **Path**: \`${file.path}\``);
      lines.push(`- **Lines**: ${file.lineCount.toLocaleString()}`);
      lines.push(`- **Size**: ${(file.sizeBytes / 1024).toFixed(2)} KB`);
      lines.push(`- **Estimated Tokens**: ~${file.estimatedTokens.toLocaleString()}`);
      lines.push('');
      lines.push('**Complexity**:');
      lines.push(`- Sections: ${file.complexity.sections}`);
      lines.push(`- Subsections: ${file.complexity.subsections}`);
      lines.push(`- Max Nesting: ${file.complexity.maxNestingDepth} levels`);
      lines.push(`- Code Blocks: ${file.complexity.codeBlocks}`);
      lines.push('');
      lines.push('**Recommendations**:');
      file.recommendations.forEach(rec => lines.push(`- ${rec}`));
      lines.push('');
    }
  }
  
  // All files table
  lines.push('## All Files');
  lines.push('');
  lines.push('| File | Lines | Tokens | Status |');
  lines.push('|------|-------|--------|--------|');
  
  for (const file of files.sort((a, b) => b.lineCount - a.lineCount)) {
    const statusIcon = {
      good: '✅',
      review: '⚠️',
      split: '🔶',
      urgent: '🚨'
    }[file.status];
    
    lines.push(`| ${file.name} | ${file.lineCount.toLocaleString()} | ~${file.estimatedTokens.toLocaleString()} | ${statusIcon} ${file.status} |`);
  }
  
  lines.push('');
  
  // Guidelines
  lines.push('## Guidelines');
  lines.push('');
  lines.push('- **Ideal**: < 500 lines per file');
  lines.push('- **Acceptable**: 500-700 lines (review for split opportunities)');
  lines.push('- **Should Split**: 700-1000 lines (recommend splitting)');
  lines.push('- **Urgent**: ≥ 1000 lines (strongly recommend immediate splitting)');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Analyze all steering files in a directory
 */
export function analyzeSteeringFiles(directory: string): AnalysisReport {
  if (!fs.existsSync(directory)) {
    throw new Error(`Directory not found: ${directory}`);
  }
  
  const files: SteeringFileAnalysis[] = [];
  
  // Read all .md files in directory
  const entries = fs.readdirSync(directory);
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile() && entry.endsWith('.md') && !entry.endsWith('.backup')) {
      const analysis = analyzeSteeringFile(fullPath);
      files.push(analysis);
    }
  }
  
  // Generate summary
  const summary = {
    good: files.filter(f => f.status === 'good').length,
    needsReview: files.filter(f => f.status === 'review').length,
    shouldSplit: files.filter(f => f.status === 'split').length,
    urgent: files.filter(f => f.status === 'urgent').length
  };
  
  const totalLines = files.reduce((sum, f) => sum + f.lineCount, 0);
  const totalTokens = files.reduce((sum, f) => sum + f.estimatedTokens, 0);
  
  // Generate overall recommendations
  const recommendations: string[] = [];
  
  if (summary.urgent > 0) {
    recommendations.push(`🚨 ${summary.urgent} file(s) urgently need splitting (≥ 1000 lines)`);
  }
  
  if (summary.shouldSplit > 0) {
    recommendations.push(`🔶 ${summary.shouldSplit} file(s) should be split (700-999 lines)`);
  }
  
  if (summary.needsReview > 0) {
    recommendations.push(`⚠️ ${summary.needsReview} file(s) need review (500-699 lines)`);
  }
  
  if (summary.good === files.length) {
    recommendations.push('✅ All files are within recommended size limits');
  }
  
  if (totalTokens > 100000) {
    recommendations.push(`⚠️ High total token usage (~${totalTokens.toLocaleString()} tokens) - consider selective loading strategies`);
  }
  
  return {
    totalFiles: files.length,
    totalLines,
    totalTokens,
    files,
    summary,
    recommendations
  };
}
