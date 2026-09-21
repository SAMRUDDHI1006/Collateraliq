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
    <header className="shrink-0 h-12 w-full bg-slate-900 text-white z-40 border-b border-slate-800 flex items-center justify-between px-4 shadow-sm select-none">
      {/* Left: Brand wordmark & subtitle */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">Collateral<span className="text-blue-400 font-extrabold">IQ</span></span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60">
              v2.4 Pro
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide leading-none mt-0.5">
            Collateral Intelligence Suite
          </p>
        </div>
      </div>

      {/* Center: Global search input (width: 440px, ⌘K) */}
      <div className="relative w-[440px] max-w-[440px] hidden md:block">
        <div
          className={`flex items-center gap-2 bg-slate-800/90 border rounded-lg px-3 py-1.5 transition-all ${
            isSearchFocused
              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-800'
              : 'border-slate-700 hover:border-slate-600'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search Case ID (e.g. CLIQ-DADAR-001), Borrower, Locality..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-slate-900/80 border border-slate-700 px-1.5 py-0.5 rounded shadow-inner shrink-0">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Quick search dropdown */}
        {isSearchFocused && filteredQuickResults.length > 0 && (
          <div className="absolute top-[42px] left-0 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-950/60 border-b border-slate-800">
              Direct Docket Matches ({filteredQuickResults.length})
            </div>
            {filteredQuickResults.map((item) => (
              <div
                key={item.caseId}
                onMouseDown={() => {
                  onSearchSelectCase?.(item.caseId);
                  setSearchQuery('');
                }}
                className="px-3 py-2 text-xs hover:bg-slate-800 cursor-pointer flex items-center justify-between border-b border-slate-800/60 last:border-b-0 transition-colors"
              >
                <div>
                  <div className="font-semibold text-slate-100 font-mono flex items-center gap-1.5">
                    {item.caseId}
                    <span className="text-[10px] px-1 py-0.2 rounded font-sans text-slate-300 bg-slate-700">
                      {item.propertyProfile.location}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.borrowerName} &bull; ₹{(item.loanFacilityRequested / 1e7).toFixed(2)} Cr
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Live Engine Indicator, Notifications, User Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/70 text-emerald-300 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] tracking-tight">Intelligence Engine Active</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            title="Exception Notifications"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div
          onClick={onOpenProfileDrawer}
          title="View Officer Profile & Session Telemetry"
          className="flex items-center gap-3 pl-3 border-l border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/30">
            SC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Samruddhi Chaudhari</div>
            <div className="text-[10px] text-slate-400 font-medium">Senior Credit Risk Officer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
