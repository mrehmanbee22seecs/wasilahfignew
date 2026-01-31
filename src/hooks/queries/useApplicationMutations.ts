/**
 * useApplicationMutations Hook - React Query Mutations for Applications CRUD
 * 
 * @fileoverview
 * Production-grade React Query mutation hooks for application create, review, and withdraw operations.
 * Provides optimistic updates, automatic cache invalidation, and comprehensive error handling.
 * 
 * ## Features:
 * - Optimistic updates for better UX
 * - Automatic cache invalidation and refetching
 * - Rollback on error for optimistic updates
 * - Type-safe with full TypeScript support
 * - Success/error callbacks
 * - Loading and error states
 * - Bulk operations support (approve/reject multiple)
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Create application
 * const createApplication = useCreateApplication();
 * await createApplication.mutateAsync({
 *   project_id: 'proj-123',
 *   motivation: 'I want to help...',
 *   availability_start: '2026-02-01',
 *   // ... other fields
 * });
 * 
 * // Review application
 * const reviewApplication = useReviewApplication();
 * reviewApplication.mutate({
 *   id: 'app-123',
 *   review: { status: 'approved', review_notes: 'Great candidate!' }
 * });
 * 
 * // Withdraw application
 * const withdrawApplication = useWithdrawApplication();
 * withdrawApplication.mutate({
 *   id: 'app-123',
 *   reason: 'Schedule conflict'
 * });
 * 
 * // With callbacks
 * const createApplication = useCreateApplication({
 *   onSuccess: (application) => {
 *     toast.success('Application submitted!');
 *     navigate(`/applications/${application.id}`);
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 * ```
 * 
 * ## Cache Updates:
 * - Create: Invalidates applications list queries
 * - Review: Updates detail cache + invalidates lists
 * - Withdraw: Updates detail cache + invalidates lists
 * - Bulk operations: Invalidate all related queries
 * 
 * ## Optimistic Updates:
 * Updates are applied immediately to the UI before the server responds.
 * If the server request fails, changes are automatically rolled back.
 * 
 * @module hooks/queries/useApplicationMutations
 * @since 2026-01-31
 * @estimated-time 60-75 minutes
 */

import { 
  useMutation, 
  useQueryClient, 
  UseMutationResult 
} from '@tanstack/react-query';
import { 
  applicationsApi, 
  VolunteerApplication,
  CreateApplicationRequest,
  ReviewApplicationRequest
} from '../../lib/api/applications';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Hook for creating a new application
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const createApplication = useCreateApplication({
 *   onSuccess: (app) => console.log('Created:', app.id),
 *   onError: (error) => console.error('Failed:', error)
 * });
 * 
 * // Usage
 * createApplication.mutate({
 *   project_id: 'proj-123',
 *   motivation: 'I am passionate about...',
 *   availability_start: '2026-02-01',
 *   availability_end: '2026-06-30',
 *   hours_per_week: 10,
 *   skills: ['teaching', 'communication'],
 *   emergency_contact_name: 'John Doe',
 *   emergency_contact_phone: '+92-300-1234567',
 *   emergency_contact_relationship: 'spouse',
 * });
 * ```
 */
export function useCreateApplication(
  options?: MutationOptions<VolunteerApplication>
): UseMutationResult<VolunteerApplication, Error, CreateApplicationRequest> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerApplication, Error, CreateApplicationRequest>({
    mutationFn: async (input: CreateApplicationRequest) => {
      const response = await applicationsApi.createApplication(input);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to create application');
      }
      
      return response.data as VolunteerApplication;
    },
    onSuccess: (data) => {
      // Invalidate all application list queries to refetch with new data
      queryClient.invalidateQueries({ queryKey: ['applications', 'list'] });
      
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
 * Review application mutation parameters
 */
interface ReviewApplicationParams {
  id: string;
  review: ReviewApplicationRequest;
}

/**
 * Hook for reviewing an application (approve/reject)
 * 
 * Implements optimistic updates: changes appear immediately in the UI,
 * and are rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const reviewApplication = useReviewApplication({
 *   onSuccess: () => toast.success('Application reviewed!'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * reviewApplication.mutate({
 *   id: 'app-123',
 *   review: { 
 *     status: 'approved',
 *     review_notes: 'Excellent candidate with relevant experience' 
 *   }
 * });
 * ```
 */
