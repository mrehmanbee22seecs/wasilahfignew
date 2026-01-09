import React from 'react';
import { CorporateHero } from '../components/corporate-solutions/CorporateHero';
import { ValuePropositions } from '../components/corporate-solutions/ValuePropositions';
import { CSRServices } from '../components/corporate-solutions/CSRServices';
import { ImpactDashboard } from '../components/corporate-solutions/ImpactDashboard';
import { CaseStudies } from '../components/corporate-solutions/CaseStudies';
import { CSRPackages } from '../components/corporate-solutions/CSRPackages';
import { NetworkMetrics } from '../components/corporate-solutions/NetworkMetrics';
import { CorporateTestimonials } from '../components/corporate-solutions/CorporateTestimonials';
import { WorkflowProcess } from '../components/corporate-solutions/WorkflowProcess';
import { CorporateFinalCTA } from '../components/corporate-solutions/CorporateFinalCTA';

export function CorporateServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <CorporateHero />
      <ValuePropositions />
      <CSRServices />
      <ImpactDashboard />
      <CaseStudies />
      <CSRPackages />
      <NetworkMetrics />
      <CorporateTestimonials />
      <WorkflowProcess />
      <CorporateFinalCTA />
    </div>
  );
}
