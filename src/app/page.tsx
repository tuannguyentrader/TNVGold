import { TNVGoldPulseApp } from "@/components/sites/tnv-goldpulse";
import type { PulseSnapshot } from "@/lib/pulse-store";

// Force fetch từ server API mỗi lần request
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

export default async function TNVGoldPulsePage() {
  const { initialPulse, initialHistory } = await fetchInitialData();
  return <TNVGoldPulseApp initialPulse={initialPulse} initialHistory={initialHistory} />;
}