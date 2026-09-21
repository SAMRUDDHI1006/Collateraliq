'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, RotateCcw, ChevronLeft, ShieldAlert } from 'lucide-react';
import { CollateralAssessmentCase, LoanProduct, PropertyType, ReviewLevel, CaseStatus } from '@/types/collateral';
import { REGIONS_22 } from '@/lib/caseStore';

interface LiveTrackingTableProps {
  cases: CollateralAssessmentCase[];
  onSelectCase: (caseId: string) => void;
  filteredCases: CollateralAssessmentCase[];
  setFilterProduct: (p: string) => void;
  setFilterPropertyType: (t: string) => void;
  setFilterRegion: (r: string) => void;
  setFilterReviewLevel: (l: string) => void;
  filterProduct: string;
  filterPropertyType: string;
  filterRegion: string;
  filterReviewLevel: string;
}

export const LiveTrackingTable: React.FC<LiveTrackingTableProps> = ({
  cases,
  onSelectCase,
  filteredCases,
  setFilterProduct,
  setFilterPropertyType,
  setFilterRegion,
  setFilterReviewLevel,
  filterProduct,
  filterPropertyType,
  filterRegion,
  filterReviewLevel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterLtv, setFilterLtv] = useState<string>('ALL');
  const [filterDev, setFilterDev] = useState<string>('ALL');

  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Apply search and sub-filters
  const finalFilteredCases = useMemo(() => {
    return filteredCases.filter((c) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchId = c.caseId.toLowerCase().includes(q);
        const matchName = c.borrowerName.toLowerCase().includes(q);
        if (!matchId && !matchName) return false;
      }

      // Status
      if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;

      // LTV range
      const valuerOrModelVal = c.valuerReport?.assessedValue || c.modelIndicativeValue;
      const ltv = valuerOrModelVal > 0 ? (c.loanFacilityRequested / valuerOrModelVal) * 100 : 0;
      if (filterLtv === '<50' && ltv >= 50) return false;
      if (filterLtv === '50-65' && (ltv < 50 || ltv > 65)) return false;
      if (filterLtv === '65-75' && (ltv < 65 || ltv > 75)) return false;
      if (filterLtv === '>75' && ltv <= 75) return false;

      // Deviation range
      const dev = Math.abs(c.deviation?.percentageDiff || 0);
      if (filterDev === '<3' && dev >= 3) return false;
      if (filterDev === '3-8' && (dev < 3 || dev > 8)) return false;
      if (filterDev === '>8' && dev <= 8) return false;

      return true;
    });
  }, [filteredCases, searchTerm, filterStatus, filterLtv, filterDev]);

  const totalFilteredCount = finalFilteredCases.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return finalFilteredCases.slice(start, start + pageSize);
  }, [finalFilteredCases, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterProduct('ALL');
    setFilterPropertyType('ALL');
    setFilterRegion('ALL');
    setFilterReviewLevel('ALL');
    setFilterStatus('ALL');
    setFilterLtv('ALL');
    setFilterDev('ALL');
    setCurrentPage(1);
  };

  const startIndex = totalFilteredCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalFilteredCount);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden text-slate-100 text-xs select-none">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Live Case Portfolio Table</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                {totalFilteredCount.toLocaleString('en-IN')} Cases
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive 3,000-case portfolio table. Filter by product, region, review priority, LTV ceiling, or deviation.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Case ID or Borrower..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 font-sans text-xs">
          {/* Product Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Product</label>
            <select
              value={filterProduct}
              onChange={(e) => { setFilterProduct(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All Products</option>
              <option value="Home Loan" className="bg-white text-slate-900">Home Loan</option>
              <option value="LAP" className="bg-white text-slate-900">LAP</option>
              <option value="Balance Transfer" className="bg-white text-slate-900">Balance Transfer</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Property Type</label>
            <select
              value={filterPropertyType}
              onChange={(e) => { setFilterPropertyType(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All Types</option>
              <option value="Apartment" className="bg-white text-slate-900">Apartment</option>
              <option value="Independent House" className="bg-white text-slate-900">Independent House</option>
              <option value="Bungalow" className="bg-white text-slate-900">Bungalow</option>
              <option value="Villa" className="bg-white text-slate-900">Villa</option>
            </select>
          </div>

          {/* Region Filter (22 Predefined) */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Region (22)</label>
            <select
              value={filterRegion}
              onChange={(e) => { setFilterRegion(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All 22 Regions</option>
              {REGIONS_22.map((r) => (
                <option key={r} value={r} className="bg-white text-slate-900">{r}</option>
              ))}
            </select>
          </div>

          {/* Review Level Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Review Level</label>
            <select
              value={filterReviewLevel}
              onChange={(e) => { setFilterReviewLevel(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All Review Levels</option>
              <option value="LOW" className="bg-white text-slate-900">🟢 Low Review</option>
              <option value="MEDIUM" className="bg-white text-slate-900">🟡 Medium Review</option>
              <option value="HIGH" className="bg-white text-slate-900">🔴 High Review</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All Statuses</option>
              <option value="ACTIVE" className="bg-white text-slate-900">Active</option>
              <option value="COMPLETED" className="bg-white text-slate-900">Completed</option>
              <option value="PENDING_VALUATION" className="bg-white text-slate-900">Pending Valuer</option>
            </select>
          </div>

          {/* LTV Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">LTV Range</label>
            <select
              value={filterLtv}
              onChange={(e) => { setFilterLtv(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All LTV</option>
              <option value="<50" className="bg-white text-slate-900">&lt; 50%</option>
              <option value="50-65" className="bg-white text-slate-900">50% - 65%</option>
              <option value="65-75" className="bg-white text-slate-900">65% - 75%</option>
              <option value=">75" className="bg-white text-slate-900">&gt; 75% Cap</option>
            </select>
          </div>

          {/* Deviation Filter */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Deviation</label>
            <select
              value={filterDev}
              onChange={(e) => { setFilterDev(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
            >
              <option value="ALL" className="bg-white text-slate-900">All Deviations</option>
              <option value="<3" className="bg-white text-slate-900">&lt; 3%</option>
              <option value="3-8" className="bg-white text-slate-900">3% - 8%</option>
              <option value=">8" className="bg-white text-slate-900">&gt; 8% High</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-2.5 px-3 w-28">Case ID</th>
              <th className="py-2.5 px-3 w-40">Borrower</th>
              <th className="py-2.5 px-3 w-28">Product</th>
              <th className="py-2.5 px-3 w-32">Region</th>
              <th className="py-2.5 px-3 text-right w-28">Facility</th>
              <th className="py-2.5 px-3 text-right w-28">Collateral</th>
              <th className="py-2.5 px-3 text-center w-20">LTV %</th>
              <th className="py-2.5 px-3 text-center w-24">Deviation</th>
              <th className="py-2.5 px-3 text-center w-28">Review Level</th>
              <th className="py-2.5 px-3 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400 font-mono">
                  No cases match the selected filter criteria.
                </td>
              </tr>
            ) : (
              paginatedCases.map((c) => {
                const valuerVal = c.valuerReport?.assessedValue || c.modelIndicativeValue;
                const ltv = valuerVal > 0 ? (c.loanFacilityRequested / valuerVal) * 100 : 0;
                const devPct = c.deviation?.percentageDiff || 0;

                return (
                  <tr
                    key={c.caseId}
                    onClick={() => onSelectCase(c.caseId)}
                    className="hover:bg-slate-800/70 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-400 truncate">
                      {c.caseId}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-white truncate">
                      {c.borrowerName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        c.product === 'Home Loan' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                        c.product === 'LAP' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {c.product}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-medium truncate">
                      {c.propertyProfile.location}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                      ₹{(c.loanFacilityRequested / 1e7).toFixed(2)} Cr
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      ₹{(valuerVal / 1e7).toFixed(2)} Cr
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-200">
                      {ltv.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        Math.abs(devPct) > 8 ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        Math.abs(devPct) > 3 ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {devPct > 0 ? `+${devPct}%` : `${devPct}%`}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        c.reviewLevel === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        c.reviewLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {c.reviewLevel === 'LOW' ? '🟢 LOW' : c.reviewLevel === 'MEDIUM' ? '🟡 MEDIUM' : '🔴 HIGH'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.caseId);
                        }}
                        className="px-2 py-0.5 rounded bg-blue-900 hover:bg-blue-800 text-white font-bold text-[10px] inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="text-slate-400">
          Showing <span className="text-white font-bold">{startIndex}–{endIndex}</span> of <span className="text-emerald-400 font-bold">{totalFilteredCount.toLocaleString('en-IN')}</span> cases
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white text-slate-900 border border-slate-300 rounded px-2 py-0.5 text-xs font-bold cursor-pointer"
            >
              <option value={25} className="bg-white text-slate-900">25</option>
              <option value={50} className="bg-white text-slate-900">50</option>
              <option value={100} className="bg-white text-slate-900">100</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
