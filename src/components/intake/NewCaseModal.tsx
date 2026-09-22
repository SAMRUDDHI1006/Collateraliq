'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
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
  Lock,
  Unlock,
  AlertCircle,
  FileSpreadsheet,
  Loader2,
  Edit2,
  Save,
  FileCheck,
} from 'lucide-react';
import { CollateralAssessmentCase, LoanProduct, PropertyType } from '@/types/collateral';
import { processNewCase, REGIONS_22, BENCHMARKS, generateFreshCaseId } from '@/lib/caseStore';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CollateralAssessmentCase) => void;
  localityList: { name: string; rate: number }[];
  onOpenDemoCase?: () => void;
}

type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  onOpenDemoCase,
}) => {
  // Step 0: Product Selection, Step 1: Borrower, Step 2: Loan, Step 3: Property,
  // Step 4: Property PDF, Step 5: Valuer PDF, Step 6: Analysis Engine, Step 7: Review, Step 8: Save/Report
  const [currentStep, setCurrentStep] = useState<WizardStep>(0);
  const [caseId, setCaseId] = useState<string>('');

  // Generate dynamic sequential fresh Case ID when modal opens
  useEffect(() => {
    if (isOpen) {
      setCaseId(generateFreshCaseId());
    }
  }, [isOpen]);

  // Step 00: Loan Type Selection
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  // Step 01: Borrower Details — 100% EMPTY DEFAULT
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [residentialCity, setResidentialCity] = useState('');
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'Self-Employed' | 'Business Owner' | 'Professional' | 'Other'>('Salaried');
  const [employerOrBusinessName, setEmployerOrBusinessName] = useState('');
  const [annualIncome, setAnnualIncome] = useState<number | ''>('');
  const [existingMonthlyEmi, setExistingMonthlyEmi] = useState<number | ''>('');
  const [cibilScore, setCibilScore] = useState<number | ''>('');

  // Touched states for validation feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Step 02: Loan Details — 100% EMPTY DEFAULT
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanFacilityRequested, setLoanFacilityRequested] = useState<number | ''>('');
  const [tenureYears, setTenureYears] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');

  // Conditional Balance Transfer Fields — 100% EMPTY DEFAULT
  const [previousLender, setPreviousLender] = useState('');
  const [originalLoanAmount, setOriginalLoanAmount] = useState<number | ''>('');
  const [currentOutstanding, setCurrentOutstanding] = useState<number | ''>('');
  const [existingEmi, setExistingEmi] = useState<number | ''>('');
  const [existingBtInterestRate, setExistingBtInterestRate] = useState<number | ''>('');
  const [loanStartDate, setLoanStartDate] = useState('');
  const [previousLoanAccountRef, setPreviousLoanAccountRef] = useState('');
  const [previousValuation, setPreviousValuation] = useState<number | ''>('');
  const [previousValuationDate, setPreviousValuationDate] = useState('');
  const [previousRatePerSqFt, setPreviousRatePerSqFt] = useState<number | ''>('');
  const [previousAreaConsidered, setPreviousAreaConsidered] = useState<number | ''>('');
  const [previousValuationMethod, setPreviousValuationMethod] = useState('Sales Comparison Approach');
  const [previousValuerName, setPreviousValuerName] = useState('');

  // Step 03: Property Details — 100% EMPTY DEFAULT
  const [region, setRegion] = useState('');
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

  // Step 04: Property Information PDF Upload & Actual Extraction
  const [propertyPdfFile, setPropertyPdfFile] = useState<File | null>(null);
  const [propertyPdfFileName, setPropertyPdfFileName] = useState('');
  const [propertyPdfExtracting, setPropertyPdfExtracting] = useState(false);
  const [propertyExtractionStage, setPropertyExtractionStage] = useState('');
  const [propertyExtractedData, setPropertyExtractedData] = useState<any | null>(null);
  const [propertyExtractionConfirmed, setPropertyExtractionConfirmed] = useState(false);
  const [propertyConflict, setPropertyConflict] = useState<{ field: string; label: string; manualValue: any; pdfValue: any } | null>(null);
  const [propertyPdfError, setPropertyPdfError] = useState<string | null>(null);

  // Step 05: Independent Valuation Report PDF Upload & Actual Extraction
  const [valPdfFile, setValPdfFile] = useState<File | null>(null);
  const [valPdfFileName, setValPdfFileName] = useState('');
  const [valPdfExtracting, setValPdfExtracting] = useState(false);
  const [valExtractionStage, setValExtractionStage] = useState('');
  const [valExtractedData, setValExtractedData] = useState<any | null>(null);
  const [valuerName, setValuerName] = useState('');
  const [valuerAssessedValue, setValuerAssessedValue] = useState<number | ''>('');
  const [valuerInspectionDate, setValuerInspectionDate] = useState('');
  const [valuerConditionRating, setValuerConditionRating] = useState('Good');
  const [valuerComparablesCount, setValuerComparablesCount] = useState<number | ''>(3);
  const [valuerAdjustmentsNote, setValuerAdjustmentsNote] = useState('');
  const [valExtractionConfirmed, setValExtractionConfirmed] = useState(false);
  const [valConflict, setValConflict] = useState<{ field: string; label: string; manualValue: any; pdfValue: any } | null>(null);
  const [valPdfError, setValPdfError] = useState<string | null>(null);

  // Step 06: Analysis Processing Animation Stages
  const [analyzingIndex, setAnalyzingIndex] = useState(0);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  // Calculated Case Object
  const [calculatedCase, setCalculatedCase] = useState<CollateralAssessmentCase | null>(null);

  const isBT = selectedProduct === 'Balance Transfer';
  const fileInputPropRef = useRef<HTMLInputElement | null>(null);
  const fileInputValRef = useRef<HTMLInputElement | null>(null);

  // Validation Rules
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Borrower
    if (!fullName.trim()) errs.fullName = 'Borrower Full Name is required.';
    else if (fullName.trim().length < 3) errs.fullName = 'Full Name must be at least 3 characters.';

    if (age === '') errs.age = 'Age is required.';
    else if (Number(age) < 18 || Number(age) > 75) errs.age = 'Age must be between 18 and 75.';

    const mobileClean = mobileNumber.replace(/[\s+-]/g, '');
    if (!mobileNumber.trim()) errs.mobileNumber = 'Mobile Number is required.';
    else if (!/^(91)?[6-9]\d{9}$/.test(mobileClean)) errs.mobileNumber = 'Must be a valid 10-digit Indian mobile number.';

    if (!residentialCity.trim()) errs.residentialCity = 'Residential City is required.';
    if (!employerOrBusinessName.trim()) errs.employerOrBusinessName = 'Employer / Business Name is required.';

    if (annualIncome === '') errs.annualIncome = 'Annual Income is required.';
    else if (Number(annualIncome) <= 0) errs.annualIncome = 'Annual Income must be greater than ₹0.';

    if (existingMonthlyEmi === '') errs.existingMonthlyEmi = 'Existing EMI is required (enter 0 if none).';
    else if (Number(existingMonthlyEmi) < 0) errs.existingMonthlyEmi = 'EMI cannot be negative.';

    if (cibilScore === '') errs.cibilScore = 'CIBIL Score is required.';
    else if (Number(cibilScore) < 300 || Number(cibilScore) > 900) errs.cibilScore = 'CIBIL must be between 300 and 900.';

    // Loan
    if (!loanPurpose.trim()) errs.loanPurpose = 'Loan Purpose is required.';
    if (loanFacilityRequested === '') errs.loanFacilityRequested = 'Loan Amount Requested is required.';
    else if (Number(loanFacilityRequested) <= 0) errs.loanFacilityRequested = 'Loan Amount must be greater than ₹0.';

    if (tenureYears === '') errs.tenureYears = 'Tenure is required.';
    else if (Number(tenureYears) < 1 || Number(tenureYears) > 30) errs.tenureYears = 'Tenure must be between 1 and 30 years.';

    if (interestRate === '') errs.interestRate = 'Interest Rate is required.';
    else if (Number(interestRate) < 4 || Number(interestRate) > 25) errs.interestRate = 'Interest Rate must be between 4% and 25%.';

    // Balance Transfer specific
    if (isBT) {
      if (!previousLender.trim()) errs.previousLender = 'Existing Lender is required for Balance Transfer.';
      if (originalLoanAmount === '') errs.originalLoanAmount = 'Original Loan Amount is required.';
      else if (Number(originalLoanAmount) <= 0) errs.originalLoanAmount = 'Original Loan Amount must be > 0.';
      if (currentOutstanding === '') errs.currentOutstanding = 'Current Outstanding is required.';
      else if (Number(currentOutstanding) <= 0) errs.currentOutstanding = 'Current Outstanding must be > 0.';
      if (previousValuation === '') errs.previousValuation = 'Previous Bank Valuation is required.';
      else if (Number(previousValuation) <= 0) errs.previousValuation = 'Previous Valuation must be > 0.';
      if (!previousValuationDate) errs.previousValuationDate = 'Previous Valuation Date is required.';
    }

    // Property
    if (!region) errs.region = 'Region selection is required.';
    if (!address.trim()) errs.address = 'Property Address is required.';
    if (!pinCode.trim()) errs.pinCode = 'PIN Code is required.';
    else if (!/^\d{6}$/.test(pinCode.trim())) errs.pinCode = 'PIN Code must be a 6-digit numeric code.';

    if (carpetArea === '') errs.carpetArea = 'Carpet Area is required.';
    else if (Number(carpetArea) <= 0) errs.carpetArea = 'Carpet Area must be greater than 0 sq.ft.';

    if (floor === '') errs.floor = 'Floor number is required.';
    if (totalFloors === '') errs.totalFloors = 'Total floors is required.';
    else if (floor !== '' && Number(floor) > Number(totalFloors)) errs.totalFloors = 'Total floors must be ≥ floor number.';

    if (buildingAge === '') errs.buildingAge = 'Building Age is required.';
    else if (Number(buildingAge) < 0) errs.buildingAge = 'Building Age cannot be negative.';

    if (!parking.trim()) errs.parking = 'Parking specification is required.';

    // Valuer Report
    if (valuerAssessedValue === '') errs.valuerAssessedValue = 'Independent Valuer Assessed Value is required.';
    else if (Number(valuerAssessedValue) <= 0) errs.valuerAssessedValue = 'Valuer Assessed Value must be greater than ₹0.';

    if (!valuerName.trim()) errs.valuerName = 'Empaneled Valuer Name is required.';
    if (!valuerInspectionDate) errs.valuerInspectionDate = 'Valuer Inspection Date is required.';

    return errs;
  }, [
    fullName, age, mobileNumber, residentialCity, employerOrBusinessName, annualIncome, existingMonthlyEmi, cibilScore,
    loanPurpose, loanFacilityRequested, tenureYears, interestRate, isBT, previousLender, originalLoanAmount, currentOutstanding,
    previousValuation, previousValuationDate, region, address, pinCode, carpetArea, floor, totalFloors, buildingAge, parking,
    valuerAssessedValue, valuerName, valuerInspectionDate,
  ]);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Missing Fields Checklist for Analysis Gate
  const missingInputs = useMemo(() => {
    const list: { category: string; field: string; valid: boolean }[] = [
      { category: 'Borrower', field: 'Full Name', valid: !errors.fullName },
      { category: 'Borrower', field: 'Age', valid: !errors.age },
      { category: 'Borrower', field: 'Mobile Number', valid: !errors.mobileNumber },
      { category: 'Borrower', field: 'Annual Income', valid: !errors.annualIncome },
      { category: 'Borrower', field: 'CIBIL Score', valid: !errors.cibilScore },
      { category: 'Loan', field: 'Loan Amount Requested', valid: !errors.loanFacilityRequested },
      { category: 'Loan', field: 'Tenure & Rate', valid: !errors.tenureYears && !errors.interestRate },
      { category: 'Property', field: 'Region (Locality)', valid: !errors.region },
      { category: 'Property', field: 'Property Address', valid: !errors.address },
      { category: 'Property', field: 'Carpet Area', valid: !errors.carpetArea },
      { category: 'Valuation', field: 'Valuer Assessed Value', valid: !errors.valuerAssessedValue },
      { category: 'Valuation', field: 'Valuer Name & Date', valid: !errors.valuerName && !errors.valuerInspectionDate },
    ];

    if (isBT) {
      list.push(
        { category: 'Balance Transfer', field: 'Previous Lender & Outstanding', valid: !errors.previousLender && !errors.currentOutstanding },
        { category: 'Balance Transfer', field: 'Previous Bank Valuation & Date', valid: !errors.previousValuation && !errors.previousValuationDate }
      );
    }

    return list;
  }, [errors, isBT]);

  const allRequiredValid = missingInputs.every((i) => i.valid);

  // Analysis Stages Sequence
  const ANALYSIS_STAGES = [
    'Preparing case data...',
    'Processing property information...',
    'Analyzing comparable inputs...',
    'Calculating model-supported valuation...',
    'Processing independent valuation...',
    'Calculating LTV...',
    'Calculating collateral coverage...',
    'Comparing valuations...',
    'Identifying measurable differences...',
    'Determining review level...',
    'Analysis complete',
  ];

  // Real PDF Upload & Extraction Handler
  const handlePropertyPdfUpload = async (file: File) => {
    setPropertyPdfFile(file);
    setPropertyPdfFileName(file.name);
    setPropertyPdfExtracting(true);
    setPropertyPdfError(null);
    setPropertyConflict(null);

    try {
      setPropertyExtractionStage('Uploading PDF...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'property_info');
      formData.append(
        'manual_inputs',
        JSON.stringify({
          carpetArea: carpetArea !== '' ? Number(carpetArea) : undefined,
          region: region || undefined,
        })
      );

      setPropertyExtractionStage('Reading PDF text layer...');
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      setPropertyExtractionStage('Extracting Property Information...');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract text from PDF.');
      }

      setPropertyExtractionStage('Structuring Property Data...');
      await new Promise((r) => setTimeout(r, 400));

      setPropertyExtractedData(data.extracted);

      // Check conflicts
      if (data.conflicts && data.conflicts.length > 0) {
        setPropertyConflict(data.conflicts[0]);
      } else {
        // Auto populate fields that were blank
        if (data.extracted.carpetArea?.value && carpetArea === '') {
          setCarpetArea(data.extracted.carpetArea.value);
        }
        if (data.extracted.builtUpArea?.value && builtUpArea === '') {
          setBuiltUpArea(data.extracted.builtUpArea.value);
        }
        if (data.extracted.bhk?.value && !bhk) {
          setBhk(data.extracted.bhk.value);
        }
        if (data.extracted.region?.value && !region) {
          setRegion(data.extracted.region.value);
        }
        if (data.extracted.address?.value && !address) {
          setAddress(data.extracted.address.value);
        }
        if (data.extracted.pinCode?.value && !pinCode) {
          setPinCode(data.extracted.pinCode.value);
        }
        if (data.extracted.floor?.value && floor === '') {
          setFloor(data.extracted.floor.value);
        }
        if (data.extracted.totalFloors?.value && totalFloors === '') {
          setTotalFloors(data.extracted.totalFloors.value);
        }
        if (data.extracted.buildingAge?.value !== null && buildingAge === '') {
          setBuildingAge(data.extracted.buildingAge.value);
        }
        if (data.extracted.parking?.value && !parking) {
          setParking(data.extracted.parking.value);
        }
        if (data.extracted.occupancy?.value && !occupancy) {
          setOccupancy(data.extracted.occupancy.value);
        }
      }

      setPropertyExtractionStage('Ready for Review');
    } catch (err: any) {
      console.error('Property PDF extraction error:', err);
      setPropertyPdfError(err.message || 'Unable to extract information from this PDF. Please enter manually.');
    } finally {
      setPropertyPdfExtracting(false);
    }
  };

  // Real Valuation PDF Upload & Extraction Handler
  const handleValuationPdfUpload = async (file: File) => {
    setValPdfFile(file);
    setValPdfFileName(file.name);
    setValPdfExtracting(true);
    setValPdfError(null);
    setValConflict(null);

    try {
      setValExtractionStage('Uploading PDF...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', 'valuation_report');
      formData.append(
        'manual_inputs',
        JSON.stringify({
          valuerAssessedValue: valuerAssessedValue !== '' ? Number(valuerAssessedValue) : undefined,
        })
      );

      setValExtractionStage('Reading Valuation PDF...');
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      setValExtractionStage('Extracting IBBI Valuation Metrics...');
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract text from Valuation PDF.');
      }

      setValExtractionStage('Structuring Valuation Data...');
      await new Promise((r) => setTimeout(r, 400));

      setValExtractedData(data.extracted);

      if (data.conflicts && data.conflicts.length > 0) {
        setValConflict(data.conflicts[0]);
      } else {
        if (data.extracted.assessedValue?.value && valuerAssessedValue === '') {
          setValuerAssessedValue(data.extracted.assessedValue.value);
        }
        if (data.extracted.valuerName?.value && !valuerName) {
          setValuerName(data.extracted.valuerName.value);
        }
        if (data.extracted.inspectionDate?.value && !valuerInspectionDate) {
          setValuerInspectionDate(data.extracted.inspectionDate.value);
        }
        if (data.extracted.conditionRating?.value) {
          setValuerConditionRating(data.extracted.conditionRating.value);
        }
        if (data.extracted.comparablesCount?.value) {
          setValuerComparablesCount(data.extracted.comparablesCount.value);
        }
        if (data.extracted.adjustmentsNote?.value) {
          setValuerAdjustmentsNote(data.extracted.adjustmentsNote.value);
        }
      }

      setValExtractionStage('Ready for Review');
    } catch (err: any) {
      console.error('Valuation PDF extraction error:', err);
      setValPdfError(err.message || 'Unable to extract information from this PDF. Please enter manually.');
    } finally {
      setValPdfExtracting(false);
    }
  };

  // Run Real Collateral Analysis Progression
  const handleRunCollateralAnalysis = () => {
    if (!allRequiredValid || !selectedProduct) return;

    setCurrentStep(6);
    setAnalyzingIndex(0);
    setAnalysisCompleted(false);

    // Progressive stage transitions
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < ANALYSIS_STAGES.length) {
        setAnalyzingIndex(stage);
      } else {
        clearInterval(interval);
        setAnalysisCompleted(true);

        // Compute FRESH case object
        const resultCase = processNewCase({
          caseId,
          borrowerName: fullName.trim(),
          borrower: {
            fullName: fullName.trim(),
            age: Number(age),
            mobileNumber: mobileNumber.trim(),
            residentialCity: residentialCity.trim(),
            employmentType,
            employerOrBusinessName: employerOrBusinessName.trim(),
            annualIncome: Number(annualIncome),
            existingMonthlyEmi: Number(existingMonthlyEmi),
            cibilScore: Number(cibilScore),
          },
          product: selectedProduct,
          loanPurpose: loanPurpose.trim(),
          loanFacilityRequested: Number(loanFacilityRequested),
          tenureYears: Number(tenureYears),
          interestRate: Number(interestRate),
          propertyProfile: {
            location: region,
            address: address.trim(),
            pinCode: pinCode.trim(),
            propertyType,
            bhk,
            carpetArea: Number(carpetArea),
            builtUpArea: builtUpArea !== '' ? Number(builtUpArea) : undefined,
            floor: Number(floor),
            totalFloors: totalFloors !== '' ? Number(totalFloors) : undefined,
            buildingAge: Number(buildingAge),
            parking: parking.trim(),
            occupancy,
          },
          valuerReport: {
            valuerName: valuerName.trim(),
            assessedValue: Number(valuerAssessedValue),
            inspectionDate: valuerInspectionDate,
            conditionRating: valuerConditionRating,
            comparablesUsedCount: Number(valuerComparablesCount) || 3,
            adjustmentsNote: valuerAdjustmentsNote.trim() || undefined,
          },
          balanceTransfer: isBT ? {
            isBalanceTransfer: true,
            previousLender: previousLender.trim(),
            originalLoanAmount: Number(originalLoanAmount),
            outstandingBalance: Number(currentOutstanding),
            existingEmi: Number(existingEmi),
            existingInterestRate: Number(existingBtInterestRate),
            loanStartDate,
            previousLoanAccountRef: previousLoanAccountRef.trim() || undefined,
            previousValuation: Number(previousValuation),
            previousValuationDate,
            previousRatePerSqFt: Number(previousRatePerSqFt) || undefined,
            previousAreaConsidered: Number(previousAreaConsidered) || undefined,
            previousValuationMethod,
            previousValuerName: previousValuerName.trim() || undefined,
          } : { isBalanceTransfer: false },
        });

        setCalculatedCase(resultCase);
        setTimeout(() => {
          setCurrentStep(7);
        }, 500);
      }
    }, 280);
  };

  // Final Save Case to Dashboard
  const handleSaveCaseToDashboard = async () => {
    if (!calculatedCase) return;

    try {
      // Send to server API to record in server memory and audit logs
      await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calculatedCase),
      });
    } catch (e) {
      console.error('Failed to notify /api/cases:', e);
    }

    // Persist via callback to Context & LocalStorage
    onCaseCreated(calculatedCase);
    onClose();
  };

  if (!isOpen) return null;

  const stepLabels = [
    { num: 1, label: 'Borrower' },
    { num: 2, label: isBT ? 'Loan & BT' : 'Loan' },
    { num: 3, label: 'Property' },
    { num: 4, label: 'Property PDF' },
    { num: 5, label: 'Valuer PDF' },
    { num: 6, label: 'Analysis' },
    { num: 7, label: 'Review' },
    { num: 8, label: 'Save Case' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070B12]/85 backdrop-blur-md flex items-center justify-center p-3 select-none animate-in fade-in duration-150 font-sans">
      <div className="bg-[#0D1522] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#090E17] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Create New Loan Case</span>
                <span className="text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold">
                  {caseId}
                </span>
                {selectedProduct && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                    {selectedProduct}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Fresh Intake Workflow &mdash; 100% User-Entered &amp; PDF-Extracted Data (No Defaults)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDemoCase && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDemoCase();
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Open the pre-configured CLIQ-DADAR-001 demo case"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Explore Demo Case</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper (01 - 08, hidden on step 0) */}
        {currentStep > 0 && (
          <div className="px-6 py-2.5 bg-[#070B12] border-b border-white/10 overflow-x-auto flex items-center justify-between text-[11px] font-mono font-semibold">
            {stepLabels.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  disabled={s.num > currentStep && currentStep < 6}
                  onClick={() => {
                    if (s.num <= currentStep || (currentStep >= 7 && s.num <= 8)) {
                      setCurrentStep(s.num as WizardStep);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : isPast
                      ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-800/60'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span>0{s.num}.</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">

          {/* ========================================================================= */}
          {/* STEP 00: Select Product                                                  */}
          {/* ========================================================================= */}
          {currentStep === 0 && (
            <div className="space-y-6 py-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-white font-heading">Select Loan Product</h3>
                <p className="text-slate-400 text-xs">
                  Choose the loan product to configure mandatory inputs and valuation benchmarks.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 max-w-2xl mx-auto">
                {/* Home Loan */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct('Home Loan');
                    setCurrentStep(1);
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-700/80 bg-[#090E17] hover:border-cyan-400 hover:bg-cyan-950/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <Home className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">🏠 Home Loan</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        New residential acquisition, construction, or plot financing
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                {/* LAP */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct('LAP');
                    setCurrentStep(1);
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-700/80 bg-[#090E17] hover:border-emerald-400 hover:bg-emerald-950/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Building className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">🏢 Loan Against Property (LAP)</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        Term loan facility secured against unencumbered, self-owned residential property
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                {/* Balance Transfer */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct('Balance Transfer');
                    setCurrentStep(1);
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-700/80 bg-[#090E17] hover:border-amber-400 hover:bg-amber-950/20 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Repeat2 className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white text-sm">🔄 Home Loan Balance Transfer</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        Refinance loan from existing lender with 3-way delta valuation (Previous &rarr; Model &rarr; Valuer)
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 font-mono">
                Fresh cases start with <span className="text-cyan-300 font-bold">100% empty fields</span> and generate dynamic Case ID <span className="text-cyan-300 font-bold">{caseId}</span>.
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 01: Borrower Information (100% BLANK)                                */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">01. Borrower Information</h3>
                  <p className="text-[11px] text-slate-400">All fields must be manually entered. Real-time validation active.</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">STEP 01 OF 08</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Borrower Full Name *</span>
                    {!errors.fullName && fullName && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onBlur={() => markTouched('fullName')}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter borrower full name"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.fullName && errors.fullName
                        ? 'border-rose-500 focus:ring-rose-400'
                        : fullName && !errors.fullName
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.fullName}</span>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Age (18-75) *</span>
                    {!errors.age && age !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onBlur={() => markTouched('age')}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Enter age (e.g. 38)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.age && errors.age
                        ? 'border-rose-500 focus:ring-rose-400'
                        : age !== '' && !errors.age
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.age && errors.age && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.age}</span>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Mobile Number (India) *</span>
                    {!errors.mobileNumber && mobileNumber && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={mobileNumber}
                    onBlur={() => markTouched('mobileNumber')}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.mobileNumber && errors.mobileNumber
                        ? 'border-rose-500 focus:ring-rose-400'
                        : mobileNumber && !errors.mobileNumber
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.mobileNumber && errors.mobileNumber && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.mobileNumber}</span>
                  )}
                </div>

                {/* Residential City */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Residential City *</span>
                    {!errors.residentialCity && residentialCity && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={residentialCity}
                    onBlur={() => markTouched('residentialCity')}
                    onChange={(e) => setResidentialCity(e.target.value)}
                    placeholder="Enter city (e.g. Mumbai, Pune, Thane)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.residentialCity && errors.residentialCity
                        ? 'border-rose-500 focus:ring-rose-400'
                        : residentialCity && !errors.residentialCity
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.residentialCity && errors.residentialCity && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.residentialCity}</span>
                  )}
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Type *</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="Salaried">Salaried (Corporate / MNC / Govt)</option>
                    <option value="Business Owner">Business Owner / MSME Proprietor</option>
                    <option value="Self-Employed">Self-Employed Professional</option>
                    <option value="Professional">Doctor / CA / Advocate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Employer / Business Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Employer / Business Name *</span>
                    {!errors.employerOrBusinessName && employerOrBusinessName && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={employerOrBusinessName}
                    onBlur={() => markTouched('employerOrBusinessName')}
                    onChange={(e) => setEmployerOrBusinessName(e.target.value)}
                    placeholder="Enter employer or business enterprise name"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.employerOrBusinessName && errors.employerOrBusinessName
                        ? 'border-rose-500 focus:ring-rose-400'
                        : employerOrBusinessName && !errors.employerOrBusinessName
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.employerOrBusinessName && errors.employerOrBusinessName && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.employerOrBusinessName}</span>
                  )}
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Annual Income (INR) *</span>
                    {!errors.annualIncome && annualIncome !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onBlur={() => markTouched('annualIncome')}
                    onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Enter annual income (e.g. 2400000)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.annualIncome && errors.annualIncome
                        ? 'border-rose-500 focus:ring-rose-400'
                        : annualIncome !== '' && !errors.annualIncome
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.annualIncome && errors.annualIncome && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.annualIncome}</span>
                  )}
                </div>

                {/* Existing Monthly EMI */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Existing Monthly EMI (INR) *</span>
                    {!errors.existingMonthlyEmi && existingMonthlyEmi !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={existingMonthlyEmi}
                    onBlur={() => markTouched('existingMonthlyEmi')}
                    onChange={(e) => setExistingMonthlyEmi(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="Enter existing EMI (0 if none)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.existingMonthlyEmi && errors.existingMonthlyEmi
                        ? 'border-rose-500 focus:ring-rose-400'
                        : existingMonthlyEmi !== '' && !errors.existingMonthlyEmi
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.existingMonthlyEmi && errors.existingMonthlyEmi && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.existingMonthlyEmi}</span>
                  )}
                </div>

                {/* CIBIL Score */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>CIBIL Score (300-900) *</span>
                    {!errors.cibilScore && cibilScore !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={cibilScore}
                    onBlur={() => markTouched('cibilScore')}
                    onChange={(e) => setCibilScore(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Enter score (e.g. 780)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.cibilScore && errors.cibilScore
                        ? 'border-rose-500 focus:ring-rose-400'
                        : cibilScore !== '' && !errors.cibilScore
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.cibilScore && errors.cibilScore && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.cibilScore}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 02: Loan Details & Balance Transfer Conditional                      */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    02. Loan Information {isBT && '& Balance Transfer Details'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Specify facility amount, purpose, and term parameters.</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">STEP 02 OF 08</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loan Purpose */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Loan Purpose *</span>
                    {!errors.loanPurpose && loanPurpose && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={loanPurpose}
                    onBlur={() => markTouched('loanPurpose')}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    placeholder="e.g. Purchase of Residential Flat"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.loanPurpose && errors.loanPurpose
                        ? 'border-rose-500 focus:ring-rose-400'
                        : loanPurpose && !errors.loanPurpose
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.loanPurpose && errors.loanPurpose && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.loanPurpose}</span>
                  )}
                </div>

                {/* Requested Loan Amount */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Loan Amount Requested (INR) *</span>
                    {!errors.loanFacilityRequested && loanFacilityRequested !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={loanFacilityRequested}
                    onBlur={() => markTouched('loanFacilityRequested')}
                    onChange={(e) => setLoanFacilityRequested(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 15000000 (₹1.50 Cr)"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.loanFacilityRequested && errors.loanFacilityRequested
                        ? 'border-rose-500 focus:ring-rose-400'
                        : loanFacilityRequested !== '' && !errors.loanFacilityRequested
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {loanFacilityRequested !== '' && Number(loanFacilityRequested) > 0 && (
                    <span className="text-[10.5px] font-mono text-cyan-300 mt-0.5 block">
                      = ₹{(Number(loanFacilityRequested) / 1e7).toFixed(3)} Cr
                    </span>
                  )}
                  {touched.loanFacilityRequested && errors.loanFacilityRequested && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.loanFacilityRequested}</span>
                  )}
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Tenure (Years, 1-30) *</span>
                    {!errors.tenureYears && tenureYears !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={tenureYears}
                    onBlur={() => markTouched('tenureYears')}
                    onChange={(e) => setTenureYears(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 15"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.tenureYears && errors.tenureYears
                        ? 'border-rose-500 focus:ring-rose-400'
                        : tenureYears !== '' && !errors.tenureYears
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.tenureYears && errors.tenureYears && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.tenureYears}</span>
                  )}
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Proposed Interest Rate (% p.a.) *</span>
                    {!errors.interestRate && interestRate !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onBlur={() => markTouched('interestRate')}
                    onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 8.75"
                    className={`w-full px-3 py-2 bg-[#090E17] border rounded-lg text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                      touched.interestRate && errors.interestRate
                        ? 'border-rose-500 focus:ring-rose-400'
                        : interestRate !== '' && !errors.interestRate
                        ? 'border-emerald-500/60 focus:ring-emerald-400'
                        : 'border-slate-700 focus:ring-cyan-400'
                    }`}
                  />
                  {touched.interestRate && errors.interestRate && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.interestRate}</span>
                  )}
                </div>
              </div>

              {/* BALANCE TRANSFER CONDITIONAL SECTION */}
              {isBT && (
                <div className="mt-4 pt-4 border-t border-amber-500/30 bg-amber-950/10 p-4 rounded-xl space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider font-mono">
                    <Repeat2 className="w-4 h-4" />
                    <span>Existing Loan &amp; Previous Bank Valuation (Balance Transfer Only)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Existing Lender *</label>
                      <input
                        type="text"
                        value={previousLender}
                        onBlur={() => markTouched('previousLender')}
                        onChange={(e) => setPreviousLender(e.target.value)}
                        placeholder="e.g. State Bank of India, HDFC Bank"
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs text-white"
                      />
                      {touched.previousLender && errors.previousLender && (
                        <span className="text-[10px] text-rose-400 mt-1 block">{errors.previousLender}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Current Outstanding Balance (INR) *</label>
                      <input
                        type="number"
                        value={currentOutstanding}
                        onBlur={() => markTouched('currentOutstanding')}
                        onChange={(e) => setCurrentOutstanding(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 11500000"
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                      {touched.currentOutstanding && errors.currentOutstanding && (
                        <span className="text-[10px] text-rose-400 mt-1 block">{errors.currentOutstanding}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Original Sanction Loan Amount (INR) *</label>
                      <input
                        type="number"
                        value={originalLoanAmount}
                        onBlur={() => markTouched('originalLoanAmount')}
                        onChange={(e) => setOriginalLoanAmount(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 14000000"
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                      {touched.originalLoanAmount && errors.originalLoanAmount && (
                        <span className="text-[10px] text-rose-400 mt-1 block">{errors.originalLoanAmount}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Previous Bank Valuation (INR) *</label>
                      <input
                        type="number"
                        value={previousValuation}
                        onBlur={() => markTouched('previousValuation')}
                        onChange={(e) => setPreviousValuation(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 21000000"
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                      {previousValuation !== '' && Number(previousValuation) > 0 && (
                        <span className="text-[10.5px] font-mono text-amber-300 mt-0.5 block">
                          = ₹{(Number(previousValuation) / 1e7).toFixed(3)} Cr
                        </span>
                      )}
                      {touched.previousValuation && errors.previousValuation && (
                        <span className="text-[10px] text-rose-400 mt-1 block">{errors.previousValuation}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Previous Valuation Date *</label>
                      <input
                        type="date"
                        value={previousValuationDate}
                        onBlur={() => markTouched('previousValuationDate')}
                        onChange={(e) => setPreviousValuationDate(e.target.value)}
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                      {touched.previousValuationDate && errors.previousValuationDate && (
                        <span className="text-[10px] text-rose-400 mt-1 block">{errors.previousValuationDate}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Existing EMI (INR/mo)</label>
                      <input
                        type="number"
                        value={existingEmi}
                        onChange={(e) => setExistingEmi(e.target.value ? Number(e.target.value) : '')}
                        placeholder="e.g. 135000"
                        className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 03: Property Information (100% BLANK)                                */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">03. Property Information</h3>
                  <p className="text-[11px] text-slate-400">
                    Select from 22 regulatory micro-markets and enter exact property physical specifications.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">STEP 03 OF 08</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Region */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Region / Locality (22 Defined Regions) *</span>
                    {region && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <select
                    value={region}
                    onBlur={() => markTouched('region')}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="">-- Select Locality --</option>
                    {REGIONS_22.map((r) => (
                      <option key={r} value={r}>
                        {r} (Benchmark: ₹{(BENCHMARKS[r] || 35000).toLocaleString('en-IN')}/sq.ft)
                      </option>
                    ))}
                  </select>
                  {touched.region && errors.region && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.region}</span>
                  )}
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Type *</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="Apartment">Apartment / Residential Flat</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Bungalow">Bungalow</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Property Address *</span>
                    {!errors.address && address && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onBlur={() => markTouched('address')}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Sea Crest CHS, Hill Road, Bandra West"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs text-white"
                  />
                  {touched.address && errors.address && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.address}</span>
                  )}
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>PIN Code *</span>
                    {!errors.pinCode && pinCode && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onBlur={() => markTouched('pinCode')}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="e.g. 400050"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {touched.pinCode && errors.pinCode && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.pinCode}</span>
                  )}
                </div>

                {/* BHK */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Configuration (BHK) *</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="4+ BHK">4+ BHK</option>
                  </select>
                </div>

                {/* Carpet Area */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Carpet Area (sq.ft) *</span>
                    {!errors.carpetArea && carpetArea !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={carpetArea}
                    onBlur={() => markTouched('carpetArea')}
                    onChange={(e) => setCarpetArea(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1100"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {touched.carpetArea && errors.carpetArea && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.carpetArea}</span>
                  )}
                </div>

                {/* Built-Up Area */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 1320"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor No. *</label>
                  <input
                    type="number"
                    value={floor}
                    onBlur={() => markTouched('floor')}
                    onChange={(e) => setFloor(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="e.g. 7"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                </div>

                {/* Total Floors */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Floors in Building *</label>
                  <input
                    type="number"
                    value={totalFloors}
                    onBlur={() => markTouched('totalFloors')}
                    onChange={(e) => setTotalFloors(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="e.g. 14"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {touched.totalFloors && errors.totalFloors && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.totalFloors}</span>
                  )}
                </div>

                {/* Building Age */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Age (years) *</label>
                  <input
                    type="number"
                    value={buildingAge}
                    onBlur={() => markTouched('buildingAge')}
                    onChange={(e) => setBuildingAge(e.target.value !== '' ? Number(e.target.value) : '')}
                    placeholder="e.g. 4"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {touched.buildingAge && errors.buildingAge && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.buildingAge}</span>
                  )}
                </div>

                {/* Parking */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Parking *</label>
                  <input
                    type="text"
                    value={parking}
                    onBlur={() => markTouched('parking')}
                    onChange={(e) => setParking(e.target.value)}
                    placeholder="e.g. 1 Covered Stilt Parking"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                {/* Occupancy */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Occupancy Status *</label>
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <option value="Self-occupied">Self-occupied</option>
                    <option value="Tenant">Tenant</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Indicative Preview */}
              {region && carpetArea !== '' && Number(carpetArea) > 0 && (
                <div className="p-3.5 bg-[#090E17] rounded-xl border border-cyan-500/30 flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="text-slate-400">Indicative Model Value: </span>
                    <span className="text-cyan-300 font-bold text-sm">
                      ₹{((Number(carpetArea) * (BENCHMARKS[region] || 35000)) / 1e7).toFixed(3)} Cr
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {carpetArea} sq.ft &times; ₹{(BENCHMARKS[region] || 35000).toLocaleString('en-IN')}/sq.ft
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 04: Upload Property Information PDF & Real Extraction               */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">04. Upload Property Information PDF</h3>
                  <p className="text-[11px] text-slate-400">
                    Upload an actual PDF (Sale Deed, Index-II, Property Card, Society Share Cert). Real OCR text extraction executes on upload.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">STEP 04 OF 08</span>
              </div>

              {/* File Dropzone */}
              <input
                type="file"
                ref={fileInputPropRef}
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePropertyPdfUpload(file);
                }}
              />

              <div
                onClick={() => fileInputPropRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl bg-[#090E17] text-center space-y-3 cursor-pointer transition-all hover:bg-cyan-950/10 group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto group-hover:scale-105 transition-transform">
                  {propertyPdfExtracting ? (
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-white block">
                    {propertyPdfFileName ? propertyPdfFileName : 'Click to Upload Property Information PDF'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Upload actual PDF &bull; Maximum file size 25 MB
                  </span>
                </div>

                {propertyPdfExtracting && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-600/60 text-cyan-300 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>{propertyExtractionStage}</span>
                  </div>
                )}
              </div>

              {propertyPdfError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{propertyPdfError}</span>
                </div>
              )}

              {/* CONFLICT RESOLUTION MODAL / STRIP */}
              {propertyConflict && (
                <div className="p-4 bg-amber-950/30 border border-amber-500/50 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-mono uppercase">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Input Difference Detected — {propertyConflict.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 bg-[#090E17] rounded-lg border border-slate-700">
                      <span className="text-slate-400 text-[10px] block">Manual Input:</span>
                      <span className="text-white font-bold">{propertyConflict.manualValue}</span>
                    </div>
                    <div className="p-2.5 bg-cyan-950/40 rounded-lg border border-cyan-700/60">
                      <span className="text-cyan-300 text-[10px] block">PDF Extracted:</span>
                      <span className="text-cyan-200 font-bold">{propertyConflict.pdfValue}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300">Which value should be used for this case?</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPropertyConflict(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Use Manual Value
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (propertyConflict.field === 'carpetArea' && propertyExtractedData?.carpetArea?.value) {
                          setCarpetArea(propertyExtractedData.carpetArea.value);
                        } else if (propertyConflict.field === 'region' && propertyExtractedData?.region?.value) {
                          setRegion(propertyExtractedData.region.value);
                        }
                        setPropertyConflict(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer"
                    >
                      Use PDF Value
                    </button>
                  </div>
                </div>
              )}

              {/* REVIEW EXTRACTED INFORMATION TABLE */}
              {propertyExtractedData && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-heading">
                      Review Extracted Information
                    </span>
                    <button
                      type="button"
                      onClick={() => setPropertyExtractionConfirmed(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        propertyExtractionConfirmed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{propertyExtractionConfirmed ? 'Confirmed' : 'Confirm All Extracted Data'}</span>
                    </button>
                  </div>

                  <div className="border border-white/10 rounded-xl overflow-hidden bg-[#090E17]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-[10px] uppercase font-mono text-slate-400 border-b border-white/10">
                        <tr>
                          <th className="py-2 px-3">Field</th>
                          <th className="py-2 px-3">Extracted Value</th>
                          <th className="py-2 px-3">Extraction Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        <tr>
                          <td className="py-2 px-3 text-slate-400">Carpet Area</td>
                          <td className="py-2 px-3 text-white font-bold">
                            {propertyExtractedData.carpetArea?.value ? `${propertyExtractedData.carpetArea.value} sq.ft` : 'Not found in PDF'}
                          </td>
                          <td className="py-2 px-3">
                            {propertyExtractedData.carpetArea?.value ? (
                              <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Extracted</span>
                            ) : (
                              <span className="text-amber-400">Manual Entry Required</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-400">Configuration</td>
                          <td className="py-2 px-3 text-white font-bold">
                            {propertyExtractedData.bhk?.value || 'Not found in PDF'}
                          </td>
                          <td className="py-2 px-3">
                            {propertyExtractedData.bhk?.value ? (
                              <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Extracted</span>
                            ) : (
                              <span className="text-amber-400">Manual Entry Required</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-400">Locality / Region</td>
                          <td className="py-2 px-3 text-white font-bold">
                            {propertyExtractedData.region?.value || 'Not found in PDF'}
                          </td>
                          <td className="py-2 px-3">
                            {propertyExtractedData.region?.value ? (
                              <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Extracted</span>
                            ) : (
                              <span className="text-amber-400">Manual Entry Required</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-400">Property Address</td>
                          <td className="py-2 px-3 text-white truncate max-w-[200px]">
                            {propertyExtractedData.address?.value || 'Not found in PDF'}
                          </td>
                          <td className="py-2 px-3">
                            {propertyExtractedData.address?.value ? (
                              <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Extracted</span>
                            ) : (
                              <span className="text-amber-400">Manual Entry Required</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 05: Upload Independent Valuation Report PDF & Real Extraction       */}
          {/* ========================================================================= */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    05. Upload Independent Valuation Report PDF
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Upload the IBBI valuer report. The engine extracts the assessed valuation, inspection date, valuer name, and methodology.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">STEP 05 OF 08</span>
              </div>

              {/* File Dropzone */}
              <input
                type="file"
                ref={fileInputValRef}
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleValuationPdfUpload(file);
                }}
              />

              <div
                onClick={() => fileInputValRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-700 hover:border-emerald-400 rounded-2xl bg-[#090E17] text-center space-y-3 cursor-pointer transition-all hover:bg-emerald-950/10 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto group-hover:scale-105 transition-transform">
                  {valPdfExtracting ? (
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  ) : (
                    <Scale className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-white block">
                    {valPdfFileName ? valPdfFileName : 'Click to Upload Independent Valuation Report PDF'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Upload valuer report PDF &bull; Maximum file size 25 MB
                  </span>
                </div>

                {valPdfExtracting && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{valExtractionStage}</span>
                  </div>
                )}
              </div>

              {valPdfError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{valPdfError}</span>
                </div>
              )}

              {/* Manual Confirmation / Correction Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Valuer Assessed Value (INR) *</span>
                    {!errors.valuerAssessedValue && valuerAssessedValue !== '' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="number"
                    value={valuerAssessedValue}
                    onBlur={() => markTouched('valuerAssessedValue')}
                    onChange={(e) => setValuerAssessedValue(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Enter valuer assessed value (e.g. 45000000)"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {valuerAssessedValue !== '' && Number(valuerAssessedValue) > 0 && (
                    <span className="text-[10.5px] font-mono text-emerald-400 mt-0.5 block">
                      = ₹{(Number(valuerAssessedValue) / 1e7).toFixed(3)} Cr
                    </span>
                  )}
                  {touched.valuerAssessedValue && errors.valuerAssessedValue && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.valuerAssessedValue}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Empaneled Valuer Name *</span>
                    {!errors.valuerName && valuerName && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="text"
                    value={valuerName}
                    onBlur={() => markTouched('valuerName')}
                    onChange={(e) => setValuerName(e.target.value)}
                    placeholder="e.g. P. V. Kulkarni & Associates"
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs text-white"
                  />
                  {touched.valuerName && errors.valuerName && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.valuerName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 flex items-center justify-between">
                    <span>Inspection Date *</span>
                    {!errors.valuerInspectionDate && valuerInspectionDate && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </label>
                  <input
                    type="date"
                    value={valuerInspectionDate}
                    onBlur={() => markTouched('valuerInspectionDate')}
                    onChange={(e) => setValuerInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 rounded-lg text-xs font-mono text-white"
                  />
                  {touched.valuerInspectionDate && errors.valuerInspectionDate && (
                    <span className="text-[10px] text-rose-400 mt-1 block">{errors.valuerInspectionDate}</span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Condition Rating</label>
                  <select
                    value={valuerConditionRating}
                    onChange={(e) => setValuerConditionRating(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E17] border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Below Average">Below Average</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 06: Progressive Analysis Engine with Analysis Lock                   */}
          {/* ========================================================================= */}
          {currentStep === 6 && (
            <div className="py-6 space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-white font-heading">
                  Executing Collateral Analysis Engine
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Calculating model benchmark indicative value, LTV, collateral coverage ratio, and valuation reconciliation.
                </p>
              </div>

              {/* Progressive Sequence List */}
              <div className="max-w-md mx-auto bg-[#090E17] rounded-xl border border-white/10 p-4 space-y-2 font-mono text-xs">
                {ANALYSIS_STAGES.slice(0, -1).map((stageLabel, sIdx) => {
                  const isDone = analyzingIndex > sIdx;
                  const isCurrent = analyzingIndex === sIdx;
                  return (
                    <div
                      key={stageLabel}
                      className={`flex items-center justify-between py-1 px-2 rounded transition-colors ${
                        isCurrent
                          ? 'bg-cyan-950/60 text-cyan-300 font-bold border border-cyan-700/50'
                          : isDone
                          ? 'text-emerald-400'
                          : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                        )}
                        <span>{stageLabel}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isDone ? 'DONE' : isCurrent ? 'RUNNING' : 'QUEUED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 07: Review Fresh Calculations & Triage Level                         */}
          {/* ========================================================================= */}
          {currentStep === 7 && calculatedCase && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    07. Collateral Assessment Review &amp; Reconciliation
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Results generated strictly from entered case data for {calculatedCase.caseId}.
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold border ${
                  calculatedCase.reviewLevel === 'LOW'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                    : calculatedCase.reviewLevel === 'MEDIUM'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                    : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                }`}>
                  {calculatedCase.reviewLevel} REVIEW MANDATED
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
                <div className="p-4 rounded-xl bg-[#090E17] border border-cyan-500/30 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    CollateralIQ Model Value
                  </span>
                  <div className="text-xl font-extrabold text-cyan-300">
                    ₹{(calculatedCase.modelIndicativeValue / 1e7).toFixed(3)} Cr
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Range: ₹{(calculatedCase.indicativeRange.min / 1e7).toFixed(2)} &ndash; ₹{(calculatedCase.indicativeRange.max / 1e7).toFixed(2)} Cr
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#090E17] border border-blue-500/30 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Independent Valuer
                  </span>
                  <div className="text-xl font-extrabold text-blue-300">
                    ₹{((calculatedCase.valuerReport?.assessedValue || 0) / 1e7).toFixed(3)} Cr
                  </div>
                  <span className={`text-[10px] block font-bold ${
                    Math.abs(calculatedCase.deviation?.percentageDiff || 0) > 8 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {calculatedCase.deviation ? `${calculatedCase.deviation.percentageDiff >= 0 ? '+' : ''}${calculatedCase.deviation.percentageDiff}% deviation` : '0% deviation'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#090E17] border border-purple-500/30 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Calculated LTV &amp; Coverage
                  </span>
                  <div className="text-xl font-extrabold text-white">
                    {calculatedCase.valuerReport?.assessedValue
                      ? `${((calculatedCase.loanFacilityRequested / calculatedCase.valuerReport.assessedValue) * 100).toFixed(1)}%`
                      : `${((calculatedCase.loanFacilityRequested / calculatedCase.modelIndicativeValue) * 100).toFixed(1)}%`}
                  </div>
                  <span className="text-[10px] text-purple-300 block">
                    Coverage:{' '}
                    {(
                      (calculatedCase.valuerReport?.assessedValue || calculatedCase.modelIndicativeValue) /
                      calculatedCase.loanFacilityRequested
                    ).toFixed(2)}
                    &times;
                  </span>
                </div>
              </div>

              {/* Balance Transfer Tripartite Flow */}
              {isBT && calculatedCase.balanceTransfer?.isBalanceTransfer && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold block">
                    BALANCE TRANSFER TRIPARTITE VALUATION MOVEMENT
                  </span>
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="p-2.5 bg-[#090E17] rounded-lg border border-slate-700">
                      <span className="text-[9.5px] text-slate-400 block">Previous Valuation</span>
                      <span className="text-slate-200 font-bold">
                        ₹{((calculatedCase.balanceTransfer.previousValuation || 0) / 1e7).toFixed(3)} Cr
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090E17] rounded-lg border border-cyan-700/60">
                      <span className="text-[9.5px] text-cyan-400 block">CollateralIQ Estimate</span>
                      <span className="text-cyan-200 font-bold">
                        ₹{(calculatedCase.modelIndicativeValue / 1e7).toFixed(3)} Cr
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090E17] rounded-lg border border-slate-700">
                      <span className="text-[9.5px] text-slate-400 block">Current Valuer</span>
                      <span className="text-slate-200 font-bold">
                        ₹{((calculatedCase.valuerReport?.assessedValue || 0) / 1e7).toFixed(3)} Cr
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Factual Deviation Explanation */}
              <div className="p-3.5 bg-[#090E17] rounded-xl border border-white/10 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">
                  Identified Deviation Drivers (Auditable)
                </span>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {calculatedCase.deviation?.explanationText || 'Model alignment calculated across registry, valuer, and locality benchmark data.'}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 08: Action & Save to Dashboard                                       */}
          {/* ========================================================================= */}
          {currentStep === 8 && calculatedCase && (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-150">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-md">
                <FileCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white font-heading">
                  Collateral Assessment Docket Ready
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Case <span className="text-cyan-300 font-mono font-bold">{calculatedCase.caseId}</span> is structured and verified.
                  Save this case to the active dashboard tracking pipeline.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSaveCaseToDashboard}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2 active:scale-[0.98] transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>SAVE CASE TO DASHBOARD</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#090E17] border-t border-white/10 flex items-center justify-between">
          <div>
            {currentStep > 0 && currentStep < 6 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as WizardStep)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
            {currentStep === 7 && (
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Valuation Data</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Steps 1 to 4: Next Step Button */}
            {currentStep >= 1 && currentStep <= 4 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as WizardStep)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Step 5: ANALYSIS LOCK VALIDATION GATE */}
            {currentStep === 5 && (
              <div className="flex items-center gap-2">
                {!allRequiredValid ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{missingInputs.filter((i) => !i.valid).length} inputs missing</span>
                    </span>
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold cursor-not-allowed opacity-60 flex items-center gap-1.5 border border-slate-700"
                      title="Complete all required fields across borrower, loan, property, and valuation"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Analysis Locked</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleRunCollateralAnalysis}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>RUN COLLATERAL ANALYSIS &rarr;</span>
                  </button>
                )}
              </div>
            )}

            {/* Step 7: Proceed to Save */}
            {currentStep === 7 && (
              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-[0.98] transition-all"
              >
                <span>Proceed to Save &rarr;</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
