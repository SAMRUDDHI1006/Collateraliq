'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, MessageSquare, XCircle, ShieldCheck } from 'lucide-react';

interface StickyGovernanceFooterProps {
  exceptionAcknowledged: boolean;
  hasPendingExceptions?: boolean;
  onRequestClarification: () => void;
  onRejectDocket: () => void;
  onProceedToSanction: () => void;
}

export const StickyGovernanceFooter: React.FC<StickyGovernanceFooterProps> = ({
  exceptionAcknowledged,
  hasPendingExceptions = false,
  onRequestClarification,
  onRejectDocket,
  onProceedToSanction,
}) => {
  const isSanctionAllowed = !hasPendingExceptions || exceptionAcknowledged;

  return (
    <footer className="shrink-0 h-12 bg-[#0B111A] border-t border-white/[0.08] px-4 sm:px-6 flex items-center justify-between z-30 select-none min-w-0 shadow-lg">
      {/* Left: Exception Status Pill */}
      <div className="flex items-center gap-2 text-xs truncate">
        {!hasPendingExceptions ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold truncate font-mono shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Valuation Reconciliation Verified &bull; Aligned with IBBI Benchmarks</span>
          </div>
        ) : exceptionAcknowledged ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold truncate font-mono shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Valuation Deviation Acknowledged &bull; Ready for Sanction Sign-Off</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-bold truncate animate-pulse font-mono shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">High Valuation Deviation (&gt;10%) Pending Underwriter Review</span>
          </div>
        )}
      </div>

      {/* Right: Governance Decision Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onRequestClarification}
          className="px-3.5 py-1.5 rounded-xl bg-[#141E2B] hover:bg-[#1E293B] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-white/[0.08] shrink-0 cursor-pointer active:scale-[0.98] shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>Request Clarification</span>
        </button>

        <button
          onClick={onRejectDocket}
          className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer active:scale-[0.98] shadow-xs"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Reject</span>
        </button>

        <button
          onClick={onProceedToSanction}
          disabled={!isSanctionAllowed}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
            isSanctionAllowed
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25 cursor-pointer active:scale-[0.98]'
              : 'bg-[#141E2B] text-[#64748B] border border-white/[0.06] cursor-not-allowed opacity-50'
          }`}
          title={!isSanctionAllowed ? 'High valuation deviation must be acknowledged prior to sanction' : 'Recommend facility for formal sanction'}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Proceed to Sanction</span>
        </button>
      </div>
    </footer>
  );
};
