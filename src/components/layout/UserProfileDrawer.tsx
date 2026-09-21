'use client';

import React from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building,
  Key,
  LogOut,
  Mail,
  Award,
  BookOpen,
  Terminal,
  Scale,
  ExternalLink,
} from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSelectView?: (view: any) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  onLogout,
  onSelectView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-96 h-full bg-[#0B111A]/95 backdrop-blur-md border-l border-white/10 p-6 z-50 text-slate-100 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
              Operator Profile &amp; Active Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs">
          {/* User Identity Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#101824] to-[#141E2B] border border-white/10 space-y-3 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-heading font-extrabold text-lg flex items-center justify-center ring-4 ring-cyan-500/20 shadow-lg shrink-0">
                SC
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-heading font-bold text-white tracking-tight truncate">
                  Samruddhi Chaudhari
                </h4>
                <p className="text-xs text-cyan-400 font-medium mt-0.5 leading-snug font-sans">
                  Senior Credit Risk Officer &mdash; Retail Mortgage &amp; LAP
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-1 text-[11px] border-t border-white/5 font-sans">
              <div className="text-slate-300 font-medium">
                Credit Risk &amp; Secured Lending Division
              </div>
              <div className="text-slate-400">
                Mumbai Zonal Head Office (BKC, Mumbai)
              </div>
              <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  EMP-884920
                </span>
                <span className="font-mono text-[10px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Level-3 Sanction Authority
                </span>
              </div>
            </div>
          </div>

          {/* Operational Privileges & Queue */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block px-1 font-heading">
              Operational Privileges &amp; Queue
            </span>
            <div className="bg-[#070B12] border border-white/10 rounded-lg p-3.5 space-y-2.5 text-xs shadow-inner font-sans">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">Max Sanction Authority:</span>
                <span className="font-mono font-bold text-slate-100 text-xs tabular-nums">
                  INR 5,00,00,000 (₹5.00 Cr)
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-slate-400 text-[11px]">Assigned Active Queue:</span>
                <span className="font-mono font-bold text-amber-400 text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 tabular-nums">
                  14 Cases Pending Clearance
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className="text-slate-400 text-[11px]">Session Status:</span>
                <span className="font-mono font-semibold text-emerald-400 text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active &bull; Hardware Key Verified
                </span>
              </div>
            </div>
          </div>

          {/* Academic Affiliation */}
          <div className="p-3 bg-[#070B12] border border-white/10 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] font-heading">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Universal AI University &mdash; School of Management</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              FinTech &amp; Mortgage Risk Intelligence Sandbox
            </p>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          {/* Switch to Valuer Review View */}
          <button
            onClick={() => {
              onSelectView?.('valuer_queue');
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-cyan-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>Switch to Valuer Review View</span>
          </button>

          {/* Sign Out / End Session */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-rose-950/30 border border-rose-800/60 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out / End Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
