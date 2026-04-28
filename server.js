import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

// ── Updated free models (April 2026) ──────────────────────────────────────────
// Ordered by reliability + tool-calling capability. Retried on 429/404.
const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',  // best overall free model; strong tool use
  'qwen/qwen3-235b-a22b:free',               // 235B MoE; confirmed tool-calling support
  'google/gemma-3-27b-it:free',              // Gemma 3 27B; vision + tools tags
  'deepseek/deepseek-r1:free',               // strong reasoning; free tier available
  'openrouter/free',                         // OpenRouter auto-router — picks best free model
];

if (!OPENROUTER_API_KEY) {
  console.warn('⚠️  OPENROUTER_API_KEY not set in .env');
} else {
  console.log('✅ OpenRouter API key loaded');
}
if (!TAVILY_API_KEY) {
  console.warn('⚠️  TAVILY_API_KEY not set — real web search disabled');
} else {
  console.log('✅ Tavily API key loaded — real web search enabled');
}

// ─────────────────────────────────────────────
//  TOOL DEFINITIONS
// ─────────────────────────────────────────────

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'fetch_card_details',
      description: 'Fetch structured information about a credit card from the CardLens database.',
      parameters: {
        type: 'object',
        properties: {
          card_name: { type: 'string', description: 'Full name of the credit card e.g. HDFC Regalia' },
          bank_name: { type: 'string', description: 'Name of the issuing bank e.g. HDFC Bank' },
        },
        required: ['card_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_web',
      description: 'Search the web for real-time credit card information, benefits, and policies.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query e.g. HDFC Regalia credit card benefits 2025' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_rbi_policy',
      description: 'Check RBI regulations for a specific credit card policy.',
      parameters: {
        type: 'object',
        properties: {
          policy_name: { type: 'string', description: 'Policy to check e.g. zero liability, lounge access' },
        },
        required: ['policy_name'],
      },
    },
  },
];

// ─────────────────────────────────────────────
//  CARD DATABASE
// ─────────────────────────────────────────────

const CARD_DATABASE = {
  'hdfc regalia':   { cardName: 'HDFC Regalia',   bankName: 'HDFC Bank',  annualFee: 2500,  tier: 'Platinum',    policies: { lounge: 'has', travel_ins: 'has', forex: 'has', hotel: 'partial', global_acc: 'has', cashback: 'not', rewards: 'has', milestone: 'has', welcome: 'has', dining: 'has', golf: 'not', concierge: 'has', fuel: 'has', emi: 'has', purchase: 'partial', zero_liab: 'has' }, score: 81 },
  'hdfc regilia':   { cardName: 'HDFC Regalia',   bankName: 'HDFC Bank',  annualFee: 2500,  tier: 'Platinum',    policies: { lounge: 'has', travel_ins: 'has', forex: 'has', hotel: 'partial', global_acc: 'has', cashback: 'not', rewards: 'has', milestone: 'has', welcome: 'has', dining: 'has', golf: 'not', concierge: 'has', fuel: 'has', emi: 'has', purchase: 'partial', zero_liab: 'has' }, score: 81 },
  'axis magnus':    { cardName: 'Axis Magnus',    bankName: 'Axis Bank',  annualFee: 10000, tier: 'World Elite', policies: { lounge: 'has', travel_ins: 'has', forex: 'has', hotel: 'has',     global_acc: 'has', cashback: 'not', rewards: 'has', milestone: 'has', welcome: 'has', dining: 'has', golf: 'has', concierge: 'has', fuel: 'has', emi: 'has', purchase: 'has',     zero_liab: 'has' }, score: 94 },
  'sbi elite':      { cardName: 'SBI Card Elite', bankName: 'SBI Card',   annualFee: 4999,  tier: 'Platinum',    policies: { lounge: 'has', travel_ins: 'has', forex: 'not', hotel: 'partial', global_acc: 'has', cashback: 'not', rewards: 'has', milestone: 'has', welcome: 'has', dining: 'has', golf: 'has', concierge: 'partial', fuel: 'has', emi: 'has', purchase: 'partial', zero_liab: 'has' }, score: 78 },
  'icici sapphiro': { cardName: 'ICICI Sapphiro', bankName: 'ICICI Bank', annualFee: 3500,  tier: 'Platinum',    policies: { lounge: 'partial', travel_ins: 'has', forex: 'not', hotel: 'partial', global_acc: 'has', cashback: 'not', rewards: 'has', milestone: 'partial', welcome: 'has', dining: 'has', golf: 'not', concierge: 'has', fuel: 'has', emi: 'has', purchase: 'partial', zero_liab: 'has' }, score: 68 },
  'hdfc millennia': { cardName: 'HDFC Millennia', bankName: 'HDFC Bank',  annualFee: 1000,  tier: 'Classic',     policies: { lounge: 'not', travel_ins: 'not', forex: 'not', hotel: 'not', global_acc: 'not', cashback: 'has', rewards: 'has', milestone: 'not', welcome: 'partial', dining: 'not', golf: 'not', concierge: 'not', fuel: 'has', emi: 'has', purchase: 'not', zero_liab: 'has' }, score: 37 },
};

