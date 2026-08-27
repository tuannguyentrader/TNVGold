"use client";

import { useState, useMemo } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

interface Point {
  time: string;
  price: number;
  pulse: number;
  session: "Tokyo" | "London" | "New York";
  ema9: number;
  ema21: number;
}

const dataByTf: Record<string, Point[]> = {
  "15m": [
    { time: "06:00", price: 2878.5, pulse: 45, session: "Tokyo", ema9: 2877.0, ema21: 2876.5 },
    { time: "07:30", price: 2881.2, pulse: 52, session: "Tokyo", ema9: 2879.5, ema21: 2878.0 },
    { time: "09:00", price: 2884.0, pulse: 64, session: "London", ema9: 2882.8, ema21: 2879.8 },
    { time: "10:30", price: 2889.5, pulse: 75, session: "London", ema9: 2886.5, ema21: 2882.2 },
    { time: "12:00", price: 2887.8, pulse: 71, session: "London", ema9: 2888.0, ema21: 2884.5 },
    { time: "13:30", price: 2893.2, pulse: 82, session: "New York", ema9: 2890.5, ema21: 2886.8 },
    { time: "15:00", price: 2898.6, pulse: 88, session: "New York", ema9: 2894.8, ema21: 2889.5 },
    { time: "16:30", price: 2896.4, pulse: 85, session: "New York", ema9: 2896.2, ema21: 2891.8 },
    { time: "18:00", price: 2902.1, pulse: 89, session: "New York", ema9: 2899.0, ema21: 2894.2 },
    { time: "19:30", price: 2898.6, pulse: 86, session: "New York", ema9: 2899.8, ema21: 2896.0 },
  ],
  "1h": [
    { time: "00:00", price: 2865.0, pulse: 40, session: "Tokyo", ema9: 2863.0, ema21: 2860.0 },
    { time: "04:00", price: 2872.4, pulse: 55, session: "Tokyo", ema9: 2868.5, ema21: 2864.0 },
    { time: "08:00", price: 2880.0, pulse: 68, session: "London", ema9: 2875.0, ema21: 2869.0 },
    { time: "12:00", price: 2886.5, pulse: 74, session: "London", ema9: 2881.0, ema21: 2874.0 },
    { time: "16:00", price: 2896.0, pulse: 86, session: "New York", ema9: 2889.0, ema21: 2880.0 },
    { time: "20:00", price: 2898.6, pulse: 88, session: "New York", ema9: 2894.0, ema21: 2885.0 },
  ],
  "4h": [
    { time: "D-2 00h", price: 2845.0, pulse: 35, session: "Tokyo", ema9: 2840.0, ema21: 2835.0 },
    { time: "D-2 12h", price: 2858.0, pulse: 50, session: "London", ema9: 2848.0, ema21: 2840.0 },
    { time: "D-1 00h", price: 2870.5, pulse: 65, session: "Tokyo", ema9: 2860.0, ema21: 2850.0 },
    { time: "D-1 12h", price: 2885.0, pulse: 78, session: "London", ema9: 2874.0, ema21: 2862.0 },
    { time: "Today", price: 2898.6, pulse: 88, session: "New York", ema9: 2888.0, ema21: 2875.0 },
  ],
  "1D": [
    { time: "Mon", price: 2830.0, pulse: 30, session: "London", ema9: 2825.0, ema21: 2820.0 },
    { time: "Tue", price: 2852.0, pulse: 55, session: "London", ema9: 2838.0, ema21: 2830.0 },
    { time: "Wed", price: 2874.0, pulse: 70, session: "London", ema9: 2855.0, ema21: 2842.0 },
    { time: "Thu", price: 2888.5, pulse: 82, session: "London", ema9: 2872.0, ema21: 2856.0 },
    { time: "Fri", price: 2898.6, pulse: 88, session: "New York", ema9: 2888.0, ema21: 2870.0 },
  ],
};

