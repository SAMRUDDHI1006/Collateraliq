'use client';

import React from 'react';
import { CheckCircle2, FileSpreadsheet, TrendingUp, ArrowRight } from 'lucide-react';
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
  const absDiff = deviation?.absoluteDiff ?? Math.abs(valuerValue - modelIndicativeValue);
  const pctDiff = deviation?.percentageDiff !== undefined
    ? deviation.percentageDiff
    : (modelIndicativeValue > 0 && valuerValue > 0
        ? Number(((valuerValue - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2))
        : 0);

  const modelRate = Math.round(modelIndicativeValue / (propertyProfile.carpetArea || 1));
  const valuerRate = valuerValue > 0 ? Math.round(valuerValue / (propertyProfile.carpetArea || 1)) : 0;
  const rateDiff = valuerRate - modelRate;

  const conf = deviation?.explanationConfidence || 'High';

  // Balance Transfer 3-value calculations (fully dynamic from case data)
  const isBT = balanceTransfer?.isBalanceTransfer === true;
  const prevVal = balanceTransfer?.previousValuation || 0;

  // Previous → Current Valuer movement
  const prevToValuerAbs = valuerValue - prevVal;
  const prevToValuerPct = prevVal > 0 ? ((valuerValue - prevVal) / prevVal * 100) : 0;

  // Previous → Current CollateralIQ movement
  const prevToModelAbs = modelIndicativeValue - prevVal;
  const prevToModelPct = prevVal > 0 ? ((modelIndicativeValue - prevVal) / prevVal * 100) : 0;

  // Current CollateralIQ → Current Valuer deviation
  const modelToValuerAbs = valuerValue - modelIndicativeValue;
  const modelToValuerPct = modelIndicativeValue > 0 ? ((valuerValue - modelIndicativeValue) / modelIndicativeValue * 100) : 0;

  const fmtCr = (v: number) => `₹${(v / 1e7).toFixed(3)} Cr`;
  const fmtL = (v: number) => {
    const l = v / 1e5;
    const sign = v >= 0 ? '+' : '';
    return `${sign}₹${Math.abs(l).toFixed(2)} L`;
  };
  const fmtPct = (v: number) => {
    const sign = v >= 0 ? '+' : '';
    return `${sign}${v.toFixed(2)}%`;
  };

  return (
    <div className="flex flex-col h-full bg-[#101824] border border-white/[0.08] rounded-2xl overflow-hidden text-[#F8FAFC] text-xs select-none shadow-card min-h-0">
      {/* Header Strip */}
      <div className="shrink-0 h-9 px-3.5 bg-[#0B111A] border-b border-white/[0.08] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-slate-200 text-[11px] uppercase tracking-wider truncate font-heading">
            Valuation Reconciliation &amp; Deviation Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
            Model: {fmtCr(modelIndicativeValue)}
          </span>
          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
            Math.abs(pctDiff) > 8 ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' :
            Math.abs(pctDiff) > 3 ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' :
            'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
          }`}>
            {valuerValue > 0 ? `${pctDiff > 0 ? '+' : ''}${pctDiff}% Deviation` : 'Indicative Ready'}
          </span>
        </div>
      </div>

      {/* Main Reconciliation Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">

        {/* === CARD A (BT ONLY, TOP): Balance Transfer — 3-Value Valuation History === */}
        {isBT && (
          <div className="bg-gradient-to-br from-amber-950/20 via-[#101824] to-[#0B111A] rounded-2xl border border-amber-500/40 p-4 space-y-3.5 shadow-card">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-amber-400 font-heading">
                <TrendingUp className="w-4 h-4" />
                <span className="uppercase tracking-wider text-[11px]">Balance Transfer — Valuation History</span>
              </div>
              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 font-semibold">
                3-Value Trajectory
              </span>
            </div>

            {/* Three Value Cards */}
            <div className="grid grid-cols-3 gap-2.5 text-[10px] font-mono text-center">
              <div className="p-3 rounded-xl bg-[#0B111A] border border-white/[0.08] space-y-1 shadow-inner">
                <span className="text-[#94A3B8] block text-[9px] uppercase tracking-wider">Previous Bank</span>
                <span className="font-extrabold text-white text-sm block font-heading">{prevVal > 0 ? fmtCr(prevVal) : '—'}</span>
                <span className="text-[#64748B] text-[9px] truncate block">{balanceTransfer?.previousLender || 'Previous Lender'}</span>
                {balanceTransfer?.previousValuationDate && (
                  <span className="text-[#64748B] text-[9px] block">{balanceTransfer.previousValuationDate}</span>
                )}
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 shadow-inner">
                <span className="text-emerald-300/80 block text-[9px] uppercase tracking-wider">CollateralIQ Current</span>
                <span className="font-extrabold text-emerald-400 text-sm block font-heading">{fmtCr(modelIndicativeValue)}</span>
                <span className="text-[#64748B] text-[9px] block">AI Model Estimate</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1 shadow-inner">
                <span className="text-cyan-300/80 block text-[9px] uppercase tracking-wider">Current Valuer</span>
                <span className="font-extrabold text-cyan-300 text-sm block font-heading">{valuerValue > 0 ? fmtCr(valuerValue) : '—'}</span>
                <span className="text-[#64748B] text-[9px] truncate block">{valuerReport?.valuerName ? valuerReport.valuerName.split('(')[0].trim() : 'Independent Valuer'}</span>
              </div>
            </div>

            {/* Flow Arrow */}
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-[10px] font-mono">
              <span className="text-slate-400 font-semibold">Previous Bank</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span className="text-emerald-400 font-semibold">CollateralIQ</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-300 font-semibold">Valuer</span>
            </div>

            {/* Movement Calculations */}
            <div className="text-[11px] font-mono space-y-2 bg-[#0B111A] p-3 rounded-xl border border-white/[0.06]">
              {prevVal > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Previous → Current Valuer:</span>
                    <span className={`font-bold ${prevToValuerAbs >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {fmtL(prevToValuerAbs)} ({fmtPct(prevToValuerPct)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Previous → CollateralIQ Current:</span>
                    <span className={`font-bold ${prevToModelAbs >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {fmtL(prevToModelAbs)} ({fmtPct(prevToModelPct)})
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/[0.08] pt-2">
                    <span className="text-[#94A3B8]">CollateralIQ ↔ Valuer Deviation:</span>
                    <span className={`font-bold ${Math.abs(modelToValuerPct) <= 3 ? 'text-emerald-400' : Math.abs(modelToValuerPct) <= 8 ? 'text-amber-300' : 'text-rose-400'}`}>
                      {fmtL(modelToValuerAbs)} ({fmtPct(modelToValuerPct)})
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-[#64748B] text-center text-[10px]">
                  Enter previous bank valuation in intake to see movement calculations
                </div>
              )}
            </div>

            {/* Previous Valuation Details */}
            {(balanceTransfer?.previousRatePerSqFt || balanceTransfer?.previousValuationMethod) && (
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-[#0B111A] p-2.5 rounded-xl border border-white/[0.06]">
                {balanceTransfer?.previousRatePerSqFt && (
                  <span className="text-[#94A3B8]">Prev Rate: <span className="text-white font-bold">₹{balanceTransfer.previousRatePerSqFt.toLocaleString()}/sq.ft</span></span>
                )}
                {balanceTransfer?.previousAreaConsidered && (
                  <span className="text-[#94A3B8]">Prev Area: <span className="text-white font-bold">{balanceTransfer.previousAreaConsidered} sq.ft</span></span>
                )}
                {balanceTransfer?.previousValuationMethod && (
                  <span className="text-[#94A3B8]">Prev Method: <span className="text-white font-bold">{balanceTransfer.previousValuationMethod}</span></span>
                )}
                {balanceTransfer?.previousValuerName && (
                  <span className="text-[#94A3B8] col-span-2">Prev Valuer: <span className="text-white font-bold">{balanceTransfer.previousValuerName}</span></span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card 1: Valuation Comparison Benchmark */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-[#94A3B8] font-heading">Valuation Comparison Benchmark</span>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/80 font-semibold">
              Confidence: {loanCase.valuationConfidence}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Model Indicative */}
            <div className="p-3 rounded-xl bg-[#141E2B] border border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider block">Model-Supported Value</span>
              <div className="font-mono font-extrabold text-sm text-emerald-400 font-heading">
                {fmtCr(modelIndicativeValue)}
              </div>
              <div className="text-[10px] font-mono text-[#64748B]">
                Corridor: {fmtCr(loanCase.indicativeRange.min)} &ndash; {fmtCr(loanCase.indicativeRange.max)}
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">
                Rate: ₹{modelRate.toLocaleString()}/sq.ft
              </div>
            </div>

            {/* Valuer Assessed */}
            <div className="p-3 rounded-xl bg-[#141E2B] border border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider block">Independent Valuer</span>
              <div className="font-mono font-extrabold text-sm text-cyan-300 font-heading">
                {valuerValue > 0 ? fmtCr(valuerValue) : 'Pending Linkage'}
              </div>
              <div className="text-[10px] text-[#64748B] truncate">
                {valuerReport?.valuerName || 'Awaiting Valuer Report'}
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8]">
                Rate: {valuerRate > 0 ? `₹${valuerRate.toLocaleString()}/sq.ft` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AI-Valuer Valuation Deviation */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-[#94A3B8] font-heading">Valuation Deviation Analysis</span>
            <span className={`font-mono text-xs font-extrabold ${pctDiff < 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {pctDiff > 0 ? `+${pctDiff}%` : `${pctDiff}%`}
            </span>
          </div>

          <p className="text-[11px] text-[#94A3B8] leading-relaxed font-sans">
            Formula: <code className="bg-[#141E2B] px-1.5 py-0.5 rounded text-slate-300 font-mono">(Valuer &minus; Model) &divide; Model &times; 100</code>
          </p>

          <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex items-center justify-between font-mono text-xs">
            <span className="text-[#94A3B8]">Absolute INR Difference:</span>
            <span className="font-bold text-white">₹{(absDiff / 1e5).toFixed(2)} Lakhs</span>
          </div>

          <p className="text-[11px] text-[#94A3B8] italic">
            The independent valuer&apos;s reported value is {Math.abs(pctDiff)}% {pctDiff < 0 ? 'below' : 'above'} the CollateralIQ model-supported estimate.
          </p>

          {/* Review Level inline */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
            loanCase.reviewLevel === 'HIGH'
              ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
              : loanCase.reviewLevel === 'MEDIUM'
              ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
          }`}>
            {loanCase.reviewLevel === 'HIGH' ? '🔴' : loanCase.reviewLevel === 'MEDIUM' ? '🟡' : '🟢'} {loanCase.reviewLevel} REVIEW
          </div>
        </div>

        {/* Card 3: "Why is there a deviation?" (7 Measurable Metrics) */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 border-b border-white/[0.06] pb-2.5">
            <span className="uppercase tracking-wider text-[11px] text-amber-400 font-heading">Why is there a deviation?</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80 font-semibold">
              Confidence: {conf}
            </span>
          </div>

          <div className="space-y-2 text-[11px]">
            {/* Metric 1: Effective Rate */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 1 — Effective Rate/sq.ft:</span>
              <span className="font-mono text-slate-200">
                Model ₹{modelRate.toLocaleString()} vs Valuer ₹{valuerRate > 0 ? valuerRate.toLocaleString() : '—'} ({rateDiff > 0 ? '+' : ''}₹{rateDiff}/sq.ft)
              </span>
            </div>

            {/* Metric 2: Comparable Properties */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 2 — Comparables Count:</span>
              <span className="font-mono text-slate-200">
                Model ({loanCase.comparables?.length || 3} comps) vs Valuer ({valuerReport?.comparablesUsedCount ?? 3} comps)
              </span>
            </div>

            {/* Metric 3: Average Comparable Rate */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 3 — Avg Comparable Rate:</span>
              <span className="font-mono text-slate-200">
                Model ₹{(deviation?.avgComparableRate?.modelAvg || modelRate).toLocaleString()}/sq.ft vs Valuer ₹{(valuerReport?.comparablesAvgRate || valuerRate || 0).toLocaleString()}/sq.ft
              </span>
            </div>

            {/* Metric 4: Area Used */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 4 — Area Used:</span>
              <span className={`font-mono ${
                deviation?.areaUsed?.modelArea === deviation?.areaUsed?.valuerArea
                  ? 'text-emerald-400'
                  : 'text-amber-300'
              }`}>
                Model {deviation?.areaUsed?.modelArea || propertyProfile.carpetArea} sq.ft vs Valuer {deviation?.areaUsed?.valuerArea || valuerReport?.areaConsidered || propertyProfile.carpetArea} sq.ft
                {deviation?.areaUsed?.modelArea === deviation?.areaUsed?.valuerArea ? ' (No difference)' : ' ⚠ Mismatch'}
              </span>
            </div>

            {/* Metric 5: Valuation Date */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 5 — Valuation Date:</span>
              <span className="font-mono text-slate-200">
                Model ({deviation?.valuationDate?.modelDate || 'Current'}) vs Valuer ({deviation?.valuationDate?.valuerDate || valuerReport?.inspectionDate || 'N/A'})
              </span>
            </div>

            {/* Metric 6: Valuation Method */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 6 — Valuation Method:</span>
              <span className="font-mono text-slate-200">
                {deviation?.methodology?.modelMethod || 'AI Comparable Model'} vs {deviation?.methodology?.valuerMethod || valuerReport?.valuationMethod || 'Sales Comparison'}
              </span>
            </div>

            {/* Metric 7: Explicit Valuer Adjustments */}
            <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] flex justify-between items-center">
              <span className="text-[#94A3B8]">Metric 7 — Valuer Adjustments:</span>
              <span className="font-mono text-slate-200 truncate max-w-[220px]">
                {deviation?.explicitAdjustments || valuerReport?.adjustmentsNote || 'No explicit adjustment noted'}
              </span>
            </div>
          </div>

          {/* Explanation Text */}
          {deviation?.explanationText && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200 leading-relaxed">
              {deviation.explanationText}
            </div>
          )}

          {/* Identified Drivers */}
          {deviation?.identifiedDrivers && deviation.identifiedDrivers.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono font-bold">Identified Drivers:</span>
              {deviation.identifiedDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 4 (Review Drivers) */}
        {loanCase.reviewDrivers && loanCase.reviewDrivers.length > 0 && (
          <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-2.5 shadow-inner">
            <span className="uppercase tracking-wider text-[10px] text-[#94A3B8] font-mono font-bold">Review Level Drivers</span>
            <div className="space-y-1.5">
              {loanCase.reviewDrivers.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    loanCase.reviewLevel === 'HIGH' ? 'bg-rose-400' :
                    loanCase.reviewLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card 5: Governance Sign-off */}
        <div className="p-3.5 rounded-2xl border bg-[#0B111A] border-white/[0.08] space-y-2.5 shadow-inner">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={exceptionAcknowledged}
              onChange={(e) => onToggleAcknowledge(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-[#101824] text-emerald-500 focus:ring-emerald-500/30"
            />
            <span className="text-[11px] font-bold text-slate-200">
              Acknowledge &amp; Validate Valuation Deviation Sign-off
            </span>
          </label>
          {exceptionAcknowledged && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold pl-6">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Deviation acknowledged by credit officer</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
