'use client';

import React, { useState } from 'react';
import { CohortStudent } from '../../types';
import { Users, Search, Download, CheckCircle2, AlertCircle, Clock, ArrowUpDown } from 'lucide-react';

interface StudentDirectoryProps {
  students: CohortStudent[];
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CohortStudent['status']>('ALL');
  const [exportFeedback, setExportFeedback] = useState(false);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    setExportFeedback(true);
    setTimeout(() => {
      setExportFeedback(false);
      alert('Batch 2026 Verified Competency Report exported as CSV/PDF.');
    }, 1200);
  };

  return (
    <div id="students" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Student Cohort Performance Directory
          </h3>
          <p className="text-xs text-slate-400">
            Search individual verification statuses, skill breakdowns, and audit records
          </p>
        </div>

        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all self-start md:self-auto ${
            exportFeedback
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>{exportFeedback ? 'Generating Export...' : 'Export Batch Report (CSV)'}</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or roll number (e.g. Aarav, CS22B042)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setStatusFilter('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              statusFilter === 'VERIFIED'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setStatusFilter('NEEDS_REMEDIATION')}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              statusFilter === 'NEEDS_REMEDIATION'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            Needs Remediation
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <th className="pb-3 font-semibold">Student</th>
              <th className="pb-3 font-semibold">Roll No</th>
              <th className="pb-3 font-semibold text-center">Status</th>
              <th className="pb-3 font-semibold text-center">Readiness</th>
              <th className="pb-3 font-semibold text-center">Algo / DS</th>
              <th className="pb-3 font-semibold text-center">Sys Design</th>
              <th className="pb-3 font-semibold text-center">Database</th>
              <th className="pb-3 font-semibold text-center">FinOps / Cloud</th>
              <th className="pb-3 font-semibold text-right">Assessment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 font-bold text-slate-100">{s.name}</td>
                <td className="py-3 font-mono text-slate-400">{s.rollNumber}</td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      s.status === 'VERIFIED'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : s.status === 'NEEDS_REMEDIATION'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {s.status === 'VERIFIED' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {s.status === 'NEEDS_REMEDIATION' && <AlertCircle className="w-3 h-3 text-rose-400" />}
                    {s.status === 'IN_PROGRESS' && <Clock className="w-3 h-3 text-amber-400" />}
                    <span>{s.status}</span>
                  </span>
                </td>
                <td className="py-3 text-center">
                  <span className="font-extrabold text-sm text-emerald-400">{s.readinessScore}%</span>
                </td>
                <td className="py-3 text-center font-mono text-slate-300">{s.competencies.algoProblemSolving}%</td>
                <td className="py-3 text-center font-mono">
                  <span className={s.competencies.systemDesign < 60 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {s.competencies.systemDesign}%
                  </span>
                </td>
                <td className="py-3 text-center font-mono text-slate-300">{s.competencies.databaseSql}%</td>
                <td className="py-3 text-center font-mono">
                  <span className={s.competencies.devopsCloud < 60 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {s.competencies.devopsCloud}%
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-slate-400">{s.lastAssessmentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