export function useReviewApplication(
  options?: MutationOptions<VolunteerApplication>
): UseMutationResult<VolunteerApplication, Error, ReviewApplicationParams> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerApplication, Error, ReviewApplicationParams>({
    mutationFn: async ({ id, review }: ReviewApplicationParams) => {
      const response = await applicationsApi.reviewApplication(id, review);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to review application');
      }
      
      return response.data as VolunteerApplication;
    },
    onMutate: async ({ id, review }: ReviewApplicationParams) => {
      // Cancel any outgoing refetches for this application
      await queryClient.cancelQueries({ queryKey: ['applications', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousApplication = queryClient.getQueryData<VolunteerApplication>(
        ['applications', 'detail', id]
      );

      // Optimistically update the cache
      if (previousApplication) {
        queryClient.setQueryData<VolunteerApplication>(
          ['applications', 'detail', id],
          { 
            ...previousApplication, 
            status: review.status,
            review_notes: review.review_notes,
            rejection_reason: review.rejection_reason,
          }
        );
      }

      // Return context with previous data for rollback
      return { previousApplication, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['applications', 'detail', id], data);
      
      // Invalidate all application list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['applications', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context) => {
      // Rollback to previous value on error
      if (context?.previousApplication) {
        queryClient.setQueryData(
          ['applications', 'detail', id], 
          context.previousApplication
        );
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['applications', 'detail', id] });
      
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Withdraw application mutation parameters
 */
interface WithdrawApplicationParams {
  id: string;
  reason: string;
}

/**
 * Hook for withdrawing an application
 * 
 * Implements optimistic updates: the application status changes immediately in the UI,
 * and is restored if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const withdrawApplication = useWithdrawApplication({
 *   onSuccess: () => {
 *     toast.success('Application withdrawn');
 *     navigate('/applications');
 *   },
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * withdrawApplication.mutate({
 *   id: 'app-123',
 *   reason: 'Found another opportunity'
 * });
 * ```
 */
export function useWithdrawApplication(
  options?: MutationOptions<VolunteerApplication>
): UseMutationResult<VolunteerApplication, Error, WithdrawApplicationParams> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerApplication, Error, WithdrawApplicationParams>({
    mutationFn: async ({ id, reason }: WithdrawApplicationParams) => {
      const response = await applicationsApi.withdrawApplication(id, reason);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to withdraw application');
      }
      
      return response.data as VolunteerApplication;
    },
    onMutate: async ({ id }: WithdrawApplicationParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['applications', 'detail', id] });

      // Snapshot the previous application for rollback
      const previousApplication = queryClient.getQueryData<VolunteerApplication>(
        ['applications', 'detail', id]
      );

      // Optimistically update status to withdrawn
      if (previousApplication) {
        queryClient.setQueryData<VolunteerApplication>(
          ['applications', 'detail', id],
          { ...previousApplication, status: 'withdrawn' }
        );
      }

      // Return context for rollback
      return { previousApplication, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['applications', 'detail', id], data);
      
      // Invalidate all application list queries
      queryClient.invalidateQueries({ queryKey: ['applications', 'list'] });
      
      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context) => {
      // Restore application cache on error
      if (context?.previousApplication) {
        queryClient.setQueryData(
          ['applications', 'detail', id], 
          context.previousApplication
        );
      }
      
      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['applications', 'detail', id] });
      
      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Bulk approve applications mutation parameters
 */
interface BulkApproveParams {
  ids: string[];
  review_notes?: string;
}

/**
 * Hook for bulk approving applications
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const bulkApprove = useBulkApproveApplications({
 *   onSuccess: (apps) => toast.success(`Approved ${apps.length} applications`),
 * });
 * 
 * // Usage
 * bulkApprove.mutate({
 *   ids: ['app-1', 'app-2', 'app-3'],
 *   review_notes: 'Batch approved after review'
 * });
 * ```
 */
export function useBulkApproveApplications(
  options?: MutationOptions<VolunteerApplication[]>
): UseMutationResult<VolunteerApplication[], Error, BulkApproveParams> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerApplication[], Error, BulkApproveParams>({
    mutationFn: async ({ ids, review_notes }: BulkApproveParams) => {
      const response = await applicationsApi.bulkApproveApplications(ids, review_notes);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to approve applications');
      }
      
      return response.data as VolunteerApplication[];
    },
    onSuccess: (data) => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
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
 * Bulk reject applications mutation parameters
 */
interface BulkRejectParams {
  ids: string[];
  rejection_reason: string;
}

/**
 * Hook for bulk rejecting applications
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const bulkReject = useBulkRejectApplications({
 *   onSuccess: (apps) => toast.success(`Rejected ${apps.length} applications`),
 * });
 * 
 * // Usage
 * bulkReject.mutate({
 *   ids: ['app-4', 'app-5'],
 *   rejection_reason: 'Project capacity reached'
 * });
 * ```
 */
export function useBulkRejectApplications(
  options?: MutationOptions<VolunteerApplication[]>
): UseMutationResult<VolunteerApplication[], Error, BulkRejectParams> {
  const queryClient = useQueryClient();

  return useMutation<VolunteerApplication[], Error, BulkRejectParams>({
    mutationFn: async ({ ids, rejection_reason }: BulkRejectParams) => {
      const response = await applicationsApi.bulkRejectApplications(ids, rejection_reason);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to reject applications');
      }
      
      return response.data as VolunteerApplication[];
    },
    onSuccess: (data) => {
      // Invalidate all application queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      
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
 * Type exports for mutation hook return values
 */
export type UseCreateApplicationReturn = ReturnType<typeof useCreateApplication>;
export type UseReviewApplicationReturn = ReturnType<typeof useReviewApplication>;
export type UseWithdrawApplicationReturn = ReturnType<typeof useWithdrawApplication>;
export type UseBulkApproveApplicationsReturn = ReturnType<typeof useBulkApproveApplications>;
export type UseBulkRejectApplicationsReturn = ReturnType<typeof useBulkRejectApplications>;
