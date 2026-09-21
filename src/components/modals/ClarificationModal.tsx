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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] shadow-2xl w-full max-w-lg overflow-hidden text-[#F8FAFC] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0B111A] text-white flex items-center justify-between border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm font-heading">Request Underwriter Clarification (RFI)</h3>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-[#94A3B8] font-semibold block mb-1.5 uppercase font-mono text-[10px]">Target Recipient</span>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 border border-white/[0.10] rounded-xl bg-[#141E2B] text-slate-200 font-medium text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="Dadar West Branch & Empaneled Valuer" className="bg-[#141E2B] text-slate-200 py-1.5">Originating Branch &amp; Empaneled Valuer</option>
              <option value="Direct Borrower / Applicant" className="bg-[#141E2B] text-slate-200 py-1.5">Direct Borrower / Applicant (Portal Dispatch)</option>
              <option value="Legal Title Search Advocate" className="bg-[#141E2B] text-slate-200 py-1.5">Legal Title Search Advocate</option>
            </select>
          </div>

          <div>
            <span className="text-[#94A3B8] font-semibold block mb-1.5 uppercase font-mono text-[10px]">Clarification Query / Notice Text</span>
            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full px-3 py-2.5 border border-white/[0.10] rounded-xl bg-[#141E2B] text-slate-200 text-xs focus:border-cyan-400 focus:outline-none font-mono"
            />
          </div>

          <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-800/50 text-[11px] text-cyan-200 leading-relaxed font-mono">
            Dispatched RFIs automatically pause the credit SLA clock and notify the relationship manager via internal lending workflow.
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
            onClick={handleSend}
            disabled={isSent}
            className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
          >
            {isSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
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
