import { Redis } from "@upstash/redis";

// Hỗ trợ cả Vercel KV env và Upstash Redis env
const redisUrl =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

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

// Initial neutral state (no demo data)
const defaultSnapshot: PulseSnapshot = {
  symbol: "XAUUSD",
  time: "—",
  price: 0,
  bias: "NEUTRAL",
  score: 0,
  volatility: 0,
  entry: {
    high: 0,
    low: 0,
    gain: 0,
  },
  exit: 0,
  htf: "—",
  multiTf: {
    m15: { bias: "NEUTRAL", score: 0, high: 0, low: 0, exit: 0, htf: "—" },
    m30: { bias: "NEUTRAL", score: 0, high: 0, low: 0, exit: 0, htf: "—" },
    h1:  { bias: "NEUTRAL", score: 0, high: 0, low: 0, exit: 0, htf: "—" },
  },
  indicators: {
    rsi: 0,
    atr: 0,
    emaGap: 0,
    adx: 0,
    vwap: 0,
    spread: 0,
  },
};

// Fallback in-memory cache for when KV is not available (local dev)
let localCache: PulseSnapshot | null = null;
let localHistoryCache: PulseSnapshot[] | null = null;

export async function getLatestPulse(): Promise<PulseSnapshot> {
  try {
    if (!redis) return localCache || defaultSnapshot;
    const data = await redis.get<PulseSnapshot>(KV_KEY_PULSE);
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
    if (!redis) return localHistoryCache || [];
    const data = await redis.get<PulseSnapshot[]>(KV_KEY_HISTORY);
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
    if (redis) {
      // Save current pulse
      await redis.set(KV_KEY_PULSE, snapshot);

      // Update history
      const history = (await redis.get<PulseSnapshot[]>(KV_KEY_HISTORY)) || [];
      history.unshift(snapshot);
      const trimmed = history.slice(0, 15);
      localHistoryCache = trimmed;
      await redis.set(KV_KEY_HISTORY, trimmed);
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
