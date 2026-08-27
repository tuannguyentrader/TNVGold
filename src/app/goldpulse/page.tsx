import { TNVGoldPulseApp } from "@/components/sites/tnv-goldpulse";
import type { Metadata } from "next";
import type { PulseSnapshot } from "@/lib/pulse-store";

export const metadata: Metadata = {
  title: "TNV Gold Pulse — Real-Time Algorithmic Market Analytics",
  description:
    "TNV provides real-time algorithmic market analytics, multi-timeframe bias conviction, Gold Session Flow visualization, and institutional order flow metrics for XAUUSD traders.",
};

export const dynamic = "force-dynamic";

async function fetchInitialData() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://127.0.0.1:3000";
    const res = await fetch(`${baseUrl}/api/pulse`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return {
        initialPulse: json.data as PulseSnapshot,
        initialHistory: (json.history || [json.data]) as PulseSnapshot[],
      };
    }
  } catch {
    // fallback: không có dữ liệu, client tự fetch
  }
  return { initialPulse: undefined, initialHistory: undefined };
}

export default async function GoldPulseRoute() {
  const { initialPulse, initialHistory } = await fetchInitialData();
  return <TNVGoldPulseApp initialPulse={initialPulse} initialHistory={initialHistory} />;
}
