/**
 * Session Persistence Service
 * 
 * Implements "Remember Me" functionality with secure token management
 * Uses Supabase's built-in session management with custom persistence logic
 */

import { supabase } from './authService';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface RememberMeConfig {
  persistDuration: number;  // In days (default: 30)
  refreshBeforeExpiry: number;  // In days (default: 7)
  secureOnly: boolean;  // Only use HTTPS (default: true in production)
}

export interface SessionInfo {
  userId: string;
  email: string;
  expiresAt: Date;
  rememberMe: boolean;
  lastRefresh: Date;
}

// =====================================================
// CONSTANTS
// =====================================================

const REMEMBER_ME_KEY = 'wasilah_remember_me';
const SESSION_INFO_KEY = 'wasilah_session_info';

const DEFAULT_CONFIG: RememberMeConfig = {
  persistDuration: 30,  // 30 days
  refreshBeforeExpiry: 7,  // Refresh 7 days before expiry
  secureOnly: typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.PROD || false
    : false,
};

// =====================================================
// SESSION PERSISTENCE
// =====================================================

/**
 * Enable "Remember Me" for current session
 */
export async function enableRememberMe(userId: string, email: string): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + DEFAULT_CONFIG.persistDuration);

    const sessionInfo: SessionInfo = {
      userId,
      email,
      expiresAt,
      rememberMe: true,
      lastRefresh: new Date(),
    };

    // Store in localStorage (survives browser close)
    localStorage.setItem(REMEMBER_ME_KEY, 'true');
    localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(sessionInfo));

    // Update Supabase session to persist
    await supabase.auth.refreshSession();

    console.log('[SessionPersistence] Remember me enabled for', email);
  } catch (error) {
    console.error('[SessionPersistence] Error enabling remember me:', error);
  }
}

/**
 * Disable "Remember Me" and clear persistent session
 */
export function disableRememberMe(): void {
  try {
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(SESSION_INFO_KEY);
    
    console.log('[SessionPersistence] Remember me disabled');
  } catch (error) {
    console.error('[SessionPersistence] Error disabling remember me:', error);
  }
}

/**
 * Check if "Remember Me" is enabled
 */
export function isRememberMeEnabled(): boolean {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Get stored session info
 */
export function getStoredSessionInfo(): SessionInfo | null {
  try {
    const stored = localStorage.getItem(SESSION_INFO_KEY);
    if (!stored) return null;

    const info = JSON.parse(stored);
    
    // Parse dates
    info.expiresAt = new Date(info.expiresAt);
    info.lastRefresh = new Date(info.lastRefresh);

    // Check if expired
    if (info.expiresAt < new Date()) {
      disableRememberMe();
      return null;
    }

    return info;
  } catch {
    return null;
  }
}

// =====================================================
// SESSION AUTO-REFRESH
// =====================================================

/**
 * Check if session needs refresh
 */
export function shouldRefreshSession(): boolean {
  const sessionInfo = getStoredSessionInfo();
  if (!sessionInfo || !sessionInfo.rememberMe) {
    return false;
  }

  const now = new Date();
  const refreshThreshold = new Date(sessionInfo.expiresAt);
  refreshThreshold.setDate(refreshThreshold.getDate() - DEFAULT_CONFIG.refreshBeforeExpiry);

  return now >= refreshThreshold;
}

/**
 * Refresh session if needed
 */
export async function refreshSessionIfNeeded(): Promise<boolean> {
  try {
    if (!shouldRefreshSession()) {
      return false;
    }

    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session) {
      console.error('[SessionPersistence] Refresh failed:', error);
      disableRememberMe();
      return false;
    }

    // Update session info with new expiry
    const sessionInfo = getStoredSessionInfo();
    if (sessionInfo) {
      sessionInfo.lastRefresh = new Date();
      sessionInfo.expiresAt = new Date();
      sessionInfo.expiresAt.setDate(sessionInfo.expiresAt.getDate() + DEFAULT_CONFIG.persistDuration);
      
      localStorage.setItem(SESSION_INFO_KEY, JSON.stringify(sessionInfo));
    }

    console.log('[SessionPersistence] Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('[SessionPersistence] Error refreshing session:', error);
    return false;
  }
}

/**
 * Initialize auto-refresh interval
 * Call this once in App.tsx or main.tsx
 */
export function initializeAutoRefresh(): () => void {
  // Check every hour
  const intervalId = setInterval(async () => {
    if (isRememberMeEnabled()) {
      await refreshSessionIfNeeded();
    }
  }, 60 * 60 * 1000); // 1 hour

  // Also check on visibility change (tab becomes active)
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && isRememberMeEnabled()) {
      await refreshSessionIfNeeded();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup function
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

// =====================================================
// SESSION RESTORATION
// =====================================================

/**
 * Attempt to restore session on app load
 */
export async function restoreSession(): Promise<boolean> {
  try {
    // Check if remember me is enabled
    if (!isRememberMeEnabled()) {
      return false;
    }

    const sessionInfo = getStoredSessionInfo();
    if (!sessionInfo) {
      return false;
    }

    // Get current session from Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      // Try to refresh
      const refreshed = await refreshSessionIfNeeded();
      if (!refreshed) {
        disableRememberMe();
        return false;
      }
      return true;
    }

    // Session exists, check if it needs refresh
    await refreshSessionIfNeeded();
    
    console.log('[SessionPersistence] Session restored for', sessionInfo.email);
    return true;
  } catch (error) {
    console.error('[SessionPersistence] Error restoring session:', error);
    disableRememberMe();
    return false;
  }
}

// =====================================================
// LOGOUT HANDLING
// =====================================================

/**
 * Logout and clear all session data
 */
export async function logout(): Promise<void> {
  try {
    // Clear remember me data
    disableRememberMe();

    // Sign out from Supabase
    await supabase.auth.signOut();

    console.log('[SessionPersistence] Logged out successfully');
  } catch (error) {
    console.error('[SessionPersistence] Error during logout:', error);
  }
}

// =====================================================
// SECURITY HELPERS
// =====================================================

/**
 * Check if session is secure (HTTPS)
 */
export function isSecureConnection(): boolean {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

/**
 * Validate session security settings
 */
export function validateSessionSecurity(): boolean {
  // In production, require HTTPS for remember me
  if (DEFAULT_CONFIG.secureOnly && !isSecureConnection()) {
    console.warn('[SessionPersistence] Remember me requires HTTPS in production');
    return false;
  }

  return true;
}

/**
 * Get time until session expires
 */
export function getTimeUntilExpiry(): number | null {
  const sessionInfo = getStoredSessionInfo();
  if (!sessionInfo) return null;

  const now = new Date();
  return sessionInfo.expiresAt.getTime() - now.getTime();
}

/**
 * Get human-readable expiry time
 */
export function getExpiryMessage(): string | null {
  const timeLeft = getTimeUntilExpiry();
  if (timeLeft === null) return null;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `Session expires in ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `Session expires in ${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return 'Session expiring soon';
  }
}

// =====================================================
// EXPORT
// =====================================================

export default {
  enableRememberMe,
  disableRememberMe,
  isRememberMeEnabled,
  getStoredSessionInfo,
  refreshSessionIfNeeded,
  initializeAutoRefresh,
  restoreSession,
  logout,
  validateSessionSecurity,
  getTimeUntilExpiry,
  getExpiryMessage,
};