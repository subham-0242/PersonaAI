'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useAppStore, DEFAULT_USERS } from '@/src/store/useAppStore';
import { ThemeToggle } from '@/src/components/shared/ThemeToggle';
import { UserRole } from '@/src/types';
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, setRole, initTheme } = useAppStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    if (role === 'CANDIDATE') router.push('/candidate/dashboard');
    else if (role === 'RECRUITER') router.push('/recruiter/dashboard');
    else if (role === 'INSTITUTION_ADMIN') router.push('/institution/dashboard');
  };

  const cards = [
    {
      role: 'CANDIDATE' as UserRole,
      title: 'Candidate / Engineer',
      subtitle: 'Enter Simulations, View Passport & Skill Gaps',
      personaName: 'Aarav Sharma',
      personaTitle: 'Senior Distributed Systems Candidate',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      icon: UserCheck,
      color: 'emerald',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold',
      bullets: [
        'Live multi-agent voice arena with AI panelists',
        'Cryptographic competency passport (SHA-256)',
        'Evidence citations & verbatim audio bookmarks',
      ],
    },
    {
      role: 'RECRUITER' as UserRole,
      title: 'Recruiter / Enterprise',
      subtitle: 'Configure Role Packs, Audit Verified Passports',
      personaName: 'Elena Rostova',
      personaTitle: 'Tech Talent Partner — Apex Recruiting',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      icon: Briefcase,
      color: 'violet',
      borderColor: 'border-violet-500/40 hover:border-violet-400 hover:shadow-violet-500/20',
      accentBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      buttonBg: 'bg-violet-600 hover:bg-violet-500 text-white font-bold',
      bullets: [
        'Custom role pack weighting sliders (100% sum)',
        'Dual-pane audit room with verbatim cross-checks',
        'Instant human final round shortlisting',
      ],
    },
    {
      role: 'INSTITUTION_ADMIN' as UserRole,
      title: 'Institution / University',
      subtitle: 'Cohort Skill Analytics & Curriculum Diagnostics',
      personaName: 'Dr. Ramesh Sundaram',
      personaTitle: 'Dean of Engineering — CSE Department',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      icon: GraduationCap,
      color: 'amber',
      borderColor: 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20',
      accentBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      buttonBg: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      bullets: [
        '620-student cohort employability index (78.4%)',
        'Student vs Industry benchmark radar charts',
        'Automated curriculum & syllabus gap alerts',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Top Bar with Brand & Theme Switcher */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-100 text-sm tracking-tight">PersonaPanel AI</span>
        </div>

        <ThemeToggle variant="pill" />
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center relative z-10">
        {/* Brand Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Autonomous Workplace Simulations & Attestation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 leading-tight">
            PersonaPanel AI
          </h1>
          <p className="text-sm sm:text-lg text-slate-400 mt-2 font-medium">
            Verified Competency Intelligence Platform
          </p>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
            Select a workspace role below to explore live adaptive simulations, cryptographic competency passports, recruiter talent audit rooms, and university cohort analytics.
          </p>
        </div>

        {/* 3 Visual Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const isSelected = currentUser.role === card.role;

            return (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                onClick={() => handleSelectRole(card.role)}
                className={`p-6 rounded-2xl bg-slate-900/80 border-2 cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between relative group ${
                  card.borderColor
                } ${isSelected ? 'ring-2 ring-emerald-500/50 bg-slate-900' : ''}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className={`p-3 rounded-xl border ${card.accentBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium leading-relaxed">
                    {card.subtitle}
                  </p>

                  {/* Persona Default Avatar Pill */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={card.avatar} alt={card.personaName} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">{card.personaName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{card.personaTitle}</div>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-400">
                    {card.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <button
                    id={`login-select-role-${card.role.toLowerCase()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(card.role);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 group-hover:scale-[1.02] ${card.buttonBg}`}
                  >
                    <span>Launch as {card.personaName.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive state persisted in local session • Switch roles instantly anytime via the top bar</span>
        </div>
      </div>
    </div>
  );
}
