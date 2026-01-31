/**
 * useAdminMutations Hook - React Query Mutations for Admin Operations
 * 
 * @fileoverview
 * Production-grade React Query mutation hooks for admin operations including user management,
 * vetting queue operations, and bulk actions. Provides optimistic updates, automatic cache
 * invalidation, and comprehensive error handling.
 * 
 * ## Features:
 * - Optimistic updates for better UX
 * - Automatic cache invalidation and refetching
 * - Rollback on error for optimistic updates
 * - Type-safe with full TypeScript support
 * - Success/error callbacks
 * - Loading and error states
 * - Support for bulk operations
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Update user role
 * const updateRole = useUpdateUserRole({
 *   onSuccess: () => toast.success('Role updated'),
 *   onError: (error) => toast.error(error.message)
 * });
 * updateRole.mutate({ userId: 'user-123', role: 'admin' });
 * 
 * // Approve vetting item
 * const approveItem = useApproveVettingItem({
 *   onSuccess: () => toast.success('Approved!')
 * });
 * approveItem.mutate({ itemId: 'item-123', notes: 'Looks good' });
 * 
 * // Bulk delete users
 * const bulkDelete = useBulkDelete({
 *   onSuccess: () => toast.success('Deleted successfully')
 * });
 * bulkDelete.mutate({ entity_type: 'user', entity_ids: ['id1', 'id2'] });
 * ```
 * 
 * ## Cache Updates:
 * - User mutations: Invalidate user list and detail queries
 * - Vetting mutations: Invalidate vetting queue queries
 * - Bulk operations: Invalidate all relevant list queries
 * 
 * ## Optimistic Updates:
 * Updates are applied immediately to the UI before the server responds.
 * If the server request fails, changes are automatically rolled back.
 * 
 * @module hooks/queries/useAdminMutations
 * @since 2026-01-31
 */

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  adminApi,
  AdminUser,
  VettingQueue,
  AuditLog,
} from '../../lib/api/admin';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Update user role mutation parameters
 */
interface UpdateUserRoleParams {
  userId: string;
  role: AdminUser['role'];
}

/**
 * Hook for updating a user's role
 * 
 * Updates a user's role and automatically invalidates relevant caches.
 * Implements optimistic updates to show changes immediately.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const updateRole = useUpdateUserRole({
 *   onSuccess: (user) => {
 *     toast.success(`Role updated to ${user.role}`);
 *     navigate('/admin/users');
 *   },
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * updateRole.mutate({
 *   userId: 'user-123',
 *   role: 'admin'
 * });
 * ```
 */
