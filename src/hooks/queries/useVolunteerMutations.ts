/**
 * useVolunteerMutations Hook - React Query Mutations for Volunteers CRUD
 * 
 * @fileoverview
 * Production-grade React Query mutation hooks for volunteer update, hours logging, and background check operations.
 * Provides optimistic updates, automatic cache invalidation, and comprehensive error handling.
 * 
 * ## Features:
 * - Optimistic updates for better UX
 * - Automatic cache invalidation and refetching
 * - Rollback on error for optimistic updates
 * - Type-safe with full TypeScript support
 * - Success/error callbacks
 * - Loading and error states
 * - Support for hours tracking and background checks
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Update volunteer profile
 * const updateVolunteer = useUpdateVolunteer();
 * await updateVolunteer.mutateAsync({
 *   id: 'vol-123',
 *   updates: { 
 *     skills: ['teaching', 'mentoring'],
 *     interests: ['education']
 *   }
 * });
 * 
 * // Log volunteer hours
 * const logHours = useLogVolunteerHours();
 * logHours.mutate({
 *   project_id: 'proj-123',
 *   date: '2026-01-31',
 *   hours: 4,
 *   activity_description: 'Taught math class'
 * });
 * 
 * // Request background check
 * const requestCheck = useRequestBackgroundCheck();
 * requestCheck.mutate();
 * 
 * // With callbacks
 * const updateVolunteer = useUpdateVolunteer({
 *   onSuccess: (volunteer) => {
 *     toast.success('Profile updated!');
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * ```
 * 
 * ## Cache Updates:
 * - Update: Updates detail cache + invalidates lists
 * - Log Hours: Invalidates volunteer details and hours queries
 * - Background Check: Updates detail cache + invalidates lists
 * 
 * ## Optimistic Updates:
 * Updates are applied immediately to the UI before the server responds.
 * If the server request fails, changes are automatically rolled back.
 * 
 * @module hooks/queries/useVolunteerMutations
 * @since 2026-01-31
 * @estimated-time 60-75 minutes
 */

import { 
  useMutation, 
  useQueryClient, 
  UseMutationResult 
} from '@tanstack/react-query';
import { 
  volunteersApi, 
  Volunteer,
  LogHoursInput,
  VolunteerHours
} from '../../lib/api/volunteers';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Update volunteer mutation parameters
 */
interface UpdateVolunteerParams {
  id: string;
  updates: Partial<Volunteer>;
}

/**
 * Hook for updating volunteer profile
 * 
 * Implements optimistic updates: changes appear immediately in the UI,
 * and are rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateVolunteer = useUpdateVolunteer({
 *   onSuccess: () => toast.success('Profile updated!'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * updateVolunteer.mutate({
 *   id: 'vol-123',
 *   updates: { 
 *     skills: ['teaching', 'communication'],
 *     interests: ['education', 'youth']
 *   }
 * });
 * ```
 */
