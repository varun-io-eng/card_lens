# 💳 CardLens — AI Credit Card Policy Analyzer

A professional, production-grade React application that analyzes credit card policies and benefits using an **agentic AI backend**. Enter your card details and the AI agent autonomously searches databases, runs live web searches, and checks RBI regulations to give you a full policy breakdown with score, radar chart, and summary.

---

## 📸 Preview

> Enter your card details → Click Analyze → The AI agent runs its tool loop → Get a full policy breakdown with score, radar chart, and AI insight.

---

## ✨ Features

- 🃏 **Live 3D Card Preview** — Interactive card that tilts on mouse movement with 5 color themes
- 🤖 **Agentic AI Analysis** — Multi-step AI agent with tool-calling (database lookup + live web search + RBI policy check)
- 🌐 **Real-Time Web Search** — Tavily integration for up-to-date card benefit information
- 📊 **Radar Chart** — Visual coverage breakdown across Travel, Rewards, Lifestyle, Everyday, Security
- 🎯 **Score Ring** — Animated 0–100 coverage score
- ✅ **16 Policy Categories** — Color coded as Included / Partial / Not Included
- 🔍 **Filter & Tab System** — Filter by status and category
- 💡 **AI Summary** — Natural language summary of your card's value proposition
- 🔄 **Model Fallback Chain** — Automatically tries multiple free LLMs via OpenRouter if one fails
- 📦 **In-Memory Cache** — Repeated lookups for the same card are served instantly
- 🛡️ **Graceful Fallback** — Local database + tier-based estimate when AI is unavailable

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **React 19** + **Vite** | Component architecture, fast builds |
| Animations | **Framer Motion** | 3D card tilt, transitions, staggered lists |
| Charts | **Recharts** | Radar chart for category coverage |
| Icons | **lucide-react** | Clean SVG icons |
| Notifications | **react-hot-toast** | Toast messages |
| Backend | **Express.js** | Agentic loop server + secure API proxy |
| AI Router | **OpenRouter** | Routes requests to free LLMs (Gemini, Llama, Qwen) |
| Web Search | **Tavily** | Real-time credit card benefit lookups |

---

## 📁 Project Structure

```
cardlens-react/
├── src/
│   ├── components/
│   │   ├── CreditCard.jsx      # 3D tilt card with mouse tracking
│   │   ├── DropZone.jsx        # Animated drag & drop uploader
│   │   ├── PolicyItem.jsx      # Individual policy row with animation
│   │   ├── PolicyChart.jsx     # Recharts radar chart
│   │   └── ScoreRing.jsx       # Animated SVG score ring
│   ├── hooks/
│   │   └── useAnalyze.js       # API call logic + demo fallback
│   ├── data/
│   │   └── policies.js         # Policy definitions, banks, tiers
│   ├── App.jsx                 # Main layout and state management
│   └── main.jsx                # React entry point
├── server.js                   # Express backend — agentic loop, tools, fallback
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
└── package.json                # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm
- OpenRouter API key from [openrouter.ai](https://openrouter.ai) (free tier available)
- Tavily API key from [tavily.com](https://tavily.com) (optional — enables live web search)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/cardlens-react.git
cd cardlens-react
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Rename `.env.example` to `.env` and fill in your keys:
```
OPENROUTER_API_KEY=your-openrouter-key-here
TAVILY_API_KEY=your-tavily-key-here   # Optional — enables real web search
PORT=3000
```

**4. Build the React app**
```bash
npm run build
```

**5. Start the server**
```bash
node server.js
```

**6. Open in browser**
```
http://localhost:3000
```

---

## 💻 Development Mode

To run the frontend with hot reload:
```bash
npm run dev
```
> Note: In dev mode, API calls go to the Vite dev server. Run `node server.js` separately for the agentic backend.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | Routes requests to free LLMs (Gemini, Llama, Qwen) |
| `TAVILY_API_KEY` | ⚡ Optional | Enables real-time web search for card benefits |
| `PORT` | ⚡ Optional | Server port (default: 3000) |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🤖 How the Agentic Loop Works

CardLens does not make a single AI call — it runs a **multi-step agent** that autonomously decides which tools to use and loops until it has a complete answer.

```
User submits card details
        ↓
