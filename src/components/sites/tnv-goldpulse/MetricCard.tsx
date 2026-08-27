"use client";

import { useState, type ReactNode } from "react";
import { InfoTip } from "./InfoTip";

interface MetricCardProps {
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  tooltip?: string;
  className?: string;
  flipBack?: ReactNode;
  hasDots?: boolean;
}

export function MetricCard({
  label,
  children,
  footer,
  tooltip,
  className = "",
  flipBack,
  hasDots = true,
}: MetricCardProps) {
  const [flipped, setFlipped] = useState(false);
  const isFlip = !!flipBack;

  return (
    <div
      className={`relative rounded-xl p-3 bg-[#0e131f] border border-white/5 hover:border-[#f5c542]/30 transition-all h-[148px] max-h-[148px] select-none ${
        isFlip ? "cursor-pointer" : ""
      } ${className}`}
      onClick={() => isFlip && setFlipped(!flipped)}
      tabIndex={isFlip ? 0 : undefined}
      onKeyDown={(e) => {
        if (isFlip && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setFlipped(!flipped);
        }
      }}
    >
      {tooltip && <InfoTip text={tooltip} />}

      {!flipped ? (
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center justify-between text-[0.68rem] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
              <span>{label}</span>
            </div>
            <div className="mt-0.5">{children}</div>
          </div>

          <div className="mt-auto">
            {footer && <div className="text-[0.7rem] text-gray-300">{footer}</div>}
            {hasDots && (
              <div className="flex items-center justify-center gap-1.5 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5c542]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between h-full w-full animate-in fade-in duration-150">
          {flipBack}
          {hasDots && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c542]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
