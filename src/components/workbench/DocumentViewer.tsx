'use client';

import React from 'react';
import {
  Building,
  MapPin,
  Car,
  Home,
  Layers,
  Calendar,
  Compass,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { CollateralAssessmentCase } from '@/types/collateral';

interface DocumentViewerProps {
  loanCase: CollateralAssessmentCase;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ loanCase }) => {
  const { propertyProfile, modelIndicativeValue, indicativeRange, comparables } = loanCase;

  return (
    <div className="flex flex-col h-full bg-[#101824] border border-white/[0.08] rounded-2xl overflow-hidden text-[#F8FAFC] text-xs select-none shadow-card min-h-0">
      {/* Header Strip */}
      <div className="shrink-0 h-9 px-3.5 bg-[#0B111A] border-b border-white/[0.08] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <Building className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <h3 className="font-bold text-slate-200 text-[11px] uppercase tracking-wider truncate font-heading">
            Property Profile &amp; Comparables Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded-full font-semibold">
            {propertyProfile.location}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* Asset Identity Card */}
        <div className="p-4 bg-[#0B111A] rounded-xl border border-white/[0.06] space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs text-white font-heading">
                {propertyProfile.bhk} {propertyProfile.propertyType}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-bold">
              {propertyProfile.occupancy}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2.5 bg-[#141E2B] rounded-lg border border-white/[0.04]">
              <span className="text-[#94A3B8] text-[10px] block">Carpet Area:</span>
              <span className="text-white font-bold">{propertyProfile.carpetArea} sq.ft</span>
            </div>
            <div className="p-2.5 bg-[#141E2B] rounded-lg border border-white/[0.04]">
              <span className="text-[#94A3B8] text-[10px] block">Built-Up Area:</span>
              <span className="text-white font-bold">{propertyProfile.builtUpArea || Math.round(propertyProfile.carpetArea * 1.2)} sq.ft</span>
            </div>
            <div className="p-2.5 bg-[#141E2B] rounded-lg border border-white/[0.04]">
              <span className="text-[#94A3B8] text-[10px] block">Floor Level:</span>
              <span className="text-white font-bold">Floor {propertyProfile.floor}</span>
            </div>
            <div className="p-2.5 bg-[#141E2B] rounded-lg border border-white/[0.04]">
              <span className="text-[#94A3B8] text-[10px] block">Building Age:</span>
              <span className="text-white font-bold">{propertyProfile.buildingAge} Years</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-300 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>{propertyProfile.parking}</span>
            </div>
            <div className="flex items-center gap-1 text-[#94A3B8] font-mono text-[10px]">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{propertyProfile.location} Micro-Market</span>
            </div>
          </div>
        </div>

        {/* Micro-Market Comparables Canvas */}
        <div className="p-4 bg-[#0B111A] rounded-xl border border-white/[0.06] space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 font-heading">
              Micro-Market Nearby Comparables ({comparables.length})
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="space-y-2 pt-0.5">
            {comparables.map((comp, idx) => (
              <div key={idx} className="p-3 bg-[#141E2B] rounded-xl border border-white/[0.04] hover:border-cyan-500/30 flex items-center justify-between text-xs transition-all duration-200">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{comp.project}</span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">({comp.bhk})</span>
                  </div>
                  <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
                    Distance: {comp.distance} &bull; Micro-Market Index
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-emerald-400 text-xs block">
                    ₹{comp.ratePerSqFt.toLocaleString()}/sq.ft
                  </span>
                  <span className="text-[9px] text-[#94A3B8] uppercase font-mono">Registered Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Valuation Corridor */}
        <div className="p-4 bg-[#0B111A] rounded-xl border border-white/[0.06] space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 uppercase tracking-wider font-heading">
            <span>Valuation Corridor Range (&plusmn;5%)</span>
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="p-3 bg-[#141E2B] rounded-xl border border-white/[0.04] space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-[#94A3B8]">
              <span>Lower Corridor (-5%):</span>
              <span className="text-slate-200 font-bold">₹{(indicativeRange.min / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Model Indicative:</span>
              <span className="text-emerald-400 font-bold">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between text-[#94A3B8]">
              <span>Upper Corridor (+5%):</span>
              <span className="text-slate-200 font-bold">₹{(indicativeRange.max / 1e7).toFixed(3)} Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
