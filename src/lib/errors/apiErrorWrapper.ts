import { errorHandler } from './errorHandler';
import { ApiError, NetworkError } from './types';

export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  options?: {
    endpoint?: string;
    method?: string;
    showToast?: boolean;
    retryable?: boolean;
  }
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    const appError = errorHandler.handleApiError(
      error,
      options?.endpoint || 'unknown',
      options?.method || 'GET'
    );

    if (options?.showToast !== false) {
      await errorHandler.handle(appError, true);
    }

    throw appError;
  }
}

export async function withRetry<T>(
  apiCall: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delay?: number;
    endpoint?: string;
    method?: string;
  }
): Promise<T> {
  return errorHandler.handleWithRetry(
    () => withErrorHandling(apiCall, {
      endpoint: options?.endpoint,
      method: options?.method,
      showToast: false,
    }),
    options?.maxRetries || 3,
    options?.delay || 1000
  );
}

export function createApiErrorHandler(baseEndpoint: string) {
  return {
    async get<T>(endpoint: string): Promise<T> {
      return withErrorHandling(
        async () => {
          const response = await fetch(`${baseEndpoint}${endpoint}`);
          if (!response.ok) throw new Error(await response.text());
          return response.json();
        },
        { endpoint, method: 'GET' }
      );
    },

    async post<T>(endpoint: string, data: any): Promise<T> {
      return withErrorHandling(
        async () => {
          const response = await fetch(`${baseEndpoint}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error(await response.text());
          return response.json();
        },
        { endpoint, method: 'POST' }
      );
    },

    async put<T>(endpoint: string, data: any): Promise<T> {
      return withErrorHandling(
        async () => {
          const response = await fetch(`${baseEndpoint}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error(await response.text());
          return response.json();
        },
        { endpoint, method: 'PUT' }
      );
    },

    async delete<T>(endpoint: string): Promise<T> {
      return withErrorHandling(
        async () => {
          const response = await fetch(`${baseEndpoint}${endpoint}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error(await response.text());
          return response.json();
        },
        { endpoint, method: 'DELETE' }
      );
    },
  };
}
