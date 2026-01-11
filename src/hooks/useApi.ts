import { useState, useCallback } from 'react';
import { ApiResponse } from '../lib/api/base';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T, TArgs extends any[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApi<T, TArgs extends any[] = []>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<T>>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<ApiResponse<T>> => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(...args);

        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: response.error || 'An error occurred' });
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        return { success: false, error: errorMessage };
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiMutation<T, TArgs extends any[]>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<ApiResponse<T>> => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(...args);

        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
          options?.onSuccess?.(response.data);
        } else {
          const errorMessage = response.error || 'An error occurred';
          setState({ data: null, loading: false, error: errorMessage });
          options?.onError?.(errorMessage);
        }

        return response;
      } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        options?.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
