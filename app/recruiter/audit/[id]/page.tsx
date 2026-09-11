'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { AuditSplitView } from '@/src/components/recruiter/AuditSplitView';
import { useAppStore } from '@/src/store/useAppStore';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function CandidateAuditPage() {
  const params = useParams();
  const candidateId = (params?.id as string) || 'CAND-01';
  const { recruiterCandidates } = useAppStore();

  const candidate =
    recruiterCandidates.find((c) => c.id === candidateId) || recruiterCandidates[0];

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              href="/recruiter/dashboard"
              className="hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Recruiter Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-violet-400 font-semibold">Audit Dossier: {candidate.name}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Lock className="w-3 h-3" />
            <span>SHA-256 Attestation Active</span>
          </div>
        </div>

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
              AUDIT ROOM & VERBATIM CROSS-CHECK
            </span>
            <span className="text-xs text-slate-400 font-mono">Dossier #{candidate.passportId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
            Candidate Verification & Evidence Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare stated resume claims against verbatim audio quotes evaluated by autonomous AI agents during live simulations.
          </p>
        </div>

        {/* Split View Audit Component */}
        <AuditSplitView candidate={candidate} />
      </main>
    </DashboardLayout>
  );
}
