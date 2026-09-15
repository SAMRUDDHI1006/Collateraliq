'use client';

import React, { useState } from 'react';
import { Scale, Clock, CheckCircle2, Calendar, MapPin, Search, ChevronRight, UserCheck } from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface ValuerQueueViewProps {
  cases: LoanCase[];
  onSelectCase: (caseId: string) => void;
}

export const ValuerQueueView: React.FC<ValuerQueueViewProps> = ({
  cases,
  onSelectCase,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocality, setFilterLocality] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const valuerCases = cases.filter(
    (c) => c.valuer_status === 'Pending' || c.valuer_status === 'Inspection Scheduled' || c.valuer_status === 'Completed'
  );

  const filtered = valuerCases.filter((c) => {
    if (filterStatus !== 'all' && c.valuer_status !== filterStatus) return false;
    if (filterLocality !== 'all' && c.locality !== filterLocality) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.case_id.toLowerCase().includes(q) ||
        c.borrower_name.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const localities = Array.from(new Set(cases.map((c) => c.locality))).sort();

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Scale className="w-5 h-5 text-amber-600" />
            <span>Valuer &amp; Physical Inspection Allocation Queue</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mandatory IBBI Registered Valuer assignments for property dockets with area variances or high-ticket exposures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs font-bold">
            1,526 Queue Total
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-mono text-xs font-bold">
            597 Scheduled
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Case ID or Borrower..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50"
          >
            <option value="all">All Inspection Statuses</option>
            <option value="Pending">Pending Assignment (1,526)</option>
            <option value="Inspection Scheduled">Inspection Scheduled (597)</option>
            <option value="Completed">Completed (877)</option>
          </select>

          <select
            value={filterLocality}
            onChange={(e) => setFilterLocality(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-slate-50"
          >
            <option value="all">All 22 Micro-Markets</option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-600">
              <th className="py-3 px-4">Case Reference</th>
              <th className="py-3 px-4">Borrower</th>
              <th className="py-3 px-4">Property &amp; Micro-Market</th>
              <th className="py-3 px-4 text-right">Carpet Area</th>
              <th className="py-3 px-4 text-right">Indicative Value</th>
              <th className="py-3 px-4">Valuer Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((c) => (
              <tr
                key={c.case_id}
                onClick={() => onSelectCase(c.case_id)}
                className="hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                  {c.case_id}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  {c.borrower_name}
                  <div className="text-[10px] text-slate-600 font-normal">{c.loan_product}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-900">{c.locality}</div>
                  <div className="text-[10px] text-slate-600">{c.property_address}</div>
                </td>
                <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                  {c.carpet_area_sqft} sq.ft
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                  ₹{(c.indicative_value_inr / 1e7).toFixed(2)} Cr
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.valuer_status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.valuer_status === 'Inspection Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{c.valuer_status}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCase(c.case_id);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white font-semibold text-slate-700 transition-colors"
                  >
                    Open Docket &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
