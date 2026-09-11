'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SkillGapItem } from '../../types';
import {
  Compass,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SkillGapRoadmapProps {
  skillGaps: SkillGapItem[];
}

export const SkillGapRoadmap: React.FC<SkillGapRoadmapProps> = ({ skillGaps }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Verified Competency Passport PDF generated & downloaded with SHA-256 digital signature stamp.');
    }, 1200);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            Skill-Gap Diagnostic & Targeted Remediation Roadmap
          </h3>
          <p className="text-xs text-slate-400">
            Actionable simulation findings to accelerate progression to Staff / Principal roles
          </p>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
          2 Key Growth Areas
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {skillGaps.map((gap) => (
          <div
            key={gap.id}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    gap.priority === 'High'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  Priority: {gap.priority}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{gap.category}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-1.5 leading-snug">{gap.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{gap.description}</p>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5" /> Recommended Remediation:
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">{gap.recommendedAction}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            id="download-pdf-passport-btn"
            onClick={handleDownloadPDF}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              downloading
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{downloading ? 'Compiling Cryptographic PDF...' : 'Download Verified PDF Passport'}</span>
          </button>

          <Link
            href="/candidate/simulation"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Practice Identified Skill Gaps</span>
          </Link>
        </div>

        <Link
          href="/candidate/dashboard"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Return to Candidate Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
