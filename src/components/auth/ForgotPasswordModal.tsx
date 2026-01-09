import React, { useState } from 'react';
import { Mail, X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { resetPassword } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Real Supabase password reset
      const result = await resetPassword(email);
      
      if (!result.success) {
        setError(result.error || 'Failed to send reset email. Please try again.');
        return;
      }

      setIsSuccess(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2
              id="forgot-password-title"
              className="text-2xl font-semibold text-slate-900 mb-2"
            >
              {isSuccess ? 'Check your email' : 'Reset your password'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isSuccess
                ? 'We sent password reset instructions'
                : 'Enter your email to receive reset instructions'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-green-900 font-medium mb-1">Email sent!</h3>
                  <p className="text-green-700 text-sm">
                    We sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-green-600 text-xs mt-2">
                    Didn't receive it? Check your spam folder or try again.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Got it
            </button>
          </div>
        )}

        {/* Form State */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 text-sm font-medium">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-slate-900 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="your.email@company.com"
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-lg border transition-all
                    ${error
                      ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                      : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
                    }
                    placeholder-slate-400 focus:outline-none
                  `}
                  disabled={isLoading}
                  autoFocus
                  aria-invalid={!!error}
                  aria-describedby={error ? 'email-error' : undefined}
                />
              </div>
              {error && (
                <p id="email-error" className="text-red-600 text-sm mt-2">
                  {error}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <strong>What happens next:</strong>
              </p>
              <ul className="text-blue-700 text-sm mt-2 space-y-1 ml-4 list-disc">
                <li>We'll send a secure reset link to your email</li>
                <li>The link expires in 1 hour</li>
                <li>Click the link to create a new password</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </div>

            {/* Help Text */}
            <p className="text-slate-500 text-xs text-center">
              Remember your password?{' '}
              <button
                type="button"
                onClick={handleClose}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Back to login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}