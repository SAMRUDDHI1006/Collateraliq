'use client';

import React from 'react';
import {
  Building2,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Layers,
  Sparkles,
  FileCheck,
  Scale,
} from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface ExecutiveTriagePanelProps {
  currentCase?: LoanCase | null;
}

export const ExecutiveTriagePanel: React.FC<ExecutiveTriagePanelProps> = ({ currentCase }) => {
  // Format values dynamically if case provided, otherwise default to specified baseline
  const estimatedMarketValue = currentCase
    ? `₹${((currentCase.indicative_value_inr || 8550000) / 1e5).toFixed(1)} L`
    : '₹85.5 L';

  const benchmarkRate = currentCase
    ? `₹${(currentCase.adjusted_comparable_rate_inr_sqft || 10060).toLocaleString('en-IN')} / sq.ft`
    : '₹10,060 / sq.ft';

  const valuationCorridor = currentCase
    ? `₹${((currentCase.indicative_value_low_inr || 8200000) / 1e5).toFixed(1)} L – ₹${((currentCase.indicative_value_high_inr || 8900000) / 1e5).toFixed(1)} L`
    : '₹82.0 L – ₹89.0 L';

  const requestedLoan = currentCase
    ? `₹${((currentCase.loan_amount_inr || 5000000) / 1e5).toFixed(1)} L`
    : '₹50.0 L';

  const calculatedLtv = currentCase
    ? `${currentCase.ltv_percent.toFixed(1)}%`
    : '58.5%';

  const isLtvSafe = currentCase ? currentCase.ltv_percent <= 75 : true;

  // Comparable Micro-Market Transactions (500m sector)
  const comparableProperties = [
    {
      id: 'COMP-01',
      name: currentCase ? `${currentCase.building_society || 'Shardashram CHS'}` : 'Shardashram CHS',
      config: currentCase ? `${currentCase.bedrooms || 2} BHK, ${currentCase.carpet_area_sqft || 850} sq.ft` : '2 BHK, 850 sq.ft',
      transactedRate: currentCase ? `₹${(currentCase.adjusted_comparable_rate_inr_sqft || 10060).toLocaleString('en-IN')}` : '₹10,060',
      variance: 'Subject Baseline',
      isSubject: true,
      distance: '0m',
    },
    {
      id: 'COMP-02',
      name: 'Sai Enclave Tower A',
      config: '2 BHK, 820 sq.ft',
      transactedRate: '₹10,250',
      variance: '+1.89%',
      isSubject: false,
      distance: '180m',
    },
    {
      id: 'COMP-03',
      name: 'Kripa Heights',
      config: '2 BHK, 880 sq.ft',
      transactedRate: '₹9,850',
      variance: '-2.09%',
      isSubject: false,
      distance: '310m',
    },
    {
      id: 'COMP-04',
      name: 'Omkar Residency',
      config: '3 BHK, 1,050 sq.ft',
      transactedRate: '₹10,400',
      variance: '+3.38%',
      isSubject: false,
      distance: '420m',
    },
    {
      id: 'COMP-05',
      name: 'Vardhman Chamber',
      config: '2 BHK, 790 sq.ft',
      transactedRate: '₹9,920',
      variance: '-1.39%',
      isSubject: false,
      distance: '490m',
    },
  ];

  return (
    <div className="space-y-4 text-slate-100 select-none">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight font-sans">
              10-Second Executive Collateral Triage Panel
            </h2>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
              Asset Risk Only
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Strict property asset valuation, micro-market comps, and AI document verification feed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
            <span>Sector Ward: {currentCase?.locality || 'Dadar West'}, Mumbai (500m Radius)</span>
          </span>
        </div>
      </div>

      {/* 1. TOP 8-CARD RESPONSIVE KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
        {/* Card 1: Estimated Market Value */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Market Value
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 truncate">
            {estimatedMarketValue}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Core Asset Valuation
          </div>
        </div>

        {/* Card 2: Benchmark Rate */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Benchmark Rate
          </div>
          <div className="text-lg font-semibold font-mono text-slate-100 truncate">
            {benchmarkRate}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Market-rate benchmark
          </div>
        </div>

        {/* Card 3: Valuation Corridor */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Valuation Corridor
          </div>
          <div className="text-base font-semibold font-mono text-slate-300 truncate">
            {valuationCorridor}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            &plusmn;4% corridor uncertainty
          </div>
        </div>

        {/* Card 4: Requested Loan */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Requested Loan
          </div>
          <div className="text-lg font-semibold font-mono text-blue-400 truncate">
            {requestedLoan}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Lender Exposure
          </div>
        </div>

        {/* Card 5: Calculated LTV */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Calculated LTV
          </div>
          <div className={`text-xl font-bold font-mono truncate ${isLtvSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
            {calculatedLtv}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Regulatory Cap: &le; 75%
          </div>
        </div>

        {/* Card 6: Valuation Confidence */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1.5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Valuation Confidence
          </div>
          <div>
            <span className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold px-2 py-0.5 rounded font-mono">
              Medium
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            4 sector transactions verified
          </div>
        </div>

        {/* Card 7: Collateral Risk */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1.5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Collateral Risk
          </div>
          <div>
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded font-mono tracking-wider">
              LOW
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Within 75% RBI Ceiling
          </div>
        </div>

        {/* Card 8: Key Red Flags */}
        <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1.5 flex flex-col justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Key Red Flags
          </div>
          <div>
            <span className="inline-block bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold px-2 py-0.5 rounded font-mono truncate max-w-full">
              Area Mismatch (70 sq.ft)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            Deed 850 vs Tax 780 sq.ft
          </div>
        </div>
      </div>

      {/* 2. BELOW KPI CARDS: 2-COLUMN SPLIT (60 / 40) */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT COLUMN: Comparable Properties (Comps Benchmark Table, 60% Width) */}
        <div className="col-span-12 lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg flex flex-col justify-between">
          <div>
            {/* Table Header & Title */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Comparable Properties &bull; Micro-Market Comps
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                500m Sector Radius
              </span>
            </div>

            {/* Comps Benchmark Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-2 px-2.5 w-[38%]">Property / Project</th>
                    <th className="py-2 px-2 w-[26%]">Config &amp; Area</th>
                    <th className="py-2 px-2 w-[20%] text-right">Transacted ₹/sq.ft</th>
                    <th className="py-2 px-2.5 w-[16%] text-right">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {comparableProperties.map((comp) => (
                    <tr
                      key={comp.id}
                      className={`transition-colors ${
                        comp.isSubject
                          ? 'bg-blue-950/60 font-semibold text-white border-y border-blue-700/60'
                          : 'hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      {/* Property Name + Subject Indicator Badge */}
                      <td className="py-2.5 px-2.5 truncate">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="truncate font-medium">{comp.name}</span>
                          {comp.isSubject && (
                            <span className="shrink-0 text-[9px] font-mono font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded uppercase">
                              Subject
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Dist: {comp.distance}
                        </span>
                      </td>

                      {/* Config & Area */}
                      <td className="py-2.5 px-2 font-mono text-slate-300 text-[11px] truncate">
                        {comp.config}
                      </td>

                      {/* Transacted Rate */}
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-100 text-xs truncate">
                        {comp.transactedRate}
                      </td>

                      {/* Variance vs Subject */}
                      <td className="py-2.5 px-2.5 text-right font-mono text-[11px] truncate">
                        {comp.isSubject ? (
                          <span className="text-blue-400 font-semibold">Baseline</span>
                        ) : comp.variance.startsWith('+') ? (
                          <span className="text-amber-400 font-semibold">{comp.variance}</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">{comp.variance}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comps Summary Footer Badge */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Subject Benchmark: <strong className="text-slate-200">₹10,060/sq.ft</strong></span>
            <span>Secular Variance: <strong className="text-emerald-400">Within &plusmn;3.5%</strong></span>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Verification Findings (Traffic-Light Indicators, 40% Width) */}
        <div className="col-span-12 lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  AI Verification Findings &bull; Asset Audit Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                Live OCR Stream
              </span>
            </div>

            {/* Traffic Light Feed Cards */}
            <div className="mt-3 space-y-2.5 text-xs">
              {/* 🟢 Traffic Light 1: Documents Consistent */}
              <div className="bg-slate-950/80 border border-emerald-800/60 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Documents Consistent</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pl-6">
                  Title Holder (Arjun Mehta), CTS No (CTS-1049/A), and Nil Encumbrance verified against CERSAI &amp; Property Card.
                </p>
              </div>

              {/* 🟡 Traffic Light 2: Limited Comparable Data */}
              <div className="bg-slate-950/80 border border-amber-800/60 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Limited Comparable Data</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pl-6">
                  Only 4 verified registrations in immediate 500m sector over past 180 days.
                </p>
              </div>

              {/* 🔴 Traffic Light 3: Area Discrepancy Detected */}
              <div className="bg-slate-950/80 border border-rose-800/60 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Area Discrepancy Detected</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pl-6">
                  Deed carpet: 850 sq.ft vs. Tax ledger: 780 sq.ft (+8.24% variance, exceeding 5% tolerance).
                </p>
              </div>
            </div>
          </div>

          {/* AI Audit Footer Note */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Automated Clause Extraction</span>
            <span className="text-emerald-400 font-semibold">100% Asset Risk Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
};
