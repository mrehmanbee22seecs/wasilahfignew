/**
 * CSRF (Cross-Site Request Forgery) Protection
 * 
 * @fileoverview
 * Implements CSRF token generation, validation, and management for protecting
 * state-changing operations (POST, PUT, DELETE, PATCH) from forged requests.
 * 
 * ## Features:
 * - Cryptographically secure token generation
 * - Session-based token storage
 * - Token rotation on authentication changes
 * - Automatic token refresh
 * - Request validation
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Generate token
 * const token = generateCSRFToken();
 * 
 * // Validate token
 * const isValid = validateCSRFToken(token);
 * 
 * // Get current token
 * const currentToken = getCSRFToken();
 * 
 * // Add to request headers
 * headers: {
 *   'X-CSRF-Token': getCSRFToken()
 * }
 * ```
 * 
 * @module lib/security/csrf
 * @since 2026-02-01
 */

const CSRF_TOKEN_KEY = 'wasilah-csrf-token';
const CSRF_TOKEN_TIMESTAMP_KEY = 'wasilah-csrf-token-timestamp';
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generates a cryptographically secure CSRF token
 * 
 * Uses Web Crypto API for secure random number generation.
 * Tokens are 32 bytes (256 bits) encoded as base64url.
 * 
 * @returns {string} A secure CSRF token
 */
export function generateCSRFToken(): string {
  // Use Web Crypto API for cryptographically secure random values
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  
  // Convert to base64url (URL-safe base64)
  const base64 = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return base64;
}

/**
 * Stores a CSRF token in session storage with timestamp
 * 
 * @param {string} token - The CSRF token to store
 */
export function storeCSRFToken(token: string): void {
  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    sessionStorage.setItem(CSRF_TOKEN_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to store CSRF token:', error);
  }
}

/**
 * Retrieves the current CSRF token from storage
 * 
 * Automatically generates a new token if:
 * - No token exists
 * - Token has expired
 * - Token is invalid
 * 
 * @returns {string} The current CSRF token
 */
export function getCSRFToken(): string {
  try {
    const token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const timestamp = sessionStorage.getItem(CSRF_TOKEN_TIMESTAMP_KEY);
    
    // Check if token exists and is not expired
    if (token && timestamp) {
      const tokenAge = Date.now() - parseInt(timestamp, 10);
      if (tokenAge < TOKEN_EXPIRY_MS) {
        return token;
      }
    }
    
    // Generate new token if not found or expired
    const newToken = generateCSRFToken();
    storeCSRFToken(newToken);
    return newToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    // Fallback: generate temporary token in memory
    return generateCSRFToken();
  }
}

/**
 * Validates a CSRF token
 * 
 * Compares the provided token with the stored token.
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * @param {string} token - The token to validate
 * @returns {boolean} True if token is valid, false otherwise
 */
export function validateCSRFToken(token: string): boolean {
  try {
    const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    const timestamp = sessionStorage.getItem(CSRF_TOKEN_TIMESTAMP_KEY);
    
    if (!storedToken || !timestamp) {
      return false;
    }
    
    // Check if token is expired
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge >= TOKEN_EXPIRY_MS) {
      return false;
    }
    
    // Constant-time comparison to prevent timing attacks
    return constantTimeEqual(token, storedToken);
  } catch (error) {
    console.error('Failed to validate CSRF token:', error);
    return false;
  }
}

/**
 * Constant-time string comparison
 * 
 * Prevents timing attacks by ensuring comparison always takes the same time.
 * 
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} True if strings are equal
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Refreshes the CSRF token
 * 
 * Generates and stores a new token. Should be called:
 * - On login/logout
 * - On session changes
 * - Periodically for long sessions
 * 
 * @returns {string} The new CSRF token
 */
export function refreshCSRFToken(): string {
  const newToken = generateCSRFToken();
  storeCSRFToken(newToken);
  return newToken;
}

/**
 * Clears the CSRF token from storage
 * 
 * Should be called on logout or session invalidation.
 */
export function clearCSRFToken(): void {
  try {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
    sessionStorage.removeItem(CSRF_TOKEN_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear CSRF token:', error);
  }
}

/**
 * Checks if a request method requires CSRF protection
 * 
 * @param {string} method - HTTP method
 * @returns {boolean} True if method requires CSRF protection
 */
export function requiresCSRFProtection(method: string): boolean {
  const protectedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  return protectedMethods.includes(method.toUpperCase());
}

/**
 * Error class for CSRF validation failures
 */
export class CSRFError extends Error {
  constructor(message: string = 'CSRF token validation failed') {
    super(message);
    this.name = 'CSRFError';
  }
}

/**
 * Logs CSRF violations for security monitoring
 * 
 * @param {object} details - Details about the violation
 */
export function logCSRFViolation(details: {
  endpoint?: string;
  method?: string;
  timestamp?: number;
  userAgent?: string;
}): void {
  const violation = {
    type: 'CSRF_VIOLATION',
    timestamp: details.timestamp || Date.now(),
    endpoint: details.endpoint || 'unknown',
    method: details.method || 'unknown',
    userAgent: details.userAgent || navigator.userAgent,
  };
  
  console.warn('🚨 CSRF Violation Detected:', violation);
  
  // In production, send to logging service
  if (import.meta.env.PROD) {
    // TODO: Send to monitoring service (e.g., Sentry, LogRocket)
    try {
      // Example: sendToMonitoring('csrf_violation', violation);
    } catch (error) {
      console.error('Failed to log CSRF violation:', error);
    }
  }
}
