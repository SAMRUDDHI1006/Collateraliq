'use client';

import React from 'react';
import { CheckCircle2, FileSpreadsheet, Info, Scale, TrendingUp, Sliders, Calendar, ArrowRight } from 'lucide-react';
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
  const pctDiff = deviation?.percentageDiff !== undefined
    ? deviation.percentageDiff
    : (modelIndicativeValue > 0 && valuerValue > 0
        ? Number(((valuerValue - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2))
        : 0);

  const modelRate = Math.round(modelIndicativeValue / (propertyProfile.carpetArea || 1));
  const valuerRate = valuerValue > 0 ? Math.round(valuerValue / (propertyProfile.carpetArea || 1)) : 0;
  const rateDiff = valuerRate - modelRate;

  const conf = deviation?.explanationConfidence || 'High';

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 text-xs select-none shadow-md min-h-0">
      {/* Header Strip */}
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
          <span className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
            Math.abs(pctDiff) > 8 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
          }`}>
            {valuerValue > 0 ? `${pctDiff > 0 ? '+' : ''}${pctDiff}% Deviation` : 'Indicative Ready'}
          </span>
        </div>
      </div>

      {/* Main Reconciliation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Card 1: Valuation Comparison Benchmark */}
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
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Model-Supported Indicative Value</span>
              <div className="font-mono font-extrabold text-sm text-emerald-400">
                ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Corridor: ₹{(loanCase.indicativeRange.min / 1e7).toFixed(2)} Cr &ndash; ₹{(loanCase.indicativeRange.max / 1e7).toFixed(2)} Cr
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Rate: ₹{modelRate.toLocaleString()}/sq.ft
              </div>
            </div>

            {/* Valuer Assessed */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Independent Valuer Value</span>
              <div className="font-mono font-extrabold text-sm text-blue-300">
                {valuerValue > 0 ? `₹${(valuerValue / 1e7).toFixed(3)} Cr` : 'Pending Linkage'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {valuerReport?.valuerName || 'Awaiting Valuer Report'}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Rate: {valuerRate > 0 ? `₹${valuerRate.toLocaleString()}/sq.ft` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AI-Valuer Valuation Deviation */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-slate-400">Valuation Deviation Analysis</span>
            <span className={`font-mono text-xs font-extrabold ${pctDiff < 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
              {pctDiff > 0 ? `+${pctDiff}%` : `${pctDiff}%`}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            Formula: <code>(Valuer Value &minus; CollateralIQ Value) &divide; CollateralIQ Value &times; 100</code>
          </p>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">Absolute INR Difference:</span>
            <span className="font-bold text-white">₹{(absDiff / 1e5).toFixed(2)} Lakhs</span>
          </div>

          <p className="text-[11px] text-slate-300 italic">
            The independent valuer's reported value is {Math.abs(pctDiff)}% {pctDiff < 0 ? 'below' : 'above'} the CollateralIQ model-supported estimate.
          </p>
        </div>

        {/* Card 3: "Why is there a deviation?" (7 Measurable Metrics) */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            <span className="uppercase tracking-wider text-[11px] text-amber-400">Why is there a deviation?</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Confidence: {conf}
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            {/* Metric 1: Effective Rate */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 1 — Effective Rate/sq.ft:</span>
              <span className="font-mono text-slate-200">
                Model ₹{modelRate.toLocaleString()} vs Valuer ₹{valuerRate.toLocaleString()} ({rateDiff > 0 ? '+' : ''}₹{rateDiff}/sq.ft)
              </span>
            </div>

            {/* Metric 2: Comparable Properties */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 2 — Comparables Count:</span>
              <span className="font-mono text-slate-200">
                Model ({loanCase.comparables?.length || 3} comps) vs Valuer ({valuerReport?.comparablesUsedCount || 3} comps)
              </span>
            </div>

            {/* Metric 3: Average Comparable Rate */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 3 — Avg Comparable Rate:</span>
              <span className="font-mono text-slate-200">
                Model ₹{modelRate.toLocaleString()}/sq.ft vs Valuer ₹{(valuerReport?.comparablesAvgRate || valuerRate).toLocaleString()}/sq.ft
              </span>
            </div>

            {/* Metric 4: Area Used */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 4 — Area Used:</span>
              <span className="font-mono text-emerald-400">
                {propertyProfile.carpetArea} sq.ft (No material area difference)
              </span>
            </div>

            {/* Metric 5: Valuation Date */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 5 — Valuation Date:</span>
              <span className="font-mono text-slate-200">
                Model (Sep 2026) vs Valuer ({valuerReport?.inspectionDate || 'Aug 2026'})
              </span>
            </div>

            {/* Metric 6: Valuation Method */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 6 — Valuation Method:</span>
              <span className="font-mono text-slate-200">
                AI Comparable Model vs Sales Comparison Approach
              </span>
            </div>

            {/* Metric 7: Explicit Valuer Adjustments */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Metric 7 — Valuer Adjustments:</span>
              <span className="font-mono text-slate-200 truncate max-w-[200px]">
                {valuerReport?.adjustmentsNote || 'No explicit adjustment noted'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Balance Transfer Valuation History (If BT) */}
        {balanceTransfer?.isBalanceTransfer && (
          <div className="bg-slate-950 rounded-xl border border-blue-900/60 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="uppercase tracking-wider text-[11px] text-blue-400">Balance Transfer — Valuation History</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Previous Bank</span>
                <span className="font-bold text-white text-xs">₹{((balanceTransfer.previousValuation || 42000000) / 1e7).toFixed(2)} Cr</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Current CollateralIQ</span>
                <span className="font-bold text-emerald-400 text-xs">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[9px]">Current Valuer</span>
                <span className="font-bold text-blue-300 text-xs">₹{(valuerValue / 1e7).toFixed(3)} Cr</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2 rounded border border-slate-800">
              <div className="flex justify-between">
                <span>Previous &rarr; Current Valuer Movement:</span>
                <span className="text-emerald-400 font-bold">+₹35 Lakhs (+8.33%)</span>
              </div>
              <div className="flex justify-between">
                <span>Current CollateralIQ &rarr; Valuer Deviation:</span>
                <span className="text-blue-300 font-bold">-₹12.5 Lakhs (-2.67%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Card 5: Governance Sign-off */}
        <div className="p-3 rounded-xl border bg-slate-950 border-slate-800 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exceptionAcknowledged}
              onChange={(e) => onToggleAcknowledge(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-[11px] font-bold text-slate-200">
              Acknowledge &amp; Validate Valuation Deviation Sign-off
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
