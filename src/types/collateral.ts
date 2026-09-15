export type TriageStatus = 'LOW - REVIEW COMPLETE' | 'MEDIUM - REVIEW REQUIRED' | 'HIGH - REVIEW REQUIRED';

export type ValuerStatus = 'Pending' | 'Inspection Scheduled' | 'Completed';

export type LoanProduct = 'Loan Against Property (LAP)' | 'Home Loan';

export interface LoanCase {
  case_id: string;
  borrower_name: string;
  age: number;
  occupation: string;
  employer_business: string;
  vintage_years: number;
  annual_income_lakh: number;
  existing_emi_inr: number;
  credit_score: number;
  loan_product: LoanProduct;
  loan_purpose: string;
  loan_amount_inr: number;
  tenure_years: number;
  interest_rate_percent: number;
  city: string;
  locality: string;
  property_type: string;
  property_address: string;
  building_society: string;
  flat_house_number: string;
  bedrooms: number;
  carpet_area_sqft: number;
  builtup_area_sqft: number;
  floor: number;
  total_floors: number;
  property_age_years: number;
  parking: string;
  occupancy: string;
  condition: string;
  sale_deed_status: string;
  property_card_status: string;
  share_certificate_status: string;
  building_plan_status: string;
  occupancy_certificate_status: string;
  property_tax_status: string;
  encumbrance_status: string;
  owner_consistency: string;
  address_consistency: string;
  property_id_consistency: string;
  area_consistency: string;
  property_type_consistency: string;
  document_completeness: string;
  exceptions: string;
  comparable_count: number;
  adjusted_comparable_rate_inr_sqft: number;
  indicative_value_inr: number;
  indicative_value_low_inr: number;
  indicative_value_high_inr: number;
  valuation_confidence: string;
  ltv_percent: number;
  collateral_coverage_x: number;
  collateral_assessment: TriageStatus;
  valuer_status: ValuerStatus;
  valuer_assessed_value_inr?: number | null;
  valuer_override_reason?: string;
  credit_review_status: string;
  uploaded_document_name?: string;
  tax_carpet_area_sqft?: number;
  pr_card_file_name?: string;
  share_cert_file_name?: string;
  building_plan_file_name?: string;
  oc_file_name?: string;
  tax_receipt_file_name?: string;
  search_report_file_name?: string;
  encumbrance_clause?: string;
  tax_owner_name?: string;
  share_cert_member_name?: string;
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
  kpis: {
    active_pipeline: number;
    pending_valuer_review: number;
    scheduled_inspections: number;
    completed_reviews: number;
    flagged_exceptions: number;
    portfolio_avg_ltv: number;
    rbi_ceiling_ltv: number;
    lap_exposure: {
      case_count: number;
      avg_ticket_cr: number;
    };
    home_loan_exposure: {
      case_count: number;
      avg_ticket_cr: number;
    };
    triage_distribution: {
      medium_review: { count: number; pct: number };
      low_risk: { count: number; pct: number };
      high_review: { count: number; pct: number };
    };
  };
  locality_benchmarks: Record<string, LocalityBenchmark>;
  top_cases: LoanCase[];
  all_cases_count: number;
}

export interface VerificationFieldComparison {
  id: string;
  field_name: string;
  source_sale_deed: string;
  source_tax_receipt: string;
  status: 'MATCH' | 'DISCREPANCY' | 'CROSS_INDEXED';
  variance_details?: string;
  tolerance_status?: 'WITHIN_TOLERANCE' | 'EXCEEDS_TOLERANCE';
  regulatory_anchor?: string;
  is_flagged?: boolean;
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
