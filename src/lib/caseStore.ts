import { CollateralAssessmentCase, LoanProduct, PropertyType, ReviewLevel, CaseStatus } from '@/types/collateral';

export const REGIONS_22 = [
  'Dadar West',
  'Andheri West',
  'Bandra East',
  'Bandra West',
  'Thane West',
  'Borivali West',
  'Kurla West',
  'Worli',
  'Lower Parel',
  'Juhu',
  'Goregaon West',
  'Malad West',
  'Powai',
  'Chembur',
  'Ghatkopar West',
  'Mulund West',
  'Santacruz West',
  'Khar West',
  'Prabhadevi',
  'Vile Parle West',
  'Kandivali West',
  'Thane East',
] as const;

export const BENCHMARKS: Record<string, number> = {
  'Dadar West': 55000,
  'Andheri West': 46200,
  'Bandra East': 58000,
  'Bandra West': 68000,
  'Thane West': 28500,
  'Borivali West': 34000,
  'Kurla West': 22000,
  'Worli': 78100,
  'Lower Parel': 62000,
  'Juhu': 72000,
  'Goregaon West': 38000,
  'Malad West': 32000,
  'Powai': 42000,
  'Chembur': 36000,
  'Ghatkopar West': 31000,
  'Mulund West': 30000,
  'Santacruz West': 60000,
  'Khar West': 65000,
  'Prabhadevi': 59000,
  'Vile Parle West': 54000,
  'Kandivali West': 29000,
  'Thane East': 25000,
};

