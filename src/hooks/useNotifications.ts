import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../components/notifications/types';
import { toast } from 'sonner';

/**
 * Custom hook for managing notifications
 * Provides state and actions for the notification system
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications (mock - replace with actual API)
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockNotifications: Notification[] = [
        {
          id: 'notif-001',
          type: 'action_required',
          priority: 'urgent',
          title: 'Payment Hold Requires Approval',
          message: 'Payment HOLD-003 for PKR 850,000 requires your approval.',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          isRead: false,
          isArchived: false,
          actor: {
            id: 'system',
            name: 'System',
          },
          relatedResource: {
            type: 'payment',
            id: 'HOLD-003',
            name: 'Green Initiative - Phase 3',
          },
          actions: [
            { label: 'Review', variant: 'primary' },
            { label: 'Approve', variant: 'primary' },
          ],
        },
        {
          id: 'notif-002',
          type: 'vetting',
          priority: 'high',
          title: 'New NGO Vetting Request',
          message: 'Climate Action Pakistan has submitted documents for vetting.',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          isRead: false,
          isArchived: false,
          actor: {
            id: 'ngo-005',
            name: 'Climate Action Pakistan',
          },
          relatedResource: {
            type: 'vetting',
            id: 'vet-008',
            name: 'Climate Action Pakistan',
          },
          actions: [{ label: 'Start Review', variant: 'primary' }],
        },
        {
          id: 'notif-003',
          type: 'success',
          priority: 'medium',
          title: 'Project Milestone Completed',
          message: 'Solar Installation Phase 2 has been marked as completed.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          isRead: false,
          isArchived: false,
          actor: {
            id: 'ngo-002',
            name: 'Green Pakistan Initiative',
          },
          relatedResource: {
            type: 'project',
            id: 'proj-102',
            name: 'Rural Solar Electrification',
          },
        },
        {
          id: 'notif-004',
          type: 'warning',
          priority: 'high',
          title: 'Case Escalated',
          message: 'CASE-005 has been escalated and requires senior review.',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          isRead: true,
          isArchived: false,
          actor: {
            id: 'admin-002',
            name: 'Sarah Ahmed',
          },
          relatedResource: {
            type: 'case',
            id: 'CASE-005',
            name: 'Funding Dispute - Education First',
          },
          actions: [{ label: 'Review Case', variant: 'primary' }],
        },
        {
          id: 'notif-005',
          type: 'volunteer',
          priority: 'medium',
          title: '25 New Volunteer Applications',
          message: 'You have new volunteer applications awaiting review.',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          isRead: true,
          isArchived: false,
          relatedResource: {
            type: 'volunteer',
            id: 'batch-001',
            name: 'January 2026 Applications',
          },
          actions: [{ label: 'Review Applications', variant: 'secondary' }],
        },
        {
          id: 'notif-006',
          type: 'payment',
          priority: 'medium',
          title: 'Disbursement Successful',
          message: 'PKR 450,000 has been successfully disbursed to Green Pakistan Initiative.',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          isRead: true,
          isArchived: false,
          actor: {
            id: 'admin-001',
            name: 'Ahmed Khan',
          },
          relatedResource: {
            type: 'payment',
            id: 'PAY-1245',
            name: 'Green Pakistan Initiative - Q1 2026',
          },
        },
        {
          id: 'notif-007',
          type: 'info',
          priority: 'low',
          title: 'System Maintenance Scheduled',
          message: 'Platform maintenance scheduled for Sunday, Jan 5, 2026 at 2:00 AM.',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          isRead: true,
          isArchived: false,
          actor: {
            id: 'system',
            name: 'System',
          },
        },
        {
          id: 'notif-008',
          type: 'project',
          priority: 'medium',
          title: 'Impact Report Submitted',
          message: 'Water Well Project has submitted their Q4 2025 impact report.',
          timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          isRead: true,
          isArchived: false,
          actor: {
            id: 'ngo-003',
            name: 'Clean Water Alliance',
          },
          relatedResource: {
            type: 'project',
            id: 'proj-087',
            name: 'Rural Water Well Installation',
          },
          actions: [{ label: 'View Report', variant: 'secondary' }],
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Simulate real-time updates (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // In production, this would poll the API or use WebSockets
      // For now, just log
      console.log('Checking for new notifications...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  }, []);

  // Mark as unread
  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: false } : notif))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    toast.success('All notifications marked as read');
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success('Notification deleted');
  }, []);

  // Delete all notifications
  const deleteAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
}
