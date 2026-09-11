'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import {
  UserCheck,
  Briefcase,
  GraduationCap,
  RotateCcw,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Mic,
  FileCheck2,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const GlobalDemoBar: React.FC = () => {
  const { currentUser, setRole, resetDemoState } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setDropdownOpen(false);
    if (role === 'CANDIDATE') router.push('/candidate/dashboard');
    else if (role === 'RECRUITER') router.push('/recruiter/dashboard');
    else if (role === 'INSTITUTION_ADMIN') router.push('/institution/dashboard');
  };

  const handleReset = () => {
    resetDemoState();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2000);
  };

  const roleConfig = {
    CANDIDATE: {
      label: 'Candidate',
      name: 'Aarav Sharma',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: UserCheck,
      home: '/candidate/dashboard',
    },
    RECRUITER: {
      label: 'Recruiter / Enterprise',
      name: 'Elena Rostova',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      icon: Briefcase,
      home: '/recruiter/dashboard',
    },
    INSTITUTION_ADMIN: {
      label: 'Institution Admin',
      name: 'Dr. Ramesh Sundaram',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: GraduationCap,
      home: '/institution/dashboard',
    },
  };

  const currentConfig = roleConfig[currentUser.role];
  const CurrentIcon = currentConfig.icon;

  return (
    <aside aria-label="Demo controls" className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Branding & Active Role Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 font-bold tracking-tight text-slate-100 hover:text-emerald-400 transition-colors"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="hidden sm:inline">PersonaPanel AI</span>
          </Link>

          <span className="text-slate-700">|</span>

          {/* Active Role Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 hidden md:inline">Active Mode:</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${currentConfig.badge}`}
            >
              <CurrentIcon className="w-3 h-3" />
              <span>Role: {currentConfig.label}</span>
            </span>
          </div>
        </div>

        {/* Center: Quick Flow Links */}
        <div className="hidden lg:flex items-center gap-1 text-[11px]">
          <Link
            href="/candidate/dashboard"
            className={`px-2 py-1 rounded transition-colors ${
              pathname.includes('/candidate')
                ? 'bg-slate-800 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidate Flow
          </Link>
          <Link
            href="/candidate/simulation"
            className="px-2 py-1 rounded text-slate-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <Mic className="w-2.5 h-2.5" />
            Live Arena
          </Link>
          <Link
            href="/candidate/passport/PASSPORT-2026-X89B"
            className="px-2 py-1 rounded text-slate-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <ShieldCheck className="w-2.5 h-2.5" />
            Passport
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/recruiter/dashboard"
            className={`px-2 py-1 rounded transition-colors ${
              pathname.includes('/recruiter')
                ? 'bg-slate-800 text-violet-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recruiter Pack & Audit
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/institution/dashboard"
            className={`px-2 py-1 rounded transition-colors ${
              pathname.includes('/institution')
                ? 'bg-slate-800 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            College Analytics
          </Link>
        </div>

        {/* Right: Quick Role Switcher Dropdown & Reset State */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              id="role-dropdown-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs transition-colors"
            >
              <span>Switch Role</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 rounded-lg bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Simulate Role Perspective
                </div>
                <button
                  id="switch-role-candidate"
                  onClick={() => handleRoleChange('CANDIDATE')}
                  className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-2.5 transition-colors ${
                    currentUser.role === 'CANDIDATE'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Candidate (Aarav Sharma)</div>
                    <div className="text-[10px] text-slate-400">Adaptive voice arena & verified passport</div>
                  </div>
                </button>

                <button
                  id="switch-role-recruiter"
                  onClick={() => handleRoleChange('RECRUITER')}
                  className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-2.5 transition-colors mt-1 ${
                    currentUser.role === 'RECRUITER'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  <div>
                    <div className="font-semibold text-slate-100">Recruiter (Elena Rostova)</div>
                    <div className="text-[10px] text-slate-400">Competency packs & candidate audit room</div>
                  </div>
                </button>

                <button
                  id="switch-role-institution"
                  onClick={() => handleRoleChange('INSTITUTION_ADMIN')}
                  className={`w-full text-left px-2.5 py-2 rounded-md flex items-center gap-2.5 transition-colors mt-1 ${
                    currentUser.role === 'INSTITUTION_ADMIN'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-100">College / Dean (NIT CSE)</div>
                    <div className="text-[10px] text-slate-400">Cohort skill gaps & curriculum alerts</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle variant="pill" />

          {/* Reset Demo State Button */}
          <button
            id="reset-demo-state-btn"
            onClick={handleReset}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs transition-all ${
              resetFeedback
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Reset simulation transcripts, metrics, and state back to default"
          >
            <RotateCcw className={`w-3 h-3 ${resetFeedback ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{resetFeedback ? 'Reset Complete' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
