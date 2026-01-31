import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Loader,
  Inbox,
  Command,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { SearchResultItem } from './SearchResultItem';
import { SearchEntityType, SearchResult } from './types';
import { useGlobalSearch } from '../../hooks/useGlobalSearch';
import { toast } from 'sonner';

type GlobalSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const typeFilters: { value: SearchEntityType; label: string; count?: number }[] = [
  { value: 'all', label: 'All' },
  { value: 'project', label: 'Projects' },
  { value: 'ngo', label: 'NGOs' },
  { value: 'volunteer', label: 'Volunteers' },
  { value: 'opportunity', label: 'Opportunities' },
  { value: 'corporate', label: 'Corporates' },
  { value: 'payment', label: 'Payments' },
  { value: 'user', label: 'Users' },
  { value: 'case', label: 'Cases' },
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    selectedType,
    setSelectedType,
    results,
    isSearching,
    recentSearches,
    clearRecentSearches,
    searchStats,
    resultsByType,
  } = useGlobalSearch();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showTypeFilters, setShowTypeFilters] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedType('all');
    }
  }, [isOpen, setQuery, setSelectedType]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;

        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;

        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleNavigateToResult(results[selectedIndex]);
          }
          break;

        case 'Tab':
          e.preventDefault();
          // Cycle through type filters
          const currentIndex = typeFilters.findIndex(
            (f) => f.value === selectedType
          );
          const nextIndex = (currentIndex + 1) % typeFilters.length;
          setSelectedType(typeFilters[nextIndex].value);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, selectedType, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleNavigateToResult = (result: SearchResult) => {
    console.log('Navigate to:', result);
    toast.success(`Opening ${result.type}: ${result.title}`);
    onClose();
    // In production, this would navigate to the actual page/resource
  };

  const handleRecentSearchClick = (recentQuery: string) => {
    setQuery(recentQuery);
    inputRef.current?.focus();
  };

  const handleClearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const showRecentSearches = !query && recentSearches.length > 0;
  const showEmptyState = query && !isSearching && results.length === 0;
  const showResults = query && results.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, NGOs, volunteers, opportunities..."
                className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none"
              />
              {isSearching && (
                <Loader className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              )}
              {query && !isSearching && (
                <button
                  onClick={handleClearQuery}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
              >
                <span className="text-xs">ESC</span>
              </button>
            </div>
          </div>

          {/* Type Filters */}
          {query && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setShowTypeFilters(!showTypeFilters)}
                  className="flex-shrink-0 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </button>
                {typeFilters.map((filter) => {
                  const count = resultsByType[filter.value] || 0;
                  const isActive = selectedType === filter.value;

                  return (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedType(filter.value)}
                      className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {filter.label}
                      {filter.value !== 'all' && count > 0 && (
                        <span className="ml-1.5 opacity-75">({count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Stats */}
          {searchStats && (
            <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <p className="text-xs text-blue-700">
                Found {searchStats.totalResults} results in{' '}
                {searchStats.searchTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-blue-600">
                Use ↑↓ to navigate, Enter to select, Tab to change filter
              </p>
            </div>
          )}

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Recent Searches */}
            {showRecentSearches && (
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm text-gray-700">Recent Searches</h3>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((recent) => (
                    <button
                      key={recent.id}
                      onClick={() => handleRecentSearchClick(recent.query)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                    >
                      <span>{recent.query}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {recent.resultCount} results
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Tips (when no query) */}
            {!query && recentSearches.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">
                  Quick Search Tips
                </h3>
                <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Search across all projects, NGOs, volunteers, and more</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Use Tab to cycle through filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Use ↑↓ arrows to navigate results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Press Enter to open selected result</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Search Results */}
            {showResults && (
              <div ref={resultsRef} className="divide-y divide-gray-100">
                {results.map((result, index) => (
                  <SearchResultItem
                    key={result.id}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={() => setSelectedIndex(index)}
                    onNavigate={handleNavigateToResult}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
              <div className="px-6 py-12 text-center">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-1">
                  No results found
                </h3>
                <p className="text-sm text-gray-500">
                  Try searching with different keywords or filters
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    <Command className="w-3 h-3 inline" />K
                  </kbd>
                  <span>to open</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">
                    ESC
                  </kbd>
                  <span>to close</span>
                </div>
              </div>
              <span>Powered by Wasilah Search</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
