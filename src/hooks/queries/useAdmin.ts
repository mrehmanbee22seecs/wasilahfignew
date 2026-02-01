/**
 * useAdmin Hook - React Query Hooks for Admin Operations
 * 
 * @fileoverview
 * Production-grade React Query hooks for fetching admin data including platform statistics,
 * user management, vetting queue, and audit logs. Provides automatic caching, background refetching,
 * error handling, and filter support.
 * 
 * ## Features:
 * - Automatic caching with configurable stale time
 * - Background refetching on mount/reconnect
 * - Filter and pagination support for all list queries
 * - Type-safe with full TypeScript support
 * - Error handling with retry logic
 * - Loading states for both initial load and background updates
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Fetch platform statistics
 * const { data: stats, isLoading, error } = usePlatformStats();
 * 
 * // Fetch all users with pagination
 * const { data: users, isLoading, error } = useAllUsers({ page: 1, limit: 20 });
 * 
 * // Fetch vetting queue with filters
 * const { data: queue, isLoading, error } = useVettingQueue({
 *   status: 'pending',
 *   priority: 'high'
 * });
 * 
 * // Fetch audit logs with filters
 * const { data: logs, isLoading, error } = useAuditLogs({
 *   user_id: 'user-123',
 *   start_date: '2026-01-01',
 *   end_date: '2026-01-31'
 * });
 * 
 * // Fetch single user details
 * const { data: user, isLoading, error } = useUserById('user-123');
 * ```
 * 
 * ## Query Key Structure:
 * - Platform stats: ['admin', 'stats']
 * - All users: ['admin', 'users', 'list', pagination]
 * - User detail: ['admin', 'users', 'detail', userId]
 * - Vetting queue: ['admin', 'vetting', 'list', filters, pagination]
 * - Audit logs: ['admin', 'audit', 'list', filters, pagination]
 * 
 * ## Cache Invalidation:
 * These queries are automatically invalidated when:
 * - User roles are updated (via useAdminMutations)
 * - Vetting items are approved/rejected (via useAdminMutations)
 * - Users are activated/deactivated/deleted (via useAdminMutations)
 * - Bulk operations are performed (via useAdminMutations)
 * 
 * ## Performance Notes:
 * - Platform stats cached for 2 minutes (frequently changing data)
 * - User lists cached for 5 minutes (moderately changing data)
 * - User details cached for 10 minutes (infrequently changing data)
 * - Vetting queue cached for 1 minute (real-time data)
 * - Audit logs cached for 5 minutes (historical data)
 * - All queries garbage collected after 10 minutes of inactivity
 * - Single retry on failure for all queries
 * 
 * @module hooks/queries/useAdmin
 * @since 2026-01-31
 */

import { UseQueryResult, useQuery } from '@tanstack/react-query';
import {
  adminApi,
  AdminUser,
  VettingQueue,
  AuditLog,
  PlatformStats,
} from '../../lib/api/admin';
import { PaginationParams, PaginatedResponse } from '../../lib/api/base';
import { useRealtimeQuery } from '../useRealtimeQuery';

/**
 * Filters for vetting queue queries
 */
export interface VettingQueueFilters {
  entity_type?: VettingQueue['entity_type'];
  status?: VettingQueue['status'];
  priority?: VettingQueue['priority'];
  assigned_to?: string;
}

/**
 * Filters for audit log queries
 */
