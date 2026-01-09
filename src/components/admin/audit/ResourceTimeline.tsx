import React, { useState } from 'react';
import { Calendar, User, ChevronDown, ChevronUp, Eye } from 'lucide-react';

export type TimelineEvent = {
  id: string;
  timestamp: string;
  action: string;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  description: string;
  changes?: {
    field: string;
    before: any;
    after: any;
  }[];
  metadata?: Record<string, any>;
};

type ResourceTimelineProps = {
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  events: TimelineEvent[];
  onViewDetails?: (eventId: string) => void;
};

const actionColors: Record<string, string> = {
  created: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  updated: 'bg-blue-100 text-blue-700 border-blue-200',
  deleted: 'bg-red-100 text-red-700 border-red-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  suspended: 'bg-amber-100 text-amber-700 border-amber-200',
  archived: 'bg-gray-100 text-gray-700 border-gray-200',
  restored: 'bg-blue-100 text-blue-700 border-blue-200',
};

const getActionColor = (action: string): string => {
  const lowerAction = action.toLowerCase();
  for (const [key, color] of Object.entries(actionColors)) {
    if (lowerAction.includes(key)) return color;
  }
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

export function ResourceTimeline({
  resourceType,
  resourceId,
  resourceName,
  events,
  onViewDetails,
}: ResourceTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleExpand = (eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFullTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No timeline events</p>
        <p className="text-sm text-gray-500 mt-1">
          Events for this resource will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm text-gray-900">Resource Timeline</h3>
        {resourceName && (
          <p className="text-xs text-gray-600 mt-0.5">
            {resourceType}: {resourceName} ({resourceId})
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Events */}
          <div className="space-y-4">
            {events.map((event, idx) => {
              const isExpanded = expandedEvents.has(event.id);
              const hasDetails = event.changes && event.changes.length > 0;

              return (
                <div key={event.id} className="relative pl-12">
                  {/* Timeline Dot */}
                  <div className="absolute left-3 top-1 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />

                  {/* Event Card */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs border ${getActionColor(
                              event.action
                            )}`}
                          >
                            {event.action}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900">{event.description}</p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(event.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {hasDetails && (
                          <button
                            onClick={() => toggleExpand(event.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actor Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      <span>{event.actor.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{event.actor.role}</span>
                    </div>

                    {/* Full Timestamp */}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFullTimestamp(event.timestamp)}
                    </p>

                    {/* Expanded Details */}
                    {isExpanded && hasDetails && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs text-gray-600 mb-2">Changes:</p>
                        <div className="space-y-2">
                          {event.changes!.map((change, changeIdx) => (
                            <div
                              key={changeIdx}
                              className="bg-white border border-gray-200 rounded p-2"
                            >
                              <p className="text-xs text-gray-700 mb-1">
                                <strong>{change.field}</strong>
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500">Before</p>
                                  <code className="text-xs text-red-700 bg-red-50 px-1 py-0.5 rounded">
                                    {String(change.before)}
                                  </code>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">After</p>
                                  <code className="text-xs text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                                    {String(change.after)}
                                  </code>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Showing {events.length} event{events.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
