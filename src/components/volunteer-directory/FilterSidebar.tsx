import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    sdgs: number[];
    skills: string[];
    universities: string[];
    availability: string[];
    experienceLevel: string[];
  };
  onFilterChange: (filterType: string, value: any) => void;
  onClearFilters: () => void;
}

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const sdgList = [
    { id: 1, name: 'No Poverty', color: 'bg-red-500' },
    { id: 2, name: 'Zero Hunger', color: 'bg-yellow-500' },
    { id: 3, name: 'Good Health', color: 'bg-green-500' },
    { id: 4, name: 'Quality Education', color: 'bg-red-600' },
    { id: 5, name: 'Gender Equality', color: 'bg-orange-500' },
    { id: 8, name: 'Decent Work', color: 'bg-red-700' },
    { id: 10, name: 'Reduced Inequalities', color: 'bg-pink-500' },
    { id: 13, name: 'Climate Action', color: 'bg-green-600' },
    { id: 17, name: 'Partnerships', color: 'bg-blue-700' }
  ];

  const skillsList = [
    'Teaching & Mentoring',
    'Event Planning',
    'Fundraising',
    'Social Media Marketing',
    'Public Speaking',
    'Photography',
    'Community Outreach',
    'Project Management',
    'Data Analysis',
    'Graphic Design',
    'Content Writing',
    'Video Editing'
  ];

  const universitiesList = [
    'IBA Karachi',
    'LUMS Lahore',
    'NUST Islamabad',
    'Aga Khan University',
    'Karachi University',
    'Punjab University',
    'FAST University',
    'GIKI',
    'NED University'
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Full-time',
    'Part-time',
    'Flexible'
  ];

  const experienceLevels = [
    'Beginner (0-6 months)',
    'Intermediate (6 months - 2 years)',
    'Advanced (2+ years)'
  ];

  const toggleFilter = (filterType: string, value: any) => {
    const currentValues = filters[filterType as keyof typeof filters] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];
    onFilterChange(filterType, newValues);
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    <aside className="bg-white rounded-xl border-2 border-slate-200 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* SDG Filter */}
        <div>
          <h4 className="text-slate-900 text-sm mb-3">SDG Focus</h4>
          <div className="flex flex-wrap gap-2">
            {sdgList.map((sdg) => (
              <button
                key={sdg.id}
                onClick={() => toggleFilter('sdgs', sdg.id)}
                className={`w-10 h-10 ${sdg.color} rounded-lg flex items-center justify-center text-white text-sm shadow-sm transition-all ${
                  filters.sdgs.includes(sdg.id) ? 'ring-2 ring-blue-600 ring-offset-2' : 'opacity-60 hover:opacity-100'
                }`}
                title={sdg.name}
              >
                {sdg.id}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Filter */}
        <div>
          <h4 className="text-slate-900 text-sm mb-3">Skills</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {skillsList.map((skill) => (
              <label key={skill} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={filters.skills.includes(skill)}
                  onChange={() => toggleFilter('skills', skill)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                />
                <span className="text-slate-700 text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Universities Filter */}
        <div>
          <h4 className="text-slate-900 text-sm mb-3">University</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {universitiesList.map((university) => (
              <label key={university} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={filters.universities.includes(university)}
                  onChange={() => toggleFilter('universities', university)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                />
                <span className="text-slate-700 text-sm">{university}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h4 className="text-slate-900 text-sm mb-3">Availability</h4>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(option)}
                  onChange={() => toggleFilter('availability', option)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                />
                <span className="text-slate-700 text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <h4 className="text-slate-900 text-sm mb-3">Experience Level</h4>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
                <input
                  type="checkbox"
                  checked={filters.experienceLevel.includes(level)}
                  onChange={() => toggleFilter('experienceLevel', level)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-600"
                />
                <span className="text-slate-700 text-sm">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
