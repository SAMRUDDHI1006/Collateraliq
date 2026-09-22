'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  User,
  Zap,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Repeat2,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('samruddhi@bankcorp.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Workflow continuous 6-step sequential illumination animation (1100ms cycle)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 6);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  const handleAuthenticate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);

    sessionStorage.setItem('collateraliq_authenticated_session', 'true');
    sessionStorage.setItem('collateral_iq_auth', 'true');
    sessionStorage.setItem('collateraliq_auth', 'true');

    document.cookie = 'collateral_iq_auth=true; path=/; SameSite=Lax';
    document.cookie = 'collateraliq_auth=true; path=/; SameSite=Lax';

    setTimeout(() => {
      window.location.href = '/';
    }, 350);
  };

  // 6 Workflow Nodes with small descriptions
  const workflowNodes = [
    { num: '01', title: 'UPLOAD', desc: 'Bring property info' },
    { num: '02', title: 'EXTRACT', desc: 'Structured data' },
    { num: '03', title: 'ANALYZE', desc: 'Indicative valuation' },
    { num: '04', title: 'COMPARE', desc: 'Reconcile valuations' },
    { num: '05', title: 'EXPLAIN', desc: 'Measurable diffs' },
    { num: '06', title: 'REVIEW', desc: 'Clear collateral view' },
  ];

  // 7 Project Members (Compact 4-column layout: 4 on top, 3 below)
  const teamMembers = [
    { name: 'Samruddhi Chaudhari', initials: 'SC', color: 'bg-emerald-950 text-emerald-300 border-emerald-700/60' },
    { name: 'Gun Gupta', initials: 'GG', color: 'bg-blue-950 text-blue-300 border-blue-700/60' },
    { name: 'Riya Arora', initials: 'RA', color: 'bg-purple-950 text-purple-300 border-purple-700/60' },
    { name: 'Disha Gupta', initials: 'DG', color: 'bg-cyan-950 text-cyan-300 border-cyan-700/60' },
    { name: 'Avnish Mishra', initials: 'AM', color: 'bg-indigo-950 text-indigo-300 border-indigo-700/60' },
    { name: 'Bhagya Ajith', initials: 'BA', color: 'bg-amber-950 text-amber-300 border-amber-700/60' },
    { name: 'Sristi Chatterjee', initials: 'SC', color: 'bg-rose-950 text-rose-300 border-rose-700/60' },
  ];

  // Predefined floating particles (deterministic positions to avoid hydration mismatch)
  const particles = useMemo(() => [
    { left: '6%', top: '18%', delay: '0s', duration: '7s', size: '2px' },
    { left: '16%', top: '62%', delay: '1.2s', duration: '8s', size: '2.5px' },
    { left: '25%', top: '38%', delay: '2.5s', duration: '9s', size: '2px' },
    { left: '35%', top: '80%', delay: '0.7s', duration: '7.5s', size: '2.5px' },
    { left: '44%', top: '24%', delay: '3.1s', duration: '9.5s', size: '2px' },
    { left: '52%', top: '68%', delay: '1.8s', duration: '7.8s', size: '3px' },
    { left: '60%', top: '16%', delay: '0.4s', duration: '6.8s', size: '2px' },
    { left: '68%', top: '52%', delay: '2.2s', duration: '8.8s', size: '2.5px' },
    { left: '76%', top: '86%', delay: '1.5s', duration: '7.2s', size: '2px' },
    { left: '84%', top: '26%', delay: '3.6s', duration: '9.8s', size: '3px' },
    { left: '92%', top: '60%', delay: '0.9s', duration: '6.6s', size: '2px' },
    { left: '11%', top: '44%', delay: '2.8s', duration: '8.5s', size: '2.5px' },
    { left: '39%', top: '48%', delay: '1.1s', duration: '8.1s', size: '2px' },
    { left: '64%', top: '74%', delay: '3.3s', duration: '9.2s', size: '2px' },
    { left: '88%', top: '42%', delay: '1.9s', duration: '7.1s', size: '2.5px' },
    { left: '95%', top: '84%', delay: '0.3s', duration: '7.4s', size: '2px' },
    { left: '5%', top: '88%', delay: '2.1s', duration: '8.6s', size: '2px' },
    { left: '48%', top: '12%', delay: '1.6s', duration: '6.9s', size: '3px' },
    { left: '80%', top: '14%', delay: '3.0s', duration: '9.0s', size: '2px' },
    { left: '20%', top: '90%', delay: '0.5s', duration: '7.6s', size: '2.5px' },
  ], []);

  return (
    <div className="min-h-screen lg:h-[100dvh] lg:max-h-[100dvh] w-full bg-[#070B12] font-sans text-[#F8FAFC] relative overflow-y-auto lg:overflow-hidden select-none flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* LIVING ANIMATED BACKGROUND (Behind UI, Subtle, Cinematic)                  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Financial-Tech Grid */}
        <div className="absolute inset-0 fintech-grid opacity-25" />

        {/* Slow-Moving Gradient Glow Orbs */}
        <div className="absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[120px] animate-drift-orb-1" />
        <div className="absolute top-1/3 -right-36 w-[580px] h-[580px] rounded-full bg-blue-600/10 blur-[130px] animate-drift-orb-2" />
        <div className="absolute -bottom-36 left-1/3 w-[500px] h-[500px] rounded-full bg-teal-500/08 blur-[120px] animate-drift-orb-3" />

        {/* Flowing Thin Curved SVG Data Lines */}
        <div className="absolute inset-0 opacity-[0.07] animate-wave-flow">
          <svg className="w-[120%] h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-100 180 C300 110, 600 260, 1000 170 C1300 90, 1500 220, 1800 190"
              stroke="url(#gradient-line-1)"
              strokeWidth="1.5"
            />
            <path
              d="M-100 420 C250 490, 700 360, 1100 450 C1400 520, 1650 400, 1800 430"
              stroke="url(#gradient-line-2)"
              strokeWidth="1.2"
            />
            <path
              d="M-100 680 C400 600, 800 750, 1200 660 C1500 580, 1700 700, 1800 670"
              stroke="url(#gradient-line-1)"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="gradient-line-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="gradient-line-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating Subtle Data Point Particles */}
        {particles.map((p, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-cyan-400 animate-particle pointer-events-none"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Height: ~60-64px, Minimal Vertical Footprint)               */}
      {/* ========================================================================= */}
      <header className="relative z-10 shrink-0 h-14 sm:h-16 px-4 sm:px-8 lg:px-12 border-b border-white/[0.08] bg-[#070B12]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/Universal_AI_University_Logo.png"
            alt="Universal AI University"
            className="h-8 sm:h-9 w-auto object-contain filter brightness-110"
          />
          <div className="h-4 w-px bg-white/[0.12] hidden sm:block" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8] font-semibold hidden sm:block">
            UNIVERSAL AI UNIVERSITY &bull; SCHOOL OF MANAGEMENT
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="hidden md:inline">Collateral Intelligence Suite &bull; Financial Sandbox</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN VIEWPORT BODY (Fits 1366x768 & 1536x864 without vertical scroll)   */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-3 sm:py-4 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8 items-center min-h-0">

          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: ~40% (lg:col-span-5) — BRANDING & COMPACT LOGIN CARD     */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-3 min-h-0 animate-in fade-in duration-200">
            {/* CollateralIQ Branding */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/25 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading leading-none">
                    Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
                  </h1>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-xs">
                    V2.4 PRO
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-200 tracking-tight leading-tight">
                  AI-Assisted Residential Collateral Intelligence
                </h2>
                <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400 mt-0.5">
                  HOME LOANS &bull; LAP &bull; BALANCE TRANSFERS
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans leading-tight">
                  From property information to structured collateral intelligence.
                </p>
              </div>
            </div>

            {/* Login Card (Compact Glass Container, Padding: 20px) */}
            <div
              className="p-4 sm:p-5 shadow-2xl space-y-3"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
              }}
            >
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight font-heading leading-tight">
                  Institutional Portal Access
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                  Sign in to access the collateral assessment workspace.
                </p>
              </div>

              <form onSubmit={handleAuthenticate} className="space-y-2.5">
                {/* Field 1: Officer ID / Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Officer ID / Corporate Email
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your official email or officer ID"
                      className="w-full h-10 pl-8 pr-3 bg-[#070B12]/80 border border-white/[0.10] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Field 2: Passcode */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your passcode"
                      className="w-full h-10 pl-8 pr-9 bg-[#070B12]/80 border border-white/[0.10] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot Row */}
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="h-3 w-3 rounded border-slate-700 bg-[#070B12] text-cyan-400 focus:ring-cyan-400/40"
                    />
                    <span className="text-slate-400">Remember terminal node</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Forgot credentials?
                  </a>
                </div>

                {/* Primary Button (Height: 42px) */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full h-10 flex items-center justify-center gap-2 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 group"
                >
                  <span>{isAuthenticating ? 'Authenticating Terminal...' : 'Authenticate & Access Suite'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Divider */}
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                  <span className="flex-shrink mx-2.5 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                </div>

                {/* Secondary Fast-Track Demo Button */}
                <button
                  type="button"
                  onClick={() => handleAuthenticate()}
                  disabled={isAuthenticating}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B111A]/80 hover:bg-[#101824] border border-cyan-500/30 hover:border-cyan-400 text-left transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center gap-2 group"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:animate-pulse" />
                  <div className="truncate text-xs">
                    <span className="font-bold text-cyan-300 group-hover:text-cyan-200">
                      ⚡ Fast-Track Demo Access
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1.5 hidden sm:inline">
                      (Samruddhi Chaudhari)
                    </span>
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: ~60% (lg:col-span-7) — PROBLEM, SOLUTION, TEAM           */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5 sm:space-y-3 min-h-0 animate-in fade-in duration-200">

            {/* 1. Card: THE LENDING CHALLENGE (Compact, Padding: 18px) */}
            <div
              className="p-4 sm:p-5 shadow-2xl space-y-2 hover:border-rose-500/30 transition-colors"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                  THE LENDING CHALLENGE
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-heading leading-tight">
                Valuation Insights Are Fragmented
              </h3>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Property valuation information is often spread across property details, valuation reports and previous valuation records. Credit teams may need to manually collect, compare and reconcile these inputs before understanding the collateral position.
              </p>

              <div className="border-l-2 border-rose-500 pl-3 py-1 bg-rose-950/20 text-rose-200/95 text-[11px] font-medium leading-snug rounded-r-lg">
                The challenge is not a lack of information &mdash; it is making that information useful for faster, clearer collateral review.
              </div>
            </div>

            {/* 2. Card: THE COLLATERALIQ SOLUTION & WORKFLOW (Compact, Padding: 18px) */}
            <div
              className="p-4 sm:p-5 shadow-2xl space-y-2.5 hover:border-cyan-500/30 transition-colors"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                  THE COLLATERALIQ SOLUTION
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-heading leading-tight">
                One Workflow. A Clearer Collateral View.
              </h3>

              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                CollateralIQ brings property information, model-supported valuation, independent valuation analysis and collateral metrics into one structured workflow.
              </p>

              {/* 6-Node Sequential Workflow (Compact: Height ~70-76px) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-1.5 pt-0.5">
                {workflowNodes.map((node, idx) => {
                  const isActive = activeWorkflowStep === idx;
                  return (
                    <div
                      key={node.num}
                      className={`p-2 rounded-xl border transition-all duration-300 flex flex-col justify-between h-[68px] sm:h-[72px] ${
                        isActive
                          ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-[1.02]'
                          : 'bg-[#070B12]/80 border-white/[0.08] text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                          {node.num}
                        </span>
                        {idx < 5 && (
                          <span className={`text-[8px] hidden xl:inline ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                            &rarr;
                          </span>
                        )}
                      </div>
                      <div className={`font-mono font-bold text-[11px] leading-tight ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {node.title}
                      </div>
                      <div className="text-[9px] text-slate-400 leading-tight truncate font-sans">
                        {node.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Balance Transfer Analysis Strip (Conceptual Only, Single Horizontal Strip) */}
              <div className="p-2.5 rounded-xl bg-[#070B12]/80 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Repeat2 className="w-3 h-3 text-amber-400" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      BALANCE TRANSFER ANALYSIS
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-500">Conceptual Journey</span>
                </div>

                <div className="flex items-center justify-between gap-1 font-mono text-[10px] text-center py-0.5">
                  <div className="flex-1 px-1.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-slate-300 font-semibold truncate">
                    Previous Valuation
                  </div>
                  <span className="text-amber-400 text-[10px] px-0.5">&rarr;</span>
                  <div className="flex-1 px-1.5 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-semibold truncate">
                    Current CollateralIQ Estimate
                  </div>
                  <span className="text-cyan-400 text-[10px] px-0.5">&rarr;</span>
                  <div className="flex-1 px-1.5 py-1 rounded-md bg-blue-950/40 border border-blue-500/30 text-blue-300 font-semibold truncate">
                    Current Independent Valuer
                  </div>
                </div>

                <p className="text-[9px] text-slate-400 font-sans leading-tight">
                  Track valuation movement and understand the current collateral position.
                </p>
              </div>
            </div>

            {/* 3. RESEARCH & DEVELOPMENT TEAM (Compact, Height-Optimized) */}
            <div
              className="p-3.5 sm:p-4 shadow-2xl space-y-2"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
              }}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-white tracking-wider uppercase font-heading">
                  RESEARCH &amp; DEVELOPMENT TEAM
                </h4>
                <span className="text-[10px] text-cyan-400 font-medium font-sans">
                  Universal AI University &bull; School of Management
                </span>
              </div>

              {/* Module Leader (EXACT title: Module Leader — Dr. Maneesh Ketkar) */}
              <div className="rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 px-3 py-1.5 flex items-center justify-between h-[36px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono shrink-0 shadow-xs">
                    MK
                  </div>
                  <div className="text-xs font-bold text-white tracking-tight">
                    Module Leader &mdash; Dr. Maneesh Ketkar
                  </div>
                </div>
              </div>

              {/* Project Members (4 on top, 3 below, Height: 36-38px) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {teamMembers.map((m) => (
                  <div
                    key={m.name}
                    className="rounded-xl bg-[#070B12]/80 border border-white/[0.08] px-2 py-1.5 flex items-center gap-1.5 hover:border-cyan-500/40 hover:bg-[#101824] transition-all duration-200 shadow-xs h-[36px]"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${m.color} font-bold text-[8px] flex items-center justify-center shrink-0 font-mono border`}
                    >
                      {m.initials}
                    </div>
                    <div className="text-slate-200 text-[10px] font-semibold truncate leading-tight">
                      {m.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. FOOTER (Height: ~30-32px, Single Compact Horizontal Row)                */}
      {/* ========================================================================= */}
      <footer className="relative z-10 shrink-0 h-8 px-4 sm:px-8 border-t border-white/[0.06] bg-[#070B12]/90 backdrop-blur-md flex items-center justify-between text-[10px] text-slate-400">
        <div>
          Universal AI University &mdash; School of Management
        </div>
        <div className="font-mono text-[9px] text-slate-500">
          AI-assisted collateral analytics | Human review required
        </div>
      </footer>
    </div>
  );
}
