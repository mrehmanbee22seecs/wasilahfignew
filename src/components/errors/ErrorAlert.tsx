import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { AppError, ErrorSeverity } from '../../lib/errors/types';

interface ErrorAlertProps {
  error: Error | AppError | string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ error, onDismiss, className = '' }: ErrorAlertProps) {
  const isAppError = (err: any): err is AppError => {
    return err && typeof err === 'object' && 'category' in err && 'userMessage' in err;
  };

  const errorMessage = typeof error === 'string' 
    ? error 
    : isAppError(error) 
      ? error.userMessage 
      : error.message;

  const severity: ErrorSeverity = isAppError(error) ? error.severity : 'medium';

  const styles = {
    low: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-600',
      Icon: Info,
    },
    medium: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-600',
      Icon: AlertTriangle,
    },
    high: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-600',
      Icon: AlertCircle,
    },
    critical: {
      container: 'bg-red-100 border-red-300 text-red-900',
      icon: 'text-red-700',
      Icon: XCircle,
    },
  };

  const style = styles[severity];
  const IconComponent = style.Icon;

  return (
    <div className={`border rounded-lg p-4 ${style.container} ${className}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
        
        <div className="flex-1">
          <p className="text-sm font-medium">{errorMessage}</p>
          
          {isAppError(error) && error.code && (
            <p className="text-xs mt-1 opacity-75">Error Code: {error.code}</p>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 hover:opacity-75 transition-opacity"
            aria-label="Dismiss"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
