import { create } from 'zustand';
import {
  UserRole,
  UserProfile,
  SessionStatus,
  ActiveSpeaker,
  LiveMetrics,
  PendingHandoff,
  TranscriptEntry,
  JobRolePack,
  RecruiterCandidateRecord,
  InstitutionalCohortData,
  CohortStudent,
  VerifiedPassport,
} from '../types';
import { initialMockTranscripts } from '../mock/mockTranscripts';
import { mockVerifiedPassport, mockCandidateProfile } from '../mock/mockCandidate';
import { mockRolePacks, mockRecruiterCandidates } from '../mock/mockRolePacks';
import { mockInstitutionalData, mockCohortStudents } from '../mock/mockInstitutionalData';

export interface DefaultUsers {
  CANDIDATE: UserProfile;
  RECRUITER: UserProfile;
  INSTITUTION_ADMIN: UserProfile;
}

export const DEFAULT_USERS: DefaultUsers = {
  CANDIDATE: {
    id: 'usr-aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@domain.dev',
    role: 'CANDIDATE',
    title: 'Senior Distributed Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'FinTech Core Labs',
  },
  RECRUITER: {
    id: 'usr-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@techhire.global',
    role: 'RECRUITER',
    title: 'Tech Talent Partner',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'Apex Engineering Recruiting',
  },
  INSTITUTION_ADMIN: {
    id: 'usr-dean',
    name: 'Dr. Ramesh Sundaram',
    email: 'dean.engg@nit.ac.in',
    role: 'INSTITUTION_ADMIN',
    title: 'Dean of Engineering — CSE Dept',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    organization: 'National Institute of Technology',
  },
};

interface AppState {
  // Auth & User
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;

  // Simulation & Voice Arena
  sessionStatus: SessionStatus;
  activeSpeaker: ActiveSpeaker;
  difficultyLevel: number; // 1 to 5
  isMicMuted: boolean;
  isInterrupted: boolean;
  interruptionMessage: string | null;
  liveMetrics: LiveMetrics;
  pendingHandoff: PendingHandoff | null;
  transcripts: TranscriptEntry[];
  sessionTimerSeconds: number;
  isHUDOpen: boolean;

  // Theme Mode
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  initTheme: () => void;

  // Navigation & Responsive Sidebar
  isMobileSidebarOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
  toggleMobileSidebar: (open?: boolean) => void;
  closeMobileSidebar: () => void;
  toggleDesktopSidebar: () => void;

  // Sound effects simulation
  audioPlayingTimestamp: string | null;

  // Recruiter Data
  activeJobs: JobRolePack[];
  recruiterCandidates: RecruiterCandidateRecord[];

  // Institutional Data
  cohortData: InstitutionalCohortData;
  cohortStudents: CohortStudent[];

  // Candidate Passport
  currentPassport: VerifiedPassport;

  // Actions
  toggleHUD: (open?: boolean) => void;
  startSimulation: () => void;
  finishSimulation: () => void;
  toggleMic: () => void;
  simulateCandidateInterruption: () => void;
  simulatePersonaHandoff: (target?: ActiveSpeaker) => void;
  stepDifficulty: (direction: 'UP' | 'DOWN' | number) => void;
  triggerContradictionAlert: () => void;
  triggerVagueAnswerAlert: () => void;
  dismissInterruptionAlert: () => void;
  playAudioSnapshot: (timestamp: string) => void;
  resetDemoState: () => void;

  // Recruiter actions
  addJobSpec: (newJob: Partial<JobRolePack>) => void;
  updateCandidateStatus: (candidateId: string, status: RecruiterCandidateRecord['status']) => void;
  updateJobWeights: (jobId: string, weights: JobRolePack['weights']) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: DEFAULT_USERS.CANDIDATE,
  setRole: (role: UserRole) => {
    set({ currentUser: DEFAULT_USERS[role] });
  },

