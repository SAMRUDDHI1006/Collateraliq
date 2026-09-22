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
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Repeat2,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('samruddhi@bankcorp.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Workflow continuous 6-step sequential animation (cycles every 1100ms)
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

  // 6 Animated Workflow Nodes
  const workflowNodes = [
    { num: '01', title: 'UPLOAD', desc: 'Bring property information' },
    { num: '02', title: 'EXTRACT', desc: 'Convert to structured data' },
    { num: '03', title: 'ANALYZE', desc: 'Generate model-supported valuation' },
    { num: '04', title: 'COMPARE', desc: 'Reconcile with independent valuation' },
    { num: '05', title: 'EXPLAIN', desc: 'Show measurable differences' },
    { num: '06', title: 'REVIEW', desc: 'Get a clear collateral assessment' },
  ];

  // Team Roster Data
  const teamMembers = [
    { name: 'Samruddhi Chaudhari', initials: 'SC', color: 'bg-emerald-950 text-emerald-300 border-emerald-700/60' },
    { name: 'Gun Gupta', initials: 'GG', color: 'bg-blue-950 text-blue-300 border-blue-700/60' },
    { name: 'Riya Arora', initials: 'RA', color: 'bg-purple-950 text-purple-300 border-purple-700/60' },
    { name: 'Disha Gupta', initials: 'DG', color: 'bg-cyan-950 text-cyan-300 border-cyan-700/60' },
    { name: 'Avnish Mishra', initials: 'AM', color: 'bg-indigo-950 text-indigo-300 border-indigo-700/60' },
    { name: 'Bhagya Ajith', initials: 'BA', color: 'bg-amber-950 text-amber-300 border-amber-700/60' },
    { name: 'Sristi Chatterjee', initials: 'SC', color: 'bg-rose-950 text-rose-300 border-rose-700/60' },
  ];

  // Predefined floating particles with fixed positions to prevent hydration mismatch
  const particles = useMemo(() => [
    { left: '8%', top: '15%', delay: '0s', duration: '6s', size: '2px' },
    { left: '18%', top: '65%', delay: '1.2s', duration: '7.5s', size: '3px' },
    { left: '26%', top: '35%', delay: '2.5s', duration: '8s', size: '2px' },
    { left: '34%', top: '82%', delay: '0.7s', duration: '6.8s', size: '2.5px' },
    { left: '42%', top: '22%', delay: '3.1s', duration: '9s', size: '2px' },
    { left: '50%', top: '70%', delay: '1.8s', duration: '7.2s', size: '3px' },
    { left: '58%', top: '18%', delay: '0.4s', duration: '6.5s', size: '2px' },
    { left: '66%', top: '55%', delay: '2.2s', duration: '8.5s', size: '2.5px' },
    { left: '74%', top: '88%', delay: '1.5s', duration: '7s', size: '2px' },
    { left: '82%', top: '28%', delay: '3.8s', duration: '9.5s', size: '3px' },
    { left: '90%', top: '62%', delay: '0.9s', duration: '6.2s', size: '2px' },
    { left: '12%', top: '48%', delay: '2.8s', duration: '8.2s', size: '2.5px' },
    { left: '38%', top: '45%', delay: '1.1s', duration: '7.8s', size: '2px' },
    { left: '62%', top: '78%', delay: '3.4s', duration: '8.9s', size: '2px' },
    { left: '86%', top: '40%', delay: '1.9s', duration: '6.9s', size: '2.5px' },
    { left: '94%', top: '82%', delay: '0.3s', duration: '7.1s', size: '2px' },
    { left: '4%', top: '85%', delay: '2.1s', duration: '8.4s', size: '2px' },
    { left: '46%', top: '10%', delay: '1.6s', duration: '6.6s', size: '3px' },
    { left: '78%', top: '12%', delay: '3.0s', duration: '8.7s', size: '2px' },
    { left: '22%', top: '92%', delay: '0.5s', duration: '7.3s', size: '2.5px' },
  ], []);

  return (
    <div className="min-h-screen w-full bg-[#070B12] font-sans text-[#F8FAFC] relative overflow-x-hidden select-none flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* LIVING ANIMATED BACKGROUND (Behind entire page, NO central 3D graphic)   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Financial-Tech Grid */}
        <div className="absolute inset-0 fintech-grid opacity-30" />

        {/* Slow-Moving Gradient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] animate-drift-orb-1" />
        <div className="absolute top-1/3 -right-32 w-[650px] h-[650px] rounded-full bg-blue-600/10 blur-[130px] animate-drift-orb-2" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full bg-teal-500/08 blur-[120px] animate-drift-orb-3" />

        {/* Flowing Thin Curved SVG Data Lines */}
        <div className="absolute inset-0 opacity-[0.08] animate-wave-flow">
          <svg className="w-[120%] h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-100 200 C300 120, 600 280, 1000 180 C1300 100, 1500 240, 1800 200"
              stroke="url(#gradient-line-1)"
              strokeWidth="1.5"
            />
            <path
              d="M-100 450 C250 520, 700 380, 1100 480 C1400 550, 1650 420, 1800 460"
              stroke="url(#gradient-line-2)"
              strokeWidth="1.2"
            />
            <path
              d="M-100 700 C400 620, 800 780, 1200 680 C1500 600, 1700 720, 1800 690"
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
      {/* MAIN CONTENT WRAPPER: TWO-COLUMN INSTITUTIONAL LAYOUT                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: ~40% (lg:col-span-5) — BRAND & LOGIN CARD               */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 space-y-5 animate-in fade-in duration-300">
            {/* 1. Universal AI University Header */}
            <div>
              <img
                src="/images/Universal_AI_University_Logo.png"
                alt="Universal AI University"
                className="h-10 w-auto object-contain filter brightness-110"
              />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8] font-semibold block mt-1.5">
                UNIVERSAL AI UNIVERSITY &bull; SCHOOL OF MANAGEMENT
              </span>
            </div>

            {/* 2. CollateralIQ Identity */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
                  <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading">
                    Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
                  </h1>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-xs">
                    V2.4 PRO
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <h2 className="text-sm font-bold text-slate-200 tracking-tight">
                  AI-Assisted Residential Collateral Intelligence
                </h2>
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-400 mt-0.5">
                  HOME LOANS &bull; LAP &bull; BALANCE TRANSFERS
                </div>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  From property information to structured collateral intelligence.
                </p>
              </div>
            </div>

            {/* 3. Login Card (glass institutional container) */}
            <div
              className="p-6 shadow-2xl space-y-4"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
              <div>
                <h3 className="text-base font-bold text-white tracking-tight font-heading">
                  Institutional Portal Access
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                  Sign in to access the collateral assessment workspace.
                </p>
              </div>

              <form onSubmit={handleAuthenticate} className="space-y-3.5">
                {/* Field 1: Officer ID / Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Officer ID / Corporate Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your official email or officer ID"
                      className="w-full pl-9 pr-3 py-2 bg-[#070B12]/80 border border-white/[0.10] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Field 2: Passcode */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your passcode"
                      className="w-full pl-9 pr-10 py-2 bg-[#070B12]/80 border border-white/[0.10] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
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

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberTerminal}
                      onChange={(e) => setRememberTerminal(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-slate-700 bg-[#070B12] text-cyan-400 focus:ring-cyan-400/40"
                    />
                    <span className="text-slate-400 text-xs">Remember terminal node</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Forgot credentials?
                  </a>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 group"
                >
                  <span>{isAuthenticating ? 'Authenticating Terminal...' : 'Authenticate & Access Suite'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Divider */}
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-grow border-t border-white/[0.08]"></div>
                </div>

                {/* Secondary Fast-Track Demo Button */}
                <button
                  type="button"
                  onClick={() => handleAuthenticate()}
                  disabled={isAuthenticating}
                  className="w-full p-2.5 rounded-xl bg-[#0B111A]/80 hover:bg-[#101824] border border-cyan-500/30 hover:border-cyan-400 hover:shadow-cyan-500/10 hover:shadow-md text-left transition-all duration-200 cursor-pointer active:scale-[0.99] group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0 group-hover:animate-pulse" />
                    <span className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200">
                      ⚡ Fast-Track Demo Access
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 pl-6 font-sans">
                    Explore CollateralIQ with a guided walkthrough (Samruddhi Chaudhari)
                  </p>
                </button>
              </form>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: ~60% (lg:col-span-7) — PROBLEM, SOLUTION & WORKFLOW    */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 space-y-4 animate-in fade-in duration-300">
            
            {/* 1. Card: THE LENDING CHALLENGE */}
            <div
              className="p-6 shadow-2xl space-y-3 hover:border-rose-500/30 transition-colors"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
                  THE LENDING CHALLENGE
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight font-heading">
                Valuation Insights Are Fragmented
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Property valuation information is often spread across property details, valuation reports and previous valuation records. Credit teams may need to manually collect, compare and reconcile these inputs before understanding the collateral position.
              </p>

              {/* Emphasized Statement with Left-Border */}
              <div className="border-l-2 border-rose-500 pl-3.5 py-1.5 bg-rose-950/20 text-rose-200/95 text-xs font-medium leading-relaxed rounded-r-lg">
                The challenge is not a lack of information &mdash; it is making that information useful for faster, clearer collateral review.
              </div>
            </div>

            {/* 2. Card: THE COLLATERALIQ SOLUTION */}
            <div
              className="p-6 shadow-2xl space-y-4 hover:border-cyan-500/30 transition-colors"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                  THE COLLATERALIQ SOLUTION
                </span>
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight font-heading">
                One Workflow. A Clearer Collateral View.
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                CollateralIQ brings property information, model-supported valuation, independent valuation analysis and collateral metrics into one structured workflow.
              </p>

              {/* Six Animated Sequential Workflow Nodes (Horizontal on Desktop) */}
              <div className="pt-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>INTELLIGENCE RECONCILIATION PIPELINE</span>
                  <span className="text-cyan-400 text-[9px] animate-pulse">● Continuous Sequential Flow</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
                  {workflowNodes.map((node, idx) => {
                    const isActive = activeWorkflowStep === idx;
                    return (
                      <div
                        key={node.num}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                          isActive
                            ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20 scale-[1.02]'
                            : 'bg-[#070B12]/80 border-white/[0.08] text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}>
                            {node.num}
                          </span>
                          {idx < 5 && (
                            <span className={`text-[9px] hidden xl:inline ${isActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                              &rarr;
                            </span>
                          )}
                        </div>
                        <div className={`font-mono font-bold text-xs mt-1 ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {node.title}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight mt-1 font-sans">
                          {node.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Balance Transfer Analysis Strip (Conceptual Stages ONLY, NO Numbers) */}
              <div className="p-3.5 rounded-xl bg-[#070B12]/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Repeat2 className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      BALANCE TRANSFER ANALYSIS
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">Conceptual Movement</span>
                </div>

                <div className="flex items-center justify-between gap-1.5 font-mono text-xs text-center py-1">
                  <div className="flex-1 p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 text-[11px] font-semibold truncate">
                    Previous Valuation
                  </div>
                  <span className="text-amber-400 text-xs px-1">&rarr;</span>
                  <div className="flex-1 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold truncate">
                    Current CollateralIQ Estimate
                  </div>
                  <span className="text-cyan-400 text-xs px-1">&rarr;</span>
                  <div className="flex-1 p-2 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[11px] font-semibold truncate">
                    Current Independent Valuer
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  Track valuation movement and understand the current collateral position.
                </p>
              </div>
            </div>

            {/* 3. RESEARCH & DEVELOPMENT TEAM SECTION */}
            <div
              className="p-5 shadow-2xl space-y-3"
              style={{
                background: 'rgba(10, 20, 34, 0.72)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wider uppercase font-heading">
                    RESEARCH &amp; DEVELOPMENT TEAM
                  </h4>
                  <span className="text-[11px] text-cyan-400 font-medium font-sans">
                    Universal AI University &mdash; School of Management
                  </span>
                </div>
              </div>

              {/* Module Leader (Clearly separated with EXACT required title) */}
              <div className="rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono shrink-0 shadow-sm">
                    MK
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight">
                      Module Leader &mdash; Dr. Maneesh Ketkar
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950 border border-cyan-800/60 px-2 py-0.5 rounded">
                  FACULTY ADVISOR
                </span>
              </div>

              {/* Project Members (Clean circular initials, exact names, NO titles) */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  PROJECT MEMBERS:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {teamMembers.map((m) => (
                    <div
                      key={m.name}
                      className="rounded-xl bg-[#070B12]/80 border border-white/[0.08] px-2.5 py-2 flex items-center gap-2 hover:border-cyan-500/40 hover:bg-[#101824] transition-all duration-200 shadow-xs"
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${m.color} font-bold text-[9px] flex items-center justify-center shrink-0 font-mono border`}
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
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FOOTER: MINIMAL INSTITUTIONAL DISCLAIMER                                   */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full border-t border-white/[0.06] bg-[#070B12]/90 backdrop-blur-md px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div>
          Universal AI University &mdash; School of Management
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          AI-assisted collateral analytics | Human review required
        </div>
      </footer>
    </div>
  );
}
