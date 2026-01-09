import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthShellProps {
  children: React.ReactNode;
  showBackToSite?: boolean;
  onBackToSite?: () => void;
}

export function AuthShell({ children, showBackToSite = true, onBackToSite }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Small Brand Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">W</span>
            </div>
            <span className="text-slate-900 text-xl">Wasilah</span>
          </div>

          {/* Back to Site */}
          {showBackToSite && (
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Back to main site"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to site</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer Note */}
      <footer className="mt-auto py-8 text-center text-slate-600 text-sm">
        <p>
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-teal-600 hover:text-teal-700 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
