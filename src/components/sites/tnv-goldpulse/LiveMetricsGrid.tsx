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
          <FlipBackContent
            label={t.biasLabel}
            rows={[
              { tf: "M15", value: pulse.multiTf.m15.bias, badgeType: pulse.multiTf.m15.bias === "LONG" ? "up" : pulse.multiTf.m15.bias === "SHORT" ? "down" : "neutral" },
              { tf: "M30", value: pulse.multiTf.m30.bias, badgeType: pulse.multiTf.m30.bias === "LONG" ? "up" : pulse.multiTf.m30.bias === "SHORT" ? "down" : "neutral" },
              { tf: "H1", value: pulse.multiTf.h1.bias, badgeType: pulse.multiTf.h1.bias === "LONG" ? "up" : pulse.multiTf.h1.bias === "SHORT" ? "down" : "neutral" },
            ]}
          />
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

      {/* 2. QUALITY SCORE */}
      <MetricCard
        label={t.scoreLabel}
        tooltip={t.scoreTooltip}
        footer={<ConfidenceBar value={pulse.score * 10} />}
        flipBack={
          <FlipBackContent
            label={t.scoreLabel}
            rows={[
              { tf: "M15", value: `${pulse.multiTf.m15.score} / 10` },
              { tf: "M30", value: `${pulse.multiTf.m30.score} / 10` },
              { tf: "H1", value: `${pulse.multiTf.h1.score} / 10` },
            ]}
          />
        }
      >
        <div className="flex items-baseline">
          <span
            className={`text-2xl font-bold font-mono ${
              pulse.score >= 8
                ? "text-[#61e294]"
                : pulse.score >= 5
                ? "text-[#f5c542]"
                : "text-gray-400"
            }`}
          >
            {pulse.score} / 10
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
          <FlipBackContent
            label={t.volatilityLabel}
            rows={[
              { tf: "M15", value: `$${(pulse.volatility * 1.8).toFixed(2)} USD` },
              { tf: "M30", value: `$${(pulse.volatility * 2.5).toFixed(2)} USD` },
              { tf: "H1", value: `$${(pulse.volatility * 3.4).toFixed(2)} USD` },
            ]}
          />
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
        footer={
          <div className="flex flex-col gap-0.5 text-[0.68rem] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-sans">High:</span>
              <span className="text-white font-semibold">${pulse.entry.high.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-sans">Low:</span>
              <span className="text-gray-300 font-medium">${pulse.entry.low.toFixed(2)}</span>
            </div>
          </div>
        }
        flipBack={
          <FlipBackContent
            label="ENTRY"
            rows={[
              { tf: "M15", value: `$${pulse.multiTf.m15.high.toFixed(2)}` },
              { tf: "M30", value: `$${pulse.multiTf.m30.high.toFixed(2)}` },
              { tf: "H1", value: `$${pulse.multiTf.h1.high.toFixed(2)}` },
            ]}
          />
        }
      >
        <div className="flex items-center">
          {isNeutral ? (
            <span className="text-lg font-semibold text-gray-400">Neutral</span>
          ) : (
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                pulse.entry.gain >= 0 ? "text-[#61e294]" : "text-[#ff8383]"
              }`}
            >
              {pulse.entry.gain >= 0 ? `+${pulse.entry.gain.toFixed(2)}` : pulse.entry.gain.toFixed(2)}
            </span>
          )}
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
        flipBack={
          <FlipBackContent
            label="EXIT"
            rows={[
              { tf: "M15", value: `$${pulse.multiTf.m15.exit.toFixed(2)}` },
              { tf: "M30", value: `$${pulse.multiTf.m30.exit.toFixed(2)}` },
              { tf: "H1", value: `$${pulse.multiTf.h1.exit.toFixed(2)}` },
            ]}
          />
        }
      >
        <div className="text-2xl font-bold text-white font-mono tracking-tight">
          ${pulse.exit.toFixed(2)}
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
        flipBack={
          <FlipBackContent
            label={t.htfLabel}
            rows={[
              { tf: "M15", value: pulse.multiTf.m15.htf, badge: "Pass", badgeType: "up" },
              { tf: "M30", value: pulse.multiTf.m30.htf, badge: "Pass", badgeType: "up" },
              { tf: "H1", value: pulse.multiTf.h1.htf, badge: "Pass", badgeType: "up" },
            ]}
          />
        }
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
