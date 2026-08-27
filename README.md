# 🏆 TNV Gold — Quantitative Market Pulse & Signal Analytics

Institutional-grade real-time gold (XAUUSD) analytics dashboard and algorithmic market flow tracker.

---

## ⚡ Key Features

- **Live Market Pulse & Indicator System**: Real-time evaluation of quantitative breakout momentum (BIAS, Quality Score, Volatility, Entry, Exit, HTF Filters).
- **Session Flow™**: Interactive vector tracking of Asian, European, and US market liquidity and session transitions.
- **TradingView Live Integration**: Real-time institutional candlestick feeds directly embedded with zero latency.
- **MT5 Direct WebBridge**: Seamless webhook ingestion pipeline streaming live metrics from MetaTrader 5 into the web dashboard.
- **Bilingual Interface**: Full support for English and Vietnamese with automatic persistence.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4 + Custom Dark Theme
- **Icons**: Lucide React
- **Deployment**: Vercel Cloud Serverless

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run full code validation (lint + typecheck + build)
npm run check
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 📡 MT5 Bridge Integration

To connect your MetaTrader 5 terminal:
1. Open MT5 $\rightarrow$ `Tools` $\rightarrow$ `Options` $\rightarrow$ `Expert Advisors`.
2. Check `Allow WebRequest for listed URL` and add your Vercel deployment URL.
3. Attach `docs/TNV_WebBridge.mq5` to your XAUUSD M5 chart and configure your Web URL and Secret Token.

---

## 📄 License

Proprietary © 2026 TNV Gold. All rights reserved.
