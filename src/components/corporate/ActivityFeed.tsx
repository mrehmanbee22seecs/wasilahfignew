import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  Loader2
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'media_upload' | 'payment' | 'volunteer_join' | 'project_update' | 'milestone' | 'alert';
  user: string;
  message: string;
  projectId?: string;
  projectName?: string;
  timestamp: string;
  read?: boolean;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onNavigateToProject: (projectId: string) => void;
  onMarkAsRead?: (activityId: string) => void;
  onMarkActivityAsRead?: (activityId: string) => void;
  onLoadMore?: () => Promise<ActivityItem[]>;
  hasMore?: boolean;
}

export function ActivityFeed({ 
  activities, 
  onNavigateToProject, 
  onMarkAsRead, 
  onMarkActivityAsRead,
  onLoadMore,
  hasMore = false
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'projects' | 'volunteers' | 'finance'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allActivities, setAllActivities] = useState<ActivityItem[]>(activities);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Update activities when prop changes
  useEffect(() => {
    setAllActivities(activities);
  }, [activities]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!onLoadMore || !hasMore || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
          setIsLoadingMore(true);
          try {
            const newActivities = await onLoadMore();
            setAllActivities(prev => [...prev, ...newActivities]);
          } catch (error) {
            console.error('Error loading more activities:', error);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore]);

  // Support both prop names for backwards compatibility
  const handleMarkAsRead = onMarkActivityAsRead || onMarkAsRead;

  const iconMap = {
    media_upload: <Image className="w-5 h-5 text-blue-600" />,
    payment: <DollarSign className="w-5 h-5 text-green-600" />,
    volunteer_join: <Users className="w-5 h-5 text-violet-600" />,
    project_update: <FileText className="w-5 h-5 text-teal-600" />,
    milestone: <CheckCircle className="w-5 h-5 text-green-600" />,
    alert: <AlertTriangle className="w-5 h-5 text-amber-600" />
  };

  const filterActivities = (activities: ActivityItem[]) => {
    if (filter === 'all') return activities;
    if (filter === 'projects') return activities.filter(a => ['project_update', 'milestone', 'media_upload'].includes(a.type));
    if (filter === 'volunteers') return activities.filter(a => a.type === 'volunteer_join');
    if (filter === 'finance') return activities.filter(a => a.type === 'payment');
    return activities;
  };

  const filteredActivities = filterActivities(allActivities);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">Recent Activity</h3>
        
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-2 px-3 py-2 border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-sm"
            aria-label="Filter activities"
            aria-expanded={showFilterMenu}
          >
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-slate-700 capitalize">{filter}</span>
          </button>

          {/* Filter Menu */}
          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-lg py-2 min-w-[150px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {['all', 'projects', 'volunteers', 'finance'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => {
                    setFilter(filterOption as typeof filter);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filter === filterOption
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto" ref={scrollContainerRef}>
        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No activities to show</p>
          </div>
        )}

        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className={`flex gap-4 p-4 rounded-lg border-2 transition-all ${
              activity.read
                ? 'border-slate-100 bg-slate-50'
                : 'border-teal-100 bg-teal-50 hover:bg-teal-100'
            }`}
            onClick={() => handleMarkAsRead?.(activity.id)}
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              {iconMap[activity.type]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-sm mb-1">
                <span className="font-medium">{activity.user}</span>
                {' '}{activity.message}
              </p>
              
              {activity.projectName && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activity.projectId) onNavigateToProject(activity.projectId);
                  }}
                  className="text-teal-600 hover:text-teal-700 text-sm transition-colors"
                >
                  Project: {activity.projectName}
                </button>
              )}

              <div className="text-xs text-slate-500 mt-1">
                {formatTimestamp(activity.timestamp)}
              </div>
            </div>

            {/* Unread indicator */}
            {!activity.read && (
              <div className="flex-shrink-0 w-2 h-2 bg-teal-600 rounded-full mt-2" />
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredActivities.length > 0 && (
        <div className="w-full mt-4 py-2 text-teal-600 hover:text-teal-700 text-sm transition-colors" ref={loadMoreRef}>
          {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more activities'}
        </div>
      )}
    </div>
  );
}