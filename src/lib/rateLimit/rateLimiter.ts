/**
 * Rate Limiter
 * 
 * Client-side rate limiting for brute force protection
 * Tracks requests by endpoint and IP/user, implements exponential backoff
 * 
 * Configuration:
 * - Limits configurable via environment variables
 * - Stores attempt history in localStorage (persists across sessions)
 * - Automatic cleanup of old entries
 */

import { logger } from '../security/secureLogger';

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // time window in milliseconds
  blockDurationMs: number; // how long to block after max attempts
  useExponentialBackoff: boolean;
}

export interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
  blockedUntil?: number;
  failures: number; // consecutive failures for exponential backoff
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime?: number;
  retryAfter?: number; // seconds until can retry
  message?: string;
}

// =====================================================
// CONFIGURATION
// =====================================================

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Authentication endpoints - strict limits
  login: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_LOGIN_MAX || '5'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_LOGIN_WINDOW_MS || '900000'), // 15 minutes
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_LOGIN_BLOCK_MS || '900000'), // 15 minutes
    useExponentialBackoff: true,
  },
  signup: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_SIGNUP_MAX || '3'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_SIGNUP_WINDOW_MS || '3600000'), // 1 hour
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_SIGNUP_BLOCK_MS || '3600000'), // 1 hour
    useExponentialBackoff: true,
  },
  passwordReset: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_PASSWORD_RESET_MAX || '3'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_PASSWORD_RESET_WINDOW_MS || '3600000'), // 1 hour
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_PASSWORD_RESET_BLOCK_MS || '3600000'), // 1 hour
    useExponentialBackoff: false,
  },
  otpVerify: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_OTP_MAX || '5'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_OTP_WINDOW_MS || '600000'), // 10 minutes
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_OTP_BLOCK_MS || '1800000'), // 30 minutes
    useExponentialBackoff: true,
  },
  
  // Mutation endpoints - moderate limits
  createProject: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_CREATE_MAX || '10'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_CREATE_WINDOW_MS || '60000'), // 1 minute
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_CREATE_BLOCK_MS || '300000'), // 5 minutes
    useExponentialBackoff: false,
  },
  updateProject: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_UPDATE_MAX || '20'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_UPDATE_WINDOW_MS || '60000'), // 1 minute
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_UPDATE_BLOCK_MS || '180000'), // 3 minutes
    useExponentialBackoff: false,
  },
  deleteProject: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_DELETE_MAX || '5'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_DELETE_WINDOW_MS || '60000'), // 1 minute
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_DELETE_BLOCK_MS || '300000'), // 5 minutes
    useExponentialBackoff: false,
  },
  
  // Application mutations
  createApplication: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_APPLICATION_MAX || '5'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_APPLICATION_WINDOW_MS || '300000'), // 5 minutes
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_APPLICATION_BLOCK_MS || '600000'), // 10 minutes
    useExponentialBackoff: false,
  },
  
  // Payment mutations - very strict
  createPayment: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_PAYMENT_MAX || '3'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_PAYMENT_WINDOW_MS || '300000'), // 5 minutes
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_PAYMENT_BLOCK_MS || '1800000'), // 30 minutes
    useExponentialBackoff: true,
  },
  
  // Admin operations
  adminVetting: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_MAX || '30'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_WINDOW_MS || '60000'), // 1 minute
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_BLOCK_MS || '300000'), // 5 minutes
    useExponentialBackoff: false,
  },
  adminBulk: {
    maxAttempts: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_BULK_MAX || '5'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_BULK_WINDOW_MS || '300000'), // 5 minutes
    blockDurationMs: parseInt(import.meta.env.VITE_RATE_LIMIT_ADMIN_BULK_BLOCK_MS || '600000'), // 10 minutes
    useExponentialBackoff: false,
  },
};

// =====================================================
// STORAGE MANAGEMENT
// =====================================================

