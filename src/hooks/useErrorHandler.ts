import { useState, useCallback } from 'react';
import { errorHandler } from '../lib/errors/errorHandler';
import { AppError } from '../lib/errors/types';

export function useErrorHandler() {
  const [error, setError] = useState<Error | AppError | null>(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback(async (err: Error | AppError, showToast: boolean = true) => {
    setError(err);
    setIsError(true);
    await errorHandler.handle(err, showToast);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const resetError = useCallback(() => {
    clearError();
  }, [clearError]);

  return {
    error,
    isError,
    handleError,
    clearError,
    resetError,
  };
}

export function useAsyncError() {
  const { handleError } = useErrorHandler();

  const executeAsync = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        showToast?: boolean;
      }
    ): Promise<T | null> => {
      try {
        const result = await fn();
        options?.onSuccess?.(result);
        return result;
      } catch (error: any) {
        await handleError(error, options?.showToast ?? true);
        options?.onError?.(error);
        return null;
      }
    },
    [handleError]
  );

  return { executeAsync };
}

export function useRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const retry = useCallback(async (): Promise<T | null> => {
    setIsRetrying(true);
    setError(null);

    try {
      const result = await errorHandler.handleWithRetry(fn, maxRetries, delay);
      setRetryCount(0);
      return result;
    } catch (err: any) {
      setError(err);
      setRetryCount((prev) => prev + 1);
      await errorHandler.handle(err);
      return null;
    } finally {
      setIsRetrying(false);
    }
  }, [fn, maxRetries, delay]);

  return {
    retry,
    isRetrying,
    retryCount,
    error,
    canRetry: retryCount < maxRetries,
  };
}
