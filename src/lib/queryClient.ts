import { QueryClient } from "@tanstack/react-query";

/**
 * Configured QueryClient instance for the application
 * 
 * Configuration:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - cacheTime: 10 minutes - Unused data is garbage collected after 10 minutes
 * - refetchOnWindowFocus: false - Prevents unnecessary refetches when user returns to tab
 * - retry: 1 - Retry failed requests once before giving up
 * - useErrorBoundary: false - Handle errors within components instead of error boundary
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
      throwOnError: false, // Use throwOnError instead of useErrorBoundary for better error handling
    },
    mutations: {
      retry: 1,
      throwOnError: false,
    },
  },
});
