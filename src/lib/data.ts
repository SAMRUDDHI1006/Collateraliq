import fs from 'fs';
import path from 'path';
import { BenchmarksData, LoanCase, AuditLogItem } from '@/types/collateral';

let cachedBenchmarks: BenchmarksData | null = null;
let cachedAllCases: LoanCase[] | null = null;

const AUDIT_LOGS_STORE: AuditLogItem[] = [
  {
    id: 'AUD-1001',
    timestamp: '2026-09-14 14:15:22 IST',
    case_id: 'CLIQ-DADAR-001',
    officer_name: 'S. Nair',
    officer_role: 'Senior Credit Officer',
    action_type: 'INITIAL_TRIAGE',
    description: 'System ingestion executed. Docket parsed with 1 mandatory area discrepancy (+8.24%). Assigned to valuer queue.',
    previous_state: 'Unprocessed',
    new_state: 'MEDIUM - REVIEW REQUIRED',
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-09-14 14:18:40 IST',
    case_id: 'CLIQ-DADAR-001',
    officer_name: 'P. Deshmukh',
    officer_role: 'Empaneled IBBI Valuer',
    action_type: 'PHYSICAL_INSPECTION_UPDATE',
    description: 'Physical inspection completed. Flat 702 internal layout matched approved society drawings. Valuer confirmed measurement requires reconciliation.',
    previous_state: 'Inspection Scheduled',
    new_state: 'Inspection Completed',
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-09-14 14:45:10 IST',
    case_id: 'CLIQ-00002',
    officer_name: 'S. Nair',
    officer_role: 'Senior Credit Officer',
    action_type: 'RFI_SENT',
    description: 'Clarification query dispatched to Thane West branch regarding society share certificate endorsement.',
    previous_state: 'Pending',
    new_state: 'Clarification Awaited',
  },
];

export function getBenchmarks(): BenchmarksData {
  if (cachedBenchmarks) return cachedBenchmarks;
  const filePath = path.join(process.cwd(), 'models', 'benchmarks.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedBenchmarks = JSON.parse(raw);
    return cachedBenchmarks!;
  }
  throw new Error('benchmarks.json not found. Run python scripts/train_engine.py first.');
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function loadAllCsvCases(): LoanCase[] {
  const csvPath = path.join(process.cwd(), 'data', 'CollateralIQ_Government_Aligned_3000.csv');
  if (!fs.existsSync(csvPath)) return [];
  const benchmarks = getBenchmarks();
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]);
  const cases: LoanCase[] = [];

  const getCol = (cols: string[], name: string) => {
    const idx = headers.indexOf(name);
    return idx !== -1 ? cols[idx] : '';
  };

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    if (cols.length < 5) continue;

    const caseId = getCol(cols, 'case_id');
    const loc = getCol(cols, 'locality') || 'Dadar West';
    const rate = parseFloat(getCol(cols, 'adjusted_comparable_rate_inr_sqft')) ||
      benchmarks.locality_benchmarks[loc]?.benchmark_rate_inr_sqft || 45000;
    const carpet = parseFloat(getCol(cols, 'carpet_area_sqft')) || 850;
    const loan = parseFloat(getCol(cols, 'loan_amount_inr')) || 25000000;
    const indVal = parseFloat(getCol(cols, 'indicative_value_inr')) || (carpet * rate);

    cases.push({
      case_id: caseId,
      borrower_name: getCol(cols, 'borrower_name') || 'Borrower',
      age: parseInt(getCol(cols, 'age')) || 38,
      occupation: getCol(cols, 'occupation') || 'Business Owner',
      employer_business: getCol(cols, 'employer_business') || 'Self',
      vintage_years: parseFloat(getCol(cols, 'employment_business_vintage_years')) || 5,
      annual_income_lakh: parseFloat(getCol(cols, 'annual_income_lakh')) || 25,
      existing_emi_inr: parseFloat(getCol(cols, 'existing_emi_inr')) || 30000,
      credit_score: parseInt(getCol(cols, 'credit_score')) || 750,
      loan_product: (getCol(cols, 'loan_product') as any) || 'Loan Against Property (LAP)',
      loan_purpose: getCol(cols, 'loan_purpose') || 'Business Expansion',
      loan_amount_inr: loan,
      tenure_years: parseInt(getCol(cols, 'tenure_years')) || 15,
      interest_rate_percent: parseFloat(getCol(cols, 'interest_rate_percent')) || 10.5,
      city: getCol(cols, 'city') || 'Mumbai',
      locality: loc,
      property_type: getCol(cols, 'property_type') || 'Apartment / Flat',
      property_address: getCol(cols, 'property_address') || `${loc}, Mumbai`,
      building_society: getCol(cols, 'building_society') || `${loc} CHS Ltd`,
      flat_house_number: getCol(cols, 'flat_house_number') || '702',
      bedrooms: parseInt(getCol(cols, 'bedrooms')) || 2,
      carpet_area_sqft: carpet,
      builtup_area_sqft: parseFloat(getCol(cols, 'builtup_area_sqft')) || carpet * 1.2,
      floor: parseInt(getCol(cols, 'floor')) || 7,
      total_floors: parseInt(getCol(cols, 'total_floors')) || 10,
      property_age_years: parseInt(getCol(cols, 'property_age_years')) || 12,
      parking: getCol(cols, 'parking') || '1 Covered',
      occupancy: getCol(cols, 'occupancy') || 'Self-occupied',
      condition: getCol(cols, 'condition') || 'Good',
      sale_deed_status: (getCol(cols, 'sale_deed_status') as any) || 'Uploaded',
      property_card_status: (getCol(cols, 'property_card_status') as any) || 'Uploaded',
      share_certificate_status: (getCol(cols, 'share_certificate_status') as any) || 'Uploaded',
      building_plan_status: (getCol(cols, 'building_plan_status') as any) || 'Uploaded',
      occupancy_certificate_status: (getCol(cols, 'occupancy_certificate_status') as any) || 'Uploaded',
      property_tax_status: (getCol(cols, 'property_tax_status') as any) || 'Uploaded',
      encumbrance_status: getCol(cols, 'encumbrance_security_interest_status') || 'No charge indicated',
      owner_consistency: (getCol(cols, 'owner_consistency') as any) || 'Pass',
      address_consistency: (getCol(cols, 'address_consistency') as any) || 'Pass',
      property_id_consistency: (getCol(cols, 'property_id_consistency') as any) || 'Pass',
      area_consistency: (getCol(cols, 'area_consistency') as any) || 'Pass',
      property_type_consistency: (getCol(cols, 'property_type_consistency') as any) || 'Pass',
      document_completeness: (getCol(cols, 'document_completeness') as any) || 'Complete',
      exceptions: getCol(cols, 'exceptions') || 'None',
      comparable_count: parseInt(getCol(cols, 'comparable_count')) || 6,
      adjusted_comparable_rate_inr_sqft: rate,
      indicative_value_inr: indVal,
      indicative_value_low_inr: parseFloat(getCol(cols, 'indicative_value_low_inr')) || (indVal * 0.95),
      indicative_value_high_inr: parseFloat(getCol(cols, 'indicative_value_high_inr')) || (indVal * 1.05),
      valuation_confidence: (getCol(cols, 'valuation_confidence') as any) || 'High',
      ltv_percent: parseFloat(getCol(cols, 'ltv_percent')) || Math.round((loan / indVal) * 1000) / 10,
      collateral_coverage_x: parseFloat(getCol(cols, 'collateral_coverage_x')) || Math.round((indVal / loan) * 100) / 100,
      collateral_assessment: (getCol(cols, 'collateral_assessment') as any) || 'LOW - REVIEW COMPLETE',
      valuer_status: (getCol(cols, 'valuer_status') as any) || 'Inspection Scheduled',
      valuer_assessed_value_inr: parseFloat(getCol(cols, 'valuer_assessed_value_inr')) || indVal,
      credit_review_status: (getCol(cols, 'credit_review_status') as any) || 'Ready for Review',
    });
  }
  return cases;
}

