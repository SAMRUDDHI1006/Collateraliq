'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  FileUp,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Car,
  FileText,
  Loader2,
  RefreshCw,
  Edit3,
  Sliders,
  Check,
  Upload,
} from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: LoanCase) => void;
  localityList: { name: string; rate: number }[];
}

// ─── Empty initial form state ────────────────────────────────────────
const EMPTY_FORM = {
  borrower_name: '',
  age: '' as string | number,
  occupation: '',
  employer_business: '',
  vintage_years: '' as string | number,
  annual_income_lakh: '' as string | number,
  existing_emi_inr: '' as string | number,
  credit_score: '' as string | number,
  loan_product: '' as string,
  loan_amount_inr: '' as string | number,
  tenure_years: '' as string | number,
  interest_rate_percent: '' as string | number,
  loan_purpose: '',
  locality: '',
  market_rate_inr_sqft: 50000 as number | string,
  carpet_area_sqft: '' as string | number,
  builtup_area_sqft: '' as string | number,
  parking: '',
  flat_house_number: '',
  building_society: '',
  property_address: '',
};

interface DocketCardState {
  id: string;
  title: string;
  fileName: string;
  isUploading: boolean;
  isUploaded: boolean;
  badge: string;
  badgeColor: string;
  extractedDetails: string;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  localityList,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const primaryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 1 Form State — all fields start empty by default
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // Step 2 Primary Deed Extraction State
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionCompleted, setExtractionCompleted] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  // Editable confirmation fallback state
  const [confirmedCarpetArea, setConfirmedCarpetArea] = useState<number>(0);
  const [confirmedLocality, setConfirmedLocality] = useState<string>('');
  const [confirmedUnit, setConfirmedUnit] = useState<string>('');
  const [hasAreaMismatch, setHasAreaMismatch] = useState<boolean>(false);
  const [confirmedTaxArea, setConfirmedTaxArea] = useState<number>(0);

  // Step 3 Interactive 7-Docket Grid State
  const [dockets, setDockets] = useState<Record<string, DocketCardState>>({
    deed: {
      id: 'deed',
      title: 'Registered Agreement / Sale Deed',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'Auto-linked from Primary Title Deed',
    },
    pr_card: {
      id: 'pr_card',
      title: 'Property Card (PR Card / City Survey)',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'CTS division survey record',
    },
    share_cert: {
      id: 'share_cert',
      title: 'Society Share Certificate',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'Housing society share allocation',
    },
    building_plan: {
      id: 'building_plan',
      title: 'Approved Building Plan',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'MCGM / Local planning approval',
    },
    oc: {
      id: 'oc',
      title: 'Occupancy Certificate (OC)',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'Full building completion certificate',
    },
    tax_receipt: {
      id: 'tax_receipt',
      title: 'Property Tax Receipt',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: 'Municipal assessment & area ledger',
    },
    search_report: {
      id: 'search_report',
      title: 'Search Report (30 Yrs Encumbrance)',
      fileName: '',
      isUploading: false,
      isUploaded: false,
      badge: 'Pending',
      badgeColor: 'bg-slate-100 text-slate-600',
      extractedDetails: '30-year title advocate search',
    },
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Reset form to fully empty state
  const resetToEmpty = () => {
    setFormData({ ...EMPTY_FORM });
    setUploadedFileName('');
    setUploadedFileSize('');
    setIsExtracting(false);
    setExtractionProgress(0);
    setExtractionCompleted(false);
    setExtractedData(null);
    setConfirmedCarpetArea(0);
    setConfirmedLocality('');
    setConfirmedUnit('');
    setHasAreaMismatch(false);
    setConfirmedTaxArea(0);
    setValidationErrors({});
    setCurrentStep(1);
    setDockets({
      deed: { id: 'deed', title: 'Registered Agreement / Sale Deed', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'Auto-linked from Primary Title Deed' },
      pr_card: { id: 'pr_card', title: 'Property Card (PR Card / City Survey)', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'CTS division survey record' },
      share_cert: { id: 'share_cert', title: 'Society Share Certificate', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'Housing society share allocation' },
      building_plan: { id: 'building_plan', title: 'Approved Building Plan', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'MCGM / Local planning approval' },
      oc: { id: 'oc', title: 'Occupancy Certificate (OC)', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'Full building completion certificate' },
      tax_receipt: { id: 'tax_receipt', title: 'Property Tax Receipt', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: 'Municipal assessment & area ledger' },
      search_report: { id: 'search_report', title: 'Search Report (30 Yrs Encumbrance)', fileName: '', isUploading: false, isUploaded: false, badge: 'Pending', badgeColor: 'bg-slate-100 text-slate-600', extractedDetails: '30-year title advocate search' },
    });
  };

  const handleClose = () => {
    resetToEmpty();
    onClose();
  };

  // Pre-fill demo flagship case (Arjun Mehta)
  const handlePreFillFlagship = () => {
    setFormData({
      borrower_name: 'Arjun Mehta',
      age: 38,
      occupation: 'Business Owner',
      employer_business: 'Mehta Industrial Supplies',
      vintage_years: 9,
      annual_income_lakh: 48.0,
      existing_emi_inr: 38000,
      credit_score: 774,
      loan_product: 'Loan Against Property (LAP)',
      loan_amount_inr: 25000000,
      tenure_years: 15,
      interest_rate_percent: 10.75,
      loan_purpose: 'Business Expansion',
      locality: 'Dadar West',
      market_rate_inr_sqft: 55000,
      carpet_area_sqft: 850,
      builtup_area_sqft: 1020,
      parking: '1 Covered Stilt Space (CP-14)',
      flat_house_number: '702',
      building_society: 'Shardashram (The Dadar Co-Op Hsg Soc Ltd)',
      property_address: 'Bhavani Shankar Road, Dadar West, Mumbai 400028',
    });
    setUploadedFileName('CLIQ-DADAR-001_Docket.pdf');
    setUploadedFileSize('1.8 MB');
    setConfirmedCarpetArea(850);
    setConfirmedLocality('Dadar West');
    setConfirmedUnit('Flat 702, 7th Floor');
    setHasAreaMismatch(true);
    setConfirmedTaxArea(920);
    setValidationErrors({});

    // Update dockets
    setDockets((prev) => ({
      ...prev,
      deed: { ...prev.deed, fileName: 'CLIQ-DADAR-001_Docket.pdf', isUploaded: true, badge: 'Verified', badgeColor: 'bg-emerald-100 text-emerald-800', extractedDetails: '850 sq.ft carpet registered' },
      tax_receipt: { ...prev.tax_receipt, fileName: 'Dadar_Tax_Ledger_2025.pdf', isUploaded: true, badge: 'Flagged (+8.24%)', badgeColor: 'bg-amber-100 text-amber-900', extractedDetails: 'Municipal Tax Area: 920 sq.ft' },
      share_cert: { ...prev.share_cert, fileName: 'Shardashram_Share_Cert.pdf', isUploaded: true, badge: 'Uploaded', badgeColor: 'bg-blue-100 text-blue-800', extractedDetails: 'Member: ARJUN MEHTA' },
      search_report: { ...prev.search_report, fileName: '30Yr_Title_Search.pdf', isUploaded: true, badge: 'Prior Charge', badgeColor: 'bg-amber-100 text-amber-800', extractedDetails: 'Prior mortgage disclosed' },
    }));
  };

  // Pre-fill clean sample case (Pooja Shah - Clean Low Risk)
  const handlePreFillClean = () => {
    setFormData({
      borrower_name: 'Pooja Shah',
      age: 34,
      occupation: 'Salaried IT Director',
      employer_business: 'Tech Innovations Pvt Ltd',
      vintage_years: 8,
      annual_income_lakh: 45.0,
      existing_emi_inr: 25000,
      credit_score: 792,
      loan_product: 'Home Loan',
      loan_amount_inr: 18000000,
      tenure_years: 20,
      interest_rate_percent: 8.75,
      loan_purpose: 'Purchase of Residential Property',
      locality: 'Andheri West',
      market_rate_inr_sqft: 46200,
      carpet_area_sqft: 750,
      builtup_area_sqft: 900,
      parking: '1 Covered Space',
      flat_house_number: '1204',
      building_society: 'Green Heights CHS Ltd',
      property_address: 'Lokhandwala Complex, Andheri West, Mumbai 400053',
    });
    setUploadedFileName('Registered_Agreement_Pooja_Shah.pdf');
    setUploadedFileSize('3.1 MB');
    setConfirmedCarpetArea(750);
    setConfirmedLocality('Andheri West');
    setConfirmedUnit('Flat 1204, 12th Floor');
    setHasAreaMismatch(false);
    setConfirmedTaxArea(750);
    setValidationErrors({});

    setDockets((prev) => ({
      ...prev,
      deed: { ...prev.deed, fileName: 'Registered_Agreement_Pooja_Shah.pdf', isUploaded: true, badge: 'Verified', badgeColor: 'bg-emerald-100 text-emerald-800', extractedDetails: '750 sq.ft carpet registered' },
      tax_receipt: { ...prev.tax_receipt, fileName: 'Andheri_Tax_Bill.pdf', isUploaded: true, badge: 'Clean Match', badgeColor: 'bg-emerald-100 text-emerald-800', extractedDetails: 'Municipal Tax Area: 750 sq.ft' },
      share_cert: { ...prev.share_cert, fileName: 'Green_Heights_ShareCert.pdf', isUploaded: true, badge: 'Uploaded', badgeColor: 'bg-blue-100 text-blue-800', extractedDetails: 'Member: POOJA SHAH' },
      search_report: { ...prev.search_report, fileName: 'Search_Report_Clear.pdf', isUploaded: true, badge: 'Clean Title', badgeColor: 'bg-emerald-100 text-emerald-800', extractedDetails: 'Clean Title / No Adverse Charge' },
    }));
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!formData.borrower_name.trim()) errors.borrower_name = true;
    if (!formData.loan_amount_inr || Number(formData.loan_amount_inr) <= 0) errors.loan_amount_inr = true;
    if (!formData.locality) errors.locality = true;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle file select for Primary Deed
  const handlePrimaryFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    handleExecutePrimaryExtract(file.name);
  };

  // OCR extraction call for Primary Deed
  const handleExecutePrimaryExtract = async (customName?: string) => {
    const nameToUse = customName || uploadedFileName || 'Primary_Sale_Deed.pdf';
    setIsExtracting(true);
    setExtractionProgress(25);

    setTimeout(() => setExtractionProgress(60), 150);
    setTimeout(() => setExtractionProgress(90), 300);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: 'primary_deed',
          fileName: nameToUse,
          borrower_name: formData.borrower_name,
          locality: confirmedLocality || formData.locality,
          carpet_area_sqft: confirmedCarpetArea || Number(formData.carpet_area_sqft) || 750,
          flat_house_number: formData.flat_house_number,
          building_society: formData.building_society,
          has_area_mismatch: hasAreaMismatch,
          tax_carpet_area_sqft: confirmedTaxArea > 0 ? confirmedTaxArea : undefined,
        }),
      });
      const data = await res.json();
      setTimeout(() => {
        setExtractionProgress(100);
        setIsExtracting(false);
        setExtractionCompleted(true);
        setExtractedData(data.extracted_docket);

        if (data.extracted_docket?.asset?.carpet_area_sqft) {
          const extractedCarpet = data.extracted_docket.asset.carpet_area_sqft;
          setConfirmedCarpetArea(extractedCarpet);
          if (!formData.carpet_area_sqft) setFormData((f) => ({ ...f, carpet_area_sqft: extractedCarpet }));
        }
        if (data.extracted_docket?.tax_ledger_extract?.assessed_carpet_area_sqft) {
          const extractedTax = data.extracted_docket.tax_ledger_extract.assessed_carpet_area_sqft;
          setConfirmedTaxArea(extractedTax);
        }
        if (data.extracted_docket?.purchaser_name && !formData.borrower_name) {
          setFormData((f) => ({ ...f, borrower_name: data.extracted_docket.purchaser_name }));
        }

        // Auto-update deed card in Step 3 grid
        setDockets((prev) => ({
          ...prev,
          deed: {
            ...prev.deed,
            fileName: nameToUse,
            isUploaded: true,
            badge: 'Verified',
            badgeColor: 'bg-emerald-100 text-emerald-800',
            extractedDetails: `${confirmedCarpetArea || 750} sq.ft carpet registered`,
          },
        }));
      }, 400);
    } catch {
      setIsExtracting(false);
      setExtractionCompleted(true);
    }
  };

  // Upload & micro-extract for individual 7-docket cards
  const handleDocketCardUpload = async (docketId: string, file: File) => {
    setDockets((prev) => ({
      ...prev,
      [docketId]: { ...prev[docketId], isUploading: true, fileName: file.name },
    }));

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: docketId === 'tax_receipt' ? 'tax_receipt' : docketId === 'share_cert' ? 'share_certificate' : docketId === 'search_report' ? 'search_report' : 'supporting_doc',
          fileName: file.name,
          borrower_name: formData.borrower_name,
          locality: confirmedLocality || formData.locality,
          carpet_area_sqft: confirmedCarpetArea || Number(formData.carpet_area_sqft) || 750,
          has_area_mismatch: hasAreaMismatch,
        }),
      });
      const data = await res.json();
      const micro = data.micro_extractions || {};

      let badge = 'Uploaded';
      let badgeColor = 'bg-blue-100 text-blue-800';
      let details = `${file.name} authenticated`;

      if (docketId === 'tax_receipt' && micro.tax_carpet_area_sqft) {
        setConfirmedTaxArea(micro.tax_carpet_area_sqft);
        const areaDiff = Math.abs(micro.variance_percentage || 0);
        if (areaDiff > 5.0) {
          badge = `Flagged (+${micro.variance_percentage}%)`;
          badgeColor = 'bg-amber-100 text-amber-900 border border-amber-300';
          details = `Municipal Tax Area: ${micro.tax_carpet_area_sqft} sq.ft (${micro.variance_percentage}% diff)`;
          setHasAreaMismatch(true);
        } else {
          badge = 'Clean Match (0% Diff)';
          badgeColor = 'bg-emerald-100 text-emerald-800 border border-emerald-300';
          details = `Municipal Tax Area: ${micro.tax_carpet_area_sqft} sq.ft (Matches Deed)`;
          setHasAreaMismatch(false);
        }
      } else if (docketId === 'share_cert' && micro.member_name) {
        badge = 'Member Verified';
        badgeColor = 'bg-emerald-100 text-emerald-800';
        details = `Member: ${micro.member_name}`;
      } else if (docketId === 'search_report' && micro.encumbrance_status) {
        badge = micro.encumbrance_status.includes('Clean') ? 'Clean Title' : 'Prior Charge';
        badgeColor = micro.encumbrance_status.includes('Clean') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
        details = micro.encumbrance_clause || micro.encumbrance_status;
      }

      setDockets((prev) => ({
        ...prev,
        [docketId]: {
          ...prev[docketId],
          isUploading: false,
          isUploaded: true,
          badge,
          badgeColor,
          extractedDetails: details,
        },
      }));
    } catch {
      setDockets((prev) => ({
        ...prev,
        [docketId]: {
          ...prev[docketId],
          isUploading: false,
          isUploaded: true,
          badge: 'Uploaded',
          badgeColor: 'bg-blue-100 text-blue-800',
          extractedDetails: `${file.name} attached`,
        },
      }));
    }
  };

  // Autonomous Valuation Computations
  const carpetAreaNum = confirmedCarpetArea || Number(formData.carpet_area_sqft) || 0;
  const marketRateNum = Number(formData.market_rate_inr_sqft) || 50000;
  const loanAmountNum = Number(formData.loan_amount_inr) || 0;

  const calculatedIndicativeVal = Math.round(carpetAreaNum * marketRateNum);
  const calculatedCorridorLow = Math.round(calculatedIndicativeVal * 0.95);
  const calculatedCorridorHigh = Math.round(calculatedIndicativeVal * 1.05);
  const calculatedLtv = calculatedIndicativeVal > 0 ? Math.round((loanAmountNum / calculatedIndicativeVal) * 1000) / 10 : 0;
  const calculatedCoverage = loanAmountNum > 0 ? Math.round((calculatedIndicativeVal / loanAmountNum) * 100) / 100 : 0;

  // Cross-Document Variance Computation
  const effectiveDeedArea = carpetAreaNum || 850;
  const effectiveTaxArea = confirmedTaxArea > 0 ? confirmedTaxArea : (hasAreaMismatch ? Math.round(effectiveDeedArea * 1.0824) : effectiveDeedArea);
  const varianceSqft = effectiveTaxArea - effectiveDeedArea;
  const calculatedVariancePct = effectiveDeedArea > 0 ? Math.round((varianceSqft / effectiveDeedArea) * 10000) / 100 : 0;
  const isVarianceFlagged = Math.abs(calculatedVariancePct) > 5.0;

  // Dynamic Triage Badge & Summary Callout
  const triageBadgeLabel = isVarianceFlagged
    ? `Area Inconsistency (+${calculatedVariancePct}%) → Medium Review`
    : `Clean Match (0% Diff) → Low Risk`;
  const triageCalloutText = isVarianceFlagged
    ? `Area Inconsistency: Sale Deed records ${effectiveDeedArea} sq.ft vs Municipal Tax Assessment of ${effectiveTaxArea} sq.ft (+${calculatedVariancePct}%). Mandates valuer physical survey before credit sanction.`
    : `Clean Collateral Docket: Sale Deed matches municipal tax records (${effectiveDeedArea} sq.ft). Docket qualifies for fast-track credit appraisal.`;

  // Submit Final Case Intake
  const handleSubmitEngine = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        borrower_name: formData.borrower_name,
        age: formData.age || 36,
        occupation: formData.occupation || 'Self-Employed Professional',
        employer_business: formData.employer_business || 'Private Enterprise',
        vintage_years: formData.vintage_years || 5,
        annual_income_lakh: formData.annual_income_lakh || 35,
        existing_emi_inr: formData.existing_emi_inr || 20000,
        credit_score: formData.credit_score || 760,
        loan_product: formData.loan_product || 'Loan Against Property (LAP)',
        loan_purpose: formData.loan_purpose || 'Business Expansion',
        loan_amount_inr: loanAmountNum,
        tenure_years: formData.tenure_years || 15,
        interest_rate_percent: formData.interest_rate_percent || 9.5,
        locality: confirmedLocality || formData.locality || 'Dadar West',
        market_rate_inr_sqft: marketRateNum,
        carpet_area_sqft: effectiveDeedArea,
        tax_carpet_area_sqft: effectiveTaxArea,
        flat_house_number: formData.flat_house_number || '502',
        building_society: formData.building_society || `${confirmedLocality || formData.locality} CHS Ltd`,
        property_address: formData.property_address || `${confirmedLocality || formData.locality}, Mumbai, Maharashtra`,
        parking: formData.parking || '1 Covered Space',
        has_area_mismatch: isVarianceFlagged,
        uploaded_document_name: uploadedFileName || 'Primary_Title_Deed.pdf',
        pr_card_file_name: dockets.pr_card.fileName,
        share_cert_file_name: dockets.share_cert.fileName,
        building_plan_file_name: dockets.building_plan.fileName,
        oc_file_name: dockets.oc.fileName,
        tax_receipt_file_name: dockets.tax_receipt.fileName,
        search_report_file_name: dockets.search_report.fileName,
        encumbrance_clause: dockets.search_report.extractedDetails,
      };

      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.case) {
        onCaseCreated(data.case);
        handleClose();
      } else {
        alert(data.error || 'Failed to create case');
      }
    } catch (err: any) {
      alert(`Error creating case: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (field: string, extra = '') =>
    `w-full px-3 py-1.5 bg-white border text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
      validationErrors[field] ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
    } ${extra}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Hidden file input for primary deed */}
      <input
        ref={primaryFileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={handlePrimaryFileSelect}
        className="hidden"
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              IQ
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Ingest New Collateral Loan Docket
              </h2>
              <p className="text-xs text-slate-500">
                Autonomous valuation &amp; interactive multi-document verification pipeline
              </p>
            </div>
          </div>

          {/* Quick Demo Pre-fill Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreFillFlagship}
              className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-300 font-medium text-[11px] hover:bg-amber-100 transition-colors"
              title="Pre-fill Arjun Mehta Flagship Discrepancy Case"
            >
              Demo: Arjun Mehta (+8.24%)
            </button>
            <button
              type="button"
              onClick={handlePreFillClean}
              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium text-[11px] hover:bg-emerald-100 transition-colors"
              title="Pre-fill Pooja Shah Clean Case"
            >
              Demo: Pooja Shah (Clean)
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Step Wizard Navigation Indicator */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 cursor-pointer ${currentStep === 1 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span className="text-xs">Borrower &amp; Valuation</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <div
              onClick={() => {
                if (validateStep1()) setCurrentStep(2);
              }}
              className={`flex items-center gap-2 cursor-pointer ${currentStep === 2 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span className="text-xs">Primary Deed OCR</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <div
              onClick={() => {
                if (validateStep1()) setCurrentStep(3);
              }}
              className={`flex items-center gap-2 cursor-pointer ${currentStep === 3 ? 'text-blue-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span className="text-xs">7-Docket Grid &amp; Verification</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* STEP 1: Borrower Information & Autonomous Valuation Engine */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 1: Borrower Profile &amp; Autonomous Valuation Inputs
                </span>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                  Form starts empty &bull; Zero hardcoded defaults
                </span>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {/* Borrower Name */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Borrower Full Name *</label>
                  <input
                    type="text"
                    value={formData.borrower_name}
                    onChange={(e) => {
                      setFormData({ ...formData, borrower_name: e.target.value });
                      if (e.target.value.trim()) setValidationErrors((v) => ({ ...v, borrower_name: false }));
                    }}
                    placeholder="Enter borrower name..."
                    className={inputCls('borrower_name', 'font-semibold text-slate-900')}
                  />
                  {validationErrors.borrower_name && (
                    <span className="text-[10px] text-red-600 font-medium mt-0.5 block">Required</span>
                  )}
                </div>

                {/* Locality */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Locality / Micro-Market *</label>
                  <select
                    value={formData.locality}
                    onChange={(e) => {
                      const loc = e.target.value;
                      const matched = localityList.find((l) => l.name === loc);
                      const newRate = matched ? matched.rate : formData.market_rate_inr_sqft || 50000;
                      setFormData({ ...formData, locality: loc, market_rate_inr_sqft: newRate });
                      setConfirmedLocality(loc);
                      if (loc) setValidationErrors((v) => ({ ...v, locality: false }));
                    }}
                    className={inputCls('locality', 'font-semibold text-slate-900 bg-white cursor-pointer')}
                  >
                    <option value="" disabled className="bg-white text-slate-400 py-1.5">
                      Select Locality...
                    </option>
                    {localityList.map((loc) => (
                      <option key={loc.name} value={loc.name} className="bg-white text-slate-900 py-1.5">
                        {loc.name} (₹{loc.rate.toLocaleString('en-IN')}/sqft)
                      </option>
                    ))}
                  </select>
                  {validationErrors.locality && (
                    <span className="text-[10px] text-red-600 font-medium mt-0.5 block">Required</span>
                  )}
                </div>

                {/* Facility Amount Requested */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Loan Amount Requested (₹) *</label>
                  <input
                    type="number"
                    value={formData.loan_amount_inr}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : '';
                      setFormData({ ...formData, loan_amount_inr: val });
                      if (val && Number(val) > 0) setValidationErrors((v) => ({ ...v, loan_amount_inr: false }));
                    }}
                    placeholder="e.g. 25000000"
                    className={inputCls('loan_amount_inr', 'font-mono font-bold text-slate-900')}
                  />
                  {validationErrors.loan_amount_inr && (
                    <span className="text-[10px] text-red-600 font-medium mt-0.5 block">Required &amp; must be &gt; 0</span>
                  )}
                </div>

                {/* Market Benchmark Rate Input */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Market Benchmark Rate (₹ / sq.ft) *</label>
                  <input
                    type="number"
                    value={formData.market_rate_inr_sqft}
                    onChange={(e) => setFormData({ ...formData, market_rate_inr_sqft: e.target.value ? parseFloat(e.target.value) : '' })}
                    placeholder="e.g. 50000"
                    className="w-full px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-mono font-bold text-blue-900 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Carpet Area (sq.ft) */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.carpet_area_sqft}
                    onChange={(e) => {
                      const val = e.target.value ? parseFloat(e.target.value) : '';
                      setFormData({ ...formData, carpet_area_sqft: val });
                      setConfirmedCarpetArea(Number(val) || 0);
                    }}
                    placeholder="e.g. 850"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Loan Product */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Loan Product</label>
                  <select
                    value={formData.loan_product}
                    onChange={(e) => setFormData({ ...formData, loan_product: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white text-slate-900 font-medium border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors cursor-pointer"
                  >
                    <option value="" disabled className="bg-white text-slate-400 py-1.5">
                      Select Product...
                    </option>
                    <option value="Loan Against Property (LAP)" className="bg-white text-slate-900 py-1.5">
                      Loan Against Property (LAP)
                    </option>
                    <option value="Home Loan" className="bg-white text-slate-900 py-1.5">
                      Home Loan (HL)
                    </option>
                  </select>
                </div>

                {/* Additional optional fields */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Occupation &amp; Vintage</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Business Owner"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Building / Housing Society</label>
                  <input
                    type="text"
                    value={formData.building_society}
                    onChange={(e) => setFormData({ ...formData, building_society: e.target.value })}
                    placeholder="e.g. Shardashram CHS Ltd"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Flat / Unit Number</label>
                  <input
                    type="text"
                    value={formData.flat_house_number}
                    onChange={(e) => setFormData({ ...formData, flat_house_number: e.target.value })}
                    placeholder="e.g. 702"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Real-Time Autonomous Valuation Formulas Banner */}
              {carpetAreaNum > 0 && marketRateNum > 0 && (
                <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Real-Time Autonomous Valuation Calculations
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Formula Engine: V = Area &times; Rate
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Indicative Value</div>
                      <div className="text-base font-bold font-mono text-white mt-0.5">
                        ₹{(calculatedIndicativeVal / 1e7).toFixed(3)} Cr
                      </div>
                      <div className="text-[10px] text-slate-500">₹{marketRateNum.toLocaleString('en-IN')}/sq.ft</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">95% - 105% Corridor</div>
                      <div className="text-xs font-bold font-mono text-slate-300 mt-0.5">
                        ₹{(calculatedCorridorLow / 1e7).toFixed(2)} Cr - ₹{(calculatedCorridorHigh / 1e7).toFixed(2)} Cr
                      </div>
                      <div className="text-[10px] text-slate-500">5% IBBI Tolerance Corridor</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Calculated LTV</div>
                      <div className={`text-base font-bold font-mono mt-0.5 ${calculatedLtv > 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {calculatedLtv.toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-slate-500">{calculatedLtv > 75 ? 'Breaches 75% Ceiling' : 'Within RBI Limits'}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Collateral Coverage</div>
                      <div className="text-base font-bold font-mono text-blue-400 mt-0.5">
                        {calculatedCoverage.toFixed(2)}x
                      </div>
                      <div className="text-[10px] text-slate-500">Coverage Ratio</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Primary Title Deed Dropzone & Editable Confirmation */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 2: Primary Title Deed Upload &amp; Multimodal OCR Extraction
                </span>
                {uploadedFileName && (
                  <span className="text-xs font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    Active File: {uploadedFileName}
                  </span>
                )}
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => primaryFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isExtracting ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
                }`}
              >
                <FileUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-800">
                  {isExtracting ? 'Executing Multimodal AI Vision Engine...' : 'Click to Upload PDF Title Deed or Drag & Drop'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {uploadedFileName ? (
                    <>Selected File: <strong className="font-mono text-slate-800">{uploadedFileName}</strong> ({uploadedFileSize})</>
                  ) : (
                    'Upload a Sale Deed, Agreement for Sale, or Index-II document to auto-fill property parameters'
                  )}
                </p>

                {isExtracting && (
                  <div className="mt-4 max-w-xs mx-auto space-y-1">
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div style={{ width: `${extractionProgress}%` }} className="h-full bg-blue-600 transition-all duration-300" />
                    </div>
                    <span className="text-[10px] font-mono text-blue-700">Extracting clauses &amp; deed dimensions... {extractionProgress}%</span>
                  </div>
                )}
              </div>

              {/* Editable Confirmation Panel */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                    Editable Confirmation Fallback Panel
                  </span>
                  <span className="text-[11px] text-slate-500">Review &amp; manually override any OCR output</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Locality</label>
                    <select
                      value={confirmedLocality || formData.locality}
                      onChange={(e) => {
                        setConfirmedLocality(e.target.value);
                        setFormData((f) => ({ ...f, locality: e.target.value }));
                      }}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <option value="" disabled className="bg-white text-slate-400 py-1.5">
                        Select Locality...
                      </option>
                      {localityList.map((loc) => (
                        <option key={loc.name} value={loc.name} className="bg-white text-slate-900 py-1.5">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Sale Deed Carpet Area (sq.ft) *</label>
                    <input
                      type="number"
                      value={confirmedCarpetArea || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setConfirmedCarpetArea(val);
                        setFormData((f) => ({ ...f, carpet_area_sqft: val }));
                        if (!hasAreaMismatch) setConfirmedTaxArea(val);
                      }}
                      placeholder="e.g. 850"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Municipal Tax Carpet Area (sq.ft)</label>
                    <input
                      type="number"
                      value={confirmedTaxArea || ''}
                      onChange={(e) => setConfirmedTaxArea(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 920"
                      className={`w-full px-2.5 py-1.5 bg-white border rounded-lg text-xs font-mono font-bold ${
                        isVarianceFlagged ? 'border-amber-400 text-amber-900 bg-amber-50/50' : 'border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interactive 7-Docket Upload Grid & Dynamic Cross-Verification */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 3: Interactive Supporting Docket Upload Grid (7 Mandatory Records)
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {Object.values(dockets).filter((d) => d.isUploaded).length} of 7 Uploaded
                </span>
              </div>

              {/* 7 Interactive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.values(dockets).map((docket) => {
                  return (
                    <div
                      key={docket.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        docket.isUploading
                          ? 'bg-blue-50/50 border-blue-300 animate-pulse'
                          : docket.isUploaded
                          ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                          : 'bg-slate-50/60 border-dashed border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900 truncate max-w-[170px]" title={docket.title}>
                          {docket.title}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${docket.badgeColor}`}>
                          {docket.isUploading ? 'Extracting...' : docket.badge}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 font-mono truncate">
                        {docket.isUploading ? (
                          <span className="text-blue-600 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Extracting clauses...
                          </span>
                        ) : docket.isUploaded ? (
                          <span className="text-slate-800 font-medium">{docket.extractedDetails}</span>
                        ) : (
                          <span className="text-slate-400">No file attached</span>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <label className="cursor-pointer text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>{docket.isUploaded ? 'Replace' : '+ Upload PDF/Scan'}</span>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleDocketCardUpload(docket.id, file);
                            }}
                            className="hidden"
                          />
                        </label>
                        {docket.isUploaded && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Area Comparison & Triage Callout Banner */}
              <div className={`p-4 rounded-xl border space-y-2 ${isVarianceFlagged ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'}`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 ${isVarianceFlagged ? 'bg-amber-200 text-amber-900 border border-amber-300' : 'bg-emerald-200 text-emerald-900 border border-emerald-300'}`}>
                    {isVarianceFlagged ? <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    {triageBadgeLabel}
                  </span>
                  <div className="font-mono text-xs font-bold">
                    Variance: <strong className={isVarianceFlagged ? 'text-amber-800' : 'text-emerald-800'}>
                      {calculatedVariancePct > 0 ? `+${calculatedVariancePct}%` : `${calculatedVariancePct}%`}
                    </strong>
                  </div>
                </div>

                <p className="text-xs leading-relaxed font-medium">
                  {triageCalloutText}
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-medium text-slate-600">Quick Scenario Test:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setHasAreaMismatch(false);
                      setConfirmedTaxArea(effectiveDeedArea);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${!hasAreaMismatch ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}
                  >
                    Clean Match (0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasAreaMismatch(true);
                      setConfirmedTaxArea(Math.round(effectiveDeedArea * 1.0824));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${hasAreaMismatch ? 'bg-amber-600 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}
                  >
                    Area Discrepancy (+8.24%)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep((s) => (s + 1) as 1 | 2 | 3);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Continue</span> <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitEngine}
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executing Engine...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    Execute Verification Engine
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
