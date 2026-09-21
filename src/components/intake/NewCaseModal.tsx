'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Scale,
  TrendingUp,
  FileText,
  UploadCloud,
  Check,
} from 'lucide-react';
import { CollateralAssessmentCase, LoanProduct, PropertyType } from '@/types/collateral';
import { processNewCase, REGIONS_22, BENCHMARKS } from '@/lib/caseStore';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CollateralAssessmentCase) => void;
  localityList: { name: string; rate: number }[];
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  localityList,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 01: Borrower Details
  const [fullName, setFullName] = useState('Arjun Mehta');
  const [age, setAge] = useState<number | ''>(42);
  const [mobileNumber, setMobileNumber] = useState('+91 98201 44521');
  const [residentialCity, setResidentialCity] = useState('Mumbai');
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional' | 'Other'>('Business Owner');
  const [employerOrBusinessName, setEmployerOrBusinessName] = useState('Mehta Industrial Supplies');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(4800000);
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<number | ''>(38000);
  const [cibilScore, setCibilScore] = useState<number | ''>(774);

  // Step 02: Loan Details
  const [product, setProduct] = useState<LoanProduct>('LAP');
  const [loanPurpose, setLoanPurpose] = useState('Business Expansion');
  const [loanFacilityRequested, setLoanFacilityRequested] = useState<number | ''>(25000000);
  const [tenureYears, setTenureYears] = useState<number | ''>(15);
  const [interestRate, setInterestRate] = useState<number | ''>(10.75);

  // Balance Transfer subset
  const [isBalanceTransfer, setIsBalanceTransfer] = useState(false);
  const [previousLender, setPreviousLender] = useState('Bank A');
  const [originalLoanAmount, setOriginalLoanAmount] = useState<number | ''>(28000000);
  const [currentOutstanding, setCurrentOutstanding] = useState<number | ''>(19500000);
  const [existingEmi, setExistingEmi] = useState<number | ''>(210000);
  const [existingBtInterestRate, setExistingBtInterestRate] = useState<number | ''>(9.25);
  const [previousValuation, setPreviousValuation] = useState<number | ''>(42000000);
  const [previousValuationDate, setPreviousValuationDate] = useState('2024-01-15');

  // Step 03: Property Details
  const [region, setRegion] = useState('Dadar West');
  const [address, setAddress] = useState('Bhavani Shankar Road, Dadar West');
  const [pinCode, setPinCode] = useState('400028');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [bhk, setBhk] = useState('2 BHK');
  const [carpetArea, setCarpetArea] = useState<number | ''>(850);
  const [builtUpArea, setBuiltUpArea] = useState<number | ''>(1020);
  const [floor, setFloor] = useState<number | ''>(7);
  const [totalFloors, setTotalFloors] = useState<number | ''>(10);
  const [buildingAge, setBuildingAge] = useState<number | ''>(6);
  const [parking, setParking] = useState('1 Covered Stilt');
  const [occupancy, setOccupancy] = useState<'Self-occupied' | 'Tenant' | 'Vacant'>('Self-occupied');

  // Step 04: Single Property PDF state
  const [propertyPdfUploaded, setPropertyPdfUploaded] = useState(true);
  const [propertyPdfFileName, setPropertyPdfFileName] = useState('CLIQ-DADAR-001_Property_Info.pdf');

  // Step 05: Independent Valuation Report PDF state
  const [valPdfUploaded, setValPdfUploaded] = useState(true);
  const [valPdfFileName, setValPdfFileName] = useState('Valuation_Report_Kulkarni_Assoc.pdf');
  const [valuerName, setValuerName] = useState('P. V. Kulkarni & Associates (IBBI Reg)');
  const [valuerAssessedValue, setValuerAssessedValue] = useState<number | ''>(45500000);

  // Step 06: Analysis Processing
  const [analyzingState, setAnalyzingState] = useState<'Extracting' | 'Calculating' | 'Comparing' | 'Analyzing' | 'Ready'>('Extracting');

  if (!isOpen) return null;

  const benchmarkRate = BENCHMARKS[region] || 35000;
  const areaSqft = typeof carpetArea === 'number' ? carpetArea : 850;
  const reqFacility = typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 25000000;
  const modelIndicativeValue = Math.round(areaSqft * benchmarkRate);

  const handlePreFillDemo = () => {
    setFullName('Arjun Mehta');
    setAge(42);
    setMobileNumber('+91 98201 44521');
    setResidentialCity('Mumbai');
    setEmploymentType('Business Owner');
    setEmployerOrBusinessName('Mehta Industrial Supplies');
    setAnnualIncome(4800000);
    setExistingMonthlyEmi(38000);
    setCibilScore(774);

    setProduct('LAP');
    setLoanPurpose('Business Expansion');
    setLoanFacilityRequested(25000000);
    setTenureYears(15);
    setInterestRate(10.75);

    setIsBalanceTransfer(false);

    setRegion('Dadar West');
    setAddress('Flat 702, Shardashram CHS, Bhavani Shankar Road, Dadar West');
    setPinCode('400028');
    setPropertyType('Apartment');
    setBhk('2 BHK');
    setCarpetArea(850);
    setBuiltUpArea(1020);
    setFloor(7);
    setTotalFloors(10);
    setBuildingAge(6);
    setParking('1 Covered Stilt (CP-14)');
    setOccupancy('Self-occupied');

    setPropertyPdfUploaded(true);
    setValPdfUploaded(true);
    setValuerName('P. V. Kulkarni & Associates');
    setValuerAssessedValue(45500000);
  };

  const handleRunAnalysis = () => {
    setCurrentStep(6);
    setAnalyzingState('Extracting');
    setTimeout(() => setAnalyzingState('Calculating'), 500);
    setTimeout(() => setAnalyzingState('Comparing'), 1000);
    setTimeout(() => setAnalyzingState('Analyzing'), 1500);
    setTimeout(() => {
      setAnalyzingState('Ready');
      setCurrentStep(7);
    }, 2000);
  };

  const handleFinalSubmit = () => {
    const createdCase = processNewCase({
      borrowerName: fullName || 'New Applicant',
      borrower: {
        fullName,
        age: typeof age === 'number' ? age : undefined,
        mobileNumber,
        residentialCity,
        employmentType,
        employerOrBusinessName,
        annualIncome: typeof annualIncome === 'number' ? annualIncome : undefined,
        existingMonthlyEmi: typeof existingMonthlyEmi === 'number' ? existingMonthlyEmi : undefined,
        cibilScore: typeof cibilScore === 'number' ? cibilScore : undefined,
      },
      product: isBalanceTransfer ? 'Balance Transfer' : product,
      loanPurpose,
      loanFacilityRequested: typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 20000000,
      tenureYears: typeof tenureYears === 'number' ? tenureYears : 15,
      interestRate: typeof interestRate === 'number' ? interestRate : 10.5,
      propertyProfile: {
        location: region,
        address,
        pinCode,
        propertyType,
        bhk,
        carpetArea: typeof carpetArea === 'number' ? carpetArea : 850,
        builtUpArea: typeof builtUpArea === 'number' ? builtUpArea : 1020,
        floor: typeof floor === 'number' ? floor : 7,
        totalFloors: typeof totalFloors === 'number' ? totalFloors : 10,
        buildingAge: typeof buildingAge === 'number' ? buildingAge : 6,
        parking,
        occupancy,
      },
      valuerReport: valPdfUploaded ? {
        valuerName,
        assessedValue: typeof valuerAssessedValue === 'number' ? valuerAssessedValue : modelIndicativeValue,
        inspectionDate: '2026-08-25',
        conditionRating: 'Good',
      } : undefined,
      balanceTransfer: (isBalanceTransfer || product === 'Balance Transfer') ? {
        isBalanceTransfer: true,
        previousLender,
        originalLoanAmount: typeof originalLoanAmount === 'number' ? originalLoanAmount : undefined,
        outstandingBalance: typeof currentOutstanding === 'number' ? currentOutstanding : undefined,
        existingEmi: typeof existingEmi === 'number' ? existingEmi : undefined,
        existingInterestRate: typeof existingBtInterestRate === 'number' ? existingBtInterestRate : undefined,
        previousValuation: typeof previousValuation === 'number' ? previousValuation : undefined,
        previousValuationDate,
      } : { isBalanceTransfer: false },
    });

    onCaseCreated(createdCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>+ New Loan Case Assessment</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Step 0{currentStep} of 07
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Residential Collateral Assessment &amp; Independent Valuer Report Reconciliation Wizard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreFillDemo}
              className="px-3 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Pre-fill CLIQ-DADAR-001 Demo</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Indicator (01 - 07) */}
        <div className="px-6 py-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto flex items-center justify-between text-[11px] font-mono font-semibold">
          {[
            { num: 1, label: 'Borrower' },
            { num: 2, label: 'Loan & BT' },
            { num: 3, label: 'Property' },
            { num: 4, label: 'Property PDF' },
            { num: 5, label: 'Valuer PDF' },
            { num: 6, label: 'Analysis' },
            { num: 7, label: 'Review' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (s.num <= currentStep) setCurrentStep(s.num as any);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-all ${
                currentStep === s.num
                  ? 'bg-blue-600 text-white font-bold'
                  : currentStep > s.num
                  ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                  : 'text-slate-500'
              }`}
            >
              <span>0{s.num}.</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* STEP 01: Borrower Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>01. Borrower Information</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Residential City</label>
                  <input
                    type="text"
                    value={residentialCity}
                    onChange={(e) => setResidentialCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Professional">Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employer / Business Name</label>
                  <input
                    type="text"
                    value={employerOrBusinessName}
                    onChange={(e) => setEmployerOrBusinessName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Annual Income (INR)</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CIBIL Score</label>
                  <input
                    type="number"
                    value={cibilScore}
                    onChange={(e) => setCibilScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 02: Loan & Balance Transfer Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                02. Loan &amp; Facility Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Category</label>
                  <select
                    value={product}
                    onChange={(e) => {
                      const p = e.target.value as LoanProduct;
                      setProduct(p);
                      if (p === 'Balance Transfer') setIsBalanceTransfer(true);
                    }}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Home Loan">Home Loan</option>
                    <option value="LAP">Loan Against Property (LAP)</option>
                    <option value="Balance Transfer">Home Loan Balance Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Loan Purpose</label>
                  <select
                    value={loanPurpose}
                    onChange={(e) => {
                      setLoanPurpose(e.target.value);
                      if (e.target.value === 'Balance Transfer') setIsBalanceTransfer(true);
                    }}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Home Purchase">Home Purchase</option>
                    <option value="Construction">Construction</option>
                    <option value="Business Expansion">Business Expansion</option>
                    <option value="Working Capital">Working Capital</option>
                    <option value="Balance Transfer">Balance Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Facility Amount Requested (INR)</label>
                  <input
                    type="number"
                    value={loanFacilityRequested}
                    onChange={(e) => setLoanFacilityRequested(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Balance Transfer Dedicated Section */}
              {(isBalanceTransfer || product === 'Balance Transfer' || loanPurpose === 'Balance Transfer') && (
                <div className="p-4 bg-slate-950 rounded-xl border border-blue-900/60 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Home Loan Balance Transfer — Existing Loan Setup</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1">Existing Lender Bank / NBFC</label>
                      <input
                        type="text"
                        value={previousLender}
                        onChange={(e) => setPreviousLender(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white"
                        placeholder="e.g. Bank A"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Current Outstanding Amount (INR)</label>
                      <input
                        type="number"
                        value={currentOutstanding}
                        onChange={(e) => setCurrentOutstanding(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                        placeholder="e.g. 19500000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Previous Bank Valuation (INR)</label>
                      <input
                        type="number"
                        value={previousValuation}
                        onChange={(e) => setPreviousValuation(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                        placeholder="e.g. 42000000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Previous Valuation Date</label>
                      <input
                        type="date"
                        value={previousValuationDate}
                        onChange={(e) => setPreviousValuationDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 03: Property Details */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                03. Residential Property Profile
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Region (22 Predefined)</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {REGIONS_22.map((r) => (
                      <option key={r} value={r} className="bg-white text-slate-900">
                        {r} (Benchmark: ₹{(BENCHMARKS[r] || 35000).toLocaleString()}/sq.ft)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Configuration (BHK)</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 04: Single Property Information PDF Upload */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                04. Property Information PDF Upload
              </h3>
              <p className="text-slate-400 text-xs">
                Upload <strong>ONE</strong> PDF containing property information. The PDF is used solely for data extraction.
              </p>

              <div className="p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-slate-950 text-center space-y-3 cursor-pointer transition-all">
                <UploadCloud className="w-10 h-10 text-blue-400 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">Drag &amp; Drop Property Information PDF</span>
                  <span className="text-[11px] text-slate-400">or click to browse files</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" /> {propertyPdfFileName}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-emerald-400 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> AI Extracted Property Profile
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="text-slate-400">Locality: <span className="text-white font-bold">{region}</span></div>
                  <div className="text-slate-400">Property Type: <span className="text-white font-bold">{propertyType} ({bhk})</span></div>
                  <div className="text-slate-400">Carpet Area: <span className="text-white font-bold">{areaSqft} sq.ft</span></div>
                  <div className="text-slate-400">Built-Up Area: <span className="text-white font-bold">{builtUpArea || 1020} sq.ft</span></div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 05: Independent Valuation Report PDF Upload */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                05. Independent Valuation Report PDF
              </h3>
              <p className="text-slate-400 text-xs">
                Upload the independent/professional valuer report PDF to compute valuation differences.
              </p>

              <div className="p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-950 text-center space-y-3 cursor-pointer transition-all">
                <Scale className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">Upload Independent Valuer Report PDF</span>
                  <span className="text-[11px] text-slate-400">or click to browse files</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
                    <FileText className="w-3.5 h-3.5" /> {valPdfFileName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Empaneled Valuer Name</label>
                  <input
                    type="text"
                    value={valuerName}
                    onChange={(e) => setValuerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valuer Assessed Value (INR)</label>
                  <input
                    type="number"
                    value={valuerAssessedValue}
                    onChange={(e) => setValuerAssessedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 06: Run Collateral Analysis (Processing Animation) */}
          {currentStep === 6 && (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <h3 className="text-base font-extrabold text-white">
                Running Collateral Analysis Engine...
              </h3>

              <div className="flex items-center justify-center gap-3 font-mono text-xs text-blue-300">
                <span className={analyzingState === 'Extracting' ? 'font-bold underline' : 'opacity-60'}>Extracting</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Calculating' ? 'font-bold underline' : 'opacity-60'}>Calculating</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Comparing' ? 'font-bold underline' : 'opacity-60'}>Comparing</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Analyzing' ? 'font-bold underline' : 'opacity-60'}>Analyzing</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Ready' ? 'font-bold underline text-emerald-400' : 'opacity-60'}>Ready</span>
              </div>
            </div>
          )}

          {/* STEP 07: Collateral Assessment Summary & Review */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase text-xs font-mono">Assessment Ready</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    MEDIUM REVIEW
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-800/80 pt-2">
                  <div className="text-slate-400">Borrower: <span className="text-white font-bold">{fullName}</span></div>
                  <div className="text-slate-400">Facility: <span className="text-white font-bold">₹{(reqFacility / 1e7).toFixed(2)} Cr</span></div>
                  <div className="text-slate-400">Model Indicative: <span className="text-emerald-400 font-bold">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span></div>
                  <div className="text-slate-400">Valuer Value: <span className="text-blue-300 font-bold">₹{((valuerAssessedValue || modelIndicativeValue) / 1e7).toFixed(3)} Cr</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as any) : prev))}
            disabled={currentStep === 1 || currentStep === 6}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {currentStep < 5 && (
            <button
              onClick={() => setCurrentStep((prev) => (prev < 5 ? ((prev + 1) as any) : prev))}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 5 && (
            <button
              onClick={handleRunAnalysis}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>RUN COLLATERAL ANALYSIS</span>
            </button>
          )}

          {currentStep === 7 && (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Open Case Analysis Workbench</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
