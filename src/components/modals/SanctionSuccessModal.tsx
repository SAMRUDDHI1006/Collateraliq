'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface SanctionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanCase: CollateralAssessmentCase;
  onViewAuditTrail: () => void;
}

export const SanctionSuccessModal: React.FC<SanctionSuccessModalProps> = ({
  isOpen,
  onClose,
  loanCase,
  onViewAuditTrail,
}) => {
  if (!isOpen) return null;

  const assessedValuation = loanCase.valuerReport?.assessedValue || loanCase.modelIndicativeValue;
  const ltvPercent = loanCase.loanFacilityRequested && assessedValuation > 0
    ? (loanCase.loanFacilityRequested / assessedValuation) * 100
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#101824] rounded-2xl border border-emerald-500/30 shadow-2xl w-full max-w-lg overflow-hidden text-[#F8FAFC] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-emerald-950/80 text-white flex items-center justify-between border-b border-emerald-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-heading">Collateral Clearance Recommended</h3>
              <p className="text-xs text-emerald-300">Docket Approved for Credit Committee Sanction</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-700/50 text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sanction Governance Gate Cleared</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-300/80 font-mono">
              The underwriter has formally acknowledged the valuation reconciliation. Empaneled valuer physical inspection record has been cross-referenced with indicative valuation model.
            </p>
          </div>

          <div className="bg-[#141E2B] rounded-xl border border-white/[0.06] p-4 space-y-2.5 font-mono text-xs shadow-inner">
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[#94A3B8] font-sans">Case ID:</span>
              <span className="font-bold text-cyan-400">{loanCase.caseId}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[#94A3B8] font-sans">Borrower:</span>
              <span className="font-bold text-white font-sans">{loanCase.borrowerName}</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[#94A3B8] font-sans">Facility Amount:</span>
              <span className="font-bold text-white">₹{(loanCase.loanFacilityRequested / 1e7).toFixed(2)} Cr</span>
            </div>
            <div className="flex justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[#94A3B8] font-sans">Assessed Valuation:</span>
              <span className="font-bold text-cyan-300">₹{(assessedValuation / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-[#94A3B8] font-sans">Prudential LTV:</span>
              <span className="font-bold text-emerald-400">{ltvPercent.toFixed(1)}% (&le; 75% RBI Cap)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0B111A] border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onViewAuditTrail();
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
          >
            View Audit Log Entry &rarr;
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-[0.98] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
