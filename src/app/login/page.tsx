'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Zap,
  ArrowRight,
  User,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  GitCompare,
  FileCheck2,
  CheckCircle,
  GraduationCap,
  Scale,
  Activity,
} from 'lucide-react';

const PARTICLES = [
  { top: '12%', left: '8%', delay: '0s', duration: '6s', size: 3 },
  { top: '24%', left: '22%', delay: '1.2s', duration: '7.5s', size: 2 },
  { top: '18%', left: '48%', delay: '2.4s', duration: '5.5s', size: 3 },
  { top: '35%', left: '62%', delay: '0.8s', duration: '8s', size: 4 },
  { top: '15%', left: '80%', delay: '3.1s', duration: '6.5s', size: 2 },
  { top: '42%', left: '15%', delay: '1.7s', duration: '7s', size: 3 },
  { top: '55%', left: '32%', delay: '2.9s', duration: '6s', size: 2 },
  { top: '68%', left: '5%', delay: '0.4s', duration: '8.5s', size: 3 },
  { top: '78%', left: '25%', delay: '3.5s', duration: '7s', size: 4 },
  { top: '88%', left: '12%', delay: '1.9s', duration: '6.2s', size: 2 },
  { top: '48%', left: '88%', delay: '2.1s', duration: '7.2s', size: 3 },
  { top: '62%', left: '74%', delay: '0.6s', duration: '6.8s', size: 4 },
  { top: '75%', left: '92%', delay: '3.8s', duration: '5.8s', size: 2 },
  { top: '85%', left: '55%', delay: '1.4s', duration: '7.8s', size: 3 },
  { top: '92%', left: '78%', delay: '2.7s', duration: '6.4s', size: 2 },
  { top: '28%', left: '94%', delay: '1.0s', duration: '8.2s', size: 3 },
  { top: '5%', left: '38%', delay: '2.3s', duration: '6.6s', size: 2 },
  { top: '50%', left: '50%', delay: '3.3s', duration: '7.4s', size: 3 },
  { top: '38%', left: '38%', delay: '0.9s', duration: '6.1s', size: 2 },
  { top: '82%', left: '42%', delay: '2.0s', duration: '7.9s', size: 3 },
];

