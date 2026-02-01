/**
 * Secure Logger
 * 
 * @fileoverview
 * Production-safe logging utility that prevents sensitive data leakage.
 * Automatically redacts sensitive information and provides different log levels.
 * 
 * ## Features:
 * - Automatic sensitive data redaction
 * - Environment-aware logging (verbose in dev, minimal in prod)
 * - Structured logging
 * - Performance tracking
 * - Error context capture
 * 
 * ## Usage:
 * 
 * ```typescript
 * import { logger } from '@/lib/security/secureLogger';
 * 
 * logger.info('User logged in', { userId: '123' });
 * logger.error('Login failed', error, { email: 'user@example.com' });
 * logger.warn('Rate limit approaching', { endpoint: '/api/login' });
 * ```
 * 
 * @module lib/security/secureLogger
 * @since 2026-02-01
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

/**
 * Log entry structure
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  error?: Error;
  stack?: string;
}

/**
 * Sensitive data patterns to redact
 */
const SENSITIVE_PATTERNS = [
  // Credentials
  /password/i,
  /passwd/i,
  /pwd/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /access[_-]?key/i,
  /private[_-]?key/i,
  
  // Personal Information
  /ssn/i,
  /social[_-]?security/i,
  /credit[_-]?card/i,
  /card[_-]?number/i,
  /cvv/i,
  /pin/i,
  
  // Authentication
  /auth[_-]?token/i,
  /session[_-]?id/i,
  /bearer/i,
  /jwt/i,
];

/**
 * Sensitive value patterns (e.g., email, phone)
 */
const VALUE_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]{10,}$/,
  creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
};

/**
 * Redact sensitive data
 */
function redactSensitiveData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'string') {
    // Check if string matches sensitive value patterns
    if (VALUE_PATTERNS.email.test(data)) {
      const [local, domain] = data.split('@');
      return `${local.charAt(0)}***@${domain}`;
    }
    
    if (VALUE_PATTERNS.phone.test(data)) {
      return '***-***-' + data.slice(-4);
    }
    
    if (VALUE_PATTERNS.creditCard.test(data)) {
      return '****-****-****-' + data.replace(/[\s-]/g, '').slice(-4);
    }
    
    if (VALUE_PATTERNS.ssn.test(data)) {
      return '***-**-' + data.slice(-4);
    }
    
    // Redact long strings that might be tokens
    if (data.length > 50 && /^[A-Za-z0-9+/=_-]+$/.test(data)) {
      return data.substring(0, 10) + '...[REDACTED]';
    }
    
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }
  
  if (typeof data === 'object') {
    const redacted: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Check if key is sensitive
      const isSensitiveKey = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
      
      if (isSensitiveKey) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitiveData(value);
      }
    }
    
    return redacted;
  }
  
  return data;
}

/**
 * Format log message
 */
function formatLogMessage(entry: LogEntry): string {
  const levelName = LogLevel[entry.level];
  const timestamp = new Date(entry.timestamp).toISOString();
  const prefix = `[${timestamp}] [${levelName}]`;
  
  let message = `${prefix} ${entry.message}`;
  
  if (entry.context) {
    const redactedContext = redactSensitiveData(entry.context);
    message += ` | Context: ${JSON.stringify(redactedContext)}`;
  }
  
  if (entry.error) {
    message += ` | Error: ${entry.error.message}`;
    if (entry.stack) {
      message += `\n${entry.stack}`;
    }
  }
  
  return message;
}

/**
 * Logger class
 */
class SecureLogger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;
  
  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }
  
  /**
   * Set minimum log level
   */
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }
  
  /**
   * Log a message
   */
  private log(level: LogLevel, message: string, error?: Error, context?: Record<string, any>): void {
    if (level < this.minLevel) {
      return;
    }
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: context ? redactSensitiveData(context) : undefined,
      error,
      stack: error?.stack,
    };
    
    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
    
    // Output to console
    const formattedMessage = formatLogMessage(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage);
        break;
    }
    
    // In production, send critical errors to monitoring service
    if (level >= LogLevel.CRITICAL && !this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }
  
  /**
   * Debug log (development only)
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, undefined, context);
  }
  
  /**
   * Info log
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, undefined, context);
  }
  
  /**
   * Warning log
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, undefined, context);
  }
  
  /**
   * Error log
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, error, context);
  }
  
  /**
   * Critical error log
   */
  critical(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, message, error, context);
  }
  
  /**
   * Performance tracking
   */
  time(label: string): void {
    console.time(label);
  }
  
  timeEnd(label: string): void {
    console.timeEnd(label);
  }
  
  /**
   * Get log buffer (for debugging)
   */
  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }
  
  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = [];
  }
  
  /**
   * Send to monitoring service (implement based on your service)
   */
  private sendToMonitoring(entry: LogEntry): void {
    // TODO: Implement integration with your monitoring service
    // Examples: Sentry, LogRocket, Datadog, etc.
    
    if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
      // Example: Sentry integration
      // Sentry.captureException(entry.error, {
      //   level: 'error',
      //   extra: entry.context,
      // });
    }
  }
}

/**
 * Export singleton instance
 */
export const logger = new SecureLogger();

/**
 * Development-only logging helper
 */
export function devLog(message: string, ...args: any[]): void {
  if (import.meta.env.DEV) {
    logger.debug(message, { args: redactSensitiveData(args) });
  }
}

/**
 * Production-safe console.log replacement
 */
export function safeLog(message: string, data?: any): void {
  logger.info(message, data ? { data: redactSensitiveData(data) } : undefined);
}

/**
 * Security event logger
 */
export const securityLogger = {
  /**
   * Log authentication event
   */
  authEvent(event: string, userId?: string, success: boolean = true): void {
    logger.info(`Auth: ${event}`, {
      event,
      userId: userId ? `user-${userId.substring(0, 8)}***` : undefined,
      success,
      timestamp: Date.now(),
    });
  },
  
  /**
   * Log security violation
   */
  securityViolation(type: string, details?: Record<string, any>): void {
    logger.warn(`Security Violation: ${type}`, {
      type,
      ...redactSensitiveData(details),
      timestamp: Date.now(),
    });
  },
  
  /**
   * Log rate limit hit
   */
  rateLimitHit(endpoint: string, identifier: string): void {
    logger.warn(`Rate Limit Exceeded`, {
      endpoint,
      identifier: identifier.substring(0, 10) + '***',
      timestamp: Date.now(),
    });
  },
  
  /**
   * Log suspicious activity
   */
  suspiciousActivity(activity: string, details?: Record<string, any>): void {
    logger.error(`Suspicious Activity: ${activity}`, undefined, {
      activity,
      ...redactSensitiveData(details),
      timestamp: Date.now(),
    });
  },
};
