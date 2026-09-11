'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { RadarChart } from '@/src/components/shared/RadarChart';
import { useAppStore } from '@/src/store/useAppStore';
import { mockPastSimulations } from '@/src/mock/mockCandidate';
import {
  ShieldCheck,
  Award,
  Zap,
  Clock,
  Briefcase,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function CandidateDashboardPage() {
  const { currentUser, currentPassport } = useAppStore();

  const radarData = currentPassport.competencies.map((c) => ({
    label: c.name.split('&')[0].trim(),
    value: c.score,
    secondaryValue: c.benchmark,
  }));

  const stats = [
    {
      label: 'Verified Competencies',
      value: '6 Verified',
      subtext: 'High-confidence attestation',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Workplace Simulations',
      value: '4 Rounds',
      subtext: 'Multi-agent stress tests',
      icon: Zap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Last Verification Date',
      value: 'September 2026',
      subtext: 'SHA-256 attested',
      icon: Calendar,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      label: 'Active Job Matches',
      value: '3 High-Fit Roles',
      subtext: 'Matched by verified skills',
      icon: Briefcase,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                VERIFIED TALENT DOSSIER
              </span>
              <span className="text-xs text-slate-400 font-medium">Candidate ID: {currentUser.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Welcome back, {currentUser.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Role: <strong className="text-slate-100">{currentUser.title}</strong></span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Readiness Index: <strong className="text-emerald-400 font-extrabold">{currentPassport.overallReadinessIndex}%</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/candidate/onboarding"
              id="dashboard-launch-sim-btn"
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Launch New Simulation</span>
            </Link>

            <Link
              href="/candidate/passport/PASSPORT-2026-X89B"
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>View Verified Passport</span>
            </Link>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start justify-between shadow-xl backdrop-blur-md"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                  <div className="text-xl sm:text-2xl font-black text-slate-100 mt-1 tracking-tight">
                    {s.value}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">{s.subtext}</span>
                </div>
                <div className={`p-3 rounded-xl border ${s.bg} ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Competency Radar & Summary Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart Visualizer (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  Competency Radar & Verified Attestation
                </h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SHA-256 Signed
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Multidimensional benchmark comparison across simulated system design, concurrency, and ROI challenges
              </p>
            </div>

            <div className="py-2 flex justify-center">
              <RadarChart
                data={radarData}
                size={340}
                primaryLabel="Aarav's Score"
                secondaryLabel="Senior Benchmark"
                primaryColor="#10b981"
                secondaryColor="#8b5cf6"
              />
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Attested by 3 Autonomous AI Panelists</span>
              <Link
                href="/candidate/passport/PASSPORT-2026-X89B"
                className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Full Evidence Drill-down</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Competency Breakdown Cards (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-400" />
                Evaluated Competency Dimensions
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed scores and evidence points extracted from simulation turns
              </p>
            </div>

            <div className="space-y-3">
              {currentPassport.competencies.map((comp) => {
                const delta = comp.score - comp.benchmark;
                return (
                  <div
                    key={comp.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{comp.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {comp.category}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-black text-emerald-400">{comp.score}%</span>
                        <span className="text-[10px] text-slate-400">({delta >= 0 ? `+${delta}%` : `${delta}%`})</span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>{comp.evidencePointsCount} Verbatim Evidence Citations</span>
                      <span className="text-emerald-400 font-medium">Confidence: {comp.confidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/candidate/passport/PASSPORT-2026-X89B"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Audit Evidence Quotes in Verified Passport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Simulation History */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Recent Simulation History
              </h3>
              <p className="text-xs text-slate-400">
                Log of adaptive workplace rounds evaluated with multi-role cross-examination
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Total 4 Completed Assessments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-semibold">Simulation Title</th>
                  <th className="pb-3 font-semibold">Role Tested</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-center">Score & Delta</th>
                  <th className="pb-3 font-semibold text-center">Consensus Verdict</th>
                  <th className="pb-3 font-semibold text-right">Passport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockPastSimulations.map((sim) => (
                  <tr key={sim.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-slate-100">{sim.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{sim.id}</div>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-300">{sim.role}</td>
                    <td className="py-3.5 pr-3 text-slate-400">{sim.date}</td>
                    <td className="py-3.5 pr-3 text-center">
                      <span className="font-bold text-slate-100 text-sm">{sim.score}%</span>
                      <span className={`text-[11px] font-semibold ml-1.5 ${sim.delta.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sim.delta}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          sim.verdict === 'STRONG HIRE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : sim.verdict === 'LEAN HIRE'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{sim.verdict}</span>
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/candidate/passport/${sim.passportId}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <span>Passport</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Ready to verify higher concurrency or new skill sets?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Calibrate your microphone and enter an adaptive simulation arena with autonomous AI panelists.
            </p>
          </div>
          <Link
            href="/candidate/onboarding"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0"
          >
            <span>Launch New Verified Workplace Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </DashboardLayout>
  );
}
