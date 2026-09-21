'use client';

import React from 'react';
import { Layers, CheckCircle2, Clock, AlertTriangle, ShieldAlert, Percent, Building2, TrendingDown } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface MetricStripProps {
  filteredCases: CollateralAssessmentCase[];
  totalCasesCount: number;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ filteredCases, totalCasesCount }) => {
  const count = filteredCases.length;

  let activeCount = 0;
  let completedCount = 0;
  let pendingValuationCount = 0;

  let lowReview = 0;
  let mediumReview = 0;
  let highReview = 0;

  let ltvSum = 0;
  let collateralValueSum = 0;
  let deviationSum = 0;
  let deviationCount = 0;
  let totalLoanExposure = 0;

  for (const c of filteredCases) {
    if (c.status === 'ACTIVE') activeCount++;
    else if (c.status === 'COMPLETED') completedCount++;
    else if (c.status === 'PENDING_VALUATION') pendingValuationCount++;

    if (c.reviewLevel === 'LOW') lowReview++;
    else if (c.reviewLevel === 'MEDIUM') mediumReview++;
    else if (c.reviewLevel === 'HIGH') highReview++;

    const valuerOrModelVal = c.valuerReport?.assessedValue || c.modelIndicativeValue;
    if (valuerOrModelVal > 0) {
      const ltv = (c.loanFacilityRequested / valuerOrModelVal) * 100;
      ltvSum += ltv;
    }

    collateralValueSum += valuerOrModelVal / 1e7;
    totalLoanExposure += c.loanFacilityRequested / 1e7;

    if (c.deviation?.percentageDiff !== undefined) {
      deviationSum += Math.abs(c.deviation.percentageDiff);
      deviationCount++;
    }
  }

  const avgLtv = count > 0 ? ltvSum / count : 0;
  const avgCollateralValueCr = count > 0 ? collateralValueSum / count : 0;
  const avgDeviation = deviationCount > 0 ? deviationSum / deviationCount : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 select-none">
      {/* Card 1: Total & Active Cases */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Total & Active Cases
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight tabular-nums">
            {count.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-400">of {totalCasesCount.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> {activeCount} Active
          </span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> {pendingValuationCount} Pending Val.
          </span>
        </div>
      </div>

      {/* Card 2: Review Breakdown */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cases Requiring Review
          </span>
          <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-amber-400 tracking-tight tabular-nums">
            {(mediumReview + highReview).toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-400">Review Cases</span>
        </div>
        <div className="mt-2 text-[11px] font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
          <span className="text-emerald-400 font-bold">🟢 Low: {lowReview}</span>
          <span className="text-amber-400 font-bold">🟡 Med: {mediumReview}</span>
          <span className="text-rose-400 font-bold">🔴 High: {highReview}</span>
        </div>
      </div>

      {/* Card 3: Portfolio LTV & Collateral Value */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Average LTV & Collateral
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight tabular-nums">
            {avgLtv.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-slate-400">&le; 75% RBI Cap</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Avg Collateral Value:</span>
          <span className="text-white font-bold">₹{avgCollateralValueCr.toFixed(2)} Cr</span>
        </div>
      </div>

      {/* Card 4: AI–Valuer Deviation & Total Exposure */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-3.5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            AI–Valuer Deviation & Exposure
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400 flex items-center justify-center">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-indigo-300 tracking-tight tabular-nums">
            {avgDeviation.toFixed(2)}%
          </span>
          <span className="text-xs font-medium text-slate-400">Avg Deviation</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Total Exposure:</span>
          <span className="text-emerald-400 font-bold">₹{totalLoanExposure.toFixed(2)} Cr</span>
        </div>
      </div>
    </div>
  );
};
