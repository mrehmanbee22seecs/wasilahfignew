import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

export type ErrorStateProps = {
  title?: string;
  message?: string;
  type?: 'error' | 'offline' | 'not-found';
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

const ERROR_CONFIG = {
  error: {
    icon: AlertCircle,
    defaultTitle: 'Something went wrong',
    defaultMessage: 'We encountered an error loading this content. Please try again.',
    iconColor: 'text-red-500',
  },
  offline: {
    icon: WifiOff,
    defaultTitle: 'No internet connection',
    defaultMessage: 'Please check your connection and try again.',
    iconColor: 'text-gray-400',
  },
  'not-found': {
    icon: AlertCircle,
    defaultTitle: 'Not found',
    defaultMessage: "The content you're looking for doesn't exist or has been removed.",
    iconColor: 'text-gray-400',
  },
};

export function ErrorState({
  title,
  message,
  type = 'error',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: ErrorStateProps) {
  const config = ERROR_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 ${config.iconColor}`}
      >
        <Icon className="w-8 h-8" aria-hidden="true" />
      </div>

      <h3 className="text-lg text-gray-900 mb-2">
        {title || config.defaultTitle}
      </h3>

      <p className="text-sm text-gray-600 max-w-md mb-6">
        {message || config.defaultMessage}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>{retryLabel}</span>
        </button>
      )}
    </div>
  );
}
