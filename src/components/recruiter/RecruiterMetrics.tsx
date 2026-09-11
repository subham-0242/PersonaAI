'use client';

import React from 'react';
import { Briefcase, Users, Clock, Target } from 'lucide-react';

export const RecruiterMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Active Job Openings',
      value: '4',
      subtext: '3 Core Packs Configured',
      icon: Briefcase,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'Verified Candidates Screened',
      value: '142',
      subtext: '+28 this week',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Engineering Hours Saved',
      value: '355 hrs',
      subtext: 'Equivalent to 8.8 Senior Dev weeks',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Average Candidate Match',
      value: '79%',
      subtext: 'High-signal attestation',
      icon: Target,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start justify-between shadow-xl backdrop-blur-md"
          >
            <div>
              <span className="text-xs font-semibold text-slate-400">{m.label}</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
                {m.value}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">{m.subtext}</span>
            </div>
            <div className={`p-3 rounded-xl border ${m.bg} ${m.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
