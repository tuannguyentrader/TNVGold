import { TNVGoldPulseApp } from "@/components/sites/tnv-goldpulse";
import { getLatestPulse, getPulseHistory } from "@/lib/pulse-store";

export default function TNVGoldPulsePage() {
  const initialPulse = getLatestPulse();
  const initialHistory = getPulseHistory();

  return <TNVGoldPulseApp initialPulse={initialPulse} initialHistory={initialHistory} />;
}