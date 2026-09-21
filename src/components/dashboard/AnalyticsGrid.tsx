'use client';

import React from 'react';
import { PieChart, TrendingUp, MapPin } from 'lucide-react';
import { LocalityBenchmark } from '@/types/collateral';
import { LiveKpis } from '@/context/CaseContext';

interface AnalyticsGridProps {
  liveKpis: LiveKpis;
  localityBenchmarks: Record<string, LocalityBenchmark>;
  onFilterLocality?: (locality: string) => void;
}

export const AnalyticsGrid: React.FC<AnalyticsGridProps> = ({
  liveKpis,
  localityBenchmarks,
  onFilterLocality,
}) => {
  const triage = liveKpis.triageDistribution;

  const spotlightLocalities = [
    { name: 'Dadar West', rate: localityBenchmarks['Dadar West']?.benchmark_rate_inr_sqft || 55000, city: 'Mumbai Central' },
    { name: 'Andheri West', rate: localityBenchmarks['Andheri West']?.benchmark_rate_inr_sqft || 46200, city: 'Mumbai Western' },
    { name: 'Bandra East', rate: localityBenchmarks['Bandra East']?.benchmark_rate_inr_sqft || 58000, city: 'Mumbai Suburban' },
    { name: 'Thane West', rate: localityBenchmarks['Thane West']?.benchmark_rate_inr_sqft || 28500, city: 'Thane City' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 select-none">
      {/* 1. Valuation Confidence Distribution */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Valuation Confidence Breakdown</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {liveKpis.activePipeline} Cases Total
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="mt-4">
          <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div
              style={{ width: `${triage.high.pct}%` }}
              className="bg-emerald-500 hover:bg-emerald-600 transition-all"
              title={`High Confidence: ${triage.high.pct}%`}
            />
            <div
              style={{ width: `${triage.medium.pct}%` }}
              className="bg-amber-500 hover:bg-amber-600 transition-all"
              title={`Medium Confidence: ${triage.medium.pct}%`}
            />
            <div
              style={{ width: `${triage.low.pct}%` }}
              className="bg-rose-500 hover:bg-rose-600 transition-all"
              title={`Low Confidence: ${triage.low.pct}%`}
            />
          </div>
        </div>

        {/* Breakdown details */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-200">High Model Confidence</span>
            </div>
            <div className="text-right font-mono">
              <span className="font-bold text-emerald-400">{triage.high.pct}%</span>
              <span className="text-slate-400 ml-1.5">({triage.high.count})</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-200">Medium Confidence</span>
            </div>
            <div className="text-right font-mono">
              <span className="font-bold text-amber-400">{triage.medium.pct}%</span>
              <span className="text-slate-400 ml-1.5">({triage.medium.count})</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-200">Low Confidence</span>
            </div>
            <div className="text-right font-mono">
              <span className="font-bold text-rose-400">{triage.low.pct}%</span>
              <span className="text-slate-400 ml-1.5">({triage.low.count})</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Micro-Market Rate Spotlight */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Micro-Market Rate Benchmarks</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            Calibrated Index
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {spotlightLocalities.map((loc) => (
            <div
              key={loc.name}
              onClick={() => onFilterLocality?.(loc.name)}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer transition-all space-y-1"
            >
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{loc.city}</span>
              <span className="font-bold text-white text-xs block truncate">{loc.name}</span>
              <span className="font-mono font-extrabold text-emerald-400 text-sm block">
                ₹{loc.rate.toLocaleString()}/sq.ft
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
