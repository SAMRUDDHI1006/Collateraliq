'use client';

import React from 'react';
import {
  LayoutDashboard,
  FolderArchive,
  Users,
  Scale,
  FileSpreadsheet,
  PlusCircle,
  Database,
  Building2,
  Sparkles,
} from 'lucide-react';

export type NavView = 'dashboard' | 'past_cases' | 'borrowers' | 'valuer_queue' | 'audit_logs';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenIntakeModal: () => void;
  onOpenDemoCase?: () => void;
  valuerQueueCount?: number;
  isWorkbenchView?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenIntakeModal,
  onOpenDemoCase,
  valuerQueueCount = 1526,
  isWorkbenchView = false,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'past_cases',
      label: 'Past Cases',
      icon: <FolderArchive className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'borrowers',
      label: 'Borrowers',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'valuer_queue',
      label: 'Valuer Queue',
      icon: <Scale className="w-4 h-4 shrink-0" />,
      badge: valuerQueueCount.toLocaleString('en-IN'),
    },
    {
      id: 'audit_logs',
      label: 'Audit Logs',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
    },
  ];

  // If in workbench view, render sleek collapsible rail
  const railClass = isWorkbenchView
    ? 'shrink-0 w-14 hover:w-56 transition-all duration-300 bg-[#0B111A] border-r border-white/[0.08] flex flex-col justify-between z-20 overflow-x-hidden group select-none shadow-xl'
    : 'shrink-0 w-56 bg-[#0B111A] border-r border-white/[0.08] flex flex-col justify-between z-20 select-none hidden md:flex';

  return (
    <aside className={railClass}>
      <div className="p-3 space-y-3">
        {/* Primary Action Button: + New Loan Case */}
        <button
          onClick={onOpenIntakeModal}
          title="New Loan Case (Blank Case Intake)"
          className="w-full flex items-center justify-start gap-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all overflow-hidden whitespace-nowrap cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span className="truncate tracking-tight">{isWorkbenchView ? 'New Case' : '+ New Loan Case'}</span>
        </button>

        {/* Explore Demo Case Action */}
        {onOpenDemoCase && (
          <button
            onClick={onOpenDemoCase}
            title="Explore Flagship Demo Case (CLIQ-DADAR-001)"
            className="w-full flex items-center justify-start gap-2 bg-[#101824] hover:bg-[#141E2B] border border-white/10 hover:border-amber-400/40 text-amber-300 font-semibold text-xs py-2 px-3 rounded-xl transition-all overflow-hidden whitespace-nowrap cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{isWorkbenchView ? 'Demo Case' : 'Explore Demo Case'}</span>
          </button>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-[#64748B] truncate font-mono">
            Workspaces
          </div>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap overflow-hidden relative cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs'
                    : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-white border border-transparent'
                }`}
              >
                {/* Active left indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-glow-cyan" />
                )}
                <div className="flex items-center gap-2.5 truncate pl-1">
                  <span className={isActive ? 'text-cyan-400' : 'text-[#64748B]'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-[#101824] text-[#94A3B8] border border-white/[0.08]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-white/[0.08] bg-[#070B12]/80 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-2 text-[#94A3B8] text-[11px] font-medium truncate">
          <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate text-[#94A3B8]">
            Dataset: <span className="text-[#F8FAFC] font-semibold font-mono">3,000 Cases</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
