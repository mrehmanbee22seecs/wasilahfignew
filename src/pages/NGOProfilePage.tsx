import React from 'react';
import { ProfileHeader } from '../components/ngo-profile/ProfileHeader';
import { AboutSection } from '../components/ngo-profile/AboutSection';
import { ImpactStats } from '../components/ngo-profile/ImpactStats';
import { OpportunitiesSection } from '../components/ngo-profile/OpportunitiesSection';
import { GallerySection } from '../components/ngo-profile/GallerySection';
import { DocumentsSection } from '../components/ngo-profile/DocumentsSection';
import { ContactSection } from '../components/ngo-profile/ContactSection';

interface NGOProfilePageProps {
  ngoId?: string;
}

export function NGOProfilePage({ ngoId = '1' }: NGOProfilePageProps) {
  // Mock NGO database - in a real app, this would be fetched from an API
  const ngoDatabase: Record<string, any> = {
    '1': {
      id: '1',
      name: 'The Citizens Foundation',
      tagline: 'Empowering communities through quality education',
      verified: true,
      causes: ['Education', 'Child Welfare', 'Community Development'],
      location: 'Karachi, Pakistan',
      founded: 1995,
      website: 'www.tcf.org.pk',
      logo: null,
      description: `The Citizens Foundation (TCF) is one of Pakistan's leading non-profit organizations in the field of education. 
      Founded in 1995, TCF's primary objective is to provide quality education to the less privileged sections of society.`,
      mission: `To provide the highest quality education to Pakistan's less privileged children through a nationwide network of 
      purpose-built schools while ensuring full community participation and ownership.`,
      vision: `To be Pakistan's premier education NGO empowering the less privileged with quality education through a scalable, 
      replicable and sustainable model that nurtures a sense of responsibility and tolerance towards citizenship and community.`,
      focusAreas: [
        'Primary & Secondary Education',
        'Teacher Training Programs',
        'School Infrastructure Development',
        'Community Engagement',
        'Student Welfare & Support'
      ],
      stats: {
        volunteers: '12,500+',
        projects: '1,800',
        yearsActive: '29',
        regionsServed: '125+'
      }
    },
    '2': {
      id: '2',
      name: 'Akhuwat Foundation',
      tagline: 'Interest-free microfinance for economic empowerment',
      verified: true,
      causes: ['Economic Development', 'Poverty Alleviation'],
      location: 'Lahore, Pakistan',
      founded: 2001,
      website: 'www.akhuwat.org.pk',
      logo: null,
      description: `Akhuwat Foundation is Pakistan's largest interest-free microfinance organization, empowering economically 
      disadvantaged communities through ethical financial services and social support.`,
      mission: `To alleviate poverty through interest-free microfinance while promoting self-reliance, dignity, and community solidarity.`,
      vision: `A society where every individual has access to ethical financial services and opportunities for economic independence.`,
      focusAreas: [
        'Interest-Free Microloans',
        'Skills Training',
        'Healthcare Services',
        'Education Support',
        'Community Development'
      ],
      stats: {
        volunteers: '8,200+',
        projects: '950',
        yearsActive: '23',
        regionsServed: '800+'
      }
    },
    '3': {
      id: '3',
      name: 'LRBT',
      tagline: 'Free eye care for all',
      verified: true,
      causes: ['Healthcare'],
      location: 'Karachi, Pakistan',
      founded: 1985,
      website: 'www.lrbt.org.pk',
      logo: null,
      description: `LRBT (Layton Rahmatulla Benevolent Trust) is Pakistan's largest eye care hospital network, providing 
      free world-class ophthalmic treatment to millions of patients annually.`,
      mission: `To eliminate preventable blindness in Pakistan through accessible, high-quality eye care services.`,
      vision: `A Pakistan where no one suffers from preventable blindness due to lack of resources.`,
      focusAreas: [
        'Eye Surgery & Treatment',
        'Outreach Camps',
        'Research & Training',
        'Preventive Care',
        'Community Screenings'
      ],
      stats: {
        volunteers: '3,500+',
        projects: '28',
        yearsActive: '39',
        regionsServed: '40+'
      }
    }
  };

  // Get NGO data or fall back to default
  const ngoData = ngoDatabase[ngoId] || ngoDatabase['1'];
  
  // Prepare about data for AboutSection
  const aboutData = {
    description: [ngoData.description],
    mission: ngoData.mission,
    vision: ngoData.vision,
    focusAreas: ngoData.focusAreas
  };

  // Prepare stats data for ImpactStats
  const statsData = {
    volunteersEngaged: parseInt(ngoData.stats.volunteers.replace(/[^0-9]/g, '')) || 0,
    projectsCompleted: parseInt(ngoData.stats.projects.replace(/[^0-9]/g, '')) || 0,
    yearsActive: parseInt(ngoData.stats.yearsActive) || 0,
    regionsServed: parseInt(ngoData.stats.regionsServed.replace(/[^0-9]/g, '')) || 0
  };

  // Mock opportunities data
  const opportunitiesData = [
    {
      id: '1',
      title: 'Education Program Volunteer',
      description: 'Support our education initiatives by helping with classroom activities and student mentoring.',
      skills: ['Teaching', 'Communication', 'Patience'],
      duration: '3 months',
      location: ngoData.location,
      status: 'open' as const
    },
    {
      id: '2',
      title: 'Community Outreach Coordinator',
      description: 'Help us connect with communities and organize awareness programs.',
      skills: ['Public Speaking', 'Organization', 'Social Media'],
      duration: '2 months',
      location: ngoData.location,
      status: 'limited' as const
    },
    {
      id: '3',
      title: 'Data Entry & Documentation',
      description: 'Assist with maintaining records and documenting project outcomes.',
      skills: ['Computer Skills', 'Attention to Detail', 'MS Office'],
      duration: '1 month',
      location: ngoData.location,
      status: 'open' as const
    }
  ];

  // Mock gallery images
  const galleryImages = [
    { id: '1', title: 'Community Event', description: 'Annual community gathering and celebration' },
    { id: '2', title: 'Project Launch', description: 'New initiative kickoff ceremony' },
    { id: '3', title: 'Volunteer Training', description: 'Training session for new volunteers' },
    { id: '4', title: 'Field Visit', description: 'On-site project monitoring and evaluation' },
    { id: '5', title: 'Beneficiary Support', description: 'Direct assistance to beneficiaries' },
    { id: '6', title: 'Team Meeting', description: 'Strategic planning session' },
    { id: '7', title: 'Award Ceremony', description: 'Recognition of outstanding volunteers' },
    { id: '8', title: 'Awareness Campaign', description: 'Public awareness initiative' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader ngo={ngoData} />
      <AboutSection about={aboutData} />
      <ImpactStats stats={statsData} />
      <OpportunitiesSection opportunities={opportunitiesData} />
      <GallerySection images={galleryImages} />
      <DocumentsSection />
      <ContactSection />
    </div>
  );
}