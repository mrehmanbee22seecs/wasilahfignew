import React from 'react';
import { LogIn, UserPlus, X } from 'lucide-react';

export type AuthGateProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  message?: string;
  loginLabel?: string;
  signupLabel?: string;
};

/**
 * AuthGate component displays an overlay that prompts users to log in or sign up
 * before performing protected actions like applying for opportunities.
 * 
 * Usage:
 * 1. Show this component when a logged-out user tries to perform a protected action
 * 2. Pass returnTo URL with opportunity ID and action in query params
 * 3. After successful auth, the auth page redirects back with those params
 * 4. The parent page checks for those params and auto-opens the relevant modal
 * 
 * Example flow:
 * - User clicks "Apply" on opportunity-123 while logged out
 * - AuthGate opens with message
 * - User clicks "Log In"
 * - Redirects to: /auth?returnTo=/discover?opportunity=opportunity-123&action=apply
 * - After login, user returns to /discover?opportunity=opportunity-123&action=apply
 * - DiscoverOpportunitiesPage detects params and auto-opens ApplyModal
 */
export function AuthGate({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  title = 'Login Required',
  message = 'You need to be logged in to apply for volunteer opportunities. Create an account or log in to continue.',
  loginLabel = 'Log In',
  signupLabel = 'Sign Up',
}: AuthGateProps) {
  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 id="auth-gate-title" className="text-xl text-gray-900 mb-2">
              {title}
            </h2>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 -mt-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-6">
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            <span>{loginLabel}</span>
          </button>

          <button
            onClick={onSignup}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>{signupLabel}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
          >
            Cancel
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to Wasilah's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
