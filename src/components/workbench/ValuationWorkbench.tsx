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
import { LoanCase, AuditLogItem } from '@/types/collateral';

interface ValuationWorkbenchProps {
  loanCase: LoanCase;
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
  const [assessedValue, setAssessedValue] = useState<number>(
    loanCase.valuer_assessed_value_inr || loanCase.indicative_value_inr || 46750000
  );
  const [inspectionStatus, setInspectionStatus] = useState<string>(
    loanCase.valuer_status || 'Pending'
  );
  const [overrideReason, setOverrideReason] = useState<string>(
    loanCase.valuer_override_reason || 'No material adjustment'
  );
  const [valuerNotes, setValuerNotes] = useState<string>(
    loanCase.area_consistency === 'Exception'
      ? 'Physical measurement recommended following BMC tax ledger carpet area divergence.'
      : 'All attributes matched. Inspection scheduled in ordinary course.'
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);

  // Sync state whenever loanCase changes
  React.useEffect(() => {
    setAssessedValue(loanCase.valuer_assessed_value_inr || loanCase.indicative_value_inr || 46750000);
    setInspectionStatus(loanCase.valuer_status || 'Pending');
    setOverrideReason(loanCase.valuer_override_reason || 'No material adjustment');
    setValuerNotes(
      loanCase.area_consistency === 'Exception'
        ? 'Physical measurement recommended following BMC tax ledger carpet area divergence.'
        : 'All attributes matched. Inspection scheduled in ordinary course.'
    );
  }, [loanCase.case_id, loanCase.indicative_value_inr, loanCase.valuer_assessed_value_inr]);

  // SVG Radial Gauge calculation for LTV
  const ltvPercent = loanCase.ltv_percent || 53.5;
  const rbiCeiling = 75.0;
  // Gauge math: radius 40, circumference ~251.2
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
          className="text-[10px] font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/50 shrink-0"
        >
          <History className="w-3 h-3" />
          <span>Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 min-h-0">
        {/* 1. INDICATIVE FAIR MARKET VALUE CARD */}
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 text-white shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
              Indicative Fair Market Value
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700/60 font-semibold">
              AVM Calibrated
            </span>
          </div>

          <div className="text-xl font-extrabold font-mono text-white tabular-nums tracking-tight">
            ₹{assessedValue.toLocaleString('en-IN')}
          </div>

          {/* Valuation Corridor */}
          <div className="p-1.5 bg-slate-950/80 rounded border border-slate-700/60 text-[10px] flex items-center justify-between font-mono">
            <span className="text-slate-400 text-[9px] uppercase">Corridor (&plusmn;5%):</span>
            <span className="font-bold text-slate-200 tabular-nums">
              ₹{(assessedValue * 0.95 / 1e7).toFixed(2)} Cr – ₹{(assessedValue * 1.05 / 1e7).toFixed(2)} Cr
            </span>
          </div>

          <div className="text-[9px] text-slate-400 flex items-center justify-between pt-0.5">
            <span>Dadar West Benchmark:</span>
            <span className="font-mono text-slate-200 font-semibold">₹55,000 / sq.ft</span>
          </div>
        </div>

        {/* 2. CREDIT RISK RATIOS CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2.5">
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              Credit Risk Ratios
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
              PASS PRUDENTIAL
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Left Box: LTV Metric */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                  LTV Ratio
                </span>
                <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                  {ltvPercent.toFixed(1)}%
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] font-mono text-slate-400 block">
                  RBI Cap: &le; 75.0%
                </span>
              </div>
            </div>

            {/* Right Box: Collateral Coverage */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded p-2.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                  Collateral Coverage
                </span>
                <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                  {(loanCase.collateral_coverage_x || 1.87).toFixed(2)}x
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800/60">
                <span className="text-[10px] font-medium text-emerald-400 block">
                  &gt; 1.33x required min
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Cushion Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-950/40 border border-emerald-900/60 text-emerald-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>21.5% cushion</span>
          </div>
        </div>

        {/* 3. VALUER REVIEW INPUTS FORM */}
        <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80 space-y-2">
          <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between pb-1.5 border-b border-slate-700/60">
            <span>Valuer Sign-Off</span>
            <span className="text-[9px] font-semibold text-slate-400">IBBI Empaneled</span>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-medium mb-0.5">Assessed Value (₹)</label>
            <input
              type="number"
              value={assessedValue}
              onChange={(e) => setAssessedValue(parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded font-mono font-medium text-xs text-slate-100 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-0.5">Inspection</label>
              <select
                value={inspectionStatus}
                onChange={(e) => setInspectionStatus(e.target.value)}
                className="w-full px-1.5 py-1 bg-slate-950 border border-slate-700 rounded font-mono font-medium text-xs text-slate-100 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Verified">Verified</option>
                <option value="Inspection Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-medium mb-0.5">Override Reason</label>
              <select
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full px-1.5 py-1 bg-slate-950 border border-slate-700 rounded font-mono font-medium text-xs text-slate-100 focus:ring-1 focus:ring-blue-500"
              >
                <option value="No material adjustment">No adjustment</option>
                <option value="Condition/marketability adjustment">Condition adj.</option>
                <option value="Floor rise / view premium">Floor rise</option>
                <option value="Carpet area remeasurement">Carpet remeas.</option>
                <option value="Distress discount">Distress disc.</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-medium mb-0.5">Valuer Field Notes</label>
            <textarea
              rows={2}
              value={valuerNotes}
              onChange={(e) => setValuerNotes(e.target.value)}
              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 resize-none font-sans"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow-xs transition-all"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Assessment Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Assessment'}</span>
              </>
            )}
          </button>
        </div>

        {/* 4. COLLAPSIBLE AUDIT TRAIL DRAWER */}
        {showAuditDrawer && (
          <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 border border-slate-700/80 shadow-lg space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                <History className="w-3 h-3 text-blue-400" />
                <span>Audit Trail</span>
              </div>
              <button
                onClick={() => setShowAuditDrawer(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span className="font-bold text-blue-300">{log.officer_name}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{log.description}</p>
                  {log.previous_state && log.new_state && (
                    <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                      <span>{log.previous_state}</span>
                      <span>&rarr;</span>
                      <span className="text-emerald-400 font-bold">{log.new_state}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
