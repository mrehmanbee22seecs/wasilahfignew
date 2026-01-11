import { useState, useCallback, useEffect, useRef } from 'react';
import { errorHandler } from '../lib/errors/errorHandler';

export function useSafeAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      
      if (isMountedRef.current) {
        setData(result);
      }
      
      return result;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err);
        await errorHandler.handle(err);
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    error,
    loading,
    refetch,
  };
}

export function useSafeMutation<T, P = void>(
  mutationFunction: (params: P) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFunction(params);
      
      if (isMountedRef.current) {
        setData(result);
      }
      
      return result;
    } catch (err: any) {
      if (isMountedRef.current) {
        setError(err);
        await errorHandler.handle(err);
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [mutationFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    data,
    error,
    loading,
    reset,
  };
}
