'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Info,
  Scale,
  TrendingUp,
  Building,
  Sliders,
  DollarSign,
  Check,
} from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface VerificationMatrixProps {
  loanCase: CollateralAssessmentCase;
  exceptionAcknowledged: boolean;
  onToggleAcknowledge: (acknowledged: boolean) => void;
}

export const VerificationMatrix: React.FC<VerificationMatrixProps> = ({
  loanCase,
  exceptionAcknowledged,
  onToggleAcknowledge,
}) => {
  const { propertyProfile, modelIndicativeValue, valuerReport, deviation, balanceTransfer } = loanCase;
  const valuerValue = valuerReport?.assessedValue || 0;
  const absDiff = deviation?.absoluteDiff || Math.abs(valuerValue - modelIndicativeValue);
  const pctDiff = deviation?.percentageDiff || (modelIndicativeValue > 0 && valuerValue > 0 ? Number(((absDiff / modelIndicativeValue) * 100).toFixed(1)) : 0);
  const isHighDeviation = pctDiff > 10;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 text-xs select-none shadow-md min-h-0">
      {/* Panel Header Strip */}
      <div className="shrink-0 h-8 px-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <h3 className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider truncate">
            Valuation Reconciliation &amp; Deviation Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Model: ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr
          </span>
          <span
            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
              isHighDeviation
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-blue-950 text-blue-300 border border-blue-800'
            }`}
          >
            {valuerValue > 0 ? `${pctDiff}% Deviation` : 'Indicative Ready'}
          </span>
        </div>
      </div>

      {/* Main Reconciliation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Model vs. Valuer Comparison Card */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-slate-400">Valuation Comparison Benchmark</span>
            <span className="font-mono text-[10px] text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
              Confidence: {loanCase.valuationConfidence}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Model Indicative */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Model Indicative Valuation</span>
              <div className="font-mono font-extrabold text-sm text-emerald-400">
                ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Corridor: ₹{(loanCase.indicativeRange.min / 1e7).toFixed(2)} Cr &ndash; ₹{(loanCase.indicativeRange.max / 1e7).toFixed(2)} Cr
              </div>
            </div>

            {/* Valuer Assessed */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Empaneled Valuer Report</span>
              <div className="font-mono font-extrabold text-sm text-blue-300">
                {valuerValue > 0 ? `₹${(valuerValue / 1e7).toFixed(3)} Cr` : 'Pending Linkage'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {valuerReport?.valuerName || 'Awaiting Valuer Submission'}
              </div>
            </div>
          </div>
        </div>

        {/* Identified Deviation Drivers */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-slate-400">Identified Deviation Drivers</span>
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
          </div>

          {deviation?.identifiedDrivers && deviation.identifiedDrivers.length > 0 ? (
            <div className="space-y-1.5 text-[11px]">
              {deviation.identifiedDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              Valuation is 100% aligned with micro-market model baseline (0% deviation observed).
            </div>
          )}
        </div>

        {/* Balance Transfer Takeover Reconciliation (if BT) */}
        {balanceTransfer?.isBalanceTransfer && (
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="uppercase tracking-wider text-[11px] text-amber-400">Balance Transfer Takeover Reconciliation</span>
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Previous Lender:</span>
                <span className="text-white font-bold">{balanceTransfer.previousLender || 'N/A'}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Previous Valuation:</span>
                <span className="text-emerald-400 font-bold">
                  {balanceTransfer.previousValuation ? `₹${(balanceTransfer.previousValuation / 1e7).toFixed(2)} Cr` : 'N/A'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 col-span-2">
                <span className="text-slate-400 text-[10px] block">Takeover Outstanding Principal:</span>
                <span className="text-amber-300 font-bold">
                  {balanceTransfer.outstandingBalance ? `₹${(balanceTransfer.outstandingBalance / 1e7).toFixed(2)} Cr` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Governance & Exception Acknowledgment */}
        <div
          className={`p-3 rounded-xl border transition-colors ${
            exceptionAcknowledged
              ? 'bg-emerald-950/40 border-emerald-800/80'
              : isHighDeviation
              ? 'bg-rose-950/40 border-rose-800/80'
              : 'bg-blue-950/40 border-blue-800/80'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {exceptionAcknowledged ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : isHighDeviation ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}

            <div className="space-y-1.5 flex-1 min-w-0">
              <span className="font-bold text-xs text-white block">
                {exceptionAcknowledged
                  ? 'Valuation Reconciliation Verified & Sign-Off Acknowledged'
                  : isHighDeviation
                  ? 'High Valuation Deviation Triggered (>10%)'
                  : 'Reconciliation Approved & Aligned'}
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {isHighDeviation
                  ? 'Model indicative value and valuer report differ by over 10%. Underwriter HITL audit sign-off is required prior to sanction.'
                  : 'Valuation is fully reconciled against IBBI empaneled report and micro-market comparables.'}
              </p>

              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={exceptionAcknowledged}
                  onChange={(e) => onToggleAcknowledge(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-bold text-slate-200">
                  Acknowledge &amp; Validate Valuation Reconciliation Sign-off
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
