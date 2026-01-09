import React, { useState } from 'react';
import { Search, X, ChevronDown, MapPin, Calendar, Tag } from 'lucide-react';

export type FilterOptions = {
  categories?: { value: string; label: string }[];
  locations?: { value: string; label: string }[];
  sdgs?: { id: string; label: string; iconUrl?: string }[];
  dateRanges?: { value: string; label: string }[];
};

export type ActiveFilters = {
  search?: string;
  category?: string;
  location?: string;
  sdgs?: string[];
  dateRange?: string;
};

export type FilterRowProps = {
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  options: FilterOptions;
  resultCount?: number;
  className?: string;
};

export function FilterRow({
  filters,
  onFilterChange,
  options,
  resultCount,
  className = '',
}: FilterRowProps) {
  const [isSDGMenuOpen, setIsSDGMenuOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value || undefined });
  };

  const handleLocationChange = (value: string) => {
    onFilterChange({ ...filters, location: value || undefined });
  };

  const handleDateRangeChange = (value: string) => {
    onFilterChange({ ...filters, dateRange: value || undefined });
  };

  const handleSDGToggle = (sdgId: string) => {
    const currentSDGs = filters.sdgs || [];
    const newSDGs = currentSDGs.includes(sdgId)
      ? currentSDGs.filter((id) => id !== sdgId)
      : [...currentSDGs, sdgId];

    onFilterChange({
      ...filters,
      sdgs: newSDGs.length > 0 ? newSDGs : undefined,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.location ||
    (filters.sdgs && filters.sdgs.length > 0) ||
    filters.dateRange;

  const activeFilterCount =
    [
      filters.category,
      filters.location,
      filters.dateRange,
      filters.sdgs?.length,
    ].filter(Boolean).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Filter Row */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px] relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by project, skill, NGO…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            aria-label="Search opportunities"
          />
        </div>

        {/* Category Dropdown */}
        {options.categories && options.categories.length > 0 && (
          <div className="relative">
            <select
              value={filters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white cursor-pointer min-w-[140px]"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {options.categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Location Dropdown */}
        {options.locations && options.locations.length > 0 && (
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={filters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white cursor-pointer min-w-[140px]"
              aria-label="Filter by location"
            >
              <option value="">All Locations</option>
              {options.locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}

        {/* SDG Multi-Select */}
        {options.sdgs && options.sdgs.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsSDGMenuOpen(!isSDGMenuOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white min-w-[120px]"
              aria-label="Filter by SDG"
              aria-expanded={isSDGMenuOpen}
              aria-haspopup="true"
            >
              <Tag className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span className="text-gray-700">
                SDGs
                {filters.sdgs && filters.sdgs.length > 0 && (
                  <span className="ml-1 text-emerald-600">
                    ({filters.sdgs.length})
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isSDGMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {/* SDG Dropdown Menu */}
            {isSDGMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {options.sdgs.map((sdg) => (
                    <label
                      key={sdg.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.sdgs?.includes(sdg.id) || false}
                        onChange={() => handleSDGToggle(sdg.id)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {sdg.iconUrl && (
                          <img
                            src={sdg.iconUrl}
                            alt=""
                            className="w-5 h-5 object-contain"
                          />
                        )}
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {sdg.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Date Range Dropdown */}
        {options.dateRanges && options.dateRanges.length > 0 && (
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={filters.dateRange || ''}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white cursor-pointer min-w-[140px]"
              aria-label="Filter by date"
            >
              <option value="">All Dates</option>
              {options.dateRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg"
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {filters.category && (
            <FilterChip
              label={
                options.categories?.find((c) => c.value === filters.category)
                  ?.label || filters.category
              }
              onRemove={() => handleCategoryChange('')}
            />
          )}

          {filters.location && (
            <FilterChip
              label={
                options.locations?.find((l) => l.value === filters.location)
                  ?.label || filters.location
              }
              onRemove={() => handleLocationChange('')}
              icon={<MapPin className="w-3 h-3" />}
            />
          )}

          {filters.dateRange && (
            <FilterChip
              label={
                options.dateRanges?.find((d) => d.value === filters.dateRange)
                  ?.label || filters.dateRange
              }
              onRemove={() => handleDateRangeChange('')}
              icon={<Calendar className="w-3 h-3" />}
            />
          )}

          {filters.sdgs &&
            filters.sdgs.map((sdgId) => {
              const sdg = options.sdgs?.find((s) => s.id === sdgId);
              return sdg ? (
                <FilterChip
                  key={sdgId}
                  label={sdg.label}
                  onRemove={() => handleSDGToggle(sdgId)}
                  icon={
                    sdg.iconUrl ? (
                      <img src={sdg.iconUrl} alt="" className="w-3 h-3" />
                    ) : undefined
                  }
                />
              ) : null;
            })}

          {resultCount !== undefined && (
            <span className="text-sm text-gray-500 ml-auto">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>
      )}

      {/* Close SDG menu when clicking outside */}
      {isSDGMenuOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsSDGMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

type FilterChipProps = {
  label: string;
  onRemove: () => void;
  icon?: React.ReactNode;
};

function FilterChip({ label, onRemove, icon }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate max-w-[200px]">{label}</span>
      <button
        onClick={onRemove}
        className="flex-shrink-0 hover:bg-emerald-100 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" aria-hidden="true" />
      </button>
    </span>
  );
}
