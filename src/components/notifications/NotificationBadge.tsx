import React from 'react';
import { Bell } from 'lucide-react';

type NotificationBadgeProps = {
  count: number;
  onClick: () => void;
  showPulse?: boolean;
};

export function NotificationBadge({ count, onClick, showPulse = true }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`${count} unread notifications`}
    >
      <Bell className="w-5 h-5" />
      
      {count > 0 && (
        <>
          {/* Badge */}
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-600 text-white text-xs rounded-full flex items-center justify-center px-1">
            {count > 99 ? '99+' : count}
          </span>
          
          {/* Pulse Animation */}
          {showPulse && (
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-600 rounded-full animate-ping opacity-75" />
          )}
        </>
      )}
    </button>
  );
}
