export interface CaseRecord {
  caseId: string;
  borrowerName: string;
  locality: string;
  facilityType: 'Home Loan' | 'LAP';
  facilityAmount: number;
  extractedCarpetArea: number;
  taxRatableArea: number;
  valuation: number;
  corridorMin: number;
  corridorMax: number;
  benchmarkRate: number;
  ltv: number;
  coverage: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'REVIEW REQUIRED' | 'SANCTIONED';
  unitNo: string;
  society: string;
  ctsNo: string;
  duesStatus: string;
  documents: {
    saleDeedName: string;
    taxReceiptName: string;
    saleDeedUrl?: string;
  };
  createdAt: string;
}

export const BENCHMARKS: Record<string, number> = {
  'Dadar West': 55000,
  'Andheri West': 46200,
  'Bandra East': 58000,
  'Thane West': 28500,
  'Borivali West': 34000,
  'Kurla West': 22000,
};

const STORAGE_KEY = 'collateraliq_live_cases';

export function getStoredCases(): CaseRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read live cases from storage', err);
    return [];
  }
}

export function saveNewCase(newCase: CaseRecord): CaseRecord[] {
  const existing = getStoredCases();
  const updated = [newCase, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist case to storage', err);
  }
  return updated;
}

export function processNewCase(payload: {
  borrowerName: string;
  locality: string;
  facilityType: 'Home Loan' | 'LAP';
  facilityAmount: number;
  extractedCarpetArea: number;
  taxRatableArea: number;
  unitNo: string;
  society: string;
  ctsNo: string;
  saleDeedFile?: File;
  taxReceiptFile?: File;
}): CaseRecord {
  const benchmarkRate = BENCHMARKS[payload.locality] || 35000;
  const valuation = payload.extractedCarpetArea * benchmarkRate;
  const corridorMin = Math.round(valuation * 0.95);
  const corridorMax = Math.round(valuation * 1.05);
  const ltv = Number(((payload.facilityAmount / valuation) * 100).toFixed(1));
  const coverage = Number((valuation / payload.facilityAmount).toFixed(2));
  
  const hasAreaMismatch = Math.abs(payload.extractedCarpetArea - payload.taxRatableArea) > 5;
  const riskTier: 'LOW' | 'MEDIUM' | 'HIGH' = 
    ltv > 75 || hasAreaMismatch ? 'HIGH' : ltv > 65 ? 'MEDIUM' : 'LOW';

  const newCase: CaseRecord = {
    caseId: `CLIQ-LIVE-${Math.floor(100000 + Math.random() * 900000)}`,
    borrowerName: payload.borrowerName,
    locality: payload.locality,
    facilityType: payload.facilityType,
    facilityAmount: payload.facilityAmount,
    extractedCarpetArea: payload.extractedCarpetArea,
    taxRatableArea: payload.taxRatableArea,
    valuation,
    corridorMin,
    corridorMax,
    benchmarkRate,
    ltv,
    coverage,
    riskTier,
    status: riskTier === 'LOW' ? 'PENDING' : 'REVIEW REQUIRED',
    unitNo: payload.unitNo,
    society: payload.society,
    ctsNo: payload.ctsNo,
    duesStatus: 'Clause 18: NIL Dues Verified',
    documents: {
      saleDeedName: payload.saleDeedFile?.name || 'Registered_Sale_Deed.pdf',
      taxReceiptName: payload.taxReceiptFile?.name || 'Property_Tax_Challan.pdf',
    },
    createdAt: new Date().toISOString(),
  };

  saveNewCase(newCase);
  return newCase;
}
