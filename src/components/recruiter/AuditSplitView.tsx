'use client';

import React, { useState } from 'react';
import { RecruiterCandidateRecord, TranscriptEntry } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  FileCheck,
  UserCheck,
  RotateCcw,
  Download,
  Award,
  Sparkles,
  Quote,
  ShieldAlert,
} from 'lucide-react';

interface AuditSplitViewProps {
  candidate: RecruiterCandidateRecord;
}

export const AuditSplitView: React.FC<AuditSplitViewProps> = ({ candidate }) => {
  const {
    transcripts,
    audioPlayingTimestamp,
    playAudioSnapshot,
    updateCandidateStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'claims' | 'scores'>('claims');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = (status: RecruiterCandidateRecord['status'], message: string) => {
    updateCandidateStatus(candidate.id, status);
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleExportDossier = () => {
    setActionFeedback('Exporting Complete Verification Audit Dossier (PDF)...');
    setTimeout(() => {
      setActionFeedback('Audit Dossier Exported Successfully!');
      setTimeout(() => setActionFeedback(null), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Verdict & Action Feedback */}
      {actionFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        </div>
      )}

      {/* Main Split-View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (5 cols): Resume Claims & Verified Scores */}
        <div className="lg:col-span-5 space-y-5">
          {/* Candidate Overview Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 p-0.5 rounded-full bg-slate-950 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">{candidate.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {candidate.passportId}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Applied for: <strong className="text-slate-300">{candidate.appliedRole}</strong>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{candidate.matchScore}% Match Score</span>
                  </div>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{candidate.experienceYears} Years Exp</span>
                </div>
              </div>
            </div>

            {/* Status Pills */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Pipeline Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                  candidate.status === 'SHORTLISTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : candidate.status === 'AUDITED'
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {candidate.status}
              </span>
            </div>
          </div>

          {/* Stated Resume Claims vs Verified Ground Truth */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Resume Claims vs Verified Reality
              </h4>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                AI Cross-Examination
              </span>
            </div>

            <div className="space-y-3">
              {candidate.resumeClaims.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    {item.verified ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-200 leading-snug">
                        Claim: &ldquo;{item.claim}&rdquo;
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed bg-slate-900/80 p-2 rounded border border-slate-800/80">
                        <span className="text-emerald-400 font-semibold">Evidence Validation: </span>
                        {item.evidenceExcerpt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Action Decision Panel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Recruiter Decision Panel
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                id="recruiter-shortlist-btn"
                onClick={() => handleAction('SHORTLISTED', 'Candidate shortlisted for Human Final Round!')}
                className="py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Shortlist for Human Round</span>
              </button>

              <button
                id="recruiter-reassessment-btn"
                onClick={() => handleAction('AUDITED', 'Reassessment requested with high-difficulty parameter!')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Request Reassessment</span>
              </button>

              <button
                id="recruiter-export-dossier-btn"
                onClick={handleExportDossier}
                className="col-span-1 sm:col-span-2 py-2.5 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Cryptographic Audit Dossier (PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane (7 cols): Verbatim Transcript with Highlighted Evidence */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col h-[750px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Quote className="w-5 h-5 text-violet-400" />
                Simulation Audio & Verbatim Transcript Audit
              </h3>
              <p className="text-xs text-slate-400">
                Click any timestamp to play synchronized audio snapshot clips
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              16 Evaluated Turns
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pt-4 pr-1">
            {transcripts.map((entry) => {
              const isCandidate = entry.role === 'CANDIDATE';
              const isPlaying = audioPlayingTimestamp === entry.timestamp;

              return (
                <div
                  key={entry.id}
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
                    isCandidate
                      ? 'bg-slate-950/80 border-emerald-900/50 shadow-md shadow-emerald-950/20'
                      : entry.role === 'TECH_LEAD'
                      ? 'bg-slate-950/50 border-blue-900/30'
                      : entry.role === 'PRODUCT_MANAGER'
                      ? 'bg-slate-950/50 border-violet-900/30'
                      : 'bg-slate-950/50 border-amber-900/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isCandidate
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : entry.role === 'TECH_LEAD'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : entry.role === 'PRODUCT_MANAGER'
                            ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {entry.speaker}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">[{entry.timestamp}]</span>
                    </div>

                    {entry.audioBookmarkSeconds !== undefined && (
                      <button
                        onClick={() => playAudioSnapshot(entry.timestamp)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                          isPlaying
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Playing Clip</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Play Clip</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <p className="text-slate-200 text-xs sm:text-[13px]">{entry.text}</p>

                  {entry.flag && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-[11px] font-semibold text-emerald-300">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{entry.flag}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
