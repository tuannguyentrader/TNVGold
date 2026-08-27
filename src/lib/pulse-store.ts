export interface MultiTfData {
  bias: "LONG" | "SHORT" | "IN-CHANNEL";
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
  bias: "LONG" | "SHORT" | "IN-CHANNEL";
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

// Initial default state matching current calibrated data
let currentSnapshot: PulseSnapshot = {
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

let historySnapshots: PulseSnapshot[] = [currentSnapshot];

export function getLatestPulse(): PulseSnapshot {
  return currentSnapshot;
}

export function getPulseHistory(): PulseSnapshot[] {
  return historySnapshots.slice(0, 10);
}

export function updatePulse(newSnapshot: PulseSnapshot): void {
  currentSnapshot = {
    ...newSnapshot,
    time: newSnapshot.time || new Date().toLocaleTimeString("en-GB", { hour12: false }),
  };

  // Add to history (limit 15 records)
  historySnapshots.unshift(currentSnapshot);
  if (historySnapshots.length > 15) {
    historySnapshots = historySnapshots.slice(0, 15);
  }
}
