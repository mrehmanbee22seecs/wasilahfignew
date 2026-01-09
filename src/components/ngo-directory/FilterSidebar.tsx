import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  causes: string[];
  cities: string[];
  sizes: string[];
  verifiedOnly: boolean;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    causes: [],
    cities: [],
    sizes: [],
    verifiedOnly: false
  });

  const [openSections, setOpenSections] = useState<string[]>(['cause', 'location', 'size']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const causes = [
    'Education',
    'Healthcare',
    'Environment',
    'Women Empowerment',
    'Child Welfare',
    'Human Rights',
    'Poverty Alleviation',
    'Disaster Relief',
    'Economic Development',
    'Animal Welfare'
  ];

  const cities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala'
  ];

  const sizes = ['Small (1-20)', 'Medium (21-100)', 'Large (100+)'];

  const handleCauseToggle = (cause: string) => {
    const newCauses = filters.causes.includes(cause)
      ? filters.causes.filter(c => c !== cause)
      : [...filters.causes, cause];
    
    const newFilters = { ...filters, causes: newCauses };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCityToggle = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    
    const newFilters = { ...filters, cities: newCities };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleVerifiedToggle = () => {
    const newFilters = { ...filters, verifiedOnly: !filters.verifiedOnly };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      causes: [],
      cities: [],
      sizes: [],
      verifiedOnly: false
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const hasActiveFilters = filters.causes.length > 0 || filters.cities.length > 0 || filters.sizes.length > 0 || filters.verifiedOnly;

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-700" />
          <h3 className="text-slate-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Verified Only */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={handleVerifiedToggle}
            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700">Verified NGOs Only</span>
        </label>
      </div>

      {/* Cause Category */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <button
          onClick={() => toggleSection('cause')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-slate-900">Cause Category</span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              openSections.includes('cause') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('cause') && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {causes.map((cause) => (
              <label key={cause} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.causes.includes(cause)}
                  onChange={() => handleCauseToggle(cause)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 text-sm">{cause}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* City/Region */}
      <div className="mb-6 pb-6 border-b border-slate-200">
        <button
          onClick={() => toggleSection('location')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-slate-900">City / Region</span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              openSections.includes('location') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('location') && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cities.map((city) => (
              <label key={city} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.cities.includes(city)}
                  onChange={() => handleCityToggle(city)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 text-sm">{city}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* NGO Size */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="text-slate-900">Organization Size</span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform ${
              openSections.includes('size') ? 'rotate-180' : ''
            }`}
          />
        </button>
        {openSections.includes('size') && (
          <div className="space-y-2">
            {sizes.map((size) => (
              <label key={size} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.sizes.includes(size)}
                  onChange={() => handleSizeToggle(size)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-600 text-sm">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
