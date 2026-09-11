import { VerifiedPassport } from '../types';

export const mockVerifiedPassport: VerifiedPassport = {
  id: 'PASSPORT-2026-X89B',
  candidateId: 'cand-001',
  candidateName: 'Aarav Sharma',
  targetRole: 'Senior Distributed Systems Engineer',
  verificationId: 'PASSPORT-2026-X89B',
  cryptographicHash: 'SHA256: 8f9b7c12d45a90ee78b23c914bf681ad2039ee3104c8f553a',
  issuedDate: 'September 2026',
  overallReadinessIndex: 84,
  verdict: 'STRONG HIRE — SENIOR BACKEND',
  status: 'VERIFIED',
  simulationSummary: {
    duration: '08m 45s',
    turnsEvaluated: 16,
    interruptionsHandled: 2,
    difficultyPeak: 4,
  },
  competencies: [
    {
      id: 'comp-1',
      name: 'System Design & High Concurrency',
      category: 'Technical',
      score: 82,
      benchmark: 74,
      confidence: 'High',
      evidencePointsCount: 7,
      evidenceItems: [
        {
          id: 'ev-1',
          competencyTag: 'Scalability & Caching',
          quote: 'I placed Redis as an atomic write-ahead buffer using Redis Lua scripts for non-blocking balance deductions, combined with an asynchronous Kafka queue to batch writes back to PostgreSQL.',
          timestamp: '00:48',
          audioBookmarkSeconds: 48,
          evaluatorRationale: 'Correctly identified caching layer; successfully defended failover strategy under PM cost challenge and multi-replica consistency trade-off.',
          personaEvaluator: 'Alex',
          validationStatus: 'VERIFIED',
        },
        {
          id: 'ev-2',
          competencyTag: 'Fault Tolerance & Idempotency',
          quote: 'Every transaction carried an idempotency key originating from the client API gateway. Even if consumer restarts, the worker checks the idempotency table inside an atomic isolation block.',
          timestamp: '01:52',
          audioBookmarkSeconds: 112,
          evaluatorRationale: 'Demonstrates clear understanding of distributed deduplication, transaction isolation, and network partition resilience.',
          personaEvaluator: 'Alex',
          validationStatus: 'VERIFIED',
        },
        {
          id: 'ev-3',
          competencyTag: 'High Availability & Graceful Degradation',
          quote: 'Route53 DNS health-checks redirect traffic to our secondary hot-standby region within 45 seconds. In-flight client requests receive a 202 Accepted with a correlation token.',
          timestamp: '08:28',
          audioBookmarkSeconds: 508,
          evaluatorRationale: 'Articulated clean decoupled failover pattern with user-experience preservation under catastrophic outage.',
          personaEvaluator: 'Alex',
          validationStatus: 'VERIFIED',
        }
      ]
    },
    {
      id: 'comp-2',
      name: 'Backend Fundamentals & Architecture',
      category: 'Technical',
      score: 88,
      benchmark: 76,
      confidence: 'High',
      evidencePointsCount: 6,
      evidenceItems: [
        {
          id: 'ev-4',
          competencyTag: 'Architectural Rationale & Trade-offs',
          quote: 'Core financial ledgers require strict ACID guarantees, atomic constraints, and ordered event replay, where Postgres plus Kafka partitioned by Merchant ID provided deterministic ordering.',
          timestamp: '05:02',
          audioBookmarkSeconds: 302,
          evaluatorRationale: 'Overcame cross-round contradiction probe with crisp workload differentiation (append-only telemetry vs strict ACID ledgers).',
          personaEvaluator: 'Alex',
          validationStatus: 'VERIFIED',
        }
      ]
    },
    {
      id: 'comp-3',
      name: 'Database & SQL Performance',
      category: 'Technical',
      score: 80,
      benchmark: 72,
      confidence: 'High',
      evidencePointsCount: 5,
      evidenceItems: [
        {
          id: 'ev-5',
          competencyTag: 'Concurrency Controls',
          quote: 'Instead of locking rows with SELECT FOR UPDATE, I introduced Redis as an atomic write-ahead buffer... preventing deadlock cascades on peak balance write contention.',
          timestamp: '00:48',
          audioBookmarkSeconds: 48,
          evaluatorRationale: 'Accurately articulated row-level lock contention pitfalls in relational tables under high-concurrency ledger writes.',
          personaEvaluator: 'Alex',
          validationStatus: 'VERIFIED',
        }
      ]
    },
    {
      id: 'comp-4',
      name: 'Product Mindset & Cloud Economics',
      category: 'Product',
      score: 70,
      benchmark: 68,
      confidence: 'Moderate',
      evidencePointsCount: 4,
      evidenceItems: [
        {
          id: 'ev-6',
          competencyTag: 'Business ROI & Cost Optimization',
          quote: 'Under normal traffic, our p99 SLA increased slightly by 3.2ms... On cloud costs, we saw cross-AZ data transfer jump by $1,800/mo. To mitigate this, we co-located consumers in same AZs and compressed payload envelopes with Protobuf.',
          timestamp: '03:05',
          audioBookmarkSeconds: 185,
          evaluatorRationale: 'Effectively framed technical decision within latency budgets and mitigated AWS egress billing spikes through co-location.',
          personaEvaluator: 'Sarah',
          validationStatus: 'VERIFIED',
        },
        {
          id: 'ev-7',
          competencyTag: 'Customer Impact & Metric Quantification',
          quote: 'Checkout drop-offs fell to 0.12%, directly recovering approximately $340,000 in monthly Gross Merchandise Value.',
          timestamp: '03:58',
          audioBookmarkSeconds: 238,
          evaluatorRationale: 'Directly linked technical uptime to business revenue uplift and merchant satisfaction.',
          personaEvaluator: 'Sarah',
          validationStatus: 'VERIFIED',
        }
      ]
    },
    {
      id: 'comp-5',
      name: 'STAR Communication & Ownership',
      category: 'Behavioral',
      score: 76,
      benchmark: 70,
      confidence: 'High',
      evidencePointsCount: 5,
      evidenceItems: [
        {
          id: 'ev-8',
          competencyTag: 'Stakeholder Alignment & De-risking',
          quote: 'I scheduled a proof-of-concept sprint where we benchmarked failure recovery under simulated chaos engineering conditions using Chaos Mesh. I documented exact compensation transactions for failed events.',
          timestamp: '06:18',
          audioBookmarkSeconds: 378,
          evaluatorRationale: 'Resolved senior DBA friction with proactive, data-backed proof-of-concept rather than dogmatic debate.',
          personaEvaluator: 'Jordan',
          validationStatus: 'VERIFIED',
        },
        {
          id: 'ev-9',
          competencyTag: 'Engineering Standards & Mentorship',
          quote: 'We abstracted the boilerplate into a declarative Python decorator, reducing code to a single @idempotent_transaction line. This made compliance the path of least resistance.',
          timestamp: '07:22',
          audioBookmarkSeconds: 442,
          evaluatorRationale: 'Exemplified servant technical leadership by engineering automated DX guardrails instead of penalizing junior teammates.',
          personaEvaluator: 'Jordan',
          validationStatus: 'VERIFIED',
        }
      ]
    }
  ],
  skillGaps: [
    {
      id: 'gap-1',
      priority: 'High',
      category: 'Cloud Economics & FinOps',
      title: 'Quantify AWS egress costs and ROI before proposing architecture changes',
      description: 'While candidate effectively calculated cross-AZ transfer costs after prompting, the initial design lacked proactive FinOps budgeting during high-scale replication planning.',
      recommendedAction: 'Practice multi-region cloud pricing model simulations and incorporate FinOps cost estimates directly into initial architecture trade-off tables.'
    },
    {
      id: 'gap-2',
      priority: 'Medium',
      category: 'Executive Stakeholder Framing',
      title: 'Improve STAR structure when describing team leadership boundaries',
      description: 'The candidate took 45 seconds to outline context before arriving at the actionable mentorship step. Tighter STAR syntax will strengthen executive interview rounds.',
      recommendedAction: 'Apply the 60-second STAR framework: 10s Situation, 10s Task, 30s Concrete Personal Action, 10s Measured Metric Result.'
    }
  ]
};

