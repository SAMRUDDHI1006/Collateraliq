'use client';

import React, { useState } from 'react';
import { Scale, Search, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface ValuerQueueViewProps {
  cases: CollateralAssessmentCase[];
  onSelectCase: (caseId: string) => void;
}

export const ValuerQueueView: React.FC<ValuerQueueViewProps> = ({
  cases,
  onSelectCase,
}) => {
  const [search, setSearch] = useState<string>('');

  const filtered = cases.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      return (
        c.caseId.toLowerCase().includes(q) ||
        c.borrowerName.toLowerCase().includes(q) ||
        c.propertyProfile.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 text-xs select-none font-sans">
      {/* Header Banner */}
      <div className="bg-[#101824] rounded-xl border border-white/10 p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
        <div>
          <div className="flex items-center gap-2 font-heading font-bold text-base text-white tracking-tight">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>Valuer &amp; Physical Inspection Reconciliation Queue</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            IBBI Registered Valuer assignments &amp; valuation reconciliation for residential property dockets.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold tabular-nums">
            {cases.length} Total Queue
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#101824] rounded-xl border border-white/10 p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Case ID, Borrower, or Locality..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0B111A] border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono transition-all"
          />
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-2">
        {filtered.map((c) => {
          const valuerVal = c.valuerReport?.assessedValue || 0;

          return (
            <div
              key={c.caseId}
              onClick={() => onSelectCase(c.caseId)}
              className="p-4 bg-[#101824] rounded-xl border border-white/10 hover:border-cyan-500/50 hover:bg-[#141E2B] transition-all cursor-pointer flex items-center justify-between card-hover-lift shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-xs">{c.caseId}</span>
                  <span className="font-bold text-slate-200">{c.borrowerName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                    {c.propertyProfile.location}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {c.propertyProfile.bhk} &bull; {c.propertyProfile.carpetArea} sq.ft &bull; Facility: ₹{(c.loanFacilityRequested / 1e7).toFixed(2)} Cr
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Model Indicative</span>
                  <span className="font-bold text-emerald-400 text-xs tabular-nums">₹{(c.modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">Valuer Assessed</span>
                  <span className="font-bold text-cyan-300 text-xs tabular-nums">
                    {valuerVal > 0 ? `₹${(valuerVal / 1e7).toFixed(3)} Cr` : 'Pending'}
                  </span>
                </div>

                <button className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
