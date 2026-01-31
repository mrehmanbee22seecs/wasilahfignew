/**
 * React Query Test Utilities
 * 
 * Helper functions and wrappers for testing React Query hooks.
 * Provides a clean QueryClient for each test to avoid cache pollution.
 * 
 * @module test/queryUtils
 */

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render } from '@testing-library/react';

/**
 * Creates a new QueryClient configured for testing
 * 
 * - Disables retries for faster test execution
 * - Disables logging to reduce noise
 * - Sets short cache times to avoid interference between tests
 * 
 * @returns A fresh QueryClient instance
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0, // Disable retries in tests
        gcTime: 0, // Clear cache immediately after test
        staleTime: 0, // Data is always stale in tests
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 0, // Disable retries for mutations
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });
}

/**
 * Test wrapper that provides React Query context
 * 
 * @param queryClient - Optional QueryClient instance (creates new one if not provided)
 * @returns Wrapper component
 */
export function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient || createTestQueryClient();
  
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    );
  };
}

/**
 * Custom render function that wraps components with React Query provider
 * 
 * @param ui - Component to render
 * @param options - Render options
 * @returns Render result with queryClient
 * 
 * @example
 * ```tsx
 * const { result, queryClient } = renderWithQuery(<MyComponent />);
 * ```
 */
export function renderWithQuery(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const { queryClient, ...renderOptions } = options || {};
  const testQueryClient = queryClient || createTestQueryClient();
  
  const result = render(ui, {
    wrapper: createQueryWrapper(testQueryClient),
    ...renderOptions,
  });
  
  return {
    ...result,
    queryClient: testQueryClient,
  };
}

/**
 * Helper to wait for a query to settle (no longer fetching)
 * 
 * @param queryClient - QueryClient instance
 * @param queryKey - Query key to wait for
 * @param timeout - Maximum time to wait in ms (default: 5000)
 */
export async function waitForQueryToSettle(
  queryClient: QueryClient,
  queryKey: unknown[],
  timeout = 5000
): Promise<void> {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    const query = queryClient.getQueryCache().find({ queryKey });
    
    if (query && !query.state.isFetching) {
      return;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  
  throw new Error(`Query ${JSON.stringify(queryKey)} did not settle within ${timeout}ms`);
}

/**
 * Helper to get query data from cache
 * 
 * @param queryClient - QueryClient instance
 * @param queryKey - Query key
 * @returns Query data or undefined
 */
export function getQueryData<T = unknown>(
  queryClient: QueryClient,
  queryKey: unknown[]
): T | undefined {
  return queryClient.getQueryData<T>(queryKey);
}

/**
 * Helper to set query data in cache
 * 
 * @param queryClient - QueryClient instance
 * @param queryKey - Query key
 * @param data - Data to set
 */
export function setQueryData<T = unknown>(
  queryClient: QueryClient,
  queryKey: unknown[],
  data: T
): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Helper to clear all queries from cache
 * 
 * @param queryClient - QueryClient instance
 */
export function clearAllQueries(queryClient: QueryClient): void {
  queryClient.clear();
}
