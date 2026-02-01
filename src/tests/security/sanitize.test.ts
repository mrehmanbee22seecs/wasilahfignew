/**
 * HTML Sanitization Security Tests
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  sanitizeHTML,
  sanitizeMarkdown,
  sanitizeUserContent,
  containsDangerousContent,
  validateAndSanitize,
  configureDOMPurify,
} from '../../lib/security/sanitize';

beforeAll(() => {
  configureDOMPurify();
});

describe('HTML Sanitization - XSS Protection', () => {
  describe('sanitizeHTML', () => {
    it('should remove script tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('<p>Hello</p>');
    });

    it('should remove event handlers', () => {
      const dirty = '<div onclick="alert(\'XSS\')">Click me</div>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).not.toContain('onclick');
      expect(clean).toContain('Click me');
    });

    it('should allow safe HTML', () => {
      const dirty = '<p>Hello <strong>world</strong></p>';
      const clean = sanitizeHTML(dirty);
      
      expect(clean).toBe(dirty);
    });
  });

  describe('XSS Attack Vectors', () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror="alert(\'XSS\')">',
      '<a href="javascript:alert(\'XSS\')">Click</a>',
    ];

    xssPayloads.forEach((payload, index) => {
      it(`should block XSS attack #${index + 1}`, () => {
        const clean = sanitizeHTML(payload);
        
        expect(clean.toLowerCase()).not.toContain('javascript:');
        expect(clean.toLowerCase()).not.toContain('<script');
        expect(clean.toLowerCase()).not.toContain('onerror');
      });
    });
  });

  describe('containsDangerousContent', () => {
    it('should detect dangerous content', () => {
      expect(containsDangerousContent('<script>alert("XSS")</script>')).toBe(true);
    });

    it('should not flag safe content', () => {
      expect(containsDangerousContent('<p>Hello world</p>')).toBe(false);
    });
  });
});
