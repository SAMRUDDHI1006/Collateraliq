'use client';

import React from 'react';
import { PieChart, TrendingUp, MapPin, Building, ShieldAlert } from 'lucide-react';
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

  // Key micro-markets highlight
  const spotlightLocalities = [
    { name: 'Worli', rate: localityBenchmarks['Worli']?.benchmark_rate_inr_sqft || 78100, city: 'Mumbai South' },
    { name: 'Dadar West', rate: localityBenchmarks['Dadar West']?.benchmark_rate_inr_sqft || 55000, city: 'Mumbai Central' },
    { name: 'Andheri West', rate: localityBenchmarks['Andheri West']?.benchmark_rate_inr_sqft || 46200, city: 'Mumbai Western' },
    { name: 'Thane West', rate: localityBenchmarks['Thane West']?.benchmark_rate_inr_sqft || 30000, city: 'Thane City' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Triage Breakdown Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Collateral Triage Distribution</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            {liveKpis.activePipeline.toLocaleString('en-IN')} Portfolio Total
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="mt-4">
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${triage.medium_review.pct}%` }}
              className="bg-amber-500 hover:bg-amber-600 transition-all"
              title={`Medium Review Required: ${triage.medium_review.pct}%`}
            />
            <div
              style={{ width: `${triage.low_risk.pct}%` }}
              className="bg-emerald-500 hover:bg-emerald-600 transition-all"
              title={`Low Risk: ${triage.low_risk.pct}%`}
            />
            <div
              style={{ width: `${triage.high_review.pct}%` }}
              className="bg-rose-500 hover:bg-rose-600 transition-all"
              title={`High Review Required: ${triage.high_review.pct}%`}
            />
          </div>
        </div>

        {/* Breakdown details */}
        <div className="mt-4 space-y-2.5">
          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-slate-800">Medium Review Required</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-amber-700 tabular-nums">
                {triage.medium_review.pct}%
              </span>
              <span className="text-[11px] text-slate-600 ml-1.5 font-mono">
                ({triage.medium_review.count.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-800">Low - Review Complete</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
                {triage.low_risk.pct}%
              </span>
              <span className="text-[11px] text-slate-600 ml-1.5 font-mono">
                ({triage.low_risk.count.toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50/60 border border-rose-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-xs font-semibold text-slate-800">High - Review Required</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-rose-700 tabular-nums">
                {triage.high_review.pct}%
              </span>
              <span className="text-[11px] text-slate-600 ml-1.5 font-mono">
                ({triage.high_review.count.toLocaleString('en-IN')})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-slate-600 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Qualitative triage protocol &bull; No numeric black-box scoring</span>
        </div>
      </div>

      {/* 2. Portfolio Exposure (LAP vs Home Loans) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Portfolio Facility Exposure</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            22 Micro-Markets
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* LAP */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Loan Against Property
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-slate-900 tabular-nums">
              {liveKpis.lapExposure.caseCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">cases active</div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
              <span className="text-[10px] text-slate-600">Avg Ticket:</span>
              <span className="font-mono font-bold text-xs text-blue-700">₹{liveKpis.lapExposure.avgTicketCr} Cr</span>
            </div>
          </div>

          {/* Home Loans */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Home Loans (HL)
            </div>
            <div className="mt-2 text-xl font-bold font-mono text-slate-900 tabular-nums">
              {liveKpis.homeLoanExposure.caseCount.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">cases active</div>
            <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-baseline justify-between">
              <span className="text-[10px] text-slate-600">Avg Ticket:</span>
              <span className="font-mono font-bold text-xs text-blue-700">₹{liveKpis.homeLoanExposure.avgTicketCr} Cr</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
          <div className="font-semibold text-blue-900 flex items-center justify-between">
            <span>Aggregated Sanction Pipeline</span>
            <span className="font-mono font-bold">~₹{liveKpis.aggregatedSanctionPipelineCr.toLocaleString('en-IN')} Cr</span>
          </div>
          <div className="text-[11px] text-blue-800/80 mt-1">
            Compliant with RBI Circular DOR.CRE.REC.47/08.12.001 prudential caps on commercial &amp; residential risk weights.
          </div>
        </div>
      </div>

      {/* 3. Micro-Market Valuation Benchmarks */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Micro-Market Benchmarks</h3>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Official Anchors
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {spotlightLocalities.map((loc) => (
            <div
              key={loc.name}
              onClick={() => onFilterLocality?.(loc.name)}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100 cursor-pointer transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>{loc.name}</span>
                  <span className="text-[10px] font-normal text-slate-600">({loc.city})</span>
                </div>
                <div className="text-[10px] text-slate-600">Govt aligned comp rate</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-xs text-slate-900 tabular-nums">
                  ₹{loc.rate.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-600 font-mono">per sq.ft</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Total {Object.keys(localityBenchmarks).length} Sub-markets indexed</span>
          <span className="text-blue-600 font-semibold hover:underline cursor-pointer">
            View All Locality Rates &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
