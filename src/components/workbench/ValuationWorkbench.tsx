'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  ShieldCheck,
  History,
  Save,
  CheckCircle2,
  ChevronUp,
  Scale,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { CollateralAssessmentCase, AuditLogItem } from '@/types/collateral';

interface ValuationWorkbenchProps {
  loanCase: CollateralAssessmentCase;
  auditLogs: AuditLogItem[];
  onUpdateValuerAssessment: (data: {
    assessedValue: number;
    status: string;
    overrideReason: string;
    notes: string;
  }) => Promise<void>;
}

export const ValuationWorkbench: React.FC<ValuationWorkbenchProps> = ({
  loanCase,
  auditLogs,
  onUpdateValuerAssessment,
}) => {
  const { modelIndicativeValue, loanFacilityRequested, valuerReport, reviewLevel, reviewDrivers, balanceTransfer } = loanCase;
  const initialValuerVal = valuerReport?.assessedValue || modelIndicativeValue;

  const [assessedValue, setAssessedValue] = useState<number>(initialValuerVal);
  const [inspectionStatus, setInspectionStatus] = useState<string>(
    loanCase.status === 'COMPLETED' ? 'Completed' : 'Inspection Scheduled'
  );
  const [overrideReason, setOverrideReason] = useState<string>('Standard Market Calibration');
  const [valuerNotes, setValuerNotes] = useState<string>(
    valuerReport?.adjustmentsNote || 'Valuation calibrated against registered micro-market transaction indices.'
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);

  React.useEffect(() => {
    setAssessedValue(valuerReport?.assessedValue || modelIndicativeValue);
  }, [loanCase.caseId, modelIndicativeValue, valuerReport?.assessedValue]);

  const assessedValuation = valuerReport?.assessedValue || modelIndicativeValue;
  const ltvPercent = assessedValuation > 0 ? Number(((loanFacilityRequested / assessedValuation) * 100).toFixed(1)) : 0;
  const coverageRatio = loanFacilityRequested > 0 ? Number((assessedValuation / loanFacilityRequested).toFixed(2)) : 0;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(ltvPercent, 100) / 100) * circumference;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateValuerAssessment({
        assessedValue,
        status: inspectionStatus,
        overrideReason,
        notes: valuerNotes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#101824] border border-white/[0.08] rounded-2xl overflow-hidden text-[#F8FAFC] text-xs select-none shadow-card min-h-0">
      {/* Header */}
      <div className="shrink-0 h-9 px-3.5 bg-[#0B111A] border-b border-white/[0.08] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-slate-200 uppercase tracking-wider truncate font-heading">
            Valuation &amp; Risk Review Panel
          </h3>
        </div>
        <button
          onClick={() => setShowAuditDrawer(!showAuditDrawer)}
          className="px-2.5 py-1 rounded-lg bg-[#141E2B] hover:bg-[#1E293B] text-slate-300 border border-white/[0.08] flex items-center gap-1.5 transition-colors text-[10px] cursor-pointer shadow-xs font-semibold"
        >
          <History className="w-3 h-3 text-cyan-400" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* Card 1: Collateral Review Level & Explainable Drivers */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-[#94A3B8] font-heading">Collateral Review Level</span>
            <span className={`font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
              reviewLevel === 'LOW' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80' :
              reviewLevel === 'MEDIUM' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80' :
              'bg-rose-950/80 text-rose-300 border border-rose-800/80'
            }`}>
              {reviewLevel === 'LOW' ? '🟢 LOW REVIEW' : reviewLevel === 'MEDIUM' ? '🟡 MEDIUM REVIEW' : '🔴 HIGH REVIEW'}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <span className="text-[#94A3B8] font-semibold block text-[10px] uppercase font-mono">Explainable Review Drivers:</span>
            {reviewDrivers && reviewDrivers.length > 0 ? (
              reviewDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#141E2B] border border-white/[0.04] text-slate-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{driver}</span>
                </div>
              ))
            ) : (
              <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] text-[#94A3B8]">
                All parameters within standard policy limits.
              </div>
            )}
          </div>
        </div>

        {/* Card 2: LTV & Collateral Coverage */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-200 uppercase tracking-wider font-heading">Credit Risk &amp; LTV Ratios</span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
              Prudential Cap: &le; 75%
            </span>
          </div>

          <div className="flex items-center gap-3.5 pt-1">
            {/* Radial LTV Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r={radius} className="stroke-[#141E2B]" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-cyan-400 transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono font-extrabold text-xs text-white">{ltvPercent}%</span>
                <span className="text-[8px] text-[#94A3B8] uppercase font-mono">LTV</span>
              </div>
            </div>

            {/* Ratios Breakdown */}
            <div className="flex-1 space-y-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04]">
                <span className="text-[#94A3B8] text-[10px] block">Collateral Coverage:</span>
                <span className="text-emerald-400 font-bold text-xs">{coverageRatio}x Loan Exposure</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04]">
                <span className="text-[#94A3B8] text-[10px] block">Facility Requested:</span>
                <span className="text-white font-bold text-xs">₹{(loanFacilityRequested / 1e7).toFixed(2)} Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Valuer Assessment Form */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-[#94A3B8] font-heading">Valuer Assessment Inputs</span>
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[#94A3B8] text-[10px] mb-1 font-mono uppercase tracking-wider">Assessed Value (INR)</label>
              <input
                type="number"
                value={assessedValue}
                onChange={(e) => setAssessedValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141E2B] border border-white/[0.10] rounded-xl font-mono text-xs text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-[10px] mb-1 font-mono uppercase tracking-wider">Valuer Inspection Notes</label>
              <textarea
                rows={2}
                value={valuerNotes}
                onChange={(e) => setValuerNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#141E2B] border border-white/[0.10] rounded-xl text-xs text-slate-200 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>Assessment Saved &amp; Audit Logged!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Valuer Assessment'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons per Master Prompt Section 35 */}
        <div className="bg-[#0B111A] rounded-2xl border border-white/[0.06] p-3.5 space-y-2.5 shadow-inner">
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider block font-semibold">
            Institutional Underwriting Actions
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => alert('Opening Valuation Analysis Report...')}
              className="px-3 py-2 bg-[#141E2B] hover:bg-[#1E293B] border border-white/[0.08] text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-[0.98]"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Valuation Analysis</span>
            </button>
            <button
              onClick={() => alert('Opening Valuer Report PDF...')}
              className="px-3 py-2 bg-[#141E2B] hover:bg-[#1E293B] border border-white/[0.08] text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-[0.98]"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Valuer Report</span>
            </button>
            <button
              onClick={() => alert('Add Review Comment modal opened.')}
              className="px-3 py-2 bg-[#141E2B] hover:bg-[#1E293B] border border-white/[0.08] text-slate-200 rounded-xl font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs active:scale-[0.98]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Comment</span>
            </button>
            <button
              onClick={() => alert('Proceeding to Credit Review... Case docket handed over.')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-900/30 transition-all active:scale-[0.98]"
            >
              <span>Credit Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Audit Log Drawer */}
        {showAuditDrawer && (
          <div className="bg-[#0B111A] rounded-2xl border border-white/[0.08] p-3.5 space-y-2.5 animate-in fade-in duration-200 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="uppercase tracking-wider text-[11px] font-heading">Audit Trail Log</span>
              <button onClick={() => setShowAuditDrawer(false)} className="text-[#94A3B8] hover:text-white p-1 rounded-lg">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-[11px]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-[#141E2B] border border-white/[0.04] space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-[#94A3B8]">
                    <span>{log.officer_name} ({log.officer_role})</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
