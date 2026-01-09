import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SearchableEntity,
  SearchResult,
  SearchEntityType,
  RecentSearch,
  SearchStats,
} from '../components/search/types';
import { mockSearchData } from '../components/search/searchData';

/**
 * Custom hook for global search functionality
 * Implements fuzzy search, filtering, and recent searches
 */
export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<SearchEntityType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [searchStats, setSearchStats] = useState<SearchStats | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wasilah_recent_searches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (searchQuery: string, resultCount: number) => {
      if (!searchQuery.trim()) return;

      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query: searchQuery,
        timestamp: new Date().toISOString(),
        resultCount,
      };

      const updated = [
        newSearch,
        ...recentSearches.filter((s) => s.query !== searchQuery),
      ].slice(0, 10); // Keep only last 10

      setRecentSearches(updated);
      localStorage.setItem('wasilah_recent_searches', JSON.stringify(updated));
    },
    [recentSearches]
  );

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('wasilah_recent_searches');
  }, []);

  // Simple fuzzy matching algorithm
  const fuzzyMatch = useCallback((str: string, pattern: string): number => {
    const strLower = str.toLowerCase();
    const patternLower = pattern.toLowerCase();

    // Exact match gets highest score
    if (strLower === patternLower) return 100;

    // Starts with pattern gets high score
    if (strLower.startsWith(patternLower)) return 90;

    // Contains pattern gets medium score
    if (strLower.includes(patternLower)) return 70;

    // Fuzzy character matching
    let patternIdx = 0;
    let score = 0;
    let consecutiveMatches = 0;

    for (let i = 0; i < strLower.length; i++) {
      if (strLower[i] === patternLower[patternIdx]) {
        score += 1 + consecutiveMatches * 2; // Bonus for consecutive matches
        consecutiveMatches++;
        patternIdx++;

        if (patternIdx === patternLower.length) {
          return Math.min(50 + score, 69); // Cap fuzzy matches below "contains"
        }
      } else {
        consecutiveMatches = 0;
      }
    }

    return 0; // No match
  }, []);

  // Search function with fuzzy matching
  const performSearch = useCallback(
    (searchQuery: string, type: SearchEntityType): SearchResult[] => {
      if (!searchQuery.trim()) return [];

      const startTime = performance.now();
      const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);

      let searchResults = mockSearchData
        .filter((entity) => type === 'all' || entity.type === type)
        .map((entity) => {
          // Calculate relevance score
          let maxScore = 0;

          // Search in title (highest weight)
          searchTerms.forEach((term) => {
            const titleScore = fuzzyMatch(entity.title, term) * 2;
            maxScore = Math.max(maxScore, titleScore);
          });

          // Search in description
          searchTerms.forEach((term) => {
            const descScore = fuzzyMatch(entity.description, term) * 1.5;
            maxScore = Math.max(maxScore, descScore);
          });

          // Search in subtitle
          if (entity.subtitle) {
            searchTerms.forEach((term) => {
              const subtitleScore = fuzzyMatch(entity.subtitle!, term) * 1.2;
              maxScore = Math.max(maxScore, subtitleScore);
            });
          }

          // Search in tags
          if (entity.tags) {
            entity.tags.forEach((tag) => {
              searchTerms.forEach((term) => {
                const tagScore = fuzzyMatch(tag, term);
                maxScore = Math.max(maxScore, tagScore);
              });
            });
          }

          // Search in category
          if (entity.category) {
            searchTerms.forEach((term) => {
              const catScore = fuzzyMatch(entity.category!, term) * 0.8;
              maxScore = Math.max(maxScore, catScore);
            });
          }

          return {
            ...entity,
            matchedFields: [], // Could populate with actual matched field names
            relevanceScore: maxScore,
          } as SearchResult;
        })
        .filter((result) => result.relevanceScore! > 0)
        .sort((a, b) => b.relevanceScore! - a.relevanceScore!);

      const endTime = performance.now();

      // Calculate stats
      const byType: Record<string, number> = {};
      searchResults.forEach((result) => {
        byType[result.type] = (byType[result.type] || 0) + 1;
      });

      setSearchStats({
        totalResults: searchResults.length,
        byType,
        searchTime: endTime - startTime,
      });

      return searchResults;
    },
    [fuzzyMatch]
  );

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchStats(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(() => {
      const searchResults = performSearch(query, selectedType);
      setResults(searchResults);
      setIsSearching(false);

      // Save to recent searches after a successful search
      if (searchResults.length > 0) {
        saveRecentSearch(query, searchResults.length);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, selectedType, performSearch, saveRecentSearch]);

  // Get results by type for quick filters
  const resultsByType = useMemo(() => {
    const byType: Record<string, number> = {};
    results.forEach((result) => {
      byType[result.type] = (byType[result.type] || 0) + 1;
    });
    return byType;
  }, [results]);

  return {
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
  };
}