const FIRST_NAMES = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Vikram', 'Neha', 'Aditya', 'Siddharth', 'Kavita', 'Rajesh', 'Pooja', 'Amit', 'Sneha', 'Rahul', 'Divya', 'Suresh', 'Meera', 'Karan', 'Tarun', 'Shreya'];
const LAST_NAMES = ['Sharma', 'Patil', 'Mehta', 'Deshmukh', 'Joshi', 'Kulkarni', 'Shah', 'Verma', 'Nair', 'Gupta', 'Rao', 'Iyer', 'Chaudhari', 'Singh', 'Pawar', 'More', 'Agarwal', 'Bhat', 'Kapoor', 'Tiwari'];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generate3000Cases(): CollateralAssessmentCase[] {
  const cases: CollateralAssessmentCase[] = [];

  // Flagship Demo Case #1: CLIQ-DADAR-001
  cases.push({
    caseId: 'CLIQ-DADAR-001',
    borrowerName: 'Arjun Mehta',
    borrower: {
      fullName: 'Arjun Mehta',
      age: 42,
      mobileNumber: '+91 98201 44521',
      residentialCity: 'Mumbai',
      employmentType: 'Business Owner',
      employerOrBusinessName: 'Mehta Industrial Supplies',
      annualIncome: 4800000,
      existingMonthlyEmi: 38000,
      cibilScore: 774,
    },
    product: 'LAP',
    loanPurpose: 'Business Expansion',
    loanFacilityRequested: 25000000, // ₹2.50 Cr
    tenureYears: 15,
    interestRate: 10.75,
    propertyProfile: {
      location: 'Dadar West',
      city: 'Mumbai',
      address: 'Flat 702, Shardashram CHS, Bhavani Shankar Road, Dadar West',
      pinCode: '400028',
      propertyType: 'Apartment',
      bhk: '2 BHK',
      carpetArea: 850,
      builtUpArea: 1020,
      floor: 7,
      totalFloors: 10,
      buildingAge: 6,
      parking: '1 Covered Stilt (CP-14)',
      occupancy: 'Self-occupied',
    },
    modelIndicativeValue: 46750000, // ₹4.675 Cr (850 * 55000)
    indicativeRange: { min: 44412500, max: 49087500 },
    valuationConfidence: 'High',
    comparables: [
      { project: 'Shardashram CHS', bhk: '2 BHK', ratePerSqFt: 55000, distance: '0.1 km' },
      { project: 'Sai Enclave', bhk: '2 BHK', ratePerSqFt: 54200, distance: '0.3 km' },
      { project: 'Kirti Tower', bhk: '2 BHK', ratePerSqFt: 56100, distance: '0.5 km' },
      { project: 'Omkar Heights', bhk: '2 BHK', ratePerSqFt: 55800, distance: '0.6 km' },
      { project: 'Dadar Pearl', bhk: '2 BHK', ratePerSqFt: 54900, distance: '0.8 km' },
    ],
    valuerReport: {
      valuerName: 'P. V. Kulkarni & Associates (IBBI Reg: IBBI/RV/02/2019/1104)',
      assessedValue: 45500000, // ₹4.55 Cr
      areaConsidered: 850,
      rateApplied: 53529,
      inspectionDate: '2026-08-25',
      conditionRating: 'Excellent (A+ Structural Grade)',
      marketability: 'High Liquidity Micro-market',
      valuationMethod: 'Sales Comparison Approach',
      comparablesUsedCount: 3,
      comparablesAvgRate: 54200,
      adjustmentsNote: 'Valuer applied slight downward adjustment due to 1-month market date offset.',
    },
    deviation: {
      absoluteDiff: 1250000, // ₹12.50 Lakhs
      percentageDiff: -2.67, // -2.67%
      effectiveRate: {
        modelRate: 55000,
        valuerRate: 53529,
        diffPerSqFt: -1471,
      },
      comparablesCount: {
        modelCount: 5,
        valuerCount: 3,
      },
      avgComparableRate: {
        modelAvg: 55800,
        valuerAvg: 54200,
      },
      areaUsed: {
        modelArea: 850,
        valuerArea: 850,
      },
      valuationDate: {
        modelDate: '2026-09-14',
        valuerDate: '2026-08-25',
      },
      methodology: {
        modelMethod: 'AI Comparable-based Valuation Model',
        valuerMethod: 'Sales Comparison Approach',
      },
      explicitAdjustments: 'Valuer applied minor micro-market timing adjustment.',
      explanationConfidence: 'High',
      explanationText: 'The independent valuer reported value is 2.67% below the CollateralIQ estimate. The primary drivers are lower effective rate/sq.ft (-₹1,471/sq.ft) and a smaller comparable set (3 vs 5 comparables). Area used is identical (850 sq.ft).',
      identifiedDrivers: [
        'Effective Rate Difference (-₹1,471/sq.ft)',
        'Comparable Property Selection (3 valuer vs 5 model)',
        'Valuation Date Offset (1 month gap)',
      ],
    },
    balanceTransfer: {
      isBalanceTransfer: false,
    },
    reviewLevel: 'MEDIUM',
    reviewDrivers: [
      'Valuation Deviation (-2.67%) within standard 5% tolerance corridor',
      'Comparable property selection differs slightly from AI model baseline',
      'Valuation date offset of 1 month',
    ],
    status: 'ACTIVE',
    createdAt: '2026-09-14T10:30:00Z',
  });

  // Generate Cases #2 to #3000
  for (let i = 2; i <= 3000; i++) {
    const r1 = pseudoRandom(i * 1.1);
    const r2 = pseudoRandom(i * 2.3);
    const r3 = pseudoRandom(i * 3.7);
    const r4 = pseudoRandom(i * 4.9);
    const r5 = pseudoRandom(i * 5.3);

    const caseId = `CLIQ-${String(i).padStart(5, '0')}`;
    const firstName = FIRST_NAMES[Math.floor(r1 * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(r2 * LAST_NAMES.length)];
    const borrowerName = `${firstName} ${lastName}`;

    const region = REGIONS_22[Math.floor(r3 * REGIONS_22.length)];
    const city = region.includes('Thane') ? 'Thane' : 'Mumbai';
    const benchmarkRate = BENCHMARKS[region] || 35000;

    // Product distribution: Home Loan ~40%, LAP ~35%, Balance Transfer ~25%
    let product: LoanProduct = 'Home Loan';
    let isBT = false;
    if (r4 < 0.40) {
      product = 'Home Loan';
    } else if (r4 < 0.75) {
      product = 'LAP';
    } else {
      product = 'Balance Transfer';
      isBT = true;
    }

    const propTypes: PropertyType[] = ['Apartment', 'Apartment', 'Apartment', 'Independent House', 'Bungalow', 'Villa'];
    const propertyType = propTypes[Math.floor(r5 * propTypes.length)];
    const bhks = ['1 BHK', '2 BHK', '2 BHK', '3 BHK', '3 BHK', '4 BHK'];
    const bhk = bhks[Math.floor(r1 * bhks.length)];

    const carpetArea = Math.round(500 + r2 * 1500); // 500 to 2000 sq.ft
    const builtUpArea = Math.round(carpetArea * (1.18 + r3 * 0.1));
    const modelIndicativeValue = Math.round(carpetArea * benchmarkRate);
    const indicativeMin = Math.round(modelIndicativeValue * 0.95);
    const indicativeMax = Math.round(modelIndicativeValue * 1.05);

    // LTV range 35% to 78%
    const targetLtv = 0.35 + r4 * 0.43;
    const loanFacilityRequested = Math.min(
      150000000,
      Math.max(2500000, Math.round((modelIndicativeValue * targetLtv) / 100000) * 100000)
    );

    // Valuer assessed value with deviation (-12% to +8%)
    const devFactor = -0.12 + r5 * 0.20;
    const valuerAssessedValue = Math.round(modelIndicativeValue * (1 + devFactor));
    const absoluteDiff = Math.abs(valuerAssessedValue - modelIndicativeValue);
    const percentageDiff = Number(((valuerAssessedValue - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2));

    // Review level logic
    let reviewLevel: ReviewLevel = 'LOW';
    if (Math.abs(percentageDiff) > 8.0 || targetLtv > 0.70) {
      reviewLevel = 'HIGH';
    } else if (Math.abs(percentageDiff) > 3.5 || targetLtv > 0.55) {
      reviewLevel = 'MEDIUM';
    }

    const statuses: CaseStatus[] = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'COMPLETED', 'PENDING_VALUATION'];
    const status = statuses[Math.floor(r2 * statuses.length)];

    const valuerRate = Math.round(valuerAssessedValue / carpetArea);

    let btData: any = { isBalanceTransfer: false };
    if (isBT) {
      const prevLenders = ['HDFC Bank', 'ICICI Bank', 'SBI Home Loans', 'Axis Bank', 'Kotak Mahindra Bank', 'Bajaj Housing Finance'];
      const prevLender = prevLenders[Math.floor(r1 * prevLenders.length)];
      const prevValuation = Math.round(modelIndicativeValue * (0.85 + r3 * 0.15));
      const outstandingBalance = Math.round(loanFacilityRequested * 0.92);
      btData = {
        isBalanceTransfer: true,
        previousLender: prevLender,
        originalLoanAmount: Math.round(loanFacilityRequested * 1.1),
        outstandingBalance: outstandingBalance,
        existingEmi: Math.round(outstandingBalance * 0.011),
        existingInterestRate: 9.25,
        previousValuation: prevValuation,
        previousValuationDate: '2024-03-15',
      };
    }

    cases.push({
      caseId,
      borrowerName,
      borrower: {
        fullName: borrowerName,
        age: Math.floor(28 + r1 * 32),
        residentialCity: city,
        employmentType: r2 > 0.5 ? 'Salaried' : 'Business Owner',
        annualIncome: Math.round(1200000 + r3 * 6000000),
        existingMonthlyEmi: Math.round(15000 + r4 * 50000),
        cibilScore: Math.floor(700 + r5 * 120),
      },
      product,
      loanPurpose: isBT ? 'Balance Transfer' : (product === 'Home Loan' ? 'Home Purchase' : 'Business Expansion'),
      loanFacilityRequested,
      tenureYears: 15 + Math.floor(r1 * 10),
      interestRate: product === 'Home Loan' ? 8.5 : 10.5,
      propertyProfile: {
        location: region,
        city,
        address: `Flat ${Math.floor(100 + r2 * 900)}, Landmark Tower, ${region}`,
        pinCode: region.includes('Thane') ? '400601' : '400001',
        propertyType,
        bhk,
        carpetArea,
        builtUpArea,
        floor: Math.floor(1 + r3 * 15),
        totalFloors: Math.floor(15 + r4 * 10),
        buildingAge: Math.floor(1 + r5 * 20),
        parking: r1 > 0.3 ? '1 Covered' : 'Open Parking',
        occupancy: r2 > 0.3 ? 'Self-occupied' : 'Tenant',
      },
      modelIndicativeValue,
      indicativeRange: { min: indicativeMin, max: indicativeMax },
      valuationConfidence: r3 > 0.3 ? 'High' : 'Medium',
      comparables: [
        { project: `${region} Heights`, bhk, ratePerSqFt: benchmarkRate, distance: '0.2 km' },
        { project: `${region} Enclave`, bhk, ratePerSqFt: Math.round(benchmarkRate * 0.98), distance: '0.4 km' },
        { project: `${region} Residency`, bhk, ratePerSqFt: Math.round(benchmarkRate * 1.02), distance: '0.6 km' },
      ],
      valuerReport: {
        valuerName: `${lastName} & Associates Valuers (IBBI Reg)`,
        assessedValue: valuerAssessedValue,
        areaConsidered: carpetArea,
        rateApplied: valuerRate,
        inspectionDate: '2026-08-28',
        conditionRating: r4 > 0.4 ? 'Good' : 'Average',
        marketability: 'Moderate to High Liquidity',
        valuationMethod: 'Sales Comparison Approach',
        comparablesUsedCount: 3,
        comparablesAvgRate: Math.round(benchmarkRate * 0.99),
        adjustmentsNote: 'Valuer applied standard micro-market adjustments.',
      },
      deviation: {
        absoluteDiff,
        percentageDiff,
        effectiveRate: {
          modelRate: benchmarkRate,
          valuerRate,
          diffPerSqFt: valuerRate - benchmarkRate,
        },
        comparablesCount: {
          modelCount: 3,
          valuerCount: 3,
        },
        avgComparableRate: {
          modelAvg: benchmarkRate,
          valuerAvg: Math.round(benchmarkRate * 0.99),
        },
        areaUsed: {
          modelArea: carpetArea,
          valuerArea: carpetArea,
        },
        valuationDate: {
          modelDate: '2026-09-14',
          valuerDate: '2026-08-28',
        },
        methodology: {
          modelMethod: 'AI Comparable-based Model',
          valuerMethod: 'Sales Comparison Approach',
        },
        explicitAdjustments: 'Standard market adjustment applied.',
        explanationConfidence: 'High',
        explanationText: `Independent valuer reported value is ${percentageDiff}% relative to CollateralIQ estimate. Primary driver is effective rate per sq.ft variance (${valuerRate - benchmarkRate > 0 ? '+' : ''}₹${valuerRate - benchmarkRate}/sq.ft).`,
        identifiedDrivers: [
          `Effective Rate Variance (${valuerRate - benchmarkRate > 0 ? '+' : ''}₹${valuerRate - benchmarkRate}/sq.ft)`,
          `LTV Exposure (${(targetLtv * 100).toFixed(1)}%)`,
        ],
      },
      balanceTransfer: btData,
      reviewLevel,
      reviewDrivers: [
        `Valuation Deviation (${percentageDiff}%)`,
        `LTV Exposure (${(targetLtv * 100).toFixed(1)}%)`,
      ],
      status,
      createdAt: `2026-09-${String(Math.floor(1 + r1 * 18)).padStart(2, '0')}T10:00:00Z`,
    });
  }

  return cases;
}

const STORAGE_KEY = 'collateraliq_3000_cases_v3';
const FRESH_CASE_COUNTER_KEY = 'collateraliq_fresh_case_counter';

export const SEED_CASES: CollateralAssessmentCase[] = generate3000Cases();

/** Generate a sequential fresh case ID: CLIQ-LIVE-2026-0001, 0002, etc. */
export function generateFreshCaseId(): string {
  if (typeof window === 'undefined') {
    return `CLIQ-LIVE-2026-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
  }
  const current = parseInt(localStorage.getItem(FRESH_CASE_COUNTER_KEY) || '0', 10);
  const next = current + 1;
  localStorage.setItem(FRESH_CASE_COUNTER_KEY, String(next));
  return `CLIQ-LIVE-2026-${String(next).padStart(4, '0')}`;
}

export function getStoredCases(): CollateralAssessmentCase[] {
  if (typeof window === 'undefined') {
    return SEED_CASES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CASES));
      return SEED_CASES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 3000) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CASES));
    return SEED_CASES;
  } catch (err) {
    console.error('Error reading caseStore:', err);
    return SEED_CASES;
  }
}

export function saveNewCase(newCase: CollateralAssessmentCase): CollateralAssessmentCase[] {
  const current = getStoredCases();
  const updated = [newCase, ...current];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving new case:', e);
    }
  }
  return updated;
}

export function processNewCase(payload: {
  borrowerName: string;
  borrower?: any;
  product: LoanProduct;
  loanPurpose?: string;
  loanFacilityRequested: number;
  tenureYears?: number;
  interestRate?: number;
  propertyProfile: any;
  valuerReport?: any;
  balanceTransfer?: any;
}): CollateralAssessmentCase {
  const location = payload.propertyProfile?.location || 'Dadar West';
  const carpetArea = Number(payload.propertyProfile?.carpetArea) || 850;
  const benchmarkRate = BENCHMARKS[location] || 35000;

  const modelIndicativeValue = Math.round(carpetArea * benchmarkRate);
  const minRange = Math.round(modelIndicativeValue * 0.95);
  const maxRange = Math.round(modelIndicativeValue * 1.05);

  const valuerAssessedValue = payload.valuerReport?.assessedValue
    ? Number(payload.valuerReport.assessedValue)
    : modelIndicativeValue;
  const absoluteDiff = Math.abs(valuerAssessedValue - modelIndicativeValue);
  const percentageDiff = modelIndicativeValue > 0
    ? Number(((valuerAssessedValue - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2))
    : 0;

  let reviewLevel: ReviewLevel = 'LOW';
  if (Math.abs(percentageDiff) > 8.0) {
    reviewLevel = 'HIGH';
  } else if (Math.abs(percentageDiff) > 3.0) {
    reviewLevel = 'MEDIUM';
  }

  // Fresh case ID — NEVER added to portfolio, stays at 3,000
  const freshCaseId = generateFreshCaseId();

  const valuerRate = valuerAssessedValue > 0 ? Math.round(valuerAssessedValue / carpetArea) : benchmarkRate;
  const today = new Date().toISOString().split('T')[0];
  const bhk = payload.propertyProfile?.bhk || '2 BHK';

  const createdCase: CollateralAssessmentCase = {
    caseId: freshCaseId,
    freshCaseId,
    isFreshCase: true,
    borrowerName: payload.borrowerName || 'New Applicant',
    borrower: payload.borrower,
    product: payload.product,
    loanPurpose: payload.loanPurpose,
    loanFacilityRequested: Number(payload.loanFacilityRequested) || 20000000,
    tenureYears: payload.tenureYears,
    interestRate: payload.interestRate,
    propertyProfile: {
      location,
      city: location.includes('Thane') ? 'Thane' : 'Mumbai',
      address: payload.propertyProfile?.address || '',
      pinCode: payload.propertyProfile?.pinCode || '',
      propertyType: payload.propertyProfile?.propertyType || 'Apartment',
      bhk,
      carpetArea,
      builtUpArea: payload.propertyProfile?.builtUpArea,
      floor: Number(payload.propertyProfile?.floor) || 1,
      totalFloors: payload.propertyProfile?.totalFloors,
      buildingAge: Number(payload.propertyProfile?.buildingAge) || 5,
      parking: payload.propertyProfile?.parking || 'Open Parking',
      occupancy: payload.propertyProfile?.occupancy || 'Self-occupied',
    },
    modelIndicativeValue,
    indicativeRange: { min: minRange, max: maxRange },
    valuationConfidence: 'High',
    comparables: [
      { project: `${location} Prime Residency`, bhk, ratePerSqFt: benchmarkRate, distance: '0.1 km' },
      { project: `${location} Heights`, bhk, ratePerSqFt: Math.round(benchmarkRate * 0.985), distance: '0.3 km' },
      { project: `${location} Park View`, bhk, ratePerSqFt: Math.round(benchmarkRate * 1.015), distance: '0.5 km' },
    ],
    valuerReport: payload.valuerReport ? {
      valuerName: payload.valuerReport.valuerName || 'Empaneled IBBI Valuer',
      assessedValue: valuerAssessedValue,
      areaConsidered: payload.valuerReport.areaConsidered || carpetArea,
      rateApplied: valuerRate,
      inspectionDate: payload.valuerReport.inspectionDate || today,
      conditionRating: payload.valuerReport.conditionRating || 'Good',
      marketability: 'High Liquidity',
      valuationMethod: payload.valuerReport.valuationMethod || 'Sales Comparison Approach',
      comparablesUsedCount: payload.valuerReport.comparablesUsedCount || 3,
      comparablesAvgRate: payload.valuerReport.comparablesAvgRate || benchmarkRate,
      adjustmentsNote: payload.valuerReport.adjustmentsNote,
    } : undefined,
    deviation: {
      absoluteDiff,
      percentageDiff,
      effectiveRate: {
        modelRate: benchmarkRate,
        valuerRate,
        diffPerSqFt: valuerRate - benchmarkRate,
      },
      comparablesCount: {
        modelCount: 3,
        valuerCount: payload.valuerReport?.comparablesUsedCount || 3,
      },
      avgComparableRate: {
        modelAvg: benchmarkRate,
        valuerAvg: payload.valuerReport?.comparablesAvgRate || benchmarkRate,
      },
      areaUsed: {
        modelArea: carpetArea,
        valuerArea: payload.valuerReport?.areaConsidered || carpetArea,
      },
      valuationDate: {
        modelDate: today,
        valuerDate: payload.valuerReport?.inspectionDate || today,
      },
      methodology: {
        modelMethod: 'AI Comparable-based Valuation Model',
        valuerMethod: payload.valuerReport?.valuationMethod || 'Sales Comparison Approach',
      },
      explicitAdjustments: payload.valuerReport?.adjustmentsNote || 'No explicit adjustments noted',
      explanationConfidence: 'High',
      explanationText: `CollateralIQ indicative value ₹${(modelIndicativeValue / 1e7).toFixed(3)} Cr vs independent valuer ₹${(valuerAssessedValue / 1e7).toFixed(3)} Cr (${percentageDiff > 0 ? '+' : ''}${percentageDiff}% deviation). Primary driver: effective rate ₹${benchmarkRate.toLocaleString()}/sq.ft (model) vs ₹${valuerRate.toLocaleString()}/sq.ft (valuer) on ${carpetArea} sq.ft carpet area.`,
      identifiedDrivers: [
        `Effective Rate Difference (${valuerRate - benchmarkRate > 0 ? '+' : ''}₹${(valuerRate - benchmarkRate).toLocaleString()}/sq.ft)`,
        `Review Level Classification (${reviewLevel})`,
        ...(Math.abs(percentageDiff) > 3 ? [`Deviation Exceeds 3% Threshold (${percentageDiff > 0 ? '+' : ''}${percentageDiff}%)`] : []),
      ],
    },
    balanceTransfer: payload.balanceTransfer || { isBalanceTransfer: false },
    reviewLevel,
    reviewDrivers: [
      `Valuation Deviation (${percentageDiff > 0 ? '+' : ''}${percentageDiff}%)`,
      `LTV Analysis Required`,
      `Review Priority (${reviewLevel})`,
    ],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  // NOTE: Fresh cases (CLIQ-LIVE-2026-XXXX) are NOT saved to the 3,000-case portfolio.
  // The 3,000-case portfolio baseline stays clean and unchanged.
  return createdCase;
}
