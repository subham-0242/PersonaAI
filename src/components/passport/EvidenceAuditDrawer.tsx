'use client';

import React, { useState } from 'react';
import { CompetencyScore, EvidenceItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  FileCheck,
  Play,
  Pause,
  Quote,
  CheckCircle2,
  Filter,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface EvidenceAuditDrawerProps {
  competencies: CompetencyScore[];
  initialFilter?: string | null;
}

export const EvidenceAuditDrawer: React.FC<EvidenceAuditDrawerProps> = ({
  competencies,
  initialFilter = null,
}) => {
  const { audioPlayingTimestamp, playAudioSnapshot } = useAppStore();
  const [selectedTag, setSelectedTag] = useState<string | null>(initialFilter);
  const [selectedEvaluator, setSelectedEvaluator] = useState<string | null>(null);

  // Flatten all evidence items
  const allEvidence: (EvidenceItem & { competencyName: string })[] = [];
  competencies.forEach((comp) => {
    comp.evidenceItems.forEach((item) => {
      allEvidence.push({
        ...item,
        competencyName: comp.name,
      });
    });
  });

  const uniqueTags = Array.from(new Set(allEvidence.map((e) => e.competencyTag)));
  const evaluators = ['Alex', 'Sarah', 'Jordan'];

  const filteredEvidence = allEvidence.filter((item) => {
    if (selectedTag && item.competencyTag !== selectedTag) return false;
    if (selectedEvaluator && item.personaEvaluator !== selectedEvaluator) return false;
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Evidence-Based Audit Drill-Down Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Immutable link between evaluated score claims and verbatim candidate voice quotes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => {
              setSelectedTag(null);
              setSelectedEvaluator(null);
            }}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              !selectedTag && !selectedEvaluator
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            All Evidence ({allEvidence.length})
          </button>

          {evaluators.map((evaluator) => (
            <button
              key={evaluator}
              onClick={() => setSelectedEvaluator(selectedEvaluator === evaluator ? null : evaluator)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                selectedEvaluator === evaluator
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-semibold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              Panelist: {evaluator}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((ev) => {
          const isPlaying = audioPlayingTimestamp === ev.timestamp;

          return (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {ev.competencyTag}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      Evaluator: <strong className="text-slate-300">{ev.personaEvaluator}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>

                {/* Direct Verbatim Quote */}
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 relative mb-3">
                  <Quote className="w-4 h-4 text-emerald-500/40 mb-1" />
                  <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed">
                    &ldquo;{ev.quote}&rdquo;
                  </p>
                </div>

                {/* Evaluator Rationale */}
                <div className="text-xs text-slate-400 leading-relaxed mb-3">
                  <span className="font-semibold text-slate-300">Evaluator Rationale: </span>
                  {ev.evaluatorRationale}
                </div>
              </div>

              {/* Bottom Card Footer with Playable Timestamp Snapshot */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Timestamp: [{ev.timestamp}]
                </span>

                <button
                  onClick={() => playAudioSnapshot(ev.timestamp)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isPlaying
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-emerald-400" />
                      <span>Playing [{ev.timestamp}]</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>[{ev.timestamp} ▶️ Play Audio Snapshot]</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
