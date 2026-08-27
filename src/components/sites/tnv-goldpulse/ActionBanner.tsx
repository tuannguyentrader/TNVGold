"use client";

import { useState } from "react";
import { Share2, Check, Zap } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useLivePulse } from "@/lib/live-pulse-context";

export function ActionBanner() {
  const { language } = useLanguage();
  const { pulse } = useLivePulse();
  const [copied, setCopied] = useState(false);

  const gainStr = pulse.entry.gain >= 0 ? `+${pulse.entry.gain.toFixed(2)}` : pulse.entry.gain.toFixed(2);
  const actionText =
    language === "vi"
      ? `XAUUSD ${pulse.bias} • Giá vào: $${pulse.entry.high.toFixed(2)} • Hiện tại: $${pulse.price.toFixed(2)} (${gainStr}) • Dừng lỗ: $${pulse.exit.toFixed(2)}`
      : `XAUUSD ${pulse.bias} • Entry: $${pulse.entry.high.toFixed(2)} • Now: $${pulse.price.toFixed(2)} (${gainStr}) • Stop: $${pulse.exit.toFixed(2)}`;

  const handleShare = async () => {
    const shareText = `TNV SIGNAL | ${actionText}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const isLong = pulse.bias === "LONG";
  const isShort = pulse.bias === "SHORT";

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2.5 mb-4 rounded-xl border text-xs shadow-md ${
        isLong
          ? "border-[rgba(97,226,148,0.35)] bg-[#070e12]"
          : isShort
          ? "border-[rgba(255,96,96,0.35)] bg-[#130707]"
          : "border-white/10 bg-[#0b0f16]"
      }`}
    >
      {/* Left: Signal Badge + Alert message */}
      <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[0.68rem] border shrink-0 ${
            isLong
              ? "bg-[rgba(97,226,148,0.18)] text-[#61e294] border-[rgba(97,226,148,0.3)]"
              : isShort
              ? "bg-[rgba(255,96,96,0.18)] text-[#ff8383] border-[rgba(255,96,96,0.3)]"
              : "bg-white/10 text-gray-300 border-white/10"
          }`}
        >
          <Zap className="w-3 h-3 fill-current" />
          TNV SIGNAL
        </span>
        <div className="truncate text-gray-200 font-medium font-mono text-[0.74rem]">
          {actionText}
        </div>
      </div>

      {/* Right: Clean Circular Share Button */}
      <div className="flex items-center shrink-0">
        <button
          onClick={handleShare}
          className="w-7 h-7 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#f5c542] hover:border-[#f5c542]/40 transition-all cursor-pointer"
          title="Share Signal Alert"
          aria-label="Share Signal Alert"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#61e294]" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
