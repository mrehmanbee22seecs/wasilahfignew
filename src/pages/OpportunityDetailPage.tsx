import React from 'react';
import { BreadcrumbNav } from '../components/opportunity-detail/BreadcrumbNav';
import { OpportunityHeroSection } from '../components/opportunity-detail/OpportunityHeroSection';
import { AboutSection } from '../components/opportunity-detail/AboutSection';
import { ResponsibilitiesSection } from '../components/opportunity-detail/ResponsibilitiesSection';
import { EligibilitySection } from '../components/opportunity-detail/EligibilitySection';
import { ImpactSection } from '../components/opportunity-detail/ImpactSection';
import { NGOTrustCard } from '../components/opportunity-detail/NGOTrustCard';
import { ApplicationProcessFlow } from '../components/opportunity-detail/ApplicationProcessFlow';
import { SafetySection } from '../components/opportunity-detail/SafetySection';
import { FinalCTA } from '../components/opportunity-detail/FinalCTA';
import { StickyApplyCTA } from '../components/opportunity-detail/StickyApplyCTA';

interface OpportunityDetailPageProps {
  opportunityId?: string;
  onBackToOpportunities: () => void;
  onViewNGOProfile?: (ngoId: string) => void;
}

export function OpportunityDetailPage({ 
  opportunityId = '1', 
  onBackToOpportunities,
  onViewNGOProfile 
}: OpportunityDetailPageProps) {
  // Mock opportunity database - in production, this would be fetched from an API
  const opportunityDatabase: Record<string, any> = {
    '1': {
      id: '1',
      title: 'Education Program Coordinator',
      ngoName: 'The Citizens Foundation',
      impactSummary: 'Support education access for underprivileged students in Karachi through after-school tutoring and mentorship programs',
      location: 'Karachi, Pakistan',
      duration: '3 months',
      commitment: '10 hrs/week',
      opportunityType: 'On-ground',
      sdgs: [4, 10],
      deadline: '2024-12-25',
      spotsAvailable: 5,
      
      description: `This opportunity allows you to make a direct impact on the lives of underprivileged students in Karachi. As an Education Program Coordinator, you'll work closely with The Citizens Foundation to deliver quality after-school tutoring programs that improve student engagement and academic outcomes.

The program focuses on students from low-income families who need additional academic support to succeed in their studies. You'll be part of a structured volunteer initiative that has already helped hundreds of students improve their grades and develop stronger learning habits.

Your role will involve coordinating tutoring sessions, managing volunteer schedules, tracking student progress, and working with teachers to identify areas where students need the most help. This is an excellent opportunity for those passionate about education equity and youth development.`,

      responsibilities: [
        'Assist in organizing and coordinating after-school tutoring sessions for underprivileged students',
        'Support data collection and reporting on student progress and program outcomes',
        'Coordinate with on-ground staff, teachers, and parent volunteers',
        'Help develop engaging learning materials and activities for students',
        'Track attendance and maintain student participation records',
        'Facilitate communication between students, parents, and program staff',
        'Organize periodic review sessions to assess student improvement'
      ],

      eligibility: {
        skills: ['Teaching', 'Event Planning', 'Communication', 'Organization', 'Microsoft Office'],
        academicBackground: 'Currently enrolled in or graduated from university. Background in Education, Social Sciences, or related fields preferred but not required.',
        languages: ['English', 'Urdu'],
        commitmentExpectations: [
          'Minimum 10 hours per week for 3 months',
          'Attend weekly coordination meetings (online or in-person)',
          'Complete onboarding and training session before starting',
          'Maintain consistent attendance and punctuality'
        ],
        prerequisites: [
          'Police background check (arranged by Wasilah)',
          'Ability to travel to designated locations in Karachi',
          'Access to laptop/computer for coordination and reporting'
        ]
      },

      impact: {
        beneficiaries: '200+ students',
        outcomes: [
          'Improved academic performance by 40% on average',
          'Increased student engagement and attendance in regular classes',
          'Enhanced learning resources and teaching methodologies',
          'Stronger parent-teacher-student communication channels',
          'Development of structured mentorship relationships',
          'Better educational outcomes for underserved communities'
        ],
        volunteerContribution: 'Your coordination efforts directly enable the smooth operation of tutoring programs. By managing schedules, tracking progress, and facilitating communication, you ensure that students receive consistent, high-quality academic support. Your work helps create an organized learning environment where students can thrive and develop skills that will benefit them throughout their education journey.'
      },

      ngo: {
        name: 'The Citizens Foundation',
        logo: '',
        description: 'The Citizens Foundation (TCF) is one of Pakistan\'s leading organizations in the field of education for the less privileged. TCF\'s mission is to provide quality education to children from Pakistan\'s marginalized communities, helping break the cycle of poverty and illiteracy.',
        yearsActive: 28,
        focusAreas: ['Education', 'Youth Development', 'Community Empowerment', 'Women\'s Education'],
        verified: true
      }
    },
    '2': {
      id: '2',
      title: 'Social Media Campaign Manager',
      ngoName: 'Akhuwat Foundation',
      impactSummary: 'Design and execute social media campaigns to raise awareness about microfinance opportunities for underserved communities',
      location: 'Lahore, Pakistan',
      duration: '2 months',
      commitment: '8 hrs/week',
      opportunityType: 'Remote',
      sdgs: [1, 8],
      deadline: '2024-12-30',
      spotsAvailable: 3,
      
      description: `Join Akhuwat Foundation in leveraging the power of digital media to create awareness about interest-free microfinance opportunities. This remote opportunity allows you to use your social media and content creation skills to help underserved communities access financial resources.

As a Social Media Campaign Manager, you'll develop and implement strategic campaigns that educate people about microfinance, share success stories of beneficiaries, and drive engagement with Akhuwat's mission. Your work will directly contribute to poverty alleviation efforts across Pakistan.

This role is perfect for digital marketing enthusiasts, content creators, and social media strategists who want to use their skills for social impact. You'll work with a dedicated team and have access to Akhuwat's content library, beneficiary stories, and professional guidance.`,

      responsibilities: [
        'Design and execute social media campaigns across Facebook, Instagram, and Twitter',
        'Create engaging visual and written content highlighting microfinance success stories',
        'Manage community engagement and respond to inquiries on social media platforms',
        'Track campaign performance metrics and prepare weekly reports',
        'Collaborate with the communications team to align messaging',
        'Conduct social media audits and suggest improvement strategies',
        'Develop content calendars and maintain posting consistency'
      ],

      eligibility: {
        skills: ['Social Media Marketing', 'Graphic Design', 'Content Writing', 'Canva', 'Analytics'],
        academicBackground: 'Students or graduates with background in Marketing, Communications, Media Studies, or related fields. Portfolio of previous social media work is a plus.',
        languages: ['English', 'Urdu'],
        commitmentExpectations: [
          'Minimum 8 hours per week for 2 months',
          'Attend bi-weekly virtual check-ins with communications team',
          'Meet content deadlines and maintain quality standards',
          'Be available for occasional urgent campaign needs'
        ],
        prerequisites: [
          'Access to reliable internet connection',
          'Proficiency in design tools (Canva, Adobe, etc.)',
          'Social media management experience preferred'
        ]
      },

      impact: {
        beneficiaries: '10,000+ social media reach',
        outcomes: [
          'Increased awareness of microfinance opportunities by 35%',
          'Higher engagement rates on Akhuwat\'s social platforms',
          'More applications from eligible beneficiaries',
          'Enhanced digital presence and brand visibility',
          'Stronger community connection and trust',
          'Documented success stories reaching wider audiences'
        ],
        volunteerContribution: 'Your social media expertise will help Akhuwat reach thousands of people who could benefit from interest-free loans but don\'t know these opportunities exist. By creating compelling content and managing campaigns, you\'ll bridge the information gap and enable more families to access financial resources that can transform their lives.'
      },

      ngo: {
        name: 'Akhuwat Foundation',
        logo: '',
        description: 'Akhuwat is Pakistan\'s largest interest-free microfinance organization, providing interest-free loans to help families break the cycle of poverty. With a focus on human dignity and social solidarity, Akhuwat has disbursed billions in loans to deserving families across Pakistan.',
        yearsActive: 23,
        focusAreas: ['Microfinance', 'Poverty Alleviation', 'Education', 'Healthcare'],
        verified: true
      }
    },
    '3': {
      id: '3',
      title: 'Health Camp Volunteer',
      ngoName: 'LRBT',
      impactSummary: 'Assist in organizing free eye screening camps in rural areas, helping provide access to eye care for underserved communities',
      location: 'Islamabad, Pakistan',
      duration: '1 month',
      commitment: '6 hrs/week',
      opportunityType: 'On-ground',
      sdgs: [3],
      deadline: '2024-12-20',
      spotsAvailable: 8,
      
      description: `Support LRBT (Layton Rahmatulla Benevolent Trust) in bringing eye care services to rural communities that lack access to basic healthcare facilities. As a Health Camp Volunteer, you'll play a crucial role in organizing and managing free eye screening camps.

Your work will involve patient registration, crowd management, health education, and logistical support to ensure smooth camp operations. These camps provide free eye examinations, prescriptions, and referrals for surgeries to thousands of people who otherwise couldn't afford eye care.

This is a hands-on opportunity to witness the direct impact of healthcare interventions and contribute to LRBT's mission of eliminating preventable blindness in Pakistan. You'll work alongside medical professionals and experienced field staff.`,

      responsibilities: [
        'Assist with patient registration and basic data collection',
        'Help manage crowd flow and ensure organized camp operations',
        'Conduct basic health awareness sessions on eye care',
        'Coordinate with medical teams and support staff',
        'Distribute educational materials and prescriptions',
        'Help set up and pack down camp infrastructure',
        'Support follow-up communications with patients needing further care'
      ],

      eligibility: {
        skills: ['Community Outreach', 'Event Planning', 'First Aid', 'Communication', 'Organization'],
        academicBackground: 'Open to all university students. Medical, nursing, or public health background is beneficial but not required. Training will be provided.',
        languages: ['Urdu', 'English', 'Punjabi (helpful)'],
        commitmentExpectations: [
          'Minimum 6 hours per week for 1 month',
          'Attend mandatory health and safety training',
          'Be available for weekend camp activities',
          'Maintain patient confidentiality and professionalism'
        ],
        prerequisites: [
          'Basic first aid training (can be provided)',
          'Ability to travel to rural areas (transport arranged)',
          'Physical fitness for on-ground fieldwork'
        ]
      },

      impact: {
        beneficiaries: '300+ patients screened',
        outcomes: [
          'Free eye examinations for 300+ individuals',
          'Identification of patients requiring surgery or treatment',
          'Distribution of free prescription glasses',
          'Health awareness reached hundreds of community members',
          'Early detection of preventable eye conditions',
          'Improved access to eye care in underserved areas'
        ],
        volunteerContribution: 'Your support enables LRBT to conduct efficient, well-organized health camps that reach remote communities. By handling registration, crowd management, and awareness sessions, you free up medical professionals to focus on examinations and diagnoses. Your work directly impacts hundreds of people who gain access to eye care they desperately need.'
      },

      ngo: {
        name: 'LRBT (Layton Rahmatulla Benevolent Trust)',
        logo: '',
        description: 'LRBT is one of the largest eye care providers in Pakistan, committed to eliminating preventable and curable blindness. Through a network of hospitals and mobile camps, LRBT provides free or subsidized eye care to millions of underserved patients.',
        yearsActive: 44,
        focusAreas: ['Healthcare', 'Eye Care', 'Community Health', 'Medical Outreach'],
        verified: true
      }
    }
  };

  // Get opportunity data
  const opportunity = opportunityDatabase[opportunityId] || opportunityDatabase['1'];

  const handleApply = () => {
    console.log('Applying to opportunity:', opportunity.id);
    // In production, this would open an application modal or navigate to application form
    alert(`Application process for "${opportunity.title}" would start here.\n\nIn a production app, this would:\n1. Open an application form\n2. Collect volunteer information\n3. Submit to Wasilah's review system`);
  };

  const handleSave = () => {
    console.log('Saving opportunity:', opportunity.id);
    // In production, this would save to user's saved opportunities
    alert('Opportunity saved! (In production, this would be saved to your profile)');
  };

  const handleViewNGOProfile = () => {
    console.log('Viewing NGO profile:', opportunity.ngo.name);
    // Map opportunity ID to NGO ID
    const ngoIdMap: Record<string, string> = {
      '1': '1', // TCF
      '2': '2', // Akhuwat
      '3': '3', // LRBT
      '9': '1'  // TCF fundraising
    };
    const ngoId = ngoIdMap[opportunity.id] || '1';
    if (onViewNGOProfile) {
      onViewNGOProfile(ngoId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        opportunityTitle={opportunity.title}
        onBack={onBackToOpportunities}
      />

      {/* Hero Section */}
      <OpportunityHeroSection
        opportunity={{
          title: opportunity.title,
          ngoName: opportunity.ngoName,
          impactSummary: opportunity.impactSummary,
          location: opportunity.location,
          duration: opportunity.duration,
          commitment: opportunity.commitment,
          opportunityType: opportunity.opportunityType,
          sdgs: opportunity.sdgs
        }}
        onApply={handleApply}
        onSave={handleSave}
      />

      {/* About Section */}
      <AboutSection description={opportunity.description} />

      {/* Responsibilities */}
      <ResponsibilitiesSection responsibilities={opportunity.responsibilities} />

      {/* Eligibility */}
      <EligibilitySection eligibility={opportunity.eligibility} />

      {/* Impact */}
      <ImpactSection impact={opportunity.impact} />

      {/* NGO Trust Card */}
      <NGOTrustCard 
        ngo={opportunity.ngo}
        onViewProfile={handleViewNGOProfile}
      />

      {/* Application Process */}
      <ApplicationProcessFlow />

      {/* Safety & Ethics */}
      <SafetySection />

      {/* Final CTA */}
      <FinalCTA onApply={handleApply} />

      {/* Sticky Apply Button */}
      <StickyApplyCTA onApply={handleApply} />
    </div>
  );
}