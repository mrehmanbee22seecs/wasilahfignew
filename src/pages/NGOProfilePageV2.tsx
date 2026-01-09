import React from 'react';
import { NGOBreadcrumbNav } from '../components/ngo-profile-v2/NGOBreadcrumbNav';
import { NGOHeaderSection } from '../components/ngo-profile-v2/NGOHeaderSection';
import { AboutOrganizationSection } from '../components/ngo-profile-v2/AboutOrganizationSection';
import { VerificationComplianceSection } from '../components/ngo-profile-v2/VerificationComplianceSection';
import { FocusAreasSDGSection } from '../components/ngo-profile-v2/FocusAreasSDGSection';
import { PastWorkImpactSection } from '../components/ngo-profile-v2/PastWorkImpactSection';
import { AvailableOpportunitiesSection } from '../components/ngo-profile-v2/AvailableOpportunitiesSection';
import { WorkingWithWasilahSection } from '../components/ngo-profile-v2/WorkingWithWasilahSection';
import { FAQSection } from '../components/ngo-profile-v2/FAQSection';
import { NGOFooterCTA } from '../components/ngo-profile-v2/NGOFooterCTA';

interface NGOProfilePageV2Props {
  ngoId?: string;
  onBackToOpportunity: () => void;
  onViewOpportunity?: (opportunityId: string) => void;
  onApplyToOpportunity?: (opportunityId: string) => void;
  onViewAllOpportunities?: () => void;
}

