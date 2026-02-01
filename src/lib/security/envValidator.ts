/**
 * Environment Variable Validation
 * 
 * @fileoverview
 * Validates and sanitizes environment variables at application startup.
 * Ensures all required configuration is present and properly formatted.
 * 
 * ## Features:
 * - Type validation for environment variables
 * - Required variable checking
 * - Format validation (URLs, numbers, etc.)
 * - Secure defaults
 * - Development/Production checks
 * 
 * ## Usage:
 * 
 * ```typescript
 * import { validateEnvironment } from '@/lib/security/envValidator';
 * 
 * // At app startup
 * const env = validateEnvironment();
 * ```
 * 
 * @module lib/security/envValidator
 * @since 2026-02-01
 */

/**
 * Environment variable schema
 */
interface EnvironmentSchema {
  // Supabase Configuration
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
  
  // Rate Limiting
  VITE_RATE_LIMIT_LOGIN_MAX?: string;
  VITE_RATE_LIMIT_LOGIN_WINDOW_MS?: string;
  VITE_RATE_LIMIT_LOGIN_BLOCK_MS?: string;
  VITE_RATE_LIMIT_SIGNUP_MAX?: string;
  VITE_RATE_LIMIT_SIGNUP_WINDOW_MS?: string;
  VITE_RATE_LIMIT_SIGNUP_BLOCK_MS?: string;
  
  // Security
  VITE_CSP_REPORT_URI?: string;
  VITE_ENABLE_HTTPS?: string;
  
  // Feature Flags
  VITE_ENABLE_ANALYTICS?: string;
  VITE_ENABLE_ERROR_REPORTING?: string;
}

/**
 * Validation result
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  sanitized: Record<string, any>;
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate number format
 */
function isValidNumber(value: string): boolean {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 0;
}

/**
 * Validate boolean format
 */
function isValidBoolean(value: string): boolean {
  return value === 'true' || value === 'false';
}

/**
 * Sanitize string value
 */
function sanitizeString(value: string): string {
  // Remove any potential script injections
  return value
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const sanitized: Record<string, any> = {};
  
  const env = import.meta.env as EnvironmentSchema;
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  
  // Validate Supabase Configuration
  if (env.VITE_SUPABASE_URL) {
    if (!isValidUrl(env.VITE_SUPABASE_URL)) {
      errors.push('VITE_SUPABASE_URL must be a valid URL');
    } else {
      sanitized.supabaseUrl = sanitizeString(env.VITE_SUPABASE_URL);
    }
  } else {
    warnings.push('VITE_SUPABASE_URL not configured - app will run in demo mode');
  }
  
  if (env.VITE_SUPABASE_ANON_KEY) {
    if (env.VITE_SUPABASE_ANON_KEY.length < 20) {
      errors.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
    } else {
      sanitized.supabaseAnonKey = sanitizeString(env.VITE_SUPABASE_ANON_KEY);
    }
  } else {
    warnings.push('VITE_SUPABASE_ANON_KEY not configured - authentication will not work');
  }
  
  // Validate Rate Limiting Configuration
  const rateLimitVars = [
    'VITE_RATE_LIMIT_LOGIN_MAX',
    'VITE_RATE_LIMIT_LOGIN_WINDOW_MS',
    'VITE_RATE_LIMIT_LOGIN_BLOCK_MS',
    'VITE_RATE_LIMIT_SIGNUP_MAX',
    'VITE_RATE_LIMIT_SIGNUP_WINDOW_MS',
    'VITE_RATE_LIMIT_SIGNUP_BLOCK_MS',
  ];
  
  rateLimitVars.forEach(varName => {
    const value = env[varName as keyof EnvironmentSchema];
    if (value && !isValidNumber(value)) {
      errors.push(`${varName} must be a valid number`);
    }
  });
  
  // Validate CSP Report URI
  if (env.VITE_CSP_REPORT_URI) {
    if (!isValidUrl(env.VITE_CSP_REPORT_URI)) {
      errors.push('VITE_CSP_REPORT_URI must be a valid URL');
    } else {
      sanitized.cspReportUri = sanitizeString(env.VITE_CSP_REPORT_URI);
    }
  }
  
  // Validate HTTPS flag
  if (env.VITE_ENABLE_HTTPS) {
    if (!isValidBoolean(env.VITE_ENABLE_HTTPS)) {
      errors.push('VITE_ENABLE_HTTPS must be "true" or "false"');
    } else {
      sanitized.enableHttps = env.VITE_ENABLE_HTTPS === 'true';
    }
  }
  
  // Production-specific checks
  if (isProduction) {
    if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
      errors.push('Supabase configuration is required in production');
    }
    
    if (env.VITE_ENABLE_HTTPS !== 'true') {
      warnings.push('HTTPS should be enabled in production');
    }
  }
  
  // Development-specific warnings
  if (isDevelopment) {
    if (!env.VITE_SUPABASE_URL) {
      warnings.push('Running in demo mode - connect Supabase for full functionality');
    }
  }
  
  // Check for exposed secrets (basic check)
  Object.entries(env).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Check if looks like a secret but is in a public location
      if (key.toLowerCase().includes('secret') || key.toLowerCase().includes('private')) {
        warnings.push(`Potential secret detected in environment variable: ${key}`);
      }
      
      // Check for hardcoded credentials patterns
      if (value.match(/password|secret|key/i) && value.length < 50) {
        warnings.push(`Suspicious value in ${key} - ensure it's not a hardcoded credential`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitized,
  };
}

/**
 * Log validation results
 */
export function logValidationResults(result: ValidationResult): void {
  if (!result.valid) {
    console.error('❌ Environment validation failed:');
    result.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ Environment validation warnings:');
    result.warnings.forEach(warning => {
      console.warn(`  - ${warning}`);
    });
  }
  
  if (result.valid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed');
  }
}

/**
 * Initialize and validate environment
 * Throws error if validation fails
 */
export function initializeEnvironment(): void {
  const result = validateEnvironment();
  logValidationResults(result);
  
  if (!result.valid) {
    throw new Error(
      'Environment validation failed. Please check your .env configuration.\n' +
      result.errors.join('\n')
    );
  }
}

/**
 * Get sanitized environment value
 */
export function getEnvValue(key: string, defaultValue?: string): string | undefined {
  const result = validateEnvironment();
  return result.sanitized[key] || defaultValue;
}

/**
 * Check if running in secure context
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if HTTPS or localhost
  return (
    window.isSecureContext ||
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

/**
 * Validate secure context requirements
 */
export function validateSecureContext(): void {
  if (!isSecureContext() && import.meta.env.PROD) {
    console.error(
      '❌ Application must be served over HTTPS in production.\n' +
      'Some security features (like Web Crypto API) require a secure context.'
    );
  }
}
