import React from 'react';
import { VolunteerHeader } from '../components/volunteer-profile/VolunteerHeader';
import { SummarySection } from '../components/volunteer-profile/SummarySection';
import { SkillsSection } from '../components/volunteer-profile/SkillsSection';
import { ExperienceTimeline } from '../components/volunteer-profile/ExperienceTimeline';
import { CertificationsSection } from '../components/volunteer-profile/CertificationsSection';
import { PortfolioSection } from '../components/volunteer-profile/PortfolioSection';
import { AvailabilitySection } from '../components/volunteer-profile/AvailabilitySection';
import { ContactSection } from '../components/volunteer-profile/ContactSection';

interface VolunteerProfilePageProps {
  volunteerId?: string;
}

export function VolunteerProfilePage({ volunteerId = '1' }: VolunteerProfilePageProps) {
  // Mock volunteer database - in a real app, this would be fetched from an API
  const volunteerDatabase: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Ayesha Khan',
      role: 'Social Impact Volunteer & Community Leader',
      location: 'Karachi, Pakistan',
      education: 'BS Computer Science, IBA',
      verified: true,
      sdgs: [1, 4, 8, 10, 17],
      bio: `Passionate about creating positive social impact through technology and education. I have over 3 years of volunteer experience working with various NGOs across Pakistan, focusing on education access, women empowerment, and youth development. Committed to contributing to the UN Sustainable Development Goals through practical community engagement.`,
      stats: {
        totalHours: 420,
        opportunitiesCompleted: 12,
        ngosHelped: 5,
        sdgCategories: 5
      },
      skills: [
        { name: 'Teaching & Mentoring', level: 'advanced' },
        { name: 'Event Planning', level: 'advanced' },
        { name: 'Fundraising', level: 'intermediate' },
        { name: 'Social Media Marketing', level: 'advanced' },
        { name: 'Public Speaking', level: 'intermediate' },
        { name: 'Photography', level: 'intermediate' },
        { name: 'Community Outreach', level: 'advanced' },
        { name: 'Project Management', level: 'intermediate' },
        { name: 'Data Analysis', level: 'basic' },
        { name: 'Microsoft Office', level: 'advanced' },
        { name: 'Graphic Design', level: 'intermediate' },
        { name: 'Content Writing', level: 'advanced' }
      ],
      topStrengths: [
        { name: 'Leadership', percentage: 95 },
        { name: 'Communication', percentage: 90 },
        { name: 'Problem Solving', percentage: 85 },
        { name: 'Teamwork', percentage: 92 },
        { name: 'Creativity', percentage: 88 }
      ],
      experiences: [
        {
          id: 'exp1',
          ngoName: 'The Citizens Foundation',
          opportunityTitle: 'Education Program Coordinator',
          duration: 'Jan 2023 - Present',
          startDate: '2023-01',
          description: 'Coordinating after-school tutoring programs for underprivileged students. Successfully improved student engagement by 40% through innovative teaching methods and mentorship initiatives.',
          sdgs: [4, 10]
        },
        {
          id: 'exp2',
          ngoName: 'Akhuwat Foundation',
          opportunityTitle: 'Community Outreach Volunteer',
          duration: 'Jun 2022 - Dec 2022',
          startDate: '2022-06',
          description: 'Conducted community surveys and organized awareness sessions on microfinance opportunities. Reached over 500 families and facilitated access to interest-free loans for small businesses.',
          sdgs: [1, 8]
        },
        {
          id: 'exp3',
          ngoName: 'LRBT',
          opportunityTitle: 'Health Camp Organizer',
          duration: 'Mar 2022 - May 2022',
          startDate: '2022-03',
          description: 'Organized free eye screening camps in rural areas. Coordinated with medical teams and helped register over 300 patients for free eye care services.',
          sdgs: [3]
        }
      ],
      certifications: [
        {
          id: 'cert1',
          title: 'Volunteer Leadership Certificate',
          issuer: 'The Citizens Foundation',
          date: 'December 2023',
          type: 'certificate',
          sdgs: [4, 17]
        },
        {
          id: 'cert2',
          title: 'First Aid & CPR Training',
          issuer: 'Red Crescent Pakistan',
          date: 'August 2023',
          type: 'training',
          sdgs: [3]
        },
        {
          id: 'cert3',
          title: 'Community Engagement Badge',
          issuer: 'Akhuwat Foundation',
          date: 'January 2023',
          type: 'badge',
          sdgs: [1, 8]
        },
        {
          id: 'cert4',
          title: 'Project Management Fundamentals',
          issuer: 'Wasilah Training Program',
          date: 'October 2022',
          type: 'training',
          sdgs: [17]
        }
      ],
      portfolio: [
        {
          id: 'port1',
          title: 'Community Education Drive',
          description: 'Organized literacy program for 50+ women',
          category: 'Education'
        },
        {
          id: 'port2',
          title: 'Health Awareness Campaign',
          description: 'Social media campaign reaching 10k+ people',
          category: 'Healthcare'
        },
        {
          id: 'port3',
          title: 'Fundraising Gala Event',
          description: 'Successfully raised PKR 500k for education',
          category: 'Fundraising'
        },
        {
          id: 'port4',
          title: 'Youth Leadership Workshop',
          description: 'Trained 30 young volunteers in leadership',
          category: 'Training'
        },
        {
          id: 'port5',
          title: 'Tree Plantation Drive',
          description: 'Planted 200+ trees with local community',
          category: 'Environment'
        },
        {
          id: 'port6',
          title: 'Women Empowerment Seminar',
          description: 'Organized skills training for 40 women',
          category: 'Women Empowerment'
        }
      ],
      availability: {
        days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        hours: '4-6 hours per week (flexible)',
        preferredRoles: ['Event Coordinator', 'Mentor', 'Social Media Manager', 'Community Outreach'],
        preferredCauses: ['Education', 'Women Empowerment', 'Youth Development', 'Poverty Alleviation']
      },
      contact: {
        email: 'ayesha.khan@email.com',
        phone: '+92 300 1234567',
        linkedin: 'linkedin.com/in/ayeshakhan',
        github: 'github.com/ayeshakhan',
        portfolio: 'ayeshakhan.com'
      }
    },
    '2': {
      id: '2',
      name: 'Ahmed Hassan',
      role: 'Education & Technology Advocate',
      location: 'Lahore, Pakistan',
      education: 'BS Software Engineering, LUMS',
      verified: true,
      sdgs: [4, 9, 17],
      bio: `Tech-savvy volunteer dedicated to bridging the digital divide in underserved communities. Experienced in organizing coding bootcamps and technology workshops for students from low-income backgrounds. Passionate about leveraging technology for education and sustainable development.`,
      stats: {
        totalHours: 350,
        opportunitiesCompleted: 10,
        ngosHelped: 4,
        sdgCategories: 3
      },
      skills: [
        { name: 'Project Management', level: 'advanced' },
        { name: 'Data Analysis', level: 'advanced' },
        { name: 'Content Writing', level: 'intermediate' },
        { name: 'Public Speaking', level: 'advanced' },
        { name: 'Teaching & Mentoring', level: 'advanced' },
        { name: 'Video Editing', level: 'intermediate' }
      ],
      topStrengths: [
        { name: 'Innovation', percentage: 92 },
        { name: 'Technical Skills', percentage: 95 },
        { name: 'Communication', percentage: 88 },
        { name: 'Leadership', percentage: 85 }
      ],
      experiences: [
        {
          id: 'exp1',
          ngoName: 'Code for Pakistan',
          opportunityTitle: 'Coding Instructor',
          duration: 'Sep 2022 - Present',
          startDate: '2022-09',
          description: 'Teaching coding fundamentals to underprivileged youth. Developed curriculum and trained over 100 students in web development and programming.',
          sdgs: [4, 9]
        }
      ],
      certifications: [
        {
          id: 'cert1',
          title: 'Digital Literacy Trainer',
          issuer: 'Code for Pakistan',
          date: 'November 2023',
          type: 'certificate',
          sdgs: [4, 9]
        }
      ],
      portfolio: [
        {
          id: 'port1',
          title: 'Coding Bootcamp Initiative',
          description: 'Trained 100+ students in web development',
          category: 'Education'
        }
      ],
      availability: {
        days: ['Saturday', 'Sunday'],
        hours: '6-8 hours per week (weekends only)',
        preferredRoles: ['Trainer', 'Curriculum Developer', 'Project Manager'],
        preferredCauses: ['Education', 'Technology Access', 'Youth Development']
      },
      contact: {
        email: 'ahmed.hassan@email.com',
        phone: '+92 301 7654321',
        linkedin: 'linkedin.com/in/ahmedhassan'
      }
    },
    '3': {
      id: '3',
      name: 'Fatima Siddiqui',
      role: 'Healthcare & Community Outreach Volunteer',
      location: 'Islamabad, Pakistan',
      education: 'MBBS, Aga Khan University',
      verified: true,
      sdgs: [3, 5, 10],
      bio: `Medical student passionate about healthcare accessibility and women's health. Active in organizing free health camps and awareness sessions in rural communities. Committed to reducing health inequalities and empowering women through health education.`,
      stats: {
        totalHours: 280,
        opportunitiesCompleted: 8,
        ngosHelped: 3,
        sdgCategories: 3
      },
      skills: [
        { name: 'Community Outreach', level: 'advanced' },
        { name: 'Fundraising', level: 'intermediate' },
        { name: 'Event Planning', level: 'advanced' },
        { name: 'Photography', level: 'intermediate' },
        { name: 'Public Speaking', level: 'intermediate' }
      ],
      topStrengths: [
        { name: 'Empathy', percentage: 98 },
        { name: 'Communication', percentage: 90 },
        { name: 'Organization', percentage: 87 }
      ],
      experiences: [
        {
          id: 'exp1',
          ngoName: 'Shaukat Khanum Hospital',
          opportunityTitle: 'Health Awareness Volunteer',
          duration: 'Jan 2023 - Present',
          startDate: '2023-01',
          description: 'Organizing health awareness sessions and free screening camps. Reached over 1000 beneficiaries in underserved areas.',
          sdgs: [3, 10]
        }
      ],
      certifications: [
        {
          id: 'cert1',
          title: 'Community Health Worker',
          issuer: 'WHO Pakistan',
          date: 'October 2023',
          type: 'training',
          sdgs: [3]
        }
      ],
      portfolio: [
        {
          id: 'port1',
          title: 'Women Health Initiative',
          description: 'Conducted health screenings for 500+ women',
          category: 'Healthcare'
        }
      ],
      availability: {
        days: ['Tuesday', 'Thursday', 'Friday'],
        hours: '3-5 hours per week (flexible)',
        preferredRoles: ['Health Educator', 'Community Mobilizer', 'Event Coordinator'],
        preferredCauses: ['Healthcare', 'Women Empowerment', 'Community Development']
      },
      contact: {
        email: 'fatima.siddiqui@email.com',
        phone: '+92 302 9876543'
      }
    }
  };

  // Get volunteer data or fall back to default
  const volunteerData = volunteerDatabase[volunteerId] || volunteerDatabase['1'];

  return (
    <div className="min-h-screen bg-white">
      <VolunteerHeader volunteer={volunteerData} />
      <SummarySection bio={volunteerData.bio} stats={volunteerData.stats} />
      <SkillsSection skills={volunteerData.skills} topStrengths={volunteerData.topStrengths} />
      <ExperienceTimeline experiences={volunteerData.experiences} />
      <CertificationsSection certifications={volunteerData.certifications} />
      <PortfolioSection items={volunteerData.portfolio} />
      <AvailabilitySection availability={volunteerData.availability} />
      <ContactSection contact={volunteerData.contact} />
    </div>
  );
}