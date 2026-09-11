'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '../../store/useAppStore';
import { Briefcase, Plus, Users, ArrowUpRight, SlidersHorizontal } from 'lucide-react';

export const ActiveJobsTable: React.FC = () => {
  const { activeJobs } = useAppStore();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-400" />
            Active Job Roles & Competency Packs
          </h3>
          <p className="text-xs text-slate-400">
            Pre-calibrated multi-agent evaluation suites with custom rubric weights
          </p>
        </div>

        <Link
          href="/recruiter/jobs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role Competency Pack</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="pb-3 font-semibold">Job Title</th>
              <th className="pb-3 font-semibold">Department</th>
              <th className="pb-3 font-semibold">Seniority</th>
              <th className="pb-3 font-semibold">Required Competencies</th>
              <th className="pb-3 font-semibold text-center">Verified Pipeline</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activeJobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="py-3.5 pr-3">
                  <div className="font-bold text-slate-100 group-hover:text-violet-300 transition-colors">
                    {job.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {job.id}</div>
                </td>
                <td className="py-3.5 pr-3 text-slate-300">{job.department}</td>
                <td className="py-3.5 pr-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {job.seniority}
                  </span>
                </td>
                <td className="py-3.5 pr-3 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {job.requiredCompetencies.slice(0, 2).map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px]"
                      >
                        {c}
                      </span>
                    ))}
                    {job.requiredCompetencies.length > 2 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.requiredCompetencies.length - 2} more
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 pr-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs">
                    <Users className="w-3 h-3" />
                    {job.activeCandidatesCount} Candidates
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/recruiter/candidates?role=${encodeURIComponent(job.title)}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <span>Pipeline</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
