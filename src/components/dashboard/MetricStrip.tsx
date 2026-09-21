'use client';

import React from 'react';
import { Layers, Clock, AlertTriangle, Percent, Info } from 'lucide-react';
import { LiveKpis } from '@/context/CaseContext';

interface MetricStripProps {
  liveKpis: LiveKpis;
}

export const MetricStrip: React.FC<MetricStripProps> = ({ liveKpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {/* 1. Active Pipeline */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Active Pipeline
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold font-mono text-white tracking-tight tabular-nums">
            {liveKpis.activePipeline.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-400">Cases</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Total Pipeline Sanction Amount:</span>
          <span className="text-emerald-400 font-bold">₹{liveKpis.aggregatedSanctionPipelineCr} Cr</span>
        </div>
      </div>

      {/* 2. Pending Valuer Review */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Pending Valuer Linkage
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold font-mono text-amber-400 tracking-tight tabular-nums">
            {liveKpis.pendingValuerReview.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-400">Cases</span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded flex items-center justify-between border border-amber-800/60 font-mono">
          <span>Awaiting Valuer Submission</span>
          <span className="text-[10px] uppercase font-bold text-amber-400">IBBI</span>
        </div>
      </div>

      {/* 3. Valuation Deviation Alerts */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Valuation Deviation Alerts
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold font-mono text-rose-400 tracking-tight tabular-nums">
            {liveKpis.highDeviationAlerts.toLocaleString('en-IN')}
          </span>
          <span className="text-xs font-medium text-slate-400">High (&gt;10%)</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Manual Review Mandated</span>
          <span className="text-rose-400 font-bold">
            {liveKpis.activePipeline > 0
              ? ((liveKpis.highDeviationAlerts / liveKpis.activePipeline) * 100).toFixed(1)
              : '0.0'}%
          </span>
        </div>
      </div>

      {/* 4. Portfolio Avg LTV */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Portfolio Avg LTV
            </span>
            <div className="group relative cursor-pointer" title="RBI Master Direction Prudential Ceiling: 75%">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold font-mono text-emerald-400 tracking-tight tabular-nums">
            {liveKpis.portfolioAvgLtv.toFixed(1)}%
          </span>
          <span className="text-xs font-medium text-slate-400">&le; 75% RBI Cap</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono">
          <span>Status:</span>
          <span className="text-emerald-400 font-bold">Prudentially Compliant</span>
        </div>
      </div>
    </div>
  );
};