Agent Turn 1 — calls TWO tools simultaneously:
  • fetch_card_details  →  checks local CardLens database
  • check_rbi_policy    →  looks up RBI mandate for zero liability
        ↓
Agent Turn 2 — calls one tool:
  • search_web          →  live Tavily search for real card benefits
        ↓
Agent Turn 3 — synthesizes all results, returns final JSON
        ↓
Server parses JSON, caches result, sends to frontend
        ↓
Frontend renders score ring, radar chart, policy list
```

The loop runs up to **10 iterations** and supports **parallel tool calls** in a single turn. If the LLM returns empty content, the server extracts the answer from `reasoning_details` as a fallback.

---

## 🔄 Model Fallback Chain

If a model is rate-limited or unavailable, the server automatically tries the next one:

```
openrouter/free
  → google/gemini-2.0-flash-lite-preview-02-05:free
  → google/gemini-2.0-pro-exp-02-05:free
  → meta-llama/llama-3.1-8b-instruct:free
  → qwen/qwen-2.5-72b-instruct:free
```

A 2-second delay is applied between retries on rate-limit (HTTP 429) responses.

---

## 🛡️ Fallback Modes

When AI is unavailable, CardLens degrades gracefully:

| Situation | Behaviour |
|-----------|-----------|
| Card found in local DB | Returns stored policy data with note |
| Card not in DB | Estimates from tier + annual fee |
| All LLMs rate-limited | Same DB/estimate fallback applies |

---

## 📋 Policies Analyzed

| # | Policy | Category |
|---|--------|----------|
| 1 | Airport Lounge Access | Travel |
| 2 | Travel Insurance | Travel |
| 3 | Zero Forex Markup | Travel |
| 4 | Hotel & Stay Benefits | Travel |
| 5 | Global Emergency Assistance | Travel |
| 6 | Cashback Rewards | Rewards |
| 7 | Reward Points Program | Rewards |
| 8 | Milestone Bonuses | Rewards |
| 9 | Welcome / Joining Bonus | Rewards |
| 10 | Dining Privileges | Lifestyle |
| 11 | Golf Privileges | Lifestyle |
| 12 | 24/7 Concierge Service | Lifestyle |
| 13 | Fuel Surcharge Waiver | Everyday |
| 14 | EMI / Instalment Plans | Everyday |
| 15 | Purchase Protection | Security |
| 16 | Zero Liability Protection | Security |

---

## 🗃️ Built-in Card Database

The following cards are pre-loaded for instant offline lookups:

| Card | Bank | Tier | Annual Fee | Score |
|------|------|------|-----------|-------|
| HDFC Regalia | HDFC Bank | Platinum | ₹2,500 | 81 |
| Axis Magnus | Axis Bank | World Elite | ₹10,000 | 94 |
| SBI Card Elite | SBI Card | Platinum | ₹4,999 | 78 |
| ICICI Sapphiro | ICICI Bank | Platinum | ₹3,500 | 68 |
| HDFC Millennia | HDFC Bank | Classic | ₹1,000 | 37 |

Cards not in the database are analyzed live by the AI agent via web search.

---

## 🧪 Sample Input to Test

| Field | Value |
|-------|-------|
| Card Name | HDFC Regalia |
| Bank | HDFC Bank |
| Tier | Platinum |
| Annual Fee | 2500 |
| Network | Visa |
| Features | lounge access, travel insurance, reward points |

---

## 📦 Scripts

```bash
npm run dev      # Start Vite dev server (frontend only)
npm run build    # Build for production
npm run preview  # Preview production build
node server.js   # Start Express server with agentic backend
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
