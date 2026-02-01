/**
 * CSRF Context Provider
 * 
 * @fileoverview
 * React Context for managing CSRF tokens throughout the application.
 * Provides automatic token generation, refresh, and validation.
 * 
 * ## Features:
 * - Automatic token generation on mount
 * - Token refresh on authentication changes
 * - Easy access to CSRF token via useCSRF hook
 * - Automatic cleanup on unmount
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Wrap app with provider
 * <CSRFProvider>
 *   <App />
 * </CSRFProvider>
 * 
 * // Use in components
 * const { token, refreshToken } = useCSRF();
 * 
 * // Add to request
 * fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRF-Token': token
 *   }
 * });
 * ```
 * 
 * @module contexts/CSRFContext
 * @since 2026-02-01
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getCSRFToken,
  refreshCSRFToken,
  clearCSRFToken,
  validateCSRFToken,
} from '../lib/security/csrf';

/**
 * CSRF Context value type
 */
interface CSRFContextValue {
  /** Current CSRF token */
  token: string;
  /** Refresh the CSRF token */
  refreshToken: () => string;
  /** Validate a token */
  validateToken: (token: string) => boolean;
  /** Clear the CSRF token */
  clearToken: () => void;
}

/**
 * CSRF Context
 */
const CSRFContext = createContext<CSRFContextValue | undefined>(undefined);

/**
 * CSRF Provider Props
 */
interface CSRFProviderProps {
  children: React.ReactNode;
}

/**
 * CSRF Provider Component
 * 
 * Manages CSRF token lifecycle and provides it to child components.
 * Automatically generates token on mount and refreshes when needed.
 * 
 * @param {CSRFProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 */
export function CSRFProvider({ children }: CSRFProviderProps): JSX.Element {
  const [token, setToken] = useState<string>(() => getCSRFToken());

  /**
   * Refresh token and update state
   */
  const handleRefreshToken = useCallback(() => {
    const newToken = refreshCSRFToken();
    setToken(newToken);
    return newToken;
  }, []);

  /**
   * Clear token and update state
   */
  const handleClearToken = useCallback(() => {
    clearCSRFToken();
    setToken('');
  }, []);

  /**
   * Validate token
   */
  const handleValidateToken = useCallback((tokenToValidate: string) => {
    return validateCSRFToken(tokenToValidate);
  }, []);

  /**
   * Initialize token on mount
   */
  useEffect(() => {
    // Ensure token exists on mount
    const currentToken = getCSRFToken();
    setToken(currentToken);
  }, []);

  /**
   * Listen for authentication changes
   */
  useEffect(() => {
    // Refresh token when user logs in/out
    const handleStorageChange = (e: StorageEvent) => {
      // If session storage is cleared (logout), refresh token
      if (e.key === null || e.key === 'supabase.auth.token') {
        handleRefreshToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleRefreshToken]);

  /**
   * Periodically refresh token for long sessions
   */
  useEffect(() => {
    // Refresh token every 6 hours
    const refreshInterval = setInterval(() => {
      handleRefreshToken();
    }, 6 * 60 * 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [handleRefreshToken]);

  const value: CSRFContextValue = {
    token,
    refreshToken: handleRefreshToken,
    validateToken: handleValidateToken,
    clearToken: handleClearToken,
  };

  return (
    <CSRFContext.Provider value={value}>
      {children}
    </CSRFContext.Provider>
  );
}

/**
 * useCSRF Hook
 * 
 * Access CSRF token and related functions from any component.
 * 
 * @returns {CSRFContextValue} CSRF context value
 * @throws {Error} If used outside CSRFProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { token } = useCSRF();
 *   
 *   const handleSubmit = async () => {
 *     await fetch('/api/data', {
 *       method: 'POST',
 *       headers: {
 *         'X-CSRF-Token': token
 *       }
 *     });
 *   };
 *   
 *   return <button onClick={handleSubmit}>Submit</button>;
 * }
 * ```
 */
export function useCSRF(): CSRFContextValue {
  const context = useContext(CSRFContext);
  
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider');
  }
  
  return context;
}
