import { kv } from "@vercel/kv";

export interface MultiTfData {
  bias: "LONG" | "SHORT" | "NEUTRAL";
  score: number;
  high: number;
  low: number;
  exit: number;
  htf: string;
}

export interface TechnicalIndicators {
  rsi: number;
  atr: number;
  emaGap: number;
  adx: number;
  vwap: number;
  spread: number;
}

export interface PulseSnapshot {
  symbol: string;
  time: string;
  price: number;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  score: number;
  volatility: number;
  entry: {
    high: number;
    low: number;
    gain: number;
  };
  exit: number;
  htf: string;
  multiTf: {
    m15: MultiTfData;
    m30: MultiTfData;
    h1: MultiTfData;
  };
  indicators: TechnicalIndicators;
  analysisText?: {
    en: string;
    vi: string;
  };
}

const KV_KEY_PULSE = "tnv:current_pulse";
const KV_KEY_HISTORY = "tnv:pulse_history";

// Initial default state
const defaultSnapshot: PulseSnapshot = {
  symbol: "XAUUSD",
  time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
  price: 2898.50,
  bias: "LONG",
  score: 8,
  volatility: 4.20,
  entry: {
    high: 2896.40,
    low: 2884.20,
    gain: 2.10,
  },
  exit: 2891.20,
  htf: "Not Against",
  multiTf: {
    m15: { bias: "LONG", score: 8, high: 2894.00, low: 2872.00, exit: 2886.50, htf: "Bullish" },
    m30: { bias: "LONG", score: 7, high: 2890.50, low: 2865.00, exit: 2880.00, htf: "Bullish" },
    h1:  { bias: "LONG", score: 9, high: 2888.00, low: 2850.00, exit: 2872.00, htf: "Pass" },
  },
  indicators: {
    rsi: 64.2,
    atr: 12.80,
    emaGap: 4.50,
    adx: 32.4,
    vwap: 6.20,
    spread: 1.2,
  },
};

// Fallback in-memory cache for when KV is not available (local dev)
let localCache: PulseSnapshot | null = null;
let localHistoryCache: PulseSnapshot[] | null = null;

export async function getLatestPulse(): Promise<PulseSnapshot> {
  try {
    if (!process.env.KV_URL) return localCache || defaultSnapshot;
    const data = await kv.get<PulseSnapshot>(KV_KEY_PULSE);
    if (data) {
      localCache = data;
      return data;
    }
  } catch {
    // fallback
  }
  return localCache || defaultSnapshot;
}

export async function getPulseHistory(): Promise<PulseSnapshot[]> {
  try {
    if (!process.env.KV_URL) return localHistoryCache || [];
    const data = await kv.get<PulseSnapshot[]>(KV_KEY_HISTORY);
    if (data && Array.isArray(data)) {
      localHistoryCache = data;
      return data.slice(0, 10);
    }
  } catch {
    // fallback
  }
  return localHistoryCache?.slice(0, 10) || [];
}

export async function updatePulse(newSnapshot: PulseSnapshot): Promise<void> {
  const snapshot: PulseSnapshot = {
    ...newSnapshot,
    time: newSnapshot.time || new Date().toLocaleTimeString("en-GB", { hour12: false }),
  };

  localCache = snapshot;

  try {
    if (process.env.KV_URL) {
      // Save current pulse
      await kv.set(KV_KEY_PULSE, snapshot);

      // Update history
      const history = (await kv.get<PulseSnapshot[]>(KV_KEY_HISTORY)) || [];
      history.unshift(snapshot);
      const trimmed = history.slice(0, 15);
      localHistoryCache = trimmed;
      await kv.set(KV_KEY_HISTORY, trimmed);
    } else {
      // Local fallback
      if (!localHistoryCache) localHistoryCache = [];
      localHistoryCache.unshift(snapshot);
      if (localHistoryCache.length > 15) {
        localHistoryCache = localHistoryCache.slice(0, 15);
      }
    }
  } catch {
    // ignore
  }
}
