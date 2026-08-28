"use client";

import { MetricCard } from "./MetricCard";
import { FlipBackContent } from "./FlipBackContent";
import { ConfidenceBar } from "./ConfidenceBar";
import { TrendingUp, TrendingDown, Minus, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useLivePulse } from "@/lib/live-pulse-context";

export function LiveMetricsGrid() {
  const { t } = useLanguage();
  const { pulse } = useLivePulse();

  const isLong = pulse.bias === "LONG";
  const isShort = pulse.bias === "SHORT";
  const isNeutral = pulse.bias === "NEUTRAL";

  // NEUTRAL không mang ý nghĩa tín hiệu: đưa score về 0 khi hiển thị để tránh
  // mâu thuẫn "NEUTRAL + score cao" (Pulse/ConfidenceBar luôn nhất quán với BIAS).
  const pulseScore = isNeutral ? 0 : pulse.score;

  // Mặt sau các thẻ TẠM hiển thị M15/M30/H1 = 0 (placeholder — người dùng chưa có ý tưởng, sẽ cập nhật sau).
  const tfPlaceholderRows = [
    { tf: "M15", value: "0" },
    { tf: "M30", value: "0" },
    { tf: "H1", value: "0" },
  ];

  // Badge EXIT: EXIT NOW (đỏ, khi có tín hiệu thoát) > HOLD (xanh, khi có bias LONG/SHORT) > WAIT (xám, NEUTRAL).
  const isExitNow = pulse.exitSignal === true;
  const exitBadge = isExitNow
    ? { text: "EXIT NOW", cls: "bg-[rgba(255,131,131,0.16)] text-[#ff8383] border-[rgba(255,131,131,0.4)]" }
    : isLong || isShort
    ? { text: "HOLD", cls: "bg-[rgba(97,226,148,0.14)] text-[#61e294] border-[rgba(97,226,148,0.4)]" }
    : { text: "WAIT", cls: "bg-white/10 text-gray-400 border-white/15" };

  return (
    <div className="grid grid-cols-2 grid-rows-[148px_148px_148px] gap-2.5 w-full h-full">
      {/* 1. BIAS */}
      <MetricCard
        label={t.biasLabel}
        tooltip={t.biasTooltip}
        footer={
          <div className="text-[0.68rem] text-gray-400">
            {t.biasFooter}
          </div>
        }
        flipBack={
          <FlipBackContent label={t.biasLabel} rows={tfPlaceholderRows} />
        }
      >
        <div
          className={`flex items-center gap-1.5 text-2xl font-bold tracking-tight ${
            isLong
              ? "text-[#61e294]"
              : isShort
              ? "text-[#ff8383]"
              : "text-[#f5c542]"
          }`}
        >
          {isLong ? (
            <TrendingUp className="w-5 h-5" />
          ) : isShort ? (
            <TrendingDown className="w-5 h-5" />
          ) : (
            <Minus className="w-5 h-5" />
          )}
          <span>{isNeutral ? "NEUTRAL" : pulse.bias}</span>
        </div>
      </MetricCard>

      {/* 2. PULSE */}
      <MetricCard
        label="PULSE"
        tooltip={t.scoreTooltip}
        footer={<ConfidenceBar value={pulseScore * 10} />}
        flipBack={<FlipBackContent label="PULSE" rows={tfPlaceholderRows} />}
      >
        <div className="flex items-center justify-center h-full">
          <span
            className={`text-4xl font-bold font-mono ${
              pulseScore >= 8
                ? "text-[#61e294]"
                : pulseScore >= 5
                ? "text-[#f5c542]"
                : "text-gray-400"
            }`}
          >
            {pulseScore * 10}
          </span>
        </div>
      </MetricCard>

      {/* 3. VOLATILITY */}
      <MetricCard
        label={t.volatilityLabel}
        tooltip={t.volatilityTooltip}
        footer={
          <div className="flex items-center justify-between text-[0.68rem] text-gray-400">
            <span>Status:</span>
            <span className="text-[#61e294] font-medium">{t.volatilityStatus}</span>
          </div>
        }
        flipBack={
          <FlipBackContent label={t.volatilityLabel} rows={tfPlaceholderRows} />
        }
      >
        <div className="text-2xl font-bold text-white font-mono tracking-tight">
          ${pulse.volatility.toFixed(2)} <span className="text-xs text-gray-400 font-normal">USD</span>
        </div>
      </MetricCard>

      {/* 4. ENTRY */}
      <MetricCard
        label="ENTRY"
        tooltip={t.entryTooltip}
        flipBack={<FlipBackContent label="ENTRY" rows={tfPlaceholderRows} />}
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[0.7rem]">
            <span className="text-gray-400 font-sans">Price:</span>
            <span className="text-white font-mono font-bold text-base">
              ${pulse.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[0.7rem]">
            <span className="text-gray-400 font-sans">Gain:</span>
            <span
              className={`font-mono font-semibold ${
                pulse.entry.gain >= 0 ? "text-[#61e294]" : "text-[#ff8383]"
              }`}
            >
              {pulse.entry.gain >= 0 ? `+${pulse.entry.gain.toFixed(2)}` : pulse.entry.gain.toFixed(2)}
            </span>
          </div>
        </div>
      </MetricCard>

      {/* 5. EXIT */}
      <MetricCard
        label="EXIT"
        tooltip={t.exitTooltip}
        footer={
          <div className="text-[0.68rem] text-gray-400">
            {t.trailingLabel}: <strong className="text-[#f5c542] font-mono">${pulse.exit.toFixed(2)}</strong>
          </div>
        }
        flipBack={<FlipBackContent label="EXIT" rows={tfPlaceholderRows} />}
      >
        <div className="flex flex-col gap-0.5">
          {/* Badge EXIT: EXIT NOW (đỏ) / HOLD (xanh) / WAIT (xám) */}
          <span
            className={`inline-flex items-center gap-1 self-start px-2 py-0.5 mb-0.5 rounded-md font-bold text-[0.62rem] border ${exitBadge.cls}`}
          >
            {exitBadge.text}
          </span>
          {(() => {
            const v = pulse.volatility || 0;
            const p = pulse.price || 0;
            let sl, tp1, tp2;
            if(isLong)       { sl = p - 2*v; tp1 = p + 1*v; tp2 = p + 2*v; }
            else if(isShort) { sl = p + 2*v; tp1 = p - 1*v; tp2 = p - 2*v; }
            else             { sl = p - 2*v; tp1 = p + 1*v; tp2 = p + 2*v; }
            return (
              <>
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-gray-400 font-sans">SL:</span>
                  <span className="text-[#ff8383] font-mono font-semibold">${sl.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-gray-400 font-sans">TP1:</span>
                  <span className="text-[#61e294] font-mono font-semibold">${tp1.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="text-gray-400 font-sans">TP2:</span>
                  <span className="text-[#61e294] font-mono font-semibold">${tp2.toFixed(2)}</span>
                </div>
              </>
            );
          })()}
        </div>
      </MetricCard>

      {/* 6. HTF FILTER */}
      <MetricCard
        label={t.htfLabel}
        tooltip={t.htfTooltip}
        footer={
          <div className="flex items-center justify-between text-[0.68rem] text-gray-400">
            <span className="text-gray-400">{t.htfFooter}</span>
            <span className="text-[#61e294] font-semibold">{pulse.htf}</span>
          </div>
        }
        flipBack={<FlipBackContent label={t.htfLabel} rows={tfPlaceholderRows} />}
      >
        <div className="flex items-center gap-2.5 my-0.5">
          <div className="p-1.5 rounded-lg bg-[rgba(97,226,148,0.15)] text-[#61e294] border border-[rgba(97,226,148,0.3)] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-[#61e294] tracking-tight leading-tight">
              {pulse.htf}
            </div>
            <div className="text-[0.62rem] text-gray-400 font-mono mt-0.5">
              M15 · M30 · H1
            </div>
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