export function ChartSection() {
  const { t } = useLanguage();
  const [chartTab, setChartTab] = useState<"session" | "tradingview">("session");
  const [selectedTf, setSelectedTf] = useState("15m");
  const [selectedRange, setSelectedRange] = useState("24h");
  const [showPulse, setShowPulse] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showSessions, setShowSessions] = useState(true);
  const [showEma, setShowEma] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeDataset = useMemo(() => {
    return dataByTf[selectedTf] || dataByTf["15m"];
  }, [selectedTf]);

  const activePoint =
    hoveredIndex !== null && hoveredIndex < activeDataset.length
      ? activeDataset[hoveredIndex]
      : activeDataset[activeDataset.length - 1];

  // SVG dimensions
  const width = 1000;
  const height = 300;
  const paddingLeft = 45;
  const paddingRight = 65;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minPrice = useMemo(() => {
    const prices = activeDataset.map((d) => d.price);
    return Math.floor(Math.min(...prices) / 10) * 10 - 5;
  }, [activeDataset]);

  const maxPrice = useMemo(() => {
    const prices = activeDataset.map((d) => d.price);
    return Math.ceil(Math.max(...prices) / 10) * 10 + 5;
  }, [activeDataset]);

  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => paddingLeft + (index / (activeDataset.length - 1 || 1)) * chartW;
  const getYPrice = (p: number) => paddingTop + chartH - ((p - minPrice) / priceRange) * chartH;
  const getYPulse = (pulse: number) => paddingTop + chartH - (pulse / 100) * chartH;

  const pricePath = activeDataset.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getYPrice(pt.price);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const pulseAreaPath =
    activeDataset.reduce((acc, pt, i) => {
      const x = getX(i);
      const y = getYPulse(pt.pulse);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "") +
    ` L ${getX(activeDataset.length - 1)} ${paddingTop + chartH} L ${getX(0)} ${paddingTop + chartH} Z`;

  const ema9Path = activeDataset.reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getYPrice(pt.ema9);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, "");

  const priceGridMarks = useMemo(() => {
    const step = Math.max(5, Math.round(priceRange / 4));
    const marks = [];
    for (let p = minPrice; p <= maxPrice; p += step) {
      marks.push(p);
    }
    return marks;
  }, [minPrice, maxPrice, priceRange]);

  return (
    <section id="qx-pulsepro" className="my-4">
      <div className="qx-card p-3.5 border-[rgba(207,167,68,0.25)]">
        {/* Header with Tab Switcher */}
        <div className="flex items-center justify-between gap-3 flex-wrap pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#f5c542]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white m-0">
                {t.flowTitle}
              </h3>
            </div>

            {/* Tab buttons */}
            <div className="flex items-center gap-1 bg-[#111622] p-0.5 rounded-lg border border-white/5">
              <button
                onClick={() => setChartTab("session")}
                className={`text-[0.7rem] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartTab === "session"
                    ? "bg-[rgba(245,197,66,0.15)] text-[#f5c542] border border-[#f5c542]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.tabSession}
              </button>
              <button
                onClick={() => setChartTab("tradingview")}
                className={`text-[0.7rem] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  chartTab === "tradingview"
                    ? "bg-[rgba(97,226,148,0.15)] text-[#61e294] border border-[#61e294]/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                {t.tabTradingView}
              </button>
            </div>
          </div>

          {/* Session Legend Swatches (if session tab) */}
          {chartTab === "session" && (
            <div className="flex items-center gap-3 text-[0.7rem] text-gray-300">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-sm bg-[#00d4ff]" /> {t.legendTokyo}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-sm bg-[#f5c542]" /> {t.legendLondon}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-sm bg-[#ff8383]" /> {t.legendNY}
              </span>
            </div>
          )}
        </div>

        {/* Tab 1: Session Flow SVG Chart */}
        {chartTab === "session" ? (
          <>
            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap py-2 text-[0.72rem] text-gray-300">
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showPulse}
                    onChange={(e) => setShowPulse(e.target.checked)}
                    className="accent-[#f5c542] rounded"
                  />
                  <span className="font-semibold text-[#f5c542]">{t.ctrlPulse}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showPrice}
                    onChange={(e) => setShowPrice(e.target.checked)}
                    className="accent-[#61e294] rounded"
                  />
                  <span className="font-semibold text-white">{t.ctrlPrice}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showSessions}
                    onChange={(e) => setShowSessions(e.target.checked)}
                    className="accent-[#00d4ff] rounded"
                  />
                  <span>{t.ctrlSessions}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-white select-none">
                  <input
                    type="checkbox"
                    checked={showEma}
                    onChange={(e) => setShowEma(e.target.checked)}
                    className="accent-[#cfa744] rounded"
                  />
                  <span>{t.ctrlEma}</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                {/* Timeframe selector (15m, 1h, 4h, 1D) */}
                <div className="flex items-center gap-0.5 bg-[#111622] p-0.5 rounded-lg border border-white/5">
                  {["15m", "1h", "4h", "1D"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => {
                        setSelectedTf(tf);
                        setHoveredIndex(null);
                      }}
                      className={`qx-tf-btn text-[0.68rem] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                        selectedTf === tf
                          ? "bg-[rgba(245,197,66,0.2)] text-[#f5c542] font-bold shadow-xs active"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Range selector (12h, 24h, 48h, 7d) */}
                <div className="flex items-center gap-0.5 bg-[#111622] p-0.5 rounded-lg border border-white/5">
                  {["12h", "24h", "48h", "7d"].map((rg) => (
                    <button
                      key={rg}
                      onClick={() => setSelectedRange(rg)}
                      className={`qx-tf-btn text-[0.68rem] px-2 py-0.5 rounded font-medium transition-all cursor-pointer ${
                        selectedRange === rg
                          ? "bg-[rgba(245,197,66,0.2)] text-[#f5c542] font-bold shadow-xs active"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {rg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hover Inspector Card */}
            <div className="flex items-center justify-between gap-3 p-2 mb-1.5 rounded-xl bg-black/40 border border-white/5 text-[0.7rem] font-mono">
              <div className="flex items-center gap-3.5 flex-wrap">
                <span className="text-gray-400">
                  TIME: <strong className="text-white font-bold">{activePoint.time} UTC</strong>
                </span>
                <span className="text-gray-400">
                  PRICE: <strong className="text-[#61e294] font-bold">${activePoint.price.toFixed(2)}</strong>
                </span>
                <span className="text-gray-400">
                  PULSE: <strong className="text-[#f5c542] font-bold">{activePoint.pulse}/100</strong>
                </span>
                <span className="text-gray-400">
                  SESSION: <strong className="text-[#00d4ff] font-bold">{activePoint.session}</strong>
                </span>
              </div>
              <div className="text-[0.65rem] text-gray-500 hidden sm:block">
                {t.hoverInspect}
              </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="relative w-full overflow-hidden rounded-xl bg-[#06080e] border border-white/5">
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                style={{ minHeight: "220px" }}
                aria-label="Session Flow Chart"
              >
                <defs>
                  <linearGradient id="pulseFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(245,197,66,0.22)" />
                    <stop offset="100%" stopColor="rgba(245,197,66,0.0)" />
                  </linearGradient>
                  <linearGradient id="priceLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#61e294" />
                    <stop offset="100%" stopColor="#f5c542" />
                  </linearGradient>
                </defs>

                {/* Session Background Bands */}
                {showSessions && activeDataset.length > 2 && (
                  <>
                    <rect
                      x={getX(0)}
                      y={paddingTop}
                      width={Math.max(10, getX(Math.floor(activeDataset.length * 0.25)) - getX(0))}
                      height={chartH}
                      fill="rgba(0, 212, 255, 0.05)"
                    />
                    <text
                      x={getX(0) + 20}
                      y={paddingTop + 12}
                      fill="rgba(0, 212, 255, 0.4)"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      TOKYO
                    </text>

                    <rect
                      x={getX(Math.floor(activeDataset.length * 0.25))}
                      y={paddingTop}
                      width={Math.max(10, getX(Math.floor(activeDataset.length * 0.6)) - getX(Math.floor(activeDataset.length * 0.25)))}
                      height={chartH}
                      fill="rgba(245, 197, 66, 0.05)"
                    />
                    <text
                      x={getX(Math.floor(activeDataset.length * 0.25)) + 20}
                      y={paddingTop + 12}
                      fill="rgba(245, 197, 66, 0.4)"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      LONDON
                    </text>

                    <rect
                      x={getX(Math.floor(activeDataset.length * 0.6))}
                      y={paddingTop}
                      width={Math.max(10, getX(activeDataset.length - 1) - getX(Math.floor(activeDataset.length * 0.6)))}
                      height={chartH}
                      fill="rgba(255, 131, 131, 0.05)"
                    />
                    <text
                      x={getX(Math.floor(activeDataset.length * 0.6)) + 20}
                      y={paddingTop + 12}
                      fill="rgba(255, 131, 131, 0.4)"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      NEW YORK
                    </text>
                  </>
                )}

                {/* Horizontal Grid lines */}
                {priceGridMarks.map((pVal) => {
                  const y = getYPrice(pVal);
                  return (
                    <g key={pVal}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={width - paddingRight + 5}
                        y={y + 3}
                        fill="rgba(220, 220, 220, 0.5)"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        ${pVal}
                      </text>
                    </g>
                  );
                })}

                {/* Time Labels */}
                {activeDataset.map((pt, i) => {
                  const x = getX(i);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={height - 8}
                      fill="rgba(220, 220, 220, 0.5)"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {pt.time}
                    </text>
                  );
                })}

                {showPulse && <path d={pulseAreaPath} fill="url(#pulseFillGradient)" />}
                {showEma && (
                  <path
                    d={ema9Path}
                    fill="none"
                    stroke="rgba(207, 167, 68, 0.6)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                )}
                {showPrice && (
                  <path
                    d={pricePath}
                    fill="none"
                    stroke="url(#priceLineGrad)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}

                {activeDataset.map((pt, i) => {
                  const x = getX(i);
                  const y = getYPrice(pt.price);
                  const isHovered = hoveredIndex === i;

                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                    >
                      <rect
                        x={x - 14}
                        y={paddingTop}
                        width={28}
                        height={chartH}
                        fill="transparent"
                      />
                      {isHovered && (
                        <line
                          x1={x}
                          y1={paddingTop}
                          x2={x}
                          y2={paddingTop + chartH}
                          stroke="rgba(245, 197, 66, 0.4)"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 5 : 3}
                        fill={isHovered ? "#f5c542" : "#61e294"}
                        stroke="#05060a"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </>
        ) : (
          /* Tab 2: Clean Iframe TradingView Advanced Chart Widget */
          <div className="relative w-full h-[400px] my-2 bg-[#06080e] rounded-xl border border-white/5 overflow-hidden">
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=OANDA%3AXAUUSD&interval=15&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost"
              className="w-full h-full border-0"
              title="TradingView Live XAUUSD Chart"
              loading="lazy"
            />
          </div>
        )}

        {/* Footer Notes */}
        <div className="flex items-center justify-between text-[0.68rem] text-gray-500 mt-2 flex-wrap">
          <span>{t.flowFooter}</span>
          <span className="text-[#f5c542]">{t.flowSynced}</span>
        </div>
      </div>
    </section>
  );
}
