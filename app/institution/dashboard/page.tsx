'use client';

import React from 'react';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { RadarChart } from '@/src/components/shared/RadarChart';
import { CohortOverview } from '@/src/components/institution/CohortOverview';
import { CurriculumGaps } from '@/src/components/institution/CurriculumGaps';
import { StudentDirectory } from '@/src/components/institution/StudentDirectory';
import { useAppStore } from '@/src/store/useAppStore';
import { Award, TrendingUp, BookOpenCheck, ArrowRight } from 'lucide-react';

export default function InstitutionDashboardPage() {
  const { cohortData, cohortStudents } = useAppStore();

  const cohortRadarData = cohortData.competencyRadarData.map((c) => ({
    label: c.competency.split('&')[0].trim(),
    value: c.studentAverage,
    secondaryValue: c.industryBenchmark,
  }));

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Department Overview & Key Stat Tiles */}
        <CohortOverview cohort={cohortData} />

        {/* Cohort vs Industry Benchmark Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Cohort Average vs Industry Hiring Benchmark
                </h3>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Batch 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Multidimensional competency distribution of 620 assessed CSE undergraduates against Senior/Junior hire benchmarks
              </p>
            </div>

            <div className="py-2 flex justify-center">
              <RadarChart
                data={cohortRadarData}
                size={340}
                primaryLabel="Cohort Average"
                secondaryLabel="Industry Benchmark"
                primaryColor="#f59e0b"
                secondaryColor="#10b981"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Data source: Autonomous Workplace Simulation Rounds</span>
              <a href="#students" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
                <span>View Student Roster</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Competency Gap Breakdown List (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Benchmark Competency Gap Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Relative performance deltas across major engineering domains
              </p>
            </div>

            <div className="space-y-3">
              {cohortData.competencyRadarData.map((item, idx) => {
                const delta = item.studentAverage - item.industryBenchmark;
                const isPositive = delta >= 0;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{item.competency}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-slate-100">{item.studentAverage}%</span>
                        <span className="text-[11px] text-slate-400">vs {item.industryBenchmark}%</span>
                        <span
                          className={`text-xs font-bold ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ({isPositive ? `+${delta}%` : `${delta}%`})
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                      <div
                        className={`h-full rounded-full ${
                          isPositive ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.studentAverage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="#curriculum"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpenCheck className="w-4 h-4 text-amber-400" />
              <span>Jump to Curriculum Action Alerts</span>
            </a>
          </div>
        </div>

        {/* Curriculum Gaps Diagnostics */}
        <CurriculumGaps gaps={cohortData.curriculumGaps} />

        {/* Student Roster Directory */}
        <StudentDirectory students={cohortStudents} />
      </main>
    </DashboardLayout>
  );
}
