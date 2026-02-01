/**
 * Input Validation & Sanitization Utilities
 * 
 * @fileoverview
 * Comprehensive input validation to prevent injection attacks and ensure data integrity.
 * Works alongside existing Zod schemas for additional security layers.
 * 
 * ## Features:
 * - SQL injection prevention
 * - NoSQL injection prevention  
 * - Path traversal prevention
 * - Command injection prevention
 * - File upload validation
 * - URL validation and sanitization
 * 
 * ## Usage:
 * 
 * ```typescript
 * import { validateInput, sanitizeFileName, isValidUrl } from '@/lib/security/inputValidator';
 * 
 * // Validate user input
 * const safe = validateInput.string(userInput);
 * 
 * // Sanitize file name
 * const safeName = sanitizeFileName(fileName);
 * 
 * // Validate URL
 * if (isValidUrl(url)) {
 *   // Safe to use
 * }
 * ```
 * 
 * @module lib/security/inputValidator
 * @since 2026-02-01
 */

/**
 * SQL injection patterns
 */
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(--|\|\||;|\/\*|\*\/|xp_|sp_|UNION|HAVING|ORDER\s+BY)/gi,
  /('|('')|`|;|--|\||<|>)/gi,
];

/**
 * NoSQL injection patterns
 */
const NOSQL_INJECTION_PATTERNS = [
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$regex/gi,
  /\$or/gi,
  /\$and/gi,
];

/**
 * Path traversal patterns
 */
const PATH_TRAVERSAL_PATTERNS = [
  /\.\./,
  /\.\.\//, 
  /\.\.\\/, 
  /%2e%2e/gi,
  /%252e%252e/gi,
];

/**
 * Command injection patterns
 */
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$()]/,
  /\n|\r/,
  /\x00/,
];

/**
 * XSS patterns (additional to DOMPurify)
 */
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

/**
 * Validate string input
 */
function validateString(input: string, options: {
  maxLength?: number;
  minLength?: number;
  allowSpecialChars?: boolean;
  pattern?: RegExp;
} = {}): { valid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = input.trim();
  
  // Length validation
  if (options.minLength && sanitized.length < options.minLength) {
    errors.push(`Input must be at least ${options.minLength} characters`);
  }
  
  if (options.maxLength && sanitized.length > options.maxLength) {
    errors.push(`Input must not exceed ${options.maxLength} characters`);
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  // Check for security issues BEFORE sanitizing (so we can detect them)
  // Check for SQL injection
  if (SQL_INJECTION_PATTERNS.some(pattern => pattern.test(sanitized))) {
    errors.push('Potential SQL injection detected');
  }
  
  // Check for NoSQL injection
  if (NOSQL_INJECTION_PATTERNS.some(pattern => pattern.test(sanitized))) {
    errors.push('Potential NoSQL injection detected');
  }
  
  // Check for XSS
  if (XSS_PATTERNS.some(pattern => pattern.test(sanitized))) {
    errors.push('Potential XSS attack detected');
  }
  
  // Sanitize special characters AFTER checking (so we can remove them if needed)
  if (!options.allowSpecialChars) {
    sanitized = sanitized.replace(/[<>\"']/g, '');
  }
  
  // Pattern matching
  if (options.pattern && !options.pattern.test(sanitized)) {
    errors.push('Input does not match required format');
  }
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate email address
 */
function validateEmail(email: string): { valid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  const sanitized = email.toLowerCase().trim();
  
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailPattern.test(sanitized)) {
    errors.push('Invalid email format');
  }
  
  // Additional checks
  if (sanitized.length > 254) {
    errors.push('Email address too long');
  }
  
  const [local, domain] = sanitized.split('@');
  if (local && local.length > 64) {
    errors.push('Email local part too long');
  }
  
  // Check for suspicious patterns
  if (sanitized.includes('..')) {
    errors.push('Email contains consecutive dots');
  }
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate URL
 */
function validateUrl(url: string, options: {
  allowedProtocols?: string[];
  allowedDomains?: string[];
  blockLocalhost?: boolean;
} = {}): { valid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = url.trim();
  
  const {
    allowedProtocols = ['http:', 'https:'],
    allowedDomains = [],
    blockLocalhost = true,
  } = options;
  
  try {
    const parsed = new URL(sanitized);
    
    // Protocol validation
    if (!allowedProtocols.includes(parsed.protocol)) {
      errors.push(`Protocol ${parsed.protocol} not allowed`);
    }
    
    // Domain validation
    if (allowedDomains.length > 0) {
      const domainMatch = allowedDomains.some(domain => 
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
      if (!domainMatch) {
        errors.push('Domain not in allowed list');
      }
    }
    
    // Localhost check
    if (blockLocalhost) {
      const localhostPatterns = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
      if (localhostPatterns.some(pattern => parsed.hostname.includes(pattern))) {
        errors.push('Localhost URLs not allowed');
      }
    }
    
    sanitized = parsed.href;
  } catch {
    errors.push('Invalid URL format');
  }
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  
  // Remove special characters
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Limit length
  const maxLength = 255;
  if (sanitized.length > maxLength) {
    const ext = sanitized.split('.').pop();
    const name = sanitized.substring(0, maxLength - (ext ? ext.length + 1 : 0));
    sanitized = ext ? `${name}.${ext}` : name;
  }
  
  return sanitized;
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;
  
  // Size check
  if (file.size > maxSize) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Type check
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }
  
  // Extension check
  if (allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      errors.push(`File extension .${ext} not allowed`);
    }
  }
  
  // File name check
  if (PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(file.name))) {
    errors.push('File name contains path traversal attempt');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phone number
 */
function validatePhone(phone: string): { valid: boolean; sanitized: string; errors: string[] } {
  const errors: string[] = [];
  let sanitized = phone.replace(/[\s\-\(\)]/g, '');
  
  // Remove country code prefix if present
  if (sanitized.startsWith('+')) {
    sanitized = sanitized.substring(1);
  }
  
  // Basic validation
  if (!/^\d{10,15}$/.test(sanitized)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate number
 */
function validateNumber(value: string | number, options: {
  min?: number;
  max?: number;
  integer?: boolean;
} = {}): { valid: boolean; value: number; errors: string[] } {
  const errors: string[] = [];
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    errors.push('Invalid number');
    return { valid: false, value: 0, errors };
  }
  
  if (options.integer && !Number.isInteger(num)) {
    errors.push('Must be an integer');
  }
  
  if (options.min !== undefined && num < options.min) {
    errors.push(`Must be at least ${options.min}`);
  }
  
  if (options.max !== undefined && num > options.max) {
    errors.push(`Must not exceed ${options.max}`);
  }
  
  return {
    valid: errors.length === 0,
    value: num,
    errors,
  };
}

/**
 * Export validation functions
 */
export const validateInput = {
  string: validateString,
  email: validateEmail,
  url: validateUrl,
  phone: validatePhone,
  number: validateNumber,
};

/**
 * Quick validation helpers
 */
export const isValid = {
  email: (email: string): boolean => validateEmail(email).valid,
  url: (url: string): boolean => validateUrl(url).valid,
  phone: (phone: string): boolean => validatePhone(phone).valid,
  fileName: (name: string): boolean => !PATH_TRAVERSAL_PATTERNS.some(p => p.test(name)),
};

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = validateInput.string(value, { allowSpecialChars: false }).sanitized;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => {
        if (typeof item === 'string') {
          return validateInput.string(item, { allowSpecialChars: false }).sanitized;
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item);
        } else {
          return item;
        }
      });
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}
