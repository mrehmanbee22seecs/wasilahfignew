/**
 * usePayments Hook - React Query Hooks for Payments CRUD
 * 
 * @fileoverview
 * Production-grade React Query hooks for fetching and managing payment approvals.
 * Provides automatic caching, background refetching, error handling, and optimistic updates.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching when data becomes stale
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * - Conditional fetching (only when parameters are provided)
 * - Optimistic updates for better UX
 * - Automatic cache invalidation and refetching
 * - Rollback on error for optimistic updates
 * - Support for filtering by organization and status
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Fetch payments list
 * const { data, isLoading, error } = usePayments('corp-123', { status: 'pending' });
 * 
 * // Fetch single payment
 * const { data, isLoading } = usePayment('payment-123');
 * 
 * // Create payment
 * const createPayment = useCreatePayment({
 *   onSuccess: () => toast.success('Payment created!'),
 * });
 * createPayment.mutate({
 *   project_id: 'proj-123',
 *   corporate_id: 'corp-123',
 *   amount: 50000,
 *   payment_type: 'milestone',
 *   category: 'project_expense',
 *   description: 'Q1 milestone payment',
 *   recipient_name: 'NGO Name',
 *   recipient_account: '1234567890',
 *   recipient_bank: 'Bank Name',
 *   urgency: 'high'
 * });
 * 
 * // Approve payment
 * const approvePayment = useApprovePayment({
 *   onSuccess: () => toast.success('Payment approved!'),
 * });
 * approvePayment.mutate({
 *   id: 'payment-123',
 *   notes: 'Approved after verification',
 *   approved_amount: 50000,
 *   payment_reference: 'REF-2026-001'
 * });
 * 
 * // Reject payment
 * const rejectPayment = useRejectPayment();
 * rejectPayment.mutate({
 *   id: 'payment-123',
 *   reason: 'Insufficient documentation'
 * });
 * 
 * // Dual approval (for high-value payments)
 * const dualApprove = useDualApprovePayment();
 * dualApprove.mutate({
 *   id: 'payment-123',
 *   second_approver_notes: 'Verified and approved'
 * });
 * ```
 * 
 * ## Query Key Structure:
 * - List: ['payments', 'list', corporateId, filters]
 * - Detail: ['payments', 'detail', paymentId]
 * - Stats: ['payments', 'stats', corporateId]
 * 
 * ## Cache Invalidation:
 * - Create: Invalidates list and stats queries
 * - Update/Approve/Reject: Updates detail cache + invalidates list and stats
 * - Dual Approve: Updates detail cache + invalidates list and stats
 * 
 * @module hooks/queries/usePayments
 * @since 2026-01-31
 * @estimated-time 60-75 minutes
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  paymentsApi,
  PaymentApproval,
  PaymentRequest,
  ApprovePaymentRequest,
  RejectPaymentRequest,
} from '../../lib/api/payments';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Filters for payment queries
 */
interface PaymentFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'paid';
  project_id?: string;
}

/**
 * React Query hook for fetching payment approvals list
 * 
 * @param corporateId - The ID of the corporate to fetch payments for (optional)
 * @param filters - Optional filters for status and project
 * @returns Query result with payments data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = usePayments('corp-123', { 
 *   status: 'pending' 
 * });
 * 
 * // Conditional fetching
 * const { data, isLoading } = usePayments(
 *   selectedCorpId // can be undefined
 * );
 * ```
 */
