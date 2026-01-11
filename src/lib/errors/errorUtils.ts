import { errorHandler } from '../lib/errors/errorHandler';
import { ValidationError } from '../lib/errors/types';

// Utility to handle form submission errors
export async function handleFormSubmit<T>(
  formName: string,
  submitFn: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: any }> {
  try {
    const data = await submitFn();
    return { success: true, data };
  } catch (error: any) {
    const formError = errorHandler.handleFormError(formName, error);
    return { success: false, error: formError };
  }
}

// Utility to handle file uploads
export async function handleFileUpload(
  fileName: string,
  fileSize: number,
  uploadFn: () => Promise<string>
): Promise<{ success: boolean; url?: string; error?: any }> {
  try {
    const url = await uploadFn();
    return { success: true, url };
  } catch (error: any) {
    const fileError = errorHandler.handleFileError(fileName, fileSize, error);
    return { success: false, error: fileError };
  }
}

// Utility to validate input before submission
export function validateBeforeSubmit<T>(
  data: T,
  validationFn: (data: T) => { valid: boolean; errors?: Record<string, string> }
): { valid: boolean; error?: ValidationError } {
  const result = validationFn(data);
  
  if (!result.valid && result.errors) {
    const error = new ValidationError('Validation failed', result.errors);
    return { valid: false, error };
  }
  
  return { valid: true };
}

// Utility to check if error is recoverable
export function isRecoverable(error: any): boolean {
  return error && typeof error === 'object' && 'recoverable' in error && error.recoverable;
}

// Utility to check if error is retryable
export function isRetryable(error: any): boolean {
  return error && typeof error === 'object' && 'retryable' in error && error.retryable;
}

// Utility to get user-friendly message from any error
export function getUserMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error.userMessage) return error.userMessage;
  
  if (error.message) return error.message;
  
  return 'An unexpected error occurred';
}

// Utility to extract error code
export function getErrorCode(error: any): string | undefined {
  return error?.code;
}

// Utility to extract error category
export function getErrorCategory(error: any): string {
  return error?.category || 'unknown';
}

// Utility to extract error severity
export function getErrorSeverity(error: any): string {
  return error?.severity || 'medium';
}
