'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, ChevronLeft, Download } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface CaseContextStripProps {
  loanCase: CollateralAssessmentCase;
  onBackToDashboard: () => void;
}

export const CaseContextStrip: React.FC<CaseContextStripProps> = ({
  loanCase,
  onBackToDashboard,
}) => {
  const { propertyProfile, modelIndicativeValue, loanFacilityRequested } = loanCase;
  const ltv = (loanFacilityRequested / modelIndicativeValue) * 100;
  const isHighDeviation = (loanCase.deviation?.percentageDiff || 0) > 10;

  return (
    <div className="shrink-0 h-11 px-4 bg-[#0B111A] border-b border-white/[0.08] flex items-center justify-between text-xs text-[#F8FAFC] select-none min-w-0">
      {/* Left: Back button & Compact Case Meta */}
      <div className="flex items-center gap-3 min-w-0 truncate">
        <button
          onClick={onBackToDashboard}
          className="px-2.5 py-1 rounded-lg bg-[#141E2B] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-white/[0.08] transition-all flex items-center gap-1.5 text-[11px] font-semibold shrink-0 cursor-pointer shadow-xs"
          title="Return to Dashboard"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <span className="h-4 w-px bg-white/[0.12] shrink-0" />

        <div className="flex items-center gap-2 truncate text-xs">
          <span className="font-mono font-extrabold text-cyan-400 tracking-wider shrink-0 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
            {loanCase.caseId}
          </span>
          <span className="text-[#94A3B8] truncate font-medium">
            <span className="text-white font-semibold">{loanCase.borrowerName}</span> &bull; {propertyProfile.location} ({propertyProfile.bhk} {propertyProfile.propertyType})
          </span>
        </div>
      </div>

      {/* Right: Key Ratios & Valuation Confidence Pill */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-[#94A3B8]">
          <span>Facility: <strong className="text-white">₹{(loanFacilityRequested / 1e7).toFixed(2)} Cr</strong></span>
          <span>Model Indicative: <strong className="text-emerald-400">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</strong></span>
          <span>LTV: <strong className="text-cyan-400">{ltv.toFixed(1)}%</strong></span>
        </div>

        <a
          href="/api/pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#141E2B] border border-white/[0.08] hover:border-cyan-500/40 transition-colors shrink-0 font-semibold cursor-pointer shadow-xs"
        >
          <Download className="w-3 h-3 text-cyan-400" />
          <span>PDF Report</span>
        </a>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 font-mono ${
            isHighDeviation
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
          }`}
        >
          {isHighDeviation ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{isHighDeviation ? 'High Deviation (>10%)' : `Valuation ${loanCase.status}`}</span>
        </div>
      </div>
    </div>
  );
};
