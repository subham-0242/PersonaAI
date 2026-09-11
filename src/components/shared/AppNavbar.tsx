'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const AppNavbar: React.FC = () => {
  const {
    currentUser,
    toggleMobileSidebar,
    isDesktopSidebarCollapsed,
    toggleDesktopSidebar,
    sessionStatus,
  } = useAppStore();
  const pathname = usePathname();

  // Determine current section breadcrumb & view title
  const getViewDetails = () => {
    if (pathname.includes('/candidate/dashboard')) {
      return { section: 'Candidate Workspace', title: 'Dashboard Overview', badge: 'Readiness 84%' };
    }
    if (pathname.includes('/candidate/onboarding')) {
      return { section: 'Candidate Workspace', title: 'Calibration & Consent', badge: 'Step 1 of 3' };
    }
    if (pathname.includes('/candidate/simulation')) {
      return {
        section: 'Voice Arena',
        title: 'Adaptive Multi-Agent Stage',
        badge: sessionStatus === 'ACTIVE' ? 'LIVE SESSION' : 'READY',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        pulse: true,
      };
    }
    if (pathname.includes('/candidate/passport')) {
      return {
        section: 'Verification Engine',
        title: 'Competency Passport',
        badge: 'PASSPORT-2026-X89B',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (pathname.includes('/recruiter/dashboard')) {
      return { section: 'Recruiter Suite', title: 'Talent Screening HUD', badge: 'Apex Labs' };
    }
    if (pathname.includes('/recruiter/jobs/new')) {
      return { section: 'Role Engineering', title: 'Create Role Competency Pack', badge: 'New Job' };
    }
    if (pathname.includes('/recruiter/candidates')) {
      return { section: 'Talent Pipeline', title: 'Verified Candidates Queue', badge: '142 Screened' };
    }
    if (pathname.includes('/recruiter/audit')) {
      return {
        section: 'Verification Audit',
        title: 'Evidence Audit Room',
        badge: 'SPLIT-SCREEN',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    if (pathname.includes('/institution/dashboard')) {
      return { section: 'Academic Intelligence', title: 'Campus Analytics & Cohort Gap', badge: 'NIT CSE 2026' };
    }
    return { section: 'PersonaPanel AI', title: 'Competency Intelligence', badge: 'v2.4' };
  };

  const view = getViewDetails();

  const roleMeta = {
    CANDIDATE: {
      label: 'Candidate',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: UserCheck,
    },
    RECRUITER: {
      label: 'Recruiter',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      icon: Briefcase,
    },
    INSTITUTION_ADMIN: {
      label: 'College Admin',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: GraduationCap,
    },
  };

  const currentRole = roleMeta[currentUser.role];
  const RoleIcon = currentRole.icon;

  return (
    <header className="w-full bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20">
      <div className="px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left Side: Mobile Hamburger & Desktop Toggle + Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          {/* Mobile Hamburger Button (visible on phone/tablet) */}
          <button
            id="open-mobile-sidebar-btn"
            onClick={() => toggleMobileSidebar()}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 -ml-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold sm:inline hidden">Menu</span>
          </button>

          {/* Desktop Toggle Button */}
          <button
            id="desktop-toggle-sidebar-btn"
            onClick={toggleDesktopSidebar}
            aria-label={isDesktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isDesktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {isDesktopSidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Breadcrumb / Page Title */}
          <div className="min-w-0 flex items-center gap-1.5 text-xs">
            <span className="hidden sm:inline font-medium text-slate-400 truncate">
              {view.section}
            </span>
            <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-bold text-slate-100 truncate text-sm sm:text-base">
              {view.title}
            </span>

            {view.badge && (
              <span
                className={`hidden md:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ml-1.5 ${
                  view.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                } ${view.pulse ? 'animate-pulse' : ''}`}
              >
                {view.pulse && <Radio className="w-2.5 h-2.5 text-rose-400" />}
                <span>{view.badge}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action, Active Role Pill & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Active Role Tag */}
          <div
            className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${currentRole.badge}`}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{currentRole.label}</span>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle variant="compact" />

          {/* User Profile Mini Block */}
          <Link
            href="/login"
            className="flex items-center gap-2 group p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-800/80 transition-colors"
            title="Switch User / Role Profile"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:border-emerald-500/50 transition-colors">
                {currentUser.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </div>

            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">
                {currentUser.title.split('&')[0]}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

