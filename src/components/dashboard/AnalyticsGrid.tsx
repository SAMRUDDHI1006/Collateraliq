'use client';

import React from 'react';
import { PieChart, MapPin, ShieldAlert, Layers } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface AnalyticsGridProps {
  filteredCases: CollateralAssessmentCase[];
  onSelectProduct?: (product: string) => void;
  onSelectReviewLevel?: (level: string) => void;
  onSelectRegion?: (region: string) => void;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  filteredCases,
  onSelectProduct,
  onSelectReviewLevel,
  onSelectRegion,
}) => {
  const total = filteredCases.length;

  // Product Distribution
  let homeLoanCount = 0;
  let lapCount = 0;
  let btCount = 0;

  // Review Level Distribution
  let lowCount = 0;
  let medCount = 0;
  let highCount = 0;

  // Regional Analysis map
  const regionMap: Record<string, { count: number; ltvSum: number; valSum: number; devSum: number; devCount: number }> = {};

  for (const c of filteredCases) {
    if (c.product === 'Home Loan') homeLoanCount++;
    else if (c.product === 'LAP') lapCount++;
    else if (c.product === 'Balance Transfer') btCount++;

    if (c.reviewLevel === 'LOW') lowCount++;
    else if (c.reviewLevel === 'MEDIUM') medCount++;
    else if (c.reviewLevel === 'HIGH') highCount++;

    const reg = c.propertyProfile.location || 'Dadar West';
    if (!regionMap[reg]) {
      regionMap[reg] = { count: 0, ltvSum: 0, valSum: 0, devSum: 0, devCount: 0 };
    }
    const rData = regionMap[reg];
    rData.count++;
    const val = c.valuerReport?.assessedValue || c.modelIndicativeValue;
    if (val > 0) {
      rData.ltvSum += (c.loanFacilityRequested / val) * 100;
    }
    rData.valSum += val / 1e7;
    if (c.deviation?.percentageDiff !== undefined) {
      rData.devSum += Math.abs(c.deviation.percentageDiff);
      rData.devCount++;
    }
  }

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

  const topRegions = Object.entries(regionMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 select-none">
      {/* 1. Product Distribution */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Product Distribution</h3>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] bg-[#0B111A] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
            {total} Cases
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div
            onClick={() => onSelectProduct?.('Home Loan')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            {/* Subtle background progress fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-cyan-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(homeLoanCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Home Loans</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-cyan-400">{pct(homeLoanCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({homeLoanCount})</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onSelectProduct?.('LAP')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-blue-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-blue-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(lapCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-glow-blue" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Loan Against Property (LAP)</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-blue-400">{pct(lapCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({lapCount})</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onSelectProduct?.('Balance Transfer')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-emerald-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(btCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-200 group-hover:text-white">Home Loan Balance Transfer</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-emerald-400">{pct(btCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({btCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Review Level Breakdown */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Review Level Classification</h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/80">
            Explainable Risk
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div
            onClick={() => onSelectReviewLevel?.('LOW')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-emerald-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(lowCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">🟢 Low Review</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-emerald-400">{pct(lowCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({lowCount})</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onSelectReviewLevel?.('MEDIUM')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-amber-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-amber-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(medCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">🟡 Medium Review</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-amber-400">{pct(medCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({medCount})</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => onSelectReviewLevel?.('HIGH')}
            className="group p-3 rounded-xl bg-[#0B111A] border border-white/[0.06] hover:border-rose-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-rose-500/[0.04] transition-all duration-500"
              style={{ width: `${pct(highCount)}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="font-semibold text-slate-200 group-hover:text-white">🔴 High Review</span>
              </div>
              <div className="font-mono text-right">
                <span className="font-bold text-rose-400">{pct(highCount)}%</span>
                <span className="text-[#64748B] ml-1.5 font-medium">({highCount})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Regional Portfolio Analysis (Top 6 Regions) */}
      <div className="bg-[#101824] rounded-2xl border border-white/[0.08] p-4 shadow-card space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">Top Regional Concentration</h3>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] bg-[#0B111A] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
            22 Regions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {topRegions.map(([reg, rData]) => {
            const avgLtv = rData.count > 0 ? (rData.ltvSum / rData.count).toFixed(1) : '0';
            return (
              <div
                key={reg}
                onClick={() => onSelectRegion?.(reg)}
                className="p-2.5 bg-[#0B111A] rounded-xl border border-white/[0.06] hover:border-cyan-500/40 hover:bg-[#141E2B] cursor-pointer transition-all duration-200 space-y-1 group"
              >
                <span className="font-bold text-slate-200 group-hover:text-white text-xs block truncate">{reg}</span>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#64748B]">
                  <span>{rData.count} cases</span>
                  <span className="text-emerald-400 font-bold">{avgLtv}% LTV</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
