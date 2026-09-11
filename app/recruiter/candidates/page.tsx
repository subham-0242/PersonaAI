'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { useAppStore } from '@/src/store/useAppStore';
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function CandidatesPipelinePage() {
  const { recruiterCandidates } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SHORTLISTED' | 'AUDITED' | 'SCREENED'>('ALL');

  const filtered = recruiterCandidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.appliedRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.passportId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || cand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Screened Candidates Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cryptographically attested candidate passports ranked by role match confidence
            </p>
          </div>
          <Link
            href="/recruiter/dashboard"
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold self-start sm:self-auto"
          >
            ← Back to Recruiter Dashboard
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate by name, role, or passport ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(['ALL', 'SHORTLISTED', 'AUDITED', 'SCREENED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  statusFilter === status
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates List Grid */}
        <div className="space-y-4">
          {filtered.map((cand) => (
            <div
              key={cand.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl backdrop-blur-md"
            >
              {/* Candidate Info */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cand.avatar} alt={cand.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-emerald-500 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">{cand.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {cand.passportId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Target Role: <strong className="text-slate-300">{cand.appliedRole}</strong> • {cand.experienceYears}y exp
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                        cand.status === 'SHORTLISTED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : cand.status === 'AUDITED'
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {cand.status}
                    </span>
                    <span className="text-slate-400">Confidence: {cand.verificationConfidence}</span>
                  </div>
                </div>
              </div>

              {/* Competency Metric Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">System Design</div>
                  <div className="text-sm font-bold text-emerald-400">{cand.primaryScores.systemDesign}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Backend Core</div>
                  <div className="text-sm font-bold text-emerald-400">{cand.primaryScores.backendFundamentals}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Product ROI</div>
                  <div className="text-sm font-bold text-violet-400">{cand.primaryScores.productThinking}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">STAR Ownership</div>
                  <div className="text-sm font-bold text-amber-400">{cand.primaryScores.ownership}%</div>
                </div>
              </div>

              {/* Match Score & Audit Button */}
              <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-emerald-400 font-black text-lg">
                    <Sparkles className="w-4 h-4" />
                    <span>{cand.matchScore}% Match</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Multi-Agent Consensus</div>
                </div>

                <Link
                  href={`/recruiter/audit/${cand.id}`}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Audit View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </DashboardLayout>
  );
}
