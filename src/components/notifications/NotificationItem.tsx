import React, { useState } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  DollarSign,
  FileCheck,
  FolderOpen,
  Users,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';
import { Notification, NotificationType } from './types';

type NotificationItemProps = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
  onActionClick?: (notificationId: string, actionLabel: string) => void;
};

const typeConfig: Record<
  NotificationType,
  {
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    iconColor: string;
  }
> = {
  info: {
    icon: <Info className="w-4 h-4" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
  },
  action_required: {
    icon: <Bell className="w-4 h-4" />,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
  },
  payment: {
    icon: <DollarSign className="w-4 h-4" />,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  vetting: {
    icon: <FileCheck className="w-4 h-4" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  project: {
    icon: <FolderOpen className="w-4 h-4" />,
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  volunteer: {
    icon: <Users className="w-4 h-4" />,
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconColor: 'text-teal-600',
  },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-blue-600' },
  high: { label: 'High', color: 'text-amber-600' },
  urgent: { label: 'Urgent', color: 'text-red-600' },
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  onActionClick,
}: NotificationItemProps) {
  const [showActions, setShowActions] = useState(false);
  const config = typeConfig[notification.type];
  const priorityInfo = priorityConfig[notification.priority];

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return time.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`relative border-l-4 ${config.borderColor} ${
        notification.isRead ? 'bg-white' : 'bg-blue-50/30'
      } rounded-r-lg p-4 hover:shadow-md transition-all group`}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center ${config.iconColor}`}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm text-gray-900">{notification.title}</h4>
                {notification.priority !== 'low' && (
                  <span
                    className={`text-xs ${priorityInfo.color} px-1.5 py-0.5 bg-white border rounded`}
                  >
                    {priorityInfo.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        if (notification.isRead) {
                          onMarkAsUnread(notification.id);
                        } else {
                          onMarkAsRead(notification.id);
                        }
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      {notification.isRead ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Mark as unread
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Mark as read
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onDelete(notification.id);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
            <span>{getTimeAgo(notification.timestamp)}</span>
            {notification.actor && (
              <>
                <span>•</span>
                <span>By {notification.actor.name}</span>
              </>
            )}
            {notification.relatedResource && (
              <>
                <span>•</span>
                <span>
                  {notification.relatedResource.type}:{' '}
                  {notification.relatedResource.name}
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (action.onClick) {
                      action.onClick();
                    }
                    if (onActionClick) {
                      onActionClick(notification.id, action.label);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                    action.variant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : action.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                  {action.href && <ExternalLink className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
