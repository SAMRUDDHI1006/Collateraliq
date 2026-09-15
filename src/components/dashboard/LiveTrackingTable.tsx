'use client';

import React, { useState, useMemo } from 'react';
import { ExternalLink, Filter, AlertCircle, CheckCircle, Clock, ChevronRight, Search } from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface LiveTrackingTableProps {
  cases: LoanCase[];
  onSelectCase: (caseId: string) => void;
  onTabChange?: (tab: string) => void;
  selectedTab?: string;
}

export const LiveTrackingTable: React.FC<LiveTrackingTableProps> = ({
  cases,
  onSelectCase,
  onTabChange,
  selectedTab = 'all',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic tab counts derived from the live cases array
  const tabCounts = useMemo(() => {
    let exceptions = 0;
    let valuerQueue = 0;
    let highRisk = 0;
    let lowRisk = 0;
    for (const c of cases) {
      if (c.exceptions && c.exceptions !== 'None') exceptions++;
      if (c.valuer_status === 'Pending' || c.valuer_status === 'Inspection Scheduled') valuerQueue++;
      if (c.collateral_assessment.includes('HIGH')) highRisk++;
      if (c.collateral_assessment.includes('LOW')) lowRisk++;
    }
    return {
      all: cases.length,
      exceptions,
      valuer_queue: valuerQueue,
      high_risk: highRisk,
      low_risk: lowRisk,
    };
  }, [cases]);

  const tabs = [
    { id: 'all', label: 'All Dockets', count: tabCounts.all.toLocaleString('en-IN') },
    { id: 'exceptions', label: 'Exceptions Flagged', count: tabCounts.exceptions.toLocaleString('en-IN') },
    { id: 'valuer_queue', label: 'Valuer Queue', count: tabCounts.valuer_queue.toLocaleString('en-IN') },
    { id: 'high_risk', label: 'High Review', count: tabCounts.high_risk.toLocaleString('en-IN') },
    { id: 'low_risk', label: 'Low Risk Cleared', count: tabCounts.low_risk.toLocaleString('en-IN') },
  ];

  const filteredCases = cases.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.case_id.toLowerCase().includes(q) ||
      c.borrower_name.toLowerCase().includes(q) ||
      c.locality.toLowerCase().includes(q) ||
      c.loan_product.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header with Tabs and Filter */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Live Collateral Verification Stream</span>
            <span className="text-[11px] font-normal text-slate-600">
              ({filteredCases.length} displaying)
            </span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time pipeline intake, document reconciliation, and valuation triage across Mumbai &amp; Thane.
          </p>
        </div>

        {/* Search inside table */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name, ID, locality..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`py-3 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stream Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase tracking-wider font-semibold text-slate-600">
              <th className="py-2.5 px-3 w-[14%]">Case ID</th>
              <th className="py-2.5 px-3 w-[18%]">Borrower &amp; Business</th>
              <th className="py-2.5 px-3 w-[13%]">Facility &amp; Amount</th>
              <th className="py-2.5 px-3 w-[15%]">Locality &amp; Asset</th>
              <th className="py-2.5 px-3 w-[13%] text-right">Indicative Valuation</th>
              <th className="py-2.5 px-3 w-[8%] text-center">LTV Ratio</th>
              <th className="py-2.5 px-3 w-[11%]">Collateral Triage</th>
              <th className="py-2.5 px-3 w-[8%]">Valuer Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredCases.map((c) => {
              const isMedium = c.collateral_assessment.includes('MEDIUM');
              const isHigh = c.collateral_assessment.includes('HIGH');
              const isFlagship = c.case_id === 'CLIQ-DADAR-001';

              return (
                <tr
                  key={c.case_id}
                  onClick={() => onSelectCase(c.case_id)}
                  className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                    isFlagship ? 'bg-amber-50/25 border-l-4 border-l-amber-500' : ''
                  }`}
                >
                  {/* Case ID */}
                  <td className="py-2.5 px-3 whitespace-nowrap min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono font-bold text-slate-900 truncate">{c.case_id}</span>
                      {isFlagship && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                          Flagship
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5 truncate">CTS: 412/A Mahim</div>
                  </td>

                  {/* Borrower & Business */}
                  <td className="py-2.5 px-3 min-w-0">
                    <div className="font-semibold text-slate-900 truncate">{c.borrower_name}</div>
                    <div className="text-[11px] text-slate-600 truncate">
                      {c.employer_business || c.occupation} ({c.vintage_years}y vintage)
                    </div>
                  </td>

                  {/* Facility & Amount */}
                  <td className="py-2.5 px-3 whitespace-nowrap min-w-0">
                    <div className="font-mono font-bold text-slate-900 tabular-nums truncate">
                      ₹{(c.loan_amount_inr / 1e7).toFixed(2)} Cr
                    </div>
                    <div className="text-[10px] text-slate-600 truncate">
                      {c.loan_product === 'Loan Against Property (LAP)' ? 'LAP' : 'Home Loan'} &bull; {c.tenure_years}y @ {c.interest_rate_percent}%
                    </div>
                  </td>

                  {/* Locality & Asset */}
                  <td className="py-2.5 px-3 min-w-0">
                    <div className="font-semibold text-slate-800 flex items-center gap-1 min-w-0">
                      <span className="truncate">{c.locality}</span>
                      <span className="text-[10px] font-mono text-slate-600 font-normal shrink-0">({c.city})</span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono tabular-nums truncate">
                      {c.carpet_area_sqft} sq.ft &bull; Flr {c.floor}/{c.total_floors}
                    </div>
                  </td>

                  {/* Indicative Valuation */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap min-w-0">
                    <div className="font-mono font-bold text-slate-900 tabular-nums truncate">
                      ₹{(c.indicative_value_inr / 1e7).toFixed(3)} Cr
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono tabular-nums truncate">
                      @ ₹{(c.adjusted_comparable_rate_inr_sqft).toLocaleString('en-IN')}/sq.ft
                    </div>
                  </td>

                  {/* LTV Ratio */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap min-w-0">
                    <span
                      className={`inline-block font-mono font-bold px-1.5 py-0.5 rounded text-[11px] tabular-nums ${
                        c.ltv_percent > 75
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : c.ltv_percent > 60
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {c.ltv_percent.toFixed(1)}%
                    </span>
                    <div className="text-[9px] text-slate-600 mt-0.5 truncate">Cov: {c.collateral_coverage_x.toFixed(2)}x</div>
                  </td>

                  {/* Collateral Triage Status */}
                  <td className="py-2.5 px-3 whitespace-nowrap min-w-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight truncate max-w-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isMedium
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isHigh ? (
                        <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                      ) : isMedium ? (
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      )}
                      <span className="truncate">{c.collateral_assessment}</span>
                    </span>
                    {c.exceptions && c.exceptions !== 'None' && (
                      <div className="text-[10px] text-amber-700 truncate mt-0.5" title={c.exceptions}>
                        {c.exceptions}
                      </div>
                    )}
                  </td>

                  {/* Valuer Status */}
                  <td className="py-2.5 px-3 whitespace-nowrap min-w-0">
                    <div className="flex items-center gap-1 text-[11px] min-w-0">
                      <Clock className="w-3 h-3 text-slate-600 shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{c.valuer_status}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-3 text-right whitespace-nowrap shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(c.case_id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-md font-medium text-xs transition-colors border border-slate-200"
                    >
                      <span>Verify</span>
                      <ChevronRight className="w-3 h-3" />
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
