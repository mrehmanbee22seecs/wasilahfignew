import React from 'react';
import { ServerCrash, RefreshCw } from 'lucide-react';

interface ErrorPage500Props {
  message?: string;
}

export function ErrorPage500({ message = 'An unexpected server error occurred.' }: ErrorPage500Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ServerCrash className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Server Error
        </h1>

        {/* Message */}
        <p className="text-slate-600 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Go Home
          </button>
        </div>

        {/* Status message */}
        <div className="mt-12 bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
          <p className="font-semibold mb-1">What happened?</p>
          <p>Our servers encountered an unexpected condition. Our team has been notified and is working to resolve the issue.</p>
        </div>

        {/* Support */}
        <p className="mt-6 text-sm text-slate-500">
          If this persists, please{' '}
          <a href="mailto:support@wasilah.pk" className="text-blue-600 hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
