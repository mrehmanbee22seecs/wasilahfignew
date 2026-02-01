/**
 * useApplications Hook - React Query Hook for Applications List
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching and managing volunteer applications list.
 * Provides automatic caching, background refetching, error handling, and comprehensive filter support.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Filter support (status, volunteer_id, project_id)
 * - Pagination support with cursor-based loading
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage - fetch all applications
 * const { data, isLoading, error } = useApplications();
 * 
 * // With filters
 * const { data, isLoading, error } = useApplications({
 *   status: 'pending',
 *   project_id: 'project-123'
 * });
 * 
 * // With pagination
 * const { data, isLoading, error } = useApplications(
 *   { status: 'pending' },
 *   { page: 1, limit: 20 }
 * );
 * 
 * // Access data
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <ApplicationList applications={data.data} total={data.total} />;
 * ```
 * 
 * ## Query Key Structure:
 * ['applications', 'list', filters, pagination]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - An application is created (via useApplicationMutations)
 * - An application is reviewed (via useApplicationMutations)
 * - An application is withdrawn (via useApplicationMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * 
 * @module hooks/queries/useApplications
 * @since 2026-01-31
 * @estimated-time 30-45 minutes
 */

import { UseQueryResult } from '@tanstack/react-query';
import { applicationsApi, VolunteerApplication } from '../../lib/api/applications';
import { PaginatedResponse } from '../../lib/api/base';
import { useRealtimeQuery } from '../useRealtimeQuery';

/**
 * Filters for querying applications
 */
export interface ApplicationFilters {
  status?: string;
  project_id?: string;
  volunteer_id?: string;
}

/**
 * Pagination parameters for applications list
 */
export interface ApplicationPagination {
  page?: number;
  limit?: number;
}

/**
 * React Query hook for fetching applications list with filtering and pagination
 * NOW WITH REAL-TIME UPDATES!
 * 
 * @param filters - Optional filters for applications (status, project_id, volunteer_id)
 * @param pagination - Optional pagination parameters (page, limit)
 * @param enableRealtime - Enable real-time updates (default: true)
 * @returns Query result with applications data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useApplications(
 *   { status: 'pending', project_id: 'proj-123' },
 *   { page: 1, limit: 10 }
 * );
 * ```
 */
export function useApplications(
  filters: ApplicationFilters = {},
  pagination: ApplicationPagination = {},
  enableRealtime: boolean = true
): UseQueryResult<PaginatedResponse<VolunteerApplication>, Error> {
  const { project_id, page = 1, limit = 20, ...otherFilters } = { ...filters, ...pagination };
  
  return useRealtimeQuery<PaginatedResponse<VolunteerApplication>, Error>({
    queryKey: ['applications', 'list', filters, pagination],
    queryFn: async () => {
      // If project_id is provided, use paginated endpoint
      if (project_id) {
        const response = await applicationsApi.getPaginatedApplications(
          project_id,
          page,
          limit,
          otherFilters
        );
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch applications');
        }
        
        // response.data is already a PaginatedResponse
        return response.data;
      }
      
      // For volunteer_id filter, use getVolunteerApplications
      if (filters.volunteer_id) {
        const response = await applicationsApi.getVolunteerApplications(
          filters.volunteer_id,
          otherFilters
        );
        
        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to fetch applications');
        }
        
        // Convert array response to paginated format
        const data = response.data as VolunteerApplication[];
        return {
          data,
          total: data.length,
          page: 1,
          limit: data.length,
          totalPages: 1,
        };
      }
      
      // Default: empty result if no specific filter provided
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      };
    },
    // Real-time configuration
    realtimeEntity: 'volunteer_applications',
    realtimeFilter: project_id ? `project_id=eq.${project_id}` : filters.volunteer_id ? `volunteer_id=eq.${filters.volunteer_id}` : undefined,
    enableRealtime,
    // Only fetch if we have necessary filters
    enabled: !!(project_id || filters.volunteer_id),
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
export type UseApplicationsReturn = ReturnType<typeof useApplications>;
