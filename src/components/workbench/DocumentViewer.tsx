'use client';

import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { LoanCase } from '@/types/collateral';

interface DocumentViewerProps {
  loanCase: LoanCase;
  documentFileName?: string;
  highlightedField?: string | null;
  onSelectField?: (fieldId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  loanCase,
  documentFileName,
  highlightedField,
  onSelectField,
}) => {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));
  const handleZoomReset = () => setZoomLevel(100);

  // Dynamic Case Values
  const docName = documentFileName || loanCase.uploaded_document_name || 'Registered_Sale_Deed.pdf';
  const borrowerUpper = loanCase.borrower_name.toUpperCase();
  const unitStr = `Flat No. ${loanCase.flat_house_number}, ${loanCase.floor}th Floor`;
  const deedCarpet = loanCase.carpet_area_sqft || 850;
  const taxCarpet = loanCase.tax_carpet_area_sqft !== undefined
    ? loanCase.tax_carpet_area_sqft
    : (loanCase.area_consistency === 'Exception' || loanCase.case_id.includes('DADAR'))
    ? Math.round(deedCarpet * 1.0824)
    : deedCarpet;

  const varianceSqft = taxCarpet - deedCarpet;
  const variancePct = deedCarpet > 0 ? Math.round((varianceSqft / deedCarpet) * 10000) / 100 : 0;
  const isAreaDiscrepant = varianceSqft !== 0 && Math.abs(variancePct) > 5.0;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 select-none shadow-md min-h-0">
      {/* Top Controls Bar */}
      <div className="shrink-0 h-8 px-2.5 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
        {/* Page Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => (p > 1 ? ((p - 1) as any) : 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Page {currentPage} of 3
          </span>
          <button
            onClick={() => setCurrentPage((p) => (p < 3 ? ((p + 1) as any) : 3))}
            disabled={currentPage === 3}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 font-medium ml-1 hidden sm:inline truncate max-w-[140px]">
            {currentPage === 1 ? 'Sale Deed Index-II' : currentPage === 2 ? 'BMC Property Tax' : 'Testing Notes'}
          </span>
        </div>

        {/* Zoom & Overlay Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              showBoundingBoxes
                ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle OCR Bounding Boxes"
          >
            <Layers className="w-3 h-3" />
            <span>Boxes</span>
          </button>

          <button
            onClick={handleZoomOut}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span
            onClick={handleZoomReset}
            className="font-mono text-[10px] text-slate-400 cursor-pointer hover:text-white px-1"
            title="Reset Zoom (100%)"
          >
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <a
            href="/api/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
            title="Open raw PDF in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Document View Canvas Area */}
      <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-950/90">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 w-full max-w-[580px] bg-white text-slate-900 shadow-2xl rounded-sm p-6 relative font-sans text-xs min-h-[760px] border border-slate-300"
        >
          {/* HEADER STRIP OF TESTING DOCKET */}
          <div className="border-b-2 border-slate-800 pb-2 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-extrabold text-[11px] tracking-wider text-slate-900 uppercase">
                  COLLATERALIQ | INSTITUTIONAL COLLATERAL DOCKET
                </span>
                <div className="font-mono text-[10px] text-slate-600 font-bold flex items-center gap-1.5">
                  <span>{loanCase.case_id}</span>
                  <span className="text-slate-400 font-normal">&bull;</span>
                  <span className="font-sans text-[10px] text-blue-700 font-medium truncate max-w-[200px]">{docName}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                  Page {currentPage} of 2
                </span>
                <div className="text-[8px] text-slate-500 font-mono mt-0.5">{loanCase.locality}</div>
              </div>
            </div>
          </div>

          {/* PAGE 1: REGISTERED SALE DEED / INDEX-II EXTRACT */}
          {currentPage === 1 && (
            <div className="space-y-3">
              {/* Official Heading */}
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  GOVERNMENT OF MAHARASHTRA
                </div>
                <div className="text-[11px] font-extrabold text-slate-900 tracking-tight">
                  Department of Registration and Stamps &bull; Mumbai City
                </div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  REGISTERED AGREEMENT FOR SALE / INDEX-II EXTRACT
                </div>
              </div>

              {/* Document Metadata Table */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px]">
                <div>
                  <span className="text-slate-600 block">Document No.</span>
                  <span className="font-mono font-bold text-slate-900">BBE-4-04921-2018</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Registration Date</span>
                  <span className="font-mono font-bold text-slate-900">14/09/2018</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Stamp Duty Paid</span>
                  <span className="font-mono font-bold text-slate-900">
                    INR {(deedCarpet * 1500).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Purchaser Anchor with Green Bounding Box */}
              <div className="p-2 bg-slate-50/70 rounded border border-slate-200 relative">
                <div className="text-[10px] text-slate-600 font-semibold uppercase">Borrower / Purchaser</div>
                <div className="relative inline-block mt-0.5">
                  <span className="font-bold text-slate-900 text-sm tracking-wide">{borrowerUpper}</span>
                  {showBoundingBoxes && (
                    <div
                      onClick={() => onSelectField?.('VF-01')}
                      className={`absolute -inset-1 border-2 border-emerald-500 bg-emerald-500/10 rounded cursor-pointer transition-all ${
                        highlightedField === 'VF-01' ? 'ring-2 ring-emerald-400 ring-offset-1 bg-emerald-500/20' : ''
                      }`}
                      title="Matched Field: Owner Name (Click to view in Matrix)"
                    >
                      <span className="absolute -top-3.5 right-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs">
                        MATCH: OWNER
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-slate-600 mt-1">
                  Instrument Type: Registered Agreement for Sale (Absolute Conveyance)
                </div>
              </div>

              {/* Asset Particulars with Unit Bounding Box */}
              <div className="border border-slate-200 rounded p-2.5 space-y-2">
                <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Asset Particulars</div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="relative">
                    <span className="text-slate-600 block">Flat / Unit</span>
                    <div className="relative inline-block mt-0.5">
                      <span className="font-bold text-slate-900">{unitStr}</span>
                      {showBoundingBoxes && (
                        <div
                          onClick={() => onSelectField?.('VF-02')}
                          className={`absolute -inset-1 border-2 border-emerald-500 bg-emerald-500/10 rounded cursor-pointer transition-all ${
                            highlightedField === 'VF-02' ? 'ring-2 ring-emerald-400 ring-offset-1 bg-emerald-500/20' : ''
                          }`}
                          title="Matched Field: Unit Identification"
                        >
                          <span className="absolute -top-3.5 left-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs">
                            MATCH: UNIT
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-600 block">CTS Number</span>
                    <span className="font-mono font-bold text-slate-900">412/A, {loanCase.locality} Division</span>
                  </div>
                </div>

                <div className="text-[10px]">
                  <span className="text-slate-600 block">Building / Society</span>
                  <span className="font-semibold text-slate-900">{loanCase.building_society}</span>
                </div>
                <div className="text-[10px]">
                  <span className="text-slate-600 block">Property Address</span>
                  <span className="text-slate-800">{loanCase.property_address}</span>
                </div>
              </div>

              {/* Property Specifications with Dynamic Carpet Area Bounding Box */}
              <div className="border border-slate-200 rounded p-2.5 bg-slate-50/50">
                <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Recorded Property Specifications
                </div>
                <div className="space-y-2 text-[10px]">
                  {/* Registered Carpet Area Anchor */}
                  <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200 relative">
                    <div>
                      <span className="text-slate-600 block font-medium">Registered Carpet Area</span>
                      <span className="text-[9px] text-slate-600">Index-II Column 7 / Clause 4(a)</span>
                    </div>
                    <div className="relative">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {deedCarpet} sq.ft ({(deedCarpet * 0.092903).toFixed(2)} sq.meters)
                      </span>
                      {showBoundingBoxes && (
                        isAreaDiscrepant ? (
                          <div
                            onClick={() => onSelectField?.('VF-04')}
                            className={`absolute -inset-1.5 border-2 border-amber-500 bg-amber-500/15 rounded bbox-amber cursor-pointer transition-all ${
                              highlightedField === 'VF-04' ? 'ring-2 ring-amber-500 ring-offset-1 bg-amber-500/30' : ''
                            }`}
                            title={`DISCREPANT FIELD: ${deedCarpet} sq.ft on Sale Deed vs ${taxCarpet} sq.ft on Tax Assessment (+${variancePct}%)`}
                          >
                            <span className="absolute -top-3.5 right-0 bg-amber-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5" />
                              EXCEPTION: {deedCarpet} SQFT
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => onSelectField?.('VF-04')}
                            className={`absolute -inset-1.5 border-2 border-emerald-500 bg-emerald-500/15 rounded cursor-pointer transition-all ${
                              highlightedField === 'VF-04' ? 'ring-2 ring-emerald-400 ring-offset-1 bg-emerald-500/20' : ''
                            }`}
                            title="MATCHED FIELD: Carpet area verified with municipal ledger"
                          >
                            <span className="absolute -top-3.5 right-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              MATCH: {deedCarpet} SQFT
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                    <span className="text-slate-600 font-medium">Built-Up Area</span>
                    <span className="font-mono font-bold text-slate-900">
                      {loanCase.builtup_area_sqft || Math.round(deedCarpet * 1.2)} sq.ft
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                    <span className="text-slate-600 font-medium">Allocated Parking</span>
                    <span className="font-semibold text-slate-900">{loanCase.parking}</span>
                  </div>
                </div>
              </div>

              {/* Verbatim Legal Clauses Excerpt */}
              <div className="border border-slate-200 rounded p-2 text-[10px] bg-slate-50/70 space-y-1.5">
                <div className="font-bold text-slate-700 uppercase tracking-wide text-[9px]">
                  Verbatim Legal Clauses Excerpt
                </div>
                <p className="italic text-slate-700 leading-relaxed text-[10px]">
                  <strong className="text-slate-900 not-italic">Clause 4(a):</strong> "The Vendor hereby agrees to transfer and convey to the Purchaser, {borrowerUpper}, the residential {unitStr} situated at {loanCase.building_society}, having a registered carpet area of {deedCarpet} sq.ft, together with the rights appurtenant thereto."
                </p>
                <p className="italic text-slate-700 leading-relaxed text-[10px]">
                  <strong className="text-slate-900 not-italic">Clause 11:</strong> "...includes exclusive right to use {loanCase.parking}."
                </p>
              </div>

              {/* Digital Certification Stamp */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-[9px] text-slate-600">
                <div className="border-2 border-dashed border-slate-300 rounded p-1.5 text-center font-mono">
                  [SUB-REGISTRAR DIGITAL STAMP]
                  <div className="text-[8px] text-slate-600">MUMBAI &bull; VERIFIED</div>
                </div>
                <div className="text-right font-mono">
                  <div>Signature: {borrowerUpper}</div>
                  <div>Executed: 14/09/2018</div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: BMC PROPERTY TAX BILL / ASSESSMENT LEDGER */}
          {currentPage === 2 && (
            <div className="space-y-3">
              {/* BMC Heading */}
              <div className="text-center border-b border-slate-200 pb-2">
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                  BRIHANMUMBAI MAHANAGARPALIKA (BMC)
                </div>
                <div className="text-[11px] font-extrabold text-slate-900 tracking-tight">
                  Assessment &amp; Collection Department &bull; {loanCase.locality} Ward
                </div>
                <div className="inline-block mt-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-900 uppercase tracking-wider">
                  PROPERTY TAX BILL / ASSESSMENT LEDGER
                </div>
              </div>

              {/* Municipal Tax Details */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[10px]">
                <div>
                  <span className="text-slate-600 block">Assessment Year</span>
                  <span className="font-mono font-bold text-slate-900">2025-2026</span>
                </div>
                <div>
                  <span className="text-slate-600 block">SAC (Property ID)</span>
                  <span className="font-mono font-bold text-slate-900">
                    MH-{loanCase.locality.slice(0, 3).toUpperCase()}-2025-{loanCase.flat_house_number}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600 block">Assessed Occupier / Owner</span>
                  <span className="font-bold text-slate-900">{borrowerUpper}</span>
                </div>
                <div>
                  <span className="text-slate-600 block">Dues Balance</span>
                  <span className="font-bold text-emerald-700 font-mono">NIL - Fully Paid</span>
                </div>
              </div>

              {/* Assessed Dimensions with Dynamic Bounding Box */}
              <div className="border border-slate-200 rounded p-3 bg-white space-y-2">
                <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                  Assessment Dimensions &amp; Municipal Carpet
                </div>

                <div className={`p-2 rounded border relative ${isAreaDiscrepant ? 'bg-amber-50/80 border-amber-300' : 'bg-emerald-50/60 border-emerald-300'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`font-semibold block text-[11px] ${isAreaDiscrepant ? 'text-amber-900' : 'text-emerald-900'}`}>
                        Assessed Carpet Area
                      </span>
                      <span className={`text-[9px] ${isAreaDiscrepant ? 'text-amber-700' : 'text-emerald-700'}`}>
                        Municipal tax billing multiplier
                      </span>
                    </div>
                    <div className="relative">
                      <span className={`font-mono font-bold text-base ${isAreaDiscrepant ? 'text-amber-950' : 'text-emerald-950'}`}>
                        {taxCarpet} sq.ft ({(taxCarpet * 0.092903).toFixed(2)} sq.meters)
                      </span>
                      {showBoundingBoxes && (
                        isAreaDiscrepant ? (
                          <div
                            onClick={() => onSelectField?.('VF-04')}
                            className={`absolute -inset-1.5 border-2 border-amber-500 bg-amber-500/15 rounded bbox-amber cursor-pointer transition-all ${
                              highlightedField === 'VF-04' ? 'ring-2 ring-amber-500 ring-offset-1 bg-amber-500/30' : ''
                            }`}
                            title={`DISCREPANT FIELD: Municipal ledger records ${taxCarpet} sq.ft (+${variancePct}% variance)`}
                          >
                            <span className="absolute -top-3.5 right-0 bg-amber-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5" />
                              VARIANCE +{varianceSqft} SQFT (+{variancePct}%)
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => onSelectField?.('VF-04')}
                            className={`absolute -inset-1.5 border-2 border-emerald-500 bg-emerald-500/15 rounded cursor-pointer transition-all ${
                              highlightedField === 'VF-04' ? 'ring-2 ring-emerald-400 ring-offset-1 bg-emerald-500/20' : ''
                            }`}
                            title="MATCHED FIELD: Municipal ledger matches deed area perfectly"
                          >
                            <span className="absolute -top-3.5 right-0 bg-emerald-600 text-white font-mono text-[8px] font-bold px-1 rounded shadow-xs flex items-center gap-0.5">
                              <CheckCircle className="w-2.5 h-2.5" />
                              MATCH: 100% RECONCILED
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-600 block">Unit Position</span>
                    <span className="font-semibold text-slate-900">{loanCase.floor}th Floor / Flat {loanCase.flat_house_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block">Building Vintage</span>
                    <span className="font-semibold text-slate-900">{loanCase.property_age_years || 10} Years</span>
                  </div>
                </div>
              </div>

              {/* Policy Variance Warning or Clean Match Callout */}
              {isAreaDiscrepant ? (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>POLICY VARIANCE TRIGGER: 5% TOLERANCE EXCEEDED</span>
                  </div>
                  <p className="leading-relaxed text-amber-950">
                    Sale deed records {deedCarpet} sq.ft while BMC tax assessment records {taxCarpet} sq.ft. Variance = +{varianceSqft} sq.ft (+{variancePct}%). Empaneled valuer physical measurement is mandated prior to credit sanction.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-[10px] text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>ZERO AREA VARIANCE &bull; CLEAN MUNICIPAL RECONCILIATION</span>
                  </div>
                  <p className="leading-relaxed text-emerald-950">
                    Primary registered deed and municipal tax ledger agree at {deedCarpet} sq.ft (0% variance). Eligible for standard physical valuation.
                  </p>
                </div>
              )}

              {/* Payment reconciliation */}
              <div className="border border-slate-200 rounded p-2 text-[10px] bg-slate-50">
                <div className="font-bold text-slate-700">Payment Reconciliation Record</div>
                <div className="text-slate-600 font-mono mt-0.5">
                  Receipt No: MCGM-PT-2025-99214 &bull; RTGS Ref: HDFC0000060-99120 &bull; Dues: NIL
                </div>
              </div>
            </div>
          )}

          {/* PAGE 3: NOTES */}
          {currentPage === 3 && (
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Docket Testing &amp; Governance Notes
              </h4>
              <p className="leading-relaxed">
                This collateral dossier represents an active verification record for {loanCase.borrower_name} ({loanCase.case_id}) in {loanCase.locality}.
              </p>
              <div className="p-3 bg-white rounded border border-slate-200 space-y-1 font-mono text-[11px]">
                <div>File Name: {docName}</div>
                <div>CTS Parcel: 412/A {loanCase.locality} Division</div>
                <div>Registered Carpet: {deedCarpet} sq.ft</div>
                <div>Municipal Carpet: {taxCarpet} sq.ft</div>
                <div>Observed Variance: {variancePct > 0 ? `+${variancePct}%` : `${variancePct}%`}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Viewer Footer Legend */}
      <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 text-[10px] flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Green = Matched OCR Attribute</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Amber = Discordant / Area Exception</span>
          </div>
        </div>
        <span className="font-mono text-slate-400">Resolution: 300 DPI Canvas</span>
      </div>
    </div>
  );
};
