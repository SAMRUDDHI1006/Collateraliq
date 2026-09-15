'use client';

import React, { useState } from 'react';
import { History, ShieldCheck, Search, Filter, Calendar, User, FileText } from 'lucide-react';
import { AuditLogItem } from '@/types/collateral';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
  onSelectCase?: (caseId: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  logs,
  onSelectCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((l) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      l.case_id.toLowerCase().includes(q) ||
      l.officer_name.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.action_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <History className="w-5 h-5 text-blue-600" />
            <span>Institutional Credit Audit Trail &amp; Governance Log</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Immutable, non-repudiable transaction history of all underwriting overrides, valuer inspections, and exception waivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Case ID, Officer, or Action..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 text-xs">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {log.id}
                </span>
                <span
                  onClick={() => onSelectCase?.(log.case_id)}
                  className="font-mono font-bold text-blue-600 hover:underline cursor-pointer text-xs"
                >
                  {log.case_id}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {log.action_type.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{log.timestamp}</span>
              </div>
            </div>

            <p className="text-slate-800 text-xs leading-relaxed">{log.description}</p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{log.officer_name}</span>
                <span>&bull;</span>
                <span>{log.officer_role}</span>
              </div>

              {log.previous_state && log.new_state && (
                <div className="font-mono text-[10px] flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  <span className="text-slate-500">{log.previous_state}</span>
                  <span className="text-slate-400">&rarr;</span>
                  <span className="text-emerald-700 font-bold">{log.new_state}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
