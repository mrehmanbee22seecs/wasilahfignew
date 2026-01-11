import React from 'react';

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function OnlineIndicator({
  isOnline,
  size = 'sm',
  showLabel = false,
  className = '',
}: OnlineIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        />
        {isOnline && (
          <div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-emerald-500 animate-ping opacity-75`}
          />
        )}
      </div>
      {showLabel && (
        <span className={`text-xs ${isOnline ? 'text-emerald-600' : 'text-slate-500'}`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
      )}
    </div>
  );
}
