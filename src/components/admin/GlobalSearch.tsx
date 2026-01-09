import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, User, Briefcase, AlertCircle, Clock } from 'lucide-react';

export interface SearchResult {
  id: string;
  type: 'ngo' | 'project' | 'case' | 'volunteer' | 'vetting';
  title: string;
  subtitle?: string;
  description?: string;
  status?: string;
  url?: string;
  meta?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

export function GlobalSearch({ isOpen, onClose, onResultClick }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Mock results
        const mockResults: SearchResult[] = [
          {
            id: 'ngo-001',
            type: 'ngo',
            title: 'Pakistan Education Foundation',
            subtitle: 'NGO-2024-001',
            description: 'Providing quality education to underprivileged children',
            status: 'Approved',
            url: '/ngo/ngo-001',
            meta: 'Karachi, Pakistan',
          },
          {
            id: 'vet-001',
            type: 'vetting',
            title: 'Vetting Request #vet-001',
            subtitle: 'Green Pakistan Initiative',
            description: 'Pending vetting request',
            status: 'Pending',
            url: '/admin?vetting=vet-001',
            meta: '2 days ago',
          },
          {
            id: 'case-001',
            type: 'case',
            title: 'CASE-001: Suspicious Financial Report',
            subtitle: 'Pakistan Education Foundation',
            description: 'High priority investigation case',
            status: 'Investigating',
            url: '/admin/cases/case-001',
            meta: '3 days ago',
          },
          {
            id: 'proj-102',
            type: 'project',
            title: 'Clean Water Initiative - Phase 2',
            subtitle: 'Green Pakistan Initiative',
            description: 'Water infrastructure project',
            status: 'Active',
            url: '/projects/proj-102',
            meta: 'PKR 450,000',
          },
          {
            id: 'vol-045',
            type: 'volunteer',
            title: 'Ali Hassan',
            subtitle: 'Volunteer',
            description: '32 hours volunteered • 5 projects',
            status: 'Active',
            url: '/volunteers/vol-045',
            meta: 'Lahore, Pakistan',
          },
        ].filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
            r.description?.toLowerCase().includes(query.toLowerCase())
        );

        setResults(mockResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    onClose();
    setQuery('');
    setResults([]);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'ngo':
        return Briefcase;
      case 'project':
        return FileText;
      case 'case':
        return AlertCircle;
      case 'volunteer':
        return User;
      case 'vetting':
        return Clock;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'ngo':
        return 'text-blue-600 bg-blue-100';
      case 'project':
        return 'text-emerald-600 bg-emerald-100';
      case 'case':
        return 'text-red-600 bg-red-100';
      case 'volunteer':
        return 'text-purple-600 bg-purple-100';
      case 'vetting':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NGOs, projects, cases, volunteers..."
              className="flex-1 text-gray-900 placeholder-gray-500 focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            ) : query && results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No results found</p>
                <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => {
                  const Icon = getTypeIcon(result.type);
                  const colorClass = getTypeColor(result.type);
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                        focus:outline-none
                        ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                      `}
                    >
                      <div className={`flex-shrink-0 p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm text-gray-900 truncate">{result.title}</h3>
                          {result.status && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {result.status}
                            </span>
                          )}
                        </div>
                        {result.subtitle && (
                          <p className="text-xs text-gray-600 mb-1">{result.subtitle}</p>
                        )}
                        {result.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">{result.description}</p>
                        )}
                        {result.meta && (
                          <p className="text-xs text-gray-400 mt-1">{result.meta}</p>
                        )}
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          ↵
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Start typing to search...</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">NGOs</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Projects</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Cases</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Volunteers</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Vettings</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>{' '}
                Navigate
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>{' '}
                Select
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>{' '}
                Close
              </span>
            </div>
            {results.length > 0 && <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>}
          </div>
        </div>
      </div>
    </>
  );
}
