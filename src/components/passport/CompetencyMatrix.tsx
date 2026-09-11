'use client';

import React from 'react';
import { CompetencyScore } from '../../types';
import { CheckCircle2, Award, Zap, Shield, TrendingUp } from 'lucide-react';

interface CompetencyMatrixProps {
  competencies: CompetencyScore[];
  onSelectCompetency?: (competencyId: string) => void;
  selectedId?: string | null;
}

export const CompetencyMatrix: React.FC<CompetencyMatrixProps> = ({
  competencies,
  onSelectCompetency,
  selectedId,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Verified Competency Scores & Evidence Confidence
          </h3>
          <p className="text-xs text-slate-400">
            Algorithmic score attestation grounded in verbatim transcript citations
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Candidate Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-slate-600" />
            <span>Industry Benchmark</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {competencies.map((comp) => {
          const isSelected = selectedId === comp.id;
          const delta = comp.score - comp.benchmark;

          return (
            <div
              key={comp.id}
              onClick={() => onSelectCompetency && onSelectCompetency(comp.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/70 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-200">{comp.name}</span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    {comp.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      comp.confidence === 'High'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    Confidence: {comp.confidence} • {comp.evidencePointsCount} Evidence Citations
                  </span>

                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-emerald-400">{comp.score}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                    <span className={`text-xs font-semibold ml-1.5 ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {delta >= 0 ? `+${delta}%` : `${delta}%`} vs Bench
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar with Benchmark Marker */}
              <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${comp.score}%` }}
                />
                {/* Benchmark Tick */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-300 z-10"
                  style={{ left: `${comp.benchmark}%` }}
                  title={`Industry Benchmark: ${comp.benchmark}%`}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Evaluator Panel Consensus: Verified Under Cross-Examination</span>
                <span className="text-emerald-400 hover:underline font-medium">
                  View {comp.evidenceItems.length} transcript citations →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
