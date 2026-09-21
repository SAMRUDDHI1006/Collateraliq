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

export const BENCHMARKS: Record<string, number> = {
  'Dadar West': 55000,
  'Andheri West': 46200,
  'Bandra East': 58000,
  'Thane West': 28500,
  'Borivali West': 34000,
  'Kurla West': 22000,
};

const STORAGE_KEY = 'collateraliq_live_cases_v2';

export const SEED_CASES: CollateralAssessmentCase[] = [
  {
    caseId: 'CLIQ-DADAR-001',
    borrowerName: 'Arjun Mehta',
    loanFacilityRequested: 25000000,
    propertyProfile: {
      location: 'Dadar West',
      propertyType: 'Residential Apartment',
      bhk: '2 BHK',
      carpetArea: 850,
      builtUpArea: 1020,
      floor: 7,
      buildingAge: 6,
      parking: '1 Covered Stilt (CP-14)',
      occupancy: 'Self-occupied',
    },
    modelIndicativeValue: 46750000,
    indicativeRange: { min: 44412500, max: 49087500 },
    valuationConfidence: 'High',
    comparables: [
      { project: 'Shardashram CHS', bhk: '2 BHK', ratePerSqFt: 55000, distance: '0.1 km' },
      { project: 'Sai Enclave', bhk: '2 BHK', ratePerSqFt: 54200, distance: '0.3 km' },
      { project: 'Kirti Tower', bhk: '2 BHK', ratePerSqFt: 56100, distance: '0.5 km' },
    ],
    valuerReport: {
      valuerName: 'P. V. Kulkarni & Associates (IBBI Reg: IBBI/RV/02/2019/1104)',
      assessedValue: 46750000,
      areaConsidered: 850,
      rateApplied: 55000,
      inspectionDate: '2026-09-12',
      conditionRating: 'Excellent (A+ Structural Grade)',
      marketability: 'High Liquidity Micro-market',
      adjustmentsNote: 'Rate calibrated to recent registered transaction index in Dadar West corridor.',
    },
    deviation: {
      absoluteDiff: 0,
      percentageDiff: 0,
      identifiedDrivers: ['Location Benchmark Aligned', 'Zero Area Variance', 'Standard Floor Rise (+3%)'],
      requiresManualReview: false,
    },
    balanceTransfer: {
      isBalanceTransfer: false,
    },
    status: 'VALUER_LINKED',
    createdAt: '2026-09-14T10:30:00Z',
  },
  {
    caseId: 'CLIQ-00002',
    borrowerName: 'Ananya Patil',
    loanFacilityRequested: 21700000,
    propertyProfile: {
      location: 'Thane West',
      propertyType: 'Residential Apartment',
      bhk: '3 BHK',
      carpetArea: 1380,
      builtUpArea: 1650,
      floor: 12,
      buildingAge: 4,
      parking: '2 Covered Parking',
      occupancy: 'Self-occupied',
    },
    modelIndicativeValue: 39330000,
    indicativeRange: { min: 37363500, max: 41296500 },
    valuationConfidence: 'High',
    comparables: [
      { project: 'Raymond Realty Ten X', bhk: '3 BHK', ratePerSqFt: 28500, distance: '0.2 km' },
      { project: 'Hiranandani Estate', bhk: '3 BHK', ratePerSqFt: 29100, distance: '0.6 km' },
    ],
    valuerReport: {
      valuerName: 'Apex Valuation Consultants',
      assessedValue: 39330000,
      areaConsidered: 1380,
      rateApplied: 28500,
      inspectionDate: '2026-09-13',
      conditionRating: 'Good (A Grade)',
      marketability: 'High',
    },
    deviation: {
      absoluteDiff: 0,
      percentageDiff: 0,
      identifiedDrivers: ['Micro-market Baseline Match'],
      requiresManualReview: false,
    },
    balanceTransfer: {
      isBalanceTransfer: true,
      previousLender: 'HDFC Bank Ltd',
      previousValuation: 35000000,
      previousSanctionDate: '2023-04-15',
      outstandingBalance: 19500000,
    },
    status: 'VALUER_LINKED',
    createdAt: '2026-09-14T11:15:00Z',
  },
];

export function getStoredCases(): CollateralAssessmentCase[] {
  if (typeof window === 'undefined') return SEED_CASES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CASES));
      return SEED_CASES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read cases from storage', err);
    return SEED_CASES;
  }
}