  // Simulation State
  sessionStatus: 'READY',
  activeSpeaker: 'TECH_LEAD',
  difficultyLevel: 3,
  isMicMuted: false,
  isInterrupted: false,
  interruptionMessage: null,
  sessionTimerSeconds: 252, // 04:12 in seconds
  isHUDOpen: false,
  audioPlayingTimestamp: null,

  liveMetrics: {
    techValid: true,
    businessImpactAddressed: false,
    ownershipClaimed: true,
    contradictionDetected: false,
    vagueResponseWarning: false,
    confidenceScore: 0.88,
  },

  pendingHandoff: {
    nextRole: 'Sarah - Lead Product Manager',
    reason: 'Candidate proposed multi-replica Redis with 2-replica ACKs; PM needs to probe AWS cross-AZ egress billing and customer SLA impact.',
    suggestedPrompt: 'Challenge the candidate on unit economics, p99 latency trade-offs, and merchant checkout conversion rates.',
  },

  transcripts: [...initialMockTranscripts],

  // Recruiter State
  activeJobs: [...mockRolePacks],
  recruiterCandidates: [...mockRecruiterCandidates],

  // Institutional State
  cohortData: { ...mockInstitutionalData },
  cohortStudents: [...mockCohortStudents],

  // Candidate Passport
  currentPassport: { ...mockVerifiedPassport },

