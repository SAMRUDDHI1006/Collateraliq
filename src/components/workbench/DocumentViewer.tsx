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
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-slate-100 text-xs select-none shadow-md min-h-0">
      {/* Header Strip */}
      <div className="shrink-0 h-8 px-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 min-w-0">
          <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <h3 className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider truncate">
            Property Profile &amp; Comparables Intelligence
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-slate-300 bg-slate-800 border border-slate-700 px-1.5 py-0.2 rounded">
            {propertyProfile.location}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Asset Identity Card */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-xs text-white">
                {propertyProfile.bhk} {propertyProfile.propertyType}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              {propertyProfile.occupancy}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Carpet Area:</span>
              <span className="text-white font-bold">{propertyProfile.carpetArea} sq.ft</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Built-Up Area:</span>
              <span className="text-white font-bold">{propertyProfile.builtUpArea || Math.round(propertyProfile.carpetArea * 1.2)} sq.ft</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Floor Level:</span>
              <span className="text-white font-bold">Floor {propertyProfile.floor}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Building Age:</span>
              <span className="text-white font-bold">{propertyProfile.buildingAge} Years</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>{propertyProfile.parking}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
              <MapPin className="w-3 h-3 text-red-400" />
              <span>{propertyProfile.location} Micro-Market</span>
            </div>
          </div>
        </div>

        {/* Micro-Market Comparables Canvas */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Micro-Market Nearby Comparables ({comparables.length})
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <div className="space-y-2 pt-1">
            {comparables.map((comp, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-all">
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>{comp.project}</span>
                    <span className="text-[10px] font-mono text-slate-400">({comp.bhk})</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Distance: {comp.distance} &bull; Micro-Market Index
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-emerald-400 text-xs block">
                    ₹{comp.ratePerSqFt.toLocaleString()}/sq.ft
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-mono">Registered Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Valuation Corridor */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <span>Valuation Corridor Range (&plusmn;5%)</span>
            <Compass className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Lower Corridor (-5%):</span>
              <span className="text-slate-200 font-bold">₹{(indicativeRange.min / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Model Indicative:</span>
              <span className="text-emerald-400 font-bold">₹{(modelIndicativeValue / 1e7).toFixed(3)} Cr</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Upper Corridor (+5%):</span>
              <span className="text-slate-200 font-bold">₹{(indicativeRange.max / 1e7).toFixed(3)} Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
