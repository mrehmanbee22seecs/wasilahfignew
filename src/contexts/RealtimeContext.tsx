import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { usePresence } from '../hooks/usePresence';

interface RealtimeContextType {
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  onlineUsers: string[];
  isUserOnline: (userId: string) => boolean;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isConnected: notificationsConnected,
  } = useRealtimeNotifications(user?.id || null);

  const {
    onlineUsers,
    isUserOnline,
  } = usePresence('global', user?.id || null, {
    role: user?.user_metadata?.role || 'guest',
  });

  useEffect(() => {
    setIsConnected(notificationsConnected);
  }, [notificationsConnected]);

  const value: RealtimeContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    onlineUsers,
    isUserOnline,
    isConnected,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