export function useUpdateVolunteer(
  options?: MutationOptions<Volunteer>
): UseMutationResult<Volunteer, Error, UpdateVolunteerParams> {
  const queryClient = useQueryClient();

  return useMutation<Volunteer, Error, UpdateVolunteerParams>({
    mutationFn: async ({ id, updates }: UpdateVolunteerParams) => {
      const response = await volunteersApi.update(id, updates);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update volunteer');
      }
      
      return response.data as Volunteer;
    },
    onMutate: async ({ id, updates }: UpdateVolunteerParams) => {
      // Cancel any outgoing refetches for this volunteer
      await queryClient.cancelQueries({ queryKey: ['volunteers', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousVolunteer = queryClient.getQueryData<Volunteer>(
        ['volunteers', 'detail', id]
      );

      // Optimistically update the cache
      if (previousVolunteer) {
        queryClient.setQueryData<Volunteer>(
          ['volunteers', 'detail', id],
          { ...previousVolunteer, ...updates }
        );
      }

      // Return context with previous data for rollback
      return { previousVolunteer, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['volunteers', 'detail', id], data);
      
      // Invalidate all volunteer list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context: any) => {
      // Rollback to previous value on error
      if (context?.previousVolunteer) {
        queryClient.setQueryData(['volunteers', 'detail', id], context.previousVolunteer);
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'detail', id] });
      
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Hook for logging volunteer hours
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const logHours = useLogVolunteerHours({
 *   onSuccess: () => toast.success('Hours logged!'),
 * });
 * 
 * // Usage
 * logHours.mutate({
 *   project_id: 'proj-123',
 *   date: '2026-01-31',
 *   hours: 4,
 *   activity_description: 'Taught programming to students'
 * });
 * ```
 */
export function useLogVolunteerHours(
  options?: MutationOptions<VolunteerHours>
): UseMutationResult<VolunteerHours, Error, LogHoursInput> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerHours, Error, LogHoursInput>({
    mutationFn: async (input: LogHoursInput) => {
      const response = await volunteersApi.logHours(input);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to log hours');
      }
      
      return response.data as VolunteerHours;
    },
    onSuccess: (data) => {
      // Invalidate volunteer hours queries
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'hours'] });
      
      // Invalidate volunteer details (to update total hours)
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'detail'] });
      
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
 * Approve hours mutation parameters
 */
interface ApproveHoursParams {
  hoursId: string;
}

/**
 * Hook for approving volunteer hours (admin/manager)
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const approveHours = useApproveVolunteerHours({
 *   onSuccess: () => toast.success('Hours approved!'),
 * });
 * 
 * // Usage
 * approveHours.mutate({ hoursId: 'hours-123' });
 * ```
 */
export function useApproveVolunteerHours(
  options?: MutationOptions<VolunteerHours>
): UseMutationResult<VolunteerHours, Error, ApproveHoursParams> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerHours, Error, ApproveHoursParams>({
    mutationFn: async ({ hoursId }: ApproveHoursParams) => {
      const response = await volunteersApi.approveHours(hoursId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to approve hours');
      }
      
      return response.data as VolunteerHours;
    },
    onSuccess: (data) => {
      // Invalidate volunteer hours queries
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'hours'] });
      
      // Invalidate volunteer details (to update total hours)
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'detail'] });
      
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
 * Hook for requesting background check
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const requestCheck = useRequestBackgroundCheck({
 *   onSuccess: () => toast.success('Background check requested!'),
 * });
 * 
 * // Usage
 * requestCheck.mutate();
 * ```
 */
export function useRequestBackgroundCheck(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const response = await volunteersApi.requestBackgroundCheck();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to request background check');
      }
    },
    onSuccess: () => {
      // Invalidate volunteer details to show updated status
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'detail'] });
      
      // Invalidate volunteer lists
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(undefined);
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
 * Update background check mutation parameters
 */
interface UpdateBackgroundCheckParams {
  volunteerId: string;
  status: 'approved' | 'rejected';
}

/**
 * Hook for updating background check status (admin)
 * 
 * Implements optimistic updates: status changes immediately in the UI,
 * and is restored if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateCheck = useUpdateBackgroundCheck({
 *   onSuccess: () => toast.success('Background check updated!'),
 * });
 * 
 * // Usage
 * updateCheck.mutate({
 *   volunteerId: 'vol-123',
 *   status: 'approved'
 * });
 * ```
 */
export function useUpdateBackgroundCheck(
  options?: MutationOptions<Volunteer>
): UseMutationResult<Volunteer, Error, UpdateBackgroundCheckParams> {
  const queryClient = useQueryClient();

  return useMutation<Volunteer, Error, UpdateBackgroundCheckParams>({
    mutationFn: async ({ volunteerId, status }: UpdateBackgroundCheckParams) => {
      const response = await volunteersApi.updateBackgroundCheckStatus(volunteerId, status);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update background check');
      }
      
      return response.data as Volunteer;
    },
    onMutate: async ({ volunteerId, status }: UpdateBackgroundCheckParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['volunteers', 'detail', volunteerId] });

      // Snapshot the previous volunteer for rollback
      const previousVolunteer = queryClient.getQueryData<Volunteer>(
        ['volunteers', 'detail', volunteerId]
      );

      // Optimistically update status
      if (previousVolunteer) {
        queryClient.setQueryData<Volunteer>(
          ['volunteers', 'detail', volunteerId],
          { ...previousVolunteer, background_check_status: status }
        );
      }

      // Return context for rollback
      return { previousVolunteer, volunteerId };
    },
    onSuccess: (data, { volunteerId }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['volunteers', 'detail', volunteerId], data);
      
      // Invalidate all volunteer queries
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { volunteerId }, context: any) => {
      // Restore volunteer cache on error
      if (context?.previousVolunteer) {
        queryClient.setQueryData(['volunteers', 'detail', volunteerId], context.previousVolunteer);
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { volunteerId }) => {
      // Ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['volunteers', 'detail', volunteerId] });
      
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
export type UseUpdateVolunteerReturn = ReturnType<typeof useUpdateVolunteer>;
export type UseLogVolunteerHoursReturn = ReturnType<typeof useLogVolunteerHours>;
export type UseApproveVolunteerHoursReturn = ReturnType<typeof useApproveVolunteerHours>;
export type UseRequestBackgroundCheckReturn = ReturnType<typeof useRequestBackgroundCheck>;
export type UseUpdateBackgroundCheckReturn = ReturnType<typeof useUpdateBackgroundCheck>;
