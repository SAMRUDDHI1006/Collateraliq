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
  Home,
  Repeat2,
} from 'lucide-react';
import { CollateralAssessmentCase, LoanProduct, PropertyType } from '@/types/collateral';
import { processNewCase, REGIONS_22, BENCHMARKS } from '@/lib/caseStore';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CollateralAssessmentCase) => void;
  localityList: { name: string; rate: number }[];
}

// Step 0 is the Loan Type Selection screen (pre-wizard)
type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);

  // Loan Type Selection (Step 0)
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  // Step 01: Borrower Details — blank defaults
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [residentialCity, setResidentialCity] = useState('Mumbai');
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional' | 'Other'>('Salaried');
  const [employerOrBusinessName, setEmployerOrBusinessName] = useState('');
  const [annualIncome, setAnnualIncome] = useState<number | ''>('');
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<number | ''>('');
  const [cibilScore, setCibilScore] = useState<number | ''>('');

  // Step 02: Loan Details — blank defaults
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanFacilityRequested, setLoanFacilityRequested] = useState<number | ''>('');
  const [tenureYears, setTenureYears] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');

  // Balance Transfer — Existing Loan details (Option A: Manual)
  const [previousLender, setPreviousLender] = useState('');
  const [originalLoanAmount, setOriginalLoanAmount] = useState<number | ''>('');
  const [currentOutstanding, setCurrentOutstanding] = useState<number | ''>('');
  const [existingEmi, setExistingEmi] = useState<number | ''>('');
  const [existingBtInterestRate, setExistingBtInterestRate] = useState<number | ''>('');
  const [loanStartDate, setLoanStartDate] = useState('');
  const [previousLoanAccountRef, setPreviousLoanAccountRef] = useState('');
  // Balance Transfer — Previous Valuation (Option A: Manual | Option B: PDF)
  const [btValuationMode, setBtValuationMode] = useState<'manual' | 'pdf'>('manual');
  const [previousValuation, setPreviousValuation] = useState<number | ''>('');
  const [previousValuationDate, setPreviousValuationDate] = useState('');
  const [previousRatePerSqFt, setPreviousRatePerSqFt] = useState<number | ''>('');
  const [previousAreaConsidered, setPreviousAreaConsidered] = useState<number | ''>('');
  const [previousValuationMethod, setPreviousValuationMethod] = useState('Sales Comparison Approach');
  const [previousValuerName, setPreviousValuerName] = useState('');
  const [btPdfFileName, setBtPdfFileName] = useState('');
  const [btPdfUploaded, setBtPdfUploaded] = useState(false);

  // Step 03: Property Details — blank defaults
  const [region, setRegion] = useState('Dadar West');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [bhk, setBhk] = useState('2 BHK');
  const [carpetArea, setCarpetArea] = useState<number | ''>('');
  const [builtUpArea, setBuiltUpArea] = useState<number | ''>('');
  const [floor, setFloor] = useState<number | ''>('');
  const [totalFloors, setTotalFloors] = useState<number | ''>('');
  const [buildingAge, setBuildingAge] = useState<number | ''>('');
  const [parking, setParking] = useState('');
  const [occupancy, setOccupancy] = useState<'Self-occupied' | 'Tenant' | 'Vacant'>('Self-occupied');

  // Step 04: Property Information PDF
  const [propertyPdfUploaded, setPropertyPdfUploaded] = useState(false);
  const [propertyPdfFileName, setPropertyPdfFileName] = useState('');

  // Step 05: Independent Valuation Report PDF
  const [valPdfUploaded, setValPdfUploaded] = useState(false);
  const [valPdfFileName, setValPdfFileName] = useState('');
  const [valuerName, setValuerName] = useState('');
  const [valuerAssessedValue, setValuerAssessedValue] = useState<number | ''>('');
  const [valuerInspectionDate, setValuerInspectionDate] = useState('');
  const [valuerConditionRating, setValuerConditionRating] = useState('Good');
  const [valuerComparablesCount, setValuerComparablesCount] = useState<number | ''>('');
  const [valuerAdjustmentsNote, setValuerAdjustmentsNote] = useState('');

  // Step 06: Analysis Processing
  const [analyzingState, setAnalyzingState] = useState<'Extracting' | 'Calculating' | 'Comparing' | 'Analyzing' | 'Ready'>('Extracting');

  if (!isOpen) return null;

  const isBT = selectedProduct === 'Balance Transfer';

  const benchmarkRate = BENCHMARKS[region] || 35000;
  const areaSqft = typeof carpetArea === 'number' && carpetArea > 0 ? carpetArea : 0;
  const reqFacility = typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 0;
  const modelIndicativeValue = areaSqft > 0 ? Math.round(areaSqft * benchmarkRate) : 0;
  const valuerVal = typeof valuerAssessedValue === 'number' ? valuerAssessedValue : 0;
  const prevValuation = typeof previousValuation === 'number' ? previousValuation : 0;

  const handlePreFillDemo = () => {
    // Pre-fill with CLIQ-DADAR-001 demo data for testing
    setSelectedProduct('LAP');
    setFullName('Arjun Mehta');
    setAge(42);
    setMobileNumber('+91 98201 44521');
    setResidentialCity('Mumbai');
    setEmploymentType('Business Owner');
    setEmployerOrBusinessName('Mehta Industrial Supplies');
    setAnnualIncome(4800000);
    setExistingMonthlyEmi(38000);
    setCibilScore(774);

    setLoanPurpose('Business Expansion');
    setLoanFacilityRequested(25000000);
    setTenureYears(15);
    setInterestRate(10.75);

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
    setPropertyPdfFileName('CLIQ-DADAR-001_Property_Info.pdf');
    setValPdfUploaded(true);
    setValPdfFileName('Valuation_Report_Kulkarni_Assoc.pdf');
    setValuerName('P. V. Kulkarni & Associates (IBBI Reg: IBBI/RV/02/2019/1104)');
    setValuerAssessedValue(45500000);
    setValuerInspectionDate('2026-08-25');
    setValuerConditionRating('Excellent (A+ Structural Grade)');
    setValuerComparablesCount(3);
    setValuerAdjustmentsNote('Valuer applied slight downward adjustment due to 1-month market date offset.');

    if (currentStep === 0) setCurrentStep(1);
  };

  const handleRunAnalysis = () => {
    setCurrentStep(6);
    setAnalyzingState('Extracting');
    setTimeout(() => setAnalyzingState('Calculating'), 600);
    setTimeout(() => setAnalyzingState('Comparing'), 1200);
    setTimeout(() => setAnalyzingState('Analyzing'), 1800);
    setTimeout(() => {
      setAnalyzingState('Ready');
      setCurrentStep(7);
    }, 2500);
  };

  const handleFinalSubmit = () => {
    if (!selectedProduct) return;

    const createdCase = processNewCase({
      borrowerName: fullName || 'New Applicant',
      borrower: {
        fullName: fullName || 'New Applicant',
        age: typeof age === 'number' ? age : undefined,
        mobileNumber: mobileNumber || undefined,
        residentialCity: residentialCity || undefined,
        employmentType,
        employerOrBusinessName: employerOrBusinessName || undefined,
        annualIncome: typeof annualIncome === 'number' ? annualIncome : undefined,
        existingMonthlyEmi: typeof existingMonthlyEmi === 'number' ? existingMonthlyEmi : undefined,
        cibilScore: typeof cibilScore === 'number' ? cibilScore : undefined,
      },
      product: selectedProduct,
      loanPurpose: loanPurpose || (isBT ? 'Balance Transfer' : selectedProduct === 'Home Loan' ? 'Home Purchase' : 'Business Expansion'),
      loanFacilityRequested: typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 0,
      tenureYears: typeof tenureYears === 'number' ? tenureYears : undefined,
      interestRate: typeof interestRate === 'number' ? interestRate : undefined,
      propertyProfile: {
        location: region,
        address,
        pinCode,
        propertyType,
        bhk,
        carpetArea: typeof carpetArea === 'number' ? carpetArea : 0,
        builtUpArea: typeof builtUpArea === 'number' ? builtUpArea : undefined,
        floor: typeof floor === 'number' ? floor : 1,
        totalFloors: typeof totalFloors === 'number' ? totalFloors : undefined,
        buildingAge: typeof buildingAge === 'number' ? buildingAge : 0,
        parking,
        occupancy,
      },
      valuerReport: valPdfUploaded || valuerName ? {
        valuerName: valuerName || 'Empaneled IBBI Valuer',
        assessedValue: typeof valuerAssessedValue === 'number' ? valuerAssessedValue : 0,
        inspectionDate: valuerInspectionDate || new Date().toISOString().split('T')[0],
        conditionRating: valuerConditionRating,
        comparablesUsedCount: typeof valuerComparablesCount === 'number' ? valuerComparablesCount : 3,
        adjustmentsNote: valuerAdjustmentsNote || undefined,
      } : undefined,
      balanceTransfer: isBT ? {
        isBalanceTransfer: true,
        previousLender: previousLender || undefined,
        originalLoanAmount: typeof originalLoanAmount === 'number' ? originalLoanAmount : undefined,
        outstandingBalance: typeof currentOutstanding === 'number' ? currentOutstanding : undefined,
        existingEmi: typeof existingEmi === 'number' ? existingEmi : undefined,
        existingInterestRate: typeof existingBtInterestRate === 'number' ? existingBtInterestRate : undefined,
        loanStartDate: loanStartDate || undefined,
        previousLoanAccountRef: previousLoanAccountRef || undefined,
        previousValuation: typeof previousValuation === 'number' ? previousValuation : undefined,
        previousValuationDate: previousValuationDate || undefined,
        previousRatePerSqFt: typeof previousRatePerSqFt === 'number' ? previousRatePerSqFt : undefined,
        previousAreaConsidered: typeof previousAreaConsidered === 'number' ? previousAreaConsidered : undefined,
        previousValuationMethod: previousValuationMethod || undefined,
        previousValuerName: previousValuerName || undefined,
        previousValuationSource: btValuationMode === 'pdf' ? 'pdf_extracted' : 'manual',
      } : { isBalanceTransfer: false },
    });

    onCaseCreated(createdCase);
    onClose();
  };

  // Step labels for the progress bar (steps 1-7 of the wizard)
  const stepLabels = [
    { num: 1, label: 'Borrower' },
    { num: 2, label: isBT ? 'Loan & BT' : 'Loan' },
    { num: 3, label: 'Property' },
    { num: 4, label: 'Property PDF' },
    { num: 5, label: 'Valuer PDF' },
    { num: 6, label: 'Analysis' },
    { num: 7, label: 'Review' },
  ];

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
                {currentStep > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Step 0{currentStep} of 07
                  </span>
                )}
                {selectedProduct && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {selectedProduct}
                  </span>
                )}
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

        {/* Step Progress Indicator (01 - 07, hidden on step 0) */}
        {currentStep > 0 && (
          <div className="px-6 py-2 bg-slate-950/80 border-b border-slate-800 overflow-x-auto flex items-center justify-between text-[11px] font-mono font-semibold">
            {stepLabels.map((s) => (
              <div
                key={s.num}
                onClick={() => { if (s.num <= currentStep) setCurrentStep(s.num as WizardStep); }}
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
        )}

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">

          {/* STEP 00: Loan Type Selection */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h3 className="text-base font-extrabold text-white">Select Loan Product</h3>
                <p className="text-slate-400 text-xs">Choose the loan type to begin the collateral assessment wizard</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Home Loan */}
                <button
                  onClick={() => { setSelectedProduct('Home Loan'); setCurrentStep(1); }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer hover:border-blue-500 hover:bg-blue-950/30 group ${
                    selectedProduct === 'Home Loan' ? 'border-blue-500 bg-blue-950/40' : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center group-hover:border-blue-400 shrink-0">
                      <Home className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm">🏠 Home Loan</div>
                      <div className="text-slate-400 text-xs mt-0.5">New residential property purchase or construction financing</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 ml-auto shrink-0" />
                  </div>
                </button>

                {/* LAP */}
                <button
                  onClick={() => { setSelectedProduct('LAP'); setCurrentStep(1); }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer hover:border-emerald-500 hover:bg-emerald-950/30 group ${
                    selectedProduct === 'LAP' ? 'border-emerald-500 bg-emerald-950/40' : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center group-hover:border-emerald-400 shrink-0">
                      <Building className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm">🏢 Loan Against Property (LAP)</div>
                      <div className="text-slate-400 text-xs mt-0.5">Mortgage-backed facility against existing owned residential property</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 ml-auto shrink-0" />
                  </div>
                </button>

                {/* Balance Transfer */}
                <button
                  onClick={() => { setSelectedProduct('Balance Transfer'); setCurrentStep(1); }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer hover:border-amber-500 hover:bg-amber-950/30 group ${
                    selectedProduct === 'Balance Transfer' ? 'border-amber-500 bg-amber-950/40' : 'border-slate-700 bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center group-hover:border-amber-400 shrink-0">
                      <Repeat2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm">🔄 Home Loan Balance Transfer</div>
                      <div className="text-slate-400 text-xs mt-0.5">Transfer existing home loan from another lender — includes 3-value previous vs. current valuation analysis</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 ml-auto shrink-0" />
                  </div>
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-500 font-mono">
                Fresh cases get ID prefix <span className="text-blue-300">CLIQ-LIVE-2026-XXXX</span> and are kept separate from the 3,000-case portfolio baseline.
              </p>
            </div>
          )}

          {/* STEP 01: Borrower Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <span>01. Borrower Information</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Sharma"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 38"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 9XXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Residential City</label>
                  <input
                    type="text"
                    value={residentialCity}
                    onChange={(e) => setResidentialCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
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
                    placeholder="e.g. XYZ Pvt. Ltd."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Annual Income (INR)</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 2400000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CIBIL Score</label>
                  <input
                    type="number"
                    value={cibilScore}
                    onChange={(e) => setCibilScore(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 750"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 02: Loan & Balance Transfer Details */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                02. Loan &amp; Facility Information{isBT && ' — Balance Transfer'}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Facility Amount Requested (INR) *</label>
                  <input
                    type="number"
                    value={loanFacilityRequested}
                    onChange={(e) => setLoanFacilityRequested(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 25000000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Loan Purpose</label>
                  <select
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="">Select purpose...</option>
                    {selectedProduct === 'Home Loan' && <option value="Home Purchase">Home Purchase</option>}
                    {selectedProduct === 'Home Loan' && <option value="Construction">Construction</option>}
                    {selectedProduct === 'LAP' && <option value="Business Expansion">Business Expansion</option>}
                    {selectedProduct === 'LAP' && <option value="Working Capital">Working Capital</option>}
                    {selectedProduct === 'LAP' && <option value="Personal Use">Personal Use</option>}
                    {isBT && <option value="Balance Transfer">Balance Transfer</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 9.25"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Balance Transfer — Existing Loan Section */}
              {isBT && (
                <div className="p-4 bg-slate-950 rounded-xl border border-amber-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Repeat2 className="w-4 h-4" />
                    <span>🔄 Balance Transfer — Existing Loan at Previous Lender</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1">Existing Lender Bank / NBFC *</label>
                      <input
                        type="text"
                        value={previousLender}
                        onChange={(e) => setPreviousLender(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white placeholder:text-slate-600"
                        placeholder="e.g. HDFC Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Original Loan Amount (INR)</label>
                      <input
                        type="number"
                        value={originalLoanAmount}
                        onChange={(e) => setOriginalLoanAmount(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                        placeholder="e.g. 28000000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Current Outstanding Amount (INR) *</label>
                      <input
                        type="number"
                        value={currentOutstanding}
                        onChange={(e) => setCurrentOutstanding(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                        placeholder="e.g. 19500000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Existing EMI (INR/month)</label>
                      <input
                        type="number"
                        value={existingEmi}
                        onChange={(e) => setExistingEmi(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                        placeholder="e.g. 210000"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Existing Interest Rate (% p.a.)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={existingBtInterestRate}
                        onChange={(e) => setExistingBtInterestRate(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                        placeholder="e.g. 9.25"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Loan Account Reference No.</label>
                      <input
                        type="text"
                        value={previousLoanAccountRef}
                        onChange={(e) => setPreviousLoanAccountRef(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white placeholder:text-slate-600"
                        placeholder="e.g. HDFC-HL-2021-XXXXX"
                      />
                    </div>
                  </div>

                  {/* Previous Valuation: Option A / Option B */}
                  <div className="pt-2 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Previous Bank Valuation (required for 3-value comparison)</span>
                    </div>

                    {/* Toggle between Option A and Option B */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBtValuationMode('manual')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          btValuationMode === 'manual'
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-600'
                        }`}
                      >
                        Option A — Manual Entry
                      </button>
                      <button
                        onClick={() => setBtValuationMode('pdf')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          btValuationMode === 'pdf'
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-600'
                        }`}
                      >
                        Option B — Upload Previous Valuation Report PDF
                      </button>
                    </div>

                    {/* Option A: Manual entry */}
                    {btValuationMode === 'manual' && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-300 mb-1">Previous Bank Valuation (INR) *</label>
                          <input
                            type="number"
                            value={previousValuation}
                            onChange={(e) => setPreviousValuation(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                            placeholder="e.g. 42000000"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Previous Valuation Date *</label>
                          <input
                            type="date"
                            value={previousValuationDate}
                            onChange={(e) => setPreviousValuationDate(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Previous Rate/sq.ft (INR)</label>
                          <input
                            type="number"
                            value={previousRatePerSqFt}
                            onChange={(e) => setPreviousRatePerSqFt(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                            placeholder="e.g. 49000"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Area Considered by Previous Bank (sq.ft)</label>
                          <input
                            type="number"
                            value={previousAreaConsidered}
                            onChange={(e) => setPreviousAreaConsidered(e.target.value ? Number(e.target.value) : '')}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded font-mono text-white placeholder:text-slate-600"
                            placeholder="e.g. 850"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Previous Valuation Method</label>
                          <select
                            value={previousValuationMethod}
                            onChange={(e) => setPreviousValuationMethod(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white text-slate-900 rounded text-xs font-semibold cursor-pointer"
                          >
                            <option value="Sales Comparison Approach">Sales Comparison Approach</option>
                            <option value="Income Approach">Income Approach</option>
                            <option value="Cost Approach">Cost Approach</option>
                            <option value="Discounted Cash Flow">Discounted Cash Flow</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-1">Previous Valuer Name</label>
                          <input
                            type="text"
                            value={previousValuerName}
                            onChange={(e) => setPreviousValuerName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white placeholder:text-slate-600"
                            placeholder="e.g. Mehta Valuers & Associates"
                          />
                        </div>
                      </div>
                    )}

                    {/* Option B: PDF Upload */}
                    {btValuationMode === 'pdf' && (
                      <div className="space-y-2">
                        <div
                          className="p-6 border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-2xl bg-slate-900 text-center space-y-2 cursor-pointer transition-all"
                          onClick={() => { setBtPdfUploaded(true); setBtPdfFileName('Previous_Valuation_Report.pdf'); }}
                        >
                          <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
                          <span className="text-xs font-bold text-white block">Upload Previous Lender Valuation Report PDF</span>
                          <span className="text-[11px] text-slate-400">AI will extract: valuation, date, rate/sq.ft, area, method</span>
                          {btPdfUploaded && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-xs font-bold">
                              <FileText className="w-3.5 h-3.5" /> {btPdfFileName}
                            </span>
                          )}
                        </div>
                        {btPdfUploaded && (
                          <div className="p-3 bg-slate-950 rounded-lg border border-amber-800/60 text-xs space-y-1">
                            <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">AI Extracted from Previous Valuation Report</span>
                            <div className="text-slate-400 font-mono">Please verify and edit values in Option A if needed.</div>
                          </div>
                        )}
                      </div>
                    )}
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
                  <label className="block text-slate-300 font-semibold mb-1">Region (22 Predefined) *</label>
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
                    placeholder="Flat / House No., Building, Street, Area"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 400028"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
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
                    <option value="4+ BHK">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Carpet Area (sq.ft) *</label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 850"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1020"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor No.</label>
                  <input
                    type="number"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 7"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Floors in Building</label>
                  <input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Building Age (years)</label>
                  <input
                    type="number"
                    value={buildingAge}
                    onChange={(e) => setBuildingAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 6"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parking</label>
                  <input
                    type="text"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    placeholder="e.g. 1 Covered Stilt"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Occupancy Status</label>
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Self-occupied">Self-occupied</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
              </div>

              {areaSqft > 0 && (
                <div className="p-3 bg-slate-950 rounded-lg border border-emerald-800/50 text-xs font-mono">
                  <span className="text-slate-400">CollateralIQ Indicative Value Preview: </span>
                  <span className="text-emerald-400 font-bold text-sm">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
                  <span className="text-slate-400 ml-2">({areaSqft} sq.ft × ₹{benchmarkRate.toLocaleString()}/sq.ft)</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 04: Single Property Information PDF Upload */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                04. Property Information PDF Upload
              </h3>
              <p className="text-slate-400 text-xs">
                Upload <strong>ONE</strong> PDF containing property information (sale deed summary, property card, EC extract, etc.). Used only for data extraction — no document validation performed.
              </p>

              <div
                className="p-8 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-slate-950 text-center space-y-3 cursor-pointer transition-all"
                onClick={() => { setPropertyPdfUploaded(true); if (!propertyPdfFileName) setPropertyPdfFileName('Property_Information_Doc.pdf'); }}
              >
                <UploadCloud className="w-10 h-10 text-blue-400 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">Drag &amp; Drop Property Information PDF</span>
                  <span className="text-[11px] text-slate-400">or click to browse files (PDF only, max 20 MB)</span>
                </div>
                {propertyPdfUploaded && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" /> {propertyPdfFileName}
                    </span>
                  </div>
                )}
              </div>

              {propertyPdfUploaded && areaSqft > 0 && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-emerald-400 uppercase text-[10px] font-mono tracking-wider flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> AI Extracted Property Profile (from manual input)
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="text-slate-400">Locality: <span className="text-white font-bold">{region}</span></div>
                    <div className="text-slate-400">Property Type: <span className="text-white font-bold">{propertyType} ({bhk})</span></div>
                    <div className="text-slate-400">Carpet Area: <span className="text-white font-bold">{areaSqft} sq.ft</span></div>
                    {builtUpArea ? <div className="text-slate-400">Built-Up Area: <span className="text-white font-bold">{builtUpArea} sq.ft</span></div> : null}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500">
                You may proceed without uploading if property details were entered manually in Step 03.
              </p>
            </div>
          )}

          {/* STEP 05: Independent Valuation Report PDF Upload */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                05. Independent Valuer Report PDF
              </h3>
              <p className="text-slate-400 text-xs">
                Upload the independent/professional valuer report PDF. The AI extracts the assessed value, effective rate, date, method, and comparables for reconciliation.
              </p>

              <div
                className="p-8 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl bg-slate-950 text-center space-y-3 cursor-pointer transition-all"
                onClick={() => { setValPdfUploaded(true); if (!valPdfFileName) setValPdfFileName('Independent_Valuation_Report.pdf'); }}
              >
                <Scale className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <span className="text-xs font-bold text-white block">Upload Independent Valuer Report PDF</span>
                  <span className="text-[11px] text-slate-400">or click to browse files (PDF only, max 20 MB)</span>
                </div>
                {valPdfUploaded && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono text-xs font-bold">
                      <FileText className="w-3.5 h-3.5" /> {valPdfFileName}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Empaneled Valuer Name *</label>
                  <input
                    type="text"
                    value={valuerName}
                    onChange={(e) => setValuerName(e.target.value)}
                    placeholder="e.g. P. V. Kulkarni & Associates (IBBI Reg)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Valuer Assessed Value (INR) *</label>
                  <input
                    type="number"
                    value={valuerAssessedValue}
                    onChange={(e) => setValuerAssessedValue(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 45500000"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Inspection / Valuation Date</label>
                  <input
                    type="date"
                    value={valuerInspectionDate}
                    onChange={(e) => setValuerInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condition Rating</label>
                  <select
                    value={valuerConditionRating}
                    onChange={(e) => setValuerConditionRating(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Below Average">Below Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Comparables Used (count)</label>
                  <input
                    type="number"
                    value={valuerComparablesCount}
                    onChange={(e) => setValuerComparablesCount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Adjustments Note</label>
                  <input
                    type="text"
                    value={valuerAdjustmentsNote}
                    onChange={(e) => setValuerAdjustmentsNote(e.target.value)}
                    placeholder="e.g. Minor market timing adjustment"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Live preview: deviation from model */}
              {valuerVal > 0 && modelIndicativeValue > 0 && (
                <div className="p-3 bg-slate-950 rounded-lg border border-blue-800/50 text-xs font-mono space-y-1">
                  <div className="text-slate-400">Valuation Deviation Preview:</div>
                  <div>
                    <span className="text-emerald-400 font-bold">CollateralIQ: ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
                    <span className="text-slate-500 mx-2">vs</span>
                    <span className="text-blue-300 font-bold">Valuer: ₹{(valuerVal / 1e7).toFixed(3)} Cr</span>
                    <span className={`ml-2 font-bold ${Math.abs(((valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100) > 8 ? 'text-rose-400' : 'text-amber-300'}`}>
                      ({((valuerVal - modelIndicativeValue) / modelIndicativeValue * 100) > 0 ? '+' : ''}{((valuerVal - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              )}
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
                <span className={analyzingState === 'Extracting' ? 'font-bold underline text-blue-300' : 'opacity-40'}>Extracting</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Calculating' ? 'font-bold underline text-blue-300' : 'opacity-40'}>Calculating</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Comparing' ? 'font-bold underline text-blue-300' : 'opacity-40'}>Comparing</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Analyzing' ? 'font-bold underline text-blue-300' : 'opacity-40'}>Analyzing</span>
                <span>&rarr;</span>
                <span className={analyzingState === 'Ready' ? 'font-bold underline text-emerald-400' : 'opacity-40'}>Ready</span>
              </div>

              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Processing {areaSqft > 0 ? `${areaSqft} sq.ft` : 'property'} in {region} against 22-region benchmark model...
              </p>
            </div>
          )}

          {/* STEP 07: Collateral Assessment Summary & Review */}
          {currentStep === 7 && (
            <div className="space-y-4 animate-in fade-in duration-200 text-xs">
              {/* Main Summary Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Assessment Ready — Fresh Case
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    ID: CLIQ-LIVE-2026-XXXX
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono border-t border-slate-800/80 pt-2">
                  <div className="text-slate-400">Borrower: <span className="text-white font-bold">{fullName || '—'}</span></div>
                  <div className="text-slate-400">Product: <span className="text-white font-bold">{selectedProduct}</span></div>
                  <div className="text-slate-400">Facility: <span className="text-white font-bold">{reqFacility > 0 ? `₹${(reqFacility / 1e7).toFixed(2)} Cr` : '—'}</span></div>
                  <div className="text-slate-400">Region: <span className="text-white font-bold">{region}</span></div>
                  <div className="text-slate-400">Carpet Area: <span className="text-white font-bold">{areaSqft > 0 ? `${areaSqft} sq.ft` : '—'}</span></div>
                  <div className="text-slate-400">Benchmark Rate: <span className="text-white font-bold">₹{benchmarkRate.toLocaleString()}/sq.ft</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono border-t border-slate-800/80 pt-2">
                  <div className="text-slate-400">CollateralIQ Indicative:
                    <span className="text-emerald-400 font-bold ml-1">
                      {modelIndicativeValue > 0 ? `₹${(modelIndicativeValue / 1e7).toFixed(3)} Cr` : '—'}
                    </span>
                  </div>
                  <div className="text-slate-400">Valuer Value:
                    <span className="text-blue-300 font-bold ml-1">
                      {valuerVal > 0 ? `₹${(valuerVal / 1e7).toFixed(3)} Cr` : 'Not provided'}
                    </span>
                  </div>
                  {modelIndicativeValue > 0 && valuerVal > 0 && (
                    <div className="text-slate-400 col-span-2">Deviation:
                      <span className={`font-bold ml-1 ${Math.abs(((valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100) > 8 ? 'text-rose-400' : Math.abs(((valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100) > 3 ? 'text-amber-300' : 'text-emerald-400'}`}>
                        {((valuerVal - modelIndicativeValue) / modelIndicativeValue * 100) > 0 ? '+' : ''}{((valuerVal - modelIndicativeValue) / modelIndicativeValue * 100).toFixed(2)}%
                        {' '}({Math.abs(((valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100) > 8 ? 'HIGH REVIEW' : Math.abs(((valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100) > 3 ? 'MEDIUM REVIEW' : 'LOW REVIEW'})
                      </span>
                    </div>
                  )}
                  {reqFacility > 0 && modelIndicativeValue > 0 && (
                    <div className="text-slate-400">LTV:
                      <span className="text-white font-bold ml-1">{((reqFacility / modelIndicativeValue) * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>

                {/* BT 3-value preview */}
                {isBT && prevValuation > 0 && (
                  <div className="border-t border-amber-800/50 pt-3 space-y-1">
                    <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">Balance Transfer — Valuation Trajectory</span>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">Previous Bank</span>
                        <span className="font-bold text-white text-xs">₹{(prevValuation / 1e7).toFixed(2)} Cr</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">CollateralIQ Current</span>
                        <span className="font-bold text-emerald-400 text-xs">{modelIndicativeValue > 0 ? `₹${(modelIndicativeValue / 1e7).toFixed(3)} Cr` : '—'}</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">Current Valuer</span>
                        <span className="font-bold text-blue-300 text-xs">{valuerVal > 0 ? `₹${(valuerVal / 1e7).toFixed(3)} Cr` : '—'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 text-[11px]">
                <span className="text-amber-400 font-bold">Note: </span>
                This fresh case will be assigned ID <span className="font-mono text-blue-300">CLIQ-LIVE-2026-XXXX</span> and kept separate from the 3,000-case portfolio. All calculations use your actual input data.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as WizardStep) : 0))}
              disabled={currentStep === 6}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? 'Back to Loan Type' : 'Previous Step'}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 && currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => ((prev + 1) as WizardStep))}
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
