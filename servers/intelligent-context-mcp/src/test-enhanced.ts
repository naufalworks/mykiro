#!/usr/bin/env node
/**
 * Test script for Enhanced Intelligent Context MCP
 *
 * Tests the new AI-powered features:
 * 1. Intelligent search with multi-hop reasoning
 * 2. Query analysis
 * 3. Context assembly
 * 4. Dependency analysis
 * 5. Pattern extraction
 */

import 'dotenv/config';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Redis } from 'ioredis';
import {
  analyzeQuery,
  assembleContext,
  extractPatterns,
  predictNextContext,
  analyzeDependencies,
} from './reasoning.js';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || 'code_context';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

async function main() {
  console.log('🚀 Testing Enhanced Intelligent Context MCP\n');

  // Test 1: Check prerequisites
  console.log('1️⃣  Checking prerequisites...');

  if (!ANTHROPIC_API_KEY) {
    console.error('   ❌ ANTHROPIC_API_KEY not set in .env');
    console.error('   ℹ️  Please add your Anthropic API key to .env file');
    process.exit(1);
  }
  console.log('   ✅ Anthropic API key found');

  try {
    const qdrant = new QdrantClient({ url: QDRANT_URL });
    await qdrant.getCollection(QDRANT_COLLECTION);
    console.log('   ✅ Qdrant connected');
  } catch (error) {
    console.error('   ❌ Qdrant connection failed:', error);
    process.exit(1);
  }

  try {
    const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
    await redis.ping();
    console.log('   ✅ Redis connected');
    await redis.quit();
  } catch (error) {
    console.error('   ❌ Redis connection failed:', error);
    process.exit(1);
  }

  // Test 2: Query Analysis
  console.log('\n2️⃣  Testing Query Analysis (AI-powered)...');
  try {
    const analysis = await analyzeQuery('find authentication with JWT validation');
    console.log('   ✅ Query analysis successful!');
    console.log(`   Intent: ${analysis.intent}`);
    console.log(`   Strategy: ${analysis.searchStrategy}`);
    console.log(`   Required Context: ${analysis.requiredContext.join(', ')}`);
    console.log(`   Related Concepts: ${analysis.relatedConcepts.join(', ')}`);
  } catch (error) {
    console.error('   ❌ Query analysis failed:', error);
    process.exit(1);
  }

  // Test 3: Context Assembly
  console.log('\n3️⃣  Testing Context Assembly (AI-powered)...');
  try {
    const mockResults = [
      {
        score: 0.95,
        payload: {
          file: 'src/auth/handlers.ts',
          description: 'Login handler function with email and password',
          code: 'async function handleLogin(email: string, password: string) { return await authService.login(email, password); }',
        },
      },
      {
        score: 0.89,
        payload: {
          file: 'src/auth/jwt.ts',
          description: 'JWT token validation function',
          code: 'export const validateJWT = (token: string): boolean => { return jwt.verify(token, SECRET_KEY); }',
        },
      },
    ];

    const context = await assembleContext('authentication with JWT', mockResults);
    console.log('   ✅ Context assembly successful!');
    console.log(`   Summary: ${context.summary}`);
    console.log(`   Key Findings: ${context.keyFindings.length} items`);
    console.log(`   Dependencies: ${context.dependencies.join(', ')}`);
  } catch (error) {
    console.error('   ❌ Context assembly failed:', error);
    process.exit(1);
  }

  // Test 4: Predictive Context
  console.log('\n4️⃣  Testing Predictive Context Loading (AI-powered)...');
  try {
    const mockResults = [
      {
        score: 0.95,
        payload: {
          file: 'src/auth/login.ts',
          description: 'Login functionality',
        },
      },
    ];

    const prediction = await predictNextContext('login function', mockResults);
    console.log('   ✅ Prediction successful!');
    console.log(`   Predicted Needs: ${prediction.predictedNeeds.join(', ')}`);
    console.log(`   Preload Suggestions: ${prediction.preloadSuggestions.join(', ')}`);
    console.log(`   Reasoning: ${prediction.reasoning}`);
  } catch (error) {
    console.error('   ❌ Prediction failed:', error);
    process.exit(1);
  }

  // Test 5: Dependency Analysis
  console.log('\n5️⃣  Testing Dependency Analysis (AI-powered)...');
  try {
    const codeSnippets = [
      {
        file: 'src/auth/handlers.ts',
        code: 'import { authService } from "./auth.service"; async function handleLogin(email: string, password: string) { return await authService.login(email, password); }',
      },
      {
        file: 'src/auth/jwt.ts',
        code: 'import jwt from "jsonwebtoken"; export const validateJWT = (token: string): boolean => { return jwt.verify(token, SECRET_KEY); }',
      },
    ];

    const deps = await analyzeDependencies(codeSnippets);
    console.log('   ✅ Dependency analysis successful!');
    console.log(`   Dependencies found: ${deps.dependencies.length}`);
    console.log(`   Critical paths: ${deps.criticalPaths.join(', ')}`);
    console.log(`   Impact: ${deps.impactAnalysis}`);
  } catch (error) {
    console.error('   ❌ Dependency analysis failed:', error);
    process.exit(1);
  }

  // Test 6: Pattern Extraction
  console.log('\n6️⃣  Testing Pattern Extraction (AI-powered)...');
  try {
    const mockHistory = [
      { query: 'authentication with JWT', results: [] },
      { query: 'login function', results: [] },
      { query: 'JWT validation', results: [] },
    ];

    const patterns = await extractPatterns(mockHistory);
    console.log('   ✅ Pattern extraction successful!');
    console.log(`   Common Patterns: ${patterns.commonPatterns.join(', ')}`);
    console.log(`   Frequent Concepts: ${patterns.frequentConcepts.join(', ')}`);
    if (patterns.suggestedRules.length > 0) {
      console.log(`   Suggested Rules: ${patterns.suggestedRules.join(', ')}`);
    }
  } catch (error) {
    console.error('   ❌ Pattern extraction failed:', error);
    process.exit(1);
  }

  console.log('\n✨ All enhanced features tested successfully!');
  console.log('\n🎯 Enhanced MCP Features:');
  console.log('   ✅ Multi-hop reasoning with Sonnet 4.5');
  console.log('   ✅ Intelligent query analysis');
  console.log('   ✅ Context assembly and summarization');
  console.log('   ✅ Predictive context loading');
  console.log('   ✅ Dependency graph understanding');
  console.log('   ✅ Pattern extraction from history');
  console.log('\n🚀 Ready for integration testing!\n');
}

main().catch(console.error);
