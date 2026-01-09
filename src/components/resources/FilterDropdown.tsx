import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  tags: string[];
  sdgs: { id: string; name: string }[];
  selectedTags: string[];
  selectedSdgs: string[];
  onTagsChange: (tags: string[]) => void;
  onSdgsChange: (sdgs: string[]) => void;
  onClearAll: () => void;
  sectors?: string[];
  selectedSectors?: string[];
  onSectorsChange?: (sectors: string[]) => void;
  years?: number[];
  selectedYear?: number;
  onYearChange?: (year: number | undefined) => void;
}

export function FilterDropdown({
  tags,
  sdgs,
  selectedTags,
  selectedSdgs,
  onTagsChange,
  onSdgsChange,
  onClearAll,
  sectors,
  selectedSectors = [],
  onSectorsChange,
  years,
  selectedYear,
  onYearChange
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'tags' | 'sdgs' | 'sectors' | 'years'>('tags');

  const activeFiltersCount = selectedTags.length + selectedSdgs.length + selectedSectors.length + (selectedYear ? 1 : 0);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const toggleSdg = (sdg: string) => {
    if (selectedSdgs.includes(sdg)) {
      onSdgsChange(selectedSdgs.filter(s => s !== sdg));
    } else {
      onSdgsChange([...selectedSdgs, sdg]);
    }
  };

  const toggleSector = (sector: string) => {
    if (!onSectorsChange) return;
    if (selectedSectors.includes(sector)) {
      onSectorsChange(selectedSectors.filter(s => s !== sector));
    } else {
      onSectorsChange([...selectedSectors, sector]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Open filters"
        aria-expanded={isOpen}
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-sm font-medium text-slate-900">Filter Resources</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="max-h-96 overflow-y-auto">
              {/* Tags */}
              <div className="p-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveSection(activeSection === 'tags' ? 'tags' : 'tags')}
                  className="flex items-center justify-between w-full text-sm font-medium text-slate-900 mb-3"
                >
                  <span>Tags</span>
                  <span className="text-xs text-slate-500">
                    {selectedTags.length > 0 && `${selectedTags.length} selected`}
                  </span>
                </button>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                          ${isSelected
                            ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        `}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SDGs */}
              <div className="p-4 border-b border-slate-200">
                <button
                  onClick={() => setActiveSection(activeSection === 'sdgs' ? 'sdgs' : 'sdgs')}
                  className="flex items-center justify-between w-full text-sm font-medium text-slate-900 mb-3"
                >
                  <span>UN SDGs</span>
                  <span className="text-xs text-slate-500">
                    {selectedSdgs.length > 0 && `${selectedSdgs.length} selected`}
                  </span>
                </button>
                <div className="grid grid-cols-3 gap-2">
                  {sdgs.map((sdg) => {
                    const isSelected = selectedSdgs.includes(sdg.id);
                    return (
                      <button
                        key={sdg.id}
                        onClick={() => toggleSdg(sdg.id)}
                        className={`
                          p-2 rounded-lg text-xs font-medium transition-all text-center
                          ${isSelected
                            ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white ring-2 ring-emerald-500'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }
                        `}
                        title={sdg.name}
                      >
                        SDG {sdg.id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sectors (Reports only) */}
              {sectors && onSectorsChange && (
                <div className="p-4 border-b border-slate-200">
                  <button
                    onClick={() => setActiveSection(activeSection === 'sectors' ? 'sectors' : 'sectors')}
                    className="flex items-center justify-between w-full text-sm font-medium text-slate-900 mb-3"
                  >
                    <span>Sectors</span>
                    <span className="text-xs text-slate-500">
                      {selectedSectors.length > 0 && `${selectedSectors.length} selected`}
                    </span>
                  </button>
                  <div className="space-y-2">
                    {sectors.map((sector) => {
                      const isSelected = selectedSectors.includes(sector);
                      return (
                        <button
                          key={sector}
                          onClick={() => toggleSector(sector)}
                          className={`
                            w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors
                            ${isSelected
                              ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          {sector}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Years (Reports only) */}
              {years && onYearChange && (
                <div className="p-4">
                  <button
                    onClick={() => setActiveSection(activeSection === 'years' ? 'years' : 'years')}
                    className="flex items-center justify-between w-full text-sm font-medium text-slate-900 mb-3"
                  >
                    <span>Year</span>
                    <span className="text-xs text-slate-500">
                      {selectedYear && selectedYear}
                    </span>
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    {years.map((year) => {
                      const isSelected = selectedYear === year;
                      return (
                        <button
                          key={year}
                          onClick={() => onYearChange(isSelected ? undefined : year)}
                          className={`
                            px-3 py-2 rounded-lg text-xs font-medium transition-colors
                            ${isSelected
                              ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }
                          `}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {activeFiltersCount > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => {
                    onClearAll();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
