/**
 * useProjects Hook - React Query Hook for Projects List
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching and managing the projects list.
 * Provides automatic caching, background refetching, error handling, and filter support.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Filter support (status, corporate_id, ngo_id, city, province, sdg_goals, search)
 * - Pagination support with cursor-based loading
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage - fetch all projects
 * const { data, isLoading, error } = useProjects();
 * 
 * // With filters
 * const { data, isLoading, error } = useProjects({
 *   status: ['active', 'completed'],
 *   city: 'Islamabad'
 * });
 * 
 * // With pagination
 * const { data, isLoading, error } = useProjects(
 *   { status: ['active'] },
 *   { page: 1, limit: 20 }
 * );
 * 
 * // Access data
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <ProjectList projects={data.data} total={data.total} />;
 * ```
 * 
 * ## Query Key Structure:
 * ['projects', 'list', filters, pagination]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - A project is created (via useProjectMutations)
 * - A project is updated (via useProjectMutations)
 * - A project is deleted (via useProjectMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * 
 * @module hooks/queries/useProjects
 * @since 2026-01-31
 * @estimated-time 30-45 minutes
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { 
  projectsApi, 
  ProjectFilters, 
  Project 
} from '../../lib/api/projects';
import { PaginationParams, PaginatedResponse } from '../../lib/api/base';
import { queryKeys } from './queryKeys';

/**
 * React Query hook for fetching projects list with filtering and pagination
 * 
 * @param filters - Optional filters for projects (status, corporate_id, ngo_id, etc.)
 * @param pagination - Optional pagination parameters (page, limit, sortBy, sortOrder)
 * @returns Query result with projects data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useProjects(
 *   { status: ['active'], city: 'Lahore' },
 *   { page: 1, limit: 10 }
 * );
 * ```
 */
export function useProjects(
  filters: ProjectFilters = {},
  pagination: PaginationParams = {}
): UseQueryResult<PaginatedResponse<Project>, Error> {
  return useQuery<PaginatedResponse<Project>, Error>({
    queryKey: queryKeys.projects.list({ filters, pagination }),
    queryFn: async () => {
      const response = await projectsApi.list(filters, pagination);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch projects');
      }
      
      return response.data as PaginatedResponse<Project>;
    },
    // Only fetch if we have necessary data (can add more conditions)
    enabled: true,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes - inherited from queryClient but explicit here
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus (inherited from queryClient)
    refetchOnWindowFocus: false,
  });
}

/**
 * Type export for the hook return value
 * Makes it easier to type component props that receive this hook's result
 */
export type UseProjectsReturn = ReturnType<typeof useProjects>;
