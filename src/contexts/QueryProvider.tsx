import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../lib/queryClient";
import type { ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider wraps the application with React Query's QueryClientProvider
 * and includes the devtools for development.
 * 
 * This provider enables:
 * - Data fetching and caching
 * - Automatic refetching
 * - Optimistic updates
 * - Query invalidation
 * - Developer tools for debugging (in development only)
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
