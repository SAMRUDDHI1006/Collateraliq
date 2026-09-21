'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Bell } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface TopNavbarProps {
  onSearchSelectCase?: (caseId: string) => void;
  onOpenIntakeModal?: () => void;
  onOpenProfileDrawer?: () => void;
  activeCases?: CollateralAssessmentCase[];
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onSearchSelectCase,
  onOpenProfileDrawer,
  activeCases = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredQuickResults = searchQuery.trim()
    ? activeCases.filter(
        (c) =>
          c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.propertyProfile.location.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="shrink-0 h-13 w-full bg-[#0B111A] text-[#F8FAFC] z-40 border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 shadow-sm select-none">
      {/* Left: Brand wordmark & subtitle */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
          <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white font-heading">
              Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-normal">v2.4</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] font-medium tracking-wide leading-none mt-0.5">
            Collateral Intelligence Suite
          </p>
        </div>
      </div>

      {/* Center: Global search input (width: 440px, ⌘K) */}
      <div className="relative w-[440px] max-w-[440px] hidden md:block">
        <div
          className={`flex items-center gap-2 bg-[#101824] border rounded-xl px-3.5 py-1.5 transition-all ${
            isSearchFocused
              ? 'border-cyan-400 ring-2 ring-cyan-400/20 bg-[#141E2B]'
              : 'border-white/[0.10] hover:border-white/[0.20]'
          }`}
        >
          <Search className="w-4 h-4 text-[#94A3B8] shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search Case ID, Borrower, Locality..."
            className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-[#94A3B8] bg-[#0B111A] border border-white/[0.12] px-1.5 py-0.5 rounded shadow-inner shrink-0">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Quick search dropdown */}
        {isSearchFocused && filteredQuickResults.length > 0 && (
          <div className="absolute top-[46px] left-0 right-0 bg-[#101824] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3.5 py-2 text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8] bg-[#0B111A] border-b border-white/[0.08]">
              Direct Docket Matches ({filteredQuickResults.length})
            </div>
            {filteredQuickResults.map((item) => (
              <div
                key={item.caseId}
                onMouseDown={() => {
                  onSearchSelectCase?.(item.caseId);
                  setSearchQuery('');
                }}
                className="px-3.5 py-2.5 text-xs hover:bg-white/[0.04] cursor-pointer flex items-center justify-between border-b border-white/[0.04] last:border-b-0 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-100 font-mono flex items-center gap-2">
                    <span className="text-cyan-400">{item.caseId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-sans text-slate-300 bg-white/[0.06]">
                      {item.propertyProfile.location}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    {item.borrowerName} &bull; ₹{(item.loanFacilityRequested / 1e7).toFixed(2)} Cr
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Exception Notifications"
            className="relative p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors focus:outline-none cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
          </button>
        </div>

        <div
          onClick={onOpenProfileDrawer}
          title="View Officer Profile & Session Telemetry"
          className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08] cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center ring-2 ring-cyan-500/30 shadow-sm">
            SC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Samruddhi Chaudhari</div>
            <div className="text-[10px] text-[#94A3B8] font-medium">Senior Credit Risk Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
