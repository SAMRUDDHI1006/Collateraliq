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
      <div className="bg-[#101824] rounded-xl border border-white/10 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-white font-heading font-bold text-base tracking-tight">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Institutional Credit Audit Trail &amp; Governance Log</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Immutable, non-repudiable transaction history of all underwriting overrides, valuer inspections, and exception waivers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Case ID, Officer, or Action..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#0B111A] border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-sans"
            />
          </div>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-[#101824] rounded-xl border border-white/10 shadow-lg divide-y divide-white/5 text-xs overflow-hidden">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-white/[0.02] transition-colors space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                  {log.id}
                </span>
                <span
                  onClick={() => onSelectCase?.(log.case_id)}
                  className="font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer text-xs"
                >
                  {log.case_id}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 font-mono">
                  {log.action_type.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{log.timestamp}</span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed font-sans">{log.description}</p>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 font-sans">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-200">{log.officer_name}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-slate-400">{log.officer_role}</span>
              </div>

              {log.previous_state && log.new_state && (
                <div className="font-mono text-[10px] flex items-center gap-1.5 bg-[#0B111A] px-2 py-0.5 rounded border border-white/10">
                  <span className="text-slate-400">{log.previous_state}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-emerald-400 font-bold">{log.new_state}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
