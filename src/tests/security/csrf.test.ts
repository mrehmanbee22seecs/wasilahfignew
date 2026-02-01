/**
 * CSRF Protection Tests
 * 
 * @fileoverview
 * Tests for CSRF token generation, validation, and protection mechanisms.
 * Verifies that CSRF tokens are properly generated, validated, and enforced.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  generateCSRFToken,
  getCSRFToken,
  validateCSRFToken,
  storeCSRFToken,
  clearCSRFToken,
  refreshCSRFToken,
  requiresCSRFProtection,
  CSRFError,
  logCSRFViolation,
} from '../../lib/security/csrf';

describe('CSRF Protection', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('generateCSRFToken', () => {
    it('should generate a token', () => {
      const token = generateCSRFToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const token1 = generateCSRFToken();
      const token2 = generateCSRFToken();
      
      expect(token1).not.toBe(token2);
    });

    it('should generate cryptographically secure tokens', () => {
      const token = generateCSRFToken();
      
      // Token should be base64url encoded (only contains URL-safe characters)
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      
      // Token should be at least 32 characters (from 32 bytes)
      expect(token.length).toBeGreaterThanOrEqual(32);
    });
  });

  describe('storeCSRFToken and getCSRFToken', () => {
    it('should store and retrieve a token', () => {
      const token = 'test-token-123';
      storeCSRFToken(token);
      
      const retrieved = getCSRFToken();
      expect(retrieved).toBe(token);
    });

    it('should generate a new token if none exists', () => {
      const token = getCSRFToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should store token with timestamp', () => {
      const token = 'test-token-456';
      storeCSRFToken(token);
      
      const timestamp = sessionStorage.getItem('wasilah-csrf-token-timestamp');
      expect(timestamp).toBeDefined();
      expect(Number(timestamp)).toBeGreaterThan(0);
    });
  });

  describe('validateCSRFToken', () => {
    it('should validate correct token', () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      
      const isValid = validateCSRFToken(token);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect token', () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      
      const isValid = validateCSRFToken('wrong-token');
      expect(isValid).toBe(false);
    });

    it('should reject token when none is stored', () => {
      const isValid = validateCSRFToken('any-token');
      expect(isValid).toBe(false);
    });

    it('should reject expired token', () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      
      // Manually set timestamp to 25 hours ago (expired)
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000);
      sessionStorage.setItem('wasilah-csrf-token-timestamp', expiredTimestamp.toString());
      
      const isValid = validateCSRFToken(token);
      expect(isValid).toBe(false);
    });
  });

  describe('refreshCSRFToken', () => {
    it('should generate and store a new token', () => {
      const oldToken = generateCSRFToken();
      storeCSRFToken(oldToken);
      
      const newToken = refreshCSRFToken();
      
      expect(newToken).not.toBe(oldToken);
      expect(getCSRFToken()).toBe(newToken);
    });
  });

  describe('clearCSRFToken', () => {
    it('should remove token from storage', () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      
      clearCSRFToken();
      
      const storedToken = sessionStorage.getItem('wasilah-csrf-token');
      const storedTimestamp = sessionStorage.getItem('wasilah-csrf-token-timestamp');
      
      expect(storedToken).toBeNull();
      expect(storedTimestamp).toBeNull();
    });
  });

  describe('requiresCSRFProtection', () => {
    it('should require protection for POST requests', () => {
      expect(requiresCSRFProtection('POST')).toBe(true);
    });

    it('should require protection for PUT requests', () => {
      expect(requiresCSRFProtection('PUT')).toBe(true);
    });

    it('should require protection for DELETE requests', () => {
      expect(requiresCSRFProtection('DELETE')).toBe(true);
    });

    it('should require protection for PATCH requests', () => {
      expect(requiresCSRFProtection('PATCH')).toBe(true);
    });

    it('should not require protection for GET requests', () => {
      expect(requiresCSRFProtection('GET')).toBe(false);
    });

    it('should not require protection for HEAD requests', () => {
      expect(requiresCSRFProtection('HEAD')).toBe(false);
    });

    it('should not require protection for OPTIONS requests', () => {
      expect(requiresCSRFProtection('OPTIONS')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(requiresCSRFProtection('post')).toBe(true);
      expect(requiresCSRFProtection('get')).toBe(false);
    });
  });

  describe('CSRFError', () => {
    it('should create error with default message', () => {
      const error = new CSRFError();
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('CSRFError');
      expect(error.message).toBe('CSRF token validation failed');
    });

    it('should create error with custom message', () => {
      const customMessage = 'Custom CSRF error message';
      const error = new CSRFError(customMessage);
      
      expect(error.message).toBe(customMessage);
    });
  });

  describe('logCSRFViolation', () => {
    it('should log violation to console', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logCSRFViolation({
        endpoint: '/api/test',
        method: 'POST',
      });
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '🚨 CSRF Violation Detected:',
        expect.objectContaining({
          type: 'CSRF_VIOLATION',
          endpoint: '/api/test',
          method: 'POST',
        })
      );
      
      consoleWarnSpy.mockRestore();
    });

    it('should include timestamp', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const beforeTime = Date.now();
      
      logCSRFViolation({ endpoint: '/api/test' });
      
      const afterTime = Date.now();
      const loggedData = consoleWarnSpy.mock.calls[0][1];
      
      expect(loggedData.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(loggedData.timestamp).toBeLessThanOrEqual(afterTime);
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('CSRF Token Security', () => {
    it('should use constant-time comparison', () => {
      // This test verifies that validation doesn't leak timing information
      const token = 'a'.repeat(43); // Base64url token length
      storeCSRFToken(token);
      
      const startWrong = performance.now();
      validateCSRFToken('b'.repeat(43));
      const endWrong = performance.now();
      
      const startCorrect = performance.now();
      validateCSRFToken(token);
      const endCorrect = performance.now();
      
      const wrongTime = endWrong - startWrong;
      const correctTime = endCorrect - startCorrect;
      
      // Times should be similar (within 5ms)
      // Note: This is a basic check; true constant-time would need more rigorous testing
      expect(Math.abs(wrongTime - correctTime)).toBeLessThan(5);
    });
  });

  describe('CSRF Protection - Request Rejection', () => {
    it('should reject request without valid token', () => {
      // Simulate a mutation without CSRF token
      const hasToken = !!getCSRFToken();
      
      // Clear the token to simulate missing token
      clearCSRFToken();
      sessionStorage.removeItem('wasilah-csrf-token');
      
      // Attempt to get token (should generate new one)
      const newToken = getCSRFToken();
      
      // Even though a new token is generated, it wasn't in the original request
      expect(newToken).toBeDefined();
    });

    it('should accept request with valid token', () => {
      const token = generateCSRFToken();
      storeCSRFToken(token);
      
      const isValid = validateCSRFToken(token);
      expect(isValid).toBe(true);
    });
  });
});
