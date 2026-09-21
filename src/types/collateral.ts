export interface PropertyProfile {
  location: string;
  propertyType: string;
  bhk: string;
  carpetArea: number; // in sq.ft
  builtUpArea?: number;
  floor: number;
  buildingAge: number;
  parking: string;
  occupancy: 'Self-occupied' | 'Tenant' | 'Vacant';
}

export interface ValuerReportData {
  valuerName: string;
  assessedValue: number;
  areaConsidered: number;
  rateApplied: number;
  inspectionDate: string;
  conditionRating: string;
  marketability: string;
  adjustmentsNote?: string;
}

export interface BalanceTransferData {
  isBalanceTransfer: boolean;
  previousLender?: string;
  previousValuation?: number;
  previousSanctionDate?: string;
  outstandingBalance?: number;
}

export interface CollateralAssessmentCase {
  caseId: string;
  borrowerName: string;
  loanFacilityRequested: number;
  propertyProfile: PropertyProfile;
  modelIndicativeValue: number;
  indicativeRange: { min: number; max: number };
  valuationConfidence: 'High' | 'Medium' | 'Low';
  comparables: Array<{
    project: string;
    bhk: string;
    ratePerSqFt: number;
    distance: string;
  }>;
  valuerReport?: ValuerReportData;
  deviation?: {
    absoluteDiff: number;
    percentageDiff: number;
    identifiedDrivers: string[];
    requiresManualReview: boolean;
  };
  balanceTransfer?: BalanceTransferData;
  status: 'INDICATIVE_READY' | 'VALUER_LINKED' | 'REVIEWED';
  createdAt?: string;
}

export interface LocalityBenchmark {
  locality: string;
  city: string;
  benchmark_rate_inr_sqft: number;
  dataset_avg_rate: number;
  min_rate: number;
  max_rate: number;
  sample_count: number;
}

export interface BenchmarksData {
  generated_at: string;
  dataset_version: string;
  locality_benchmarks: Record<string, LocalityBenchmark>;
  top_cases: CollateralAssessmentCase[];
  all_cases_count: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  case_id: string;
  officer_name: string;
  officer_role: string;
  action_type: 'INITIAL_TRIAGE' | 'VALUER_OVERRIDE' | 'PHYSICAL_INSPECTION_UPDATE' | 'EXCEPTION_ACKNOWLEDGED' | 'RFI_SENT' | 'SANCTION_RECOMMENDED' | 'DOCKET_REJECTED';
  description: string;
  previous_state?: string;
  new_state?: string;
}
