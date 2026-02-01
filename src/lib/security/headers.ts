/**
 * Security Headers Configuration
 * 
 * @fileoverview
 * Implements comprehensive security headers following OWASP best practices
 * to protect against XSS, clickjacking, MIME-sniffing, and other attacks.
 * 
 * ## Headers Implemented:
 * - Content-Security-Policy (CSP) - Prevents XSS attacks
 * - X-Frame-Options - Prevents clickjacking
 * - X-Content-Type-Options - Prevents MIME-sniffing
 * - Strict-Transport-Security (HSTS) - Enforces HTTPS
 * - Referrer-Policy - Controls referrer information
 * - Permissions-Policy - Controls browser features
 * - X-XSS-Protection - Legacy XSS protection
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Get all security headers
 * const headers = getSecurityHeaders();
 * 
 * // Get CSP header only
 * const csp = getCSPHeader();
 * 
 * // Apply to Hono server
 * app.use('*', async (c, next) => {
 *   const headers = getSecurityHeaders();
 *   Object.entries(headers).forEach(([key, value]) => {
 *     c.header(key, value);
 *   });
 *   await next();
 * });
 * ```
 * 
 * @module lib/security/headers
 * @since 2026-02-01
 */

/**
 * Environment configuration
 */
interface SecurityHeadersConfig {
  environment: 'development' | 'production';
  enableHSTS: boolean;
  reportCSPViolations: boolean;
  cspReportUri?: string;
}

/**
 * Get default configuration based on environment
 */
function getDefaultConfig(): SecurityHeadersConfig {
  const isDevelopment = import.meta.env.DEV;
  
  return {
    environment: isDevelopment ? 'development' : 'production',
    enableHSTS: !isDevelopment, // Only enable HSTS in production
    reportCSPViolations: !isDevelopment,
    cspReportUri: import.meta.env.VITE_CSP_REPORT_URI,
  };
}

/**
 * Generates Content Security Policy (CSP) header
 * 
 * CSP prevents XSS by controlling which resources can be loaded.
 * 
 * Directives:
 * - default-src: Default policy for all resource types
 * - script-src: JavaScript sources
 * - style-src: CSS sources
 * - img-src: Image sources
 * - connect-src: Fetch/XHR/WebSocket connections
 * - font-src: Font sources
 * - frame-ancestors: Who can embed this page
 * - base-uri: Restricts <base> tag URLs
 * - form-action: Restricts form submission targets
 * 
 * @param {SecurityHeadersConfig} config - Configuration options
 * @returns {string} CSP header value
 */
export function getCSPHeader(config: SecurityHeadersConfig = getDefaultConfig()): string {
  const isDevelopment = config.environment === 'development';
  
  const directives = [
    // Default policy: only allow same origin
    "default-src 'self'",
    
    // Scripts: self, inline (for React), and development tools
    isDevelopment
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" // Dev needs eval for HMR
      : "script-src 'self' 'unsafe-inline'", // Prod: allow inline for React
    
    // Styles: self, inline (for styled-components), and external CDNs if needed
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    
    // Images: self, data URIs (for inlined images), and external sources
    "img-src 'self' data: https: blob:",
    
    // Connections: self, Supabase, and any API endpoints
    isDevelopment
      ? "connect-src 'self' https://*.supabase.co wss://*.supabase.co http://localhost:* ws://localhost:*"
      : "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    
    // Fonts: self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    
    // Objects: none (blocks Flash, Java, etc.)
    "object-src 'none'",
    
    // Media: self
    "media-src 'self'",
    
    // Frames: prevent embedding except same origin
    "frame-ancestors 'self'",
    
    // Base URI: restrict <base> tag
    "base-uri 'self'",
    
    // Form actions: only allow forms to submit to same origin
    "form-action 'self'",
    
    // Upgrade insecure requests in production
    !isDevelopment ? "upgrade-insecure-requests" : "",
    
    // Block all mixed content in production
    !isDevelopment ? "block-all-mixed-content" : "",
  ];
  
  // Add CSP reporting if configured
  if (config.reportCSPViolations && config.cspReportUri) {
    directives.push(`report-uri ${config.cspReportUri}`);
    directives.push(`report-to csp-endpoint`);
  }
  
  return directives.filter(Boolean).join('; ');
}

