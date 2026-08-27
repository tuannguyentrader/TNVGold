"use client";

import { useState } from "react";

export function SponsorCard() {
  const [activeTab, setActiveTab] = useState<"news" | "sponsor">("news");

  return (
    <div className="rounded-xl p-3.5 bg-[#090d16] border border-[rgba(245,197,66,0.35)] flex flex-col justify-between shadow-xl min-h-[148px]">
      {activeTab === "news" ? (
        <div className="space-y-2 text-[0.72rem] leading-snug">
          <div className="border-l-2 border-[#f5c542] pl-2 text-gray-200">
            <span className="text-white font-medium hover:text-[#f5c542] transition-colors cursor-pointer">
              Gold consolidates near highs as traders assess global central bank easing cycles
            </span>{" "}
            <span className="text-gray-400 font-mono text-[0.68rem]">&mdash; Reuters &bull; 02:00 AM</span>
          </div>

          <div className="border-l-2 border-[#f5c542] pl-2 text-gray-200">
            <span className="text-white font-medium hover:text-[#f5c542] transition-colors cursor-pointer">
              Treasury yields steady as currency markets brace for key macro inflation prints
            </span>{" "}
            <span className="text-gray-400 font-mono text-[0.68rem]">&mdash; Bloomberg &bull; 02:48 PM</span>
          </div>

          <div className="border-l-2 border-[#f5c542] pl-2 text-gray-200">
            <span className="text-white font-medium hover:text-[#f5c542] transition-colors cursor-pointer">
              Geopolitical risk premium supports bullion demand amid structural physical accumulation
            </span>{" "}
            <span className="text-gray-400 font-mono text-[0.68rem]">&mdash; CNBC &bull; 02:40 PM</span>
          </div>
        </div>
      ) : (
        /* Sponsor / Liquidity Partner View */
        <div>
          <div className="mb-1.5">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[rgba(245,197,66,0.12)] text-[#f5c542] border border-[rgba(245,197,66,0.25)] text-[0.65rem] font-bold">
              Exness
            </span>
          </div>
          <h3 className="text-xs font-bold text-white mb-0.5">
            Trade Gold with Raw Institutional Spreads
          </h3>
          <p className="text-[0.72rem] text-gray-400 mb-2">
            Ultra-fast execution synchronized with TNV Indicator breakout alerts.
          </p>
          <a
            href="#open-account"
            onClick={(e) => {
              e.preventDefault();
              alert("Connecting to Exness...");
            }}
            className="inline-block px-4 py-1 rounded-full border border-[#f5c542] text-[#f5c542] text-xs font-semibold hover:bg-[#f5c542] hover:text-[#05060a] transition-all cursor-pointer"
          >
            Open Account
          </a>
        </div>
      )}

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <button
          onClick={() => setActiveTab("news")}
          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
            activeTab === "news" ? "bg-[#f5c542]" : "bg-gray-600"
          }`}
          title="Show News Radar"
          aria-label="Show News Radar"
        />
        <button
          onClick={() => setActiveTab("sponsor")}
          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
            activeTab === "sponsor" ? "bg-[#f5c542]" : "bg-gray-600"
          }`}
          title="Show Exness Broker"
          aria-label="Show Exness Broker"
        />
      </div>
    </div>
  );
}
