'use client';

import React, { useState } from 'react';
import { X, XCircle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RejectDocketModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  onConfirmReject: (reason: string, notes: string) => void;
}

export const RejectDocketModal: React.FC<RejectDocketModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState('Unreconciled Property Area Discrepancy (>5% Tolerance)');
  const [notes, setNotes] = useState('');
  const [isRejected, setIsRejected] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!notes.trim()) {
      alert('Underwriter rejection notes are mandatory for compliance auditing.');
      return;
    }
    onConfirmReject(reason, notes);
    setIsRejected(true);
    setTimeout(() => {
      setIsRejected(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#101824] rounded-2xl border border-rose-500/30 shadow-2xl w-full max-w-md overflow-hidden text-[#F8FAFC] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-rose-950/80 text-white flex items-center justify-between border-b border-rose-900/60">
          <div className="flex items-center gap-2.5 text-rose-300">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white font-heading">Decline / Reject Collateral Docket</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-800/50 text-rose-200 leading-relaxed font-mono text-[11px]">
            Docket rejection permanently flags <strong className="text-rose-100">{caseId}</strong> in the credit exception register. Human-in-the-loop audit log will record your officer credentials.
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1.5 uppercase font-mono text-[10px]">
              Mandatory Rejection Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-white/[0.10] rounded-xl bg-[#141E2B] text-slate-200 font-medium text-xs focus:border-rose-400 focus:outline-none cursor-pointer"
            >
              <option value="Unreconciled Property Area Discrepancy (>5% Tolerance)" className="bg-[#141E2B] text-slate-200 py-1.5">
                Unreconciled Property Area Discrepancy (&gt;5% Tolerance)
              </option>
              <option value="Title Chain Discontinuity / Search Report Defect" className="bg-[#141E2B] text-slate-200 py-1.5">
                Title Chain Discontinuity / Search Report Defect
              </option>
              <option value="LTV Ratio Breaches Regulatory 75% Ceiling" className="bg-[#141E2B] text-slate-200 py-1.5">
                LTV Ratio Breaches Regulatory 75% Ceiling
              </option>
              <option value="Municipal Encumbrance / Tax Default Detected" className="bg-[#141E2B] text-slate-200 py-1.5">
                Municipal Encumbrance / Tax Default Detected
              </option>
              <option value="Unsatisfactory Physical Valuer Inspection" className="bg-[#141E2B] text-slate-200 py-1.5">
                Unsatisfactory Physical Valuer Inspection
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[#94A3B8] font-semibold mb-1.5 uppercase font-mono text-[10px]">
              Officer Rationale &amp; Audit Justification <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State explicit factual rationale for adverse collateral assessment..."
              className="w-full px-3 py-2.5 border border-white/[0.10] rounded-xl bg-[#141E2B] text-slate-200 text-xs focus:border-rose-400 focus:outline-none placeholder:text-slate-600 font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#0B111A] border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 border border-white/[0.10] rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isRejected}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isRejected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Rejection Logged</span>
              </>
            ) : (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
