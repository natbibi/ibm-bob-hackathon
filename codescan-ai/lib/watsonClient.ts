/*
 * IBM Granite Chat Template Fix:
 * granite-8b-code-instruct uses <|system|>/<|user|>/<|assistant|> tokens.
 * We prime the assistant turn with `{` so the model is FORCED to complete a JSON object.
 */

function buildGranitePrompt(code: string, fileNames: string): string {
  const firstName = fileNames.split(',')[0].trim();

  const system = `You are a code security analysis engine. You ONLY output valid JSON. No explanations, no markdown, no extra text — just the JSON object.`;

  const user = `Analyze the code below for security vulnerabilities and code quality issues. 
Return ONLY a single JSON object that matches this exact structure (replace placeholder values with real findings from the code):

{
  "healthScore": 75,
  "codeQualityScore": 70,
  "securityRisk": "High",
  "vulnerabilities": [
    {
      "category": "hardcoded-credential",
      "severity": "critical",
      "file": "${firstName}",
      "line": 5,
      "issue": "Hardcoded database password detected",
      "recommendation": "Move to environment variable: os.getenv('DB_PASSWORD')",
      "confidence": 95
    }
  ],
  "topIssueCategories": [
    {"name": "Security Vulnerabilities", "count": 3},
    {"name": "Code Smells", "count": 2},
    {"name": "Best Practices", "count": 1},
    {"name": "Performance", "count": 0},
    {"name": "Maintainability", "count": 1}
  ],
  "aiInsights": [
    {"type": "critical", "message": "Fix 3 critical issues before deploying: remove hardcoded credentials, patch SQL injection, and disable debug mode."},
    {"type": "warning", "message": "Refactor 2 code quality issues: break long functions and remove dead code."},
    {"type": "success", "message": "70% of code follows best practices. Add input validation to reach 90%."}
  ],
  "aiRecommendations": [
    {"title": "Move hardcoded secrets to environment variables", "severity": "critical", "affectedFiles": 1},
    {"title": "Use parameterized queries to prevent SQL injection", "severity": "high", "affectedFiles": 1},
    {"title": "Refactor long functions into smaller units", "severity": "medium", "affectedFiles": 1},
    {"title": "Add unit tests for critical business logic", "severity": "low", "affectedFiles": 1}
  ],
  "aiSuggestions": [
    "Replace all hardcoded secrets with environment variables using python-dotenv",
    "Use parameterized queries or an ORM like SQLAlchemy to prevent SQL injection",
    "Add input validation and sanitization on every user-facing endpoint",
    "Disable debug mode in production and use a proper logging framework",
    "Add unit tests with pytest to achieve at least 80% coverage"
  ],
  "codeMetrics": {
    "complexity": 65,
    "testCoverage": 20,
    "duplicatedCode": 8,
    "technicalDebt": "4.5h",
    "technicalDebtIssues": 4,
    "maintainabilityIndex": 60
  },
  "codeSnippet": {
    "file": "${firstName}",
    "code": "paste 6-8 lines of the most critical code here",
    "issueDescription": "Hardcoded secret key detected — use environment variable instead",
    "issueLine": 5,
    "issueType": "critical"
  }
}

FILES: ${fileNames}

CODE TO ANALYZE:
${code.substring(0, 8000)}

Now output the JSON object with REAL values from the code above:`;

  // Prime the assistant with `{` — forces model to complete a JSON body
  return `<|system|>\n${system}\n<|user|>\n${user}\n<|assistant|>\n{`;
}

