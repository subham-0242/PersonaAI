'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import {
  WeightingSliders,
  CompetencyWeights,
  ActivePersonas,
} from '@/src/components/recruiter/WeightingSliders';
import { useAppStore } from '@/src/store/useAppStore';
import { Briefcase, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function NewRolePackPage() {
  const router = useRouter();
  const { addJobSpec } = useAppStore();

  const [jobTitle, setJobTitle] = useState('Staff Site Reliability & FinOps Architect');
  const [department, setDepartment] = useState('Platform Infrastructure');
  const [seniority, setSeniority] = useState('Staff');
  const [weights, setWeights] = useState<CompetencyWeights>({
    systemDesign: 35,
    databaseOptimization: 20,
    codingLogic: 15,
    productMindset: 15,
    ownership: 15,
  });
  const [personas, setPersonas] = useState<ActivePersonas>({
    techLead: true,
    productManager: true,
    hiringManager: true,
    domainCustomer: false,
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const totalWeight =
    weights.systemDesign +
    weights.databaseOptimization +
    weights.codingLogic +
    weights.productMindset +
    weights.ownership;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      alert(`The total competency weights must equal exactly 100% (Currently ${totalWeight}%). Please adjust or click Auto-Balance.`);
      return;
    }

    setIsDeploying(true);
    setTimeout(() => {
      addJobSpec({
        title: jobTitle,
        department,
        seniority: seniority as 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff',
        requiredCompetencies: [
          'Distributed Consensus',
          'Kubernetes & SRE',
          'FinOps Cloud Economics',
          'Incident Command',
        ],
        activeCandidatesCount: 0,
        weights: {
          systemDesign: weights.systemDesign,
          databaseOptimization: weights.databaseOptimization,
          codingLogic: weights.codingLogic,
          productMindset: weights.productMindset,
          ownership: weights.ownership,
        },
        activePersonas: personas,
        createdDate: '2026-09-10',
      });
      setIsDeploying(false);
      router.push('/recruiter/dashboard');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 w-full">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/recruiter/dashboard" className="hover:text-slate-200 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Recruiter Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-violet-400 font-semibold">New Role Pack</span>
        </div>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Create Role Competency Pack
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Calibrate multi-agent interview rubrics, assign algorithmic weights, and choose active persona evaluators.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Job Details */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-violet-400" />
              Role Identity & Level
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Job Role Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Engineering Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Target Seniority
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                >
                  <option>Associate / Graduate</option>
                  <option>Mid-Level Engineer</option>
                  <option>Senior Engineer</option>
                  <option>Staff / Principal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Weighting Sliders & Persona Selectors */}
          <WeightingSliders
            weights={weights}
            onChangeWeights={setWeights}
            personas={personas}
            onChangePersonas={setPersonas}
          />

          {/* Bottom Action Submit Bar */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <Link
              href="/recruiter/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
            >
              Cancel
            </Link>

            <button
              type="submit"
              id="deploy-role-pack-btn"
              disabled={isDeploying || totalWeight !== 100}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-xl transition-all flex items-center gap-2 ${
                totalWeight === 100
                  ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDeploying ? 'Deploying Autonomous Evaluators...' : 'Save & Deploy Role Competency Pack'}</span>
            </button>
          </div>
        </form>
      </main>
    </DashboardLayout>
  );
}
