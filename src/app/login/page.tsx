'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Zap,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Shield,
  ArrowRight,
  User,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('samruddhi@bankcorp.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);

    // Set auth tokens in sessionStorage & cookies for current active session
    sessionStorage.setItem('collateraliq_authenticated_session', 'true');
    sessionStorage.setItem('collateral_iq_auth', 'true');
    sessionStorage.setItem('collateraliq_auth', 'true');

    document.cookie = 'collateral_iq_auth=true; path=/; SameSite=Lax';
    document.cookie = 'collateraliq_auth=true; path=/; SameSite=Lax';

    setTimeout(() => {
      window.location.href = '/';
    }, 350);
  };

  // Modern 3-column team roster: clean name text ONLY, no role descriptions
  const teamMembers = [
    { name: 'Samruddhi Chaudhari', initials: 'SC', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60' },
    { name: 'Gun Gupta', initials: 'GG', color: 'bg-blue-900/60 text-blue-300 border-blue-700/60' },
    { name: 'Riya Arora', initials: 'RA', color: 'bg-purple-900/60 text-purple-300 border-purple-700/60' },
    { name: 'Disha Gupta', initials: 'DG', color: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/60' },
    { name: 'Avnish Mishra', initials: 'AM', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60' },
    { name: 'Bhagya Ajith', initials: 'BA', color: 'bg-amber-900/60 text-amber-300 border-amber-700/60' },
    { name: 'Sristi Chatterjee', initials: 'SC', color: 'bg-rose-900/60 text-rose-300 border-rose-700/60' },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#070B12] font-sans text-[#F8FAFC] select-none ambient-mesh">
      {/* LEFT COLUMN: Split-Screen Authentication Form (42% Width) */}
      <div className="w-full lg:w-[42%] bg-[#070B12] p-8 lg:p-10 flex flex-col justify-between border-r border-white/[0.08] overflow-y-auto relative z-10">
        {/* Ambient Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top: University Logo & Branding */}
          <div>
            <img
              src="/images/Universal_AI_University_Logo.png"
              alt="Universal AI University"
              className="h-11 w-auto object-contain mb-2 filter brightness-110"
            />
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#94A3B8] font-semibold block">
              Universal AI University &bull; School of Management
            </span>
          </div>

          {/* Product Identity Header */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
                <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading">
                Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
              </h1>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 uppercase tracking-wider shadow-xs">
                v2.4 PRO
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium mt-2 leading-relaxed">
              Institutional Collateral Intelligence &amp; Verification Platform
            </p>
          </div>

          {/* Center Form Card with Glassmorphism */}
          <div className="bg-[#101824]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight font-heading">
                Institutional Portal Access
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Sign in with your sanctioned officer credentials to access the credit triage suite.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Officer ID / Corporate Email</span>
                  <span className="text-[10px] text-cyan-400/90 font-mono tracking-wider">LDAP Telemetry</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samruddhi@bankcorp.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0B111A] border border-white/[0.12] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Passcode</span>
                  <span className="text-[10px] text-slate-400 font-mono">AES-256 Key</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0B111A] border border-white/[0.12] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-[#0B111A] text-cyan-400 focus:ring-cyan-400/40"
                  />
                  <span className="text-[#94A3B8] text-[11px]">Remember terminal node</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Forgot credentials?
                </a>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                <span>{isAuthenticating ? 'Authenticating Officer Terminal...' : 'Authenticate & Access Suite →'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-white/[0.08]"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-[#64748B] uppercase tracking-widest">
                  OR FAST-TRACK DEMO
                </span>
                <div className="flex-grow border-t border-white/[0.08]"></div>
              </div>

              {/* Fast-Track Demo CTA */}
              <button
                type="button"
                onClick={() => handleAuthenticate()}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B111A] hover:bg-[#141E2B] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">⚡ Fast-Track Demo Access (Samruddhi Chaudhari - Senior Credit Risk Officer)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Left Footer Note */}
        <div className="pt-6 border-t border-white/[0.08] relative z-10">
          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Universal AI University &mdash; School of Management | Secured Underwriting Sandbox</span>
          </div>
          <p className="text-[10px] text-[#64748B] mt-1 font-mono">
            Audited under ISO/IEC 27001 &amp; CERSAI statutory standards.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Problem & Solution Bento Cards + Clean Team Roster (58% Width) */}
      <div className="hidden lg:flex lg:w-[58%] bg-[#0B111A]/95 p-8 lg:p-10 flex-col justify-between overflow-y-auto relative border-l border-white/[0.04]">
        <div className="space-y-6">
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400/90">
              REAL-TIME REGULATORY &amp; TITLE AUDIT TELEMETRY
            </span>
            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE VERIFICATION ENGINE v2.4
            </span>
          </div>

          {/* Problem Card (Bento Grid) */}
          <div className="bg-[#101824] border border-rose-500/25 rounded-2xl p-6 relative card-hover-lift space-y-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-rose-400">
                INDUSTRY CHALLENGE
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-rose-200 tracking-tight font-heading">
              Fragmented Collateral Verification &amp; Title Discrepancies
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Indian mortgage lending (Home Loans/LAP) suffers from manual cross-referencing across unstructured Sale Deeds, Index-II extracts, and municipal tax receipts. Clerical area mismatches, unrecorded encumbrances, and inflated valuations bypass audit checks, extending TAT by 7–12 days.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2.5 py-1 bg-rose-950/60 text-rose-300 rounded-lg border border-rose-800/60 font-semibold">Avg TAT: 7–12 Days</span>
              <span className="px-2.5 py-1 bg-rose-950/60 text-rose-300 rounded-lg border border-rose-800/60 font-semibold">Area Error Rate: 14.8%</span>
            </div>
          </div>

          {/* Solution Card (Bento Grid) */}
          <div className="bg-[#101824] border border-emerald-500/25 rounded-2xl p-6 relative card-hover-lift space-y-2.5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-emerald-400">
                INTELLIGENT SOLUTION
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-emerald-200 tracking-tight font-heading">
              Deterministic OCR Cross-Indexing &amp; AI Triage Engine
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              CollateralIQ provides automated multi-document clause extraction, real-time cross-consistency matrixing (deed area vs. ratable area), valuation benchmarking, and HITL valuer override workflows aligned with RBI LTV guidelines.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 rounded-lg border border-emerald-800/60 font-semibold">Automated Clause Extraction</span>
              <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 rounded-lg border border-emerald-800/60 font-semibold">RBI LTV Benchmarked</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Research & Development Team Roster (Names Only, Clean Badges) */}
        <div className="pt-6 border-t border-white/[0.08] space-y-3.5">
          <div>
            <span className="text-xs font-bold text-slate-200 tracking-wider uppercase block font-heading">
              RESEARCH &amp; DEVELOPMENT TEAM
            </span>
            <span className="text-xs text-cyan-400 font-medium">
              Universal AI University &mdash; School of Management
            </span>
          </div>

          {/* 3-Column Team Names Grid: Clean Name Text ONLY */}
          <div className="grid grid-cols-3 gap-2.5">
            {teamMembers.map((m) => (
              <div
                key={m.name}
                className="rounded-xl bg-[#101824] border border-white/[0.08] px-3.5 py-2.5 flex items-center gap-2.5 hover:border-white/[0.18] hover:bg-[#141E2B] transition-all duration-200 shadow-sm"
              >
                <div
                  className={`w-6 h-6 rounded-full ${m.color} font-bold text-[10px] flex items-center justify-center shrink-0 font-mono border`}
                >
                  {m.initials}
                </div>
                <div className="text-slate-200 text-xs font-semibold truncate leading-tight">
                  {m.name}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-[#64748B] font-mono text-center pt-1">
            Joint academic-industry initiative for next-generation automated banking credit risk telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
