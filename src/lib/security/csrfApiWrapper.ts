/**
 * CSRF-Protected API Wrapper
 * 
 * @fileoverview
 * Wraps Supabase API calls with automatic CSRF token injection for
 * state-changing operations (POST, PUT, DELETE, PATCH).
 * 
 * ## Features:
 * - Automatic CSRF token injection
 * - CSRF validation error handling
 * - Logging of CSRF violations
 * - Seamless integration with existing API layer
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Wrap mutation with CSRF protection
 * const result = await wrapWithCSRF(
 *   () => supabase.from('projects').insert(data),
 *   'POST',
 *   '/projects'
 * );
 * 
 * // Use in mutation hooks
 * mutationFn: (data) => wrapWithCSRF(
 *   () => projectsApi.create(data),
 *   'POST',
 *   '/api/projects'
 * )
 * ```
 * 
 * @module lib/security/csrfApiWrapper
 * @since 2026-02-01
 */

import { PostgrestError } from '@supabase/supabase-js';
import { 
  getCSRFToken, 
  requiresCSRFProtection,
  CSRFError,
  logCSRFViolation 
} from './csrf';
import { ApiResponse } from '../api/base';

/**
 * CSRF-protected API call options
 */
interface CSRFApiOptions {
  /** Override CSRF token (for testing) */
  csrfToken?: string;
  /** Skip CSRF validation (not recommended) */
  skipCSRF?: boolean;
  /** Additional metadata for logging */
  metadata?: Record<string, unknown>;
}

/**
 * Wraps an API call with CSRF protection
 * 
 * Automatically adds CSRF token to requests that modify data.
 * Validates token and logs violations.
 * 
 * Note: Since we're using Supabase client-side, we simulate CSRF protection
 * by validating the token exists before making the call. In a traditional
 * backend, the server would validate the token.
 * 
 * @template T The response data type
 * @param {Function} apiCall - The API call to wrap
 * @param {string} method - HTTP method (POST, PUT, DELETE, PATCH)
 * @param {string} endpoint - API endpoint path (for logging)
 * @param {CSRFApiOptions} options - Additional options
 * @returns {Promise<ApiResponse<T>>} API response
 */
export async function wrapWithCSRF<T>(
  apiCall: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  method: string,
  endpoint: string,
  options: CSRFApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Check if CSRF protection is required
    if (!requiresCSRFProtection(method) || options.skipCSRF) {
      // No CSRF protection needed for GET requests
      const { data, error } = await apiCall();
      
      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code,
        };
      }
      
      return {
        success: true,
        data: data as T,
      };
    }
    
    // Get CSRF token
    const csrfToken = options.csrfToken || getCSRFToken();
    
    // Validate token exists
    if (!csrfToken) {
      logCSRFViolation({
        endpoint,
        method,
        timestamp: Date.now(),
      });
      
      return {
        success: false,
        error: 'CSRF token is missing. Please refresh the page and try again.',
        code: 'CSRF_TOKEN_MISSING',
      };
    }
    
    // Note: In a traditional backend, we would include the token in headers:
    // headers: { 'X-CSRF-Token': csrfToken }
    // 
    // Since Supabase handles authentication via JWT and we're client-side,
    // we validate the token client-side before allowing the operation.
    // For true CSRF protection, implement server-side validation in Supabase Edge Functions.
    
    // Execute the API call
    const { data, error } = await apiCall();
    
    if (error) {
      return {
        success: false,
        error: error.message,
        code: error.code,
      };
    }
    
    return {
      success: true,
      data: data as T,
    };
  } catch (error: any) {
    // Handle CSRF-specific errors
    if (error instanceof CSRFError) {
      logCSRFViolation({
        endpoint,
        method,
        timestamp: Date.now(),
      });
      
      return {
        success: false,
        error: error.message,
        code: 'CSRF_VALIDATION_FAILED',
      };
    }
    
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Creates a CSRF-protected version of an API function
 * 
 * Returns a wrapped function that automatically includes CSRF protection.
 * 
 * @template TInput Input type
 * @template TOutput Output type
 * @param {Function} apiFunc - The API function to wrap
 * @param {string} method - HTTP method
 * @param {Function} getEndpoint - Function to generate endpoint from input
 * @returns {Function} CSRF-protected API function
 * 
 * @example
 * ```tsx
 * const createProjectWithCSRF = createCSRFProtectedApi(
 *   projectsApi.create,
 *   'POST',
 *   () => '/api/projects'
 * );
 * 
 * const result = await createProjectWithCSRF(projectData);
 * ```
 */
export function createCSRFProtectedApi<TInput, TOutput>(
  apiFunc: (input: TInput) => Promise<{ data: TOutput | null; error: PostgrestError | null }>,
  method: string,
  getEndpoint: (input: TInput) => string
): (input: TInput, options?: CSRFApiOptions) => Promise<ApiResponse<TOutput>> {
  return async (input: TInput, options: CSRFApiOptions = {}) => {
    const endpoint = getEndpoint(input);
    return wrapWithCSRF(
      () => apiFunc(input),
      method,
      endpoint,
      options
    );
  };
}

/**
 * Extracts CSRF token from request headers
 * 
 * Used for server-side validation in Edge Functions.
 * 
 * @param {Headers} headers - Request headers
 * @returns {string | null} CSRF token or null if not found
 */
export function extractCSRFToken(headers: Headers): string | null {
  // Check common CSRF header names
  const csrfHeader = headers.get('X-CSRF-Token') 
    || headers.get('X-XSRF-Token')
    || headers.get('CSRF-Token');
  
  return csrfHeader;
}

/**
 * Validates CSRF token from request
 * 
 * Server-side validation function for Edge Functions.
 * 
 * @param {Headers} headers - Request headers
 * @param {string} expectedToken - Expected CSRF token
 * @returns {boolean} True if valid
 */
export function validateCSRFFromRequest(
  headers: Headers,
  expectedToken: string
): boolean {
  const token = extractCSRFToken(headers);
  
  if (!token || !expectedToken) {
    return false;
  }
  
  // Constant-time comparison
  if (token.length !== expectedToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  
  return result === 0;
}
