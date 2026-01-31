/**
 * useProject Hook - React Query Hook for Single Project
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching a single project by ID.
 * Provides automatic caching, background refetching, and error handling.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Conditional fetching (only when projectId is provided)
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Basic usage
 * const { data, isLoading, error } = useProject('project-id-123');
 * 
 * // Conditional usage (when ID might be null/undefined)
 * const projectId = useParams().id;
 * const { data, isLoading, error } = useProject(projectId || null);
 * 
 * // Access data with corporate and NGO info
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <ProjectDetail project={data} />;
 * ```
 * 
 * ## Query Key Structure:
 * ['projects', 'detail', projectId]
 * 
 * ## Cache Invalidation:
 * This query is automatically invalidated when:
 * - The specific project is updated (via useProjectMutations)
 * - The specific project is deleted (via useProjectMutations)
 * 
 * ## Performance Notes:
 * - Data is cached for 5 minutes (staleTime)
 * - Background refetch occurs when data becomes stale
 * - Garbage collected after 10 minutes of inactivity
 * - Single retry on failure
 * - Query is disabled when projectId is null
 * 
 * @module hooks/queries/useProject
 * @since 2026-01-31
 * @estimated-time 20-30 minutes
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { projectsApi, Project } from '../../lib/api/projects';

/**
 * React Query hook for fetching a single project by ID
 * 
 * @param projectId - The ID of the project to fetch, or null to disable the query
 * @returns Query result with project data, loading state, and error
 * 
 * @example
 * ```tsx
 * // Fetch a specific project
 * const { data: project, isLoading, error } = useProject('abc-123');
 * 
 * // Conditional fetch (won't execute if ID is null)
 * const { data: project, isLoading } = useProject(maybeProjectId);
 * ```
 */
export function useProject(
  projectId: string | null
): UseQueryResult<Project, Error> {
  return useQuery<Project, Error>({
    queryKey: ['projects', 'detail', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      
      const response = await projectsApi.getById(projectId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project');
      }
      
      return response.data as Project;
    },
    // Only fetch if projectId is provided
    enabled: !!projectId,
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
export type UseProjectReturn = ReturnType<typeof useProject>;
