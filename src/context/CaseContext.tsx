'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { BenchmarksData, CollateralAssessmentCase, AuditLogItem } from '@/types/collateral';

// ─── Derived KPI Shape ───────────────────────────────────────────────
export interface LiveKpis {
  activePipeline: number;
  pendingValuerReview: number;
  highDeviationAlerts: number;
  portfolioAvgLtv: number;
  triageDistribution: {
    high: { count: number; pct: number };
    medium: { count: number; pct: number };
    low: { count: number; pct: number };
  };
  aggregatedSanctionPipelineCr: number;
}

// ─── Context Shape ───────────────────────────────────────────────────
interface CaseContextValue {
  // Core state
  cases: CollateralAssessmentCase[];
  benchmarks: BenchmarksData | null;
  auditLogs: AuditLogItem[];
  loading: boolean;

  // Derived live KPIs
  liveKpis: LiveKpis;

  // Locality list for dynamic dropdowns
  localityList: { name: string; rate: number }[];

  // Mutations
  addCase: (newCase: CollateralAssessmentCase) => void;
  setCases: React.Dispatch<React.SetStateAction<CollateralAssessmentCase[]>>;
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLogItem[]>>;
  setBenchmarks: React.Dispatch<React.SetStateAction<BenchmarksData | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const CaseContext = createContext<CaseContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────
export function useCaseStore(): CaseContextValue {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error('useCaseStore must be used inside <CaseProvider>');
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────
export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CollateralAssessmentCase[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarksData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Initial data fetch ────────────────────────────────────────────
  useEffect(() => {
    async function initData() {
      try {
        const [benchRes, casesRes, auditRes] = await Promise.all([
          fetch('/api/benchmarks'),
          fetch('/api/cases'),
          fetch('/api/audit'),
        ]);
        const benchData = await benchRes.json();
        const casesData = await casesRes.json();
        const auditData = await auditRes.json();

        setBenchmarks(benchData);
        setCases(casesData.cases || []);
        setAuditLogs(auditData.logs || []);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // ── addCase: prepend and trigger re-derive ────────────────────────
  const addCase = useCallback((newCase: CollateralAssessmentCase) => {
    setCases((prev) => [newCase, ...prev.filter((c) => c.caseId !== newCase.caseId)]);
  }, []);

  // ── Locality list for dropdown (from benchmarks) ──────────────────
  const localityList = useMemo(() => {
    if (!benchmarks?.locality_benchmarks) return [];
    return Object.entries(benchmarks.locality_benchmarks)
      .map(([name, data]) => ({
        name,
        rate: data.benchmark_rate_inr_sqft,
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [benchmarks]);

  // ── Derived KPIs: recompute every time `cases` changes ────────────
  const liveKpis = useMemo<LiveKpis>(() => {
    const total = cases.length;
    if (total === 0) {
      return {
        activePipeline: 0,
        pendingValuerReview: 0,
        highDeviationAlerts: 0,
        portfolioAvgLtv: 0,
        triageDistribution: {
          high: { count: 0, pct: 0 },
          medium: { count: 0, pct: 0 },
          low: { count: 0, pct: 0 },
        },
        aggregatedSanctionPipelineCr: 0,
      };
    }

    let pendingValuer = 0;
    let highDevAlerts = 0;
    let ltvSum = 0;
    let highConfCount = 0;
    let medConfCount = 0;
    let lowConfCount = 0;
    let totalAmountSum = 0;

    for (const c of cases) {
      if (c.status === 'PENDING_VALUATION' || !c.valuerReport) pendingValuer++;
      if (Math.abs(c.deviation?.percentageDiff || 0) > 8) highDevAlerts++;

      const valuerOrModelVal = c.valuerReport?.assessedValue || c.modelIndicativeValue;
      const ltv = valuerOrModelVal > 0 ? (c.loanFacilityRequested / valuerOrModelVal) * 100 : 0;
      ltvSum += ltv;

      const amountCr = c.loanFacilityRequested / 1e7;
      totalAmountSum += amountCr;

      if (c.reviewLevel === 'LOW') lowConfCount++;
      else if (c.reviewLevel === 'MEDIUM') medConfCount++;
      else highConfCount++;
    }

    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

    return {
      activePipeline: total,
      pendingValuerReview: pendingValuer,
      highDeviationAlerts: highDevAlerts,
      portfolioAvgLtv: Math.round((ltvSum / total) * 10) / 10,
      triageDistribution: {
        high: { count: highConfCount, pct: pct(highConfCount) },
        medium: { count: medConfCount, pct: pct(medConfCount) },
        low: { count: lowConfCount, pct: pct(lowConfCount) },
      },
      aggregatedSanctionPipelineCr: Math.round(totalAmountSum * 100) / 100,
    };
  }, [cases]);

  // ── Context Value ─────────────────────────────────────────────────
  const value = useMemo<CaseContextValue>(
    () => ({
      cases,
      benchmarks,
      auditLogs,
      loading,
      liveKpis,
      localityList,
      addCase,
      setCases,
      setAuditLogs,
      setBenchmarks,
      setLoading,
    }),
    [cases, benchmarks, auditLogs, loading, liveKpis, localityList, addCase]
  );

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}
