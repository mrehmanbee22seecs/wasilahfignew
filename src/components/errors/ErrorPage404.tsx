import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

interface ErrorPage404Props {
  message?: string;
}

export function ErrorPage404({ message = "The page you're looking for doesn't exist." }: ErrorPage404Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <div className="h-1 w-32 bg-blue-600 mx-auto mt-4"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>

        {/* Search suggestion */}
        <div className="mt-12 text-sm text-slate-500">
          Looking for something? Try using the{' '}
          <button className="text-blue-600 hover:underline inline-flex items-center gap-1">
            <Search className="w-4 h-4" />
            search
          </button>
        </div>
      </div>
    </div>
  );
}
