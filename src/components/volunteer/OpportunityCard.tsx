import React from 'react';
import { MapPin, Clock, Users, Heart, Calendar } from 'lucide-react';
import { SDGBadge } from './SDGBadge';
import { StatusBadge, ApplicationStatus } from './StatusBadge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export type OpportunityCardProps = {
  id: string;
  title: string;
  orgName: string;
  orgLogoUrl?: string;
  location?: string;
  sdgs: { id: string; iconUrl?: string; label: string }[];
  summary: string;
  dateStarts?: string; // ISO
  timeCommitment?: string; // "4 hours", "Weekends"
  totalVolunteers?: number;
  appliedStatus?: ApplicationStatus;
  imageUrl?: string;
  onApply: (id: string) => void;
  onSave?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isSaved?: boolean;
  variant?: 'grid' | 'list';
};

export function OpportunityCard({
  id,
  title,
  orgName,
  orgLogoUrl,
  location,
  sdgs,
  summary,
  dateStarts,
  timeCommitment,
  totalVolunteers,
  appliedStatus = 'not_applied',
  imageUrl,
  onApply,
  onSave,
  onViewDetails,
  isSaved = false,
  variant = 'grid',
}: OpportunityCardProps) {
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply(id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(id);
  };

  const handleCardClick = () => {
    onViewDetails?.(id);
  };

  const showApplyButton = appliedStatus === 'not_applied' || appliedStatus === 'open';

  if (variant === 'list') {
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer group"
        onClick={handleCardClick}
        role="article"
        aria-label={`Opportunity: ${title} by ${orgName}`}
      >
        <div className="flex gap-4">
          {/* Image */}
          {imageUrl && (
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                  {title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  {orgLogoUrl && (
                    <img
                      src={orgLogoUrl}
                      alt=""
                      className="w-5 h-5 rounded object-cover"
                    />
                  )}
                  <span className="truncate">{orgName}</span>
                </div>
              </div>
              <StatusBadge status={appliedStatus} />
            </div>

            {/* SDGs */}
            {sdgs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {sdgs.slice(0, 3).map((sdg) => (
                  <SDGBadge key={sdg.id} {...sdg} size="sm" />
                ))}
                {sdgs.length > 3 && (
                  <span className="text-xs text-gray-600 px-2 py-1">
                    +{sdgs.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Summary */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{summary}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {location}
                </span>
              )}
              {dateStarts && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  {new Date(dateStarts).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {timeCommitment && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {timeCommitment}
                </span>
              )}
              {totalVolunteers && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {totalVolunteers} volunteers needed
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {showApplyButton ? (
                <button
                  onClick={handleApply}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  aria-label={`Apply for ${title}`}
                >
                  Apply
                </button>
              ) : (
                <button
                  onClick={handleCardClick}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label={`View application status for ${title}`}
                >
                  View Status
                </button>
              )}
              {onSave && (
                <button
                  onClick={handleSave}
                  className={`
                    p-2 rounded-lg transition-colors text-sm
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    ${
                      isSaved
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  aria-label={isSaved ? `Unsave ${title}` : `Save ${title}`}
                  aria-pressed={isSaved}
                >
                  <Heart
                    className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer group flex flex-col"
      onClick={handleCardClick}
      role="article"
      aria-label={`Opportunity: ${title} by ${orgName}`}
    >
      {/* Image */}
      {imageUrl ? (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
          {sdgs[0]?.iconUrl ? (
            <img
              src={sdgs[0].iconUrl}
              alt=""
              className="w-16 h-16 opacity-50"
            />
          ) : (
            <Users className="w-16 h-16 text-emerald-200" aria-hidden="true" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 flex-1">
            {title}
          </h3>
          {onSave && (
            <button
              onClick={handleSave}
              className={`
                flex-shrink-0 p-1.5 rounded transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                ${
                  isSaved
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }
              `}
              aria-label={isSaved ? `Unsave ${title}` : `Save ${title}`}
              aria-pressed={isSaved}
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          {orgLogoUrl && (
            <img
              src={orgLogoUrl}
              alt=""
              className="w-5 h-5 rounded object-cover"
            />
          )}
          <span className="truncate">{orgName}</span>
        </div>

        {location && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            {location}
          </div>
        )}

        {/* SDGs */}
        {sdgs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sdgs.slice(0, 3).map((sdg) => (
              <SDGBadge key={sdg.id} {...sdg} size="sm" />
            ))}
            {sdgs.length > 3 && (
              <span className="text-xs text-gray-600 px-2 py-1">
                +{sdgs.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Summary */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
          {summary}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
          {dateStarts && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {new Date(dateStarts).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
          {timeCommitment && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {timeCommitment}
            </span>
          )}
          {totalVolunteers && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" aria-hidden="true" />
              {totalVolunteers}
            </span>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {showApplyButton ? (
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label={`Apply for ${title}`}
            >
              Apply Now
            </button>
          ) : (
            <>
              <StatusBadge status={appliedStatus} className="flex-1 justify-center" />
              <button
                onClick={handleCardClick}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label={`View details for ${title}`}
              >
                View
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
