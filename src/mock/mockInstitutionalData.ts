import { InstitutionalCohortData, CohortStudent } from '../types';

export const mockInstitutionalData: InstitutionalCohortData = {
  departmentName: 'Department of Computer Science & Engineering',
  institutionName: 'National Institute of Technology',
  batchName: 'Batch 2026 (7th Semester Cohort)',
  totalEnrolled: 700,
  studentsAssessed: 620,
  employabilityIndex: 78.4,
  topCompetency: {
    name: 'Algorithm Design & Problem Solving',
    score: 86.2,
  },
  primaryCurriculumDeficit: {
    name: 'System Design & Cloud Economics',
    score: 58.1,
  },
  competencyRadarData: [
    {
      competency: 'Algo & Data Structures',
      studentAverage: 86,
      industryBenchmark: 78,
    },
    {
      competency: 'System Design & Arch',
      studentAverage: 58,
      industryBenchmark: 74,
    },
    {
      competency: 'Database & SQL Indexing',
      studentAverage: 71,
      industryBenchmark: 75,
    },
    {
      competency: 'Cloud & FinOps Economics',
      studentAverage: 52,
      industryBenchmark: 70,
    },
    {
      competency: 'STAR Communication',
      studentAverage: 67,
      industryBenchmark: 72,
    },
    {
      competency: 'Production Debugging',
      studentAverage: 63,
      industryBenchmark: 76,
    },
  ],
  curriculumGaps: [
    {
      id: 'cgap-1',
      title: 'Distributed Transaction Locking & Connection Pool Exhaustion',
      affectedPercentage: 72,
      severity: 'CRITICAL',
      observation: '72% of assessed students failed to address database connection pooling and cloud cost constraints in workplace simulations, relying on naive synchronous SQL queries that deadlock under 5,000 concurrent virtual users.',
      recommendation: 'Add hands-on microservice failure and chaos engineering labs to the 7th semester CS402 Distributed Systems syllabus before November campus placements.'
    },
    {
      id: 'cgap-2',
      title: 'Cloud Egress Pricing & FinOps Architecture Blindspots',
      affectedPercentage: 68,
      severity: 'HIGH',
      observation: '68% of candidates propose multi-region replication architectures without accounting for cross-AZ data egress bandwidth bills or estimating monthly AWS unit economics.',
      recommendation: 'Integrate a 2-week FinOps and Cloud Cost Modeling module into the CS408 Cloud Computing coursework.'
    },
    {
      id: 'cgap-3',
      title: 'Eventual Consistency Reconciliation vs ACID Guarantees',
      affectedPercentage: 54,
      severity: 'MODERATE',
      observation: 'Students demonstrated solid theoretical understanding of the CAP theorem, but struggled when challenged on concrete compensation transactions and saga orchestration patterns.',
      recommendation: 'Incorporate Saga pattern implementation assignments into CS306 Advanced Database Systems.'
    }
  ]
};

export const mockCohortStudents: CohortStudent[] = [
  {
    id: 'stud-101',
    name: 'Aarav Sharma',
    rollNumber: 'CS22B042',
    batch: '2026',
    readinessScore: 84,
    status: 'VERIFIED',
    lastAssessmentDate: '2026-09-10',
    competencies: {
      algoProblemSolving: 92,
      backendDev: 88,
      systemDesign: 82,
      databaseSql: 80,
      communication: 76,
      devopsCloud: 70,
    }
  },
  {
    id: 'stud-102',
    name: 'Rohan Mehra',
    rollNumber: 'CS22B014',
    batch: '2026',
    readinessScore: 79,
    status: 'VERIFIED',
    lastAssessmentDate: '2026-09-08',
    competencies: {
      algoProblemSolving: 88,
      backendDev: 82,
      systemDesign: 70,
      databaseSql: 78,
      communication: 74,
      devopsCloud: 64,
    }
  },
  {
    id: 'stud-103',
    name: 'Ananya Verma',
    rollNumber: 'CS22B088',
    batch: '2026',
    readinessScore: 88,
    status: 'VERIFIED',
    lastAssessmentDate: '2026-09-09',
    competencies: {
      algoProblemSolving: 95,
      backendDev: 90,
      systemDesign: 84,
      databaseSql: 85,
      communication: 82,
      devopsCloud: 76,
    }
  },
  {
    id: 'stud-104',
    name: 'Tanvi Deshmukh',
    rollNumber: 'CS22B102',
    batch: '2026',
    readinessScore: 68,
    status: 'NEEDS_REMEDIATION',
    lastAssessmentDate: '2026-09-05',
    competencies: {
      algoProblemSolving: 84,
      backendDev: 70,
      systemDesign: 52,
      databaseSql: 65,
      communication: 62,
      devopsCloud: 48,
    }
  },
  {
    id: 'stud-105',
    name: 'Vikramaditya Rao',
    rollNumber: 'CS22B056',
    batch: '2026',
    readinessScore: 72,
    status: 'IN_PROGRESS',
    lastAssessmentDate: '2026-09-07',
    competencies: {
      algoProblemSolving: 86,
      backendDev: 75,
      systemDesign: 61,
      databaseSql: 72,
      communication: 65,
      devopsCloud: 54,
    }
  },
  {
    id: 'stud-106',
    name: 'Sneha Kulkarni',
    rollNumber: 'CS22B031',
    batch: '2026',
    readinessScore: 83,
    status: 'VERIFIED',
    lastAssessmentDate: '2026-09-09',
    competencies: {
      algoProblemSolving: 90,
      backendDev: 85,
      systemDesign: 78,
      databaseSql: 82,
      communication: 79,
      devopsCloud: 69,
    }
  },
  {
    id: 'stud-107',
    name: 'Kabir Sengupta',
    rollNumber: 'CS22B077',
    batch: '2026',
    readinessScore: 61,
    status: 'NEEDS_REMEDIATION',
    lastAssessmentDate: '2026-09-02',
    competencies: {
      algoProblemSolving: 78,
      backendDev: 62,
      systemDesign: 48,
      databaseSql: 58,
      communication: 59,
      devopsCloud: 42,
    }
  }
];
