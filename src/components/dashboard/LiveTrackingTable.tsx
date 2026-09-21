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
    <div className="bg-[#101824] rounded-2xl border border-white/[0.08] shadow-card overflow-hidden text-[#F8FAFC] text-xs select-none">
      {/* Top Filter Bar */}
      <div className="p-4 border-b border-white/[0.06] bg-[#0B111A]/90 space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
              <span>Live Case Portfolio Table</span>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-full font-semibold">
                {totalFilteredCount.toLocaleString('en-IN')} Cases
              </span>
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Interactive 3,000-case portfolio table. Filter by product, region, review priority, LTV ceiling, or deviation.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search Case ID or Borrower..."
              className="w-full text-xs pl-8.5 pr-3 py-1.5 bg-[#101824] border border-white/[0.12] rounded-xl text-white placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-400 font-mono transition-all"
            />
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 font-sans text-xs">
          {/* Product Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Product</label>
            <select
              value={filterProduct}
              onChange={(e) => { setFilterProduct(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All Products</option>
              <option value="Home Loan" className="bg-[#101824] text-slate-200">Home Loan</option>
              <option value="LAP" className="bg-[#101824] text-slate-200">LAP</option>
              <option value="Balance Transfer" className="bg-[#101824] text-slate-200">Balance Transfer</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Property Type</label>
            <select
              value={filterPropertyType}
              onChange={(e) => { setFilterPropertyType(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All Types</option>
              <option value="Apartment" className="bg-[#101824] text-slate-200">Apartment</option>
              <option value="Independent House" className="bg-[#101824] text-slate-200">Independent House</option>
              <option value="Bungalow" className="bg-[#101824] text-slate-200">Bungalow</option>
              <option value="Villa" className="bg-[#101824] text-slate-200">Villa</option>
            </select>
          </div>

          {/* Region Filter (22 Predefined) */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Region (22)</label>
            <select
              value={filterRegion}
              onChange={(e) => { setFilterRegion(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All 22 Regions</option>
              {REGIONS_22.map((r) => (
                <option key={r} value={r} className="bg-[#101824] text-slate-200">{r}</option>
              ))}
            </select>
          </div>

          {/* Review Level Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Review Level</label>
            <select
              value={filterReviewLevel}
              onChange={(e) => { setFilterReviewLevel(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All Review Levels</option>
              <option value="LOW" className="bg-[#101824] text-slate-200">🟢 Low Review</option>
              <option value="MEDIUM" className="bg-[#101824] text-slate-200">🟡 Medium Review</option>
              <option value="HIGH" className="bg-[#101824] text-slate-200">🔴 High Review</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All Statuses</option>
              <option value="ACTIVE" className="bg-[#101824] text-slate-200">Active</option>
              <option value="COMPLETED" className="bg-[#101824] text-slate-200">Completed</option>
              <option value="PENDING_VALUATION" className="bg-[#101824] text-slate-200">Pending Valuer</option>
            </select>
          </div>

          {/* LTV Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">LTV Range</label>
            <select
              value={filterLtv}
              onChange={(e) => { setFilterLtv(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All LTV</option>
              <option value="<50" className="bg-[#101824] text-slate-200">&lt; 50%</option>
              <option value="50-65" className="bg-[#101824] text-slate-200">50% - 65%</option>
              <option value="65-75" className="bg-[#101824] text-slate-200">65% - 75%</option>
              <option value=">75" className="bg-[#101824] text-slate-200">&gt; 75% Cap</option>
            </select>
          </div>

          {/* Deviation Filter */}
          <div>
            <label className="text-[10px] font-mono text-[#94A3B8] uppercase block mb-1">Deviation</label>
            <select
              value={filterDev}
              onChange={(e) => { setFilterDev(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#101824] text-slate-200 border border-white/[0.10] rounded-lg px-2 py-1 text-[11px] font-medium focus:border-cyan-400 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL" className="bg-[#101824] text-slate-200">All Deviations</option>
              <option value="<3" className="bg-[#101824] text-slate-200">&lt; 3%</option>
              <option value="3-8" className="bg-[#101824] text-slate-200">3% - 8%</option>
              <option value=">8" className="bg-[#101824] text-slate-200">&gt; 8% High</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-1.5 bg-[#141E2B] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-white/[0.10] rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-150"
            >
              <RotateCcw className="w-3 h-3 text-[#94A3B8]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse table-fixed">
          <thead>
            <tr className="bg-[#0B111A] border-b border-white/[0.08] text-[#94A3B8] font-bold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3 px-3.5 w-28">Case ID</th>
              <th className="py-3 px-3.5 w-40">Borrower</th>
              <th className="py-3 px-3.5 w-28">Product</th>
              <th className="py-3 px-3.5 w-32">Region</th>
              <th className="py-3 px-3.5 text-right w-28">Facility</th>
              <th className="py-3 px-3.5 text-right w-28">Collateral</th>
              <th className="py-3 px-3.5 text-center w-20">LTV %</th>
              <th className="py-3 px-3.5 text-center w-24">Deviation</th>
              <th className="py-3 px-3.5 text-center w-28">Review Level</th>
              <th className="py-3 px-3.5 text-center w-20">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedCases.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#64748B] font-mono">
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
                    className="hover:bg-cyan-500/[0.03] cursor-pointer transition-colors duration-150 group"
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-cyan-400 group-hover:text-cyan-300 truncate">
                      {c.caseId}
                    </td>
                    <td className="py-3 px-3.5 font-semibold text-slate-100 group-hover:text-white truncate">
                      {c.borrowerName}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold ${
                        c.product === 'Home Loan' ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60' :
                        c.product === 'LAP' ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      }`}>
                        {c.product}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-[#94A3B8] font-medium truncate">
                      {c.propertyProfile.location}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-white tabular-nums">
                      ₹{(c.loanFacilityRequested / 1e7).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-emerald-400 tabular-nums">
                      ₹{(valuerVal / 1e7).toFixed(2)} Cr
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-200 tabular-nums">
                      {ltv.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        Math.abs(devPct) > 8 ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80' :
                        Math.abs(devPct) > 3 ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                      }`}>
                        {devPct > 0 ? `+${devPct}%` : `${devPct}%`}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        c.reviewLevel === 'LOW' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' :
                        c.reviewLevel === 'MEDIUM' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' :
                        'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                      }`}>
                        {c.reviewLevel === 'LOW' ? '🟢 LOW' : c.reviewLevel === 'MEDIUM' ? '🟡 MEDIUM' : '🔴 HIGH'}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c.caseId);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-bold text-[10px] inline-flex items-center gap-0.5 cursor-pointer shadow-xs transition-colors"
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
      <div className="p-3.5 bg-[#0B111A] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="text-[#94A3B8]">
          Showing <span className="text-white font-bold">{startIndex}–{endIndex}</span> of <span className="text-cyan-400 font-bold">{totalFilteredCount.toLocaleString('en-IN')}</span> cases
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#94A3B8]">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-[#101824] text-slate-200 border border-white/[0.12] rounded-lg px-2 py-0.5 text-xs font-bold cursor-pointer focus:outline-none focus:border-cyan-400"
            >
              <option value={25} className="bg-[#101824] text-slate-200">25</option>
              <option value={50} className="bg-[#101824] text-slate-200">50</option>
              <option value={100} className="bg-[#101824] text-slate-200">100</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-[#101824] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="text-slate-300 px-2 text-[11px]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-[#101824] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
