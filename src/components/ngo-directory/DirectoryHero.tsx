import React from 'react';
import { Search } from 'lucide-react';

interface DirectoryHeroProps {
  onSearchChange?: (value: string) => void;
  onTagSelect?: (tag: string) => void;
  selectedTags?: string[];
}

export function DirectoryHero({ onSearchChange, onTagSelect, selectedTags = [] }: DirectoryHeroProps) {
  const popularCauses = [
    'Education',
    'Health',
    'Environment',
    'Women Empowerment',
    'Human Rights',
    'Charity',
    'Disaster Relief'
  ];

  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Text Content */}
        <div className="text-center mb-10">
          <h1 className="text-slate-900 mb-4">
            Discover Verified NGOs Across Pakistan
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Find organizations working in causes you care about — verified, transparent, and impact-driven.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              placeholder="Search by NGO name, cause, or city..."
              className="w-full pl-16 pr-6 py-5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400 shadow-sm"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {popularCauses.map((cause) => {
              const isSelected = selectedTags.includes(cause);
              return (
                <button
                  key={cause}
                  onClick={() => onTagSelect?.(cause)}
                  className={`px-5 py-2.5 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {cause}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
