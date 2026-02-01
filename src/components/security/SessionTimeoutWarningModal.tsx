/**
 * Session Timeout Warning Modal
 * 
 * Displays a warning to the user before their session times out.
 * Allows them to extend their session or logout immediately.
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, LogOut, RefreshCw } from 'lucide-react';
import { useSessionTimeout } from '../../contexts/SessionTimeoutContext';

export function SessionTimeoutWarningModal() {
  const {
    showWarning,
    remainingTimeFormatted,
    extendSession,
    logoutNow,
  } = useSessionTimeout();

  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  // Update countdown
  useEffect(() => {
    if (!showWarning) {
      setCountdown(300);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  if (!showWarning) {
    return null;
  }

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Session Timeout Warning
              </h3>
              <p className="text-sm text-gray-600">
                Your session will expire soon
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Countdown */}
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          {/* Message */}
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              Due to inactivity, you will be automatically logged out in{' '}
              <span className="font-semibold">{remainingTimeFormatted}</span>.
            </p>
            <p>
              If you're still working, click "Stay Logged In" to extend your session.
            </p>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              This security feature protects your account from unauthorized access on unattended devices.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex gap-3">
          <button
            onClick={logoutNow}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout Now
          </button>
          <button
            onClick={extendSession}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionTimeoutWarningModal;
