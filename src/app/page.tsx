import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TNV Gold — Phân tích Vàng XAUUSD Real-Time bằng AI",
  description:
    "Dashboard phân tích vàng XAUUSD real-time với bias, score, multi-timeframe, session flow, AI analysis tiếng Việt. Bot Telegram Pro tự động gửi tín hiệu.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl text-center">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-[#f5c542]/10 text-[#f5c542] border border-[#f5c542]/30">
            Coming Soon
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-[#f5c542]">TNV</span>{" "}
            <span>Gold Pulse</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Phân tích vàng <strong className="text-white">XAUUSD</strong> real-time bằng AI.
            Bias, score, multi-timeframe, session flow Tokyo/London/NY.
            Tự động đăng bài phân tích hàng giờ.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/goldpulse"
              className="px-6 py-3 rounded-lg bg-[#f5c542] text-[#05060a] font-semibold hover:bg-[#cfa744] transition"
            >
              Xem Dashboard
            </Link>
            <a
              href="https://t.me/TuanNguyenTrader"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg border border-[#f5c542]/50 text-[#f5c542] hover:bg-[#f5c542]/10 transition"
            >
              Liên hệ Admin
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-6 px-6 text-center text-sm text-gray-500">
        © 2026 TNV. All rights reserved. ·{" "}
        <a href="https://t.me/TNVGold_bot" className="text-[#f5c542] hover:underline">
          @TNVGold_bot
        </a>
      </footer>
    </main>
  );
}
