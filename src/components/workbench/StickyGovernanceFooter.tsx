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
    <footer className="shrink-0 h-11 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between z-30 select-none min-w-0">
      {/* Left: Exception Status Pill */}
      <div className="flex items-center gap-2 text-xs truncate">
        {!hasPendingExceptions ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-medium truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Valuation Reconciliation Verified &bull; Aligned with IBBI Benchmarks</span>
          </div>
        ) : exceptionAcknowledged ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-[11px] font-medium truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Valuation Deviation Acknowledged &bull; Ready for Sanction Sign-Off</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-[11px] font-semibold truncate animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">High Valuation Deviation (&gt;10%) Pending Underwriter Review</span>
          </div>
        )}
      </div>

      {/* Right: Governance Decision Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRequestClarification}
          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>Request Clarification</span>
        </button>

        <button
          onClick={onRejectDocket}
          className="px-3 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-800 shrink-0 cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Reject</span>
        </button>

        <button
          onClick={onProceedToSanction}
          disabled={!isSanctionAllowed}
          className={`px-4 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
            isSanctionAllowed
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 cursor-pointer active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
          title={!isSanctionAllowed ? 'High valuation deviation must be acknowledged prior to sanction' : 'Recommend facility for formal sanction'}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Proceed to Sanction</span>
        </button>
      </div>
    </footer>
  );
};
