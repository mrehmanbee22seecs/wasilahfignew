import React, { useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorRetryProps {
  error: Error;
  onRetry: () => void | Promise<void>;
  retryText?: string;
  className?: string;
}

export function ErrorRetry({
  error,
  onRetry,
  retryText = 'Try Again',
  className = '',
}: ErrorRetryProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`bg-slate-50 rounded-lg border border-slate-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-slate-400" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Failed to load
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {error.message}
          </p>
          
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : retryText}
          </button>
        </div>
      </div>
    </div>
  );
}
