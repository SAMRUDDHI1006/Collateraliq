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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 select-none">
      {/* Card 1: Total & Active Cases */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card card-hover-lift transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Total &amp; Active Cases
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-[#F8FAFC] tracking-tight tabular-nums font-heading">
            {count.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-[#64748B]">of {totalCasesCount.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-3 text-[11px] text-[#94A3B8] flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> {activeCount.toLocaleString('en-IN')} Active
          </span>
          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {pendingValuationCount.toLocaleString('en-IN')} Pending
          </span>
        </div>
      </div>

      {/* Card 2: Review Breakdown */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card card-hover-lift transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Cases Requiring Review
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight tabular-nums font-heading">
            {(mediumReview + highReview).toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-[#64748B]">Review Cases</span>
        </div>
        <div className="mt-3 text-[11px] font-mono flex items-center justify-between border-t border-white/[0.06] pt-2.5">
          <span className="text-emerald-400 font-bold">🟢 Low: {lowReview.toLocaleString('en-IN')}</span>
          <span className="text-amber-400 font-bold">🟡 Med: {mediumReview.toLocaleString('en-IN')}</span>
          <span className="text-rose-400 font-bold">🔴 High: {highReview.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Card 3: Portfolio LTV & Collateral Value */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card card-hover-lift transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Average LTV &amp; Collateral
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xs">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight tabular-nums font-heading">
            {avgLtv.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-[#64748B]">&le; 75% RBI Cap</span>
        </div>
        <div className="mt-3 text-[11px] text-[#94A3B8] flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono">
          <span>Avg Collateral Value:</span>
          <span className="text-[#F8FAFC] font-bold">₹{avgCollateralValueCr.toFixed(2)} Cr</span>
        </div>
      </div>

      {/* Card 4: AI–Valuer Deviation & Total Exposure */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card card-hover-lift transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            AI–Valuer Deviation &amp; Exposure
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shadow-xs">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono text-cyan-300 tracking-tight tabular-nums font-heading">
            {avgDeviation.toFixed(2)}%
          </span>
          <span className="text-xs font-medium text-[#64748B]">Avg Deviation</span>
        </div>
        <div className="mt-3 text-[11px] text-[#94A3B8] flex items-center justify-between border-t border-white/[0.06] pt-2.5 font-mono">
          <span>Total Exposure:</span>
          <span className="text-emerald-400 font-bold">₹{totalLoanExposure.toFixed(2)} Cr</span>
        </div>
      </div>
    </div>
  );
};
