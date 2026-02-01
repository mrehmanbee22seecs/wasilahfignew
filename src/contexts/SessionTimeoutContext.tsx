/**
 * Session Timeout Context
 * 
 * Provides session timeout functionality throughout the application.
 * Monitors user activity and triggers auto-logout after inactivity.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  SessionTimeoutManager,
  SessionTimeoutState,
  getSessionTimeoutManager,
  formatRemainingTime,
} from '../lib/security/sessionTimeout';
import { logger } from '../lib/security/secureLogger';
import { isRememberMeEnabled } from '../services/sessionPersistenceService';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface SessionTimeoutContextType {
  /** Current timeout state */
  state: SessionTimeoutState;
  /** Whether warning modal should be shown */
  showWarning: boolean;
  /** Remaining time formatted as string */
  remainingTimeFormatted: string;
  /** Extend the current session */
  extendSession: () => void;
  /** Manually trigger logout */
  logoutNow: () => void;
  /** Dismiss warning (not recommended) */
  dismissWarning: () => void;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextType | undefined>(undefined);

// =====================================================
// PROVIDER COMPONENT
// =====================================================

interface SessionTimeoutProviderProps {
  children: ReactNode;
  /** Whether to enable timeout (default: true) */
  enabled?: boolean;
  /** Custom timeout duration in minutes */
  timeoutMinutes?: number;
  /** Custom warning duration in minutes */
  warningMinutes?: number;
}

export function SessionTimeoutProvider({
  children,
  enabled = true,
  timeoutMinutes,
  warningMinutes,
}: SessionTimeoutProviderProps) {
  const { user, signOut } = useAuth();
  
  const [manager] = useState<SessionTimeoutManager>(() => getSessionTimeoutManager());
  const [state, setState] = useState<SessionTimeoutState>(manager.getState());
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Handle timeout - auto logout
  const handleTimeout = useCallback(async () => {
    logger.warn('Session timeout - logging out user');
    setShowWarning(false);
    
    try {
      await signOut();
      // Redirect to auth page after logout
      window.location.href = '/auth?timeout=true';
    } catch (error) {
      logger.error('Error during timeout logout', { error });
    }
  }, [signOut]);

  // Handle warning - show warning modal
  const handleWarning = useCallback(() => {
    logger.info('Showing session timeout warning');
    setShowWarning(true);
  }, []);

  // Handle activity - user is active
  const handleActivity = useCallback(() => {
    // Silently track activity
  }, []);

  // Extend session
  const extendSession = useCallback(() => {
    logger.info('User extended session');
    manager.extendSession();
    setShowWarning(false);
    setState(manager.getState());
  }, [manager]);

  // Logout immediately
  const logoutNow = useCallback(async () => {
    logger.info('User chose to logout immediately');
    setShowWarning(false);
    await signOut();
    window.location.href = '/auth';
  }, [signOut]);

  // Dismiss warning (not recommended, but allows user choice)
  const dismissWarning = useCallback(() => {
    logger.warn('User dismissed session timeout warning');
    setShowWarning(false);
  }, []);

  // Update configuration on mount
  useEffect(() => {
    if (timeoutMinutes || warningMinutes) {
      manager.updateConfig({
        enabled,
        ...(timeoutMinutes && { timeoutDuration: timeoutMinutes * 60 * 1000 }),
        ...(warningMinutes && { warningDuration: warningMinutes * 60 * 1000 }),
      });
    }
  }, [manager, enabled, timeoutMinutes, warningMinutes]);

  // Start/stop timeout monitoring based on user session
  useEffect(() => {
    if (user && enabled) {
      // Check if "Remember Me" is enabled and respect it
      const rememberMeEnabled = isRememberMeEnabled();
      
      if (rememberMeEnabled && manager.getState().isActive) {
        // Don't timeout if "Remember Me" is enabled (optional behavior)
        // You can remove this check if you want timeout even with "Remember Me"
        logger.info('Session timeout respecting Remember Me setting');
      }

      // Start timeout manager
      manager.start({
        onTimeout: handleTimeout,
        onWarning: handleWarning,
        onActivity: handleActivity,
      });

      return () => {
        manager.stop();
      };
    }
  }, [user, enabled, manager, handleTimeout, handleWarning, handleActivity]);

  // Update state periodically
  useEffect(() => {
    if (!user || !enabled) return;

    const interval = setInterval(() => {
      const currentState = manager.getState();
      setState(currentState);
      setRemainingTime(currentState.remainingTime);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [user, enabled, manager]);

  // Context value
  const value: SessionTimeoutContextType = {
    state,
    showWarning,
    remainingTimeFormatted: formatRemainingTime(remainingTime),
    extendSession,
    logoutNow,
    dismissWarning,
  };

  return (
    <SessionTimeoutContext.Provider value={value}>
      {children}
    </SessionTimeoutContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

/**
 * Hook to access session timeout functionality
 */
export function useSessionTimeout(): SessionTimeoutContextType {
  const context = useContext(SessionTimeoutContext);
  
  if (context === undefined) {
    throw new Error('useSessionTimeout must be used within a SessionTimeoutProvider');
  }
  
  return context;
}
