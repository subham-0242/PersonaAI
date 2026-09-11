'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Compass,
  Mic,
  FileBadge,
  Layers,
  PlusCircle,
  Users,
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  UserCheck,
  Briefcase,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  LogOut,
  Radio,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    currentUser,
    setRole,
    isMobileSidebarOpen,
    closeMobileSidebar,
    isDesktopSidebarCollapsed,
    toggleDesktopSidebar,
    sessionStatus,
  } = useAppStore();

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        closeMobileSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  // Navigation Items per Role
  const getNavLinks = () => {
    switch (currentUser.role) {
      case 'CANDIDATE':
        return [
          {
            href: '/candidate/dashboard',
            label: 'Dashboard Overview',
            shortLabel: 'Overview',
            icon: Compass,
            description: 'Readiness score & radar',
          },
          {
            href: '/candidate/onboarding',
            label: 'Calibration & Consent',
            shortLabel: 'Calibration',
            icon: Layers,
            description: 'Resume upload & mic check',
          },
          {
            href: '/candidate/simulation',
            label: 'Live Voice Arena',
            shortLabel: 'Voice Arena',
            icon: Mic,
            description: '3-agent adaptive panel',
            badge: sessionStatus === 'ACTIVE' ? 'LIVE' : 'SIM',
            badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            pulse: true,
          },
          {
            href: '/candidate/passport/PASSPORT-2026-X89B',
            label: 'Verified Passport',
            shortLabel: 'Passport',
            icon: FileBadge,
            description: 'SHA-256 evidence audit',
            badge: 'VERIFIED',
            badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          },
        ];
      case 'RECRUITER':
        return [
          {
            href: '/recruiter/dashboard',
            label: 'Talent Dashboard',
            shortLabel: 'Dashboard',
            icon: BarChart3,
            description: 'Role metrics & top queue',
          },
          {
            href: '/recruiter/jobs/new',
            label: 'Create Role Pack',
            shortLabel: 'New Role',
            icon: PlusCircle,
            description: 'Weighted competency sliders',
            badge: 'NEW',
            badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
          },
          {
            href: '/recruiter/candidates',
            label: 'Verified Candidates',
            shortLabel: 'Candidates',
            icon: Users,
            description: 'Screened talent pool',
          },
          {
            href: '/recruiter/audit/cand-001',
            label: 'Evidence Audit Room',
            shortLabel: 'Audit Room',
            icon: ShieldCheck,
            description: 'Verbatim split-screen audit',
            badge: 'AUDIT',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          },
        ];
      case 'INSTITUTION_ADMIN':
        return [
          {
            href: '/institution/dashboard',
            label: 'Cohort Analytics',
            shortLabel: 'Analytics',
            icon: BarChart3,
            description: 'Department batch metrics',
          },
          {
            href: '/institution/dashboard#radar',
            label: 'Industry Gap Radar',
            shortLabel: 'Gap Radar',
            icon: Compass,
            description: 'NIT CSE vs market benchmark',
          },
          {
            href: '/institution/dashboard#curriculum',
            label: 'Curriculum Diagnostics',
            shortLabel: 'Curriculum',
            icon: BookOpenCheck,
            description: 'Actionable syllabus gaps',
            badge: 'ALERT',
            badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          },
          {
            href: '/institution/dashboard#students',
            label: 'Student Directory',
            shortLabel: 'Directory',
            icon: Users,
            description: '620 assessed candidates',
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  const roleMeta = {
    CANDIDATE: {
      label: 'Candidate Mode',
      shortLabel: 'Candidate',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: UserCheck,
      color: 'emerald',
      accentBg: 'from-emerald-500/10 to-teal-500/5',
      indicator: 'bg-emerald-400',
    },
    RECRUITER: {
      label: 'Recruiter Mode',
      shortLabel: 'Recruiter',
      badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
      icon: Briefcase,
      color: 'violet',
      accentBg: 'from-violet-500/10 to-purple-500/5',
      indicator: 'bg-violet-400',
    },
    INSTITUTION_ADMIN: {
      label: 'College Admin',
      shortLabel: 'College',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: GraduationCap,
      color: 'amber',
      accentBg: 'from-amber-500/10 to-orange-500/5',
      indicator: 'bg-amber-400',
    },
  };

  const currentRole = roleMeta[currentUser.role];

  // Helper for Link active check
  const isLinkActive = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (typeof window !== 'undefined') {
        return pathname === path && window.location.hash === `#${hash}`;
      }
      return pathname === path;
    }
    return pathname === href;
  };

  // Reusable Sidebar Content to share between Mobile Drawer and Desktop Sidebar
  const renderSidebarContent = (isCollapsed = false) => {
    return (
      <div className="flex flex-col h-full justify-between select-none">
        {/* Top: Brand Header & Mode Badge */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/login"
              onClick={closeMobileSidebar}
              className="flex items-center gap-2.5 group overflow-hidden"
              title="PersonaPanel AI - Home & Role Switcher"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-black tracking-tight text-slate-100 truncate">
                      PersonaPanel
                    </span>
                    <span className="text-[9px] uppercase font-black tracking-widest px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      v2.4
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    Verified Competency AI
                  </p>
                </div>
              )}
            </Link>

            {/* Mobile Close Button (only on phone) */}
            <button
              id="close-mobile-sidebar-btn"
              onClick={closeMobileSidebar}
              aria-label="Close navigation sidebar"
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Collapse Toggle Button */}
            <button
              id="desktop-collapse-sidebar-btn"
              onClick={toggleDesktopSidebar}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-emerald-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Active Role Card / Pill */}
          {!isCollapsed ? (
            <div className={`mt-3.5 p-2.5 rounded-xl border bg-gradient-to-br ${currentRole.accentBg} ${currentRole.badge}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-900/80 flex items-center justify-center flex-shrink-0">
                    <currentRole.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider leading-none text-slate-300">
                      Active Workspace
                    </div>
                    <div className="text-xs font-bold text-slate-100 truncate mt-0.5">
                      {currentRole.label}
                    </div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="mt-3 flex justify-center" title={currentRole.label}>
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <currentRole.icon className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation Menu
              </div>
            )}

            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileSidebar}
                    title={isCollapsed ? link.label : undefined}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      active
                        ? 'bg-slate-800 text-emerald-300 shadow-md border border-slate-700/80'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    {/* Active left indicator pill */}
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                    )}

                    <div
                      className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                        active
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{link.label}</span>
                          {link.badge && (
                            <span
                              className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded border ${
                                link.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                              } ${link.pulse ? 'animate-pulse' : ''}`}
                            >
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <div className="text-[10px] text-slate-400 font-normal truncate">
                            {link.description}
                          </div>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Perspective Switching Section */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Switch Perspective</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </div>

              <div className="grid grid-cols-3 gap-1.5 px-1">
                <button
                  id="sidebar-role-candidate"
                  onClick={() => setRole('CANDIDATE')}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    currentUser.role === 'CANDIDATE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                  title="Candidate: Aarav Sharma"
                >
                  <UserCheck className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
                  <span className="text-[10px] font-bold block leading-none">Candidate</span>
                </button>

                <button
                  id="sidebar-role-recruiter"
                  onClick={() => setRole('RECRUITER')}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    currentUser.role === 'RECRUITER'
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/50 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                  title="Recruiter: Elena Rostova"
                >
                  <Briefcase className="w-3.5 h-3.5 mx-auto mb-1 text-violet-400" />
                  <span className="text-[10px] font-bold block leading-none">Recruiter</span>
                </button>

                <button
                  id="sidebar-role-institution"
                  onClick={() => setRole('INSTITUTION_ADMIN')}
                  className={`p-2 rounded-lg text-center transition-all border ${
                    currentUser.role === 'INSTITUTION_ADMIN'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                  title="Dean: Dr. Ramesh Sundaram"
                >
                  <GraduationCap className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400" />
                  <span className="text-[10px] font-bold block leading-none">College</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Context Action */}
          {!isCollapsed && currentUser.role === 'CANDIDATE' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300 text-[11px]">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Simulation Status</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Voice pipeline primed with sub-180ms telemetry.
              </p>
              <Link
                href="/candidate/simulation"
                onClick={closeMobileSidebar}
                className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Mic className="w-3 h-3" />
                <span>Enter Arena</span>
              </Link>
            </div>
          )}

          {!isCollapsed && currentUser.role === 'RECRUITER' && (
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-violet-300 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Audit Pipeline</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                142 verified candidates waiting for decision review.
              </p>
              <Link
                href="/recruiter/audit/cand-001"
                onClick={closeMobileSidebar}
                className="mt-2.5 w-full py-1.5 px-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Open Audit Split</span>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom: Theme Toggle & User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          {/* Theme Toggle Switch */}
          {!isCollapsed ? (
            <ThemeToggle variant="switch" className="mb-2.5" />
          ) : (
            <div className="flex justify-center mb-2.5">
              <ThemeToggle variant="compact" />
            </div>
          )}

          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-2`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-xl border border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
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
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {currentUser.title}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <Link
                href="/login"
                onClick={closeMobileSidebar}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title="Log out or switch user"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Telemetry: Online</span>
              </span>
              <span className="font-mono text-[9px] text-slate-400">182ms</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Mobile Backdrop Overlay (Only visible when mobile drawer is open) */}
      {isMobileSidebarOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={closeMobileSidebar}
          aria-hidden="true"
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
        />
      )}

      {/* 2. Mobile Sidebar Drawer (Slides in on phone/tablet) */}
      <aside
        id="mobile-navigation-sidebar"
        aria-label="Mobile Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 3. Desktop Persistent Closable/Collapsible Sidebar (Only on large screens) */}
      <aside
        id="desktop-navigation-sidebar"
        aria-label="Desktop Navigation"
        className={`hidden lg:flex flex-col flex-shrink-0 bg-slate-900/90 border-r border-slate-800/80 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 ${
          isDesktopSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(isDesktopSidebarCollapsed)}
      </aside>
    </>
  );
};
