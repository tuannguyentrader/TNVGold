"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  source: string;
  time: string;
  url: string;
}

export function SponsorCard() {
  const [flipped, setFlipped] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Ngăn sự kiện click lây lan từ nút Open Account
  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Connecting to Exness...");
  };

  // Fetch tin tức vàng mới nhất từ RSS TradingView
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.tradingview.com%2Ffeed%2F%3Fsymbol%3DXAUUSD&api_key=dcg3qk9krhwfwnenc83vy3azbeqdxefhstqnjmdn&count=3"
        );
        if (res.ok) {
          const json = await res.json();
          const items: NewsItem[] = (json.items || []).slice(0, 3).map((a: any) => ({
            title: a.title || "",
            source: "TradingView",
            time: new Date(a.pubDate || a.publishedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
            url: a.link || "#",
          }));
          if (items.length > 0) setNews(items);
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div
      className="rounded-xl p-3.5 bg-[#090d16] border border-[rgba(245,197,66,0.35)] flex flex-col justify-between shadow-xl min-h-[148px] cursor-pointer select-none"
      onClick={() => setFlipped(!flipped)}
    >
      {flipped ? (
        <div className="space-y-2 text-[0.72rem] leading-snug">
          {loading ? (
            <p className="text-gray-400 text-center">Loading news...</p>
          ) : news.length > 0 ? (
            news.map((item, i) => (
              <div key={i} className="border-l-2 border-[#f5c542] pl-2 text-gray-200">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white font-medium hover:text-[#f5c542] transition-colors no-underline"
                >
                  {item.title}
                </a>{" "}
                <span className="text-gray-400 font-mono text-[0.68rem]">&mdash; {item.source} &bull; {item.time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No news available</p>
          )}
        </div>
      ) : (
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
          <button
            onClick={handleAction}
            className="inline-block px-4 py-1 rounded-full border border-[#f5c542] text-[#f5c542] text-xs font-semibold hover:bg-[#f5c542] hover:text-[#05060a] transition-all cursor-pointer"
          >
            Open Account
          </button>
        </div>
      )}

      {/* Dots navigation */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        <span className={`w-1.5 h-1.5 rounded-full transition-all ${!flipped ? "bg-[#f5c542]" : "bg-gray-600"}`} />
        <span className={`w-1.5 h-1.5 rounded-full transition-all ${flipped ? "bg-[#f5c542]" : "bg-gray-600"}`} />
      </div>
    </div>
  );
}
