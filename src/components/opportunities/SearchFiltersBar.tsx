import React from 'react';
import { Search, MapPin, Briefcase, Target, Award, TrendingUp, X } from 'lucide-react';

interface SearchFiltersBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: {
    location: string[];
    opportunityType: string[];
    causeCategories: string[];
    sdgs: number[];
    skillLevel: string[];
  };
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchFiltersBar({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  sortBy,
  onSortChange
}: SearchFiltersBarProps) {
  const locations = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar', 'Quetta'];
  const opportunityTypes = ['On-ground', 'Hybrid', 'Remote'];
  const causeCategories = ['Education', 'Health', 'Environment', 'Poverty Alleviation', 'Women Empowerment', 'Youth Development', 'Technology', 'Arts & Culture'];
  const sdgList = [1, 2, 3, 4, 5, 8, 10, 13, 17];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'deadline', label: 'Closest Deadline' }
  ];

  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  const toggleFilter = (filterType: string, value: any) => {
    const currentValues = filters[filterType as keyof typeof filters] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];
    onFilterChange(filterType, newValues);
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="sticky top-20 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, NGO, or SDG..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {/* Location Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full hover:border-teal-600 transition-all">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span className="text-slate-700">Location</span>
              {filters.location.length > 0 && (
                <span className="px-2 py-0.5 bg-teal-600 text-white rounded-full text-xs">
                  {filters.location.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {locations.map((location) => (
                  <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => toggleFilter('location', location)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-600"
                    />
                    <span className="text-slate-700 text-sm">{location}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Opportunity Type Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full hover:border-teal-600 transition-all">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700">Type</span>
              {filters.opportunityType.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                  {filters.opportunityType.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="space-y-2">
                {opportunityTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={filters.opportunityType.includes(type)}
                      onChange={() => toggleFilter('opportunityType', type)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                    />
                    <span className="text-slate-700 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Cause Categories Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full hover:border-teal-600 transition-all">
              <Target className="w-4 h-4 text-violet-600" />
              <span className="text-slate-700">Cause</span>
              {filters.causeCategories.length > 0 && (
                <span className="px-2 py-0.5 bg-violet-600 text-white rounded-full text-xs">
                  {filters.causeCategories.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {causeCategories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={filters.causeCategories.includes(category)}
                      onChange={() => toggleFilter('causeCategories', category)}
                      className="w-4 h-4 text-violet-600 rounded border-slate-300 focus:ring-violet-600"
                    />
                    <span className="text-slate-700 text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SDG Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full hover:border-teal-600 transition-all">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700">SDGs</span>
              {filters.sdgs.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-xs">
                  {filters.sdgs.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="flex flex-wrap gap-2">
                {sdgList.map((sdg) => (
                  <button
                    key={sdg}
                    onClick={() => toggleFilter('sdgs', sdg)}
                    className={`w-10 h-10 ${sdgColors[sdg - 1]} rounded-lg flex items-center justify-center text-white text-sm shadow-sm transition-all ${
                      filters.sdgs.includes(sdg) ? 'ring-2 ring-slate-900 ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {sdg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Level Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-full hover:border-teal-600 transition-all">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-slate-700">Skill Level</span>
              {filters.skillLevel.length > 0 && (
                <span className="px-2 py-0.5 bg-orange-600 text-white rounded-full text-xs">
                  {filters.skillLevel.length}
                </span>
              )}
            </button>
            
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="space-y-2">
                {skillLevels.map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      checked={filters.skillLevel.includes(level)}
                      onChange={() => toggleFilter('skillLevel', level)}
                      className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-600"
                    />
                    <span className="text-slate-700 text-sm">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200 transition-all"
            >
              <X className="w-4 h-4" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-between">
          <div className="text-slate-600 text-sm">
            Showing results based on your filters
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-600 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-lg focus:border-teal-600 focus:outline-none text-slate-700 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
