import React from 'react';
import { VolunteerHeader } from '../components/volunteer-program/VolunteerHeader';
import { BenefitsGrid } from '../components/volunteer-program/BenefitsGrid';
import { WorkflowTimeline } from '../components/volunteer-program/WorkflowTimeline';
import { OpportunityTypes } from '../components/volunteer-program/OpportunityTypes';
import { FeaturedOpportunities } from '../components/volunteer-program/FeaturedOpportunities';
import { ImpactShowcase } from '../components/volunteer-program/ImpactShowcase';
import { StudentTestimonials } from '../components/volunteer-program/StudentTestimonials';
import { CertificateSystem } from '../components/volunteer-program/CertificateSystem';
import { PartnerUniversities } from '../components/volunteer-program/PartnerUniversities';
import { FinalCTA } from '../components/volunteer-program/FinalCTA';

export function VolunteerProgramPage() {
  return (
    <div className="min-h-screen bg-white">
      <VolunteerHeader />
      <BenefitsGrid />
      <WorkflowTimeline />
      <OpportunityTypes />
      <FeaturedOpportunities />
      <ImpactShowcase />
      <StudentTestimonials />
      <CertificateSystem />
      <PartnerUniversities />
      <FinalCTA />
    </div>
  );
}
