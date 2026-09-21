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
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product Distribution</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {total} Cases
          </span>
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div
            onClick={() => onSelectProduct?.('Home Loan')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-200">Home Loans</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-blue-400">{pct(homeLoanCount)}%</span>
              <span className="text-slate-400 ml-1.5">({homeLoanCount})</span>
            </div>
          </div>

          <div
            onClick={() => onSelectProduct?.('LAP')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="font-semibold text-slate-200">Loan Against Property (LAP)</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-indigo-400">{pct(lapCount)}%</span>
              <span className="text-slate-400 ml-1.5">({lapCount})</span>
            </div>
          </div>

          <div
            onClick={() => onSelectProduct?.('Balance Transfer')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-200">Home Loan Balance Transfer</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-emerald-400">{pct(btCount)}%</span>
              <span className="text-slate-400 ml-1.5">({btCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Review Level Breakdown */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Review Level Classification</h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
            Explainable Risk
          </span>
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div
            onClick={() => onSelectReviewLevel?.('LOW')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-200">🟢 Low Review</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-emerald-400">{pct(lowCount)}%</span>
              <span className="text-slate-400 ml-1.5">({lowCount})</span>
            </div>
          </div>

          <div
            onClick={() => onSelectReviewLevel?.('MEDIUM')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-200">🟡 Medium Review</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-amber-400">{pct(medCount)}%</span>
              <span className="text-slate-400 ml-1.5">({medCount})</span>
            </div>
          </div>

          <div
            onClick={() => onSelectReviewLevel?.('HIGH')}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-200">🔴 High Review</span>
            </div>
            <div className="font-mono text-right">
              <span className="font-bold text-rose-400">{pct(highCount)}%</span>
              <span className="text-slate-400 ml-1.5">({highCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Regional Portfolio Analysis (Top 6 Regions) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Regional Concentration</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            22 Regions Total
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {topRegions.map(([reg, rData]) => {
            const avgLtv = rData.count > 0 ? (rData.ltvSum / rData.count).toFixed(1) : '0';
            return (
              <div
                key={reg}
                onClick={() => onSelectRegion?.(reg)}
                className="p-2 bg-slate-950 rounded-lg border border-slate-800 hover:border-blue-500 cursor-pointer transition-all space-y-0.5"
              >
                <span className="font-bold text-white text-xs block truncate">{reg}</span>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
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
