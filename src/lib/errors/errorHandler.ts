import { AppError, BaseError, ApiError, NetworkError, AuthError } from './types';
import { errorLogger } from './errorLogger';
import { toast } from 'sonner';

class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      event.preventDefault();
      this.handle(event.reason);
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      event.preventDefault();
      this.handle(event.error);
    });
  }

  async handle(error: Error | AppError, showToast: boolean = true): Promise<void> {
    // Log the error
    await errorLogger.log(error);

    // Show user-friendly message
    if (showToast) {
      this.showErrorToast(error);
    }

    // Handle specific error types
    if (this.isAppError(error)) {
      this.handleAppError(error);
    }
  }

  private handleAppError(error: AppError): void {
    switch (error.category) {
      case 'auth':
        this.handleAuthError(error);
        break;
      case 'permission':
        this.handlePermissionError(error);
        break;
      case 'payment':
        this.handlePaymentError(error);
        break;
      default:
        // Default handling already done
        break;
    }
  }

  private handleAuthError(error: AppError): void {
    // Check if we need to redirect to login
    if (error.code === 'SESSION_EXPIRED' || error.code === 'UNAUTHORIZED') {
      setTimeout(() => {
        window.location.href = '/login?reason=session_expired';
      }, 2000);
    }
  }

  private handlePermissionError(error: AppError): void {
    // Could redirect to a "no permission" page
    console.warn('Permission denied:', error.userMessage);
  }

  private handlePaymentError(error: AppError): void {
    // Critical - might want to alert support
    console.error('Payment error:', error);
    // Could send to support system
  }

  private showErrorToast(error: Error | AppError): void {
    const message = this.isAppError(error) ? error.userMessage : error.message;
    const severity = this.isAppError(error) ? error.severity : 'medium';

    switch (severity) {
      case 'low':
        toast.info(message);
        break;
      case 'medium':
        toast.warning(message);
        break;
      case 'high':
      case 'critical':
        toast.error(message, {
          duration: 5000,
        });
        break;
    }
  }

  handleApiError(error: any, endpoint: string, method: string = 'GET'): AppError {
    let appError: AppError;

    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      switch (status) {
        case 400:
          appError = new BaseError(message, 'validation', 'low', {
            code: 'BAD_REQUEST',
            userMessage: 'Invalid request. Please check your input.',
          });
          break;
        case 401:
          appError = new AuthError(message, {
            code: 'UNAUTHORIZED',
            userMessage: 'Please log in to continue.',
          });
          break;
        case 403:
          appError = new BaseError(message, 'permission', 'medium', {
            code: 'FORBIDDEN',
            userMessage: 'You do not have permission to perform this action.',
          });
          break;
        case 404:
          appError = new BaseError(message, 'notfound', 'low', {
            code: 'NOT_FOUND',
            userMessage: 'The requested resource was not found.',
          });
          break;
        case 429:
          appError = new ApiError(message, status, {
            code: 'RATE_LIMIT',
            userMessage: 'Too many requests. Please try again later.',
          });
          break;
        case 500:
        case 502:
        case 503:
          appError = new ApiError(message, status, {
            code: 'SERVER_ERROR',
            userMessage: 'Server error. Please try again later.',
          });
          break;
        default:
          appError = new ApiError(message, status);
      }
    } else if (error.request) {
      // Network error
      appError = new NetworkError('Network request failed', {
        code: 'NETWORK_ERROR',
        userMessage: 'Network connection issue. Please check your internet.',
      });
    } else {
      // Unknown error
      appError = new BaseError(error.message, 'unknown', 'medium');
    }

    errorLogger.logApiError(endpoint, method, error.response?.status || 0, appError);
    return appError;
  }

  handleFormError(formName: string, error: any): AppError {
    if (error.fields) {
      // Validation error with field details
      const fieldNames = Object.keys(error.fields).join(', ');
      const validationError = new BaseError(
        `Validation failed for: ${fieldNames}`,
        'validation',
        'low',
        {
          code: 'VALIDATION_ERROR',
          userMessage: 'Please check the highlighted fields and try again.',
        }
      );

      errorLogger.logValidationError(formName, error.fields, validationError);
      return validationError;
    }

    const formError = new BaseError(error.message, 'form', 'low', {
      userMessage: 'Please check the form and try again.',
    });

    errorLogger.log(formError, { component: 'Form', action: formName });
    return formError;
  }

  handleFileError(fileName: string, fileSize: number, error: any): AppError {
    const fileError = new BaseError(error.message, 'file', 'low', {
      code: error.code || 'FILE_ERROR',
      userMessage: error.userMessage || 'File upload failed. Please try again.',
    });

    errorLogger.logFileError(fileName, fileSize, '', fileError);
    return fileError;
  }

  async handleWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry if error is not retryable
        if (this.isAppError(error) && !error.retryable) {
          throw error;
        }

        // Wait before retrying
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    throw lastError!;
  }

  private isAppError(error: any): error is AppError {
    return error && 'category' in error && 'severity' in error;
  }
}

export const errorHandler = ErrorHandler.getInstance();
