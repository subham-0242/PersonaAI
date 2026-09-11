import { JobRolePack, RecruiterCandidateRecord } from '../types';

export const mockRolePacks: JobRolePack[] = [
  {
    id: 'role-101',
    title: 'Senior Distributed Systems Engineer',
    department: 'Core Infrastructure',
    seniority: 'Senior',
    activeCandidatesCount: 14,
    weights: {
      systemDesign: 35,
      databaseOptimization: 25,
      codingLogic: 15,
      productMindset: 10,
      ownership: 15,
    },
    activePersonas: {
      techLead: true,
      productManager: true,
      hiringManager: true,
      domainCustomer: false,
    },
    requiredCompetencies: [
      'High Concurrency & Lock-free structures',
      'Kafka / Distributed Event Queues',
      'Multi-AZ PostgreSQL Replication',
      'FinOps & AWS Egress Management'
    ],
    description: 'Lead high-throughput transactional infrastructure supporting 50,000+ financial settlement operations per second.',
    createdDate: '2026-08-12',
  },
  {
    id: 'role-102',
    title: 'Staff Platform & Reliability Engineer',
    department: 'DevOps & Reliability',
    seniority: 'Staff',
    activeCandidatesCount: 8,
    weights: {
      systemDesign: 40,
      databaseOptimization: 15,
      codingLogic: 10,
      productMindset: 15,
      ownership: 20,
    },
    activePersonas: {
      techLead: true,
      productManager: false,
      hiringManager: true,
      domainCustomer: true,
    },
    requiredCompetencies: [
      'Kubernetes Control Planes',
      'Multi-region Disaster Recovery',
      'Chaos Engineering & SLA Governance',
      'Cloud Architecture Economics'
    ],
    description: 'Drive reliability and zero-downtime multi-cloud failover strategies across 300+ microservices.',
    createdDate: '2026-08-20',
  },
  {
    id: 'role-103',
    title: 'Technical Product Manager — Platform',
    department: 'Product & Architecture',
    seniority: 'Lead',
    activeCandidatesCount: 11,
    weights: {
      systemDesign: 20,
      databaseOptimization: 10,
      codingLogic: 10,
      productMindset: 35,
      ownership: 25,
    },
    activePersonas: {
      techLead: true,
      productManager: true,
      hiringManager: true,
      domainCustomer: true,
    },
    requiredCompetencies: [
      'API Product Strategy & Developer DX',
      'Cloud Cost / Unit Economics',
      'Cross-functional Engineering Influence',
      'Technical SLA & Roadmapping'
    ],
    description: 'Define our internal developer platform API contracts, cloud cost quotas, and telemetry governance.',
    createdDate: '2026-09-01',
  },
  {
    id: 'role-104',
    title: 'Senior Frontend Architect',
    department: 'Web Applications',
    seniority: 'Senior',
    activeCandidatesCount: 9,
    weights: {
      systemDesign: 25,
      databaseOptimization: 10,
      codingLogic: 35,
      productMindset: 15,
      ownership: 15,
    },
    activePersonas: {
      techLead: true,
      productManager: true,
      hiringManager: false,
      domainCustomer: true,
    },
    requiredCompetencies: [
      'Next.js 15+ App Router Internals',
      'Real-time WebRTC & Audio Streaming',
      'Design Systems & Micro-frontends',
      'Web Performance & Core Web Vitals'
    ],
    description: 'Architect mission-critical enterprise client dashboards with streaming audio telemetry and low-latency interaction.',
    createdDate: '2026-09-04',
  }
];