export function NGOProfilePageV2({ 
  ngoId = '1',
  onBackToOpportunity,
  onViewOpportunity,
  onApplyToOpportunity,
  onViewAllOpportunities
}: NGOProfilePageV2Props) {
  // Mock NGO database - in production, this would be fetched from an API
  const ngoDatabase: Record<string, any> = {
    '1': {
      id: '1',
      name: 'The Citizens Foundation',
      missionOneLiner: 'Empowering Pakistan\'s underprivileged communities through quality education and sustainable development',
      verified: true,
      yearsActive: 28,
      location: 'Karachi, Pakistan',
      focusSectors: ['Education', 'Youth Development', 'Community Empowerment', 'Infrastructure'],
      
      about: {
        whyExists: 'The Citizens Foundation (TCF) was established to address the education crisis in Pakistan, where millions of children from low-income families lack access to quality schooling. Founded in 1995, TCF exists to break the cycle of poverty through education.',
        whoServes: 'TCF serves children from Pakistan\'s most marginalized communities—primarily in urban slums and rural areas where government schools are either non-existent or severely under-resourced. The organization focuses on families living below the poverty line who cannot afford quality education.',
        howOperates: 'TCF operates through a network of purpose-built schools across Pakistan. Each school is constructed using a standardized model that ensures quality infrastructure. The organization employs trained teachers, provides standardized curriculum, conducts regular assessments, and maintains strong community partnerships to ensure sustainability.'
      },

      verification: {
        legalRegistration: true,
        financialTransparency: true,
        pastProjectVerification: true,
        safeguardingPolicies: true,
        siteVisitCompleted: true
      },

      focusAreas: [
        { name: 'Primary & Secondary Education', sdg: 4 },
        { name: 'Teacher Training & Development', sdg: 4 },
        { name: 'School Infrastructure', sdg: 9 },
        { name: 'Community Engagement', sdg: 17 },
        { name: 'Gender Equality in Education', sdg: 5 },
        { name: 'Youth Development Programs', sdg: 8 }
      ],

      impact: {
        projectsCompleted: '1,800+',
        beneficiaries: '266,000+',
        regionsServed: '125+',
        featuredProject: {
          title: 'Digital Learning Initiative',
          summary: 'Launched technology-enabled classrooms in 100+ schools, providing students with access to digital learning tools and resources. The initiative improved student engagement by 45% and enhanced learning outcomes across science and mathematics subjects.'
        }
      },

      opportunities: [
        {
          id: '1',
          title: 'Education Program Coordinator',
          ngoName: 'The Citizens Foundation',
          description: 'Help coordinate after-school tutoring programs for underprivileged students in Karachi. Work with teachers, volunteers, and students to improve educational outcomes.',
          location: 'Karachi',
          duration: '3 months',
          commitment: '10 hrs/week',
          skillsRequired: ['Teaching', 'Event Planning', 'Communication'],
          sdgs: [4, 10],
          deadline: '2024-12-25',
          opportunityType: 'On-ground',
          spotsAvailable: 5,
          applicants: 12
        },
        {
          id: '9',
          title: 'Fundraising Event Coordinator',
          ngoName: 'The Citizens Foundation',
          description: 'Plan and execute fundraising events to support school construction projects. Coordinate with sponsors, manage logistics, and engage donors.',
          location: 'Islamabad',
          duration: '2 months',
          commitment: '12 hrs/week',
          skillsRequired: ['Event Planning', 'Fundraising', 'Stakeholder Management'],
          sdgs: [4, 17],
          deadline: '2024-12-22',
          opportunityType: 'On-ground',
          spotsAvailable: 4,
          applicants: 16
        }
      ]
    },
    '2': {
      id: '2',
      name: 'Akhuwat Foundation',
      missionOneLiner: 'Eliminating poverty through interest-free microfinance and community solidarity',
      verified: true,
      yearsActive: 23,
      location: 'Lahore, Pakistan',
      focusSectors: ['Microfinance', 'Poverty Alleviation', 'Economic Development', 'Healthcare'],

      about: {
        whyExists: 'Akhuwat was founded on the principle that poverty can be alleviated through ethical, interest-free financial services combined with human dignity and social solidarity. The organization exists to provide an alternative to conventional microfinance that often traps borrowers in debt cycles.',
        whoServes: 'Akhuwat serves economically disadvantaged families across Pakistan, particularly small business owners, artisans, and entrepreneurs who need capital to start or expand their businesses but cannot access traditional banking services or afford interest-based loans.',
        howOperates: 'Akhuwat operates through a network of community-based branches where loans are disbursed interest-free. The organization leverages volunteer networks, maintains strict accountability through community guarantors, and provides additional support services including healthcare, education assistance, and skills training to ensure holistic development.'
      },

      verification: {
        legalRegistration: true,
        financialTransparency: true,
        pastProjectVerification: true,
        safeguardingPolicies: true,
        siteVisitCompleted: true
      },

      focusAreas: [
        { name: 'Interest-Free Microfinance', sdg: 1 },
        { name: 'Economic Empowerment', sdg: 8 },
        { name: 'Skills Development', sdg: 4 },
        { name: 'Healthcare Services', sdg: 3 },
        { name: 'Women Entrepreneurship', sdg: 5 },
        { name: 'Community Development', sdg: 17 }
      ],

      impact: {
        projectsCompleted: '950+',
        beneficiaries: '5 million+',
        regionsServed: '800+',
        featuredProject: {
          title: 'Women Entrepreneurship Program',
          summary: 'Provided interest-free loans and business training to 15,000 women entrepreneurs across Pakistan. The program achieved a 92% loan recovery rate and enabled participants to increase household incomes by an average of 60%.'
        }
      },

      opportunities: [
        {
          id: '2',
          title: 'Social Media Campaign Manager',
          ngoName: 'Akhuwat Foundation',
          description: 'Design and execute social media campaigns to raise awareness about microfinance opportunities. Create engaging content and manage online community engagement.',
          location: 'Lahore',
          duration: '2 months',
          commitment: '8 hrs/week',
          skillsRequired: ['Social Media Marketing', 'Graphic Design', 'Content Writing'],
          sdgs: [1, 8],
          deadline: '2024-12-30',
          opportunityType: 'Remote',
          spotsAvailable: 3,
          applicants: 20
        }
      ]
    },
    '3': {
      id: '3',
      name: 'LRBT',
      missionOneLiner: 'Eliminating preventable blindness through accessible, world-class eye care for all Pakistanis',
      verified: true,
      yearsActive: 44,
      location: 'Karachi, Pakistan',
      focusSectors: ['Healthcare', 'Eye Care', 'Community Health', 'Medical Research'],

      about: {
        whyExists: 'LRBT (Layton Rahmatulla Benevolent Trust) was established to combat preventable blindness in Pakistan, where millions suffer from treatable eye conditions but cannot access or afford quality eye care. The organization exists to ensure that no Pakistani loses their sight due to poverty.',
        whoServes: 'LRBT serves patients across all economic backgrounds, with a special focus on the poor and underprivileged who receive completely free treatment. The organization treats everyone from newborns to elderly patients, addressing conditions ranging from cataracts to complex retinal diseases.',
        howOperates: 'LRBT operates a network of hospitals and mobile eye camps equipped with state-of-the-art technology and staffed by qualified ophthalmologists. Services are provided free or at highly subsidized rates, funded through donations and endowments. The organization conducts extensive outreach programs, bringing eye care to remote communities.'
      },

      verification: {
        legalRegistration: true,
        financialTransparency: true,
        pastProjectVerification: true,
        safeguardingPolicies: true,
        siteVisitCompleted: true
      },

      focusAreas: [
        { name: 'Eye Surgery & Treatment', sdg: 3 },
        { name: 'Community Eye Camps', sdg: 3 },
        { name: 'Preventive Eye Care', sdg: 3 },
        { name: 'Medical Research', sdg: 9 },
        { name: 'Healthcare Training', sdg: 4 },
        { name: 'Rural Health Access', sdg: 10 }
      ],

      impact: {
        projectsCompleted: '2,800+',
        beneficiaries: '52 million+',
        regionsServed: '40+',
        featuredProject: {
          title: 'Rural Eye Care Campaign',
          summary: 'Conducted 500+ mobile eye camps in remote villages across Sindh and Balochistan, providing free screenings to 150,000 patients and performing 8,000 cataract surgeries. The campaign restored sight to thousands who had been blind for years.'
        }
      },

      opportunities: [
        {
          id: '3',
          title: 'Health Camp Volunteer',
          ngoName: 'LRBT',
          description: 'Assist in organizing free eye screening camps in rural areas. Help with patient registration, crowd management, and basic health awareness sessions.',
          location: 'Islamabad',
          duration: '1 month',
          commitment: '6 hrs/week',
          skillsRequired: ['Community Outreach', 'Event Planning', 'First Aid'],
          sdgs: [3],
          deadline: '2024-12-20',
          opportunityType: 'On-ground',
          spotsAvailable: 8,
          applicants: 15
        }
      ]
    }
  };

  // Get NGO data
  const ngo = ngoDatabase[ngoId] || ngoDatabase['1'];

  const handleViewOpportunity = (opportunityId: string) => {
    console.log('Viewing opportunity:', opportunityId);
    if (onViewOpportunity) {
      onViewOpportunity(opportunityId);
    }
  };

  const handleApplyToOpportunity = (opportunityId: string) => {
    console.log('Applying to opportunity:', opportunityId);
    if (onApplyToOpportunity) {
      onApplyToOpportunity(opportunityId);
    }
  };

  const handleViewAllOpportunities = () => {
    console.log('Viewing all opportunities');
    if (onViewAllOpportunities) {
      onViewAllOpportunities();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <NGOBreadcrumbNav
        ngoName={ngo.name}
        onBack={onBackToOpportunity}
        onHome={() => console.log('Navigate to home')}
        onOpportunities={onViewAllOpportunities}
      />

      {/* NGO Header */}
      <NGOHeaderSection
        ngo={{
          name: ngo.name,
          logo: ngo.logo,
          missionOneLiner: ngo.missionOneLiner,
          verified: ngo.verified,
          yearsActive: ngo.yearsActive,
          location: ngo.location,
          focusSectors: ngo.focusSectors
        }}
      />

      {/* About the Organization */}
      <AboutOrganizationSection about={ngo.about} />

      {/* Verification & Compliance */}
      <VerificationComplianceSection verification={ngo.verification} />

      {/* Focus Areas & SDGs */}
      <FocusAreasSDGSection focusAreas={ngo.focusAreas} />

      {/* Past Work & Impact */}
      <PastWorkImpactSection impact={ngo.impact} />

      {/* Available Opportunities */}
      <AvailableOpportunitiesSection
        opportunities={ngo.opportunities}
        onViewOpportunity={handleViewOpportunity}
        onApply={handleApplyToOpportunity}
      />

      {/* Working With Wasilah */}
      <WorkingWithWasilahSection />

      {/* FAQ */}
      <FAQSection />

      {/* Footer CTA */}
      <NGOFooterCTA
        ngoName={ngo.name}
        onViewOpportunities={handleViewAllOpportunities}
        onBackToOpportunities={handleViewAllOpportunities}
      />
    </div>
  );
}
