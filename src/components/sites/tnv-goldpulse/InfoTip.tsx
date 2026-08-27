"use client";

import { useState, useRef, useEffect } from "react";
import { X, Info } from "lucide-react";

interface InfoTipProps {
  text: string;
}

export function InfoTip({ text }: InfoTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tipRef.current && !tipRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={tipRef}
      className="absolute top-2 right-2 z-40"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-4 h-4 rounded-full border border-[rgba(245,197,66,0.35)] bg-black/40 hover:bg-[rgba(245,197,66,0.15)] hover:border-[#f5c542] text-[#f5c542] text-[0.62rem] font-serif font-bold italic flex items-center justify-center transition-all cursor-pointer shadow-sm"
        title="Information"
        aria-label="Information"
      >
        i
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-[280px] p-2.5 rounded-xl border border-[rgba(245,197,66,0.4)] bg-[#111622] text-[#fdfdfd] shadow-2xl text-[0.72rem] leading-relaxed z-50 animate-in fade-in zoom-in-95 duration-150 select-text break-words"
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