export interface AuditLogFilters {
  user_id?: string;
  action?: string;
  entity_type?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * React Query hook for fetching platform statistics
 * NOW WITH REAL-TIME UPDATES!
 * 
 * Fetches aggregated statistics about the platform including user counts,
 * project metrics, NGO verification status, and volunteer activity.
 * 
 * @param enableRealtime - Enable real-time updates (default: true)
 * @returns Query result with platform stats, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = usePlatformStats();
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return (
 *   <div>
 *     <h2>Total Users: {data.users.total}</h2>
 *     <h2>Active Projects: {data.projects.active}</h2>
 *   </div>
 * );
 * ```
 */
export function usePlatformStats(
  enableRealtime: boolean = true
): UseQueryResult<PlatformStats, Error> {
  return useRealtimeQuery<PlatformStats, Error>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await adminApi.getPlatformStats();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch platform stats');
      }

      return response.data as PlatformStats;
    },
    // Real-time configuration - stats can change from multiple entities
    realtimeEntity: 'users', // Will trigger on user changes
    enableRealtime,
    // Platform stats change frequently, so shorter stale time
    staleTime: 1000 * 60 * 2, // 2 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus (inherited from queryClient)
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching all users with pagination
 * NOW WITH REAL-TIME UPDATES!
 * 
 * Fetches a paginated list of all platform users with their roles and status.
 * Supports pagination and sorting.
 * 
 * @param pagination - Optional pagination parameters (page, limit, sortBy, sortOrder)
 * @param enableRealtime - Enable real-time updates (default: true)
 * @returns Query result with paginated users data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAllUsers({
 *   page: 1,
 *   limit: 20,
 *   sortBy: 'created_at',
 *   sortOrder: 'desc'
 * });
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return (
 *   <UserTable
 *     users={data.data}
 *     total={data.total}
 *     page={data.page}
 *     totalPages={data.totalPages}
 *   />
 * );
 * ```
 */
export function useAllUsers(
  pagination: PaginationParams = {},
  enableRealtime: boolean = true
): UseQueryResult<PaginatedResponse<AdminUser>, Error> {
  return useRealtimeQuery<PaginatedResponse<AdminUser>, Error>({
    queryKey: ['admin', 'users', 'list', pagination],
    queryFn: async () => {
      const response = await adminApi.getAllUsers(pagination);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch users');
      }

      return response.data as PaginatedResponse<AdminUser>;
    },
    // Real-time configuration
    realtimeEntity: 'users',
    enableRealtime,
    // User lists change moderately, so medium stale time
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching a single user by ID
 * 
 * Fetches detailed information about a specific user including their role,
 * activity status, and profile data.
 * 
 * @param userId - The ID of the user to fetch
 * @returns Query result with user data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data: user, isLoading, error } = useUserById('user-123');
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return (
 *   <UserProfile
 *     user={user}
 *     email={user.email}
 *     role={user.role}
 *     isActive={user.is_active}
 *   />
 * );
 * ```
 */
export function useUserById(
  userId: string
): UseQueryResult<AdminUser, Error> {
  return useQuery<AdminUser, Error>({
    queryKey: ['admin', 'users', 'detail', userId],
    queryFn: async () => {
      const response = await adminApi.getUserById(userId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch user');
      }

      return response.data as AdminUser;
    },
    // Only fetch if we have a valid userId
    enabled: !!userId,
    // User details change infrequently, so longer stale time
    staleTime: 1000 * 60 * 10, // 10 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching the vetting queue with filters and pagination
 * NOW WITH REAL-TIME UPDATES!
 * 
 * Fetches items pending vetting/review with filtering by entity type, status,
 * priority, and assignee. Supports pagination and sorting.
 * 
 * @param filters - Optional filters for the vetting queue
 * @param pagination - Optional pagination parameters
 * @param enableRealtime - Enable real-time updates (default: true)
 * @returns Query result with paginated vetting queue data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useVettingQueue(
 *   {
 *     status: 'pending',
 *     priority: 'high',
 *     entity_type: 'ngo'
 *   },
 *   { page: 1, limit: 10 }
 * );
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return (
 *   <VettingQueueTable
 *     items={data.data}
 *     total={data.total}
 *     onApprove={handleApprove}
 *     onReject={handleReject}
 *   />
 * );
 * ```
 */
export function useVettingQueue(
  filters: VettingQueueFilters = {},
  pagination: PaginationParams = {},
  enableRealtime: boolean = true
): UseQueryResult<PaginatedResponse<VettingQueue>, Error> {
  return useRealtimeQuery<PaginatedResponse<VettingQueue>, Error>({
    queryKey: ['admin', 'vetting', 'list', filters, pagination],
    queryFn: async () => {
      const response = await adminApi.getVettingQueue(filters, pagination);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch vetting queue');
      }

      return response.data as PaginatedResponse<VettingQueue>;
    },
    // Real-time configuration
    realtimeEntity: 'vetting_queue',
    enableRealtime,
    // Vetting queue needs to be near real-time, so short stale time
    staleTime: 1000 * 60 * 1, // 1 minute
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching audit logs with filters and pagination
 * 
 * Fetches audit trail records with filtering by user, action, entity type,
 * and date range. Supports pagination and sorting.
 * 
 * @param filters - Optional filters for audit logs
 * @param pagination - Optional pagination parameters
 * @returns Query result with paginated audit logs data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useAuditLogs(
 *   {
 *     user_id: 'user-123',
 *     action: 'update_role',
 *     start_date: '2026-01-01',
 *     end_date: '2026-01-31'
 *   },
 *   { page: 1, limit: 50 }
 * );
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * 
 * return (
 *   <AuditLogTable
 *     logs={data.data}
 *     total={data.total}
 *     onExport={handleExport}
 *   />
 * );
 * ```
 */
export function useAuditLogs(
  filters: AuditLogFilters = {},
  pagination: PaginationParams = {}
): UseQueryResult<PaginatedResponse<AuditLog>, Error> {
  return useQuery<PaginatedResponse<AuditLog>, Error>({
    queryKey: ['admin', 'audit', 'list', filters, pagination],
    queryFn: async () => {
      const response = await adminApi.getAuditLogs(filters, pagination);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch audit logs');
      }

      return response.data as PaginatedResponse<AuditLog>;
    },
    // Audit logs are historical data, so medium stale time
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * Type exports for hook return values
 * Makes it easier to type component props that receive these hooks' results
 */
export type UsePlatformStatsReturn = ReturnType<typeof usePlatformStats>;
export type UseAllUsersReturn = ReturnType<typeof useAllUsers>;
export type UseUserByIdReturn = ReturnType<typeof useUserById>;
export type UseVettingQueueReturn = ReturnType<typeof useVettingQueue>;
export type UseAuditLogsReturn = ReturnType<typeof useAuditLogs>;
