'use client';

import React, { useState } from 'react';

interface ReviewBadgeProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  drivers?: string[];
  ltv?: number;
  deviationPct?: number;
}

export default function ReviewLevelBadge({
  level,
  drivers = [
    'Valuation deviation: -2.67% (-₹12.50 L vs Model)',
    'Valuer comps benchmark lower by ₹1,600/sq.ft',
    'Valuation dates differ by 1 month',
    'Area basis verified identical (850 sq.ft)',
  ],
  ltv,
  deviationPct,
}: ReviewBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const styleMap = {
    LOW: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      dot: 'bg-emerald-400',
      text: 'LOW REVIEW',
    },
    MEDIUM: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      dot: 'bg-amber-400',
      text: 'MEDIUM REVIEW',
    },
    HIGH: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
      dot: 'bg-rose-400',
      text: 'HIGH REVIEW',
    },
  };

  const current = styleMap[level] || styleMap.MEDIUM;
  const displayDrivers = drivers && drivers.length > 0 ? drivers : [
    'Valuation deviation: -2.67% (-₹12.50 L vs Model)',
    'Valuer comps benchmark lower by ₹1,600/sq.ft',
    'Valuation dates differ by 1 month',
    'Area basis verified identical (850 sq.ft)',
  ];

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Target Trigger Pill */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold font-mono cursor-pointer transition-colors ${current.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
        <span>{current.text}</span>
      </div>

      {/* Floating Hover Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2.5">
            <span className="font-semibold text-white tracking-tight">Review Drivers</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${current.badge}`}>
              {level}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="text-[11px] text-slate-400">Triggered Attribution Factors:</div>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              {displayDrivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
            Deterministic rule attribution • Non-subjective
          </div>
        </div>
      )}
    </div>
  );
}
export { ReviewLevelBadge };
