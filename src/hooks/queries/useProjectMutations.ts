/**
 * useProjectMutations Hook - React Query Mutations for Projects CRUD
 * 
 * @fileoverview
 * Production-grade React Query mutation hooks for project create, update, and delete operations.
 * Provides optimistic updates, automatic cache invalidation, and comprehensive error handling.
 * 
 * ## Features:
 * - Optimistic updates for better UX
 * - Automatic cache invalidation and refetching
 * - Rollback on error for optimistic updates
 * - Type-safe with full TypeScript support
 * - Success/error callbacks
 * - Loading and error states
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Create project
 * const createProject = useCreateProject();
 * await createProject.mutateAsync({
 *   title: 'New Project',
 *   description: 'Description',
 *   budget: 100000,
 *   // ... other fields
 * });
 * 
 * // Update project with optimistic update
 * const updateProject = useUpdateProject();
 * updateProject.mutate({
 *   id: 'project-123',
 *   updates: { title: 'Updated Title' }
 * });
 * 
 * // Delete project with confirmation
 * const deleteProject = useDeleteProject();
 * if (confirm('Are you sure?')) {
 *   deleteProject.mutate('project-123');
 * }
 * 
 * // With callbacks
 * const createProject = useCreateProject({
 *   onSuccess: (project) => {
 *     toast.success('Project created!');
 *     navigate(`/projects/${project.id}`);
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * ```
 * 
 * ## Cache Updates:
 * - Create: Invalidates projects list queries
 * - Update: Updates detail cache + invalidates lists
 * - Delete: Removes from cache + invalidates lists
 * 
 * ## Optimistic Updates:
 * Updates are applied immediately to the UI before the server responds.
 * If the server request fails, changes are automatically rolled back.
 * 
 * @module hooks/queries/useProjectMutations
 * @since 2026-01-31
 * @estimated-time 45-60 minutes
 */

import { 
  useMutation, 
  useQueryClient, 
  UseMutationResult 
} from '@tanstack/react-query';
import { 
  projectsApi, 
  Project, 
  CreateProjectInput, 
  UpdateProjectInput 
} from '../../lib/api/projects';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Hook for creating a new project
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const createProject = useCreateProject({
 *   onSuccess: (project) => console.log('Created:', project.id),
 *   onError: (error) => console.error('Failed:', error)
 * });
 * 
 * // Usage
 * createProject.mutate({
 *   title: 'New Project',
 *   description: 'Project description',
 *   budget: 50000,
 *   start_date: '2026-02-01',
 *   end_date: '2026-12-31',
 *   // ... other required fields
 * });
 * ```
 */
export function useCreateProject(
  options?: MutationOptions<Project>
): UseMutationResult<Project, Error, CreateProjectInput> {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, CreateProjectInput>({
    mutationFn: async (input: CreateProjectInput) => {
      const response = await projectsApi.create(input);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create project');
      }
      
      return response.data as Project;
    },
    onSuccess: (data) => {
      // Invalidate all project list queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: () => {
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Update project mutation parameters
 */
interface UpdateProjectParams {
  id: string;
  updates: UpdateProjectInput;
}

/**
 * Hook for updating an existing project
 * 
 * Implements optimistic updates: changes appear immediately in the UI,
 * and are rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateProject = useUpdateProject({
 *   onSuccess: () => toast.success('Project updated!'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * updateProject.mutate({
 *   id: 'project-123',
 *   updates: { title: 'Updated Title', status: 'active' }
 * });
 * ```
 */
export function useUpdateProject(
  options?: MutationOptions<Project>
): UseMutationResult<Project, Error, UpdateProjectParams> {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, UpdateProjectParams>({
    mutationFn: async ({ id, updates }: UpdateProjectParams) => {
      const response = await projectsApi.update(id, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project');
      }
      
      return response.data as Project;
    },
    onMutate: async ({ id, updates }: UpdateProjectParams) => {
      // Cancel any outgoing refetches for this project
      await queryClient.cancelQueries({ queryKey: ['projects', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousProject = queryClient.getQueryData<Project>(['projects', 'detail', id]);

      // Optimistically update the cache
      if (previousProject) {
        queryClient.setQueryData<Project>(
          ['projects', 'detail', id],
          { ...previousProject, ...updates }
        );
      }

      // Return context with previous data for rollback
      return { previousProject, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['projects', 'detail', id], data);
      
      // Invalidate all project list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context) => {
      // Rollback to previous value on error
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', 'detail', id], context.previousProject);
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', id] });
      
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Hook for deleting a project
 * 
 * Implements optimistic updates: the project is removed from the UI immediately,
 * and is restored if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const deleteProject = useDeleteProject({
 *   onSuccess: () => {
 *     toast.success('Project deleted');
 *     navigate('/projects');
 *   },
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * if (window.confirm('Delete this project?')) {
 *   deleteProject.mutate('project-123');
 * }
 * ```
 */
export function useDeleteProject(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (projectId: string) => {
      const response = await projectsApi.delete(projectId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete project');
      }
    },
    onMutate: async (projectId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['projects', 'detail', projectId] });
      await queryClient.cancelQueries({ queryKey: ['projects', 'list'] });

      // Snapshot the previous project for rollback
      const previousProject = queryClient.getQueryData<Project>(['projects', 'detail', projectId]);

      // Optimistically remove from cache
      queryClient.removeQueries({ queryKey: ['projects', 'detail', projectId] });

      // Return context for rollback
      return { previousProject, projectId };
    },
    onSuccess: () => {
      // Invalidate all project list queries to remove deleted project
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(undefined);
    },
    onError: (error, projectId, context) => {
      // Restore project cache on error
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', 'detail', projectId], context.previousProject);
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: () => {
      // Ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
      
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Type exports for mutation hook return values
 */
export type UseCreateProjectReturn = ReturnType<typeof useCreateProject>;
export type UseUpdateProjectReturn = ReturnType<typeof useUpdateProject>;
export type UseDeleteProjectReturn = ReturnType<typeof useDeleteProject>;