export function getAllCases(): LoanCase[] {
  if (cachedAllCases) return cachedAllCases;
  cachedAllCases = loadAllCsvCases();
  return cachedAllCases;
}

export function getCaseById(caseId: string): LoanCase | null {
  const cases = getAllCases();
  const match = cases.find((c) => c.case_id.toLowerCase() === caseId.toLowerCase());
  return match || null;
}

export function calculateRealtimeValuation(params: {
  carpetAreaSqft: number;
  locality: string;
  loanAmountInr: number;
  customMarketRate?: number;
  areaVariancePercent?: number;
  encumbranceVerified?: boolean;
  documentsClean?: boolean;
}) {
  let rate = params.customMarketRate && params.customMarketRate > 0 ? params.customMarketRate : 0;
  if (!rate) {
    const benchmarks = getBenchmarks();
    const benchmarkObj = benchmarks.locality_benchmarks[params.locality];
    rate = benchmarkObj?.benchmark_rate_inr_sqft || 50000;
  }

  const indicativeValue = Math.round(params.carpetAreaSqft * rate);
  const corridorLow = Math.round(indicativeValue * 0.95);
  const corridorHigh = Math.round(indicativeValue * 1.05);
  const ltvPercent = indicativeValue > 0 ? Math.round((params.loanAmountInr / indicativeValue) * 1000) / 10 : 0;
  const collateralCoverage = params.loanAmountInr > 0 ? Math.round((indicativeValue / params.loanAmountInr) * 100) / 100 : 0;

  const areaVariance = params.areaVariancePercent ?? 0;
  const encumbranceOk = params.encumbranceVerified ?? true;
  const docsClean = params.documentsClean ?? (Math.abs(areaVariance) <= 5.0 && encumbranceOk);

  let triage: 'LOW - REVIEW COMPLETE' | 'MEDIUM - REVIEW REQUIRED' | 'HIGH - REVIEW REQUIRED' = 'LOW - REVIEW COMPLETE';
  const reasons: string[] = [];

  if (Math.abs(areaVariance) > 5.0) {
    triage = 'MEDIUM - REVIEW REQUIRED';
    reasons.push(`Area discrepancy (${areaVariance > 0 ? '+' : ''}${areaVariance.toFixed(2)}%) exceeds standard 5% tolerance threshold.`);
  }

  if (!docsClean || !encumbranceOk) {
    triage = 'MEDIUM - REVIEW REQUIRED';
    reasons.push('Supporting document verification or title encumbrance check requires clearance.');
  }

  if (ltvPercent > 75.0) {
    triage = 'HIGH - REVIEW REQUIRED';
    reasons.push(`LTV (${ltvPercent}%) breaches RBI prudential ceiling of 75.0%.`);
  } else if (ltvPercent > 60.0 && triage === 'LOW - REVIEW COMPLETE') {
    triage = 'MEDIUM - REVIEW REQUIRED';
    reasons.push(`LTV (${ltvPercent}%) exceeds internal conservative threshold (60.0%).`);
  }

  return {
    indicativeValue,
    corridorLow,
    corridorHigh,
    benchmarkRate: rate,
    ltvPercent,
    collateralCoverage,
    triage,
    reasons,
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