// ─────────────────────────────────────────────
//  TOOL EXECUTORS
// ─────────────────────────────────────────────

function fetchCardDetails(cardName) {
  const card = (cardName || '').toLowerCase();
  for (const [key, data] of Object.entries(CARD_DATABASE)) {
    if (card.includes(key) || key.split(' ').every(w => card.includes(w))) {
      return { success: true, found: true, data, source: 'CardLens Database' };
    }
  }
  return { success: true, found: false, message: `No database entry for "${cardName}". Use web search.` };
}

async function realWebSearch(query) {
  if (!TAVILY_API_KEY) {
    return { success: false, error: 'TAVILY_API_KEY not configured' };
  }
  try {
    console.log(`  🌐 Tavily: "${query}"`);
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        max_results: 5,
        include_answer: true,
        include_raw_content: false,
      }),
    });
    if (!response.ok) throw new Error(`Tavily ${response.status}: ${await response.text()}`);
    const data = await response.json();
    return {
      success: true,
      answer: data.answer || '',
      results: (data.results || []).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.content,
        score: r.score,
      })),
    };
  } catch (err) {
    console.error(`  ❌ Tavily error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

function checkRBIPolicy(policyName) {
  const p = (policyName || '').toLowerCase();
  if (p.includes('zero liab') || p.includes('liability')) return { mandate: 'MANDATORY — RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 requires zero liability if fraud reported within 3 working days.' };
  if (p.includes('lounge'))  return { mandate: 'OPTIONAL — No RBI mandate. Premium benefit at bank discretion.' };
  if (p.includes('forex'))   return { mandate: 'OPTIONAL — FEMA allows banks to charge forex markup. Zero forex is a premium waiver.' };
  if (p.includes('emi'))     return { mandate: 'OPTIONAL — EMI facility is discretionary but rates must be disclosed per RBI guidelines.' };
  if (p.includes('travel'))  return { mandate: 'OPTIONAL — Travel insurance is a discretionary premium benefit.' };
  return { mandate: 'OPTIONAL — No specific RBI regulation. Discretionary bank benefit.' };
}

async function executeTool(name, args) {
  console.log(`  🔧 Tool: ${name} | Args: ${JSON.stringify(args)}`);
  switch (name) {
    case 'fetch_card_details': return fetchCardDetails(args.card_name);
    case 'search_web':         return await realWebSearch(args.query);
    case 'check_rbi_policy':   return checkRBIPolicy(args.policy_name);
    default:                   return { error: 'Unknown tool' };
  }
}

// ─────────────────────────────────────────────
//  DATABASE FALLBACK — used when all LLMs fail
// ─────────────────────────────────────────────

function buildFallbackResult(cardName, bank, tier, fee, features) {
  const dbResult = fetchCardDetails(cardName || '');

  if (dbResult.found) {
    const d = dbResult.data;
    return {
      cardName: d.cardName,
      bankName: d.bankName,
      score: d.score,
      summary: `${d.cardName} is a ${d.tier} card by ${d.bankName} with an annual fee of ₹${d.annualFee}. It includes key travel benefits like lounge access and forex waiver, along with a strong rewards programme. Data served from the CardLens local database.`,
      dataSource: 'CardLens Database (offline fallback)',
      policies: d.policies,
      agentSteps: [`Database lookup: found ${d.cardName}`],
      isAgentResult: false,
    };
  }

  // Generic tier-based estimate when card is unknown
  const annualFee = parseInt(fee) || 0;
  const tierLower = (tier || '').toLowerCase();
  const isElite  = tierLower.includes('world') || tierLower.includes('elite') || tierLower.includes('infinite') || annualFee >= 10000;
  const isPremium = tierLower.includes('platinum') || tierLower.includes('gold') || annualFee >= 2000;
  const featStr  = (features || '').toLowerCase();

  const p = {
    lounge:     isElite ? 'has' : isPremium ? 'partial' : 'not',
    travel_ins: isElite ? 'has' : isPremium ? 'partial' : 'not',
    forex:      isElite ? 'has' : 'not',
    hotel:      isElite ? 'has' : isPremium ? 'partial' : 'not',
    global_acc: isElite ? 'has' : isPremium ? 'partial' : 'not',
    cashback:   featStr.includes('cashback') ? 'has' : 'not',
    rewards:    isPremium || isElite ? 'has' : 'partial',
    milestone:  isElite ? 'has' : isPremium ? 'partial' : 'not',
    welcome:    isPremium || isElite ? 'has' : 'not',
    dining:     isElite ? 'has' : isPremium ? 'partial' : 'not',
    golf:       isElite ? 'has' : 'not',
    concierge:  isElite ? 'has' : isPremium ? 'partial' : 'not',
    fuel:       'has',
    emi:        'has',
    purchase:   isPremium || isElite ? 'partial' : 'not',
    zero_liab:  'has',
  };

  const hasCount     = Object.values(p).filter(v => v === 'has').length;
  const partialCount = Object.values(p).filter(v => v === 'partial').length;
  const estimatedScore = Math.round((hasCount + partialCount * 0.5) / 16 * 100);

  return {
    cardName: cardName || 'Unknown Card',
    bankName: bank || 'Unknown Bank',
    score: estimatedScore,
    summary: `${cardName || 'This card'} from ${bank || 'your bank'} appears to be a ${tier || 'standard'} tier card. Results are estimated from card tier and fee since live AI analysis is temporarily unavailable. Please try again shortly for accurate data.`,
    dataSource: 'Tier-based estimate (AI offline)',
    policies: p,
    agentSteps: ['Database lookup: not found', 'Tier-based estimate applied'],
    isAgentResult: false,
  };
}

// ─────────────────────────────────────────────
//  OPENROUTER API CALL (with model fallback)
// ─────────────────────────────────────────────

async function callOpenRouter(messages) {
  for (let i = 0; i < FREE_MODELS.length; i++) {
    const model = FREE_MODELS[i];
    console.log(`  📡 Trying: ${model}`);

    let response;
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'CardLens',
        },
        body: JSON.stringify({
          model,
          max_tokens: 4000,
          messages,
          tools: TOOLS,
          tool_choice: 'auto',
        }),
      });
    } catch (networkErr) {
      console.warn(`  ⚠️  ${model} network error: ${networkErr.message}, trying next...`);
      continue;
    }

    if (response.status === 429) { console.warn(`  ⚠️  ${model} rate limited, trying next...`); continue; }
    if (!response.ok) {
      const t = await response.text();
      console.warn(`  ⚠️  ${model} HTTP ${response.status}: ${t.slice(0, 120)}, trying next...`);
      continue;
    }

    const data = await response.json();
    if (data.error) { console.warn(`  ⚠️  ${model} error: ${data.error.message}, trying next...`); continue; }

    const finish = data.choices?.[0]?.finish_reason;
    if (finish === 'terminated') {
      console.warn(`  ⚠️  ${model} terminated (no tool support), trying next...`);
      continue;
    }

    console.log(`  ✅ Model: ${model}`);
    return data;
  }

  // All models exhausted — signal caller to use fallback
  return null;
}

// ─────────────────────────────────────────────
//  SYSTEM PROMPT
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are CardLens AI — an expert credit card policy analyst with access to real-time web search.

ALWAYS follow these steps in order:
1. Call fetch_card_details with the card name
2. Call search_web with "<card name> credit card benefits features 2025"
3. Call search_web again with "<card name> <bank name> lounge forex golf insurance annual fee"
4. Call check_rbi_policy with "zero liability"
5. Using ALL gathered data (database + real web results), return ONLY this JSON (no markdown, no backticks, no extra text):

{
  "cardName": "exact card name",
  "bankName": "bank name",
  "score": <0-100 based on how many of the 16 policies the card has. has=full points, partial=half>,
  "summary": "3-4 sentences based on real web search data. Be specific about actual benefits, limits, and fees found.",
  "dataSource": "CardLens Database + Tavily Web Search",
  "policies": {
    "lounge": "has|partial|not",
    "travel_ins": "has|partial|not",
    "forex": "has|partial|not",
    "hotel": "has|partial|not",
    "global_acc": "has|partial|not",
    "cashback": "has|partial|not",
    "rewards": "has|partial|not",
    "milestone": "has|partial|not",
    "welcome": "has|partial|not",
    "dining": "has|partial|not",
    "golf": "has|partial|not",
    "concierge": "has|partial|not",
    "fuel": "has|partial|not",
    "emi": "has|partial|not",
    "purchase": "has|partial|not",
    "zero_liab": "has|partial|not"
  }
}`;

// ─────────────────────────────────────────────
//  AGENTIC LOOP
// ─────────────────────────────────────────────

async function runAgentLoop(userMessage, agentSteps) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  let iteration = 0;

  while (iteration < 10) {
    iteration++;
    console.log(`\n  🤖 Iteration ${iteration}`);

    const data = await callOpenRouter(messages);

    // null means all models exhausted — bubble up to API route
    if (data === null) return null;

    const choice = data.choices[0];
    const message = choice.message;

    const assistantMsg = { role: 'assistant', content: message.content || null };
    if (message.tool_calls?.length) assistantMsg.tool_calls = message.tool_calls;
    messages.push(assistantMsg);

    // No tool calls → final answer
    if (!message.tool_calls || message.tool_calls.length === 0) {
      const content = (message.content || '').trim();
      if (!content) throw new Error('Agent returned empty response');
      console.log('\n✅ Agent done.');
      return { finalAnswer: content, steps: agentSteps };
    }

    // Execute tools and feed results back
    for (const toolCall of message.tool_calls) {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || '{}');
      agentSteps.push(`${name}(${JSON.stringify(args)})`);
      const result = await executeTool(name, args);
      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }

  throw new Error('Agent exceeded maximum iterations');
}

// ─────────────────────────────────────────────
//  API ROUTE
// ─────────────────────────────────────────────

app.post('/api/analyze', async (req, res) => {
  const { bank, cardName, tier, fee, network, features } = req.body;

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`🚀 Analyzing: ${cardName} | ${bank}`);
  console.log(`${'═'.repeat(50)}`);

  if (!OPENROUTER_API_KEY) {
    console.warn('⚠️  No API key — serving database/estimate fallback');
    const fallback = buildFallbackResult(cardName, bank, tier, fee, features);
    return res.json({ success: true, result: fallback });
  }

  const agentSteps = [`Started: ${cardName} by ${bank}`];

  try {
    const userMessage = `Analyze this credit card:
Card Name: ${cardName || 'Unknown'}
Bank: ${bank || 'Unknown'}
Tier: ${tier || 'Unknown'}
Annual Fee: ${fee ? `Rs.${fee}` : 'Unknown'}
Network: ${network || 'Unknown'}
Features mentioned: ${features || 'None'}

Follow the steps: fetch details → search web (twice) → check RBI policy → return final JSON only.`;

    const agentResult = await runAgentLoop(userMessage, agentSteps);

    // agentResult === null means all LLMs were rate-limited/unavailable
    if (agentResult === null) {
      console.warn('⚠️  All models unavailable — serving database/estimate fallback');
      const fallback = buildFallbackResult(cardName, bank, tier, fee, features);
      return res.json({ success: true, result: fallback });
    }

    const { finalAnswer, steps } = agentResult;

    const cleaned = finalAnswer
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    parsed.agentSteps = steps;
    parsed.isAgentResult = true;

    console.log(`✅ Score: ${parsed.score}`);
    res.json({ success: true, result: parsed });

  } catch (err) {
    console.error('❌ Error:', err.message);
    // On any parse/agent error, still serve a graceful fallback
    const fallback = buildFallbackResult(cardName, bank, tier, fee, features);
    fallback.agentSteps.push(`Error: ${err.message}`);
    res.json({ success: true, result: fallback });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`\n💳 CardLens → http://localhost:${PORT}`);
  console.log(`🤖 Models : ${FREE_MODELS[0]} + ${FREE_MODELS.length - 1} fallbacks (tool-calling)`);

  console.log(`🛠️  Tools  : fetch_card_details | search_web (Tavily) | check_rbi_policy`);
  console.log(`\n✅ Server running. Press Ctrl+C to stop.\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} already in use. Try: PORT=3001 node server.js`);
  } else {
    console.error('❌ Server error:', err.message);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});

setInterval(() => {}, 1 << 30);