export const mockPastSimulations = [
  {
    id: 'SIM-9821',
    passportId: 'PASSPORT-2026-X89B',
    title: 'Distributed Transaction & Caching Arena',
    role: 'Senior Distributed Systems Engineer',
    date: 'September 10, 2026',
    score: 84,
    delta: '+12%',
    verdict: 'STRONG HIRE',
    status: 'Verified',
    panelists: ['Alex (Tech Lead)', 'Sarah (PM)', 'Jordan (Hiring Lead)'],
  },
  {
    id: 'SIM-8412',
    passportId: 'PASSPORT-2026-X89B',
    title: 'High-Throughput Microservice Architecture',
    role: 'Senior Backend Engineer',
    date: 'August 14, 2026',
    score: 75,
    delta: '+8%',
    verdict: 'LEAN HIRE',
    status: 'Verified',
    panelists: ['Alex (Tech Lead)', 'Sarah (PM)'],
  },
  {
    id: 'SIM-7104',
    passportId: 'PASSPORT-2026-X89B',
    title: 'System Scalability & DB Optimization',
    role: 'Staff Backend Engineer',
    date: 'June 28, 2026',
    score: 69,
    delta: '-3%',
    verdict: 'HOLD',
    status: 'Verified',
    panelists: ['Alex (Tech Lead)', 'Jordan (Hiring Lead)'],
  },
  {
    id: 'SIM-6291',
    passportId: 'PASSPORT-2026-X89B',
    title: 'Core Concurrency & API Resiliency',
    role: 'Senior Backend Engineer',
    date: 'May 04, 2026',
    score: 72,
    delta: '+5%',
    verdict: 'LEAN HIRE',
    status: 'Verified',
    panelists: ['Alex (Tech Lead)'],
  }
];

export const mockExtractedSkills = [
  'FastAPI',
  'Redis',
  'PostgreSQL',
  'Distributed Systems',
  'Docker & K8s',
  'Apache Kafka',
  'gRPC',
  'AWS Architecture',
  'High Concurrency',
  'Database Sharding'
];

export const mockCandidateProfile = {
  id: 'cand-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@domain.dev',
  targetRole: 'Senior Distributed Systems Engineer',
  seniority: 'Senior',
  readinessIndex: 84,
  verifiedCompetenciesCount: 6,
  completedSimulationsCount: 4,
  lastVerificationDate: 'September 2026',
  activeJobMatchesCount: 3,
  resumeFileName: 'Aarav_Sharma_Backend_Resume.pdf',
  resumeFileSize: '2.4 MB',
};
