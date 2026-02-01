/**
 * useVolunteers Hook - React Query Hook for Volunteers List
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching and managing volunteers list.
 * Provides automatic caching, background refetching, error handling, and comprehensive filter support.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Filter support (city, province, interests, sdg_goals, skills, is_verified, background_check_status, search, availability)
 * - Pagination support with page-based loading
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage - fetch all volunteers
 * const { data, isLoading, error } = useVolunteers();
 * 
 * // With filters
 * const { data, isLoading, error } = useVolunteers({
 *   city: 'Lahore',
 *   is_verified: true,
 *   skills: ['teaching', 'mentoring']
 * });
 * 
 * // With pagination
 * const { data, isLoading, error } = useVolunteers(
 *   { is_verified: true },
 *   { page: 1, limit: 20 }
 * );
 * 
 * // Access data
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <VolunteerList volunteers={data.data} total={data.total} />;
 * ```
 * 
 * ## Query Key Structure:
 * ['volunteers', 'list', filters, pagination]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - A volunteer profile is updated (via useVolunteerMutations)
 * - Background check status changes (via useVolunteerMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * 
 * @module hooks/queries/useVolunteers
 * @since 2026-01-31
 * @estimated-time 30-45 minutes
 */

import { UseQueryResult } from '@tanstack/react-query';
import { volunteersApi, Volunteer, VolunteerFilters } from '../../lib/api/volunteers';
import { PaginationParams, PaginatedResponse } from '../../lib/api/base';
import { useRealtimeQuery } from '../useRealtimeQuery';

/**
 * React Query hook for fetching volunteers list with filtering and pagination
 * NOW WITH REAL-TIME UPDATES!
 * 
 * @param filters - Optional filters for volunteers (city, province, skills, etc.)
 * @param pagination - Optional pagination parameters (page, limit, sortBy, sortOrder)
 * @param enableRealtime - Enable real-time updates (default: true)
 * @returns Query result with volunteers data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useVolunteers(
 *   { 
 *     city: 'Islamabad', 
 *     is_verified: true,
 *     skills: ['teaching']
 *   },
 *   { page: 1, limit: 10 }
 * );
 * ```
 */
export function useVolunteers(
  filters: VolunteerFilters = {},
  pagination: PaginationParams = {},
  enableRealtime: boolean = true
): UseQueryResult<PaginatedResponse<Volunteer>, Error> {
  return useRealtimeQuery<PaginatedResponse<Volunteer>, Error>({
    queryKey: ['volunteers', 'list', filters, pagination],
    queryFn: async () => {
      const response = await volunteersApi.list(filters, pagination);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch volunteers');
      }
      
      return response.data as PaginatedResponse<Volunteer>;
    },
    // Real-time configuration
    realtimeEntity: 'volunteers',
    enableRealtime,
    // Always enabled - can fetch all volunteers
    enabled: true,
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
export type UseVolunteersReturn = ReturnType<typeof useVolunteers>;
