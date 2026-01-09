import React from 'react';
import { NGOHeroSection } from '../components/ngo-partners/NGOHeroSection';
import { BenefitCards } from '../components/ngo-partners/BenefitCards';
import { VerificationProcess } from '../components/ngo-partners/VerificationProcess';
import { CSRInitiativeTypes } from '../components/ngo-partners/CSRInitiativeTypes';
import { FeaturedNGOs } from '../components/ngo-partners/FeaturedNGOs';
import { SuccessStories } from '../components/ngo-partners/SuccessStories';
import { DashboardFeatures } from '../components/ngo-partners/DashboardFeatures';
import { NGORequirements } from '../components/ngo-partners/NGORequirements';
import { FAQSection } from '../components/ngo-partners/FAQSection';
import { FinalCTA } from '../components/ngo-partners/FinalCTA';

export function NGOPartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <NGOHeroSection />
      <BenefitCards />
      <VerificationProcess />
      <CSRInitiativeTypes />
      <FeaturedNGOs />
      <SuccessStories />
      <DashboardFeatures />
      <NGORequirements />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
