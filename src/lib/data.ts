import { BenchmarksData, CollateralAssessmentCase, AuditLogItem } from '@/types/collateral';
import { BENCHMARKS, REGIONS_22, getStoredCases } from './caseStore';

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
    new_state: 'ACTIVE',
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-09-14 14:18:40 IST',
    case_id: 'CLIQ-DADAR-001',
    officer_name: 'P. Deshmukh',
    officer_role: 'Empaneled IBBI Valuer',
    action_type: 'PHYSICAL_INSPECTION_UPDATE',
    description: 'Physical inspection completed by P. V. Kulkarni & Associates. Assessed value recorded at INR 4.55 Cr (-2.67% deviation).',
    previous_state: 'Pending Valuation',
    new_state: 'ACTIVE',
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
    new_state: 'ACTIVE',
  },
];

export function getBenchmarks(): BenchmarksData {
  const locality_benchmarks: Record<string, any> = {};
  REGIONS_22.forEach((region) => {
    const rate = BENCHMARKS[region] || 35000;
    locality_benchmarks[region] = {
      locality: region,
      city: region.includes('Thane') ? 'Thane' : 'Mumbai',
      benchmark_rate_inr_sqft: rate,
      dataset_avg_rate: rate,
      min_rate: Math.round(rate * 0.92),
      max_rate: Math.round(rate * 1.08),
      sample_count: 135,
    };
  });

  const cases = getStoredCases();

  return {
    generated_at: new Date().toISOString(),
    dataset_version: 'v3.0-3000-Cases-Master-Engine',
    locality_benchmarks,
    top_cases: cases.slice(0, 50),
    all_cases_count: cases.length,
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
  let reviewLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  if (params.valuerAssessedValue && params.valuerAssessedValue > 0) {
    absoluteDiff = Math.abs(params.valuerAssessedValue - modelIndicativeValue);
    deviationPercentage = Number(((params.valuerAssessedValue - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2));
    if (Math.abs(deviationPercentage) > 8.0) {
      reviewLevel = 'HIGH';
    } else if (Math.abs(deviationPercentage) > 3.0) {
      reviewLevel = 'MEDIUM';
    }
  }

  return {
    modelIndicativeValue,
    indicativeRange: { min: minRange, max: maxRange },
    ltvPercent,
    collateralCoverage,
    deviationPercentage,
    absoluteDiff,
    reviewLevel,
  };
}

export function addAuditLog(logItem: Omit<AuditLogItem, 'id' | 'timestamp'>): AuditLogItem {
  const newItem: AuditLogItem = {
    ...logItem,
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' IST',
  };
  AUDIT_LOGS_STORE.unshift(newItem);
  return newItem;
}

export function getAuditLogs(caseId?: string): AuditLogItem[] {
  if (!caseId) return AUDIT_LOGS_STORE;
  return AUDIT_LOGS_STORE.filter((log) => log.case_id.toLowerCase() === caseId.toLowerCase());
}

export function getAuditLogsForCase(caseId: string): AuditLogItem[] {
  return AUDIT_LOGS_STORE.filter((log) => log.case_id.toLowerCase() === caseId.toLowerCase());
}