const STORAGE_KEY_PREFIX = 'rate_limit_';
const CLEANUP_INTERVAL_MS = 3600000; // 1 hour

/**
 * Get rate limit entry from storage
 */
function getEntry(key: string): RateLimitEntry | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!stored) return null;
    
    const entry = JSON.parse(stored) as RateLimitEntry;
    
    // Check if entry is expired
    const now = Date.now();
    if (entry.blockedUntil && entry.blockedUntil < now) {
      // Block expired, reset entry
      localStorage.removeItem(STORAGE_KEY_PREFIX + key);
      return null;
    }
    
    return entry;
  } catch (error) {
    logger.error('Error reading rate limit entry', { error, key });
    return null;
  }
}

/**
 * Save rate limit entry to storage
 */
function saveEntry(key: string, entry: RateLimitEntry): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(entry));
  } catch (error) {
    logger.error('Error saving rate limit entry', { error, key });
  }
}

/**
 * Clean up old entries from storage
 */
function cleanupOldEntries(): void {
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(STORAGE_KEY_PREFIX)) continue;
      
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      
      const entry = JSON.parse(stored) as RateLimitEntry;
      
      // Remove if not blocked and last attempt was more than 24 hours ago
      if (!entry.blockedUntil && (now - entry.lastAttemptTime > 86400000)) {
        localStorage.removeItem(key);
      }
      // Remove if block has expired
      else if (entry.blockedUntil && entry.blockedUntil < now) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    logger.error('Error cleaning up rate limit entries', { error });
  }
}

// Run cleanup periodically
if (typeof window !== 'undefined') {
  setInterval(cleanupOldEntries, CLEANUP_INTERVAL_MS);
  
  // Run cleanup on page load
  setTimeout(cleanupOldEntries, 5000);
}

// =====================================================
// RATE LIMITING LOGIC
// =====================================================

/**
 * Calculate exponential backoff duration
 */
function calculateBackoffDuration(failures: number, baseBlockDuration: number): number {
  // Exponential backoff: base * 2^(failures-1)
  // Max backoff of 24 hours
  const backoff = Math.min(
    baseBlockDuration * Math.pow(2, failures - 1),
    86400000 // 24 hours max
  );
  return backoff;
}

/**
 * Check if an action is allowed under rate limits
 */
export function checkRateLimit(
  endpoint: string,
  identifier: string = 'anonymous'
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[endpoint];
  if (!config) {
    // No rate limit configured for this endpoint
    return { allowed: true, remainingAttempts: Infinity };
  }
  
  const key = `${endpoint}_${identifier}`;
  const entry = getEntry(key);
  const now = Date.now();
  
  // Check if currently blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: entry.blockedUntil,
      retryAfter,
      message: `Too many attempts. Please try again in ${formatRetryTime(retryAfter)}.`,
    };
  }
  
  // No previous attempts or window has expired
  if (!entry || (now - entry.firstAttemptTime) > config.windowMs) {
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }
  
  // Within rate limit window
  if (entry.attempts < config.maxAttempts) {
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - entry.attempts - 1,
      resetTime: entry.firstAttemptTime + config.windowMs,
    };
  }
  
  // Rate limit exceeded
  return {
    allowed: false,
    remainingAttempts: 0,
    resetTime: entry.firstAttemptTime + config.windowMs,
    retryAfter: Math.ceil((entry.firstAttemptTime + config.windowMs - now) / 1000),
    message: `Too many attempts. Please try again later.`,
  };
}

/**
 * Record an attempt (success or failure)
 */
