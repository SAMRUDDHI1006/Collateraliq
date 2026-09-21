'use client';

import React, { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight, FileText, TrendingUp, Building, Scale, ArrowRight } from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface AnalysisReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanCase: CollateralAssessmentCase;
}

type ReportPage = 1 | 2 | 3 | 4 | 5;

export const AnalysisReportModal: React.FC<AnalysisReportModalProps> = ({ isOpen, onClose, loanCase }) => {
  const [currentPage, setCurrentPage] = useState<ReportPage>(1);

  if (!isOpen) return null;

  const {
    caseId,
    borrowerName,
    borrower,
    product,
    loanPurpose,
    loanFacilityRequested,
    tenureYears,
    interestRate,
    propertyProfile,
    modelIndicativeValue,
    indicativeRange,
    valuerReport,
    deviation,
    balanceTransfer,
    reviewLevel,
    reviewDrivers,
    comparables,
    createdAt,
    isFreshCase,
  } = loanCase;

  const isBT = balanceTransfer?.isBalanceTransfer === true;
  const totalPages: ReportPage = isBT ? 5 : 4;

  const valuerValue = valuerReport?.assessedValue || 0;
  const pctDiff = deviation?.percentageDiff ?? 0;
  const absDiff = deviation?.absoluteDiff ?? Math.abs(valuerValue - modelIndicativeValue);
  const carpetArea = propertyProfile.carpetArea || 0;
  const modelRate = carpetArea > 0 ? Math.round(modelIndicativeValue / carpetArea) : 0;
  const valuerRate = carpetArea > 0 && valuerValue > 0 ? Math.round(valuerValue / carpetArea) : 0;
  const ltv = modelIndicativeValue > 0 ? ((loanFacilityRequested / modelIndicativeValue) * 100) : 0;
  const coverage = loanFacilityRequested > 0 ? (modelIndicativeValue / loanFacilityRequested) : 0;
  const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' });
  const reportId = `CLIQ-RPT-${caseId}-${new Date().getFullYear()}`;

  const fmtCr = (v: number) => `₹${(v / 1e7).toFixed(3)} Cr`;
  const fmtL = (v: number) => {
    const l = v / 1e5;
    const sign = v >= 0 ? '+' : '';
    return `${sign}₹${Math.abs(l).toFixed(2)} L`;
  };
  const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

  // BT calculations
  const prevVal = balanceTransfer?.previousValuation || 0;
  const prevToValuerAbs = valuerValue - prevVal;
  const prevToValuerPct = prevVal > 0 ? ((valuerValue - prevVal) / prevVal * 100) : 0;
  const prevToModelAbs = modelIndicativeValue - prevVal;
  const prevToModelPct = prevVal > 0 ? ((modelIndicativeValue - prevVal) / prevVal * 100) : 0;
  const modelToValuerAbs = valuerValue - modelIndicativeValue;
  const modelToValuerPct = modelIndicativeValue > 0 ? ((valuerValue - modelIndicativeValue) / modelIndicativeValue * 100) : 0;

  const handleDownload = () => {
    const style = `
      <style>
        body { font-family: Arial, sans-serif; font-size: 10pt; color: #1e293b; margin: 0; }
        .page { page-break-after: always; padding: 32px; border-bottom: 2px solid #e2e8f0; }
        h1 { color: #0f172a; font-size: 16pt; margin-bottom: 4px; }
        h2 { color: #1e40af; font-size: 12pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 20px; }
        h3 { color: #0f172a; font-size: 10pt; margin: 12px 0 4px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 8px 0; }
        th { background: #1e293b; color: #fff; text-align: left; padding: 6px 8px; }
        td { border: 1px solid #cbd5e1; padding: 5px 8px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-amber { background: #fef3c7; color: #92400e; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .disclaimer { font-size: 8pt; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px; }
        .header { background: #0f172a; color: white; padding: 20px 32px 12px 32px; }
        .logo { font-size: 18pt; font-weight: bold; color: #60a5fa; }
        .sublogo { font-size: 9pt; color: #94a3b8; }
        .tagline { font-size: 8pt; color: #64748b; }
      </style>
    `;
    const html = `<html><head>${style}<title>CollateralIQ Analysis Report — ${caseId}</title></head><body>
      <div class="header">
        <div class="logo">CollateralIQ</div>
        <div class="sublogo">Collateral Intelligence &amp; Valuation Reconciliation Engine</div>
        <div class="tagline">Report ID: ${reportId} | Generated: ${today} | Case: ${caseId}</div>
      </div>
      <div class="page">
        <h1>Collateral Intelligence Analysis Report</h1>
        <table>
          <tr><th>Report Parameter</th><th>Value</th></tr>
          <tr><td>Report ID</td><td>${reportId}</td></tr>
          <tr><td>Case ID</td><td>${caseId}${isFreshCase ? ' (Fresh Case — Not in Portfolio)' : ''}</td></tr>
          <tr><td>Borrower Name</td><td>${borrowerName}</td></tr>
          <tr><td>Loan Product</td><td>${product}</td></tr>
          <tr><td>Facility Requested</td><td>${fmtCr(loanFacilityRequested)}</td></tr>
          <tr><td>Property Region</td><td>${propertyProfile.location}</td></tr>
          <tr><td>Property Type</td><td>${propertyProfile.propertyType} — ${propertyProfile.bhk}</td></tr>
          <tr><td>Carpet Area</td><td>${carpetArea} sq.ft</td></tr>
          <tr><td>CollateralIQ Indicative Value</td><td>${fmtCr(modelIndicativeValue)}</td></tr>
          <tr><td>Independent Valuer Value</td><td>${valuerValue > 0 ? fmtCr(valuerValue) : 'Not available'}</td></tr>
          <tr><td>Deviation</td><td>${pctDiff > 0 ? '+' : ''}${pctDiff}%</td></tr>
          <tr><td>LTV</td><td>${ltv.toFixed(1)}%</td></tr>
          <tr><td>Review Level</td><td>${reviewLevel}</td></tr>
          <tr><td>Report Date</td><td>${today}</td></tr>
        </table>
      </div>
      <div class="page">
        <h2>Borrower & Loan Details</h2>
        <h3>Borrower Profile</h3>
        <table>
          <tr><td>Full Name</td><td>${borrower?.fullName || borrowerName}</td></tr>
          <tr><td>Age</td><td>${borrower?.age || '—'}</td></tr>
          <tr><td>Employment Type</td><td>${borrower?.employmentType || '—'}</td></tr>
          <tr><td>Employer / Business</td><td>${borrower?.employerOrBusinessName || '—'}</td></tr>
          <tr><td>Annual Income</td><td>${borrower?.annualIncome ? fmtCr(borrower.annualIncome) : '—'}</td></tr>
          <tr><td>CIBIL Score</td><td>${borrower?.cibilScore || '—'}</td></tr>
        </table>
        <h3>Loan Facility Details</h3>
        <table>
          <tr><td>Product</td><td>${product}</td></tr>
          <tr><td>Loan Purpose</td><td>${loanPurpose || '—'}</td></tr>
          <tr><td>Facility Requested</td><td>${fmtCr(loanFacilityRequested)}</td></tr>
          <tr><td>Tenure</td><td>${tenureYears || '—'} years</td></tr>
          <tr><td>Interest Rate</td><td>${interestRate || '—'}% p.a.</td></tr>
          <tr><td>LTV (on CollateralIQ Value)</td><td>${ltv.toFixed(2)}%</td></tr>
          <tr><td>Collateral Coverage</td><td>${coverage.toFixed(2)}x</td></tr>
        </table>
      </div>
      <div class="page">
        <h2>Property Assessment &amp; CollateralIQ Valuation</h2>
        <h3>Property Profile</h3>
        <table>
          <tr><td>Region</td><td>${propertyProfile.location}</td></tr>
          <tr><td>City</td><td>${propertyProfile.city}</td></tr>
          <tr><td>Address</td><td>${propertyProfile.address || '—'}</td></tr>
          <tr><td>PIN Code</td><td>${propertyProfile.pinCode || '—'}</td></tr>
          <tr><td>Property Type</td><td>${propertyProfile.propertyType} — ${propertyProfile.bhk}</td></tr>
          <tr><td>Carpet Area</td><td>${carpetArea} sq.ft</td></tr>
          <tr><td>Built-Up Area</td><td>${propertyProfile.builtUpArea || '—'} sq.ft</td></tr>
          <tr><td>Floor</td><td>${propertyProfile.floor} of ${propertyProfile.totalFloors || '—'}</td></tr>
          <tr><td>Building Age</td><td>${propertyProfile.buildingAge} years</td></tr>
          <tr><td>Parking</td><td>${propertyProfile.parking}</td></tr>
          <tr><td>Occupancy</td><td>${propertyProfile.occupancy}</td></tr>
        </table>
        <h3>CollateralIQ Valuation Output</h3>
        <table>
          <tr><td>Model-Supported Indicative Value</td><td><strong>${fmtCr(modelIndicativeValue)}</strong></td></tr>
          <tr><td>Indicative Range</td><td>${fmtCr(indicativeRange.min)} – ${fmtCr(indicativeRange.max)}</td></tr>
          <tr><td>Effective Rate Applied</td><td>₹${modelRate.toLocaleString()}/sq.ft</td></tr>
          <tr><td>Area Used</td><td>${carpetArea} sq.ft (Carpet Area)</td></tr>
          <tr><td>Valuation Confidence</td><td>${loanCase.valuationConfidence}</td></tr>
        </table>
        <h3>Market Comparables</h3>
        <table>
          <tr><th>Project</th><th>BHK</th><th>Rate/sq.ft</th><th>Distance</th></tr>
          ${comparables.map(c => `<tr><td>${c.project}</td><td>${c.bhk}</td><td>₹${c.ratePerSqFt.toLocaleString()}</td><td>${c.distance}</td></tr>`).join('')}
        </table>
        <h3>Independent Valuer Report</h3>
        ${valuerReport ? `<table>
          <tr><td>Valuer Name</td><td>${valuerReport.valuerName}</td></tr>
          <tr><td>Assessed Value</td><td><strong>${fmtCr(valuerReport.assessedValue)}</strong></td></tr>
          <tr><td>Area Considered</td><td>${valuerReport.areaConsidered} sq.ft</td></tr>
          <tr><td>Rate Applied</td><td>₹${valuerReport.rateApplied.toLocaleString()}/sq.ft</td></tr>
          <tr><td>Inspection Date</td><td>${valuerReport.inspectionDate}</td></tr>
          <tr><td>Condition Rating</td><td>${valuerReport.conditionRating}</td></tr>
          <tr><td>Marketability</td><td>${valuerReport.marketability}</td></tr>
          <tr><td>Valuation Method</td><td>${valuerReport.valuationMethod || '—'}</td></tr>
          <tr><td>Comparables Used</td><td>${valuerReport.comparablesUsedCount || '—'}</td></tr>
          <tr><td>Adjustments Note</td><td>${valuerReport.adjustmentsNote || 'None'}</td></tr>
        </table>` : '<p>Valuer report not yet linked.</p>'}
      </div>
      <div class="page">
        <h2>Valuation Reconciliation &amp; Deviation Analysis</h2>
        <table>
          <tr><th>Metric</th><th>CollateralIQ Model</th><th>Independent Valuer</th><th>Variance</th></tr>
          <tr><td>Value</td><td>${fmtCr(modelIndicativeValue)}</td><td>${valuerValue > 0 ? fmtCr(valuerValue) : '—'}</td><td>${pctDiff > 0 ? '+' : ''}${pctDiff}%</td></tr>
          <tr><td>Effective Rate/sq.ft</td><td>₹${modelRate.toLocaleString()}</td><td>₹${valuerRate > 0 ? valuerRate.toLocaleString() : '—'}</td><td>${valuerRate > 0 ? `${valuerRate - modelRate > 0 ? '+' : ''}₹${(valuerRate - modelRate).toLocaleString()}` : '—'}</td></tr>
          <tr><td>Area Used</td><td>${deviation?.areaUsed?.modelArea || carpetArea} sq.ft</td><td>${deviation?.areaUsed?.valuerArea || valuerReport?.areaConsidered || carpetArea} sq.ft</td><td>${(deviation?.areaUsed?.modelArea || carpetArea) === (deviation?.areaUsed?.valuerArea || carpetArea) ? 'No difference' : 'Mismatch'}</td></tr>
          <tr><td>Comparables Count</td><td>${deviation?.comparablesCount?.modelCount || comparables.length}</td><td>${deviation?.comparablesCount?.valuerCount || valuerReport?.comparablesUsedCount || '—'}</td><td>—</td></tr>
          <tr><td>Valuation Date</td><td>${deviation?.valuationDate?.modelDate || today}</td><td>${deviation?.valuationDate?.valuerDate || valuerReport?.inspectionDate || '—'}</td><td>—</td></tr>
          <tr><td>Method</td><td>${deviation?.methodology?.modelMethod || 'AI Comparable Model'}</td><td>${deviation?.methodology?.valuerMethod || valuerReport?.valuationMethod || '—'}</td><td>—</td></tr>
          <tr><td>Explicit Adjustments</td><td colspan="2">${deviation?.explicitAdjustments || valuerReport?.adjustmentsNote || 'None'}</td><td>—</td></tr>
        </table>
        <h3>Explanation (Confidence: ${deviation?.explanationConfidence || 'High'})</h3>
        <p>${deviation?.explanationText || 'Deviation analysis not available.'}</p>
        <h3>Review Level</h3>
        <p><strong class="badge ${reviewLevel === 'HIGH' ? 'badge-red' : reviewLevel === 'MEDIUM' ? 'badge-amber' : 'badge-green'}">${reviewLevel} REVIEW</strong></p>
        <h3>Review Drivers</h3>
        <ul>${(reviewDrivers || []).map(d => `<li>${d}</li>`).join('')}</ul>
        <div class="disclaimer">
          <strong>Disclaimer:</strong> This CollateralIQ analysis report is generated for institutional lender credit assessment purposes only. CollateralIQ does not approve or reject loans. The model-supported indicative value is derived from AI-comparable analysis of 22 Mumbai/Thane micro-markets and is to be used as an internal reference tool to complement, not replace, the independent physical valuation by an IBBI-registered valuer.
        </div>
      </div>
      ${isBT ? `<div class="page">
        <h2>Balance Transfer — Valuation History &amp; Movement Analysis</h2>
        <table>
          <tr><th>Valuation</th><th>Value</th><th>Date</th><th>Source</th></tr>
          <tr><td>Previous Bank Valuation</td><td><strong>${prevVal > 0 ? fmtCr(prevVal) : '—'}</strong></td><td>${balanceTransfer?.previousValuationDate || '—'}</td><td>${balanceTransfer?.previousLender || 'Previous Lender'}</td></tr>
          <tr><td>Current CollateralIQ Estimate</td><td><strong>${fmtCr(modelIndicativeValue)}</strong></td><td>${today}</td><td>CollateralIQ AI Model</td></tr>
          <tr><td>Current Independent Valuer</td><td><strong>${valuerValue > 0 ? fmtCr(valuerValue) : '—'}</strong></td><td>${valuerReport?.inspectionDate || '—'}</td><td>${valuerReport?.valuerName || 'IBBI Valuer'}</td></tr>
        </table>
        <h3>Movement Analysis</h3>
        <table>
          <tr><th>Trajectory</th><th>Absolute Movement</th><th>Percentage Movement</th><th>Interpretation</th></tr>
          <tr><td>Previous → Current Valuer</td><td>${prevVal > 0 ? fmtL(prevToValuerAbs) : '—'}</td><td>${prevVal > 0 ? fmtPct(prevToValuerPct) : '—'}</td><td>${prevToValuerPct >= 0 ? 'Appreciation' : 'Depreciation'}</td></tr>
          <tr><td>Previous → CollateralIQ Current</td><td>${prevVal > 0 ? fmtL(prevToModelAbs) : '—'}</td><td>${prevVal > 0 ? fmtPct(prevToModelPct) : '—'}</td><td>${prevToModelPct >= 0 ? 'Appreciation' : 'Depreciation'}</td></tr>
          <tr><td>CollateralIQ ↔ Current Valuer</td><td>${valuerValue > 0 ? fmtL(modelToValuerAbs) : '—'}</td><td>${valuerValue > 0 ? fmtPct(modelToValuerPct) : '—'}</td><td>${Math.abs(modelToValuerPct) <= 3 ? 'Within tolerance (≤3%)' : Math.abs(modelToValuerPct) <= 8 ? 'Moderate deviation' : 'High deviation'}</td></tr>
        </table>
        <h3>Existing Loan Details at Previous Lender</h3>
        <table>
          <tr><td>Previous Lender</td><td>${balanceTransfer?.previousLender || '—'}</td></tr>
          <tr><td>Original Loan Amount</td><td>${balanceTransfer?.originalLoanAmount ? fmtCr(balanceTransfer.originalLoanAmount) : '—'}</td></tr>
          <tr><td>Outstanding Balance</td><td>${balanceTransfer?.outstandingBalance ? fmtCr(balanceTransfer.outstandingBalance) : '—'}</td></tr>
          <tr><td>Existing EMI</td><td>${balanceTransfer?.existingEmi ? `₹${balanceTransfer.existingEmi.toLocaleString()}/month` : '—'}</td></tr>
          <tr><td>Existing Interest Rate</td><td>${balanceTransfer?.existingInterestRate ? `${balanceTransfer.existingInterestRate}% p.a.` : '—'}</td></tr>
          <tr><td>Previous Rate/sq.ft</td><td>${balanceTransfer?.previousRatePerSqFt ? `₹${balanceTransfer.previousRatePerSqFt.toLocaleString()}/sq.ft` : '—'}</td></tr>
          <tr><td>Previous Area Considered</td><td>${balanceTransfer?.previousAreaConsidered ? `${balanceTransfer.previousAreaConsidered} sq.ft` : '—'}</td></tr>
          <tr><td>Previous Valuation Method</td><td>${balanceTransfer?.previousValuationMethod || '—'}</td></tr>
          <tr><td>Previous Valuer</td><td>${balanceTransfer?.previousValuerName || '—'}</td></tr>
        </table>
        <div class="disclaimer">
          <strong>Balance Transfer Note:</strong> The above valuation history is derived from information provided by the borrower and/or extracted from the previous lender's valuation report. CollateralIQ does not independently verify the accuracy of the previous bank valuation figure. The credit officer should cross-reference this with the original sanction letter and valuation report from the previous lender.
        </div>
      </div>` : ''}
    </body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CollateralIQ_Report_${caseId}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const pageLabels = [
    { num: 1 as ReportPage, label: 'Executive Summary', icon: <FileText className="w-3.5 h-3.5" /> },
    { num: 2 as ReportPage, label: 'Borrower & Loan', icon: <Building className="w-3.5 h-3.5" /> },
    { num: 3 as ReportPage, label: 'Property & Valuation', icon: <Scale className="w-3.5 h-3.5" /> },
    { num: 4 as ReportPage, label: 'Reconciliation', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    ...(isBT ? [{ num: 5 as ReportPage, label: 'BT History', icon: <ArrowRight className="w-3.5 h-3.5" /> }] : []),
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Report Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Collateral Intelligence Analysis Report</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {reportId} &bull; Case: {caseId} &bull; {borrowerName} &bull; {product}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Navigation Tabs */}
        <div className="px-6 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1 overflow-x-auto shrink-0">
          {pageLabels.map((p) => (
            <button
              key={p.num}
              onClick={() => setCurrentPage(p.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                currentPage === p.num
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.icon}
              <span>{p.num}. {p.label}</span>
            </button>
          ))}
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-4">

          {/* === PAGE 1: Executive Case Summary === */}
          {currentPage === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Executive Case Summary</h3>
                  <p className="text-slate-400 text-[11px]">Page 1 of {totalPages} — {today}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                  reviewLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                  reviewLevel === 'MEDIUM' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {reviewLevel === 'HIGH' ? '🔴' : reviewLevel === 'MEDIUM' ? '🟡' : '🟢'} {reviewLevel} REVIEW
                </div>
              </div>

              {/* Case Identity Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">Case ID</span>
                  <span className="text-white font-bold font-mono text-xs">{caseId}</span>
                  {isFreshCase && <span className="text-blue-300 text-[9px] font-mono block">Fresh Case (Live)</span>}
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">Product</span>
                  <span className="text-white font-bold text-xs">{product}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-mono">Borrower</span>
                  <span className="text-white font-bold text-xs">{borrowerName}</span>
                </div>
              </div>

              {/* Key Valuation Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/50 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">CollateralIQ Indicative Value</span>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono">{fmtCr(modelIndicativeValue)}</div>
                  <div className="text-[10px] font-mono text-slate-400">Range: {fmtCr(indicativeRange.min)} – {fmtCr(indicativeRange.max)}</div>
                  <div className="text-[10px] font-mono text-slate-400">Rate: ₹{modelRate.toLocaleString()}/sq.ft on {carpetArea} sq.ft</div>
                </div>
                <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-800/50 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Independent Valuer Value</span>
                  <div className="text-xl font-extrabold text-blue-300 font-mono">{valuerValue > 0 ? fmtCr(valuerValue) : 'Not Linked'}</div>
                  <div className="text-[10px] text-slate-400 truncate">{valuerReport?.valuerName || 'Awaiting valuer report'}</div>
                  <div className={`text-[10px] font-mono font-bold ${Math.abs(pctDiff) > 8 ? 'text-rose-400' : Math.abs(pctDiff) > 3 ? 'text-amber-300' : 'text-emerald-400'}`}>
                    Deviation: {pctDiff > 0 ? '+' : ''}{pctDiff}% ({fmtCr(absDiff)} absolute)
                  </div>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'LTV', value: `${ltv.toFixed(1)}%`, color: ltv > 75 ? 'text-rose-400' : 'text-white' },
                  { label: 'Coverage', value: `${coverage.toFixed(2)}x`, color: coverage < 1.2 ? 'text-amber-300' : 'text-emerald-400' },
                  { label: 'Facility', value: fmtCr(loanFacilityRequested), color: 'text-white' },
                  { label: 'Carpet Area', value: `${carpetArea} sq.ft`, color: 'text-white' },
                ].map((k) => (
                  <div key={k.label} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">{k.label}</span>
                    <span className={`font-extrabold font-mono text-sm block ${k.color}`}>{k.value}</span>
                  </div>
                ))}
              </div>

              {/* Review Drivers */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Review Drivers</span>
                {(reviewDrivers || []).map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${reviewLevel === 'HIGH' ? 'bg-rose-400' : reviewLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    {d}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === PAGE 2: Borrower & Loan Details === */}
          {currentPage === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Borrower &amp; Loan Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Borrower Profile</h4>
                  {[
                    ['Full Name', borrower?.fullName || borrowerName],
                    ['Age', borrower?.age || '—'],
                    ['Mobile', borrower?.mobileNumber || '—'],
                    ['City', borrower?.residentialCity || '—'],
                    ['Employment', borrower?.employmentType || '—'],
                    ['Employer/Business', borrower?.employerOrBusinessName || '—'],
                    ['Annual Income', borrower?.annualIncome ? fmtCr(borrower.annualIncome) : '—'],
                    ['Existing EMI', borrower?.existingMonthlyEmi ? `₹${borrower.existingMonthlyEmi.toLocaleString()}/mo` : '—'],
                    ['CIBIL Score', borrower?.cibilScore || '—'],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between text-[11px] py-1 border-b border-slate-800">
                      <span className="text-slate-400">{l as string}</span>
                      <span className="text-white font-semibold font-mono">{v as string}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Loan Facility</h4>
                  {[
                    ['Product', product],
                    ['Loan Purpose', loanPurpose || '—'],
                    ['Facility Requested', fmtCr(loanFacilityRequested)],
                    ['Tenure', tenureYears ? `${tenureYears} years` : '—'],
                    ['Interest Rate', interestRate ? `${interestRate}% p.a.` : '—'],
                    ['LTV (on Model Value)', `${ltv.toFixed(2)}%`],
                    ['Collateral Coverage', `${coverage.toFixed(2)}x`],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between text-[11px] py-1 border-b border-slate-800">
                      <span className="text-slate-400">{l as string}</span>
                      <span className="text-white font-semibold font-mono">{v as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === PAGE 3: Property Assessment & CollateralIQ Valuation === */}
          {currentPage === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Property Assessment &amp; CollateralIQ Valuation</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Property Profile</h4>
                  {[
                    ['Region', propertyProfile.location],
                    ['City', propertyProfile.city],
                    ['Address', propertyProfile.address || '—'],
                    ['PIN Code', propertyProfile.pinCode || '—'],
                    ['Property Type', propertyProfile.propertyType],
                    ['Configuration', propertyProfile.bhk],
                    ['Carpet Area', `${carpetArea} sq.ft`],
                    ['Built-Up Area', propertyProfile.builtUpArea ? `${propertyProfile.builtUpArea} sq.ft` : '—'],
                    ['Floor', `${propertyProfile.floor}${propertyProfile.totalFloors ? ` of ${propertyProfile.totalFloors}` : ''}`],
                    ['Building Age', `${propertyProfile.buildingAge} years`],
                    ['Parking', propertyProfile.parking],
                    ['Occupancy', propertyProfile.occupancy],
                  ].map(([l, v]) => (
                    <div key={l as string} className="flex justify-between text-[11px] py-0.5 border-b border-slate-800/60">
                      <span className="text-slate-400">{l as string}</span>
                      <span className="text-white font-semibold text-right max-w-[55%] truncate">{v as string}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/50 space-y-2">
                    <h4 className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">CollateralIQ Valuation</h4>
                    <div className="text-xl font-extrabold text-emerald-400 font-mono">{fmtCr(modelIndicativeValue)}</div>
                    <div className="text-[10px] font-mono text-slate-400">Range: {fmtCr(indicativeRange.min)} – {fmtCr(indicativeRange.max)}</div>
                    <div className="text-[10px] font-mono text-slate-400">₹{modelRate.toLocaleString()}/sq.ft × {carpetArea} sq.ft</div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Market Comparables</h4>
                    {comparables.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-800 font-mono">
                        <span className="text-slate-300 truncate max-w-[60%]">{c.project}</span>
                        <span className="text-white font-bold">₹{c.ratePerSqFt.toLocaleString()}/sq.ft</span>
                        <span className="text-slate-500 text-[10px]">{c.distance}</span>
                      </div>
                    ))}
                  </div>

                  {valuerReport && (
                    <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-800/50 space-y-2">
                      <h4 className="font-bold text-blue-300 text-[11px] uppercase tracking-wider">Independent Valuer Report</h4>
                      <div className="text-xl font-extrabold text-blue-300 font-mono">{fmtCr(valuerReport.assessedValue)}</div>
                      <div className="text-[10px] text-slate-400 truncate">{valuerReport.valuerName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        ₹{valuerReport.rateApplied.toLocaleString()}/sq.ft · {valuerReport.inspectionDate} · {valuerReport.valuationMethod}
                      </div>
                      {valuerReport.adjustmentsNote && (
                        <div className="text-[10px] text-amber-200 italic">{valuerReport.adjustmentsNote}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === PAGE 4: Valuation Reconciliation === */}
          {currentPage === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2">Valuation Reconciliation — Why is there a deviation?</h3>

              {/* 7 Metrics Grid */}
              <div className="space-y-2">
                {[
                  ['Metric 1 — Effective Rate/sq.ft', `Model ₹${modelRate.toLocaleString()} vs Valuer ₹${valuerRate > 0 ? valuerRate.toLocaleString() : '—'} (${valuerRate - modelRate > 0 ? '+' : ''}₹${(valuerRate - modelRate).toLocaleString()}/sq.ft)`],
                  ['Metric 2 — Comparables Count', `Model ${deviation?.comparablesCount?.modelCount || comparables.length} comps vs Valuer ${deviation?.comparablesCount?.valuerCount || valuerReport?.comparablesUsedCount || '—'} comps`],
                  ['Metric 3 — Avg Comparable Rate', `Model ₹${(deviation?.avgComparableRate?.modelAvg || modelRate).toLocaleString()}/sq.ft vs Valuer ₹${(deviation?.avgComparableRate?.valuerAvg || valuerReport?.comparablesAvgRate || 0).toLocaleString()}/sq.ft`],
                  ['Metric 4 — Area Used', `Model ${deviation?.areaUsed?.modelArea || carpetArea} sq.ft vs Valuer ${deviation?.areaUsed?.valuerArea || valuerReport?.areaConsidered || carpetArea} sq.ft`],
                  ['Metric 5 — Valuation Date', `Model ${deviation?.valuationDate?.modelDate || today} vs Valuer ${deviation?.valuationDate?.valuerDate || valuerReport?.inspectionDate || '—'}`],
                  ['Metric 6 — Valuation Method', `${deviation?.methodology?.modelMethod || 'AI Comparable Model'} vs ${deviation?.methodology?.valuerMethod || 'Sales Comparison Approach'}`],
                  ['Metric 7 — Explicit Adjustments', deviation?.explicitAdjustments || valuerReport?.adjustmentsNote || 'None'],
                ].map(([label, value]) => (
                  <div key={label as string} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-semibold">{label as string}</span>
                    <span className="text-slate-200 font-mono text-right max-w-[55%]">{value as string}</span>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {deviation?.explanationText && (
                <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-800/40">
                  <span className="text-amber-400 font-bold text-[10px] uppercase font-mono block mb-1">AI Explanation (Confidence: {deviation.explanationConfidence})</span>
                  <p className="text-amber-100 text-[11px] leading-relaxed">{deviation.explanationText}</p>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-[10px] text-slate-400 leading-relaxed">
                <span className="text-slate-300 font-bold">Disclaimer: </span>
                This CollateralIQ analysis report is for institutional lender credit assessment purposes only. CollateralIQ does not approve or reject loans, perform legal title verification, or validate property documents. The model-supported indicative value is derived from AI analysis of 22 Mumbai/Thane micro-markets and must be used as an internal reference complementing the IBBI-registered valuer&apos;s independent assessment.
              </div>
            </div>
          )}

          {/* === PAGE 5: Balance Transfer Valuation History (BT only) === */}
          {currentPage === 5 && isBT && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-sm font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-amber-400" />
                Balance Transfer — Valuation History &amp; Movement Analysis
              </h3>

              {/* 3-Value Card */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Previous Bank Valuation', value: prevVal > 0 ? fmtCr(prevVal) : '—', sub: `${balanceTransfer?.previousLender || '—'} · ${balanceTransfer?.previousValuationDate || '—'}`, color: 'text-white', bg: 'bg-slate-950 border-slate-700' },
                  { label: 'CollateralIQ Current', value: fmtCr(modelIndicativeValue), sub: `₹${modelRate.toLocaleString()}/sq.ft · AI Model`, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-700/60' },
                  { label: 'Current Valuer', value: valuerValue > 0 ? fmtCr(valuerValue) : '—', sub: valuerReport?.valuerName ? valuerReport.valuerName.split('(')[0].trim() : 'Independent Valuer', color: 'text-blue-300', bg: 'bg-blue-950/40 border-blue-700/60' },
                ].map((card) => (
                  <div key={card.label} className={`p-4 rounded-xl border ${card.bg} text-center space-y-1`}>
                    <span className="text-slate-400 text-[9px] uppercase font-mono block">{card.label}</span>
                    <span className={`font-extrabold text-lg font-mono block ${card.color}`}>{card.value}</span>
                    <span className="text-slate-500 text-[9px] block leading-tight">{card.sub}</span>
                  </div>
                ))}
              </div>

              {/* Movement Analysis */}
              <div className="p-4 bg-slate-950 rounded-xl border border-amber-800/50 space-y-3">
                <span className="text-amber-400 font-bold text-[10px] uppercase font-mono">Movement Calculations</span>
                {[
                  { label: 'Previous → Current Valuer', abs: prevVal > 0 ? fmtL(prevToValuerAbs) : '—', pct: prevVal > 0 ? fmtPct(prevToValuerPct) : '—', positive: prevToValuerAbs >= 0 },
                  { label: 'Previous → CollateralIQ Current', abs: prevVal > 0 ? fmtL(prevToModelAbs) : '—', pct: prevVal > 0 ? fmtPct(prevToModelPct) : '—', positive: prevToModelAbs >= 0 },
                  { label: 'CollateralIQ ↔ Current Valuer', abs: valuerValue > 0 ? fmtL(modelToValuerAbs) : '—', pct: valuerValue > 0 ? fmtPct(modelToValuerPct) : '—', positive: modelToValuerAbs >= 0 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-[11px] py-1.5 border-b border-slate-800 font-mono">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold ${row.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.abs} ({row.pct})
                    </span>
                  </div>
                ))}
              </div>

              {/* Previous Lender Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Existing Loan at Previous Lender</h4>
                {[
                  ['Previous Lender', balanceTransfer?.previousLender || '—'],
                  ['Original Loan Amount', balanceTransfer?.originalLoanAmount ? fmtCr(balanceTransfer.originalLoanAmount) : '—'],
                  ['Outstanding Balance', balanceTransfer?.outstandingBalance ? fmtCr(balanceTransfer.outstandingBalance) : '—'],
                  ['Existing EMI', balanceTransfer?.existingEmi ? `₹${balanceTransfer.existingEmi.toLocaleString()}/month` : '—'],
                  ['Existing Interest Rate', balanceTransfer?.existingInterestRate ? `${balanceTransfer.existingInterestRate}% p.a.` : '—'],
                  ['Previous Rate/sq.ft', balanceTransfer?.previousRatePerSqFt ? `₹${balanceTransfer.previousRatePerSqFt.toLocaleString()}/sq.ft` : '—'],
                  ['Previous Area Considered', balanceTransfer?.previousAreaConsidered ? `${balanceTransfer.previousAreaConsidered} sq.ft` : '—'],
                  ['Previous Valuation Method', balanceTransfer?.previousValuationMethod || '—'],
                  ['Previous Valuer', balanceTransfer?.previousValuerName || '—'],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between text-[11px] py-0.5 border-b border-slate-800/60">
                    <span className="text-slate-400">{l as string}</span>
                    <span className="text-white font-semibold font-mono">{v as string}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-800/40 text-[10px] text-amber-200 leading-relaxed">
                <strong>Balance Transfer Note: </strong>
                The valuation history above is derived from information provided by the borrower and/or extracted from the previous lender&apos;s valuation report. The credit officer should cross-reference with the original sanction letter and valuation report from the previous lender.
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrentPage((prev) => (prev > 1 ? (prev - 1) as ReportPage : prev))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 hover:bg-slate-800 cursor-pointer transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[11px] text-slate-400 font-mono">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? (prev + 1) as ReportPage : prev))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-40 hover:bg-slate-800 cursor-pointer transition-all"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
