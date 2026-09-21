'use client';

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Building,
  Car,
  FileText,
  Sliders,
  Scale,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';
import { processNewCase, BENCHMARKS } from '@/lib/caseStore';

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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Borrower & Property Profile
  const [borrowerName, setBorrowerName] = useState('Arjun Mehta');
  const [loanFacilityRequested, setLoanFacilityRequested] = useState<number | ''>(25000000);
  const [location, setLocation] = useState('Dadar West');
  const [propertyType, setPropertyType] = useState('Residential Apartment');
  const [bhk, setBhk] = useState('2 BHK');
  const [carpetArea, setCarpetArea] = useState<number | ''>(850);
  const [builtUpArea, setBuiltUpArea] = useState<number | ''>(1020);
  const [floor, setFloor] = useState<number | ''>(7);
  const [buildingAge, setBuildingAge] = useState<number | ''>(6);
  const [parking, setParking] = useState('1 Covered Stilt (CP-14)');
  const [occupancy, setOccupancy] = useState<'Self-occupied' | 'Tenant' | 'Vacant'>('Self-occupied');

  // Step 2: Empaneled Valuer Report
  const [hasValuerReport, setHasValuerReport] = useState(true);
  const [valuerName, setValuerName] = useState('P. V. Kulkarni & Associates (IBBI Reg: IBBI/RV/02/2019/1104)');
  const [valuerAssessedValue, setValuerAssessedValue] = useState<number | ''>(46750000);
  const [valuerRateApplied, setValuerRateApplied] = useState<number | ''>(55000);

  // Step 3: Balance Transfer
  const [isBalanceTransfer, setIsBalanceTransfer] = useState(false);
  const [previousLender, setPreviousLender] = useState('');
  const [previousValuation, setPreviousValuation] = useState<number | ''>('');
  const [outstandingBalance, setOutstandingBalance] = useState<number | ''>('');

  if (!isOpen) return null;

  const benchmarkRate = BENCHMARKS[location] || 35000;
  const areaSqft = typeof carpetArea === 'number' ? carpetArea : 0;
  const reqFacility = typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 0;
  const modelIndicativeValue = Math.round(areaSqft * benchmarkRate);
  const valuerVal = typeof valuerAssessedValue === 'number' ? valuerAssessedValue : 0;
  const deviationPct = modelIndicativeValue > 0 && valuerVal > 0
    ? Number(((Math.abs(valuerVal - modelIndicativeValue) / modelIndicativeValue) * 100).toFixed(1))
    : 0;

  const handlePreFillDemo = () => {
    setBorrowerName('Arjun Mehta');
    setLoanFacilityRequested(25000000);
    setLocation('Dadar West');
    setPropertyType('Residential Apartment');
    setBhk('2 BHK');
    setCarpetArea(850);
    setBuiltUpArea(1020);
    setFloor(7);
    setBuildingAge(6);
    setParking('1 Covered Stilt (CP-14)');
    setOccupancy('Self-occupied');
    setHasValuerReport(true);
    setValuerName('P. V. Kulkarni & Associates');
    setValuerAssessedValue(46750000);
    setValuerRateApplied(55000);
    setIsBalanceTransfer(false);
  };

  const handleExecuteReconciliation = () => {
    const newCase = processNewCase({
      borrowerName: borrowerName || 'New Borrower',
      location,
      propertyType,
      bhk,
      carpetArea: typeof carpetArea === 'number' ? carpetArea : 800,
      builtUpArea: typeof builtUpArea === 'number' ? builtUpArea : 960,
      floor: typeof floor === 'number' ? floor : 5,
      buildingAge: typeof buildingAge === 'number' ? buildingAge : 5,
      parking: parking || '1 Covered Space',
      occupancy,
      loanFacilityRequested: typeof loanFacilityRequested === 'number' ? loanFacilityRequested : 20000000,
      valuerName: hasValuerReport ? valuerName : undefined,
      valuerAssessedValue: hasValuerReport && typeof valuerAssessedValue === 'number' ? valuerAssessedValue : undefined,
      valuerRateApplied: hasValuerReport && typeof valuerRateApplied === 'number' ? valuerRateApplied : undefined,
      isBalanceTransfer,
      previousLender: isBalanceTransfer ? previousLender : undefined,
      previousValuation: isBalanceTransfer && typeof previousValuation === 'number' ? previousValuation : undefined,
      outstandingBalance: isBalanceTransfer && typeof outstandingBalance === 'number' ? outstandingBalance : undefined,
    });

    onCaseCreated(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Initiate Collateral Assessment &amp; Reconciliation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Step {currentStep} of 3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Institutional AVM model valuation &amp; IBBI valuer report reconciliation pipeline
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
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-blue-400' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-[10px] font-mono">
              1
            </span>
            <span>Property &amp; Borrower Profile</span>
          </div>
          <span className="text-slate-700">&mdash;&gt;</span>
          <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-blue-400' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-[10px] font-mono">
              2
            </span>
            <span>Valuer Inspection Report</span>
          </div>
          <span className="text-slate-700">&mdash;&gt;</span>
          <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-blue-400' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-[10px] font-mono">
              3
            </span>
            <span>Reconciliation &amp; BT Setup</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 text-xs">
          {/* STEP 1: Property & Borrower Profile */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-blue-400 font-bold block text-xs">Property Profile &amp; Facility Setup</span>
                  <p className="text-[11px] text-slate-300">
                    Input physical asset attributes to query micro-market benchmarks (e.g., Dadar West ₹55,000/sq.ft).
                  </p>
                </div>
                <Building className="w-5 h-5 text-blue-400 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Borrower / Applicant Name</label>
                  <input
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Arjun Mehta"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Loan Facility Requested (INR)</label>
                  <input
                    type="number"
                    value={loanFacilityRequested}
                    onChange={(e) => setLoanFacilityRequested(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 25000000"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Locality / Micro-Market</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    {localityList.map((loc) => (
                      <option key={loc.name} value={loc.name} className="bg-white text-slate-900">
                        {loc.name} (Benchmark: ₹{loc.rate.toLocaleString()}/sq.ft)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Property Type &amp; Configuration</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-2 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <option value="Residential Apartment">Residential Apartment</option>
                      <option value="Independent Bungalow">Independent Bungalow</option>
                      <option value="Commercial Premises">Commercial Premises</option>
                    </select>

                    <select
                      value={bhk}
                      onChange={(e) => setBhk(e.target.value)}
                      className="w-full px-2 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={carpetArea}
                    onChange={(e) => setCarpetArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 850"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Built-Up Area (sq.ft)</label>
                  <input
                    type="number"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. 1020"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor &amp; Building Age</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={floor}
                      onChange={(e) => setFloor(Number(e.target.value))}
                      placeholder="Floor (e.g. 7)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="number"
                      value={buildingAge}
                      onChange={(e) => setBuildingAge(Number(e.target.value))}
                      placeholder="Age (yrs e.g. 6)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Occupancy Status</label>
                  <select
                    value={occupancy}
                    onChange={(e) => setOccupancy(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Self-occupied">Self-occupied</option>
                    <option value="Tenant">Tenant Occupied</option>
                    <option value="Vacant">Vacant</option>
                  </select>
                </div>
              </div>

              {/* Model Indicative Valuation Preview */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold block">
                    MODEL INDICATIVE VALUE PREVIEW
                  </span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr
                  </span>
                  <span className="text-[11px] text-slate-400 block font-mono">
                    ₹{modelIndicativeValue.toLocaleString()} @ ₹{benchmarkRate.toLocaleString()}/sq.ft
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold block">
                    INDICATIVE LTV
                  </span>
                  <span className="text-base font-bold text-blue-300 font-mono">
                    {modelIndicativeValue > 0 ? ((reqFacility / modelIndicativeValue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Empaneled Valuer Report */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">IBBI Empaneled Valuer Report Linkage</span>
                  <p className="text-[11px] text-slate-400">
                    Attach physical valuer inspection report parameters to compute valuation deviation drivers.
                  </p>
                </div>
                <Scale className="w-5 h-5 text-blue-400 shrink-0" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasValuerReport}
                    onChange={(e) => setHasValuerReport(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-200 text-xs font-bold">
                    Empaneled Physical Valuer Report Available
                  </span>
                </label>

                {hasValuerReport && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Empaneled Valuer Name &amp; IBBI Reg</label>
                      <input
                        type="text"
                        value={valuerName}
                        onChange={(e) => setValuerName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                        placeholder="e.g. P. V. Kulkarni & Associates"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Valuer Assessed Value (INR)</label>
                      <input
                        type="number"
                        value={valuerAssessedValue}
                        onChange={(e) => setValuerAssessedValue(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                        placeholder="e.g. 46750000"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Rate Applied by Valuer (₹/sq.ft)</label>
                      <input
                        type="number"
                        value={valuerRateApplied}
                        onChange={(e) => setValuerRateApplied(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                        placeholder="e.g. 55000"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Deviation Analysis Preview */}
              {hasValuerReport && valuerVal > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Model vs. Valuer Deviation:</span>
                    <span className={`font-mono font-bold ${deviationPct > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {deviationPct}% ({deviationPct > 10 ? 'MANUAL REVIEW MANDATED' : 'WITHIN TOLERANCE'})
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                    <span>Model: ₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
                    <span>Valuer: ₹{(valuerVal / 1e7).toFixed(3)} Cr</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Reconciliation & BT Setup */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Balance Transfer (BT) &amp; Final Setup</span>
                  <p className="text-[11px] text-slate-400">
                    Configure takeover details from previous lender if applicable.
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400 shrink-0" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isBalanceTransfer}
                    onChange={(e) => setIsBalanceTransfer(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-200 text-xs font-bold">
                    This is a Balance Transfer (BT Takeover) Case
                  </span>
                </label>

                {isBalanceTransfer && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Previous Lender Bank / NBFC</label>
                      <input
                        type="text"
                        value={previousLender}
                        onChange={(e) => setPreviousLender(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                        placeholder="e.g. HDFC Bank Ltd"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Previous Lender Valuation (INR)</label>
                      <input
                        type="number"
                        value={previousValuation}
                        onChange={(e) => setPreviousValuation(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                        placeholder="e.g. 35000000"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-slate-300 font-semibold mb-1">Outstanding Balance Principal (INR)</label>
                      <input
                        type="number"
                        value={outstandingBalance}
                        onChange={(e) => setOutstandingBalance(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white"
                        placeholder="e.g. 19500000"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Card */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                  Final Assessment Summary
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="text-slate-400">Applicant: <span className="text-white font-bold">{borrowerName}</span></div>
                  <div className="text-slate-400">Locality: <span className="text-white font-bold">{location}</span></div>
                  <div className="text-slate-400">Carpet Area: <span className="text-white font-bold">{areaSqft} sq.ft</span></div>
                  <div className="text-slate-400">Facility Requested: <span className="text-emerald-400 font-bold">₹{(reqFacility / 1e7).toFixed(2)} Cr</span></div>
                  <div className="text-slate-400">Model Indicative: <span className="text-emerald-400 font-bold">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span></div>
                  <div className="text-slate-400">Status: <span className="text-blue-400 font-bold">{hasValuerReport ? 'VALUER LINKED' : 'INDICATIVE READY'}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => (prev > 1 ? (prev - 1 as any) : prev))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 disabled:opacity-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep((prev) => (prev < 3 ? (prev + 1 as any) : prev))}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleExecuteReconciliation}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Execute Reconciliation &amp; Open Workbench</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
