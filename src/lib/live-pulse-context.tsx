"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PulseSnapshot } from "./pulse-store";

interface LivePulseContextType {
  pulse: PulseSnapshot;
  history: PulseSnapshot[];
  isLiveConnected: boolean;
  lastUpdated: string;
}

const defaultSnapshot: PulseSnapshot = {
  symbol: "XAUUSD",
  time: "12:20:00",
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

const LivePulseContext = createContext<LivePulseContextType>({
  pulse: defaultSnapshot,
  history: [defaultSnapshot],
  isLiveConnected: false,
  lastUpdated: "Just now",
});

export function LivePulseProvider({ children }: { children: ReactNode }) {
  const [pulse, setPulse] = useState<PulseSnapshot>(defaultSnapshot);
  const [history, setHistory] = useState<PulseSnapshot[]>([defaultSnapshot]);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  const fetchLivePulse = async () => {
    try {
      const res = await fetch("/api/pulse", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPulse(json.data);
          if (Array.isArray(json.history) && json.history.length > 0) {
            setHistory(json.history);
          }
          setIsLiveConnected(true);
          setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour12: false }));
        }
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchLivePulse();
    const interval = setInterval(fetchLivePulse, 5000); // 5s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <LivePulseContext.Provider value={{ pulse, history, isLiveConnected, lastUpdated }}>
      {children}
    </LivePulseContext.Provider>
  );
}

export function useLivePulse() {
  return useContext(LivePulseContext);
}
