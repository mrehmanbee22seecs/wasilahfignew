import React, { useState, useEffect } from 'react';
import { Mail, X, AlertCircle, Clock, RefreshCw, CheckCircle } from 'lucide-react';
import { getReminderStatus, showReminderNotification } from '../../services/emailReminderService';
import { resendOTP } from '../../services/authService';
import { maskEmailForVerification } from '../../utils/emailMasking';

interface EmailVerificationBannerProps {
  userId: string;
  email: string;
  onVerified?: () => void;
}

export function EmailVerificationBanner({ userId, email, onVerified }: EmailVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [reminderStatus, setReminderStatus] = useState<any>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    // Load reminder status
    getReminderStatus(userId).then(status => {
      setReminderStatus(status);
    });

    // Check if user dismissed banner in this session
    const dismissed = sessionStorage.getItem(`email_banner_dismissed_${userId}`);
    if (dismissed) {
      setIsDismissed(true);
    }
  }, [userId]);

  useEffect(() => {
    // Countdown timer for resend
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
      setCountdown(30);
    }
  }, [canResend, countdown]);

  if (isDismissed) return null;

  const notification = reminderStatus ? showReminderNotification(reminderStatus) : null;
  if (!notification) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem(`email_banner_dismissed_${userId}`, 'true');
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      const result = await resendOTP(email, 'signup');
      
      if (result.success) {
        setResendSuccess(true);
        setCanResend(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        alert(result.error || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const severityStyles = {
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      text: 'text-red-900',
      button: 'bg-red-600 hover:bg-red-700',
    },
  };

  const styles = severityStyles[notification.severity];

  return (
    <div className={`${styles.bg} border rounded-xl p-4 shadow-sm animate-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${styles.bg} flex items-center justify-center`}>
          {notification.severity === 'error' ? (
            <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
          ) : (
            <Mail className={`w-6 h-6 ${styles.icon}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-sm font-semibold ${styles.text}`}>
              Email Verification Required
            </h3>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-black/5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <p className={`text-sm ${styles.text} mb-3`}>
            {notification.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            {/* Email Display */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4" />
              <span className="font-medium">{maskEmailForVerification(email)}</span>
            </div>

            {/* Reminder Count */}
            {reminderStatus && reminderStatus.remindersSent > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{reminderStatus.remindersSent} reminder(s) sent</span>
              </div>
            )}
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg animate-in slide-in-from-top-2 duration-200">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Verification email sent! Check your inbox.</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className={`px-4 py-2 ${styles.button} text-white text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : !canResend ? (
                <>
                  <Clock className="w-4 h-4" />
                  Resend in {countdown}s
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Email
                </>
              )}
            </button>

            {onVerified && (
              <button
                onClick={onVerified}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg hover:bg-slate-50 transition-colors"
              >
                Enter Code
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className={`mt-4 pt-4 border-t ${styles.bg.replace('50', '100')} flex items-start gap-2`}>
        <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p>
            <strong>Why verify?</strong> Verification unlocks all features and ensures account security.
          </p>
          <p>
            Didn't receive it? Check your spam folder or add noreply@wasilah.pk to your contacts.
          </p>
        </div>
      </div>
    </div>
  );
}