async function getIAMToken(apiKey: string): Promise<string> {
  console.log('🔑 [Watson AI] Requesting IAM token...');
  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: apiKey,
    }),
  });
  if (!res.ok) throw new Error(`IAM token failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  console.log('✅ [Watson AI] IAM token obtained');
  return data.access_token;
}

function parseJSON(raw: string): Record<string, unknown> | null {
  // The model output starts AFTER the `{` we primed — prepend it back
  const attempts = [
    raw,              // maybe the model output the full `{...}`
    '{' + raw,        // primed with `{`, so prepend it back
  ];

  for (const text of attempts) {
    // Strategy A: direct parse
    try { return JSON.parse(text); } catch { /* try next */ }

    // Strategy B: extract from ```json ... ```
    const block = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (block) { try { return JSON.parse(block[1]); } catch { /* continue */ } }

    // Strategy C: grab the largest {...} and clean it
    const big = text.match(/\{[\s\S]*\}/);
    if (big) {
      try {
        const cleaned = big[0]
          .replace(/,(\s*[}\]])/g, '$1')   // trailing commas
          .replace(/[\x00-\x1F\x7F]/g, ' ') // control chars
          .replace(/\/\/[^\n]*/g, '')         // JS comments
          .replace(/\/\*[\s\S]*?\*\//g, ''); // block comments
        return JSON.parse(cleaned);
      } catch { /* continue */ }
    }

    // Strategy D: find the LAST complete `}` and try substring
    const lastBrace = text.lastIndexOf('}');
    const firstBrace = text.indexOf('{');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try { return JSON.parse(text.substring(firstBrace, lastBrace + 1)); } catch { /* continue */ }
    }
  }
  return null;
}

export async function analyzeCode(
  code: string,
  fileNames: string
): Promise<{ parsedAnalysis: Record<string, unknown> | null; generatedText: string }> {
  const apiKey    = process.env.WATSON_API_KEY;
  const url       = process.env.WATSON_URL;
  const projectId = process.env.WATSON_PROJECT_ID;
  const version   = process.env.WATSON_VERSION || '2023-05-29';

  console.log('\n' + '─'.repeat(70));
  console.log('🤖 [Watson AI] IBM Granite — Deep Code Security Analysis');
  console.log('─'.repeat(70));
  console.log('📁 Files:', fileNames);
  console.log('📏 Code size:', code.length, 'chars');

  if (!apiKey || !url || !projectId) {
    throw new Error('Watson API credentials not configured (check WATSON_API_KEY, WATSON_URL, WATSON_PROJECT_ID)');
  }

  const accessToken = await getIAMToken(apiKey);
  const prompt      = buildGranitePrompt(code, fileNames);
  console.log('📝 [Watson AI] Prompt size:', prompt.length, 'chars');
  console.log('💡 [Watson AI] Using Granite chat template with JSON-primed assistant turn');

  // Model priority — granite-3-8b-instruct is better at following instructions
  const MODELS = [
    'ibm/granite-3-8b-instruct',
    'ibm/granite-8b-code-instruct',
    'ibm/granite-3-2b-instruct',
  ];

  let generatedText = '';
  let usedModel     = '';

  for (const modelId of MODELS) {
    console.log(`\n🔄 [Watson AI] Trying model: ${modelId}`);
    try {
      const res = await fetch(`${url}/ml/v1/text/generation?version=${version}`, {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept:         'application/json',
        },
        body: JSON.stringify({
          model_id:   modelId,
          project_id: projectId,
          input:      prompt,
          parameters: {
            decoding_method:    'greedy',
            max_new_tokens:     2000,
            min_new_tokens:     100,
            temperature:        0.1,   // very low — we want deterministic JSON
            repetition_penalty: 1.05,
            stop_sequences:     ['<|user|>', '<|system|>', '\n\nNote:', '\n\nI hope'],
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`❌ [Watson AI] ${modelId} → ${res.status}: ${err.substring(0, 150)}`);
        continue;
      }

      const data = await res.json();
      generatedText = data.results?.[0]?.generated_text || '';
      usedModel = modelId;
      console.log(`✅ [Watson AI] ${modelId} responded — ${generatedText.length} chars`);
      console.log('📄 [Watson AI] First 200 chars:', generatedText.substring(0, 200));
      break;
    } catch (e) {
      console.warn(`❌ [Watson AI] ${modelId} exception:`, e);
    }
  }

  if (!generatedText) {
    throw new Error('All Watson AI models failed to respond');
  }

  console.log('\n🔍 [Watson AI] Extracting JSON from response...');
  console.log('💡 [Watson AI] Model:', usedModel);
  const parsedAnalysis = parseJSON(generatedText);

  if (parsedAnalysis) {
    const vulnCount = Array.isArray(parsedAnalysis.vulnerabilities) ? (parsedAnalysis.vulnerabilities as unknown[]).length : 0;
    console.log('✅ [Watson AI] JSON parsed successfully!');
    console.log('📊 [Watson AI] Keys:', Object.keys(parsedAnalysis).join(', '));
    console.log('🔍 [Watson AI] Vulnerabilities:', vulnCount);
    console.log('🎯 [Watson AI] Health score:', parsedAnalysis.healthScore);
  } else {
    console.warn('⚠️  [Watson AI] JSON extraction failed — rule-based fallback will be used');
    console.warn('📄 [Watson AI] Raw (first 400):', generatedText.substring(0, 400));
  }

  console.log('─'.repeat(70) + '\n');
  return { parsedAnalysis, generatedText };
}

export function getWatsonClient() {
  return null;
}
