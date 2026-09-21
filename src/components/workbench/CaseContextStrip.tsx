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
    <div className="shrink-0 h-10 px-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-100 select-none min-w-0">
      {/* Left: Back button & Compact Case Meta */}
      <div className="flex items-center gap-2.5 min-w-0 truncate">
        <button
          onClick={onBackToDashboard}
          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px] shrink-0"
          title="Return to Dashboard"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <span className="h-4 w-px bg-slate-700 shrink-0" />

        <div className="flex items-center gap-2 truncate text-xs">
          <span className="font-mono font-bold text-slate-200 tracking-wider shrink-0">{loanCase.caseId}</span>
          <span className="text-slate-400 truncate">
            | {loanCase.borrowerName} &bull; {propertyProfile.location} ({propertyProfile.bhk} {propertyProfile.propertyType})
          </span>
        </div>
      </div>

      {/* Right: Key Ratios & Valuation Confidence Pill */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-300">
          <span>Facility Requested: <strong className="text-slate-100">₹{(loanFacilityRequested / 1e7).toFixed(2)} Cr</strong></span>
          <span>Model Indicative: <strong className="text-emerald-400">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</strong></span>
          <span>LTV: <strong className="text-blue-400">{ltv.toFixed(1)}%</strong></span>
        </div>

        <a
          href="/api/pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700 transition-colors shrink-0"
        >
          <Download className="w-3 h-3" />
          <span>PDF Report</span>
        </a>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
            isHighDeviation
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
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
