import React, { useState, useMemo } from 'react';
import { DirectoryHero } from '../components/volunteer-directory/DirectoryHero';
import { FilterSidebar } from '../components/volunteer-directory/FilterSidebar';
import { VolunteerGrid } from '../components/volunteer-directory/VolunteerGrid';

interface VolunteerDirectoryPageProps {
  onNavigateToProfile: (volunteerId: string) => void;
}

export function VolunteerDirectoryPage({ onNavigateToProfile }: VolunteerDirectoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sdgs: [] as number[],
    skills: [] as string[],
    universities: [] as string[],
    availability: [] as string[],
    experienceLevel: [] as string[]
  });

  // Mock volunteer database
  const allVolunteers = [
    {
      id: '1',
      name: 'Ayesha Khan',
      role: 'Social Impact Volunteer & Community Leader',
      location: 'Karachi, Pakistan',
      university: 'IBA Karachi',
      verified: true,
      sdgs: [1, 4, 8, 10, 17],
      totalHours: 420,
      rating: 4.9,
      topSkills: ['Teaching & Mentoring', 'Event Planning', 'Social Media Marketing', 'Community Outreach'],
      availability: 'Flexible',
      experienceLevel: 'Advanced (2+ years)'
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      role: 'Education & Technology Advocate',
      location: 'Lahore, Pakistan',
      university: 'LUMS Lahore',
      verified: true,
      sdgs: [4, 9, 17],
      totalHours: 350,
      rating: 4.8,
      topSkills: ['Project Management', 'Data Analysis', 'Content Writing', 'Public Speaking'],
      availability: 'Weekends',
      experienceLevel: 'Advanced (2+ years)'
    },
    {
      id: '3',
      name: 'Fatima Siddiqui',
      role: 'Healthcare & Community Outreach Volunteer',
      location: 'Islamabad, Pakistan',
      university: 'Aga Khan University',
      verified: true,
      sdgs: [3, 5, 10],
      totalHours: 280,
      rating: 4.7,
      topSkills: ['Community Outreach', 'Fundraising', 'Event Planning', 'Photography'],
      availability: 'Weekdays',
      experienceLevel: 'Intermediate (6 months - 2 years)'
    },
    {
      id: '4',
      name: 'Ali Raza',
      role: 'Environmental & Climate Action Activist',
      location: 'Karachi, Pakistan',
      university: 'NED University',
      verified: true,
      sdgs: [13, 14, 15],
      totalHours: 310,
      rating: 4.6,
      topSkills: ['Project Management', 'Social Media Marketing', 'Photography', 'Video Editing'],
      availability: 'Part-time',
      experienceLevel: 'Intermediate (6 months - 2 years)'
    },
    {
      id: '5',
      name: 'Zainab Malik',
      role: 'Women Empowerment & Skills Training Leader',
      location: 'Lahore, Pakistan',
      university: 'Punjab University',
      verified: true,
      sdgs: [5, 8, 10],
      totalHours: 390,
      rating: 4.9,
      topSkills: ['Teaching & Mentoring', 'Public Speaking', 'Graphic Design', 'Event Planning'],
      availability: 'Flexible',
      experienceLevel: 'Advanced (2+ years)'
    },
    {
      id: '6',
      name: 'Hassan Iqbal',
      role: 'Youth Development & Sports Volunteer',
      location: 'Islamabad, Pakistan',
      university: 'NUST Islamabad',
      verified: true,
      sdgs: [3, 4, 10],
      totalHours: 220,
      rating: 4.5,
      topSkills: ['Event Planning', 'Community Outreach', 'Public Speaking', 'Photography'],
      availability: 'Weekends',
      experienceLevel: 'Intermediate (6 months - 2 years)'
    },
    {
      id: '7',
      name: 'Sana Tariq',
      role: 'Digital Marketing & Social Impact Specialist',
      location: 'Karachi, Pakistan',
      university: 'FAST University',
      verified: false,
      sdgs: [8, 9, 17],
      totalHours: 150,
      rating: 4.4,
      topSkills: ['Social Media Marketing', 'Graphic Design', 'Content Writing', 'Data Analysis'],
      availability: 'Part-time',
      experienceLevel: 'Beginner (0-6 months)'
    },
    {
      id: '8',
      name: 'Bilal Ahmed',
      role: 'Education Access & Literacy Volunteer',
      location: 'Lahore, Pakistan',
      university: 'Karachi University',
      verified: true,
      sdgs: [1, 4, 10],
      totalHours: 340,
      rating: 4.7,
      topSkills: ['Teaching & Mentoring', 'Content Writing', 'Community Outreach', 'Event Planning'],
      availability: 'Flexible',
      experienceLevel: 'Advanced (2+ years)'
    },
    {
      id: '9',
      name: 'Mahnoor Sheikh',
      role: 'Healthcare Awareness & First Aid Trainer',
      location: 'Islamabad, Pakistan',
      university: 'Aga Khan University',
      verified: true,
      sdgs: [3, 4, 17],
      totalHours: 270,
      rating: 4.8,
      topSkills: ['Teaching & Mentoring', 'Public Speaking', 'Event Planning', 'Photography'],
      availability: 'Weekdays',
      experienceLevel: 'Intermediate (6 months - 2 years)'
    },
    {
      id: '10',
      name: 'Usman Khan',
      role: 'Tech for Good & Digital Literacy Advocate',
      location: 'Karachi, Pakistan',
      university: 'GIKI',
      verified: true,
      sdgs: [4, 9, 17],
      totalHours: 290,
      rating: 4.6,
      topSkills: ['Teaching & Mentoring', 'Project Management', 'Data Analysis', 'Video Editing'],
      availability: 'Weekends',
      experienceLevel: 'Intermediate (6 months - 2 years)'
    },
    {
      id: '11',
      name: 'Hira Aziz',
      role: 'Poverty Alleviation & Microfinance Volunteer',
      location: 'Lahore, Pakistan',
      university: 'LUMS Lahore',
      verified: true,
      sdgs: [1, 8, 10],
      totalHours: 360,
      rating: 4.8,
      topSkills: ['Community Outreach', 'Fundraising', 'Data Analysis', 'Public Speaking'],
      availability: 'Flexible',
      experienceLevel: 'Advanced (2+ years)'
    },
    {
      id: '12',
      name: 'Kamran Ali',
      role: 'Environmental Education & Sustainability Leader',
      location: 'Islamabad, Pakistan',
      university: 'NUST Islamabad',
      verified: false,
      sdgs: [13, 15, 17],
      totalHours: 180,
      rating: 4.5,
      topSkills: ['Event Planning', 'Social Media Marketing', 'Photography', 'Content Writing'],
      availability: 'Part-time',
      experienceLevel: 'Beginner (0-6 months)'
    }
  ];

  // Filter and search logic
  const filteredVolunteers = useMemo(() => {
    return allVolunteers.filter((volunteer) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          volunteer.name.toLowerCase().includes(query) ||
          volunteer.role.toLowerCase().includes(query) ||
          volunteer.university.toLowerCase().includes(query) ||
          volunteer.location.toLowerCase().includes(query) ||
          volunteer.topSkills.some(skill => skill.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // SDG filter
      if (filters.sdgs.length > 0) {
        const hasMatchingSDG = filters.sdgs.some(sdg => volunteer.sdgs.includes(sdg));
        if (!hasMatchingSDG) return false;
      }

      // Skills filter
      if (filters.skills.length > 0) {
        const hasMatchingSkill = filters.skills.some(skill => volunteer.topSkills.includes(skill));
        if (!hasMatchingSkill) return false;
      }

      // Universities filter
      if (filters.universities.length > 0) {
        if (!filters.universities.includes(volunteer.university)) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        if (!filters.availability.includes(volunteer.availability)) return false;
      }

      // Experience level filter
      if (filters.experienceLevel.length > 0) {
        if (!filters.experienceLevel.includes(volunteer.experienceLevel)) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      sdgs: [],
      skills: [],
      universities: [],
      availability: [],
      experienceLevel: []
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      <DirectoryHero
        totalVolunteers={allVolunteers.length}
        onSearchChange={setSearchQuery}
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Volunteer Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-600">
                  Showing <span className="text-slate-900">{filteredVolunteers.length}</span> of{' '}
                  <span className="text-slate-900">{allVolunteers.length}</span> volunteers
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <VolunteerGrid
                  volunteers={filteredVolunteers}
                  onVolunteerClick={onNavigateToProfile}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
