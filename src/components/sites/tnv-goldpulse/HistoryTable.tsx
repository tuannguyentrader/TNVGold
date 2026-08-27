"use client";

import { History, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useLivePulse } from "@/lib/live-pulse-context";

export function HistoryTable() {
  const { t } = useLanguage();
  const { history } = useLivePulse();

  return (
    <section className="qx-history my-5" aria-label={t.historyTitle}>
      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5 m-0">
            <History className="w-4 h-4 text-[#f5c542]" />
            {t.historyTitle}
          </h2>
          <p className="text-[0.74rem] text-gray-400 mt-0.5">
            {t.historySub}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[0.7rem] text-[#f5c542] font-mono">
          <Clock className="w-3 h-3" />
          <span>{history.length} snapshots</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0f16] shadow-xl">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-gray-400 font-semibold uppercase tracking-wider text-[0.68rem]">
              <th className="py-2.5 px-3.5">{t.colTime}</th>
              <th className="py-2.5 px-3.5">{t.colPrice}</th>
              <th className="py-2.5 px-3.5">{t.colSignal}</th>
              <th className="py-2.5 px-3.5">{t.colScore}</th>
              <th className="py-2.5 px-3.5">{t.colVolatility}</th>
              <th className="py-2.5 px-3.5">{t.colHigh}</th>
              <th className="py-2.5 px-3.5">{t.colLow}</th>
              <th className="py-2.5 px-3.5">{t.colHTF}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[0.74rem]">
            {history.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-white/[0.04] transition-colors"
              >
                <td className="py-2.5 px-3.5 text-gray-300 font-medium">
                  {row.time}
                </td>
                <td className="py-2.5 px-3.5 text-white font-bold">
                  ${row.price.toFixed(2)}
                </td>
                <td className="py-2.5 px-3.5">
                  {row.bias === "LONG" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.68rem] font-bold bg-[rgba(97,226,148,0.15)] text-[#61e294] border border-[rgba(97,226,148,0.3)]">
                      <TrendingUp className="w-3 h-3" />
                      LONG
                    </span>
                  )}
                  {row.bias === "SHORT" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.68rem] font-bold bg-[rgba(255,96,96,0.15)] text-[#ff8383] border border-[rgba(255,96,96,0.3)]">
                      <TrendingDown className="w-3 h-3" />
                      SHORT
                    </span>
                  )}
                  {row.bias === "NEUTRAL" && (
                    <span className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-gray-400">
                      NEUTRAL
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-3.5">
                  <span
                    className={`font-bold ${
                      row.score >= 8
                        ? "text-[#61e294]"
                        : row.score >= 5
                        ? "text-[#f5c542]"
                        : "text-gray-400"
                    }`}
                  >
                    {row.score} / 10
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-gray-300">
                  ${row.volatility.toFixed(2)}
                </td>
                <td className="py-2.5 px-3.5 text-white">
                  ${row.entry.high.toFixed(2)}
                </td>
                <td className="py-2.5 px-3.5 text-gray-300">
                  ${row.entry.low.toFixed(2)}
                </td>
                <td className="py-2.5 px-3.5 text-[#61e294]">
                  {row.htf}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
