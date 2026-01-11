import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { AppError } from '../../lib/errors/types';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorInfo?: React.ErrorInfo | null;
}

export function ErrorFallback({ error, resetError, errorInfo }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const isAppError = (err: Error): err is AppError => {
    return 'category' in err && 'userMessage' in err;
  };

  const appError = isAppError(error) ? error : null;
  const userMessage = appError?.userMessage || 'Something unexpected happened';
  const canRetry = appError?.recoverable ?? true;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">
          Oops! Something went wrong
        </h1>

        {/* User message */}
        <p className="text-lg text-slate-600 text-center mb-8">
          {userMessage}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          {canRetry && (
            <button
              onClick={resetError}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Error details toggle */}
        {import.meta.env.DEV && (
          <div className="border-t pt-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
            >
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <div className="space-y-4">
                {/* Error name and message */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Error</h3>
                  <div className="bg-slate-50 rounded p-3 text-sm">
                    <p className="font-mono text-red-600">{error.name}</p>
                    <p className="text-slate-700 mt-1">{error.message}</p>
                  </div>
                </div>

                {/* Error category and severity */}
                {appError && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Details</h3>
                    <div className="bg-slate-50 rounded p-3 text-sm space-y-1">
                      <p><span className="font-semibold">Category:</span> {appError.category}</p>
                      <p><span className="font-semibold">Severity:</span> {appError.severity}</p>
                      {appError.code && <p><span className="font-semibold">Code:</span> {appError.code}</p>}
                    </div>
                  </div>
                )}

                {/* Stack trace */}
                {error.stack && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Stack Trace</h3>
                    <div className="bg-slate-50 rounded p-3 text-xs font-mono overflow-x-auto">
                      <pre className="text-slate-700 whitespace-pre-wrap">{error.stack}</pre>
                    </div>
                  </div>
                )}

                {/* Component stack */}
                {errorInfo?.componentStack && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Component Stack</h3>
                    <div className="bg-slate-50 rounded p-3 text-xs font-mono overflow-x-auto">
                      <pre className="text-slate-700 whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Support message */}
        <div className="mt-6 text-center text-sm text-slate-500">
          If this problem persists, please contact{' '}
          <a href="mailto:support@wasilah.pk" className="text-blue-600 hover:underline">
            support@wasilah.pk
          </a>
        </div>
      </div>
    </div>
  );
}
