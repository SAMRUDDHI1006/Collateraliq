'use client';

import React from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, ArrowRight, Download } from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface SanctionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanCase: LoanCase;
  onViewAuditTrail: () => void;
}

export const SanctionSuccessModal: React.FC<SanctionSuccessModalProps> = ({
  isOpen,
  onClose,
  loanCase,
  onViewAuditTrail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Collateral Clearance Recommended</h3>
              <p className="text-xs text-emerald-300">Docket Approved for Credit Committee Sanction</p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sanction Governance Gate Cleared</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              The underwriter has formally acknowledged the +8.24% area variance exception. Empaneled valuer physical inspection record has been cross-referenced with approved municipal drawings.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-sans">Case ID:</span>
              <span className="font-bold text-slate-900">{loanCase.case_id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-sans">Borrower:</span>
              <span className="font-bold text-slate-900 font-sans">{loanCase.borrower_name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-sans">Facility Amount:</span>
              <span className="font-bold text-slate-900">₹{(loanCase.loan_amount_inr / 1e7).toFixed(2)} Cr ({loanCase.loan_product})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-sans">Assessed Valuation:</span>
              <span className="font-bold text-blue-700">₹{((loanCase.valuer_assessed_value_inr || loanCase.indicative_value_inr) / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Prudential LTV:</span>
              <span className="font-bold text-emerald-700">{loanCase.ltv_percent.toFixed(1)}% (&le; 75% RBI Cap)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onViewAuditTrail();
            }}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View Audit Log Entry &rarr;
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
