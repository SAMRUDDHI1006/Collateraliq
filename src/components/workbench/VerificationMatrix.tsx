'use client';

import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Info,
  Layers,
  Scale,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { VerificationFieldComparison } from '@/types/collateral';

interface VerificationMatrixProps {
  fields: VerificationFieldComparison[];
  highlightedField?: string | null;
  onSelectField?: (id: string) => void;
  exceptionAcknowledged: boolean;
  onToggleAcknowledge: (acknowledged: boolean) => void;
}

export const VerificationMatrix: React.FC<VerificationMatrixProps> = ({
  fields,
  highlightedField,
  onSelectField,
  exceptionAcknowledged,
  onToggleAcknowledge,
}) => {
  const matchCount = fields.filter((f) => f.status === 'MATCH' || f.status === 'CROSS_INDEXED').length;
  const exceptionCount = fields.filter((f) => f.status === 'DISCREPANCY').length;
  const discrepantField = fields.find((f) => f.status === 'DISCREPANCY');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 text-xs select-none shadow-md min-h-0">
      {/* Matrix Header Strip */}
      <div className="shrink-0 h-8 px-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <h3 className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider truncate">
            Cross-Doc Verification Matrix
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            {matchCount} Matched
          </span>
          <span
            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
              exceptionCount > 0
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {exceptionCount} Discrepancy
          </span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {/* Verification Rows Table */}
        <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full table-fixed text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800/70 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 text-left">Verification Attribute</th>
                <th className="py-2.5 px-3 text-left">Sale Deed / Index-II</th>
                <th className="py-2.5 px-3 text-left">BMC Tax Receipt</th>
                <th className="py-2.5 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {fields.map((f) => {
                const isDiscrepant = f.status === 'DISCREPANCY';
                const isSelected = highlightedField === f.id;

                return (
                  <tr
                    key={f.id}
                    onClick={() => onSelectField?.(f.id)}
                    className={`cursor-pointer transition-colors border-b border-slate-800/70 ${
                      isSelected
                        ? 'bg-blue-950/70 ring-1 ring-blue-500/50'
                        : isDiscrepant
                        ? 'bg-amber-950/30 hover:bg-amber-950/50'
                        : 'hover:bg-slate-900/80'
                    }`}
                  >
                    {/* Attribute Name */}
                    <td className="py-3 px-3">
                      <div className="text-slate-100 font-semibold text-xs flex items-center gap-1.5">
                        <span>{f.field_name}</span>
                        {f.regulatory_anchor && (
                          <div className="group relative cursor-pointer" title={f.regulatory_anchor}>
                            <Info className="w-3 h-3 text-slate-400 hover:text-slate-300" />
                          </div>
                        )}
                      </div>
                      {f.variance_details && (
                        <div
                          className={`text-[10px] font-mono mt-0.5 ${
                            isDiscrepant ? 'text-amber-400 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          {f.variance_details}
                        </div>
                      )}
                    </td>

                    {/* Source: Sale Deed */}
                    <td className="py-3 px-3">
                      <div className="text-slate-100 font-medium text-xs font-mono">
                        {f.source_sale_deed}
                      </div>
                      <span className="text-slate-300 bg-slate-800/90 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase inline-block mt-0.5">Primary Title</span>
                    </td>

                    {/* Source: Tax Receipt */}
                    <td className="py-3 px-3">
                      <div
                        className={`text-slate-100 font-medium text-xs font-mono ${
                          isDiscrepant ? 'text-amber-300 font-bold' : ''
                        }`}
                      >
                        {f.source_tax_receipt}
                      </div>
                      <span className="text-slate-300 bg-slate-800/90 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase inline-block mt-0.5">Municipal Ledger</span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {isDiscrepant ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/80">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>DISCREPANCY</span>
                        </span>
                      ) : f.status === 'CROSS_INDEXED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-700/80">
                          <CheckCircle2 className="w-3 h-3 text-blue-400" />
                          <span>CROSS-INDEXED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASS (MATCH)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* INLINE EXCEPTION OR CLEAN CARD */}
        {exceptionCount > 0 && discrepantField ? (
          <div className="bg-amber-950/40 rounded-xl border border-amber-800/80 p-3.5 shadow-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-amber-900/60 rounded-lg text-amber-300 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-amber-200 text-xs uppercase tracking-wide">
                    Potential Property-Area Inconsistency
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-900 text-amber-300 border border-amber-700">
                    {discrepantField.variance_details || 'Variance Detected'}
                  </span>
                </div>
                <p className="text-xs text-amber-100 mt-1.5 leading-relaxed font-normal">
                  Sale Deed records <strong>{discrepantField.source_sale_deed}</strong> vs Municipal Tax Assessment of <strong>{discrepantField.source_tax_receipt}</strong>. Since variance exceeds standard 5% tolerance, manual valuer physical measurement is mandated prior to credit sanction.
                </p>
              </div>
            </div>

            {/* Tolerance Bar Visual */}
            <div className="p-2 bg-slate-900 rounded-lg border border-amber-800/60 text-[11px] space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span>Tolerance Ceiling: <strong>&plusmn;5.0%</strong> (IBBI Standard)</span>
                <span className="font-mono font-bold text-amber-400 tabular-nums">
                  Status: Exceeds Tolerance
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: '60.6%' }} className="bg-emerald-500" title="Permitted 5% Tolerance" />
                <div style={{ width: '39.4%' }} className="bg-amber-500" title="Excess Variance" />
              </div>
              <div className="text-[10px] text-slate-400 flex justify-between">
                <span>0% baseline</span>
                <span className="text-emerald-400 font-semibold">5% limit</span>
                <span className="text-amber-400 font-semibold">Observed Discrepancy</span>
              </div>
            </div>

            {/* Underwriter Acknowledgment Checkbox */}
            <div className="pt-2 border-t border-amber-800/60">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={exceptionAcknowledged}
                  onChange={(e) => onToggleAcknowledge(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-xs text-amber-100 font-medium leading-tight">
                  I acknowledge the area variance exception and confirm that an empaneled valuer physical inspection has been scheduled / verified in accordance with bank credit policy.
                </span>
              </label>
            </div>
          </div>
        ) : (
          /* Clean Docket Card */
          <div className="bg-emerald-950/40 rounded-xl border border-emerald-800/80 p-3.5 shadow-sm space-y-2">
            <div className="flex items-center gap-2.5 text-emerald-200 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase tracking-wide">
                Clean Collateral Title &amp; Municipal Reconciliation
              </span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              All primary title particulars match municipal tax records with 0% area variance. No document exceptions or encumbrance flags identified. This docket satisfies standard automated verification benchmarks.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-300 font-semibold">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Fast-track Credit Sanction Eligible (Zero Pending Waivers)</span>
            </div>
          </div>
        )}

        {/* Regulatory Citations Accordion */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>Statutory &amp; Regulatory Framework Citations</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <p>
              &bull; <strong className="text-slate-100">MahaRERA Section 2(k):</strong> Mandates that carpet area excludes external walls, service shafts, and exclusive balcony/verandah areas.
            </p>
            <p>
              &bull; <strong className="text-slate-100">Maharashtra Stamp Act (Article 25):</strong> Valuation for stamp duty is assessed on registered carpet area with ready reckoner benchmark rates.
            </p>
            <p>
              &bull; <strong className="text-slate-100">IBBI Valuation Rules 2017:</strong> Tolerances beyond &plusmn;5% between registered title deeds and municipal ledgers require physical verification by a registered valuer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