export function saveNewCase(newCase: CollateralAssessmentCase): CollateralAssessmentCase[] {
  const existing = getStoredCases();
  const updated = [newCase, ...existing.filter((c) => c.caseId !== newCase.caseId)];
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error('Failed to persist case to storage', err);
  }
  return updated;
}

export function processNewCase(payload: {
  borrowerName: string;
  location: string;
  propertyType: string;
  bhk: string;
  carpetArea: number;
  builtUpArea?: number;
  floor: number;
  buildingAge: number;
  parking: string;
  occupancy: 'Self-occupied' | 'Tenant' | 'Vacant';
  loanFacilityRequested: number;
  valuerName?: string;
  valuerAssessedValue?: number;
  valuerRateApplied?: number;
  isBalanceTransfer?: boolean;
  previousLender?: string;
  previousValuation?: number;
  outstandingBalance?: number;
}): CollateralAssessmentCase {
  const benchmarkRate = BENCHMARKS[payload.location] || 35000;
  const modelIndicativeValue = Math.round(payload.carpetArea * benchmarkRate);
  const minRange = Math.round(modelIndicativeValue * 0.95);
  const maxRange = Math.round(modelIndicativeValue * 1.05);

  let valuerReport: ValuerReportData | undefined = undefined;
  let deviation: CollateralAssessmentCase['deviation'] = undefined;

  if (payload.valuerAssessedValue && payload.valuerAssessedValue > 0) {
    const rateApplied = payload.valuerRateApplied || Math.round(payload.valuerAssessedValue / payload.carpetArea);
    valuerReport = {
      valuerName: payload.valuerName || 'Empaneled Valuer Report',
      assessedValue: payload.valuerAssessedValue,
      areaConsidered: payload.carpetArea,
      rateApplied,
      inspectionDate: new Date().toISOString().split('T')[0],
      conditionRating: 'Satisfactory (B+ Structural Grade)',
      marketability: 'Moderate to High Liquidity',
    };

    const absoluteDiff = Math.abs(payload.valuerAssessedValue - modelIndicativeValue);
    const percentageDiff = Number(((absoluteDiff / modelIndicativeValue) * 100).toFixed(1));
    const drivers: string[] = [];

    if (percentageDiff > 0) {
      if (payload.floor > 10) drivers.push('High Floor Rise Premium (+4-6%)');
      if (payload.buildingAge < 3) drivers.push('New Construction Asset Premium');
      if (payload.buildingAge > 15) drivers.push('Building Age Structural Depreciation (-8%)');
      if (drivers.length === 0) drivers.push('Valuer Subjective Market Calibration');
    } else {
      drivers.push('Model & Valuer Valuation 100% Aligned');
    }

    deviation = {
      absoluteDiff,
      percentageDiff,
      identifiedDrivers: drivers,
      requiresManualReview: percentageDiff > 10,
    };
  }

  const balanceTransfer: BalanceTransferData | undefined = payload.isBalanceTransfer
    ? {
        isBalanceTransfer: true,
        previousLender: payload.previousLender,
        previousValuation: payload.previousValuation,
        outstandingBalance: payload.outstandingBalance,
      }
    : { isBalanceTransfer: false };

  const newCase: CollateralAssessmentCase = {
    caseId: `CLIQ-LIVE-${Math.floor(100000 + Math.random() * 900000)}`,
    borrowerName: payload.borrowerName,
    loanFacilityRequested: payload.loanFacilityRequested,
    propertyProfile: {
      location: payload.location,
      propertyType: payload.propertyType,
      bhk: payload.bhk,
      carpetArea: payload.carpetArea,
      builtUpArea: payload.builtUpArea || Math.round(payload.carpetArea * 1.2),
      floor: payload.floor,
      buildingAge: payload.buildingAge,
      parking: payload.parking,
      occupancy: payload.occupancy,
    },
    modelIndicativeValue,
    indicativeRange: { min: minRange, max: maxRange },
    valuationConfidence: 'High',
    comparables: [
      { project: `${payload.location} Prime Residency`, bhk: payload.bhk, ratePerSqFt: benchmarkRate, distance: '0.2 km' },
      { project: `${payload.location} Heights CHS`, bhk: payload.bhk, ratePerSqFt: Math.round(benchmarkRate * 0.98), distance: '0.4 km' },
    ],
    valuerReport,
    deviation,
    balanceTransfer,
    status: valuerReport ? (deviation?.requiresManualReview ? 'REVIEWED' : 'VALUER_LINKED') : 'INDICATIVE_READY',
    createdAt: new Date().toISOString(),
  };

  saveNewCase(newCase);
  return newCase;
}
