import { BenchmarksData, CollateralAssessmentCase, AuditLogItem } from '@/types/collateral';
import { SEED_CASES, BENCHMARKS, getStoredCases } from './caseStore';

const AUDIT_LOGS_STORE: AuditLogItem[] = [
  {
    id: 'AUD-1001',
    timestamp: '2026-09-14 14:15:22 IST',
    case_id: 'CLIQ-DADAR-001',
    officer_name: 'S. Nair',
    officer_role: 'Senior Credit Officer',
    action_type: 'INITIAL_TRIAGE',
    description: 'System ingestion executed. Model indicative valuation generated at INR 4.675 Cr. Valuer report linked.',
    previous_state: 'Unprocessed',
    new_state: 'VALUER_LINKED',
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-09-14 14:18:40 IST',
    case_id: 'CLIQ-DADAR-001',
    officer_name: 'P. Deshmukh',
    officer_role: 'Empaneled IBBI Valuer',
    action_type: 'PHYSICAL_INSPECTION_UPDATE',
    description: 'Physical inspection completed by P. V. Kulkarni & Associates. Assessed value matches model baseline at INR 4.675 Cr.',
    previous_state: 'Inspection Scheduled',
    new_state: 'VALUER_LINKED',
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-09-14 14:45:10 IST',
    case_id: 'CLIQ-00002',
    officer_name: 'S. Nair',
    officer_role: 'Senior Credit Officer',
    action_type: 'INITIAL_TRIAGE',
    description: 'Balance transfer case loaded from Thane West branch with HDFC Bank outstanding balance of INR 1.95 Cr.',
    previous_state: 'Pending',
    new_state: 'VALUER_LINKED',
  },
];

export function getBenchmarks(): BenchmarksData {
  return {
    generated_at: new Date().toISOString(),
    dataset_version: 'v2.4-Intelligence-Reconciliation',
    locality_benchmarks: {
      'Dadar West': { locality: 'Dadar West', city: 'Mumbai', benchmark_rate_inr_sqft: 55000, dataset_avg_rate: 55000, min_rate: 52000, max_rate: 58000, sample_count: 140 },
      'Andheri West': { locality: 'Andheri West', city: 'Mumbai', benchmark_rate_inr_sqft: 46200, dataset_avg_rate: 46200, min_rate: 43000, max_rate: 49000, sample_count: 210 },
      'Bandra East': { locality: 'Bandra East', city: 'Mumbai', benchmark_rate_inr_sqft: 58000, dataset_avg_rate: 58000, min_rate: 54000, max_rate: 62000, sample_count: 95 },
      'Thane West': { locality: 'Thane West', city: 'Thane', benchmark_rate_inr_sqft: 28500, dataset_avg_rate: 28500, min_rate: 26000, max_rate: 31000, sample_count: 320 },
      'Borivali West': { locality: 'Borivali West', city: 'Mumbai', benchmark_rate_inr_sqft: 34000, dataset_avg_rate: 34000, min_rate: 31000, max_rate: 36500, sample_count: 180 },
      'Kurla West': { locality: 'Kurla West', city: 'Mumbai', benchmark_rate_inr_sqft: 22000, dataset_avg_rate: 22000, min_rate: 20000, max_rate: 24500, sample_count: 150 },
    },
    top_cases: getStoredCases(),
    all_cases_count: getStoredCases().length,
  };
}

export function getAllCases(): CollateralAssessmentCase[] {
  return getStoredCases();
}

export function getCaseById(caseId: string): CollateralAssessmentCase | null {
  const cases = getAllCases();
  const match = cases.find((c) => c.caseId.toLowerCase() === caseId.toLowerCase());
  return match || null;
}

export function calculateRealtimeValuation(params: {
  carpetAreaSqft: number;
  locality: string;
  loanAmountInr: number;
  customMarketRate?: number;
  valuerAssessedValue?: number;
}) {
  const benchmarkRate = params.customMarketRate && params.customMarketRate > 0
    ? params.customMarketRate
    : BENCHMARKS[params.locality] || 35000;

  const modelIndicativeValue = Math.round(params.carpetAreaSqft * benchmarkRate);
  const minRange = Math.round(modelIndicativeValue * 0.95);
  const maxRange = Math.round(modelIndicativeValue * 1.05);

  const ltvPercent = modelIndicativeValue > 0
    ? Math.round((params.loanAmountInr / modelIndicativeValue) * 1000) / 10
    : 0;

  const collateralCoverage = params.loanAmountInr > 0
    ? Math.round((modelIndicativeValue / params.loanAmountInr) * 100) / 100
    : 0;

  let deviationPercentage = 0;
  let absoluteDiff = 0;
  let requiresManualReview = false;

  if (params.valuerAssessedValue && params.valuerAssessedValue > 0) {
    absoluteDiff = Math.abs(params.valuerAssessedValue - modelIndicativeValue);
    deviationPercentage = Number(((absoluteDiff / modelIndicativeValue) * 100).toFixed(1));
    requiresManualReview = deviationPercentage > 10.0;
  }

  return {
    modelIndicativeValue,
    minRange,
    maxRange,
    benchmarkRate,
    ltvPercent,
    collateralCoverage,
    deviationPercentage,
    absoluteDiff,
    requiresManualReview,
  };
}

export function getAuditLogs(caseId?: string): AuditLogItem[] {
  if (!caseId) return AUDIT_LOGS_STORE;
  return AUDIT_LOGS_STORE.filter((l) => l.case_id.toLowerCase() === caseId.toLowerCase());
}

export function addAuditLog(entry: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const newItem: AuditLogItem = {
    ...entry,
    id: `AUD-${1000 + AUDIT_LOGS_STORE.length + 1}`,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
  };
  AUDIT_LOGS_STORE.unshift(newItem);
  return newItem;
}
