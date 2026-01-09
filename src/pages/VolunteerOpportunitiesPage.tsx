import React, { useState, useMemo } from 'react';
import { OpportunityHero } from '../components/opportunities/OpportunityHero';
import { SearchFiltersBar } from '../components/opportunities/SearchFiltersBar';
import { OpportunityGrid } from '../components/opportunities/OpportunityGrid';
import { FeaturedOpportunityBanner } from '../components/opportunities/FeaturedOpportunityBanner';
import { SidebarPanel } from '../components/opportunities/SidebarPanel';
import { ApplicationModal } from '../components/modals/ApplicationModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VolunteerOpportunitiesPageProps {
  onNavigateToDetail?: (opportunityId: string) => void;
}

export function VolunteerOpportunitiesPage({ onNavigateToDetail }: VolunteerOpportunitiesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: [] as string[],
    opportunityType: [] as string[],
    causeCategories: [] as string[],
    sdgs: [] as number[],
    skillLevel: [] as string[]
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Mock opportunities database
  const allOpportunities = [
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
      applicants: 12,
      causeCategory: 'Education',
      skillLevel: 'Intermediate',
      createdAt: '2024-12-10'
    },
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
      applicants: 20,
      causeCategory: 'Poverty Alleviation',
      skillLevel: 'Advanced',
      createdAt: '2024-12-08'
    },
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
      applicants: 15,
      causeCategory: 'Health',
      skillLevel: 'Beginner',
      createdAt: '2024-12-11'
    },
    {
      id: '4',
      title: 'Climate Action Educator',
      ngoName: 'WWF Pakistan',
      description: 'Conduct climate awareness workshops in schools and communities. Develop educational materials and engage youth in environmental conservation activities.',
      location: 'Karachi',
      duration: '4 months',
      commitment: '12 hrs/week',
      skillsRequired: ['Public Speaking', 'Teaching', 'Environmental Science'],
      sdgs: [13, 15],
      deadline: '2025-01-15',
      opportunityType: 'Hybrid',
      spotsAvailable: 4,
      applicants: 8,
      causeCategory: 'Environment',
      skillLevel: 'Intermediate',
      createdAt: '2024-12-09'
    },
    {
      id: '5',
      title: 'Women Empowerment Workshop Facilitator',
      ngoName: 'Aurat Foundation',
      description: 'Lead skills training workshops for women in underserved communities. Focus on digital literacy, financial management, and entrepreneurship.',
      location: 'Lahore',
      duration: '3 months',
      commitment: '10 hrs/week',
      skillsRequired: ['Teaching', 'Public Speaking', 'Project Management'],
      sdgs: [5, 8, 10],
      deadline: '2025-01-10',
      opportunityType: 'On-ground',
      spotsAvailable: 6,
      applicants: 18,
      causeCategory: 'Women Empowerment',
      skillLevel: 'Advanced',
      createdAt: '2024-12-07'
    },
    {
      id: '6',
      title: 'Youth Mentorship Program Lead',
      ngoName: 'Teach For Pakistan',
      description: 'Mentor high school students from low-income backgrounds. Provide academic guidance, career counseling, and help develop leadership skills.',
      location: 'Islamabad',
      duration: '6 months',
      commitment: '8 hrs/week',
      skillsRequired: ['Mentoring', 'Communication', 'Career Counseling'],
      sdgs: [4, 10],
      deadline: '2025-01-20',
      opportunityType: 'Hybrid',
      spotsAvailable: 10,
      applicants: 25,
      causeCategory: 'Youth Development',
      skillLevel: 'Intermediate',
      createdAt: '2024-12-06'
    },
    {
      id: '7',
      title: 'Data Analysis Volunteer',
      ngoName: 'Pakistan Centre for Philanthropy',
      description: 'Analyze donor data and create impact reports. Help improve data-driven decision making for NGO programs and CSR initiatives.',
      location: 'Karachi',
      duration: '2 months',
      commitment: '6 hrs/week',
      skillsRequired: ['Data Analysis', 'Excel', 'Report Writing'],
      sdgs: [17],
      deadline: '2024-12-28',
      opportunityType: 'Remote',
      spotsAvailable: 2,
      applicants: 10,
      causeCategory: 'Technology',
      skillLevel: 'Advanced',
      createdAt: '2024-12-05'
    },
    {
      id: '8',
      title: 'Photography & Documentation Volunteer',
      ngoName: 'Indus Hospital',
      description: 'Document hospital programs and patient success stories through photography and video. Create visual content for fundraising and awareness campaigns.',
      location: 'Lahore',
      duration: '3 months',
      commitment: '8 hrs/week',
      skillsRequired: ['Photography', 'Video Editing', 'Storytelling'],
      sdgs: [3],
      deadline: '2025-01-05',
      opportunityType: 'On-ground',
      spotsAvailable: 3,
      applicants: 14,
      causeCategory: 'Health',
      skillLevel: 'Intermediate',
      createdAt: '2024-12-04'
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
      applicants: 16,
      causeCategory: 'Education',
      skillLevel: 'Advanced',
      createdAt: '2024-12-12'
    },
    {
      id: '10',
      title: 'Digital Literacy Trainer',
      ngoName: 'Code for Pakistan',
      description: 'Teach basic computer skills and digital literacy to youth in underserved areas. Develop curriculum and conduct hands-on training sessions.',
      location: 'Multan',
      duration: '4 months',
      commitment: '10 hrs/week',
      skillsRequired: ['Teaching', 'Computer Skills', 'Curriculum Development'],
      sdgs: [4, 9],
      deadline: '2025-01-25',
      opportunityType: 'On-ground',
      spotsAvailable: 7,
      applicants: 11,
      causeCategory: 'Technology',
      skillLevel: 'Intermediate',
      createdAt: '2024-12-03'
    },
    {
      id: '11',
      title: 'Community Health Awareness Volunteer',
      ngoName: 'Marie Stopes Pakistan',
      description: 'Conduct health awareness sessions on maternal health and family planning in rural communities. Distribute educational materials and provide basic health information.',
      location: 'Peshawar',
      duration: '3 months',
      commitment: '8 hrs/week',
      skillsRequired: ['Public Speaking', 'Community Outreach', 'Health Education'],
      sdgs: [3, 5],
      deadline: '2025-01-08',
      opportunityType: 'On-ground',
      spotsAvailable: 6,
      applicants: 9,
      causeCategory: 'Health',
      skillLevel: 'Beginner',
      createdAt: '2024-12-02'
    },
    {
      id: '12',
      title: 'Arts & Culture Program Assistant',
      ngoName: 'Kuch Khaas',
      description: 'Support arts and culture programs for youth. Help organize workshops, exhibitions, and community events that promote creative expression.',
      location: 'Islamabad',
      duration: '3 months',
      commitment: '6 hrs/week',
      skillsRequired: ['Event Planning', 'Arts Management', 'Social Media'],
      sdgs: [4, 11],
      deadline: '2025-01-12',
      opportunityType: 'Hybrid',
      spotsAvailable: 5,
      applicants: 13,
      causeCategory: 'Arts & Culture',
      skillLevel: 'Beginner',
      createdAt: '2024-12-01'
    }
  ];

  // Filter and search logic
  const filteredOpportunities = useMemo(() => {
    let result = [...allOpportunities];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(opp =>
        opp.title.toLowerCase().includes(query) ||
        opp.ngoName.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.skillsRequired.some(skill => skill.toLowerCase().includes(query)) ||
        opp.sdgs.some(sdg => sdg.toString().includes(query))
      );
    }

    // Location filter
    if (filters.location.length > 0) {
      result = result.filter(opp => filters.location.includes(opp.location));
    }

    // Opportunity type filter
    if (filters.opportunityType.length > 0) {
      result = result.filter(opp => filters.opportunityType.includes(opp.opportunityType));
    }

    // Cause categories filter
    if (filters.causeCategories.length > 0) {
      result = result.filter(opp => filters.causeCategories.includes(opp.causeCategory));
    }

    // SDGs filter
    if (filters.sdgs.length > 0) {
      result = result.filter(opp => filters.sdgs.some(sdg => opp.sdgs.includes(sdg)));
    }

    // Skill level filter
    if (filters.skillLevel.length > 0) {
      result = result.filter(opp => filters.skillLevel.includes(opp.skillLevel));
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        result.sort((a, b) => (b.applicants || 0) - (a.applicants || 0));
        break;
      case 'deadline':
        result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
    }

    return result;
  }, [searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);
  const paginatedOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      location: [],
      opportunityType: [],
      causeCategories: [],
      sdgs: [],
      skillLevel: []
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleLearnMore = (opportunityId: string) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(opportunityId);
    }
  };

  const handleApply = (opportunityId: string) => {
    console.log('Apply to opportunity:', opportunityId);
    // Open application modal or navigate to application page
  };

  const featuredOpportunity = allOpportunities[0];

  return (
    <div className="min-h-screen bg-white">
      <OpportunityHero totalOpportunities={allOpportunities.length} />
      
      <SearchFiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured Opportunity Banner */}
          <div className="mb-12">
            <FeaturedOpportunityBanner
              opportunity={featuredOpportunity}
              onApply={() => handleApply(featuredOpportunity.id)}
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <h2 className="text-slate-900 mb-2">All Opportunities</h2>
                <p className="text-slate-600">
                  Showing {paginatedOpportunities.length} of {filteredOpportunities.length} opportunities
                </p>
              </div>

              {/* Opportunities Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <OpportunityGrid
                  opportunities={paginatedOpportunities}
                  onLearnMore={handleLearnMore}
                  onApply={handleApply}
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border-2 border-slate-200 hover:border-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                          : 'border-2 border-slate-200 text-slate-700 hover:border-teal-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border-2 border-slate-200 hover:border-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <SidebarPanel />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}