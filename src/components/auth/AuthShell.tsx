import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { BRAND } from '../../constants/brand';

interface AuthShellProps {
  children: React.ReactNode;
  showBackToSite?: boolean;
  onBackToSite?: () => void;
}

export function AuthShell({ children, showBackToSite = true, onBackToSite }: AuthShellProps) {
  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${BRAND.creamLight} 0%, white 50%, ${BRAND.cream} 100%)` }}>
      {/* Small Brand Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50" style={{ borderColor: `${BRAND.navy}15` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)` }}
            >
              <span className="text-white text-xl">W</span>
            </div>
            <span className="text-xl" style={{ color: BRAND.navy }}>Wasilah</span>
          </div>

          {/* Back to Site */}
          {showBackToSite && (
            <button
              onClick={onBackToSite}
              className="flex items-center gap-2 transition-colors"
              style={{ color: BRAND.gray600 }}
              onMouseEnter={(e) => e.currentTarget.style.color = BRAND.navy}
              onMouseLeave={(e) => e.currentTarget.style.color = BRAND.gray600}
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
      <footer className="mt-auto py-8 text-center text-sm" style={{ color: BRAND.gray600 }}>
        <p>
          By continuing, you agree to our{' '}
          <a 
            href="/terms" 
            className="underline"
            style={{ color: BRAND.teal }}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="/privacy" 
            className="underline"
            style={{ color: BRAND.teal }}
          >
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
