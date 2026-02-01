/**
 * Input Validator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateInput,
  isValid,
  sanitizeFileName,
  validateFileUpload,
  sanitizeObject,
} from '../../lib/security/inputValidator';

describe('Input Validator', () => {
  describe('String Validation', () => {
    it('should validate clean strings', () => {
      const result = validateInput.string('Hello World');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Hello World');
    });

    it('should detect SQL injection attempts', () => {
      const result = validateInput.string("'; DROP TABLE users; --");
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('SQL injection'))).toBe(true);
    });

    it('should detect XSS attempts', () => {
      const result = validateInput.string('<script>alert("XSS")</script>');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('XSS'))).toBe(true);
    });

    it('should enforce max length', () => {
      const result = validateInput.string('A'.repeat(100), { maxLength: 50 });
      expect(result.sanitized.length).toBe(50);
    });

    it('should enforce min length', () => {
      const result = validateInput.string('Hi', { minLength: 5 });
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('at least'))).toBe(true);
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      const result = validateInput.email('user@example.com');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('user@example.com');
    });

    it('should reject invalid email format', () => {
      const result = validateInput.email('invalid-email');
      expect(result.valid).toBe(false);
    });

    it('should convert email to lowercase', () => {
      const result = validateInput.email('User@Example.COM');
      expect(result.sanitized).toBe('user@example.com');
    });

    it('should detect emails with consecutive dots', () => {
      const result = validateInput.email('user..name@example.com');
      expect(result.valid).toBe(false);
    });

    it('should use isValid helper', () => {
      expect(isValid.email('user@example.com')).toBe(true);
      expect(isValid.email('invalid')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate HTTPS URL', () => {
      const result = validateInput.url('https://example.com');
      expect(result.valid).toBe(true);
    });

    it('should validate HTTP URL', () => {
      const result = validateInput.url('http://example.com');
      expect(result.valid).toBe(true);
    });

    it('should block javascript: protocol', () => {
      const result = validateInput.url('javascript:alert("XSS")');
      expect(result.valid).toBe(false);
    });

    it('should block localhost by default', () => {
      const result = validateInput.url('http://localhost:3000');
      expect(result.valid).toBe(false);
    });

    it('should allow localhost when configured', () => {
      const result = validateInput.url('http://localhost:3000', { blockLocalhost: false });
      expect(result.valid).toBe(true);
    });

    it('should validate against allowed domains', () => {
      const result = validateInput.url('https://example.com', {
        allowedDomains: ['trusted.com'],
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    it('should validate 10-digit phone number', () => {
      const result = validateInput.phone('1234567890');
      expect(result.valid).toBe(true);
    });

    it('should sanitize phone number formatting', () => {
      const result = validateInput.phone('(123) 456-7890');
      expect(result.sanitized).toBe('1234567890');
    });

    it('should handle country code', () => {
      const result = validateInput.phone('+11234567890');
      expect(result.valid).toBe(true);
    });
  });

  describe('Number Validation', () => {
    it('should validate number within range', () => {
      const result = validateInput.number(50, { min: 0, max: 100 });
      expect(result.valid).toBe(true);
      expect(result.value).toBe(50);
    });

    it('should reject number below minimum', () => {
      const result = validateInput.number(-5, { min: 0 });
      expect(result.valid).toBe(false);
    });

    it('should reject number above maximum', () => {
      const result = validateInput.number(150, { max: 100 });
      expect(result.valid).toBe(false);
    });

    it('should validate integers', () => {
      const result = validateInput.number(5.5, { integer: true });
      expect(result.valid).toBe(false);
    });
  });

  describe('File Name Sanitization', () => {
    it('should sanitize file name', () => {
      const result = sanitizeFileName('my file.txt');
      expect(result).toBe('my_file.txt');
    });

    it('should remove path traversal', () => {
      const result = sanitizeFileName('../../../etc/passwd');
      expect(result).not.toContain('..');
    });

    it('should preserve file extension', () => {
      const result = sanitizeFileName('document.pdf');
      expect(result).toContain('.pdf');
    });

    it('should limit file name length', () => {
      const longName = 'a'.repeat(300) + '.txt';
      const result = sanitizeFileName(longName);
      expect(result.length).toBeLessThanOrEqual(255);
    });
  });

  describe('File Upload Validation', () => {
    it('should validate file size', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFileUpload(file, { maxSize: 1024 });
      expect(result.valid).toBe(true);
    });

    it('should reject oversized files', () => {
      const largeContent = 'x'.repeat(2000);
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      const result = validateFileUpload(file, { maxSize: 1000 });
      expect(result.valid).toBe(false);
    });

    it('should validate file type', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFileUpload(file, {
        allowedTypes: ['text/plain', 'application/pdf'],
      });
      expect(result.valid).toBe(true);
    });

    it('should reject invalid file type', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
      const result = validateFileUpload(file, {
        allowedTypes: ['text/plain'],
      });
      expect(result.valid).toBe(false);
    });

    it('should validate file extension', () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const result = validateFileUpload(file, {
        allowedExtensions: ['txt', 'pdf'],
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('Object Sanitization', () => {
    it('should sanitize object strings', () => {
      const obj = {
        name: 'John<script>',
        email: 'john@example.com',
        age: 25,
      };
      const result = sanitizeObject(obj);
      expect(result.name).not.toContain('<script>');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25);
    });

    it('should sanitize nested objects', () => {
      const obj = {
        user: {
          name: 'John<>',
          details: {
            bio: 'Developer"',
          },
        },
      };
      const result = sanitizeObject(obj);
      expect(result.user.name).not.toContain('<>');
      expect(result.user.details.bio).not.toContain('"');
    });

    it('should sanitize arrays', () => {
      const obj = {
        tags: ['tag1<script>', 'tag2', 'tag3'],
      };
      const result = sanitizeObject(obj);
      expect(result.tags[0]).not.toContain('<script>');
    });
  });
});
