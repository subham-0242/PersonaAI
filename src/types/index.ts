export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'INSTITUTION_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title: string;
  organization?: string;
}

export type SessionStatus = 'CONSENT' | 'READY' | 'ACTIVE' | 'INTERRUPTED' | 'COMPLETED';

export type ActiveSpeaker = 'CANDIDATE' | 'TECH_LEAD' | 'PRODUCT_MANAGER' | 'HIRING_MANAGER' | null;

export interface LiveMetrics {
  techValid: boolean;
  businessImpactAddressed: boolean;
  ownershipClaimed: boolean;
  contradictionDetected: boolean;
  vagueResponseWarning: boolean;
  confidenceScore: number;
}

export interface PendingHandoff {
  nextRole: 'Alex - Principal Tech Lead' | 'Sarah - Lead Product Manager' | 'Jordan - Hiring Lead';
  reason: string;
  suggestedPrompt: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'Alex' | 'Sarah' | 'Jordan' | 'Aarav (Candidate)' | string;
  role: 'TECH_LEAD' | 'PRODUCT_MANAGER' | 'HIRING_MANAGER' | 'CANDIDATE';
  text: string;
  timestamp: string;
  flag?: string;
  flagType?: 'warning' | 'success' | 'info' | 'contradiction';
  audioBookmarkSeconds?: number;
  competencyTag?: string;
}

export interface CompetencyScore {
  id: string;
  name: string;
  category: 'Technical' | 'Product' | 'Behavioral';
  score: number; // 0 - 100
  benchmark: number; // industry benchmark
  confidence: 'High' | 'Moderate' | 'Low';
  evidencePointsCount: number;
  evidenceItems: EvidenceItem[];
}

export interface EvidenceItem {
  id: string;
  competencyTag: string;
  quote: string;
  timestamp: string;
  audioBookmarkSeconds: number;
  evaluatorRationale: string;
  personaEvaluator: 'Alex' | 'Sarah' | 'Jordan';
  validationStatus: 'VERIFIED' | 'NEEDS_CLARIFICATION' | 'CONTRADICTED';
}

export interface SkillGapItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  recommendedAction: string;
  category: string;
}

export interface VerifiedPassport {
  id: string;
  candidateId: string;
  candidateName: string;
  targetRole: string;
  verificationId: string;
  cryptographicHash: string;
  issuedDate: string;
  overallReadinessIndex: number;
  verdict: string;
  status: 'VERIFIED' | 'PROVISIONAL' | 'FLAGGED';
  competencies: CompetencyScore[];
  skillGaps: SkillGapItem[];
  simulationSummary: {
    duration: string;
    turnsEvaluated: number;
    interruptionsHandled: number;
    difficultyPeak: number;
  };
}

export interface JobRolePack {
  id: string;
  title: string;
  department: string;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff';
  activeCandidatesCount: number;
  weights: {
    systemDesign: number;
    databaseOptimization: number;
    codingLogic: number;
    productMindset: number;
    ownership: number;
  };
  activePersonas: {
    techLead: boolean;
    productManager: boolean;
    hiringManager: boolean;
    domainCustomer: boolean;
  };
  requiredCompetencies: string[];
  description?: string;
  createdDate: string;
}

export interface RecruiterCandidateRecord {
  id: string;
  name: string;
  avatar: string;
  appliedRole: string;
  experienceYears: number;
  matchScore: number;
  verificationConfidence: 'High' | 'Moderate' | 'Low';
  passportId: string;
  resumeClaims: {
    claim: string;
    verified: boolean;
    evidenceExcerpt?: string;
  }[];
  primaryScores: {
    systemDesign: number;
    backendFundamentals: number;
    productThinking: number;
    ownership: number;
  };
  status: 'NEW' | 'SHORTLISTED' | 'AUDITED' | 'REJECTED';
}

export interface CohortStudent {
  id: string;
  name: string;
  rollNumber: string;
  batch: string;
  readinessScore: number;
  status: 'VERIFIED' | 'IN_PROGRESS' | 'NEEDS_REMEDIATION';
  competencies: {
    algoProblemSolving: number;
    backendDev: number;
    systemDesign: number;
    databaseSql: number;
    communication: number;
    devopsCloud: number;
  };
  lastAssessmentDate: string;
}

export interface InstitutionalCohortData {
  departmentName: string;
  institutionName: string;
  batchName: string;
  totalEnrolled: number;
  studentsAssessed: number;
  employabilityIndex: number;
  topCompetency: {
    name: string;
    score: number;
  };
  primaryCurriculumDeficit: {
    name: string;
    score: number;
  };
  competencyRadarData: {
    competency: string;
    studentAverage: number;
    industryBenchmark: number;
  }[];
  curriculumGaps: {
    id: string;
    title: string;
    affectedPercentage: number;
    observation: string;
    recommendation: string;
    severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  }[];
}
