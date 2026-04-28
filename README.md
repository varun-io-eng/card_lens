# 💳 CardLens — AI Credit Card Policy Analyzer

A professional, production-grade React application that analyzes credit card policies and benefits using Claude AI. Upload your card image or enter details manually to instantly see which benefits your card includes, which are conditional, and which are missing.

---

## 📸 Preview

> Enter your card details or upload a card image → Click Analyze → Get a full policy breakdown with score, radar chart, and AI insight.

---

## ✨ Features

- 🃏 **Live 3D Card Preview** — Interactive card that tilts on mouse movement with 5 color themes
- 📁 **Image Upload** — Drag & drop your card image, Claude reads it directly
- 🤖 **Claude AI Analysis** — Real AI-powered policy detection based on actual card knowledge
- 📊 **Radar Chart** — Visual coverage breakdown across Travel, Rewards, Lifestyle, Everyday, Security
- 🎯 **Score Ring** — Animated 0–100 coverage score
- ✅ **16 Policy Categories** — Color coded as Included / Partial / Not Included
- 🔍 **Filter & Tab System** — Filter by status and category
- 💡 **AI Insight** — Natural language summary of your card's value proposition
- 🔒 **Secure Backend Proxy** — API key never exposed to the browser

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **React 18** + **Vite** | Component architecture, fast builds |
| Animations | **Framer Motion** | 3D card tilt, transitions, staggered lists |
| Charts | **Recharts** | Radar chart for category coverage |
| File Upload | **react-dropzone** | Drag & drop with animated states |
| Icons | **lucide-react** | Clean SVG icons |
| Notifications | **react-hot-toast** | Toast messages |
| Backend | **Express.js** | Secure API proxy server |
| AI | **Claude API** (Anthropic) | Policy analysis from card details or image |

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
├── server.js                   # Express backend proxy
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
- Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

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

Rename `.env.example` to `.env` and add your API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
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

To run the frontend in dev mode with hot reload:
```bash
npm run dev
```
> Note: In dev mode the API calls go directly to Anthropic (may hit CORS). Use the Express server for reliable API calls.

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `PORT` | Server port (default: 3000) |

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

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

## 🧠 How It Works

1. **You enter** card details (bank, tier, fee, network, features) or upload a card image
2. **The frontend** sends the data to `/api/analyze` on the Express server
3. **The server** forwards the request to Claude AI with a structured prompt
4. **Claude AI** analyzes the card based on its knowledge of real card products and returns a JSON with policy statuses
5. **The frontend** renders the results — score ring, radar chart, and color-coded policy list

### Fallback (No API Key)
If no API key is configured, the app falls back to a rule-based estimate using card tier and annual fee. Results are approximate and change on every analysis.

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
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
node server.js   # Start Express server
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
