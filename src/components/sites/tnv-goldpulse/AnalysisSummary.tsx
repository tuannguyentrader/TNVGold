"use client";

import { PulseGauge } from "./PulseGauge";
import { useLanguage } from "@/lib/language-context";
import { useLivePulse } from "@/lib/live-pulse-context";

export function AnalysisSummary() {
  const { language, t } = useLanguage();
  const { pulse } = useLivePulse();

  const scrollToTechnical = () => {
    const el =
      document.getElementById("technical-grid") ||
      document.querySelector(".qx-tech-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const gaugeValue = pulse.score * 10; // 0-100 for gauge
  const gaugeColor = gaugeValue >= 60 ? "#61e294" : gaugeValue >= 40 ? "#f5c542" : "#ff8383";

  // Generate live analysis text dynamically based on pulse data
  const genAnalysis = (): string => {
    if (pulse.analysisText?.[language]) return pulse.analysisText[language]!;

    // Dynamic fallback
    const biasLabel = pulse.bias === "NEUTRAL" ? (language === "vi" ? "TRUNG LẬP" : "NEUTRAL") : pulse.bias;
    const gainText = pulse.bias === "NEUTRAL" ? "" : pulse.entry.gain >= 0
      ? `+$${pulse.entry.gain.toFixed(2)}`
      : `-$${Math.abs(pulse.entry.gain).toFixed(2)}`;
    const direction =
      pulse.bias === "LONG" ? (language === "vi" ? "tăng" : "bullish") :
      pulse.bias === "SHORT" ? (language === "vi" ? "giảm" : "bearish") :
      (language === "vi" ? "đi ngang" : "sideways");

    if (language === "vi") {
      if (pulse.bias === "NEUTRAL") {
        return `Vàng đang ở trạng thái đi ngang với điểm Score ${pulse.score}/10. Giá hiện tại $${pulse.price.toFixed(2)} trong biên độ $${pulse.entry.low.toFixed(2)} – $${pulse.entry.high.toFixed(2)}. Không có tín hiệu breakout rõ ràng. Chờ đợt phá vỡ biên độ để xác nhận xu hướng.`;
      }
      return `Vàng đang thể hiện đà ${direction} với Score ${pulse.score}/10. Giá $${pulse.price.toFixed(2)} ${gainText} so với mức vào lệnh. Khung H1/M30 cho thấy cấu trúc ${direction} đồng thuận. Theo dõi: tiếp diễn vượt $${pulse.entry.high.toFixed(2)} hoặc điều chỉnh về $${pulse.exit.toFixed(2)}.`;
    }

    if (pulse.bias === "NEUTRAL") {
      return `Gold is moving sideways with Score ${pulse.score}/10. Price at $${pulse.price.toFixed(2)} within a range of $${pulse.entry.low.toFixed(2)} – $${pulse.entry.high.toFixed(2)}. No clear breakout signal. Wait for a range breakout to confirm direction.`;
    }
    return `Gold is showing ${direction} momentum with Score ${pulse.score}/10. Price $${pulse.price.toFixed(2)} is ${gainText} from entry. Higher timeframe structure (H1/M30) provides clean directional alignment. Watch for: continuation above $${pulse.entry.high.toFixed(2)} or a pullback toward $${pulse.exit.toFixed(2)} support.`;
  };

  const analysisText = genAnalysis();

  return (
    <aside className="flex flex-col justify-between h-full p-3.5 bg-[#080c14] rounded-xl border border-white/5 shadow-inner">
      {/* 1. Top Header: TNV ANALYSIS */}
      <div className="pb-1">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#f5c542]">
            {t.analysisTitle}
          </span>
          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded bg-[#18392b] text-[#61e294] border border-[#61e294]/30 uppercase">
            {t.liveSignalBadge}
          </span>
        </div>
        {/* Yellow Separator Line */}
        <div className="w-full h-[1.5px] bg-[#f5c542]/70" />
      </div>

      {/* 2. Centered Middle Section: Radial Score Gauge + Narrative Description */}
      <div className="flex flex-col items-center justify-center text-center my-auto py-1 flex-1 gap-2">
        {/* Radial Score Gauge (Scaled 104px) */}
        <div className="transform transition-transform hover:scale-105 duration-200">
          <PulseGauge
            value={gaugeValue}
            bandLabel="PULSE"
            note={`Pulse ${gaugeValue} | RSI: ${pulse.indicators.rsi.toFixed(1)} | HTF:${pulse.htf}`}
            color={gaugeColor}
          />
        </div>

        {/* Narrative Description */}
        <p className="text-[0.74rem] text-gray-200 leading-snug font-normal max-w-[98%] text-center m-0">
          {analysisText}
        </p>

        {/* Link to Technical Grid */}
        <div className="flex flex-col items-center justify-center pt-0.5 text-center">
          <button
            onClick={scrollToTechnical}
            className="text-[0.68rem] text-gray-400 hover:text-[#f5c542] transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            {t.viewTechnical}
          </button>
        </div>
      </div>
    </aside>
  );
}
