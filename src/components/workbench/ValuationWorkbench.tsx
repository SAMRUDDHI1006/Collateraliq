'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  ShieldCheck,
  Building,
  History,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Scale,
  DollarSign,
  AlertCircle,
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
  const { modelIndicativeValue, loanFacilityRequested, valuerReport } = loanCase;
  const initialValuerVal = valuerReport?.assessedValue || modelIndicativeValue;

  const [assessedValue, setAssessedValue] = useState<number>(initialValuerVal);
  const [inspectionStatus, setInspectionStatus] = useState<string>(
    loanCase.status === 'REVIEWED' ? 'Completed' : 'Inspection Scheduled'
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
    setInspectionStatus(loanCase.status === 'REVIEWED' ? 'Completed' : 'Inspection Scheduled');
  }, [loanCase.caseId, modelIndicativeValue, valuerReport?.assessedValue, loanCase.status]);

  const ltvPercent = modelIndicativeValue > 0 ? Number(((loanFacilityRequested / modelIndicativeValue) * 100).toFixed(1)) : 0;
  const coverageRatio = loanFacilityRequested > 0 ? Number((modelIndicativeValue / loanFacilityRequested).toFixed(2)) : 0;

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
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 text-xs select-none shadow-md min-h-0">
      {/* Top Header */}
      <div className="shrink-0 h-8 px-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <h3 className="font-bold text-slate-200 uppercase tracking-wider truncate">
            Valuation &amp; Valuer Workbench
          </h3>
        </div>
        <button
          onClick={() => setShowAuditDrawer(!showAuditDrawer)}
          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors text-[10px]"
        >
          <History className="w-3 h-3 text-blue-400" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-2.5">
          {/* Credit Risk Ratios Card */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Credit Risk Ratios</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                RBI Ceiling: &le; 75%
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {/* Radial LTV Gauge */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-20 h-20 -rotate-90">
                  <circle cx="40" cy="40" r={radius} className="stroke-slate-800" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    className="stroke-blue-500 transition-all duration-500"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono font-extrabold text-xs text-white">{ltvPercent}%</span>
                  <span className="text-[8px] text-slate-400 uppercase font-mono">LTV Ratio</span>
                </div>
              </div>

              {/* Ratio Numbers */}
              <div className="flex-1 space-y-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Collateral Coverage:</span>
                  <span className="text-emerald-400 font-bold text-xs">{coverageRatio}x Exposure</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Facility Requested:</span>
                  <span className="text-white font-bold text-xs">₹{(loanFacilityRequested / 1e7).toFixed(2)} Cr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valuer Interactive Review Inputs */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="uppercase tracking-wider text-[11px] text-slate-400">IBBI Valuer Override Inputs</span>
            <Scale className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Assessed Fair Market Value (INR)</label>
              <input
                type="number"
                value={assessedValue}
                onChange={(e) => setAssessedValue(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg font-mono text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Inspection Status</label>
              <select
                value={inspectionStatus}
                onChange={(e) => setInspectionStatus(e.target.value)}
                className="w-full px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <option value="Inspection Scheduled">Inspection Scheduled</option>
                <option value="Completed">Inspection Completed</option>
                <option value="Pending">Pending Clearance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Override Justification Reason</label>
              <select
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <option value="No material adjustment">Standard Market Calibration</option>
                <option value="High Floor Rise Premium">High Floor Rise Premium</option>
                <option value="Building Age Depreciation">Building Age Depreciation</option>
                <option value="Micro-market Speculative Calibration">Micro-market Speculative Calibration</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Valuer Inspection Notes</label>
              <textarea
                rows={3}
                value={valuerNotes}
                onChange={(e) => setValuerNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Assessment Saved &amp; Audit Logged!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving Assessment...' : 'Save Valuer Assessment'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Log Drawer */}
        {showAuditDrawer && (
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="uppercase tracking-wider text-[11px]">Audit Trail Log</span>
              <button onClick={() => setShowAuditDrawer(false)} className="text-slate-400 hover:text-white">
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto text-[11px]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
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
