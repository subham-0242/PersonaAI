'use client';

import React from 'react';
import { InstitutionalCohortData } from '../../types';
import { GraduationCap, Users, TrendingUp, Award, AlertTriangle, Building2 } from 'lucide-react';

interface CohortOverviewProps {
  cohort: InstitutionalCohortData;
}

export const CohortOverview: React.FC<CohortOverviewProps> = ({ cohort }) => {
  const cards = [
    {
      label: 'Students Assessed',
      value: `${cohort.studentsAssessed} / ${cohort.totalEnrolled}`,
      subtext: '88.5% Completion Rate',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Cohort Employability Index',
      value: `${cohort.employabilityIndex}%`,
      subtext: '+6.2% vs Batch 2025',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Top Verified Competency',
      value: `${cohort.topCompetency.score}%`,
      subtext: cohort.topCompetency.name,
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Primary Curriculum Deficit',
      value: `${cohort.primaryCurriculumDeficit.score}%`,
      subtext: cohort.primaryCurriculumDeficit.name,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Department Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                CAMPUS INTELLIGENCE HUD
              </span>
              <span className="text-xs text-slate-400">{cohort.batchName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 mt-1 tracking-tight">
              {cohort.institutionName}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{cohort.departmentName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase font-semibold">Campus Placement Readiness</div>
            <div className="text-xl font-black text-emerald-400">Class of 2026</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start justify-between shadow-xl backdrop-blur-md"
            >
              <div>
                <span className="text-xs font-semibold text-slate-400">{c.label}</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
                  {c.value}
                </div>
                <span className="text-[11px] text-slate-400 font-medium mt-1 block max-w-[180px] truncate">
                  {c.subtext}
                </span>
              </div>
              <div className={`p-3 rounded-xl border ${c.bg} ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
