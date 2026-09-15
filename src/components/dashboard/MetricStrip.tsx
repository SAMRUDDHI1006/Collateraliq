'use client';

import React from 'react';
import { Layers, Clock, AlertTriangle, Percent, Info, ShieldCheck } from 'lucide-react';
import { LiveKpis } from '@/context/CaseContext';

interface MetricStripProps {
  liveKpis: LiveKpis;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ liveKpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Active Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Pipeline
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
            {liveKpis.activePipeline.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-500">Cases</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2">
          <span>LAP: {liveKpis.lapExposure.caseCount.toLocaleString('en-IN')}</span>
          <span className="text-slate-300">&bull;</span>
          <span>Home Loans: {liveKpis.homeLoanExposure.caseCount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 2. Pending Valuer Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Valuer Review
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-amber-600 tracking-tight tabular-nums">
            {liveKpis.pendingValuerReview.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-500">Dockets</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded flex items-center justify-between border border-amber-200/60">
          <span>{liveKpis.scheduledInspections.toLocaleString('en-IN')} Inspections Scheduled</span>
          <span className="text-[10px] uppercase font-bold text-amber-600">IBBI</span>
        </div>
      </div>

      {/* 3. Document Exceptions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Document Exceptions
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-rose-600 tracking-tight tabular-nums">
            {liveKpis.flaggedExceptions.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-500">Flagged</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
          <span>Requiring Manual Clearance</span>
          <span className="text-slate-400 font-mono text-[10px]">
            {liveKpis.activePipeline > 0
              ? ((liveKpis.flaggedExceptions / liveKpis.activePipeline) * 100).toFixed(1)
              : '0.0'}%
          </span>
        </div>
      </div>

      {/* 4. Portfolio Avg LTV */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Portfolio Avg LTV
            </span>
            <div className="group relative cursor-pointer" title="RBI Master Direction Prudential Ceiling: 75%">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-emerald-600 tracking-tight tabular-nums">
            {liveKpis.portfolioAvgLtv.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Prudential Safety
          </span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1.5 border-t border-slate-100 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Within RBI &lt;75% Prudential Ceiling</span>
        </div>
      </div>
    </div>
  );
};
