'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  borrowerName: string;
  onSubmitClarification: (queryText: string, recipient: string) => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  caseId,
  borrowerName,
  onSubmitClarification,
}) => {
  const [recipient, setRecipient] = useState('Dadar West Branch & Empaneled Valuer');
  const [queryText, setQueryText] = useState(
    `Re: ${caseId} (${borrowerName}). Please reconcile the +70 sq.ft (+8.24%) variance observed between Registered Sale Deed (850 sq.ft) and BMC Property Tax Ledger (920 sq.ft). An updated physical measurement sheet or society architect certificate is required within 48 hours.`
  );
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    onSubmitClarification(queryText, recipient);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm">Request Underwriter Clarification (RFI)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block mb-1">Target Recipient</span>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Dadar West Branch & Empaneled Valuer" className="bg-white text-slate-900 py-1.5">Originating Branch &amp; Empaneled Valuer</option>
              <option value="Direct Borrower / Applicant" className="bg-white text-slate-900 py-1.5">Direct Borrower / Applicant (Portal Dispatch)</option>
              <option value="Legal Title Search Advocate" className="bg-white text-slate-900 py-1.5">Legal Title Search Advocate</option>
            </select>
          </div>

          <div>
            <span className="text-slate-500 font-semibold block mb-1">Clarification Query / Notice Text</span>
            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 text-[11px] text-blue-900">
            Dispatched RFIs automatically pause the credit SLA clock and notify the relationship manager via internal lending workflow.
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
            onClick={handleSend}
            disabled={isSent}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            {isSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>RFI Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch RFI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