export function usePayments(
  corporateId?: string,
  filters?: PaymentFilters
): UseQueryResult<PaymentApproval[], Error> {
  return useQuery<PaymentApproval[], Error>({
    queryKey: ['payments', 'list', corporateId, filters],
    queryFn: async () => {
      if (!corporateId) {
        throw new Error('Corporate ID is required');
      }

      const response = await paymentsApi.getPaymentApprovals(corporateId, filters);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payments');
      }

      return response.data as PaymentApproval[];
    },
    // Only fetch if we have a corporate ID
    enabled: !!corporateId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching a single payment by ID
 * 
 * @param paymentId - The ID of the payment to fetch (optional)
 * @returns Query result with payment data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = usePayment('payment-123');
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!data) return <NotFound />;
 * return <PaymentDetail payment={data} />;
 * ```
 */
export function usePayment(
  paymentId?: string
): UseQueryResult<PaymentApproval, Error> {
  return useQuery<PaymentApproval, Error>({
    queryKey: ['payments', 'detail', paymentId],
    queryFn: async () => {
      if (!paymentId) {
        throw new Error('Payment ID is required');
      }

      const response = await paymentsApi.getPaymentApproval(paymentId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payment');
      }

      return response.data as PaymentApproval;
    },
    // Only fetch if we have a payment ID
    enabled: !!paymentId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching payments by project
 * 
 * @param projectId - The ID of the project to fetch payments for (optional)
 * @returns Query result with payments data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = usePaymentsByProject('proj-123');
 * ```
 */
export function usePaymentsByProject(
  projectId?: string
): UseQueryResult<PaymentApproval[], Error> {
  return useQuery<PaymentApproval[], Error>({
    queryKey: ['payments', 'list', 'project', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const response = await paymentsApi.getProjectPaymentApprovals(projectId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch project payments');
      }

      return response.data as PaymentApproval[];
    },
    // Only fetch if we have a project ID
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
 * React Query hook for fetching payment statistics
 * 
 * @param corporateId - The ID of the corporate to fetch stats for (optional)
 * @returns Query result with stats data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data: stats, isLoading } = usePaymentStats('corp-123');
 * console.log(stats.total_pending, stats.total_amount_paid);
 * ```
 */
export function usePaymentStats(
  corporateId?: string
): UseQueryResult<{
  total_pending: number;
  total_approved: number;
  total_paid: number;
  total_amount_pending: number;
  total_amount_approved: number;
  total_amount_paid: number;
}, Error> {
  return useQuery({
    queryKey: ['payments', 'stats', corporateId],
    queryFn: async () => {
      if (!corporateId) {
        throw new Error('Corporate ID is required');
      }

      const response = await paymentsApi.getPaymentStats(corporateId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payment stats');
      }

      return response.data;
    },
    // Only fetch if we have a corporate ID
    enabled: !!corporateId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for creating a payment approval request
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const createPayment = useCreatePayment({
 *   onSuccess: () => toast.success('Payment request created!'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * createPayment.mutate({
 *   project_id: 'proj-123',
 *   corporate_id: 'corp-123',
 *   amount: 50000,
 *   payment_type: 'milestone',
 *   category: 'project_expense',
 *   description: 'Q1 milestone payment',
 *   recipient_name: 'NGO Name',
 *   recipient_account: '1234567890',
 *   recipient_bank: 'Bank Name',
 *   urgency: 'high'
 * });
 * ```
 */
export function useCreatePayment(
  options?: MutationOptions<PaymentApproval>
): UseMutationResult<PaymentApproval, Error, PaymentRequest> {
  const queryClient = useQueryClient();

  return useMutation<PaymentApproval, Error, PaymentRequest>({
    mutationFn: async (input: PaymentRequest) => {
      const response = await paymentsApi.createPaymentApproval(input);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create payment');
      }

      return response.data as PaymentApproval;
    },
    onSuccess: (data) => {
      // Invalidate payment lists to refetch
      queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });

      // Invalidate payment stats
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });

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
 * Approve payment mutation parameters
 */
interface ApprovePaymentParams {
  id: string;
  notes?: string;
  approved_amount?: number;
  payment_reference?: string;
}

/**
 * Hook for approving a payment
 * 
 * Implements optimistic updates: status changes immediately in the UI,
 * and is rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const approvePayment = useApprovePayment({
 *   onSuccess: () => toast.success('Payment approved!'),
 * });
 * 
 * // Usage
 * approvePayment.mutate({
 *   id: 'payment-123',
 *   notes: 'Approved after verification',
 *   approved_amount: 50000,
 *   payment_reference: 'REF-2026-001'
 * });
 * ```
 */
export function useApprovePayment(
  options?: MutationOptions<PaymentApproval>
): UseMutationResult<PaymentApproval, Error, ApprovePaymentParams> {
  const queryClient = useQueryClient();

  return useMutation<PaymentApproval, Error, ApprovePaymentParams>({
    mutationFn: async ({ id, ...approveData }: ApprovePaymentParams) => {
      const response = await paymentsApi.approvePayment(id, approveData);

      if (!response.success) {
        throw new Error(response.error || 'Failed to approve payment');
      }

      return response.data as PaymentApproval;
    },
    onMutate: async ({ id }: ApprovePaymentParams) => {
      // Cancel any outgoing refetches for this payment
      await queryClient.cancelQueries({ queryKey: ['payments', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousPayment = queryClient.getQueryData<PaymentApproval>(
        ['payments', 'detail', id]
      );

      // Optimistically update the cache
      if (previousPayment) {
        queryClient.setQueryData<PaymentApproval>(
          ['payments', 'detail', id],
          { ...previousPayment, status: 'approved' }
        );
      }

      // Return context with previous data for rollback
      return { previousPayment, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['payments', 'detail', id], data);

      // Invalidate all payment list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });

      // Invalidate payment stats
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context: any) => {
      // Rollback to previous value on error
      if (context?.previousPayment) {
        queryClient.setQueryData(['payments', 'detail', id], context.previousPayment);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['payments', 'detail', id] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Reject payment mutation parameters
 */
interface RejectPaymentParams {
  id: string;
  reason: string;
  requires_revision?: boolean;
}

/**
 * Hook for rejecting a payment
 * 
 * Implements optimistic updates: status changes immediately in the UI,
 * and is rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const rejectPayment = useRejectPayment({
 *   onSuccess: () => toast.success('Payment rejected'),
 * });
 * 
 * // Usage
 * rejectPayment.mutate({
 *   id: 'payment-123',
 *   reason: 'Insufficient documentation',
 *   requires_revision: true
 * });
 * ```
 */
export function useRejectPayment(
  options?: MutationOptions<PaymentApproval>
): UseMutationResult<PaymentApproval, Error, RejectPaymentParams> {
  const queryClient = useQueryClient();

  return useMutation<PaymentApproval, Error, RejectPaymentParams>({
    mutationFn: async ({ id, reason, requires_revision }: RejectPaymentParams) => {
      const response = await paymentsApi.rejectPayment(id, { reason, requires_revision });

      if (!response.success) {
        throw new Error(response.error || 'Failed to reject payment');
      }

      return response.data as PaymentApproval;
    },
    onMutate: async ({ id }: RejectPaymentParams) => {
      // Cancel any outgoing refetches for this payment
      await queryClient.cancelQueries({ queryKey: ['payments', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousPayment = queryClient.getQueryData<PaymentApproval>(
        ['payments', 'detail', id]
      );

      // Optimistically update the cache
      if (previousPayment) {
        queryClient.setQueryData<PaymentApproval>(
          ['payments', 'detail', id],
          { ...previousPayment, status: 'rejected' }
        );
      }

      // Return context with previous data for rollback
      return { previousPayment, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['payments', 'detail', id], data);

      // Invalidate all payment list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });

      // Invalidate payment stats
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context: any) => {
      // Rollback to previous value on error
      if (context?.previousPayment) {
        queryClient.setQueryData(['payments', 'detail', id], context.previousPayment);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['payments', 'detail', id] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Dual approval mutation parameters (for high-value payments requiring second approval)
 */
interface DualApprovePaymentParams {
  id: string;
  second_approver_notes?: string;
}

/**
 * Hook for dual approval of a payment (second approver)
 * 
 * Used for high-value payments that require two-level approval.
 * Implements optimistic updates with rollback on error.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const dualApprove = useDualApprovePayment({
 *   onSuccess: () => toast.success('Payment dual-approved!'),
 * });
 * 
 * // Usage
 * dualApprove.mutate({
 *   id: 'payment-123',
 *   second_approver_notes: 'Verified and approved as second approver'
 * });
 * ```
 */
export function useDualApprovePayment(
  options?: MutationOptions<PaymentApproval>
): UseMutationResult<PaymentApproval, Error, DualApprovePaymentParams> {
  const queryClient = useQueryClient();

  return useMutation<PaymentApproval, Error, DualApprovePaymentParams>({
    mutationFn: async ({ id, second_approver_notes }: DualApprovePaymentParams) => {
      // For dual approval, we use the same approve endpoint but with additional notes
      const response = await paymentsApi.approvePayment(id, { 
        notes: second_approver_notes 
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to dual-approve payment');
      }

      return response.data as PaymentApproval;
    },
    onMutate: async ({ id }: DualApprovePaymentParams) => {
      // Cancel any outgoing refetches for this payment
      await queryClient.cancelQueries({ queryKey: ['payments', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousPayment = queryClient.getQueryData<PaymentApproval>(
        ['payments', 'detail', id]
      );

      // Optimistically update the cache
      if (previousPayment) {
        queryClient.setQueryData<PaymentApproval>(
          ['payments', 'detail', id],
          { ...previousPayment, status: 'approved' }
        );
      }

      // Return context with previous data for rollback
      return { previousPayment, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['payments', 'detail', id], data);

      // Invalidate all payment list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['payments', 'list'] });

      // Invalidate payment stats
      queryClient.invalidateQueries({ queryKey: ['payments', 'stats'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context: any) => {
      // Rollback to previous value on error
      if (context?.previousPayment) {
        queryClient.setQueryData(['payments', 'detail', id], context.previousPayment);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['payments', 'detail', id] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Type exports for hook return values
 * Makes it easier to type component props that receive these hooks' results
 */
export type UsePaymentsReturn = ReturnType<typeof usePayments>;
export type UsePaymentReturn = ReturnType<typeof usePayment>;
export type UsePaymentsByProjectReturn = ReturnType<typeof usePaymentsByProject>;
export type UsePaymentStatsReturn = ReturnType<typeof usePaymentStats>;
export type UseCreatePaymentReturn = ReturnType<typeof useCreatePayment>;
export type UseApprovePaymentReturn = ReturnType<typeof useApprovePayment>;
export type UseRejectPaymentReturn = ReturnType<typeof useRejectPayment>;
export type UseDualApprovePaymentReturn = ReturnType<typeof useDualApprovePayment>;