/**
 * Generates Permissions Policy header
 * 
 * Controls which browser features can be used.
 * Helps reduce attack surface by disabling unnecessary features.
 * 
 * @returns {string} Permissions-Policy header value
 */
export function getPermissionsPolicyHeader(): string {
  const policies = [
    'accelerometer=()',        // Disable accelerometer
    'camera=()',               // Disable camera
    'geolocation=()',          // Disable geolocation
    'gyroscope=()',            // Disable gyroscope
    'magnetometer=()',         // Disable magnetometer
    'microphone=()',           // Disable microphone
    'payment=()',              // Disable payment request API
    'usb=()',                  // Disable USB
    'interest-cohort=()',      // Disable FLoC tracking
  ];
  
  return policies.join(', ');
}

/**
 * Generates Strict-Transport-Security (HSTS) header
 * 
 * Forces browsers to only connect via HTTPS.
 * Should only be enabled in production with valid SSL certificate.
 * 
 * @param {boolean} enabled - Whether to enable HSTS
 * @returns {string} HSTS header value
 */
export function getHSTSHeader(enabled: boolean = true): string {
  if (!enabled) {
    return '';
  }
  
  // max-age: 1 year (31536000 seconds)
  // includeSubDomains: apply to all subdomains
  // preload: allow browser HSTS preload list inclusion
  return 'max-age=31536000; includeSubDomains; preload';
}

/**
 * Generates all security headers
 * 
 * @param {SecurityHeadersConfig} config - Configuration options
 * @returns {Record<string, string>} Object with all security headers
 */
export function getSecurityHeaders(
  config: SecurityHeadersConfig = getDefaultConfig()
): Record<string, string> {
  const headers: Record<string, string> = {
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(config),
    
    // Prevent clickjacking by disallowing iframe embedding
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevent MIME-sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': getPermissionsPolicyHeader(),
    
    // Legacy XSS protection (for older browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Prevent DNS prefetching (privacy)
    'X-DNS-Prefetch-Control': 'off',
    
    // Disable client-side caching of sensitive pages
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
  
  // Add HSTS only in production
  if (config.enableHSTS) {
    const hstsValue = getHSTSHeader(true);
    if (hstsValue) {
      headers['Strict-Transport-Security'] = hstsValue;
    }
  }
  
  return headers;
}

/**
 * Validates security headers are present
 * 
 * Used for testing and monitoring to ensure headers are applied.
 * 
 * @param {Headers | Record<string, string>} headers - Headers to validate
 * @returns {object} Validation result with missing headers
 */
export function validateSecurityHeaders(
  headers: Headers | Record<string, string>
): { valid: boolean; missing: string[]; present: string[] } {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ];
  
  const present: string[] = [];
  const missing: string[] = [];
  
  // Normalize headers to Record format
  const headersObj = headers instanceof Headers
    ? Object.fromEntries(headers.entries())
    : headers;
  
  // Check for case-insensitive header names
  const normalizedHeaders = Object.keys(headersObj).reduce((acc, key) => {
    acc[key.toLowerCase()] = headersObj[key];
    return acc;
  }, {} as Record<string, string>);
  
  for (const header of requiredHeaders) {
    const normalizedHeader = header.toLowerCase();
    if (normalizedHeaders[normalizedHeader]) {
      present.push(header);
    } else {
      missing.push(header);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    present,
  };
}

/**
 * Logs security header status
 * 
 * @param {Record<string, string>} headers - Headers to log
 */
export function logSecurityHeaders(headers: Record<string, string>): void {
  console.log('🔒 Security Headers Applied:');
  Object.entries(headers).forEach(([key, value]) => {
    console.log(`  ${key}: ${value.substring(0, 60)}${value.length > 60 ? '...' : ''}`);
  });
}

/**
 * Export types
 */
export type { SecurityHeadersConfig };
