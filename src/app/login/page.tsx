'use client';

import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  FileText,
  Scale,
  Building,
  CheckCircle2,
  Repeat2,
  Sparkles,
  BarChart3,
  Layers,
  GraduationCap,
  Info,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('samruddhi@bankcorp.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Storytelling interactive scene tabs: 0 = Problem, 1 = Solution, 2 = Balance Transfer
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-cycle through scenes every 7 seconds unless paused by user interaction
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % 3);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused]);

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

  // Academic Project Roster
  const moduleLeader = {
    name: 'Dr. Maneesh Ketkar',
    title: 'Module Leader & Academic Mentor',
    initials: 'MK',
  };

  const teamMembers = [
    { name: 'Samruddhi Chaudhari', initials: 'SC', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' },
    { name: 'Gun Gupta', initials: 'GG', color: 'bg-blue-950/80 text-blue-300 border-blue-700/60' },
    { name: 'Riya Arora', initials: 'RA', color: 'bg-purple-950/80 text-purple-300 border-purple-700/60' },
    { name: 'Disha Gupta', initials: 'DG', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60' },
    { name: 'Avnish Mishra', initials: 'AM', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60' },
    { name: 'Bhagya Ajith', initials: 'BA', color: 'bg-amber-950/80 text-amber-300 border-amber-700/60' },
    { name: 'Sristi Chatterjee', initials: 'SC', color: 'bg-rose-950/80 text-rose-300 border-rose-700/60' },
  ];

  // Workflow pipeline steps
  const workflowSteps = [
    { step: '01', title: 'UPLOAD', desc: 'Property PDF & Valuer Report' },
    { step: '02', title: 'EXTRACT', desc: 'Specs, rates & parameters' },
    { step: '03', title: 'ANALYZE', desc: 'Model-supported indicative value' },
    { step: '04', title: 'COMPARE', desc: 'Model vs. Independent Valuer' },
    { step: '05', title: 'EXPLAIN', desc: '7 measurable deviation drivers' },
    { step: '06', title: 'REVIEW', desc: 'LTV, coverage & review level' },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#070B12] font-sans text-[#F8FAFC] select-none flex flex-col lg:flex-row overflow-x-hidden ambient-mesh">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: BRANDING + INSTITUTIONAL AUTHENTICATION PORTAL (44% Width)    */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[44%] bg-[#070B12] p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-r border-white/[0.08] relative z-10 shrink-0">
        {/* Subtle Ambient Lighting Mesh */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/[0.06] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* 1. Universal AI University Header */}
          <div>
            <img
              src="/images/Universal_AI_University_Logo.png"
              alt="Universal AI University"
              className="h-11 w-auto object-contain mb-2 filter brightness-110"
            />
            <span className="text-[11px] uppercase font-mono tracking-wider text-[#94A3B8] font-semibold block">
              Universal AI University &bull; School of Management
            </span>
          </div>

          {/* 2. CollateralIQ Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25">
                <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading leading-tight">
                  Collateral<span className="text-cyan-400 font-extrabold">IQ</span>
                </h1>
                <span className="text-[11px] font-mono text-slate-400">v2.4</span>
              </div>
            </div>

            <div className="pt-1">
              <h2 className="text-sm font-bold text-slate-200 tracking-tight">
                AI-Assisted Residential Collateral Intelligence
              </h2>
              <p className="text-xs text-cyan-400 font-medium mt-0.5">
                For Home Loans &bull; LAP &bull; Balance Transfers
              </p>
            </div>

            {/* Scope Badges */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 font-mono text-[10px]">
              <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
                HOME LOAN
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold">
                LAP
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-semibold">
                BALANCE TRANSFER
              </span>
            </div>
          </div>

          {/* 3. Institutional Portal Access Form */}
          <div className="bg-[#101824]/95 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-heading">
                Institutional Portal Access
              </h3>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 font-sans">
                Sign in to access the collateral assessment workspace.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Officer ID / Corporate Email</span>
                  <span className="text-[10px] text-cyan-400/90 font-mono">LDAP Authentication</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samruddhi@bankcorp.in"
                    className="w-full pl-9 pr-3 py-2 bg-[#0B111A] border border-white/[0.12] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
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
                    className="w-full pl-9 pr-10 py-2 bg-[#0B111A] border border-white/[0.12] rounded-xl text-xs text-[#F8FAFC] font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition-all placeholder:text-slate-600"
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

              {/* Primary Authenticate CTA */}
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

              {/* Fast-Track Demo Access CTA */}
              <button
                type="button"
                onClick={() => handleAuthenticate()}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0B111A] hover:bg-[#141E2B] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-semibold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">⚡ Fast-Track Demo Access (Samruddhi Chaudhari - Senior Credit Officer)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Left Footer Note */}
        <div className="pt-6 border-t border-white/[0.08] relative z-10 text-[11px] text-[#94A3B8] space-y-1">
          <div className="font-semibold text-slate-300">
            Universal AI University &mdash; School of Management
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            AI-assisted collateral analytics | Human review required
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: INTERACTIVE PROBLEM & SOLUTION STORYTELLING (56% Width)     */}
      {/* ========================================================================= */}
      <div
        className="w-full lg:w-[56%] bg-[#0B111A]/95 p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto relative border-l border-white/[0.04]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Stylized 3D Digital Asset Wireframe Animation */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] rounded-full border border-cyan-500/20 animate-[spin_60s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 blur-xs"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 blur-xs"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 blur-xs"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 blur-xs"></div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          {/* Top Telemetry & Interactive Story Scene Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">PRODUCT STORY:</span>
              {[
                { id: 0, label: '01. The Challenge' },
                { id: 1, label: '02. The Solution' },
                { id: 2, label: '03. Balance Transfer' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveScene(tab.id);
                    setIsPaused(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeScene === tab.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Auto-Advancing &bull; {isPaused ? 'Paused' : 'Playing'}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCENE 1: THE LENDING CHALLENGE (The Problem)                              */}
          {/* ========================================================================= */}
          {activeScene === 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Problem Card */}
              <div className="bg-[#101824] border border-amber-500/30 rounded-2xl p-6 relative shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                    THE LENDING CHALLENGE
                  </span>
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>

                <h3 className="text-base font-bold text-white tracking-tight font-heading leading-snug">
                  Property Valuation Information Is Fragmented Across Multiple Inputs
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Property valuation information is often spread across property details, valuation reports and previous valuation records. Credit teams may need to manually collect, compare and reconcile these inputs before understanding the true collateral position.
                </p>

                <div className="p-3 rounded-xl bg-[#0B111A] border border-amber-500/20 text-amber-200/90 text-xs font-medium leading-relaxed">
                  &ldquo;The challenge is not a lack of information &mdash; it is making that information useful for faster, clearer collateral review.&rdquo;
                </div>

                {/* Visual Convergence of 3 Information Streams into 1 Question */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                    Fragmented Input Sources &rarr; Central Underwriter Dilemma:
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#070B12] border border-white/10 text-center space-y-1">
                      <Building className="w-4 h-4 text-cyan-400 mx-auto" />
                      <div className="font-semibold text-white text-[11px]">Property Information</div>
                      <div className="text-[9px] text-slate-400">Carpet area, specs, micro-market</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#070B12] border border-white/10 text-center space-y-1">
                      <FileText className="w-4 h-4 text-blue-400 mx-auto" />
                      <div className="font-semibold text-white text-[11px]">Valuation Report</div>
                      <div className="text-[9px] text-slate-400">Independent valuer rate &amp; comps</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#070B12] border border-white/10 text-center space-y-1">
                      <Repeat2 className="w-4 h-4 text-amber-400 mx-auto" />
                      <div className="font-semibold text-white text-[11px]">Previous Valuation</div>
                      <div className="text-[9px] text-slate-400">Historical base at previous bank</div>
                    </div>
                  </div>

                  {/* Converging Arrow to Question */}
                  <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyan-950/40 to-blue-950/40 border border-white/10 text-center">
                    <div className="text-xs font-bold text-white font-mono flex items-center justify-center gap-2">
                      <span className="text-amber-400">&darr;</span>
                      <span>&ldquo;What is the current collateral position?&rdquo;</span>
                      <span className="text-cyan-400">&darr;</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Previous valuation &rarr; Current valuation &rarr; Current collateral position
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 2: THE COLLATERALIQ SOLUTION (The 6-Step Workflow)                  */}
          {/* ========================================================================= */}
          {activeScene === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Solution Card */}
              <div className="bg-[#101824] border border-emerald-500/30 rounded-2xl p-6 relative shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    THE COLLATERALIQ SOLUTION
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>

                <h3 className="text-base font-bold text-white tracking-tight font-heading leading-snug">
                  One Structured Intelligence Workflow for Residential Collateral
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  CollateralIQ brings property information, model-supported valuation, independent valuation analysis and collateral metrics into one structured workflow.
                </p>

                {/* 6-Step Sequential Pipeline Display */}
                <div className="pt-1 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    RECONCILIATION ENGINE PIPELINE:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {workflowSteps.map((ws, i) => (
                      <div
                        key={ws.step}
                        className="p-2.5 rounded-xl bg-[#0B111A] border border-white/10 hover:border-cyan-500/50 transition-colors space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-cyan-400 text-[10px]">{ws.step}</span>
                          <span className="text-[9px] text-slate-500">&rarr;</span>
                        </div>
                        <div className="font-bold text-white text-xs font-mono">{ws.title}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{ws.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value Proposition Summary */}
                <div className="p-3 rounded-xl bg-[#0B111A] border border-cyan-500/20 text-slate-300 text-xs font-sans">
                  <span className="text-cyan-300 font-semibold block mb-0.5">Core Objective:</span>
                  Extract property information &bull; Compare valuations &bull; Understand measurable differences &bull; Calculate LTV &amp; collateral coverage
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCENE 3: BALANCE TRANSFER VALUATION MOVEMENT SHOWCASE                     */}
          {/* ========================================================================= */}
          {activeScene === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Balance Transfer Card */}
              <div className="bg-[#101824] border border-cyan-500/30 rounded-2xl p-6 relative shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
                    BALANCE TRANSFER INTELLIGENCE
                  </span>
                  <Repeat2 className="w-4 h-4 text-cyan-400" />
                </div>

                <h3 className="text-base font-bold text-white tracking-tight font-heading leading-snug">
                  Three-Value Trajectory: Previous vs. Current Collateral Position
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  For Home Loan Balance Transfers, CollateralIQ tracks historical loan position against current independent valuation and micro-market appreciation.
                </p>

                {/* 3-Valuation Cards Showcase */}
                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#0B111A] border border-white/10 text-center space-y-1">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block">PREVIOUS VALUATION</span>
                    <span className="font-mono font-bold text-white text-sm block">₹4.200 Cr</span>
                    <span className="text-[9px] text-slate-500 font-mono">Previous Lender Base</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-1">
                    <span className="text-[9px] uppercase font-mono text-cyan-300 block">CURRENT COLLATERALIQ</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm block">₹4.675 Cr</span>
                    <span className="text-[9px] text-cyan-400/80 font-mono">Model Indicative</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-center space-y-1">
                    <span className="text-[9px] uppercase font-mono text-blue-300 block">CURRENT VALUER</span>
                    <span className="font-mono font-bold text-blue-300 text-sm block">₹4.550 Cr</span>
                    <span className="text-[9px] text-blue-400/80 font-mono">Independent Report</span>
                  </div>
                </div>

                {/* 4 Measurable Attribution Ratios */}
                <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-center">
                  <div className="p-2 rounded-lg bg-[#070B12] border border-white/10">
                    <span className="text-[9px] text-slate-400 block uppercase">Valuation Movement</span>
                    <span className="text-xs font-bold text-emerald-400">+₹35.00 L (+8.33%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#070B12] border border-white/10">
                    <span className="text-[9px] text-slate-400 block uppercase">AI–Valuer Difference</span>
                    <span className="text-xs font-bold text-cyan-300">-₹12.50 L (-2.67%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#070B12] border border-white/10">
                    <span className="text-[9px] text-slate-400 block uppercase">Current LTV</span>
                    <span className="text-xs font-bold text-white">53.5% (&le;75%)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#070B12] border border-white/10">
                    <span className="text-[9px] text-slate-400 block uppercase">Coverage Ratio</span>
                    <span className="text-xs font-bold text-emerald-400">1.87x</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-mono text-right">
                  * Illustrative sample case CLIQ-DADAR-001 (Mumbai micro-market benchmark)
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM SECTION: RESEARCH & DEVELOPMENT TEAM ROSTER                        */}
          {/* ========================================================================= */}
          <div className="pt-5 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white tracking-wider uppercase block font-heading">
                  RESEARCH &amp; DEVELOPMENT TEAM
                </span>
                <span className="text-xs text-cyan-400 font-medium">
                  Universal AI University &mdash; School of Management
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <GraduationCap className="w-3 h-3 text-cyan-400" />
                <span>Academic &amp; FinTech Sandbox</span>
              </div>
            </div>

            {/* Module Leader Card */}
            <div className="rounded-xl bg-gradient-to-r from-cyan-950/50 via-blue-950/40 to-[#101824] border border-cyan-500/30 p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center font-heading shrink-0 shadow-md">
                  {moduleLeader.initials}
                </div>
                <div>
                  <div className="text-white text-xs font-bold tracking-tight">
                    {moduleLeader.name}
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono">
                    {moduleLeader.title}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                FACULTY ADVISOR
              </span>
            </div>

            {/* 7 Project Members Grid */}
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                PROJECT RESEARCHERS &amp; PRODUCT ENGINEERS:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {teamMembers.map((m) => (
                  <div
                    key={m.name}
                    className="rounded-xl bg-[#101824] border border-white/[0.08] px-2.5 py-2 flex items-center gap-2 hover:border-cyan-500/40 hover:bg-[#141E2B] transition-all duration-200 shadow-sm"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${m.color} font-bold text-[10px] flex items-center justify-center shrink-0 font-mono border`}
                    >
                      {m.initials}
                    </div>
                    <div className="text-slate-200 text-[11px] font-semibold truncate leading-tight">
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
  );
}
