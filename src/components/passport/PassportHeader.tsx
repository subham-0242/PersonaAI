'use client';

import React, { useState } from 'react';
import { VerifiedPassport } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Download,
  Share2,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';

interface PassportHeaderProps {
  passport: VerifiedPassport;
}

export const PassportHeader: React.FC<PassportHeaderProps> = ({ passport }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(passport.cryptographicHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Background cryptographic watermark stamp effect */}
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-emerald-400">
        <ShieldCheck className="w-64 h-64" />
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Verification Badge & Attestation Stamp */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-slate-950 border border-emerald-500 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                VERIFIED CRYPTOGRAPHIC PASSPORT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: <span className="text-slate-200 font-semibold">{passport.verificationId}</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-100 mt-1 tracking-tight">
              {passport.candidateName}
            </h1>
            <p className="text-xs font-semibold text-slate-400">{passport.targetRole}</p>

            {/* Cryptographic SHA-256 Attestation Pill */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="truncate max-w-[260px] sm:max-w-md">{passport.cryptographicHash}</span>
              </div>
              <button
                onClick={handleCopyHash}
                className="text-[11px] text-slate-400 hover:text-emerald-300 transition-colors p-1"
                title="Copy SHA-256 cryptographic attestation signature"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && (
                <span className="text-[11px] text-emerald-400 font-medium">Copied to clipboard!</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Final Verdict Card & Overall Readiness Index */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full lg:w-auto">
          {/* Readiness Index Gauge */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-center min-w-[130px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Readiness Index
            </span>
            <div className="text-3xl font-black text-emerald-400 mt-0.5 flex items-baseline justify-center gap-0.5">
              <span>{passport.overallReadinessIndex}</span>
              <span className="text-sm font-bold text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center justify-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Top 4% Senior Fit
            </span>
          </div>

          {/* Verdict Box */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl p-4 flex-1 sm:min-w-[220px]">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Multi-Agent Consensus Verdict</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-100 mt-1">
              {passport.verdict}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Attested: {passport.issuedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
