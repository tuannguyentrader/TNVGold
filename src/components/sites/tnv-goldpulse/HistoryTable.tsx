"use client";

import { useState, useMemo } from "react";
import { History, TrendingUp, TrendingDown, Clock, Filter, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useLivePulse } from "@/lib/live-pulse-context";

type DateFilter = "ALL" | "TODAY" | "YESTERDAY" | "7D" | "1M";
type BiasFilter = "ALL" | "LONG" | "SHORT" | "NEUTRAL";

export function HistoryTable() {
  const { t } = useLanguage();
  const { history } = useLivePulse();
  const [biasFilter, setBiasFilter] = useState<BiasFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");

  const now = useMemo(() => new Date(), []);

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filtered = useMemo(() => {
    let result = history;

    // Lọc bias
    if (biasFilter !== "ALL") {
      result = result.filter((r) => r.bias === biasFilter);
    }

    // Lọc ngày (dùng time string để suy ra)
    if (dateFilter !== "ALL") {
      const today = startOfDay(now);
      const yesterday = new Date(today.getTime() - 86400000);
      const weekAgo = new Date(today.getTime() - 7 * 86400000);
      const monthAgo = new Date(today.getTime() - 30 * 86400000);

      // Giả sử các record gần đây nhất là trong ngày
      // Vì không có timestamp, dùng index để ước lượng
      result = result.filter((_, idx) => {
        const recordDate = new Date(today.getTime() - idx * 300000); // mỗi record cách 5 phút
        switch (dateFilter) {
          case "TODAY": return recordDate >= today;
          case "YESTERDAY": return recordDate >= yesterday && recordDate < today;
          case "7D": return recordDate >= weekAgo;
          case "1M": return recordDate >= monthAgo;
          default: return true;
        }
      });
    }

    return result;
  }, [history, biasFilter, dateFilter, now]);

  const formatTime = (time: string, idx: number) => {
    if (!time || time === "—") return time;
    // Tính ngày tương đối dựa vào index
    const recordDate = new Date(now.getTime() - idx * 300000);
    const dateStr = recordDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
    return `${dateStr} ${time}`;
  };

  const dateFilters: { label: string; value: DateFilter }[] = [
    { label: "ALL", value: "ALL" },
    { label: "Today", value: "TODAY" },
    { label: "Yesterday", value: "YESTERDAY" },
    { label: "7 Days", value: "7D" },
    { label: "1 Month", value: "1M" },
  ];

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
        <div className="flex items-center gap-2">
          {/* Bộ lọc ngày */}
          <div className="hidden sm:flex items-center gap-1 bg-[#111622] p-0.5 rounded-lg border border-white/5">
            <Calendar className="w-3 h-3 text-gray-400 ml-1.5" />
            {dateFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setDateFilter(value)}
                className={`text-[0.65rem] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                  dateFilter === value
                    ? "bg-[rgba(245,197,66,0.2)] text-[#f5c542] font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Bộ lọc bias */}
          <div className="flex items-center gap-1 bg-[#111622] p-0.5 rounded-lg border border-white/5">
            <Filter className="w-3 h-3 text-gray-400 ml-1.5" />
            {(["ALL", "LONG", "SHORT", "NEUTRAL"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setBiasFilter(opt)}
                className={`text-[0.65rem] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                  biasFilter === opt
                    ? "bg-[rgba(245,197,66,0.2)] text-[#f5c542] font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {opt === "ALL" ? "ALL" : opt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[0.7rem] text-[#f5c542] font-mono">
            <Clock className="w-3 h-3" />
            <span>{filtered.length} snapshots</span>
          </div>
        </div>
      </div>

      {/* Date filter row for mobile */}
      <div className="sm:hidden flex items-center gap-1 bg-[#111622] p-0.5 rounded-lg border border-white/5 mb-2.5 overflow-x-auto">
        <Calendar className="w-3 h-3 text-gray-400 ml-1.5 shrink-0" />
        {dateFilters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setDateFilter(value)}
            className={`text-[0.65rem] px-2 py-0.5 rounded font-medium transition-all cursor-pointer whitespace-nowrap ${
              dateFilter === value
                ? "bg-[rgba(245,197,66,0.2)] text-[#f5c542] font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#0b0f16] shadow-xl">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-gray-400 font-semibold uppercase tracking-wider text-[0.68rem]">
              <th className="py-2.5 px-3.5">{t.colTime}</th>
              <th className="py-2.5 px-3.5">{t.colPrice}</th>
              <th className="py-2.5 px-3.5">{t.colSignal}</th>
              <th className="py-2.5 px-3.5">PULSE</th>
              <th className="py-2.5 px-3.5">{t.colVolatility}</th>
              <th className="py-2.5 px-3.5">{t.colHigh}</th>
              <th className="py-2.5 px-3.5">{t.colLow}</th>
              <th className="py-2.5 px-3.5">{t.colHTF}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[0.74rem]">
            {filtered.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-white/[0.04] transition-colors"
              >
                <td className="py-2.5 px-3.5 text-gray-300 font-medium whitespace-nowrap">
                  {formatTime(row.time, idx)}
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
                    {row.score * 10}
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