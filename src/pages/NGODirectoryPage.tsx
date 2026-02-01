import React, { useState, useMemo } from 'react';
import { DirectoryHero } from '../components/ngo-directory/DirectoryHero';
import { FilterSidebar } from '../components/ngo-directory/FilterSidebar';
import { NGOGrid } from '../components/ngo-directory/NGOGrid';
import { Pagination } from '../components/ngo-directory/Pagination';
import { ExportButton } from '../components/exports/ExportButton';

interface NGODirectoryPageProps {
  onNavigateToProfile?: (ngoId: string) => void;
}

// Mock NGO data
const mockNGOs = [
  {
    id: '1',
    name: 'The Citizens Foundation',
    description: 'Leading education-focused NGO providing quality schooling to underserved communities across Pakistan with 1,800+ schools nationwide.',
    causes: ['Education', 'Child Welfare'],
    location: 'Karachi',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '2',
    name: 'Akhuwat Foundation',
    description: 'Interest-free microfinance institution empowering economically disadvantaged communities through ethical financial services.',
    causes: ['Economic Development', 'Poverty Alleviation'],
    location: 'Lahore',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '3',
    name: 'LRBT',
    description: 'Free eye care hospital network serving millions of patients annually with world-class ophthalmic treatment.',
    causes: ['Healthcare'],
    location: 'Karachi',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '4',
    name: 'WWF Pakistan',
    description: 'Environmental conservation and climate action initiatives for sustainable future and biodiversity protection.',
    causes: ['Environment'],
    location: 'Islamabad',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '5',
    name: 'Indus Hospital',
    description: 'Healthcare services network providing free medical treatment to underserved populations across Pakistan.',
    causes: ['Healthcare'],
    location: 'Karachi',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '6',
    name: 'SOS Children Villages',
    description: 'Child welfare organization providing family-based care and education support to orphaned children.',
    causes: ['Child Welfare', 'Education'],
    location: 'Lahore',
    verified: true,
    size: 'Medium (21-100)'
  },
  {
    id: '7',
    name: 'Edhi Foundation',
    description: 'Humanitarian services including healthcare, shelter, and emergency response across Pakistan.',
    causes: ['Healthcare', 'Disaster Relief', 'Human Rights'],
    location: 'Karachi',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '8',
    name: 'The Hunar Foundation',
    description: 'Skills training and vocational education for youth employment and economic empowerment.',
    causes: ['Education', 'Economic Development'],
    location: 'Karachi',
    verified: true,
    size: 'Medium (21-100)'
  },
  {
    id: '9',
    name: 'Shaukat Khanum',
    description: 'Cancer hospital providing world-class treatment to all patients regardless of financial status.',
    causes: ['Healthcare'],
    location: 'Lahore',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '10',
    name: 'Mama Baby Fund',
    description: 'Maternal and child healthcare services in rural and urban communities across Pakistan.',
    causes: ['Healthcare', 'Child Welfare'],
    location: 'Islamabad',
    verified: true,
    size: 'Small (1-20)'
  },
  {
    id: '11',
    name: 'Read Foundation',
    description: 'Literacy and education programs for children in underserved areas with focus on quality learning.',
    causes: ['Education'],
    location: 'Islamabad',
    verified: true,
    size: 'Medium (21-100)'
  },
  {
    id: '12',
    name: 'Aurat Foundation',
    description: 'Women empowerment initiatives focused on rights, education, and economic independence.',
    causes: ['Women Empowerment', 'Human Rights'],
    location: 'Islamabad',
    verified: true,
    size: 'Medium (21-100)'
  },
  {
    id: '13',
    name: 'Pakistan Red Crescent',
    description: 'Disaster relief and emergency response services providing humanitarian aid across Pakistan.',
    causes: ['Disaster Relief', 'Healthcare'],
    location: 'Islamabad',
    verified: true,
    size: 'Large (100+)'
  },
  {
    id: '14',
    name: 'CARE Foundation',
    description: 'Education-focused organization running schools for underprivileged children in urban areas.',
    causes: ['Education', 'Poverty Alleviation'],
    location: 'Rawalpindi',
    verified: true,
    size: 'Medium (21-100)'
  },
  {
    id: '15',
    name: 'Al-Khidmat Foundation',
    description: 'Comprehensive welfare organization providing education, healthcare, and disaster relief services.',
    causes: ['Healthcare', 'Education', 'Disaster Relief'],
    location: 'Karachi',
    verified: true,
    size: 'Large (100+)'
  }
];

export function NGODirectoryPage({ onNavigateToProfile }: NGODirectoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    causes: [] as string[],
    cities: [] as string[],
    sizes: [] as string[],
    verifiedOnly: false
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  // Filter NGOs based on search, tags, and filters
  const filteredNGOs = useMemo(() => {
    return mockNGOs.filter(ngo => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          ngo.name.toLowerCase().includes(query) ||
          ngo.description.toLowerCase().includes(query) ||
          ngo.location.toLowerCase().includes(query) ||
          ngo.causes.some(cause => cause.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Tag filter
      if (selectedTags.length > 0) {
        const matchesTags = selectedTags.some(tag => ngo.causes.includes(tag));
        if (!matchesTags) return false;
      }

      // Cause filter
      if (filters.causes.length > 0) {
        const matchesCause = filters.causes.some(cause => ngo.causes.includes(cause));
        if (!matchesCause) return false;
      }

      // City filter
      if (filters.cities.length > 0) {
        if (!filters.cities.includes(ngo.location)) return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        if (!filters.sizes.includes(ngo.size || '')) return false;
      }

      // Verified filter
      if (filters.verifiedOnly && !ngo.verified) return false;

      return true;
    });
  }, [searchQuery, selectedTags, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredNGOs.length / itemsPerPage);
  const paginatedNGOs = filteredNGOs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <DirectoryHero
        onSearchChange={setSearchQuery}
        onTagSelect={handleTagSelect}
        selectedTags={selectedTags}
      />

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600">
              Showing <span className="text-slate-900">{filteredNGOs.length}</span> NGOs
              {(searchQuery || selectedTags.length > 0 || filters.causes.length > 0 || filters.cities.length > 0 || filters.sizes.length > 0 || filters.verifiedOnly) && (
                <span> matching your criteria</span>
              )}
            </p>
            <ExportButton 
              entityType="ngos" 
              variant="secondary"
              showHistory={true}
            />
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <FilterSidebar onFilterChange={setFilters} />
            </div>

            {/* NGO Grid */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <NGOGrid ngos={paginatedNGOs} onNavigateToProfile={onNavigateToProfile} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}