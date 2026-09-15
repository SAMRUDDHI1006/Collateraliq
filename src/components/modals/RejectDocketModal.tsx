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
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-rose-950 text-white flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-2 text-rose-300">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm text-white">Decline / Reject Collateral Docket</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-3 text-xs">
          <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-900 leading-snug">
            Docket rejection permanently flags <strong>{caseId}</strong> in the credit exception register. Human-in-the-loop audit log will record your officer credentials.
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Mandatory Rejection Category
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium text-xs focus:ring-1 focus:ring-rose-500 cursor-pointer"
            >
              <option value="Unreconciled Property Area Discrepancy (>5% Tolerance)" className="bg-white text-slate-900 py-1.5">
                Unreconciled Property Area Discrepancy (&gt;5% Tolerance)
              </option>
              <option value="Title Chain Discontinuity / Search Report Defect" className="bg-white text-slate-900 py-1.5">
                Title Chain Discontinuity / Search Report Defect
              </option>
              <option value="LTV Ratio Breaches Regulatory 75% Ceiling" className="bg-white text-slate-900 py-1.5">
                LTV Ratio Breaches Regulatory 75% Ceiling
              </option>
              <option value="Municipal Encumbrance / Tax Default Detected" className="bg-white text-slate-900 py-1.5">
                Municipal Encumbrance / Tax Default Detected
              </option>
              <option value="Unsatisfactory Physical Valuer Inspection" className="bg-white text-slate-900 py-1.5">
                Unsatisfactory Physical Valuer Inspection
              </option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Officer Rationale &amp; Audit Justification <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State explicit factual rationale for adverse collateral assessment..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isRejected}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            {isRejected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-200" />
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