  // Theme Mode
  theme: 'dark',
  setTheme: (theme: 'dark' | 'light') => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('personapanel_theme', theme);
      } catch {
        // localstorage might be blocked
      }
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
    set({ theme });
  },
  toggleTheme: () => {
    const current = get().theme;
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
  initTheme: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('personapanel_theme') as 'dark' | 'light' | null;
        const initialTheme = saved === 'light' ? 'light' : 'dark';
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
        set({ theme: initialTheme });
      } catch {
        // fallback
      }
    }
  },

  // Navigation & Responsive Sidebar
  isMobileSidebarOpen: false,
  isDesktopSidebarCollapsed: false,
  toggleMobileSidebar: (open?: boolean) => {
    set((state) => ({
      isMobileSidebarOpen: open !== undefined ? open : !state.isMobileSidebarOpen,
    }));
  },
  closeMobileSidebar: () => {
    set({ isMobileSidebarOpen: false });
  },
  toggleDesktopSidebar: () => {
    set((state) => ({
      isDesktopSidebarCollapsed: !state.isDesktopSidebarCollapsed,
    }));
  },

  // Actions
  toggleHUD: (open?: boolean) => {
    set((state) => ({ isHUDOpen: open !== undefined ? open : !state.isHUDOpen }));
  },

  startSimulation: () => {
    set({
      sessionStatus: 'ACTIVE',
      activeSpeaker: 'TECH_LEAD',
      isInterrupted: false,
      interruptionMessage: null,
      difficultyLevel: 3,
    });
  },

  finishSimulation: () => {
    set({
      sessionStatus: 'COMPLETED',
      activeSpeaker: null,
      isInterrupted: false,
    });
  },

  toggleMic: () => {
    set((state) => ({ isMicMuted: !state.isMicMuted }));
  },

  simulateCandidateInterruption: () => {
    const { sessionTimerSeconds } = get();
    const minutes = Math.floor(sessionTimerSeconds / 60);
    const secs = sessionTimerSeconds % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Add candidate interruption speech cut-off entry
    const interruptionEntry: TranscriptEntry = {
      id: `interr-${Date.now()}`,
      speaker: 'Aarav (Candidate)',
      role: 'CANDIDATE',
      text: 'Excuse me Alex, before we move to the next layer — our Redis cluster also incorporates client-side pipelining which prevents connection pool starvation.',
      timestamp: timeStr,
      flag: 'CANDIDATE INTERRUPTION DETECTED: AI Speech Cut Off (<300ms)',
      flagType: 'warning',
      audioBookmarkSeconds: sessionTimerSeconds,
    };

    set((state) => ({
      activeSpeaker: 'CANDIDATE',
      isInterrupted: true,
      interruptionMessage: 'Candidate Interruption Detected — AI Speech Cut Off (<300ms) • Active Speaker Switched to Candidate',
      transcripts: [...state.transcripts, interruptionEntry],
      liveMetrics: {
        ...state.liveMetrics,
        ownershipClaimed: true,
      },
    }));

    // Auto-normalize back after 4 seconds
    setTimeout(() => {
      set((state) => ({
        isInterrupted: false,
        interruptionMessage: null,
        activeSpeaker: 'TECH_LEAD',
      }));
    }, 4500);
  },

  simulatePersonaHandoff: (target?: ActiveSpeaker) => {
    const current = get().activeSpeaker;
    let next: ActiveSpeaker = 'PRODUCT_MANAGER';
    let nextRoleStr: 'Alex - Principal Tech Lead' | 'Sarah - Lead Product Manager' | 'Jordan - Hiring Lead' = 'Sarah - Lead Product Manager';
    let reason = 'Probing cloud egress billing and ROI';

    if (target) {
      next = target;
      if (next === 'TECH_LEAD') {
        nextRoleStr = 'Alex - Principal Tech Lead';
        reason = 'Diving deep into thread concurrency & failure recovery';
      } else if (next === 'HIRING_MANAGER') {
        nextRoleStr = 'Jordan - Hiring Lead';
        reason = 'Evaluating ownership, STAR leadership and conflict handling';
      }
    } else {
      if (current === 'TECH_LEAD') {
        next = 'PRODUCT_MANAGER';
        nextRoleStr = 'Sarah - Lead Product Manager';
        reason = 'Challenging ROI, customer SLAs and FinOps budget allocation';
      } else if (current === 'PRODUCT_MANAGER') {
        next = 'HIRING_MANAGER';
        nextRoleStr = 'Jordan - Hiring Lead';
        reason = 'Investigating behavioral ownership, DBA friction and team mentorship';
      } else {
        next = 'TECH_LEAD';
        nextRoleStr = 'Alex - Principal Tech Lead';
        reason = 'Probing multi-region disaster recovery and DNS failover';
      }
    }

    set((state) => ({
      activeSpeaker: next,
      isInterrupted: false,
      pendingHandoff: {
        nextRole: nextRoleStr,
        reason,
        suggestedPrompt: `Active persona switched to ${nextRoleStr}. Evaluating candidate under real-time simulated pressure.`,
      },
      liveMetrics: {
        ...state.liveMetrics,
        businessImpactAddressed: next === 'PRODUCT_MANAGER' ? true : state.liveMetrics.businessImpactAddressed,
      },
    }));
  },

  stepDifficulty: (direction: 'UP' | 'DOWN' | number) => {
    set((state) => {
      let newLevel = state.difficultyLevel;
      if (typeof direction === 'number') {
        newLevel = Math.max(1, Math.min(5, direction));
      } else if (direction === 'UP') {
        newLevel = Math.min(5, state.difficultyLevel + 1);
      } else {
        newLevel = Math.max(1, state.difficultyLevel - 1);
      }
      return { difficultyLevel: newLevel };
    });
  },

  triggerContradictionAlert: () => {
    const timeStr = '08:40';
    const alertEntry: TranscriptEntry = {
      id: `contra-${Date.now()}`,
      speaker: 'Alex',
      role: 'TECH_LEAD',
      text: 'Alert: Your earlier statement claimed 99.999% uptime with zero cross-region lag, but your Route53 DNS TTL is set to 60 seconds. How do you reconcile that minute of failover unavailability?',
      timestamp: timeStr,
      flag: 'CONTRADICTION DETECTED: Cross-Round Inconsistency in Failover SLA',
      flagType: 'contradiction',
    };

    set((state) => ({
      liveMetrics: {
        ...state.liveMetrics,
        contradictionDetected: true,
      },
      transcripts: [...state.transcripts, alertEntry],
      activeSpeaker: 'TECH_LEAD',
    }));
  },

  triggerVagueAnswerAlert: () => {
    const alertEntry: TranscriptEntry = {
      id: `vague-${Date.now()}`,
      speaker: 'Sarah',
      role: 'PRODUCT_MANAGER',
      text: 'Sarah: That was too abstract. Give me the exact dollar figure or percentage latency change you observed in production, not just "it was optimized".',
      timestamp: '08:55',
      flag: 'FLAG: Vague Response Warning — Probe Quantifiable Metrics',
      flagType: 'warning',
    };

    set((state) => ({
      liveMetrics: {
        ...state.liveMetrics,
        vagueResponseWarning: true,
      },
      transcripts: [...state.transcripts, alertEntry],
      activeSpeaker: 'PRODUCT_MANAGER',
    }));
  },

  dismissInterruptionAlert: () => {
    set({ isInterrupted: false, interruptionMessage: null });
  },

  playAudioSnapshot: (timestamp: string) => {
    set({ audioPlayingTimestamp: timestamp });
    // Play synthetic audio chime or reset after 3s
    setTimeout(() => {
      set({ audioPlayingTimestamp: null });
    }, 3000);
  },

  resetDemoState: () => {
    set({
      currentUser: DEFAULT_USERS.CANDIDATE,
      sessionStatus: 'READY',
      activeSpeaker: 'TECH_LEAD',
      difficultyLevel: 3,
      isMicMuted: false,
      isInterrupted: false,
      interruptionMessage: null,
      sessionTimerSeconds: 252,
      isHUDOpen: false,
      liveMetrics: {
        techValid: true,
        businessImpactAddressed: false,
        ownershipClaimed: true,
        contradictionDetected: false,
        vagueResponseWarning: false,
        confidenceScore: 0.88,
      },
      transcripts: [...initialMockTranscripts],
      activeJobs: [...mockRolePacks],
      recruiterCandidates: [...mockRecruiterCandidates],
      cohortData: { ...mockInstitutionalData },
      cohortStudents: [...mockCohortStudents],
      currentPassport: { ...mockVerifiedPassport },
    });
  },

  addJobSpec: (newJob: Partial<JobRolePack>) => {
    const created: JobRolePack = {
      id: `role-${Date.now()}`,
      title: newJob.title || 'Staff Distributed Systems Engineer',
      department: newJob.department || 'Infrastructure Core',
      seniority: newJob.seniority || 'Staff',
      activeCandidatesCount: 0,
      weights: newJob.weights || {
        systemDesign: 30,
        databaseOptimization: 20,
        codingLogic: 20,
        productMindset: 15,
        ownership: 15,
      },
      activePersonas: newJob.activePersonas || {
        techLead: true,
        productManager: true,
        hiringManager: true,
        domainCustomer: false,
      },
      requiredCompetencies: newJob.requiredCompetencies || [
        'High Concurrency',
        'Distributed Ledgers',
        'Cloud FinOps'
      ],
      description: newJob.description || 'Configured via PersonaPanel Enterprise Pack Builder',
      createdDate: new Date().toISOString().split('T')[0],
    };

    set((state) => ({
      activeJobs: [created, ...state.activeJobs],
    }));
  },

  updateCandidateStatus: (candidateId: string, status: RecruiterCandidateRecord['status']) => {
    set((state) => ({
      recruiterCandidates: state.recruiterCandidates.map((c) =>
        c.id === candidateId ? { ...c, status } : c
      ),
    }));
  },

  updateJobWeights: (jobId: string, weights: JobRolePack['weights']) => {
    set((state) => ({
      activeJobs: state.activeJobs.map((job) =>
        job.id === jobId ? { ...job, weights } : job
      ),
    }));
  },
}));
