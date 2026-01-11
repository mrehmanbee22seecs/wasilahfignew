import React from 'react';
import { ShieldX } from 'lucide-react';

interface ErrorPage403Props {
  message?: string;
  requiredPermission?: string;
}

export function ErrorPage403({
  message = "You don't have permission to access this page.",
  requiredPermission,
}: ErrorPage403Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <ShieldX className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-slate-600 mb-2">
          {message}
        </p>

        {requiredPermission && (
          <p className="text-sm text-slate-500 mb-8">
            Required permission: <code className="bg-slate-100 px-2 py-1 rounded">{requiredPermission}</code>
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {/* Contact support */}
        <p className="mt-8 text-sm text-slate-500">
          Need access?{' '}
          <a href="mailto:support@wasilah.pk" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
