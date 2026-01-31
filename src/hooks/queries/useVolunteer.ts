/**
 * useVolunteer Hook - React Query Hook for Single Volunteer Detail
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching a single volunteer profile by ID.
 * Provides automatic caching, background refetching, error handling, and includes volunteer stats.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching when data becomes stale
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * - Conditional fetching (only when ID is provided)
 * - Includes volunteer statistics (hours, applications, certificates)
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useVolunteer('vol-123');
 * 
 * // With conditional rendering
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!data) return <NotFound />;
 * return <VolunteerProfile volunteer={data} />;
 * 
 * // Optional ID (useful for conditional fetching)
 * const { data, isLoading } = useVolunteer(selectedId); // selectedId can be undefined
 * ```
 * 
 * ## Query Key Structure:
 * ['volunteers', 'detail', volunteerId]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - The volunteer profile is updated (via useVolunteerMutations)
 * - Background check status changes (via useVolunteerMutations)
 * - Volunteer hours are logged or approved (via useVolunteerMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * - Query is disabled if no ID is provided
 * 
 * @module hooks/queries/useVolunteer
 * @since 2026-01-31
 * @estimated-time 20-30 minutes
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { volunteersApi, Volunteer } from '../../lib/api/volunteers';

/**
 * Extended volunteer data with stats
 */
export interface VolunteerWithStats extends Volunteer {
  stats?: {
    totalHours: number;
    applicationsSubmitted: number;
    applicationsApproved: number;
    certificatesEarned: number;
    activeProjects: number;
  };
}

/**
 * React Query hook for fetching a single volunteer by ID
 * 
 * @param volunteerId - The ID of the volunteer to fetch (optional)
 * @param includeStats - Whether to include volunteer statistics (default: false)
 * @returns Query result with volunteer data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useVolunteer('vol-123', true);
 * 
 * // Conditional fetching
 * const { data, isLoading } = useVolunteer(
 *   isOpen ? volunteerId : undefined
 * );
 * ```
 */
export function useVolunteer(
  volunteerId?: string,
  includeStats: boolean = false
): UseQueryResult<VolunteerWithStats, Error> {
  return useQuery<VolunteerWithStats, Error>({
    queryKey: ['volunteers', 'detail', volunteerId, includeStats],
    queryFn: async () => {
      if (!volunteerId) {
        throw new Error('Volunteer ID is required');
      }
      
      // Fetch volunteer profile
      const response = await volunteersApi.getById(volunteerId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch volunteer');
      }
      
      const volunteer = response.data as Volunteer;
      
      // Optionally fetch stats
      if (includeStats) {
        const statsResponse = await volunteersApi.getStats(volunteerId);
        
        if (statsResponse.success) {
          return {
            ...volunteer,
            stats: statsResponse.data,
          };
        }
      }
      
      return volunteer;
    },
    // Only fetch if we have an ID
    enabled: !!volunteerId,
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
export type UseVolunteerReturn = ReturnType<typeof useVolunteer>;
