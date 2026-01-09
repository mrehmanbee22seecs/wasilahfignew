import React from 'react';
import { CSRHeader } from '../components/csr-solutions/CSRHeader';
import { SDGAlignment } from '../components/csr-solutions/SDGAlignment';
import { CSRActivityTypes } from '../components/csr-solutions/CSRActivityTypes';
import { CSRTieredPackages } from '../components/csr-solutions/CSRTieredPackages';
import { StudentVolunteerSection } from '../components/csr-solutions/StudentVolunteerSection';
import { NGOCollaborationFlow } from '../components/csr-solutions/NGOCollaborationFlow';
import { CSREventsSection } from '../components/csr-solutions/CSREventsSection';
import { ImpactMetrics } from '../components/csr-solutions/ImpactMetrics';
import { CaseStudies } from '../components/csr-solutions/CaseStudies';
import { FinalCTA } from '../components/csr-solutions/FinalCTA';

export function CSRSolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <CSRHeader />
      <SDGAlignment />
      <CSRActivityTypes />
      <CSRTieredPackages />
      <StudentVolunteerSection />
      <NGOCollaborationFlow />
      <CSREventsSection />
      <ImpactMetrics />
      <CaseStudies />
      <FinalCTA />
    </div>
  );
}
