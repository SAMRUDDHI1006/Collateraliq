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
    <div className="h-screen w-screen overflow-hidden flex bg-slate-950 font-sans text-slate-100 select-none">
      {/* LEFT COLUMN: Split-Screen Authentication Form (42% Width) */}
      <div className="w-full lg:w-[42%] bg-slate-950 p-8 lg:p-10 flex flex-col justify-between border-r border-slate-800/80 overflow-y-auto relative z-10">
        {/* Ambient Subtle Background Glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Top: University Logo & Branding */}
          <div>
            <img
              src="/images/Universal_AI_University_Logo.png"
              alt="Universal AI University"
              className="h-11 w-auto object-contain mb-2 filter brightness-110"
            />
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold block">
              Universal AI University &bull; School of Management
            </span>
          </div>

          {/* Product Identity Header */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white font-sans">
                Collateral<span className="text-blue-400 font-black">IQ</span>
              </h1>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-700/60 uppercase tracking-wider shadow-xs">
                v2.4 PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1.5 leading-snug">
              Institutional Collateral Intelligence &amp; Verification Platform
            </p>
          </div>

          {/* Center Form Card with Glassmorphism */}
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Institutional Portal Access
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Sign in with your sanctioned officer credentials to access the credit triage suite.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Officer ID / Corporate Email</span>
                  <span className="text-[10px] text-slate-400 font-mono">LDAP Telemetry</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samruddhi@bankcorp.in"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Passcode</span>
                  <span className="text-[10px] text-slate-400 font-mono">AES-256 Key</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
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
                    className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-300 text-[11px]">Remember terminal node</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                >
                  Forgot credentials?
                </a>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-blue-900/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>{isAuthenticating ? 'Authenticating Officer Terminal...' : 'Authenticate & Access Suite →'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  OR FAST-TRACK DEMO
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Fast-Track Demo CTA */}
              <button
                type="button"
                onClick={() => handleAuthenticate()}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-blue-400 hover:text-blue-300 font-semibold text-xs rounded-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="truncate">⚡ Fast-Track Demo Access (Samruddhi Chaudhari - Senior Credit Risk Officer)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Left Footer Note */}
        <div className="pt-6 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Universal AI University &mdash; School of Management | Secured Underwriting Sandbox</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
            Audited under ISO/IEC 27001 &amp; CERSAI statutory standards.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Problem & Solution Bento Cards + Clean Team Roster (58% Width) */}
      <div className="hidden lg:flex lg:w-[58%] bg-slate-900/90 p-8 lg:p-10 flex-col justify-between overflow-y-auto relative">
        <div className="space-y-5">
          {/* Top Telemetry Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
              REAL-TIME REGULATORY &amp; TITLE AUDIT TELEMETRY
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE VERIFICATION ENGINE v2.4
            </span>
          </div>

          {/* Problem Card (Bento Grid) */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-5 relative group hover:border-rose-700/60 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-rose-400">
                INDUSTRY CHALLENGE
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <h3 className="text-base font-bold text-rose-200 tracking-tight">
              Fragmented Collateral Verification &amp; Title Discrepancies
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Indian mortgage lending (Home Loans/LAP) suffers from manual cross-referencing across unstructured Sale Deeds, Index-II extracts, and municipal tax receipts. Clerical area mismatches, unrecorded encumbrances, and inflated valuations bypass audit checks, extending TAT by 7–12 days.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-rose-950/80 text-rose-300 rounded border border-rose-800/80">Avg TAT: 7–12 Days</span>
              <span className="px-2 py-0.5 bg-rose-950/80 text-rose-300 rounded border border-rose-800/80">Area Error Rate: 14.8%</span>
            </div>
          </div>

          {/* Solution Card (Bento Grid) */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-5 relative group hover:border-emerald-700/60 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-emerald-400">
                INTELLIGENT SOLUTION
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-emerald-200 tracking-tight">
              Deterministic OCR Cross-Indexing &amp; AI Triage Engine
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              CollateralIQ provides automated multi-document clause extraction, real-time cross-consistency matrixing (deed area vs. ratable area), valuation benchmarking, and HITL valuer override workflows aligned with RBI LTV guidelines.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800/80">Automated Clause Extraction</span>
              <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800/80">RBI LTV Benchmarked</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Research & Development Team Roster (Names Only, Clean Badges) */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase block font-sans">
              RESEARCH &amp; DEVELOPMENT TEAM
            </span>
            <span className="text-xs text-blue-400 font-medium">
              Universal AI University &mdash; School of Management
            </span>
          </div>

          {/* 3-Column Team Names Grid: Clean Name Text ONLY */}
          <div className="grid grid-cols-3 gap-2">
            {teamMembers.map((m) => (
              <div
                key={m.name}
                className="compact rounded-lg bg-slate-950/60 border border-slate-800/80 px-3 py-2 flex items-center gap-2.5 hover:border-slate-700 hover:bg-slate-800/40 transition-all duration-150"
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

          <p className="text-[10px] text-slate-400 font-mono text-center pt-1">
            Joint academic-industry initiative for next-generation automated banking credit risk telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
