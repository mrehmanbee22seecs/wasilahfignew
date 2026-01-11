import { AppError, ErrorSeverity, ErrorContext } from './types';
import { supabase } from '../supabase';

export interface ErrorLog {
  id?: string;
  error_name: string;
  error_message: string;
  error_stack?: string;
  category: string;
  severity: ErrorSeverity;
  user_id?: string;
  user_role?: string;
  url?: string;
  user_agent?: string;
  context?: Record<string, any>;
  created_at?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isDevelopment = import.meta.env.DEV;
  private errorQueue: ErrorLog[] = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  async log(error: Error | AppError, context?: ErrorContext): Promise<void> {
    const errorLog = this.createErrorLog(error, context);

    // Console log in development
    if (this.isDevelopment) {
      this.consoleLog(errorLog);
    }

    // Add to queue for database logging
    this.errorQueue.push(errorLog);
    this.processQueue();
  }

  private createErrorLog(error: Error | AppError, context?: ErrorContext): ErrorLog {
    const isAppError = this.isAppError(error);
    
    return {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
      category: isAppError ? error.category : 'unknown',
      severity: isAppError ? error.severity : 'medium',
      user_id: context?.userId,
      user_role: context?.userRole,
      url: context?.url || window.location.href,
      user_agent: navigator.userAgent,
      context: {
        ...(isAppError ? error.context : {}),
        ...context,
        timestamp: new Date().toISOString(),
      },
    };
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      // Send to Supabase
      await this.sendToDatabase(errors);
    } catch (err) {
      console.error('Failed to process error queue:', err);
      // Re-queue errors that failed to send
      this.errorQueue.push(...this.errorQueue);
    } finally {
      this.isProcessing = false;
    }
  }

  private async sendToDatabase(errors: ErrorLog[]): Promise<void> {
    try {
      const { error } = await supabase.from('error_logs').insert(errors);
      
      if (error) {
        console.error('Failed to log errors to database:', error);
      }
    } catch (err) {
      console.error('Database logging error:', err);
    }
  }

  private consoleLog(errorLog: ErrorLog): void {
    const color = this.getSeverityColor(errorLog.severity);
    const icon = this.getSeverityIcon(errorLog.severity);
    
    console.groupCollapsed(
      `%c${icon} ${errorLog.error_name}: ${errorLog.error_message}`,
      `color: ${color}; font-weight: bold;`
    );
    console.log('Category:', errorLog.category);
    console.log('Severity:', errorLog.severity);
    console.log('URL:', errorLog.url);
    console.log('Context:', errorLog.context);
    if (errorLog.error_stack) {
      console.log('Stack:', errorLog.error_stack);
    }
    console.groupEnd();
  }

  private getSeverityColor(severity: ErrorSeverity): string {
    switch (severity) {
      case 'low':
        return '#3b82f6'; // blue
      case 'medium':
        return '#f59e0b'; // amber
      case 'high':
        return '#ef4444'; // red
      case 'critical':
        return '#dc2626'; // dark red
      default:
        return '#6b7280'; // gray
    }
  }

  private getSeverityIcon(severity: ErrorSeverity): string {
    switch (severity) {
      case 'low':
        return 'ℹ️';
      case 'medium':
        return '⚠️';
      case 'high':
        return '❌';
      case 'critical':
        return '🚨';
      default:
        return '❓';
    }
  }

  private isAppError(error: Error | AppError): error is AppError {
    return 'category' in error && 'severity' in error;
  }

  async logApiError(
    endpoint: string,
    method: string,
    statusCode: number,
    error: Error,
    context?: ErrorContext
  ): Promise<void> {
    await this.log(error, {
      ...context,
      action: `API ${method} ${endpoint}`,
      metadata: {
        endpoint,
        method,
        statusCode,
        ...(context?.metadata || {}),
      },
    });
  }

  async logAuthError(action: string, error: Error, context?: ErrorContext): Promise<void> {
    await this.log(error, {
      ...context,
      action: `Auth: ${action}`,
      component: 'Authentication',
    });
  }

  async logValidationError(
    formName: string,
    fields: Record<string, string>,
    error: Error,
    context?: ErrorContext
  ): Promise<void> {
    await this.log(error, {
      ...context,
      action: `Validation: ${formName}`,
      component: 'Form',
      metadata: { fields, ...(context?.metadata || {}) },
    });
  }

  async logFileError(
    fileName: string,
    fileSize: number,
    fileType: string,
    error: Error,
    context?: ErrorContext
  ): Promise<void> {
    await this.log(error, {
      ...context,
      action: 'File Upload',
      component: 'FileUpload',
      metadata: {
        fileName,
        fileSize,
        fileType,
        ...(context?.metadata || {}),
      },
    });
  }

  async getRecentErrors(limit: number = 50): Promise<ErrorLog[]> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch error logs:', err);
      return [];
    }
  }

  async getErrorStats(): Promise<{
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('severity, category')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        bySeverity: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        } as Record<ErrorSeverity, number>,
        byCategory: {} as Record<string, number>,
      };

      data?.forEach((log) => {
        stats.bySeverity[log.severity as ErrorSeverity]++;
        stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
      });

      return stats;
    } catch (err) {
      console.error('Failed to fetch error stats:', err);
      return {
        total: 0,
        bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
        byCategory: {},
      };
    }
  }
}

export const errorLogger = ErrorLogger.getInstance();
