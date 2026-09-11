'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/src/components/shared/DashboardLayout';
import { PassportHeader } from '@/src/components/passport/PassportHeader';
import { CompetencyMatrix } from '@/src/components/passport/CompetencyMatrix';
import { EvidenceAuditDrawer } from '@/src/components/passport/EvidenceAuditDrawer';
import { SkillGapRoadmap } from '@/src/components/passport/SkillGapRoadmap';
import { useAppStore } from '@/src/store/useAppStore';

export default function CandidatePassportPage() {
  const params = useParams();
  const passportId = (params?.id as string) || 'PASSPORT-2026-X89B';
  const { currentPassport } = useAppStore();

  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Passport Cryptographic Header */}
        <PassportHeader passport={currentPassport} />

        {/* Competency Scores & Evidence Confidence Matrix */}
        <CompetencyMatrix
          competencies={currentPassport.competencies}
          selectedId={selectedCompetencyId}
          onSelectCompetency={(id) => setSelectedCompetencyId(id === selectedCompetencyId ? null : id)}
        />

        {/* Evidence-Based Audit Drawer (Drill-Down Matrix) */}
        <EvidenceAuditDrawer
          competencies={currentPassport.competencies}
          initialFilter={
            selectedCompetencyId
              ? currentPassport.competencies.find((c) => c.id === selectedCompetencyId)?.evidenceItems[0]?.competencyTag
              : null
          }
        />

        {/* Skill-Gap Diagnostic & Learning Roadmap */}
        <SkillGapRoadmap skillGaps={currentPassport.skillGaps} />
      </main>
    </DashboardLayout>
  );
}
