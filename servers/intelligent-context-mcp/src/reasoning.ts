#!/usr/bin/env node
/**
 * Intelligent Reasoning Engine
 *
 * Uses Sonnet 4.5 to provide:
 * - Multi-hop reasoning for context assembly
 * - Dependency graph understanding
 * - Pattern extraction from past searches
 * - Predictive context loading
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
const MODEL_NAME = 'kr/claude-sonnet-4.5';

/**
 * Raw API call to avoid SDK compatibility issues with OpenAI-compatible endpoints
 */
async function callLLM(prompt: string, maxTokens: number = 1024): Promise<string> {
  const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const data = await response.json() as any;

  // Extract text from response (handles both OpenAI and Anthropic formats)
  let textContent: string;

  if (data.choices) {
    // OpenAI-compatible format
    textContent = data.choices[0].message.content;
  } else if (data.content && data.content.length > 0) {
    // Anthropic format
    textContent = data.content[0].text;
  } else {
    throw new Error('Empty response from API');
  }

  // Extract JSON from markdown code blocks if present
  const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || textContent.match(/```\s*([\s\S]*?)\s*```/);
  return jsonMatch ? jsonMatch[1] : textContent;
}

/**
 * Multi-hop reasoning: Analyze query and determine what context is needed
 */
export async function analyzeQuery(query: string): Promise<{
  intent: string;
  requiredContext: string[];
  relatedConcepts: string[];
  searchStrategy: string;
}> {
  const text = await callLLM(`Analyze this code search query and determine what context is needed:

Query: "${query}"

Provide a JSON response with:
1. intent - What is the user trying to find? (1 sentence)
2. requiredContext - What types of code/files are needed? (array of strings)
3. relatedConcepts - What related concepts should we search for? (array of strings)
4. searchStrategy - How should we search? (single-hop, multi-hop, or dependency-graph)

Example:
{
  "intent": "Find authentication logic with JWT validation",
  "requiredContext": ["auth functions", "JWT validation", "middleware"],
  "relatedConcepts": ["login", "token verification", "auth middleware"],
  "searchStrategy": "multi-hop"
}

Respond with ONLY valid JSON, no other text.`);

  return JSON.parse(text);
}

/**
 * Assemble complete context from multiple search results
 */
export async function assembleContext(
  query: string,
  searchResults: any[]
): Promise<{
  summary: string;
  keyFindings: string[];
  dependencies: string[];
  recommendations: string[];
}> {
  const resultsText = searchResults
    .map((r, i) => {
      return `Result ${i + 1} (score: ${r.score?.toFixed(3)}):
File: ${r.payload?.file || 'unknown'}
Description: ${r.payload?.description || 'N/A'}
Code: ${r.payload?.code || 'N/A'}
`;
    })
    .join('\n---\n');

  const text = await callLLM(`Analyze these search results and assemble complete context:

Original Query: "${query}"

Search Results:
${resultsText}

Provide a JSON response with:
1. summary - Brief overview of what was found (2-3 sentences)
2. keyFindings - Most important discoveries (array of strings)
3. dependencies - What other code/files these depend on (array of strings)
4. recommendations - What else the user might need (array of strings)

Respond with ONLY valid JSON, no other text.`, 2048);

  return JSON.parse(text);
}

/**
 * Extract patterns from search history
 */
export async function extractPatterns(
  searchHistory: Array<{ query: string; results: any[] }>
): Promise<{
  commonPatterns: string[];
  frequentConcepts: string[];
  suggestedRules: string[];
}> {
  if (searchHistory.length === 0) {
    return {
      commonPatterns: [],
      frequentConcepts: [],
      suggestedRules: [],
    };
  }

  const historyText = searchHistory
    .slice(-10) // Last 10 searches
    .map((h, i) => `Search ${i + 1}: "${h.query}" (${h.results.length} results)`)
    .join('\n');

  const text = await callLLM(`Analyze this search history and extract patterns:

${historyText}

Provide a JSON response with:
1. commonPatterns - What patterns do you see in the searches? (array of strings)
2. frequentConcepts - What concepts appear frequently? (array of strings)
3. suggestedRules - What steering rules would help? (array of strings)

Example:
{
  "commonPatterns": ["User often searches for auth-related code", "Frequent API endpoint searches"],
  "frequentConcepts": ["authentication", "JWT", "middleware"],
  "suggestedRules": ["Always include auth context when searching for API endpoints"]
}

Respond with ONLY valid JSON, no other text.`);

  return JSON.parse(text);
}

/**
 * Predict what context the user will need next
 */
export async function predictNextContext(
  currentQuery: string,
  currentResults: any[]
): Promise<{
  predictedNeeds: string[];
  preloadSuggestions: string[];
  reasoning: string;
}> {
  const resultsText = currentResults
    .slice(0, 3) // Top 3 results
    .map((r) => `- ${r.payload?.description || 'N/A'} (${r.payload?.file || 'unknown'})`)
    .join('\n');

  const text = await callLLM(`Predict what context the user will need next:

Current Query: "${currentQuery}"

Current Results:
${resultsText}

Provide a JSON response with:
1. predictedNeeds - What will the user likely search for next? (array of strings)
2. preloadSuggestions - What should we pre-load? (array of strings)
3. reasoning - Why do you think this? (1-2 sentences)

Example:
{
  "predictedNeeds": ["logout functionality", "session management"],
  "preloadSuggestions": ["auth/logout.ts", "session middleware"],
  "reasoning": "User is working on auth, likely needs logout and session handling next"
}

Respond with ONLY valid JSON, no other text.`);

  return JSON.parse(text);
}

/**
 * Understand dependency graph from code
 */
export async function analyzeDependencies(
  codeSnippets: Array<{ file: string; code: string }>
): Promise<{
  dependencies: Array<{ from: string; to: string; type: string }>;
  criticalPaths: string[];
  impactAnalysis: string;
}> {
  const codeText = codeSnippets
    .map((c) => `File: ${c.file}\n${c.code}`)
    .join('\n\n---\n\n');

  const text = await callLLM(`Analyze dependencies in this code:

${codeText}

Provide a JSON response with:
1. dependencies - List of dependencies (array of {from, to, type})
2. criticalPaths - Critical execution paths (array of strings)
3. impactAnalysis - What happens if this code changes? (1-2 sentences)

Example:
{
  "dependencies": [
    {"from": "login.ts", "to": "auth.service.ts", "type": "function call"},
    {"from": "auth.service.ts", "to": "jwt.ts", "type": "import"}
  ],
  "criticalPaths": ["login -> auth.service -> jwt validation"],
  "impactAnalysis": "Changes to auth.service will affect all login flows"
}

Respond with ONLY valid JSON, no other text.`, 2048);

  return JSON.parse(text);
}
