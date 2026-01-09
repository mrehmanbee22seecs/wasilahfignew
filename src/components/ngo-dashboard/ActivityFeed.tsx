import React from 'react';
import { FileText, CheckCircle, MessageSquare, TrendingUp, User, AlertCircle, Calendar, Upload } from 'lucide-react';
import type { ActivityFeedItem } from '../../types/ngo';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  limit?: number;
}

export function ActivityFeed({ activities, limit }: ActivityFeedProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const getActivityIcon = (type: ActivityFeedItem['type']) => {
    switch (type) {
      case 'document_uploaded':
        return { icon: Upload, color: 'bg-blue-100 text-blue-600' };
      case 'verification_requested':
        return { icon: CheckCircle, color: 'bg-indigo-100 text-indigo-600' };
      case 'vetting_status_change':
        return { icon: AlertCircle, color: 'bg-emerald-100 text-emerald-600' };
      case 'message_received':
        return { icon: MessageSquare, color: 'bg-purple-100 text-purple-600' };
      case 'project_update':
        return { icon: TrendingUp, color: 'bg-amber-100 text-amber-600' };
      case 'profile_updated':
        return { icon: User, color: 'bg-slate-100 text-slate-600' };
      default:
        return { icon: Calendar, color: 'bg-slate-100 text-slate-600' };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="space-y-3">
      {displayActivities.map((activity, index) => {
        const { icon: Icon, color } = getActivityIcon(activity.type);
        const isLast = index === displayActivities.length - 1;

        return (
          <div
            key={activity.id}
            className="relative pl-12 pb-6 last:pb-0"
          >
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200" />
            )}

            {/* Icon */}
            <div className={`
              absolute left-0 top-0 w-8 h-8 rounded-full ${color}
              flex items-center justify-center
            `}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Content */}
            <div className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-indigo-200 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h4 className="text-sm text-slate-900 font-medium">
                  {activity.title}
                </h4>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-2">
                {activity.description}
              </p>

              {activity.user_name && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <User className="w-3 h-3" />
                  <span>{activity.user_name}</span>
                </div>
              )}

              {/* Metadata badges */}
              {activity.metadata && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {activity.metadata.old_status && activity.metadata.new_status && (
                    <div className="text-xs bg-slate-100 px-2 py-1 rounded">
                      <span className="text-slate-500">{activity.metadata.old_status}</span>
                      <span className="mx-1">→</span>
                      <span className="text-emerald-600 font-medium">{activity.metadata.new_status}</span>
                    </div>
                  )}
                  {activity.metadata.document_type && (
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {activity.metadata.document_type.replace('_', ' ')}
                    </div>
                  )}
                  {activity.metadata.documents_count && (
                    <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {activity.metadata.documents_count} documents
                    </div>
                  )}
                  {activity.metadata.progress && (
                    <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      {activity.metadata.progress}% complete
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {displayActivities.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600">No activity yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Your activity history will appear here
          </p>
        </div>
      )}
    </div>
  );
}
