/**
 * Notification Type Definitions
 * Shared types for the notification system
 */

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'action_required'
  | 'payment'
  | 'vetting'
  | 'project'
  | 'volunteer';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary' | 'danger';
};

export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  relatedResource?: {
    type: string;
    id: string;
    name: string;
  };
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
};

export type NotificationFilter = {
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
};

export type NotificationStats = {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
};
