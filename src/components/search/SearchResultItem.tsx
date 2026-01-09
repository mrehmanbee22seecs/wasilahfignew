import React from 'react';
import {
  FolderOpen,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  User,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { SearchResult } from './types';

type SearchResultItemProps = {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  onNavigate: (result: SearchResult) => void;
};

const typeConfig: Record<
  string,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    label: string;
  }
> = {
  project: {
    icon: <FolderOpen className="w-4 h-4" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    label: 'Project',
  },
  ngo: {
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    label: 'NGO',
  },
  volunteer: {
    icon: <Users className="w-4 h-4" />,
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    label: 'Volunteer',
  },
  opportunity: {
    icon: <Briefcase className="w-4 h-4" />,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    label: 'Opportunity',
  },
  corporate: {
    icon: <Building2 className="w-4 h-4" />,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    label: 'Corporate',
  },
  payment: {
    icon: <DollarSign className="w-4 h-4" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    label: 'Payment',
  },
  user: {
    icon: <User className="w-4 h-4" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    label: 'User',
  },
  case: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    label: 'Case',
  },
};

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  'Active Partner': 'bg-green-100 text-green-700',
  Open: 'bg-blue-100 text-blue-700',
  Urgent: 'bg-red-100 text-red-700',
  Completed: 'bg-gray-100 text-gray-700',
  'On Hold': 'bg-amber-100 text-amber-700',
  Hold: 'bg-amber-100 text-amber-700',
  Verified: 'bg-emerald-100 text-emerald-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
  Escalated: 'bg-red-100 text-red-700',
};

export function SearchResultItem({
  result,
  isSelected,
  onClick,
  onNavigate,
}: SearchResultItemProps) {
  const config = typeConfig[result.type] || typeConfig.project;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onNavigate(result);
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`group relative px-4 py-3 cursor-pointer transition-all border-l-4 ${
        isSelected
          ? 'bg-blue-50 border-blue-600'
          : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgColor} ${config.color} flex items-center justify-center`}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm text-gray-900 truncate">
                  {result.title}
                </h4>
                {/* Type Badge */}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}
                >
                  {config.label}
                </span>
                {/* Status Badge */}
                {result.status && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      statusColors[result.status] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {result.status}
                  </span>
                )}
              </div>
            </div>

            {/* Navigate Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(result);
              }}
              className={`flex-shrink-0 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ${
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Subtitle */}
          {result.subtitle && (
            <p className="text-xs text-gray-600 mb-1">{result.subtitle}</p>
          )}

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-1">
            {result.description}
          </p>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {result.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
              {result.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{result.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          {result.metadata && Object.keys(result.metadata).length > 0 && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              {result.type === 'project' && result.metadata.budget && (
                <span>Budget: {result.metadata.budget}</span>
              )}
              {result.type === 'ngo' && result.metadata.projects && (
                <span>{result.metadata.projects} projects</span>
              )}
              {result.type === 'volunteer' && result.metadata.hours && (
                <span>{result.metadata.hours} hours</span>
              )}
              {result.type === 'opportunity' && result.metadata.positions && (
                <span>{result.metadata.positions} positions</span>
              )}
              {result.type === 'payment' && result.metadata.amount && (
                <span>PKR {result.metadata.amount.toLocaleString()}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Relevance Score (Debug - remove in production) */}
      {result.relevanceScore !== undefined && (
        <div className="absolute top-2 right-2 text-xs text-gray-400">
          {Math.round(result.relevanceScore)}%
        </div>
      )}
    </div>
  );
}
