/**
 * HTML Sanitization Utilities
 * 
 * @fileoverview
 * Production-grade HTML sanitization using DOMPurify to prevent XSS attacks.
 * All user-generated content and external HTML must be sanitized before rendering.
 * 
 * ## Security Features:
 * - Strips malicious scripts and event handlers
 * - Blocks javascript: URLs and data: URLs
 * - Removes dangerous attributes (onerror, onclick, etc.)
 * - Allows safe HTML tags for content rendering
 * - Configurable sanitization profiles
 * 
 * ## Usage:
 * ```typescript
 * import { sanitizeHTML, useSanitizedHTML } from '@/lib/security/sanitize';
 * 
 * // In a component
 * const SafeContent = () => {
 *   const cleanHTML = useSanitizedHTML(userContent);
 *   return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
 * };
 * 
 * // Direct sanitization
 * const clean = sanitizeHTML(dirtyHTML);
 * ```
 * 
 * @module lib/security/sanitize
 * @since 2026-02-01
 */

import DOMPurify from 'dompurify';
import { useMemo } from 'react';

/**
 * Sanitization profile types
 */
export type SanitizationProfile = 'strict' | 'moderate' | 'relaxed' | 'markdown';

/**
 * Configuration for different sanitization profiles
 */
const SANITIZATION_PROFILES = {
  /**
   * Strict: Maximum security, minimal HTML
   * Use for: User comments, forum posts, untrusted input
   */
  strict: {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span'],
    ALLOWED_ATTR: ['class'],
    ALLOW_DATA_ATTR: false,
  },

  /**
   * Moderate: Balanced security and formatting
   * Use for: Blog posts, articles, user bios
   */
  moderate: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
    ],
    ALLOWED_ATTR: ['class', 'id', 'href', 'src', 'alt', 'title', 'rel', 'target'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  },

  /**
   * Relaxed: More formatting options
   * Use for: CMS content, admin-created content
   */
  relaxed: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'sub', 'sup', 'small',
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'href', 'src', 'alt', 'title', 'rel', 'target',
      'width', 'height', 'style', 'align', 'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  },

  /**
   * Markdown: Optimized for markdown-generated HTML
   * Use for: Markdown content, documentation
   */
  markdown: {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr',
    ],
    ALLOWED_ATTR: ['class', 'id', 'href', 'src', 'alt', 'title', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  },
} as const;

/**
 * Default DOMPurify configuration
 * Applied to all sanitization operations
 */
const DEFAULT_CONFIG = {
  // Forbid tags
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
  
  // Forbid attributes
  FORBID_ATTR: [
    'onerror', 'onclick', 'onload', 'onmouseover', 'onmouseout', 'onmouseenter', 'onmouseleave',
    'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup', 'onkeypress',
  ],
  
  // Keep HTML comments?
  KEEP_CONTENT: true,
  
  // Return a DOM fragment instead of a string
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  
  // Safe for jQuery?
  SAFE_FOR_JQUERY: true,
  
  // Safe for templates?
  SAFE_FOR_TEMPLATES: true,
  
  // Whole document or fragment?
  WHOLE_DOCUMENT: false,
  
  // Force body?
  FORCE_BODY: false,
  
  // Sanitize DOM?
  SANITIZE_DOM: true,
};

/**
 * Sanitize HTML string with DOMPurify
 * 
 * @param dirty - The HTML string to sanitize
 * @param profile - Sanitization profile to use (default: 'moderate')
 * @param customConfig - Custom DOMPurify configuration to merge
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```typescript
 * const clean = sanitizeHTML('<p>Safe</p><script>alert("XSS")</script>');
 * // Returns: '<p>Safe</p>'
 * 
 * const strictClean = sanitizeHTML(userInput, 'strict');
 * const markdownClean = sanitizeHTML(markdownHTML, 'markdown');
 * ```
 */
export function sanitizeHTML(
  dirty: string,
  profile: SanitizationProfile = 'moderate',
  customConfig?: DOMPurify.Config
): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  // Merge configurations
  const profileConfig = SANITIZATION_PROFILES[profile];
  const config = {
    ...DEFAULT_CONFIG,
    ...profileConfig,
    ...customConfig,
  };

  // Sanitize and return
  const clean = DOMPurify.sanitize(dirty, config);
  
  // Log sanitization in development
  if (process.env.NODE_ENV === 'development' && clean !== dirty) {
    console.warn('[Security] HTML was sanitized:', {
      profile,
      original: dirty.substring(0, 100) + '...',
      cleaned: clean.substring(0, 100) + '...',
    });
  }

  return clean;
}

