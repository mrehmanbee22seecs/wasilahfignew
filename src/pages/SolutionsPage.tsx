import React, { useState, useRef } from 'react';
import { SolutionsHero } from '../components/solutions/SolutionsHero';
import { WhatWeDeliver } from '../components/solutions/WhatWeDeliver';
import { ServiceBlock } from '../components/solutions/ServiceBlock';
import { InteractiveSDGMap } from '../components/solutions/InteractiveSDGMap';
import { HowItWorks } from '../components/solutions/HowItWorks';
import { ImpactMetrics } from '../components/csr-solutions/ImpactMetrics';
import { CaseStudies } from '../components/csr-solutions/CaseStudies';
import { CorporateExperiences } from '../components/solutions/CorporateExperiences';
import { PricingSnapshot } from '../components/solutions/PricingSnapshot';
import { SolutionsFAQ } from '../components/solutions/SolutionsFAQ';
import { FooterCTA } from '../components/contact/FooterCTA';
import { ProposalModal } from '../components/proposal/ProposalModal';

export function SolutionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefillService, setPrefillService] = useState<string | undefined>();
  const [selectedSDG, setSelectedSDG] = useState<number | null>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  const handleRequestPilot = (serviceName?: string) => {
    setPrefillService(serviceName);
    setIsModalOpen(true);
  };

  const handleSeeSolutions = () => {
    solutionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSDGClick = (sdgId: number | null) => {
    setSelectedSDG(sdgId);
  };

  const services = [
    {
      title: 'CSR Strategy & Planning',
      summary: 'SDG-aligned CSR roadmaps that connect business goals to social impact',
      outcomes: [
        'Executive-ready CSR strategy deck within 2 weeks',
        'SDG mapping to your industry and business priorities',
        'Budget allocation framework across CSR pillars',
        '12-month implementation roadmap with KPIs'
      ],
      sdgs: [1, 4, 5, 7, 8, 9, 12],
      processSteps: [
        'Discovery call to understand business context and CSR goals',
        'Industry benchmarking and SDG prioritization workshop',
        'Draft strategy development with budget scenarios',
        'Stakeholder review and refinement (2 rounds)',
        'Final delivery with implementation playbook'
      ],
      duration: '2-3 weeks',
      costModel: 'Fixed fee: PKR 150k - 400k depending on complexity',
      deliverables: [
        'CSR Strategy Deck (PowerPoint)',
        'SDG Alignment Matrix',
        'Budget Allocation Framework',
        '12-Month Implementation Roadmap',
        'KPI Dashboard Template'
      ],
      caseStudyLink: '#'
    },
    {
      title: 'NGO Vetting & Verification',
      summary: 'Due diligence on potential NGO partners to reduce reputational and operational risk',
      outcomes: [
        'Complete legal, financial, and operational audit',
        'Risk-scored NGO profiles with recommendations',
        'Verified NGO database access for future projects',
        'Ongoing performance monitoring included'
      ],
      sdgs: [5, 10, 16, 17],
      processSteps: [
        'NGO identification based on your CSR focus areas',
        'Legal registration and compliance checks',
        'Financial audit of past 2 years',
        'Reference calls with previous corporate partners',
        'On-site visit and capacity assessment (if applicable)',
        'Final vetting report with risk scoring'
      ],
      duration: '1-2 weeks per NGO',
      costModel: 'Per-NGO fee: PKR 25k - 75k depending on depth',
      deliverables: [
        'NGO Vetting Report',
        'Risk Assessment Matrix',
        'Recommendation Summary',
        'Access to Verified NGO Network'
      ]
    },
    {
      title: 'End-to-End Project Execution',
      summary: 'Full project management from planning to post-project reporting',
      outcomes: [
        'Turnkey project delivery with minimal internal effort',
        'Real-time updates and photo documentation',
        'Volunteer recruitment and coordination handled',
        'Comprehensive impact report with metrics and testimonials'
      ],
      sdgs: [1, 2, 3, 4, 6, 11, 13, 14, 15],
      processSteps: [
        'Project scoping and budget finalization',
        'NGO partner selection and contracting',
        'Volunteer recruitment via Wasilah platform',
        'Logistics coordination (transport, materials, permits)',
        'On-ground execution with real-time monitoring',
        'Impact documentation and reporting'
      ],
      duration: '4-8 weeks (varies by project type)',
      costModel: '8-12% of total project budget as management fee',
      deliverables: [
        'Project Plan & Timeline',
        'Volunteer Coordination',
        'Real-Time Progress Updates',
        'Photo & Video Documentation',
        'Impact Report with Metrics',
        'Post-Project Debrief'
      ],
      caseStudyLink: '#'
    },
    {
      title: 'Impact Documentation & Reporting',
      summary: 'Professional impact reports and ESG documentation for board and stakeholder reporting',
      outcomes: [
        'Board-ready impact presentations',
        'ESG report sections with SDG mapping',
        'Social media content kit with photos and quotes',
        'Beneficiary testimonials and case stories'
      ],
      sdgs: [17],
      processSteps: [
        'Data collection from project records',
        'Beneficiary interviews and testimonial gathering',
        'Photo and video editing',
        'Metrics analysis and SDG mapping',
        'Report design and stakeholder review',
        'Final delivery in multiple formats'
      ],
      duration: '1-2 weeks',
      costModel: 'Fixed fee: PKR 50k - 150k depending on depth',
      deliverables: [
        'Impact Report (PDF)',
        'Board Presentation Deck',
        'ESG Documentation',
        'Social Media Kit',
        'Beneficiary Testimonials'
      ]
    },
    {
      title: 'Corporate Experiences',
      summary: 'Premium CSR events: appreciation dinners, cultural nights, and executive field trips',
      outcomes: [
        'Memorable events that celebrate CSR and build culture',
        'Full event management from venue to post-event report',
        'Impact framing and storytelling throughout',
        'Professional photography and social proof'
      ],
      sdgs: [4, 8, 17],
      processSteps: [
        'Event concept and budget alignment',
        'Venue booking and vendor coordination',
        'Guest list management and invitations',
        'Impact storytelling integration (video, speeches)',
        'Event execution and onsite coordination',
        'Post-event coverage and thank-you kit'
      ],
      duration: '4-8 weeks planning, 1 day/evening event',
      costModel: 'Custom pricing based on attendee count and complexity',
      deliverables: [
        'Event Planning & Coordination',
        'Venue & Catering Management',
        'Impact Storytelling Integration',
        'Professional Photography',
        'Post-Event Report & Media Kit'
      ]
    }
  ];

  // Filter services based on selected SDG
  const filteredServices = selectedSDG
    ? services.map((service, index) => ({
        ...service,
        isHighlighted: service.sdgs.includes(selectedSDG)
      }))
    : services.map(service => ({ ...service, isHighlighted: false }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <SolutionsHero 
        onRequestPilot={() => handleRequestPilot()}
        onSeeSolutions={handleSeeSolutions}
      />

      {/* What We Deliver */}
      <WhatWeDeliver />

      {/* Solutions Section */}
      <section ref={solutionsRef} className="py-16 bg-slate-50" id="solutions">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-slate-900 mb-4">Solutions</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Five modular services that cover the full CSR lifecycle
            </p>
          </div>

          <div className="space-y-8">
            {filteredServices.map((service, index) => (
              <ServiceBlock
                key={index}
                {...service}
                onRequestService={handleRequestPilot}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive SDG Map */}
      <InteractiveSDGMap 
        onSDGClick={handleSDGClick}
        selectedSDG={selectedSDG}
      />

      {/* How It Works */}
      <HowItWorks />

      {/* Impact Metrics (reuse from existing) */}
      <ImpactMetrics />

      {/* Case Studies (reuse from existing) */}
      <CaseStudies />

      {/* Corporate Experiences */}
      <CorporateExperiences 
        onBookExperience={(experienceType) => handleRequestPilot(experienceType)}
      />

      {/* Pricing */}
      <PricingSnapshot 
        onRequestPricing={(model) => handleRequestPilot(`Pricing - ${model}`)}
      />

      {/* FAQ */}
      <SolutionsFAQ />

      {/* Footer CTA */}
      <FooterCTA onRequestProposal={() => handleRequestPilot()} />

      {/* Proposal Modal */}
      <ProposalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefillService={prefillService}
        origin="solutions_card"
      />
    </div>
  );
}
