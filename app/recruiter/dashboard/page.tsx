'use client';

import React from 'react';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { RecruiterMetrics } from '@/src/components/recruiter/RecruiterMetrics';
import { ActiveJobsTable } from '@/src/components/recruiter/ActiveJobsTable';
import { TopCandidatesQueue } from '@/src/components/recruiter/TopCandidatesQueue';
import { useAppStore } from '@/src/store/useAppStore';

export default function RecruiterDashboardPage() {
  const { currentUser } = useAppStore();

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Recruiter Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40">
                TALENT PARTNER ENTERPRISE HUD
              </span>
              <span className="text-xs text-slate-400">Organization: Apex Technology Labs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
              Enterprise Talent Screening & Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Logged in as <strong className="text-slate-200">{currentUser.name}</strong> • {currentUser.title}
            </p>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <RecruiterMetrics />

        {/* Active Jobs & Competency Packs Table */}
        <ActiveJobsTable />

        {/* Top Verified Candidates Queue */}
        <TopCandidatesQueue />
      </main>
    </DashboardLayout>
  );
}