/**
 * React hook for sanitizing HTML
 * Memoizes the result to avoid unnecessary sanitization
 * 
 * @param dirty - The HTML string to sanitize
 * @param profile - Sanitization profile to use (default: 'moderate')
 * @param customConfig - Custom DOMPurify configuration
 * @returns Sanitized HTML string
 * 
 * @example
 * ```typescript
 * function ArticleContent({ content }: { content: string }) {
 *   const cleanContent = useSanitizedHTML(content, 'markdown');
 *   
 *   return (
 *     <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
 *   );
 * }
 * ```
 */
export function useSanitizedHTML(
  dirty: string,
  profile: SanitizationProfile = 'moderate',
  customConfig?: DOMPurify.Config
): string {
  return useMemo(
    () => sanitizeHTML(dirty, profile, customConfig),
    [dirty, profile, customConfig]
  );
}

/**
 * Sanitize HTML for markdown content
 * Convenience function for markdown-generated HTML
 * 
 * @param markdownHTML - HTML generated from markdown
 * @returns Sanitized HTML safe for rendering
 * 
 * @example
 * ```typescript
 * const html = marked.parse(markdown);
 * const clean = sanitizeMarkdown(html);
 * ```
 */
export function sanitizeMarkdown(markdownHTML: string): string {
  return sanitizeHTML(markdownHTML, 'markdown');
}

/**
 * Sanitize user-generated content with strict rules
 * Use for untrusted user input
 * 
 * @param userContent - User-generated HTML content
 * @returns Sanitized HTML with strict filtering
 * 
 * @example
 * ```typescript
 * const cleanComment = sanitizeUserContent(userComment);
 * ```
 */
export function sanitizeUserContent(userContent: string): string {
  return sanitizeHTML(userContent, 'strict');
}

/**
 * Check if HTML contains potentially dangerous content
 * Returns true if sanitization would modify the content
 * 
 * @param html - HTML string to check
 * @returns True if HTML contains dangerous content
 * 
 * @example
 * ```typescript
 * if (containsDangerousContent(userInput)) {
 *   console.warn('User tried to inject malicious content');
 * }
 * ```
 */
export function containsDangerousContent(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return false;
  }

  const sanitized = sanitizeHTML(html, 'strict');
  return sanitized !== html;
}

/**
 * Validate and sanitize HTML in one step
 * Returns an object with sanitized HTML and validation result
 * 
 * @param html - HTML string to validate and sanitize
 * @param profile - Sanitization profile
 * @returns Object with sanitized HTML and validation status
 * 
 * @example
 * ```typescript
 * const { clean, isValid, modified } = validateAndSanitize(userHTML);
 * if (!isValid) {
 *   showWarning('Your content contained potentially dangerous HTML');
 * }
 * ```
 */
export function validateAndSanitize(
  html: string,
  profile: SanitizationProfile = 'moderate'
): {
  clean: string;
  isValid: boolean;
  modified: boolean;
} {
  const clean = sanitizeHTML(html, profile);
  const modified = clean !== html;
  const isValid = !modified;

  return {
    clean,
    isValid,
    modified,
  };
}

/**
 * Add custom sanitization hook to DOMPurify
 * Allows adding custom logic during sanitization
 * 
 * @param hook - Hook name
 * @param callback - Hook callback function
 * 
 * @example
 * ```typescript
 * addSanitizationHook('afterSanitizeAttributes', (node) => {
 *   // Add rel="noopener noreferrer" to all external links
 *   if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
 *     node.setAttribute('rel', 'noopener noreferrer');
 *   }
 * });
 * ```
 */
export function addSanitizationHook(
  hook: DOMPurify.HookName,
  callback: DOMPurify.HookCallback
): void {
  DOMPurify.addHook(hook, callback);
}

/**
 * Remove all hooks of a specific type
 * 
 * @param hook - Hook name to remove
 */
export function removeSanitizationHook(hook: DOMPurify.HookName): void {
  DOMPurify.removeHooks(hook);
}

/**
 * Configure DOMPurify with security-enhancing hooks
 * Call this once during app initialization
 */
export function configureDOMPurify(): void {
  // Add rel="noopener noreferrer" to external links
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      const target = node.getAttribute('target');
      
      // External link detection
      if (href && (href.startsWith('http') || href.startsWith('//')) && target === '_blank') {
        node.setAttribute('rel', 'noopener noreferrer');
      }
      
      // Prevent javascript: URLs
      if (href && href.toLowerCase().startsWith('javascript:')) {
        node.removeAttribute('href');
      }
    }
    
    // Remove javascript: from image src
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src');
      if (src && src.toLowerCase().startsWith('javascript:')) {
        node.removeAttribute('src');
      }
    }
  });

  console.log('[Security] DOMPurify configured with enhanced security hooks');
}

// Type exports
export type { DOMPurify };
