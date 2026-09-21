'use client';

import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, ChevronRight, Scale, TrendingUp, ShieldCheck } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface LiveTrackingTableProps {
  cases: CollateralAssessmentCase[];
  onSelectCase: (caseId: string) => void;
}

export const LiveTrackingTable: React.FC<LiveTrackingTableProps> = ({
  cases,
  onSelectCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'high_dev' | 'valuer_linked'>('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedTab === 'high_dev' && (!c.deviation || c.deviation.percentageDiff <= 10)) return false;
      if (selectedTab === 'valuer_linked' && c.status !== 'VALUER_LINKED') return false;

      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        c.caseId.toLowerCase().includes(q) ||
        c.borrowerName.toLowerCase().includes(q) ||
        c.propertyProfile.location.toLowerCase().includes(q) ||
        c.propertyProfile.propertyType.toLowerCase().includes(q)
      );
    });
  }, [cases, searchTerm, selectedTab]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden text-slate-100 text-xs select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/60">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Live Collateral Assessment Stream</span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
              {filteredCases.length} displaying
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time valuation indicative model vs. IBBI valuer report reconciliation stream across Mumbai &amp; Thane.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({cases.length})
            </button>
            <button
              onClick={() => setSelectedTab('high_dev')}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedTab === 'high_dev' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Deviation (&gt;10%)
            </button>
            <button
              onClick={() => setSelectedTab('valuer_linked')}
              className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedTab === 'valuer_linked' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Valuer Linked
            </button>
          </div>

          <div className="relative w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Applicant, ID, Locality..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3 px-4">Case ID &amp; Applicant</th>
              <th className="py-3 px-4">Locality &amp; Asset Profile</th>
              <th className="py-3 px-4 text-right">Facility Requested</th>
              <th className="py-3 px-4 text-right">Model Indicative</th>
              <th className="py-3 px-4 text-right">Valuer Assessed</th>
              <th className="py-3 px-4 text-center">Deviation %</th>
              <th className="py-3 px-4 text-center">Confidence</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredCases.map((c) => {
              const valuerVal = c.valuerReport?.assessedValue || 0;
              const pctDiff = c.deviation?.percentageDiff || 0;
              const isHighDev = pctDiff > 10;

              return (
                <tr
                  key={c.caseId}
                  onClick={() => onSelectCase(c.caseId)}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-white text-xs">{c.caseId}</div>
                    <div className="text-slate-300 font-semibold">{c.borrowerName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{c.propertyProfile.location}</div>
                    <div className="text-slate-400 text-[11px]">
                      {c.propertyProfile.bhk} &bull; {c.propertyProfile.carpetArea} sq.ft
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    ₹{(c.loanFacilityRequested / 1e7).toFixed(2)} Cr
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    ₹{(c.modelIndicativeValue / 1e7).toFixed(3)} Cr
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-blue-300">
                    {valuerVal > 0 ? `₹${(valuerVal / 1e7).toFixed(3)} Cr` : 'Pending'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHighDev
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {valuerVal > 0 ? `${pctDiff}%` : '0%'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {c.valuationConfidence}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.caseId);
                      }}
                      className="px-2.5 py-1 rounded bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-300 font-bold text-[11px] inline-flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>Reconcile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
