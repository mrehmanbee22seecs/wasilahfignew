export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 
  | 'auth'
  | 'api'
  | 'validation'
  | 'network'
  | 'database'
  | 'permission'
  | 'notfound'
  | 'form'
  | 'file'
  | 'payment'
  | 'unknown';

export interface ErrorContext {
  userId?: string;
  userRole?: string;
  url?: string;
  action?: string;
  component?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface AppError extends Error {
  code?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: ErrorContext;
  userMessage: string;
  technicalMessage: string;
  recoverable: boolean;
  retryable: boolean;
}

export class BaseError extends Error implements AppError {
  code?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: ErrorContext;
  userMessage: string;
  technicalMessage: string;
  recoverable: boolean;
  retryable: boolean;

  constructor(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity = 'medium',
    options?: {
      code?: string;
      context?: ErrorContext;
      userMessage?: string;
      recoverable?: boolean;
      retryable?: boolean;
    }
  ) {
    super(message);
    this.name = 'BaseError';
    this.category = category;
    this.severity = severity;
    this.code = options?.code;
    this.context = options?.context;
    this.technicalMessage = message;
    this.userMessage = options?.userMessage || this.getDefaultUserMessage();
    this.recoverable = options?.recoverable ?? true;
    this.retryable = options?.retryable ?? false;
  }

  private getDefaultUserMessage(): string {
    switch (this.category) {
      case 'auth':
        return 'Authentication failed. Please try logging in again.';
      case 'api':
        return 'We encountered an issue processing your request. Please try again.';
      case 'validation':
        return 'Please check your input and try again.';
      case 'network':
        return 'Network connection issue. Please check your internet connection.';
      case 'database':
        return 'We are experiencing technical difficulties. Please try again later.';
      case 'permission':
        return 'You do not have permission to perform this action.';
      case 'notfound':
        return 'The requested resource was not found.';
      case 'file':
        return 'File upload failed. Please try again.';
      case 'payment':
        return 'Payment processing failed. Please try again or contact support.';
      default:
        return 'Something went wrong. Please try again.';
    }
  }
}

export class AuthError extends BaseError {
  constructor(message: string, options?: { code?: string; context?: ErrorContext; userMessage?: string }) {
    super(message, 'auth', 'high', {
      ...options,
      recoverable: true,
      retryable: true,
    });
    this.name = 'AuthError';
  }
}

export class ApiError extends BaseError {
  statusCode?: number;

  constructor(
    message: string,
    statusCode?: number,
    options?: { code?: string; context?: ErrorContext; userMessage?: string }
  ) {
    super(message, 'api', 'medium', {
      ...options,
      recoverable: true,
      retryable: statusCode ? statusCode >= 500 : false,
    });
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends BaseError {
  fields?: Record<string, string>;

  constructor(
    message: string,
    fields?: Record<string, string>,
    options?: { code?: string; context?: ErrorContext }
  ) {
    super(message, 'validation', 'low', {
      ...options,
      userMessage: 'Please check the form and correct any errors.',
      recoverable: true,
      retryable: false,
    });
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class NetworkError extends BaseError {
  constructor(message: string, options?: { code?: string; context?: ErrorContext; userMessage?: string }) {
    super(message, 'network', 'medium', {
      ...options,
      recoverable: true,
      retryable: true,
    });
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, options?: { code?: string; context?: ErrorContext; userMessage?: string }) {
    super(message, 'database', 'high', {
      ...options,
      recoverable: false,
      retryable: false,
    });
    this.name = 'DatabaseError';
  }
}

export class PermissionError extends BaseError {
  requiredPermission?: string;

  constructor(
    message: string,
    requiredPermission?: string,
    options?: { code?: string; context?: ErrorContext; userMessage?: string }
  ) {
    super(message, 'permission', 'medium', {
      ...options,
      recoverable: false,
      retryable: false,
    });
    this.name = 'PermissionError';
    this.requiredPermission = requiredPermission;
  }
}

export class NotFoundError extends BaseError {
  resourceType?: string;

  constructor(
    message: string,
    resourceType?: string,
    options?: { code?: string; context?: ErrorContext; userMessage?: string }
  ) {
    super(message, 'notfound', 'low', {
      ...options,
      recoverable: false,
      retryable: false,
    });
    this.name = 'NotFoundError';
    this.resourceType = resourceType;
  }
}

export class FileError extends BaseError {
  fileType?: string;
  fileSize?: number;

  constructor(
    message: string,
    options?: {
      code?: string;
      context?: ErrorContext;
      userMessage?: string;
      fileType?: string;
      fileSize?: number;
    }
  ) {
    super(message, 'file', 'low', {
      code: options?.code,
      context: options?.context,
      userMessage: options?.userMessage,
      recoverable: true,
      retryable: true,
    });
    this.name = 'FileError';
    this.fileType = options?.fileType;
    this.fileSize = options?.fileSize;
  }
}

export class PaymentError extends BaseError {
  transactionId?: string;

  constructor(
    message: string,
    transactionId?: string,
    options?: { code?: string; context?: ErrorContext; userMessage?: string }
  ) {
    super(message, 'payment', 'critical', {
      ...options,
      recoverable: false,
      retryable: false,
    });
    this.name = 'PaymentError';
    this.transactionId = transactionId;
  }
}