export function recordAttempt(
  endpoint: string,
  identifier: string = 'anonymous',
  success: boolean = true
): void {
  const config = RATE_LIMIT_CONFIGS[endpoint];
  if (!config) return;
  
  const key = `${endpoint}_${identifier}`;
  const entry = getEntry(key) || {
    attempts: 0,
    firstAttemptTime: Date.now(),
    lastAttemptTime: Date.now(),
    failures: 0,
  };
  
  const now = Date.now();
  
  // Check if window has expired
  if ((now - entry.firstAttemptTime) > config.windowMs) {
    // Reset window
    entry.attempts = 1;
    entry.firstAttemptTime = now;
    entry.lastAttemptTime = now;
    entry.failures = success ? 0 : 1;
    entry.blockedUntil = undefined;
  } else {
    // Increment attempts
    entry.attempts += 1;
    entry.lastAttemptTime = now;
    
    if (success) {
      // Reset consecutive failures on success
      entry.failures = 0;
      entry.blockedUntil = undefined;
    } else {
      // Increment consecutive failures
      entry.failures += 1;
      
      // Check if should block
      if (entry.attempts >= config.maxAttempts) {
        const blockDuration = config.useExponentialBackoff
          ? calculateBackoffDuration(entry.failures, config.blockDurationMs)
          : config.blockDurationMs;
        
        entry.blockedUntil = now + blockDuration;
        
        // Log suspicious activity
        logRateLimitViolation(endpoint, identifier, entry);
      }
    }
  }
  
  saveEntry(key, entry);
}

/**
 * Reset rate limit for an endpoint/identifier
 */
export function resetRateLimit(endpoint: string, identifier: string = 'anonymous'): void {
  const key = `${endpoint}_${identifier}`;
  localStorage.removeItem(STORAGE_KEY_PREFIX + key);
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(
  endpoint: string,
  identifier: string = 'anonymous'
): RateLimitResult {
  return checkRateLimit(endpoint, identifier);
}

// =====================================================
// LOGGING & MONITORING
// =====================================================

/**
 * Log rate limit violation for audit/monitoring
 */
function logRateLimitViolation(
  endpoint: string,
  identifier: string,
  entry: RateLimitEntry
): void {
  const logEntry = {
    type: 'RATE_LIMIT_VIOLATION',
    endpoint,
    identifier: identifier !== 'anonymous' ? identifier.substring(0, 8) + '...' : 'anonymous',
    attempts: entry.attempts,
    failures: entry.failures,
    blockedUntil: entry.blockedUntil,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };
  
  logger.warn('Rate limit violation', logEntry);
  
  // In production, send to logging service
  if (import.meta.env.PROD) {
    try {
      // Send to analytics or logging endpoint
      fetch('/api/logs/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Fail silently, don't block user experience
      });
    } catch (error) {
      // Fail silently
    }
  }
}

/**
 * Get all rate limit violations in the last 24 hours (for admin dashboard)
 */
export function getRateLimitViolations(): Array<{
  endpoint: string;
  identifier: string;
  blockedUntil?: number;
}> {
  const violations: Array<{ endpoint: string; identifier: string; blockedUntil?: number }> = [];
  
  try {
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(STORAGE_KEY_PREFIX)) continue;
      
      const stored = localStorage.getItem(key);
      if (!stored) continue;
      
      const entry = JSON.parse(stored) as RateLimitEntry;
      
      // Include if blocked or had recent failures
      if (entry.blockedUntil && entry.blockedUntil > now) {
        const parts = key.replace(STORAGE_KEY_PREFIX, '').split('_');
        violations.push({
          endpoint: parts[0],
          identifier: parts.slice(1).join('_'),
          blockedUntil: entry.blockedUntil,
        });
      }
    }
  } catch (error) {
    logger.error('Error getting rate limit violations', { error });
  }
  
  return violations;
}

// =====================================================
// UTILITIES
// =====================================================

/**
 * Format retry time in human-readable format
 */
function formatRetryTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.ceil(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
}

/**
 * Get identifier from user (email hash or user ID)
 */
export function getIdentifier(email?: string, userId?: string): string {
  if (userId) return userId;
  if (email) {
    // Simple hash for email (not cryptographic, just for grouping)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `email_${Math.abs(hash)}`;
  }
  return 'anonymous';
}

// Export configs for testing
export { RATE_LIMIT_CONFIGS };
