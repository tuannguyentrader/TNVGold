"use client";

import { useRef, useState } from "react";
import { X, Info } from "lucide-react";

interface InfoTipProps {
  text: string;
}

export function InfoTip({ text }: InfoTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setIsOpen(true);
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div
      ref={tipRef}
      className="absolute top-2 right-2 z-40"
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="w-4 h-4 rounded-full border border-[rgba(245,197,66,0.35)] bg-black/40 hover:bg-[rgba(245,197,66,0.15)] hover:border-[#f5c542] text-[#f5c542] text-[0.62rem] font-serif font-bold italic flex items-center justify-center transition-all cursor-pointer shadow-sm"
        title="Information"
        aria-label="Information"
      >
        i
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 min-w-[220px] max-w-[300px] p-2.5 rounded-xl border border-[rgba(245,197,66,0.4)] bg-[#111622] text-[#fdfdfd] shadow-2xl text-[0.72rem] leading-relaxed z-50 select-text break-words"
          onMouseEnter={show}
          onMouseLeave={hide}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-1.5 mb-1 pb-1 border-b border-white/10">
            <span className="flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#f5c542]">
              <Info className="w-3 h-3" /> Info
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="m-0 text-gray-200 text-[0.72rem] leading-snug">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}