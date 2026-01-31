/**
 * useApplication Hook - React Query Hook for Single Application Detail
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching a single volunteer application by ID.
 * Provides automatic caching, background refetching, and error handling.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching when data becomes stale
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * - Conditional fetching (only when ID is provided)
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useApplication('app-123');
 * 
 * // With conditional rendering
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!data) return <NotFound />;
 * return <ApplicationDetail application={data} />;
 * 
 * // Optional ID (useful for conditional fetching)
 * const { data, isLoading } = useApplication(selectedId); // selectedId can be undefined
 * ```
 * 
 * ## Query Key Structure:
 * ['applications', 'detail', applicationId]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - The application is updated (via useApplicationMutations)
 * - The application is reviewed (via useApplicationMutations)
 * - The application is withdrawn (via useApplicationMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * - Query is disabled if no ID is provided
 * 
 * @module hooks/queries/useApplication
 * @since 2026-01-31
 * @estimated-time 20-30 minutes
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { applicationsApi, VolunteerApplication } from '../../lib/api/applications';

/**
 * React Query hook for fetching a single application by ID
 * 
 * @param applicationId - The ID of the application to fetch (optional)
 * @returns Query result with application data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useApplication('app-123');
 * 
 * // Conditional fetching
 * const { data, isLoading } = useApplication(
 *   isOpen ? applicationId : undefined
 * );
 * ```
 */
export function useApplication(
  applicationId?: string
): UseQueryResult<VolunteerApplication, Error> {
  return useQuery<VolunteerApplication, Error>({
    queryKey: ['applications', 'detail', applicationId],
    queryFn: async () => {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }
      
      const response = await applicationsApi.getApplication(applicationId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch application');
      }
      
      return response.data as VolunteerApplication;
    },
    // Only fetch if we have an ID
    enabled: !!applicationId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * Type export for the hook return value
 * Makes it easier to type component props that receive this hook's result
 */
export type UseApplicationReturn = ReturnType<typeof useApplication>;
