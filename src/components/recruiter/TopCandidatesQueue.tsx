'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

export const TopCandidatesQueue: React.FC = () => {
  const { recruiterCandidates } = useAppStore();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            Top Verified Candidates Queue
          </h3>
          <p className="text-xs text-slate-400">
            Recent verified passports ranked by role competency match score
          </p>
        </div>

        <Link
          href="/recruiter/candidates"
          className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View All Screened Candidates</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {recruiterCandidates.map((cand) => (
          <div
            key={cand.id}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Candidate avatar and details */}
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-emerald-500 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-100">{cand.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {cand.passportId}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Applied: <strong className="text-slate-300">{cand.appliedRole}</strong> • {cand.experienceYears}y exp
                </div>
              </div>
            </div>

            {/* Quick Competency Chips */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300">
              <div className="text-center px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Sys Design</div>
                <div className="font-bold text-emerald-400">{cand.primaryScores.systemDesign}%</div>
              </div>
              <div className="text-center px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Backend</div>
                <div className="font-bold text-emerald-400">{cand.primaryScores.backendFundamentals}%</div>
              </div>
              <div className="text-center px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Product</div>
                <div className="font-bold text-violet-400">{cand.primaryScores.productThinking}%</div>
              </div>
              <div className="text-center px-2 py-1 rounded bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Ownership</div>
                <div className="font-bold text-amber-400">{cand.primaryScores.ownership}%</div>
              </div>
            </div>

            {/* Match Score & Action */}
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-emerald-400 font-extrabold text-base">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{cand.matchScore}% Match</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Confidence: {cand.verificationConfidence}
                </div>
              </div>

              <Link
                href={`/recruiter/audit/${cand.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/40 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Open Audit View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
