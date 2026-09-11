'use client';

import React from 'react';
import { InstitutionalCohortData } from '../../types';
import { BookOpenCheck, AlertTriangle, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';

interface CurriculumGapsProps {
  gaps: InstitutionalCohortData['curriculumGaps'];
}

export const CurriculumGaps: React.FC<CurriculumGapsProps> = ({ gaps }) => {
  return (
    <div id="curriculum" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-amber-400" />
            Curriculum Gap Diagnostics & Syllabus Action Alerts
          </h3>
          <p className="text-xs text-slate-400">
            Real-time curriculum recommendations extracted from workplace simulation failure clusters
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
          3 Actionable Deficit Clusters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gaps.map((gap) => (
          <div
            key={gap.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    gap.severity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : gap.severity === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {gap.severity} DEFICIT
                </span>
                <span className="text-[11px] font-extrabold text-rose-400">
                  {gap.affectedPercentage}% of Cohort
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-2 leading-snug">{gap.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{gap.observation}</p>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Dean & Faculty Remediation:
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{gap.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
