'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { BenchmarksData, LoanCase, AuditLogItem } from '@/types/collateral';

// ─── Derived KPI Shape ───────────────────────────────────────────────
export interface LiveKpis {
  activePipeline: number;
  pendingValuerReview: number;
  scheduledInspections: number;
  flaggedExceptions: number;
  portfolioAvgLtv: number;
  lapExposure: { caseCount: number; avgTicketCr: number };
  homeLoanExposure: { caseCount: number; avgTicketCr: number };
  triageDistribution: {
    medium_review: { count: number; pct: number };
    low_risk: { count: number; pct: number };
    high_review: { count: number; pct: number };
  };
  aggregatedSanctionPipelineCr: number;
}

// ─── Context Shape ───────────────────────────────────────────────────
interface CaseContextValue {
  // Core state
  cases: LoanCase[];
  benchmarks: BenchmarksData | null;
  auditLogs: AuditLogItem[];
  loading: boolean;

  // Derived live KPIs (recompute on every `cases` change)
  liveKpis: LiveKpis;

  // Locality list for dynamic dropdowns
  localityList: { name: string; rate: number }[];

  // Mutations
  addCase: (newCase: LoanCase) => void;
  setCases: React.Dispatch<React.SetStateAction<LoanCase[]>>;
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
  const [cases, setCases] = useState<LoanCase[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarksData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Initial data fetch ────────────────────────────────────────────
  useEffect(() => {
    async function initData() {
      try {
        const [benchRes, casesRes, auditRes] = await Promise.all([
          fetch('/api/benchmarks'),
          fetch('/api/cases?tab=all&limit=5000'),
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
  const addCase = useCallback((newCase: LoanCase) => {
    setCases((prev) => [newCase, ...prev.filter((c) => c.case_id !== newCase.case_id)]);
  }, []);

  // ── Locality list for dropdown (from benchmarks) ──────────────────
  const localityList = useMemo(() => {
    if (!benchmarks?.locality_benchmarks) return [];
    return Object.entries(benchmarks.locality_benchmarks)
      .map(([name, data]) => ({
        name,
        rate: data.benchmark_rate_inr_sqft,
      }))
      .sort((a, b) => b.rate - a.rate); // highest rate first
  }, [benchmarks]);

  // ── Derived KPIs: recompute every time `cases` changes ────────────
  const liveKpis = useMemo<LiveKpis>(() => {
    const total = cases.length;
    if (total === 0) {
      return {
        activePipeline: 0,
        pendingValuerReview: 0,
        scheduledInspections: 0,
        flaggedExceptions: 0,
        portfolioAvgLtv: 0,
        lapExposure: { caseCount: 0, avgTicketCr: 0 },
        homeLoanExposure: { caseCount: 0, avgTicketCr: 0 },
        triageDistribution: {
          medium_review: { count: 0, pct: 0 },
          low_risk: { count: 0, pct: 0 },
          high_review: { count: 0, pct: 0 },
        },
        aggregatedSanctionPipelineCr: 0,
      };
    }

    let pendingValuer = 0;
    let scheduledInsp = 0;
    let flaggedExc = 0;
    let ltvSum = 0;
    let lapCount = 0;
    let lapAmountSum = 0;
    let hlCount = 0;
    let hlAmountSum = 0;
    let medCount = 0;
    let lowCount = 0;
    let highCount = 0;
    let totalAmountSum = 0;

    for (const c of cases) {
      // Valuer
      if (c.valuer_status === 'Pending' || c.valuer_status === 'Inspection Scheduled') {
        pendingValuer++;
        if (c.valuer_status === 'Inspection Scheduled') scheduledInsp++;
      }
      // Exceptions
      if (c.exceptions && c.exceptions !== 'None') flaggedExc++;
      // LTV
      ltvSum += c.ltv_percent;
      // Product split
      const amountCr = c.loan_amount_inr / 1e7;
      totalAmountSum += amountCr;
      if (c.loan_product === 'Loan Against Property (LAP)') {
        lapCount++;
        lapAmountSum += amountCr;
      } else {
        hlCount++;
        hlAmountSum += amountCr;
      }
      // Triage
      if (c.collateral_assessment.includes('HIGH')) highCount++;
      else if (c.collateral_assessment.includes('MEDIUM')) medCount++;
      else lowCount++;
    }

    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

    return {
      activePipeline: total,
      pendingValuerReview: pendingValuer,
      scheduledInspections: scheduledInsp,
      flaggedExceptions: flaggedExc,
      portfolioAvgLtv: Math.round((ltvSum / total) * 10) / 10,
      lapExposure: {
        caseCount: lapCount,
        avgTicketCr: lapCount > 0 ? Math.round((lapAmountSum / lapCount) * 100) / 100 : 0,
      },
      homeLoanExposure: {
        caseCount: hlCount,
        avgTicketCr: hlCount > 0 ? Math.round((hlAmountSum / hlCount) * 100) / 100 : 0,
      },
      triageDistribution: {
        medium_review: { count: medCount, pct: pct(medCount) },
        low_risk: { count: lowCount, pct: pct(lowCount) },
        high_review: { count: highCount, pct: pct(highCount) },
      },
      aggregatedSanctionPipelineCr: Math.round(totalAmountSum),
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