const WORKFLOW_STEPS = [
  { id: '01', title: 'UPLOAD', subtitle: 'Property Docs & Registry', icon: FileSpreadsheet },
  { id: '02', title: 'EXTRACT', subtitle: 'Key Property Attributes', icon: Cpu },
  { id: '03', title: 'ANALYZE', subtitle: 'Model & Market Benchmark', icon: BarChart3 },
  { id: '04', title: 'COMPARE', subtitle: 'Valuer vs Benchmark', icon: GitCompare },
  { id: '05', title: 'EXPLAIN', subtitle: 'Risk & Variance Drivers', icon: Scale },
  { id: '06', title: 'REVIEW', subtitle: 'Collateral Decision Support', icon: FileCheck2 },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('samruddhi@bankcorp.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);

    // Set auth tokens in sessionStorage & cookies for active session
    sessionStorage.setItem('collateraliq_authenticated_session', 'true');
    sessionStorage.setItem('collateral_iq_auth', 'true');
    sessionStorage.setItem('collateraliq_auth', 'true');

    document.cookie = 'collateral_iq_auth=true; path=/; SameSite=Lax';
    document.cookie = 'collateraliq_auth=true; path=/; SameSite=Lax';

    setTimeout(() => {
      window.location.href = '/';
    }, 350);
  };

  const teamMembers = [
    { name: 'Samruddhi Chaudhari', initials: 'SC', color: 'bg-emerald-900/70 text-emerald-300 border-emerald-600/50' },
    { name: 'Gun Gupta', initials: 'GG', color: 'bg-blue-900/70 text-blue-300 border-blue-600/50' },
    { name: 'Riya Arora', initials: 'RA', color: 'bg-purple-900/70 text-purple-300 border-purple-600/50' },
    { name: 'Disha Gupta', initials: 'DG', color: 'bg-cyan-900/70 text-cyan-300 border-cyan-600/50' },
    { name: 'Avnish Mishra', initials: 'AM', color: 'bg-indigo-900/70 text-indigo-300 border-indigo-600/50' },
    { name: 'Bhagya Ajith', initials: 'BA', color: 'bg-amber-900/70 text-amber-300 border-amber-600/50' },
    { name: 'Sristi Chatterjee', initials: 'SC', color: 'bg-rose-900/70 text-rose-300 border-rose-600/50' },
  ];

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden bg-[#070B12] font-sans text-[#F8FAFC] select-none fintech-grid">
      {/* 1. LIVING BACKGROUND: 3 Oversized Moving Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-radial from-cyan-500/15 via-blue-600/08 to-transparent blur-3xl animate-drift-orb-1" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-radial from-blue-500/12 via-indigo-600/06 to-transparent blur-3xl animate-drift-orb-2" />
        <div className="absolute -bottom-[20%] left-[25%] w-[60vw] h-[60vw] rounded-full bg-radial from-emerald-500/10 via-cyan-600/05 to-transparent blur-3xl animate-drift-orb-3" />

        {/* Floating Subtle SVG Data Curves */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 animate-wave-flow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <path
            d="M-100,450 C300,300 600,600 1000,400 C1200,300 1400,500 1600,450"
            stroke="url(#gradient-line-1)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
          />
          <path
            d="M-100,620 C250,500 700,750 1100,550 C1300,450 1500,600 1700,580"
            stroke="url(#gradient-line-2)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <defs>
            <linearGradient id="gradient-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="gradient-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* 20 Static-seeded Floating Data Particles */}
        {PARTICLES.map((pt, idx) => (
          <div
            key={idx}
            className="absolute rounded-full bg-cyan-300/40 animate-particle pointer-events-none"
            style={{
              top: pt.top,
              left: pt.left,
              width: `${pt.size}px`,
              height: `${pt.size}px`,
              animationDelay: pt.delay,
              animationDuration: pt.duration,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTAINER: Split-Screen Institutional Grid */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: University Brand + Identity + Login Form (~40% Width)       */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[41%] p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] relative">
          <div className="space-y-6">
            
            {/* Top: University Official Branding */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-md">
                <img
                  src="/images/Universal_AI_University_Logo.png"
                  alt="Universal AI University"
                  className="h-9 w-auto object-contain brightness-110"
                />
                <div className="h-6 w-px bg-white/[0.12]" />
                <span className="text-[10.5px] uppercase font-mono tracking-wider text-slate-300 font-semibold">
                  Universal AI University • School of Management
                </span>
              </div>
            </div>

            {/* Product Identity Header */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
                  <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-heading">
                  Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
                </h1>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 uppercase tracking-wider shadow-xs">
                  V2.4 PRO
                </span>
              </div>

              <h2 className="text-sm font-semibold text-slate-200 mt-2.5">
                AI-Assisted Residential Collateral Intelligence
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono font-medium text-cyan-300 tracking-wider">
                  HOME LOANS
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono font-medium text-cyan-300 tracking-wider">
                  LAP
                </span>
                <span className="text-slate-600 text-xs">•</span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono font-medium text-cyan-300 tracking-wider">
                  BALANCE TRANSFERS
                </span>
              </div>

              <p className="text-xs text-slate-400 font-normal mt-2.5 leading-relaxed">
                From property information to structured collateral intelligence.
              </p>
            </div>

            {/* Login Card with Glassmorphic styling: 18px blur, 24px radius */}
            <div className="bg-[#0A1422]/75 backdrop-blur-[18px] border border-white/[0.08] rounded-[24px] p-6 lg:p-7 shadow-2xl space-y-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-heading">
                  Institutional Portal Access
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Authenticate your officer terminal to access the collateral valuation and triage suite.
                </p>
              </div>

              <form onSubmit={handleAuthenticate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Officer ID / Corporate Email</span>
                    <span className="text-[10px] text-cyan-400/90 font-mono">LDAP SECURE</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="samruddhi@bankcorp.in"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#070D16]/90 border border-white/[0.12] rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Passcode</span>
                    <span className="text-[10px] text-slate-500 font-mono">AES-256</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#070D16]/90 border border-white/[0.12] rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
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
                      className="h-3.5 w-3.5 rounded border-slate-700 bg-[#070D16] text-cyan-400 focus:ring-cyan-400/40"
                    />
                    <span className="text-slate-400 text-[11px]">Remember terminal node</span>
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <span>{isAuthenticating ? 'Authenticating Officer Terminal...' : 'Authenticate & Access Suite →'}</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    OR FAST-TRACK DEMO
                  </span>
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                </div>

                {/* Fast-Track Demo CTA */}
                <button
                  type="button"
                  onClick={() => handleAuthenticate()}
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#070D16] hover:bg-[#101824] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">⚡ Fast-Track Demo Access (Samruddhi Chaudhari - Senior Credit Risk Officer)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Left Footer Note */}
          <div className="pt-6 mt-6 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Universal AI University — School of Management</span>
              <span className="text-[10px] font-mono text-slate-500">v2.4 Production Sandbox</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Problem + Solution + Workflow + Balance Transfer + Team     */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[59%] p-6 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-6">

            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400/90">
                  REAL-TIME REGULATORY & TITLE AUDIT TELEMETRY
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE VERIFICATION ENGINE v2.4
              </span>
            </div>

            {/* CARD 1: THE LENDING CHALLENGE */}
            <div className="bg-[#0A1422]/75 backdrop-blur-[18px] border border-rose-500/20 rounded-[24px] p-6 relative card-hover-lift space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/50">
                  THE LENDING CHALLENGE
                </span>
                <AlertCircle className="w-4 h-4 text-rose-400" />
              </div>
              
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Valuation Insights Are Fragmented
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                Mortgage lending and credit appraisals traditionally rely on disconnected documents, disparate valuation reports, and unverified registry records. Discrepancies between physical inspections, circle rates, and market benchmarks create operational bottlenecks and delay underwriting decisions.
              </p>

              {/* Emphasized Statement with Left Border (NO fake statistics/TAT/error rates) */}
              <div className="pl-3.5 border-l-2 border-rose-400/80 py-1 bg-rose-500/[0.04] rounded-r-lg">
                <p className="text-xs font-medium text-rose-200 italic leading-snug">
                  &ldquo;The challenge is not a lack of information — it is making that information useful for faster, clearer collateral review.&rdquo;
                </p>
              </div>
            </div>

            {/* CARD 2: THE COLLATERALIQ SOLUTION */}
            <div className="bg-[#0A1422]/75 backdrop-blur-[18px] border border-cyan-500/25 rounded-[24px] p-6 relative card-hover-lift space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-800/50">
                  THE COLLATERALIQ SOLUTION
                </span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-heading">
                  One Workflow. A Clearer Collateral View.
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  CollateralIQ unifies property attributes, automated circle rate benchmarking, and independent valuer opinions into an integrated, audit-ready collateral review environment.
                </p>
              </div>

              {/* 6-Step Horizontal Sequential Workflow Animation */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span className="uppercase tracking-wider">COLLATERAL TRIAGE LIFECYCLE</span>
                  <span className="text-cyan-400 font-semibold">STAGE 0{activeStep + 1} OF 06 ACTIVE</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  {WORKFLOW_STEPS.map((step, idx) => {
                    const isActive = idx === activeStep;
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.id}
                        className={`rounded-xl p-2.5 border transition-all duration-300 flex flex-col justify-between min-h-[86px] ${
                          isActive
                            ? 'bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.03] ring-1 ring-cyan-400/40'
                            : 'bg-[#070D16]/80 border-white/[0.07] hover:border-white/[0.15]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9.5px] font-mono font-bold ${
                              isActive ? 'text-cyan-300' : 'text-slate-500'
                            }`}
                          >
                            {step.id}
                          </span>
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              isActive ? 'text-cyan-300' : 'text-slate-500'
                            }`}
                          />
                        </div>

                        <div>
                          <div
                            className={`text-[11px] font-bold tracking-tight font-heading ${
                              isActive ? 'text-white' : 'text-slate-300'
                            }`}
                          >
                            {step.title}
                          </div>
                          <div
                            className={`text-[9px] leading-tight mt-0.5 line-clamp-2 ${
                              isActive ? 'text-cyan-200/90' : 'text-slate-400'
                            }`}
                          >
                            {step.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BALANCE TRANSFER ANALYSIS STRIP (Conceptual Only - NO numbers) */}
              <div className="pt-3 border-t border-white/[0.08]">
                <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  BALANCE TRANSFER ANALYSIS (CONCEPTUAL DELTA RECONCILIATION)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#070D16]/90 border border-white/[0.08] flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Input Baseline</span>
                    <div className="text-xs font-bold text-slate-200 mt-1">Previous Valuation</div>
                    <span className="text-[9.5px] text-slate-400 mt-0.5">Originating Lender Records</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">AI Benchmark</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    </div>
                    <div className="text-xs font-bold text-cyan-200 mt-1">CollateralIQ Estimate</div>
                    <span className="text-[9.5px] text-cyan-300/80 mt-0.5">Model Circle Rate &amp; Index</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#070D16]/90 border border-white/[0.08] flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Field Audit</span>
                    <div className="text-xs font-bold text-slate-200 mt-1">Independent Valuer</div>
                    <span className="text-[9.5px] text-slate-400 mt-0.5">Physical Site &amp; Building Report</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RESEARCH & DEVELOPMENT TEAM */}
            <div className="bg-[#0A1422]/75 backdrop-blur-[18px] border border-white/[0.08] rounded-[24px] p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
                    RESEARCH &amp; DEVELOPMENT TEAM
                  </h4>
                  <p className="text-[11px] text-cyan-400 font-medium mt-0.5">
                    Universal AI University &mdash; School of Management
                  </p>
                </div>

                {/* Module Leader - EXACTLY THIS TITLE */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 shadow-sm">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-cyan-200">
                    Module Leader &mdash; Dr. Maneesh Ketkar
                  </span>
                </div>
              </div>

              {/* 7 Members Grid with compact initials & clean name text ONLY */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {teamMembers.map((m) => (
                  <div
                    key={m.name}
                    className="rounded-xl bg-[#070D16]/80 border border-white/[0.07] px-3 py-2 flex items-center gap-2.5 hover:border-white/[0.18] hover:bg-[#101824] transition-all duration-200"
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
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Universal AI University — School of Management</span>
            <span className="font-mono text-slate-400">AI-assisted collateral analytics | Human review required</span>
          </div>
        </div>

      </div>
    </div>
  );
}
