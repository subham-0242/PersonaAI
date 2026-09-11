'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { PanelistCard } from '@/src/components/simulation/PanelistCard';
import { CandidateVoiceStage } from '@/src/components/simulation/CandidateVoiceStage';
import { TranscriptStream } from '@/src/components/simulation/TranscriptStream';
import { JudgeTelemetryHUD } from '@/src/components/simulation/JudgeTelemetryHUD';
import { useAppStore } from '@/src/store/useAppStore';
import {
  Radio,
  Clock,
  Zap,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function SimulationArenaPage() {
  const router = useRouter();
  const {
    sessionStatus,
    difficultyLevel,
    sessionTimerSeconds,
    activeSpeaker,
    toggleHUD,
    isHUDOpen,
    resetDemoState,
    startSimulation,
    simulatePersonaHandoff,
  } = useAppStore();

  useEffect(() => {
    if (sessionStatus === 'READY') {
      startSimulation();
    }
  }, [sessionStatus, startSimulation]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConclude = () => {
    router.push('/candidate/passport/PASSPORT-2026-X89B');
  };

  const panelistsList = [
    {
      personaKey: 'TECH_LEAD' as const,
      name: 'Alex Vance',
      roleTitle: 'Principal Distributed Systems Architect',
      focusArea: 'Scalability, Race Conditions & Distributed Locks',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      personaKey: 'PRODUCT_MANAGER' as const,
      name: 'Sarah Jenkins',
      roleTitle: 'Lead FinOps & Technical Product Manager',
      focusArea: 'Cloud Egress Billing, Latency SLAs & ROI',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      personaKey: 'HIRING_MANAGER' as const,
      name: 'Jordan Chen',
      roleTitle: 'Engineering Director / Culture Lead',
      focusArea: 'STAR Behavioral Rigor, DBA Escalations & Team Mentorship',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full flex flex-col justify-between">
        {/* Arena Top Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          {/* Left: Live Arena Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block absolute inset-0" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-100 uppercase tracking-wider">
                  Live Adaptive Voice Arena
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Target: Senior Distributed Systems
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Bidirectional streaming • 3 Autonomous Evaluator Agents
              </div>
            </div>
          </div>

          {/* Center: Timer & Difficulty */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200 font-bold">{formatTimer(sessionTimerSeconds)}</span>
              <span className="text-[10px] text-slate-400">remaining</span>
            </div>

            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                difficultyLevel <= 2
                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                  : difficultyLevel <= 3
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              Difficulty: Level {difficultyLevel}/5
            </div>
          </div>

          {/* Right: Controls & Finish */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleHUD()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isHUDOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Judge HUD</span>
            </button>

            <button
              onClick={resetDemoState}
              title="Reset simulation turns"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              id="conclude-simulation-btn"
              onClick={handleConclude}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Conclude & Generate Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 AI Panelists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {panelistsList.map((panelist) => (
            <PanelistCard
              key={panelist.personaKey}
              personaKey={panelist.personaKey}
              name={panelist.name}
              roleTitle={panelist.roleTitle}
              focusArea={panelist.focusArea}
              avatarUrl={panelist.avatarUrl}
              activeSpeaker={activeSpeaker}
              onSelectSpeaker={() => simulatePersonaHandoff(panelist.personaKey)}
            />
          ))}
        </div>

        {/* Candidate Voice Stage (Mic, Audio Waveform, Interruption Indicator) */}
        <CandidateVoiceStage />

        {/* Live Verbatim Transcript Stream with Bookmarks and Flags */}
        <TranscriptStream />
      </main>

      {/* Slide-Over Telemetry HUD Drawer */}
      <JudgeTelemetryHUD />
    </DashboardLayout>
  );
}
