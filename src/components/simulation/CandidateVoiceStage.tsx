'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import { AudioEqualizer } from '../shared/AudioEqualizer';
import {
  Mic,
  MicOff,
  Zap,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Volume2,
} from 'lucide-react';

export const CandidateVoiceStage: React.FC = () => {
  const router = useRouter();
  const {
    currentUser,
    activeSpeaker,
    isMicMuted,
    isInterrupted,
    interruptionMessage,
    difficultyLevel,
    stepDifficulty,
    toggleMic,
    simulateCandidateInterruption,
    simulatePersonaHandoff,
    finishSimulation,
    dismissInterruptionAlert,
  } = useAppStore();

  const isCandidateActive = activeSpeaker === 'CANDIDATE';

  const handleFinish = () => {
    finishSimulation();
    router.push('/candidate/passport/PASSPORT-2026-X89B');
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Dynamic Ambient Glow depending on Interruption or Active state */}
      {isInterrupted && (
        <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse border-2 border-amber-500 rounded-2xl" />
      )}

      {/* Flashing Interruption Alert Banner */}
      {isInterrupted && (
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-between gap-3 text-amber-200 text-xs shadow-lg animate-bounce">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{interruptionMessage || 'Candidate Interruption Detected — AI Speech Cut Off (<300ms)'}</span>
          </div>
          <button
            onClick={dismissInterruptionAlert}
            className="text-[11px] px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/40 text-amber-100 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
        {/* Candidate Stage Profile & Waveform */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                isCandidateActive
                  ? 'border-emerald-400 ring-4 ring-emerald-500/30 scale-105'
                  : 'border-slate-700'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`absolute -bottom-1 -right-1 p-1 rounded-md border text-[10px] ${
                isMicMuted
                  ? 'bg-rose-950 border-rose-800 text-rose-400'
                  : 'bg-emerald-950 border-emerald-800 text-emerald-400'
              }`}
            >
              {isMicMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100">{currentUser.name}</span>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                  isCandidateActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isCandidateActive ? 'Speaking Now' : 'Candidate Audio Channel'}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">{currentUser.title}</div>

            {/* Candidate Voice Waveform Stream */}
            <div className="mt-2 flex items-center gap-2">
              <div className="h-6 w-32 bg-slate-950/80 rounded-lg px-2 border border-slate-800/80 flex items-center justify-center">
                <AudioEqualizer
                  isActive={isCandidateActive && !isMicMuted}
                  color="emerald"
                  barCount={14}
                  heightClass="h-4"
                />
              </div>
              <span className="text-[11px] text-slate-400">
                {isMicMuted ? 'Mic Muted' : isCandidateActive ? '44.1 kHz • Low Latency' : 'Standby / Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Difficulty Meter Quick Stepper */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Difficulty Stress
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-extrabold text-emerald-400 text-sm">Level {difficultyLevel}</span>
              <span className="text-[10px] text-slate-400">/ 5</span>
            </div>
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => stepDifficulty(lvl)}
                className={`w-6 h-6 rounded text-[11px] font-bold transition-colors ${
                  difficultyLevel === lvl
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30'
                    : lvl <= difficultyLevel
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Control Dock Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          {/* Mute/Unmute */}
          <button
            id="mic-toggle-btn"
            onClick={toggleMic}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isMicMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700'
            }`}
          >
            {isMicMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>

          {/* Simulate Interruption */}
          <button
            id="simulate-interruption-btn"
            onClick={simulateCandidateInterruption}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-all active:scale-95 shadow-lg shadow-amber-500/10"
            title="Simulate candidate cutting off the AI speaker to test real-time latency (<300ms)"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Simulate Interruption</span>
          </button>

          {/* Simulate Persona Handoff */}
          <button
            id="simulate-handoff-btn"
            onClick={() => simulatePersonaHandoff()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/40 text-violet-300 transition-all active:scale-95"
            title="Cycle active AI speaker: Tech Lead -> Product Manager -> Hiring Lead"
          >
            <ArrowRightLeft className="w-4 h-4 text-violet-400" />
            <span>Simulate Handoff</span>
          </button>

          {/* Finish Simulation */}
          <button
            id="finish-simulation-btn"
            onClick={handleFinish}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 ml-1"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish & View Passport</span>
          </button>
        </div>
      </div>
    </div>
  );
};