export const mockRecruiterCandidates: RecruiterCandidateRecord[] = [
  {
    id: 'cand-001',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    appliedRole: 'Senior Distributed Systems Engineer',
    experienceYears: 6,
    matchScore: 92,
    verificationConfidence: 'High',
    passportId: 'PASSPORT-2026-X89B',
    status: 'SHORTLISTED',
    primaryScores: {
      systemDesign: 88,
      backendFundamentals: 90,
      productThinking: 78,
      ownership: 89,
    },
    resumeClaims: [
      {
        claim: 'Engineered write-through Redis caching pipeline handling 10k RPS with sub-10ms latency.',
        verified: true,
        evidenceExcerpt: 'Candidate accurately explained Lua atomic execution scripts, dual-replica ACKs, and Sentinel failovers under Alex probing.'
      },
      {
        claim: 'Eliminated deadlocks on PostgreSQL transactional ledger during flash sales.',
        verified: true,
        evidenceExcerpt: 'Detailed the transition from SELECT FOR UPDATE row locking to asynchronous buffered Kafka streaming partitioned by merchant ID.'
      },
      {
        claim: 'Quantified $340k monthly GMV recovery by reducing checkout timeout abandonment from 4.8% to 0.12%.',
        verified: true,
        evidenceExcerpt: 'Directly corroborated under PM Sarah cross-examination with exact p99 latency SLA calculations.'
      },
      {
        claim: 'Led cross-functional consensus between DBAs and developers for eventual consistency.',
        verified: true,
        evidenceExcerpt: 'Documented compensation workflows and deployed dual-write validation window for 2 weeks.'
      }
    ]
  },
  {
    id: 'cand-002',
    name: 'Devon Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    appliedRole: 'Senior Distributed Systems Engineer',
    experienceYears: 5,
    matchScore: 84,
    verificationConfidence: 'High',
    passportId: 'PASSPORT-2026-V42C',
    status: 'AUDITED',
    primaryScores: {
      systemDesign: 81,
      backendFundamentals: 85,
      productThinking: 72,
      ownership: 79,
    },
    resumeClaims: [
      {
        claim: 'Spearheaded gRPC migration for core payment microservices.',
        verified: true,
        evidenceExcerpt: 'Validated Protobuf schema evolution and backward compatibility guarantees during live simulation.'
      },
      {
        claim: 'Optimized cloud costs by 35% through Kubernetes pod autoscaling.',
        verified: false,
        evidenceExcerpt: 'Failed to answer specific questions regarding HPA metrics vs KEDA event-driven triggers.'
      }
    ]
  },
  {
    id: 'cand-003',
    name: 'Priya Sundaram',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    appliedRole: 'Senior Distributed Systems Engineer',
    experienceYears: 7,
    matchScore: 89,
    verificationConfidence: 'High',
    passportId: 'PASSPORT-2026-P91A',
    status: 'NEW',
    primaryScores: {
      systemDesign: 90,
      backendFundamentals: 88,
      productThinking: 82,
      ownership: 86,
    },
    resumeClaims: [
      {
        claim: 'Designed multi-region active-active Cassandra cluster with zero data loss.',
        verified: true,
        evidenceExcerpt: 'Comprehensive explanation of tunables: LOCAL_QUORUM consistency, tombstone compaction, and hint handoff thresholds.'
      }
    ]
  },
  {
    id: 'cand-004',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    appliedRole: 'Staff Platform & Reliability Engineer',
    experienceYears: 8,
    matchScore: 78,
    verificationConfidence: 'Moderate',
    passportId: 'PASSPORT-2026-M55K',
    status: 'NEW',
    primaryScores: {
      systemDesign: 76,
      backendFundamentals: 80,
      productThinking: 68,
      ownership: 74,
    },
    resumeClaims: [
      {
        claim: 'Implemented Istio Service Mesh with automated mTLS zero-trust policy.',
        verified: true,
        evidenceExcerpt: 'Demonstrated deep familiarity with Envoy sidecar proxies and cert-manager rotation.'
      }
    ]
  }
];

export const sampleJobDescriptionText = `Role: Senior Distributed Systems & Backend Engineer
Location: Remote / Hybrid
Team: Core Financial Infrastructure

About the Team:
Our payment settlement engine processes millions of transactions every hour across global merchant networks. We are looking for an experienced Distributed Systems Engineer who thrives under rigorous high-concurrency constraints, understands transactional boundaries, and treats production resilience as paramount.

Key Responsibilities:
- Design, scale, and maintain mission-critical distributed ledger and caching architectures with sub-10ms response latencies.
- Lead investigations into lock contention, write deadlocks, and race conditions across multi-replica relational (PostgreSQL) and in-memory (Redis) systems.
- Own technical SLA standards (p99 latency < 100ms, 99.99% availability) and proactively manage multi-AZ data transfer cloud egress budgets.
- Collaborate closely with Product Managers on unit economics and de-risk architectural changes through empirical proof-of-concepts.
- Mentor junior and mid-level engineers, establishing declarative CI guardrails and automated testing standards.

Required Qualifications:
- 5+ years building distributed backend architectures in Go, Python, or Java.
- Proven mastery of Apache Kafka, distributed locking protocols, and ACID boundary mechanics.
- Strong grounding in AWS cloud architecture, containerized orchestration, and cost optimization.
- Clear, empathetic stakeholder communication and structured STAR execution.`;
