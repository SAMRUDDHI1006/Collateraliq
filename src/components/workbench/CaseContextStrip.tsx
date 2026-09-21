'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';
import ReviewLevelBadge from '@/components/ReviewLevelBadge';

interface CaseContextStripProps {
  loanCase: CollateralAssessmentCase;
  onBackToDashboard: () => void;
}

export const CaseContextStrip: React.FC<CaseContextStripProps> = ({
  loanCase,
  onBackToDashboard,
}) => {
  const { propertyProfile, modelIndicativeValue, loanFacilityRequested } = loanCase;
  const ltv = modelIndicativeValue > 0 ? (loanFacilityRequested / modelIndicativeValue) * 100 : 0;

  return (
    <div className="shrink-0 h-11 px-4 bg-[#0B111A] border-b border-white/[0.08] flex items-center justify-between text-xs text-[#F8FAFC] select-none min-w-0 font-sans">
      {/* Left: Back link, divider, Case ID badge, and Property Summary */}
      <div className="flex items-center gap-3 min-w-0 truncate">
        <button
          onClick={onBackToDashboard}
          className="px-2.5 py-1 rounded-lg bg-[#141E2B] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-white/[0.08] transition-all flex items-center gap-1.5 text-[11px] font-semibold shrink-0 cursor-pointer shadow-xs"
          title="Return to Dashboard"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>Dashboard</span>
        </button>

        <span className="h-4 w-px bg-white/[0.12] shrink-0" />

        <div className="flex items-center gap-2 truncate text-xs">
          <span className="font-mono font-extrabold text-cyan-400 tracking-wider shrink-0 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
            {loanCase.caseId}
          </span>
          <span className="text-[#94A3B8] truncate font-medium">
            <span className="text-white font-semibold">{loanCase.borrowerName}</span> &bull; {propertyProfile.location}, {propertyProfile.bhk} {propertyProfile.propertyType}
          </span>
        </div>
      </div>

      {/* Right: Interactive Review Level Badge with Hover Inspection Card */}
      <div className="flex items-center gap-3 shrink-0">
        <ReviewLevelBadge
          level={loanCase.reviewLevel || 'MEDIUM'}
          drivers={loanCase.reviewDrivers}
          ltv={ltv}
          deviationPct={loanCase.deviation?.percentageDiff}
        />
      </div>
    </div>
  );
};
