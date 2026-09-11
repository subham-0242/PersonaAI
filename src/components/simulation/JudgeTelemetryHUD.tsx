'use client';

import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  X,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  Sliders,
  Terminal,
  Activity,
  Code2,
  FileCode,
  Flame,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const JudgeTelemetryHUD: React.FC = () => {
  const {
    isHUDOpen,
    toggleHUD,
    difficultyLevel,
    stepDifficulty,
    liveMetrics,
    pendingHandoff,
    activeSpeaker,
    transcripts,
    triggerContradictionAlert,
    triggerVagueAnswerAlert,
    simulatePersonaHandoff,
  } = useAppStore();

  if (!isHUDOpen) return null;

  const difficultyNames = [
    'Level 1 — Basic Definitions & Syntactic Scenarios',
    'Level 2 — Single Node Architecture & Read Caching',
    'Level 3 — Distributed Clustering & ACID Boundaries',
    'Level 4 — High Concurrency & Edge Failures',
    'Level 5 — Catastrophic Disaster Recovery & Chaos Invariants',
  ];

  // Live SessionContext JSON format
  const sessionContextObject = {
    session_id: 'SIM-9821-X9B',
    current_role: activeSpeaker,
    difficulty_level: difficultyLevel,
    topics_covered: [
      'PostgreSQL Lock Contention & Deadlocks',
      'Redis Write-Ahead Atomic Buffering',
      'Kafka Idempotency Deduplication',
      'Cross-AZ AWS Cloud Egress Pricing',
      'Eventual Consistency Compensation Workflows'
    ],
    tech_valid: liveMetrics.techValid,
    biz_impact_addressed: liveMetrics.businessImpactAddressed,
    ownership_claimed: liveMetrics.ownershipClaimed,
    contradiction_detected: liveMetrics.contradictionDetected,
    vague_warning: liveMetrics.vagueResponseWarning,
    claims_store: [
      {
        claim_id: 'c-1',
        topic: 'Redis Lua Script',
        verified: true,
        evaluator: 'Alex',
        confidence: 0.94
      },
      {
        claim_id: 'c-2',
        topic: 'AWS Cross-AZ Egress $1,800/mo',
        verified: true,
        evaluator: 'Sarah',
        confidence: 0.88
      },
      {
        claim_id: 'c-3',
        topic: 'Zero Deadlock 0.12% dropoff ($340k GMV)',
        verified: true,
        evaluator: 'Sarah',
        confidence: 0.91
      }
    ],
    pending_handoff: pendingHandoff,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => toggleHUD(false)} />

      {/* Slide-over Drawer Pane */}
      <aside aria-label="Simulation telemetry and developer inspector" className="w-full max-w-xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Judge & Developer Telemetry HUD
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE STREAM
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Low-level evaluation pipeline & shared cognitive session memory
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleHUD(false)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* Section 1: Dynamic Difficulty Meter */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Adaptive Difficulty Stress Engine
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Level {difficultyLevel} / 5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              {difficultyNames[difficultyLevel - 1]}
            </p>

            {/* Stepped Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  onClick={() => stepDifficulty(lvl)}
                  className={`h-2.5 rounded-full cursor-pointer transition-all ${
                    lvl <= difficultyLevel
                      ? lvl === 5
                        ? 'bg-rose-500 shadow-md shadow-rose-500/30'
                        : lvl === 4
                        ? 'bg-amber-500 shadow-md shadow-amber-500/30'
                        : 'bg-emerald-500 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  title={`Set to Level ${lvl}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => stepDifficulty('DOWN')}
                disabled={difficultyLevel <= 1}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-medium transition-colors"
              >
                Step Down
              </button>
              <button
                onClick={() => stepDifficulty('UP')}
                disabled={difficultyLevel >= 5}
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-colors shadow-md shadow-emerald-500/20"
              >
                Raise Difficulty Stress
              </button>
            </div>
          </div>

          {/* Section 2: Cognitive Flags Matrix */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-400" />
              Cognitive Flags & Real-Time Rubric Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Technical Soundness</div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VALIDATED (0.88)
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                  Alex Lead
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Business Context & ROI</div>
                  <div className="text-xs font-bold text-violet-400 flex items-center gap-1 mt-0.5">
                    {liveMetrics.businessImpactAddressed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ADDRESSED (340k GMV)
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        TRIGGERING PM HANDOFF
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300">
                  Sarah PM
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Contradiction Register</div>
                  <div className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${
                    liveMetrics.contradictionDetected ? 'text-rose-400' : 'text-slate-300'
                  }`}>
                    {liveMetrics.contradictionDetected ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        FLAGGED: DNS TTL vs SLA
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                        NONE ACTIVE
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  liveMetrics.contradictionDetected ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  Cross-Round
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Ownership & Mentorship</div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CLAIMED (CI Decorator)
                  </div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                  Jordan Lead
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Pending Handoff Cue */}
          {pendingHandoff && (
            <div className="bg-violet-950/30 border border-violet-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-violet-300 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-violet-400" />
                  Scheduled Panelist Handoff Cue
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
                  Next Up
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-100">{pendingHandoff.nextRole}</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                <span className="text-slate-300 font-medium">Trigger Rationale:</span> {pendingHandoff.reason}
              </p>
            </div>
          )}

          {/* Section 4: Interactive Simulation Controls (Dev test buttons) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
            <h4 className="font-bold text-slate-200 flex items-center gap-2 mb-2.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Dev Probe Injection Controls
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Trigger autonomous edge probes and rubric checks directly into the conversation transcript.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="dev-trigger-vague-btn"
                onClick={triggerVagueAnswerAlert}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-left transition-colors"
              >
                <div className="text-amber-400 font-bold">Force Vague Warning</div>
                <div className="text-[10px] text-slate-400">Sarah probes metrics</div>
              </button>

              <button
                id="dev-trigger-contradiction-btn"
                onClick={triggerContradictionAlert}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-left transition-colors"
              >
                <div className="text-rose-400 font-bold">Trigger Contradiction</div>
                <div className="text-[10px] text-slate-400">Alex probes DNS TTL</div>
              </button>

              <button
                id="dev-raise-difficulty-5-btn"
                onClick={() => stepDifficulty(5)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-left transition-colors"
              >
                <div className="text-emerald-400 font-bold">Max Stress (Level 5)</div>
                <div className="text-[10px] text-slate-400">Chaos engineering drills</div>
              </button>

              <button
                id="dev-cycle-handoff-btn"
                onClick={() => simulatePersonaHandoff()}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-left transition-colors"
              >
                <div className="text-violet-400 font-bold">Force Next Speaker</div>
                <div className="text-[10px] text-slate-400">Simulate turn transfer</div>
              </button>
            </div>
          </div>

          {/* Section 5: Shared Memory JSON Inspector */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>SessionContext.json (Shared Memory Bus)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">UTF-8 • Real-time</span>
            </div>
            <pre className="p-3 text-[10px] font-mono text-emerald-400/90 overflow-x-auto max-h-56 leading-tight select-all">
              {JSON.stringify(sessionContextObject, null, 2)}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
};
