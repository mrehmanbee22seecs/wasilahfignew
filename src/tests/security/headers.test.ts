/**
 * Security Headers Tests
 * 
 * @fileoverview
 * Tests for security headers implementation and validation.
 * Verifies that all required security headers are present and properly configured.
 */

import { describe, it, expect } from 'vitest';
import {
  getSecurityHeaders,
  getCSPHeader,
  getPermissionsPolicyHeader,
  getHSTSHeader,
  validateSecurityHeaders,
  type SecurityHeadersConfig,
} from '../../lib/security/headers';

describe('Security Headers', () => {
  describe('getCSPHeader', () => {
    it('should generate CSP header for development', () => {
      const config: SecurityHeadersConfig = {
        environment: 'development',
        enableHSTS: false,
        reportCSPViolations: false,
      };
      
      const csp = getCSPHeader(config);
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self'");
      expect(csp).toContain("style-src 'self'");
      expect(csp).toContain("img-src 'self' data: https: blob:");
    });

    it('should generate CSP header for production', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const csp = getCSPHeader(config);
      
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("upgrade-insecure-requests");
      expect(csp).toContain("block-all-mixed-content");
    });

    it('should allow unsafe-eval in development only', () => {
      const devConfig: SecurityHeadersConfig = {
        environment: 'development',
        enableHSTS: false,
        reportCSPViolations: false,
      };
      
      const prodConfig: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const devCSP = getCSPHeader(devConfig);
      const prodCSP = getCSPHeader(prodConfig);
      
      expect(devCSP).toContain("'unsafe-eval'");
      expect(prodCSP).not.toContain("'unsafe-eval'");
    });

    it('should include Supabase in connect-src', () => {
      const csp = getCSPHeader();
      
      expect(csp).toContain('connect-src');
      expect(csp).toContain('supabase.co');
    });

    it('should prevent frame embedding', () => {
      const csp = getCSPHeader();
      
      expect(csp).toContain("frame-ancestors 'self'");
    });

    it('should restrict form actions', () => {
      const csp = getCSPHeader();
      
      expect(csp).toContain("form-action 'self'");
    });

    it('should block objects', () => {
      const csp = getCSPHeader();
      
      expect(csp).toContain("object-src 'none'");
    });

    it('should include CSP reporting when configured', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: true,
        cspReportUri: 'https://example.com/csp-report',
      };
      
      const csp = getCSPHeader(config);
      
      expect(csp).toContain('report-uri https://example.com/csp-report');
      expect(csp).toContain('report-to csp-endpoint');
    });
  });

  describe('getPermissionsPolicyHeader', () => {
    it('should disable sensitive browser features', () => {
      const policy = getPermissionsPolicyHeader();
      
      expect(policy).toContain('camera=()');
      expect(policy).toContain('microphone=()');
      expect(policy).toContain('geolocation=()');
      expect(policy).toContain('payment=()');
    });

    it('should disable FLoC tracking', () => {
      const policy = getPermissionsPolicyHeader();
      
      expect(policy).toContain('interest-cohort=()');
    });
  });

  describe('getHSTSHeader', () => {
    it('should generate HSTS header when enabled', () => {
      const hsts = getHSTSHeader(true);
      
      expect(hsts).toContain('max-age=31536000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });

    it('should return empty string when disabled', () => {
      const hsts = getHSTSHeader(false);
      
      expect(hsts).toBe('');
    });
  });

  describe('getSecurityHeaders', () => {
    it('should include all required security headers', () => {
      const headers = getSecurityHeaders();
      
      // Required headers
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['X-Frame-Options']).toBeDefined();
      expect(headers['X-Content-Type-Options']).toBeDefined();
      expect(headers['Referrer-Policy']).toBeDefined();
      expect(headers['Permissions-Policy']).toBeDefined();
    });

    it('should set X-Frame-Options to SAMEORIGIN', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
    });

    it('should set X-Content-Type-Options to nosniff', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });

    it('should set Referrer-Policy', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should include XSS protection header', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['X-XSS-Protection']).toBe('1; mode=block');
    });

    it('should include cache control headers', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['Cache-Control']).toContain('no-store');
      expect(headers['Pragma']).toBe('no-cache');
      expect(headers['Expires']).toBe('0');
    });

    it('should include HSTS in production', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const headers = getSecurityHeaders(config);
      
      expect(headers['Strict-Transport-Security']).toBeDefined();
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
    });

    it('should not include HSTS in development', () => {
      const config: SecurityHeadersConfig = {
        environment: 'development',
        enableHSTS: false,
        reportCSPViolations: false,
      };
      
      const headers = getSecurityHeaders(config);
      
      expect(headers['Strict-Transport-Security']).toBeUndefined();
    });
  });

  describe('validateSecurityHeaders', () => {
    it('should validate all required headers are present', () => {
      const headers = getSecurityHeaders();
      const validation = validateSecurityHeaders(headers);
      
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);
      expect(validation.present.length).toBeGreaterThan(0);
    });

    it('should detect missing headers', () => {
      const incompleteHeaders = {
        'X-Frame-Options': 'SAMEORIGIN',
      };
      
      const validation = validateSecurityHeaders(incompleteHeaders);
      
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('Content-Security-Policy');
      expect(validation.missing).toContain('X-Content-Type-Options');
      expect(validation.present).toContain('X-Frame-Options');
    });

    it('should work with Headers object', () => {
      const headers = new Headers();
      headers.set('Content-Security-Policy', "default-src 'self'");
      headers.set('X-Frame-Options', 'SAMEORIGIN');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      headers.set('Permissions-Policy', 'camera=()');
      
      const validation = validateSecurityHeaders(headers);
      
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);
    });

    it('should be case-insensitive', () => {
      const headers = {
        'content-security-policy': "default-src 'self'",
        'x-frame-options': 'SAMEORIGIN',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'permissions-policy': 'camera=()',
      };
      
      const validation = validateSecurityHeaders(headers);
      
      expect(validation.valid).toBe(true);
    });
  });

  describe('Security Headers - XSS Prevention', () => {
    it('should prevent inline script execution by default', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const csp = getCSPHeader(config);
      
      // In production, unsafe-eval should not be allowed
      expect(csp).not.toContain("'unsafe-eval'");
    });

    it('should include XSS protection headers', () => {
      const headers = getSecurityHeaders();
      
      // Multiple layers of XSS protection
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['X-XSS-Protection']).toBe('1; mode=block');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });
  });

  describe('Security Headers - Clickjacking Prevention', () => {
    it('should prevent clickjacking with X-Frame-Options', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['X-Frame-Options']).toBe('SAMEORIGIN');
    });

    it('should prevent clickjacking with CSP frame-ancestors', () => {
      const csp = getCSPHeader();
      
      expect(csp).toContain("frame-ancestors 'self'");
    });
  });

  describe('Security Headers - MIME Sniffing Prevention', () => {
    it('should prevent MIME sniffing', () => {
      const headers = getSecurityHeaders();
      
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });
  });

  describe('Security Headers - HTTPS Enforcement', () => {
    it('should enforce HTTPS in production with HSTS', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const headers = getSecurityHeaders(config);
      
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
      expect(headers['Strict-Transport-Security']).toContain('includeSubDomains');
    });

    it('should upgrade insecure requests in production', () => {
      const config: SecurityHeadersConfig = {
        environment: 'production',
        enableHSTS: true,
        reportCSPViolations: false,
      };
      
      const csp = getCSPHeader(config);
      
      expect(csp).toContain('upgrade-insecure-requests');
      expect(csp).toContain('block-all-mixed-content');
    });
  });
});
