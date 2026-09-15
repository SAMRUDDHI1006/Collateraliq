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
} from 'lucide-react';

export type NavView = 'dashboard' | 'past_cases' | 'borrowers' | 'valuer_queue' | 'audit_logs';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenIntakeModal: () => void;
  valuerQueueCount?: number;
  isWorkbenchView?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenIntakeModal,
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
    ? 'shrink-0 w-14 hover:w-56 transition-all duration-200 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-20 overflow-x-hidden group select-none'
    : 'shrink-0 w-56 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-20 select-none hidden md:flex';

  return (
    <aside className={railClass}>
      <div className="p-2.5 space-y-3">
        {/* Primary Action Button: + New Loan Case */}
        <button
          onClick={onOpenIntakeModal}
          title="New Loan Case"
          className="w-full flex items-center justify-start gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-2.5 rounded-lg shadow-md shadow-blue-600/25 transition-all overflow-hidden whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">{isWorkbenchView ? 'New Loan Case' : '+ New Loan Case'}</span>
        </button>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500 truncate">
            Workspaces
          </div>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap overflow-hidden ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-blue-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold shrink-0 ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
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
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/40 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium truncate">
          <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate text-slate-400">
            Dataset: <span className="text-slate-200 font-semibold">3,000 Cases</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
