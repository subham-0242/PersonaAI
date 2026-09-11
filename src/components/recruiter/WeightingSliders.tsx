'use client';

import React from 'react';
import { Sliders, CheckCircle, AlertCircle, RotateCcw, Cpu, DollarSign, Users2, Building } from 'lucide-react';

export interface CompetencyWeights {
  systemDesign: number;
  databaseOptimization: number;
  codingLogic: number;
  productMindset: number;
  ownership: number;
}

export interface ActivePersonas {
  techLead: boolean;
  productManager: boolean;
  hiringManager: boolean;
  domainCustomer: boolean;
}

interface WeightingSlidersProps {
  weights: CompetencyWeights;
  onChangeWeights: (newWeights: CompetencyWeights) => void;
  personas: ActivePersonas;
  onChangePersonas: (newPersonas: ActivePersonas) => void;
}

export const WeightingSliders: React.FC<WeightingSlidersProps> = ({
  weights,
  onChangeWeights,
  personas,
  onChangePersonas,
}) => {
  const sum =
    weights.systemDesign +
    weights.databaseOptimization +
    weights.codingLogic +
    weights.productMindset +
    weights.ownership;

  const isExact100 = sum === 100;

  const handleSliderChange = (key: keyof CompetencyWeights, val: number) => {
    onChangeWeights({
      ...weights,
      [key]: val,
    });
  };

  const handleNormalize = () => {
    if (sum === 0) return;
    const factor = 100 / sum;
    const rounded: CompetencyWeights = {
      systemDesign: Math.round(weights.systemDesign * factor),
      databaseOptimization: Math.round(weights.databaseOptimization * factor),
      codingLogic: Math.round(weights.codingLogic * factor),
      productMindset: Math.round(weights.productMindset * factor),
      ownership: 0,
    };
    rounded.ownership = 100 - (rounded.systemDesign + rounded.databaseOptimization + rounded.codingLogic + rounded.productMindset);
    onChangeWeights(rounded);
  };

  const sliderFields: { key: keyof CompetencyWeights; label: string; desc: string; color: string }[] = [
    {
      key: 'systemDesign',
      label: 'System Design & Distributed Scalability',
      desc: 'Locking mechanisms, high concurrency, cache buffering, microservice partitioning',
      color: 'accent-emerald-500',
    },
    {
      key: 'databaseOptimization',
      label: 'Database Optimization & SQL Performance',
      desc: 'Index selectivity, ACID boundaries, connection pooling, deadlock cascades',
      color: 'accent-teal-500',
    },
    {
      key: 'codingLogic',
      label: 'Coding Logic & Algorithmic Correctness',
      desc: 'Time/space complexity, data structure selection, edge case coverage',
      color: 'accent-blue-500',
    },
    {
      key: 'productMindset',
      label: 'Product Mindset & FinOps Cloud Economics',
      desc: 'Latency SLA contracts, AWS cloud egress pricing, user conversion impacts',
      color: 'accent-violet-500',
    },
    {
      key: 'ownership',
      label: 'STAR Ownership & Cross-Functional Leadership',
      desc: 'DBA friction resolution, mentoring junior devs with automated CI guardrails',
      color: 'accent-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Competency Weighting Sliders */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-violet-400" />
              Custom Competency Rubric Weighting
            </h3>
            <p className="text-xs text-slate-400">
              Configure how the autonomous AI panelists weight evidence across technical and business criteria
            </p>
          </div>

          {/* Sum indicator badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isExact100
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              {isExact100 ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>Total Weight: {sum}% / 100%</span>
            </span>

            {!isExact100 && (
              <button
                type="button"
                onClick={handleNormalize}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Auto-Balance to 100%</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-5 mt-5">
          {sliderFields.map((field) => {
            const val = weights[field.key];
            return (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{field.label}</span>
                    <span className="text-[11px] text-slate-400 block sm:inline sm:ml-2">({field.desc})</span>
                  </div>
                  <span className="font-mono font-bold text-violet-400 text-sm">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="5"
                  value={val}
                  onChange={(e) => handleSliderChange(field.key, parseInt(e.target.value))}
                  className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${field.color}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Panelist Persona Toggles */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
          <Users2 className="w-5 h-5 text-emerald-400" />
          Active AI Interviewer Persona Selection
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Select which autonomous panelists participate in the adaptive simulation round
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tech Lead */}
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              personas.techLead
                ? 'bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-950/30'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={personas.techLead}
                onChange={(e) => onChangePersonas({ ...personas, techLead: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="mt-3">
              <div className="font-bold text-slate-100 text-xs">Alex — Principal Tech Lead</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Architecture, Concurrency & Edge Probing</div>
            </div>
          </label>

          {/* Product Manager */}
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              personas.productManager
                ? 'bg-violet-950/40 border-violet-500/60 shadow-lg shadow-violet-950/30'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <DollarSign className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={personas.productManager}
                onChange={(e) => onChangePersonas({ ...personas, productManager: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="mt-3">
              <div className="font-bold text-slate-100 text-xs">Sarah — Lead Product Manager</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ROI, Latency SLAs & FinOps Budgeting</div>
            </div>
          </label>

          {/* Hiring Manager */}
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              personas.hiringManager
                ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-950/30'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Users2 className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={personas.hiringManager}
                onChange={(e) => onChangePersonas({ ...personas, hiringManager: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="mt-3">
              <div className="font-bold text-slate-100 text-xs">Jordan — Hiring Lead</div>
              <div className="text-[11px] text-slate-400 mt-0.5">STAR Evidence, Mentorship & Culture</div>
            </div>
          </label>

          {/* Domain Customer */}
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              personas.domainCustomer
                ? 'bg-teal-950/40 border-teal-500/60 shadow-lg shadow-teal-950/30'
                : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Building className="w-4 h-4" />
              </div>
              <input
                type="checkbox"
                checked={personas.domainCustomer}
                onChange={(e) => onChangePersonas({ ...personas, domainCustomer: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="mt-3">
              <div className="font-bold text-slate-100 text-xs">FinTech Merchant Sponsor</div>
              <div className="text-[11px] text-slate-400 mt-0.5">High-Stakes Client SLA Probing</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
