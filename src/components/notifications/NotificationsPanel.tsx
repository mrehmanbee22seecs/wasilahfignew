import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  ChevronDown,
  Loader,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Notification, NotificationType, NotificationPriority, NotificationFilter } from './types';
import { toast } from 'sonner';

type NotificationsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
  onRefresh?: () => void;
};

export function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onDelete,
  onDeleteAll,
  onRefresh,
}: NotificationsPanelProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter.type && notif.type !== filter.type) return false;
    if (filter.priority && notif.priority !== filter.priority) return false;
    if (filter.isRead !== undefined && notif.isRead !== filter.isRead) return false;
    if (filter.dateFrom && new Date(notif.timestamp) < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && new Date(notif.timestamp) > new Date(filter.dateTo)) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasFilters = Object.keys(filter).length > 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleClearFilters = () => {
    setFilter({});
    toast.success('Filters cleared');
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                showFilters || hasFilters
                  ? 'bg-blue-50 text-blue-700 border border-blue-300'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex-1 px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Read All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Type Filter */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Type</label>
                <select
                  value={filter.type || ''}
                  onChange={(e) =>
                    setFilter({ ...filter, type: e.target.value as NotificationType || undefined })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="action_required">Action Required</option>
                  <option value="payment">Payment</option>
                  <option value="vetting">Vetting</option>
                  <option value="project">Project</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="info">Info</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Priority</label>
                <select
                  value={filter.priority || ''}
                  onChange={(e) =>
                    setFilter({ ...filter, priority: e.target.value as NotificationPriority || undefined })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Read Status */}
              <div>
                <label className="text-xs text-gray-600 block mb-1">Status</label>
                <select
                  value={filter.isRead === undefined ? '' : filter.isRead ? 'read' : 'unread'}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      isRead: e.target.value === '' ? undefined : e.target.value === 'read',
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="w-full px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Stats */}
        {filteredNotifications.length > 0 && (
          <div className="flex-shrink-0 px-6 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {hasFilters && ' (filtered)'}
            </p>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <Inbox className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-gray-900 mb-1">
                {notifications.length === 0 ? 'No notifications' : 'No matching notifications'}
              </h3>
              <p className="text-sm text-gray-500 text-center">
                {notifications.length === 0
                  ? "You're all caught up! New notifications will appear here."
                  : 'Try adjusting your filters to see more notifications.'}
              </p>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onMarkAsUnread={onMarkAsUnread}
                  onDelete={onDelete}
                  onActionClick={(id, label) => {
                    toast.success(`Action "${label}" triggered for notification ${id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all notifications?')) {
                  onDeleteAll();
                  toast.success('All notifications deleted');
                }
              }}
              className="w-full px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}
