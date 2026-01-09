import React from 'react';
import { HeroSection } from '../components/wasilah-v2/HeroSection';
import { TrustLogos } from '../components/wasilah/TrustLogos';
import { AboutSection } from '../components/wasilah-v2/AboutSection';
import { ServicesGrid } from '../components/wasilah/ServicesGrid';
import { CSRServicesSection } from '../components/wasilah-v2/CSRServicesSection';
import { ProcessFlow } from '../components/wasilah/ProcessFlow';
import { VolunteerProgramSection } from '../components/wasilah-v2/VolunteerProgramSection';
import { WhyWasilah } from '../components/wasilah/WhyWasilah';
import { SDGSection } from '../components/wasilah/SDGSection';
import { NGOPartnerSection } from '../components/wasilah-v2/NGOPartnerSection';
import { CorporateEventsSection } from '../components/wasilah-v2/CorporateEventsSection';
import { PortfolioSection } from '../components/wasilah-v2/PortfolioSection';
import { ProjectsPreview } from '../components/wasilah/ProjectsPreview';
import { TestimonialsSection } from '../components/wasilah-v2/TestimonialsSection';
import { CTABanner } from '../components/wasilah-v2/CTABanner';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TrustLogos />
      <AboutSection />
      <ServicesGrid />
      <CSRServicesSection />
      <ProcessFlow />
      <VolunteerProgramSection />
      <WhyWasilah />
      <SDGSection />
      <NGOPartnerSection />
      <CorporateEventsSection />
      <PortfolioSection />
      <ProjectsPreview />
      <TestimonialsSection />
      <CTABanner />
    </div>
  );
}
