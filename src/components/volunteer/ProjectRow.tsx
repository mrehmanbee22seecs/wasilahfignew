import React from 'react';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import { SDGBadge } from './SDGBadge';

export type ProjectRowProps = {
  id: string;
  title: string;
  organizationName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  sdgs?: { id: string; iconUrl?: string; label: string }[];
  hoursContributed?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  imageUrl?: string;
  onView?: (id: string) => void;
};

export function ProjectRow({
  id,
  title,
  organizationName,
  location,
  startDate,
  endDate,
  progress,
  sdgs = [],
  hoursContributed,
  tasksCompleted,
  totalTasks,
  imageUrl,
  onView,
}: ProjectRowProps) {
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Ongoing';

  const handleClick = () => {
    onView?.(id);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer group"
      onClick={handleClick}
      role="article"
      aria-label={`Project: ${title} at ${organizationName}, ${progress}% complete`}
    >
      <div className="flex gap-4">
        {/* Image */}
        {imageUrl && (
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Organization */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 truncate">{organizationName}</p>
            </div>
            <button
              onClick={handleClick}
              className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              aria-label={`View details for ${title}`}
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {formattedStartDate} - {formattedEndDate}
            </span>
            {hoursContributed !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                {hoursContributed} hours
              </span>
            )}
            {tasksCompleted !== undefined && totalTasks !== undefined && (
              <span className="text-gray-700">
                {tasksCompleted}/{totalTasks} tasks completed
              </span>
            )}
          </div>

          {/* SDGs */}
          {sdgs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
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

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-900">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Project progress: ${progress}%`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