export function useUpdateUserRole(
  options?: MutationOptions<AdminUser>
): UseMutationResult<AdminUser, Error, UpdateUserRoleParams> {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, UpdateUserRoleParams>({
    mutationFn: async ({ userId, role }: UpdateUserRoleParams) => {
      const response = await adminApi.updateUserRole(userId, role);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user role');
      }

      return response.data as AdminUser;
    },
    onMutate: async ({ userId, role }: UpdateUserRoleParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin', 'users', 'detail', userId] });

      // Snapshot the previous value for rollback
      const previousUser = queryClient.getQueryData<AdminUser>(['admin', 'users', 'detail', userId]);

      // Optimistically update the cache
      if (previousUser) {
        queryClient.setQueryData<AdminUser>(
          ['admin', 'users', 'detail', userId],
          { ...previousUser, role }
        );
      }

      // Return context with previous data for rollback
      return { previousUser, userId };
    },
    onSuccess: (data, { userId }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['admin', 'users', 'detail', userId], data);

      // Invalidate user list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { userId }, context: { previousUser?: AdminUser; userId: string } | undefined) => {
      // Rollback to previous value on error
      if (context?.previousUser) {
        queryClient.setQueryData(['admin', 'users', 'detail', userId], context.previousUser);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { userId }) => {
      // Always refetch to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', userId] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Hook for activating a user account
 * 
 * Sets a user's account status to active and invalidates relevant caches.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const activateUser = useActivateUser({
 *   onSuccess: () => toast.success('User activated'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * activateUser.mutate('user-123');
 * ```
 */
export function useActivateUser(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await adminApi.activateUser(userId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to activate user');
      }
    },
    onSuccess: (data, userId) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });

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
 * Hook for deactivating a user account
 * 
 * Sets a user's account status to inactive and invalidates relevant caches.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const deactivateUser = useDeactivateUser({
 *   onSuccess: () => toast.success('User deactivated'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * if (confirm('Deactivate this user?')) {
 *   deactivateUser.mutate('user-123');
 * }
 * ```
 */
export function useDeactivateUser(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await adminApi.deactivateUser(userId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to deactivate user');
      }
    },
    onSuccess: (data, userId) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'detail', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });

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
 * Hook for deleting a user
 * 
 * Permanently deletes a user account and removes from caches.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const deleteUser = useDeleteUser({
 *   onSuccess: () => {
 *     toast.success('User deleted');
 *     navigate('/admin/users');
 *   },
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * if (confirm('Permanently delete this user?')) {
 *   deleteUser.mutate('user-123');
 * }
 * ```
 */
export function useDeleteUser(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await adminApi.deleteUser(userId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete user');
      }
    },
    onMutate: async (userId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin', 'users', 'detail', userId] });
      await queryClient.cancelQueries({ queryKey: ['admin', 'users', 'list'] });

      // Snapshot the previous user for rollback
      const previousUser = queryClient.getQueryData<AdminUser>(['admin', 'users', 'detail', userId]);

      // Optimistically remove from cache
      queryClient.removeQueries({ queryKey: ['admin', 'users', 'detail', userId] });

      // Return context for rollback
      return { previousUser, userId };
    },
    onSuccess: () => {
      // Invalidate user list queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(undefined);
    },
    onError: (error, userId, context: { previousUser?: AdminUser; userId: string } | undefined) => {
      // Restore user cache on error
      if (context?.previousUser) {
        queryClient.setQueryData(['admin', 'users', 'detail', userId], context.previousUser);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: () => {
      // Ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'list'] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Assign vetting item mutation parameters
 */
interface AssignVettingItemParams {
  itemId: string;
  assigneeId: string;
}

/**
 * Hook for assigning a vetting item to a reviewer
 * 
 * Assigns a vetting queue item to a specific admin user for review.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const assignItem = useAssignVettingItem({
 *   onSuccess: (item) => toast.success(`Assigned to reviewer`),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * assignItem.mutate({
 *   itemId: 'vetting-123',
 *   assigneeId: 'admin-456'
 * });
 * ```
 */
export function useAssignVettingItem(
  options?: MutationOptions<VettingQueue>
): UseMutationResult<VettingQueue, Error, AssignVettingItemParams> {
  const queryClient = useQueryClient();

  return useMutation<VettingQueue, Error, AssignVettingItemParams>({
    mutationFn: async ({ itemId, assigneeId }: AssignVettingItemParams) => {
      const response = await adminApi.assignVettingItem(itemId, assigneeId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to assign vetting item');
      }

      return response.data as VettingQueue;
    },
    onSuccess: (data) => {
      // Invalidate vetting queue queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'vetting', 'list'] });

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
 * Approve vetting item mutation parameters
 */
interface ApproveVettingItemParams {
  itemId: string;
  notes?: string;
}

/**
 * Hook for approving a vetting item
 * 
 * Approves a vetting queue item and marks it as reviewed.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const approveItem = useApproveVettingItem({
 *   onSuccess: () => toast.success('Item approved'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * approveItem.mutate({
 *   itemId: 'vetting-123',
 *   notes: 'All checks passed'
 * });
 * ```
 */
export function useApproveVettingItem(
  options?: MutationOptions<VettingQueue>
): UseMutationResult<VettingQueue, Error, ApproveVettingItemParams> {
  const queryClient = useQueryClient();

  return useMutation<VettingQueue, Error, ApproveVettingItemParams>({
    mutationFn: async ({ itemId, notes }: ApproveVettingItemParams) => {
      const response = await adminApi.approveVettingItem(itemId, notes);

      if (!response.success) {
        throw new Error(response.error || 'Failed to approve vetting item');
      }

      return response.data as VettingQueue;
    },
    onSuccess: (data) => {
      // Invalidate vetting queue queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'vetting', 'list'] });

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
 * Reject vetting item mutation parameters
 */
interface RejectVettingItemParams {
  itemId: string;
  reason: string;
}

/**
 * Hook for rejecting a vetting item
 * 
 * Rejects a vetting queue item with a reason and marks it as reviewed.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const rejectItem = useRejectVettingItem({
 *   onSuccess: () => toast.success('Item rejected'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * rejectItem.mutate({
 *   itemId: 'vetting-123',
 *   reason: 'Incomplete documentation'
 * });
 * ```
 */
export function useRejectVettingItem(
  options?: MutationOptions<VettingQueue>
): UseMutationResult<VettingQueue, Error, RejectVettingItemParams> {
  const queryClient = useQueryClient();

  return useMutation<VettingQueue, Error, RejectVettingItemParams>({
    mutationFn: async ({ itemId, reason }: RejectVettingItemParams) => {
      const response = await adminApi.rejectVettingItem(itemId, reason);

      if (!response.success) {
        throw new Error(response.error || 'Failed to reject vetting item');
      }

      return response.data as VettingQueue;
    },
    onSuccess: (data) => {
      // Invalidate vetting queue queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'vetting', 'list'] });

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
 * Update vetting priority mutation parameters
 */
interface UpdateVettingPriorityParams {
  itemId: string;
  priority: VettingQueue['priority'];
}

/**
 * Hook for updating vetting item priority
 * 
 * Changes the priority level of a vetting queue item.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const updatePriority = useUpdateVettingPriority({
 *   onSuccess: () => toast.success('Priority updated'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * updatePriority.mutate({
 *   itemId: 'vetting-123',
 *   priority: 'urgent'
 * });
 * ```
 */
export function useUpdateVettingPriority(
  options?: MutationOptions<VettingQueue>
): UseMutationResult<VettingQueue, Error, UpdateVettingPriorityParams> {
  const queryClient = useQueryClient();

  return useMutation<VettingQueue, Error, UpdateVettingPriorityParams>({
    mutationFn: async ({ itemId, priority }: UpdateVettingPriorityParams) => {
      const response = await adminApi.updatePriority(itemId, priority);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update priority');
      }

      return response.data as VettingQueue;
    },
    onSuccess: (data) => {
      // Invalidate vetting queue queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'vetting', 'list'] });

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
 * Bulk update status mutation parameters
 */
interface BulkUpdateStatusParams {
  entity_type: 'ngo' | 'project' | 'volunteer';
  entity_ids: string[];
  status: string;
}

/**
 * Hook for bulk updating entity status
 * 
 * Updates the status of multiple entities (NGOs, projects, or volunteers) at once.
 * 
 * Note: Bulk operations cannot be fully optimistic due to potential partial failures.
 * If some entities succeed and others fail, we cannot predict the final state.
 * Therefore, we invalidate all queries on success to fetch the actual server state.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const bulkUpdateStatus = useBulkUpdateStatus({
 *   onSuccess: () => toast.success('Status updated for all items'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * bulkUpdateStatus.mutate({
 *   entity_type: 'ngo',
 *   entity_ids: ['ngo-1', 'ngo-2', 'ngo-3'],
 *   status: 'verified'
 * });
 * ```
 */
export function useBulkUpdateStatus(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, BulkUpdateStatusParams> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkUpdateStatusParams>({
    mutationFn: async ({ entity_type, entity_ids, status }: BulkUpdateStatusParams) => {
      const response = await adminApi.bulkUpdateStatus(entity_type, entity_ids, status);

      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk update status');
      }
    },
    onSuccess: (data, { entity_type }) => {
      // Invalidate relevant queries based on entity type
      if (entity_type === 'ngo') {
        queryClient.invalidateQueries({ queryKey: ['ngos'] });
      } else if (entity_type === 'project') {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else if (entity_type === 'volunteer') {
        queryClient.invalidateQueries({ queryKey: ['volunteers'] });
      }

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
 * Bulk delete mutation parameters
 */
interface BulkDeleteParams {
  entity_type: 'ngo' | 'project' | 'user';
  entity_ids: string[];
}

/**
 * Hook for bulk deleting entities
 * 
 * Deletes multiple entities (NGOs, projects, or users) at once.
 * 
 * Note: Bulk operations cannot be fully optimistic due to potential partial failures.
 * If some entities succeed and others fail, we cannot predict the final state.
 * Therefore, we invalidate all queries on success to fetch the actual server state.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const bulkDelete = useBulkDelete({
 *   onSuccess: () => toast.success('Items deleted'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * if (confirm('Delete selected items?')) {
 *   bulkDelete.mutate({
 *     entity_type: 'project',
 *     entity_ids: ['proj-1', 'proj-2']
 *   });
 * }
 * ```
 */
export function useBulkDelete(
  options?: MutationOptions<void>
): UseMutationResult<void, Error, BulkDeleteParams> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkDeleteParams>({
    mutationFn: async ({ entity_type, entity_ids }: BulkDeleteParams) => {
      const response = await adminApi.bulkDelete(entity_type, entity_ids);

      if (!response.success) {
        throw new Error(response.error || 'Failed to bulk delete');
      }
    },
    onSuccess: (data, { entity_type }) => {
      // Invalidate relevant queries based on entity type
      if (entity_type === 'ngo') {
        queryClient.invalidateQueries({ queryKey: ['ngos'] });
      } else if (entity_type === 'project') {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      } else if (entity_type === 'user') {
        queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      }

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
 * Create audit log mutation parameters
 */
interface CreateAuditLogParams {
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: any;
  ip_address: string;
  user_agent: string;
}

/**
 * Hook for creating an audit log entry
 * 
 * Creates a new audit log entry for tracking admin actions.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isPending, error, etc.
 * 
 * @example
 * ```tsx
 * const createLog = useCreateAuditLog({
 *   onSuccess: () => console.log('Audit log created'),
 *   onError: (error) => console.error(error)
 * });
 * 
 * // Usage
 * createLog.mutate({
 *   user_id: 'admin-123',
 *   action: 'update_role',
 *   entity_type: 'user',
 *   entity_id: 'user-456',
 *   changes: { role: 'admin' },
 *   ip_address: '192.168.1.1',
 *   user_agent: 'Mozilla/5.0...'
 * });
 * ```
 */
export function useCreateAuditLog(
  options?: MutationOptions<AuditLog>
): UseMutationResult<AuditLog, Error, CreateAuditLogParams> {
  const queryClient = useQueryClient();

  return useMutation<AuditLog, Error, CreateAuditLogParams>({
    mutationFn: async (params: CreateAuditLogParams) => {
      const response = await adminApi.createAuditLog(params);

      if (!response.success) {
        throw new Error(response.error || 'Failed to create audit log');
      }

      return response.data as AuditLog;
    },
    onSuccess: (data) => {
      // Invalidate audit log queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit', 'list'] });

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
    // Don't retry audit log creation
    retry: 0,
  });
}

/**
 * Type exports for mutation hook return values
 */
export type UseUpdateUserRoleReturn = ReturnType<typeof useUpdateUserRole>;
export type UseActivateUserReturn = ReturnType<typeof useActivateUser>;
export type UseDeactivateUserReturn = ReturnType<typeof useDeactivateUser>;
export type UseDeleteUserReturn = ReturnType<typeof useDeleteUser>;
export type UseAssignVettingItemReturn = ReturnType<typeof useAssignVettingItem>;
export type UseApproveVettingItemReturn = ReturnType<typeof useApproveVettingItem>;
export type UseRejectVettingItemReturn = ReturnType<typeof useRejectVettingItem>;
export type UseUpdateVettingPriorityReturn = ReturnType<typeof useUpdateVettingPriority>;
export type UseBulkUpdateStatusReturn = ReturnType<typeof useBulkUpdateStatus>;
export type UseBulkDeleteReturn = ReturnType<typeof useBulkDelete>;
export type UseCreateAuditLogReturn = ReturnType<typeof useCreateAuditLog>;
