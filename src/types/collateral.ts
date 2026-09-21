export type LoanProduct = 'Home Loan' | 'LAP' | 'Balance Transfer';
export type PropertyType = 'Apartment' | 'Independent House' | 'Bungalow' | 'Villa';
export type ReviewLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type CaseStatus = 'ACTIVE' | 'COMPLETED' | 'PENDING_VALUATION';

export interface BorrowerDetails {
  fullName: string;
  age?: number;
  mobileNumber?: string;
  residentialCity?: string;
  employmentType?: 'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional' | 'Other';
  employerOrBusinessName?: string;
  annualIncome?: number;
  existingMonthlyEmi?: number;
  cibilScore?: number;
}

export interface PropertyProfile {
  location: string; // Region (22 predefined regions)
  city: string;
  address?: string;
  pinCode?: string;
  propertyType: PropertyType;
  bhk: string;
  carpetArea: number; // in sq.ft
  builtUpArea?: number;
  floor: number;
  totalFloors?: number;
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
  valuationMethod?: string;
  comparablesUsedCount?: number;
  comparablesAvgRate?: number;
  adjustmentsNote?: string;
}

export interface BalanceTransferData {
  isBalanceTransfer: boolean;
  previousLender?: string;
  originalLoanAmount?: number;
  outstandingBalance?: number;
  existingEmi?: number;
  existingInterestRate?: number;
  previousValuation?: number;
  previousValuationDate?: string;
}

export interface DeviationMetrics {
  absoluteDiff: number;
  percentageDiff: number; // Formula: (Valuer - Model) / Model * 100
  effectiveRate: {
    modelRate: number;
    valuerRate: number;
    diffPerSqFt: number;
  };
  comparablesCount: {
    modelCount: number;
    valuerCount: number;
  };
  avgComparableRate: {
    modelAvg: number;
    valuerAvg: number;
  };
  areaUsed: {
    modelArea: number;
    valuerArea: number;
  };
  valuationDate: {
    modelDate: string;
    valuerDate: string;
  };
  methodology: {
    modelMethod: string;
    valuerMethod: string;
  };
  explicitAdjustments: string;
  explanationConfidence: 'High' | 'Medium' | 'Low';
  explanationText: string;
  identifiedDrivers: string[];
}

export interface CollateralAssessmentCase {
  caseId: string;
  borrowerName: string;
  borrower?: BorrowerDetails;
  product: LoanProduct;
  loanPurpose?: string;
  loanFacilityRequested: number;
  tenureYears?: number;
  interestRate?: number;
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
  deviation?: DeviationMetrics;
  balanceTransfer?: BalanceTransferData;
  reviewLevel: ReviewLevel;
  reviewDrivers: string[];
  status: CaseStatus;
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
