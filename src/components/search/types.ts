/**
 * Global Search Type Definitions
 * Types for the global search system
 */

export type SearchEntityType =
  | 'all'
  | 'project'
  | 'ngo'
  | 'volunteer'
  | 'opportunity'
  | 'corporate'
  | 'payment'
  | 'user'
  | 'case';

export type SearchableEntity = {
  id: string;
  type: Exclude<SearchEntityType, 'all'>;
  title: string;
  description: string;
  subtitle?: string;
  category?: string;
  status?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  url?: string;
  image?: string;
  relevanceScore?: number;
};

export type SearchResult = SearchableEntity & {
  matchedFields: string[];
  highlightedTitle?: string;
  highlightedDescription?: string;
};

export type SearchFilter = {
  type: SearchEntityType;
  category?: string;
  status?: string;
  tags?: string[];
};

export type RecentSearch = {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
};

export type SearchStats = {
  totalResults: number;
  byType: Record<string, number>;
  searchTime: number;
};
