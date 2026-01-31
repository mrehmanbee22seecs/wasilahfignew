/**
 * Query Keys Factory
 * 
 * @fileoverview
 * Centralized query key factory for React Query hooks.
 * Provides type-safe, consistent query keys across all domains.
 * 
 * ## Benefits:
 * - Type-safe query keys with TypeScript autocomplete
 * - Consistent structure across all hooks
 * - Easy invalidation with hierarchical keys
 * - Prevents cache key collisions
 * - DRY principle for query key management
 * 
 * ## Pattern:
 * Each domain has:
 * - `all`: Base key for the domain
 * - `lists()`: Key for list queries
 * - `list(filters)`: Key for filtered lists
 * - `details()`: Key for detail queries
 * - `detail(id)`: Key for specific detail
 * 
 * ## Usage:
 * 
 * ```typescript
 * // In useProjects.ts
 * import { queryKeys } from './queryKeys';
 * 
 * const { data } = useQuery({
 *   queryKey: queryKeys.projects.list(filters),
 *   queryFn: () => fetchProjects(filters)
 * });
 * 
 * // Invalidate all project queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
 * 
 * // Invalidate specific project
 * queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
 * ```
 */

// ============================================================================
// PROJECTS (Task A2) - Already Implemented
// ============================================================================

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: any) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// ============================================================================
// APPLICATIONS (Task A3) - To Be Implemented
// ============================================================================

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters?: any) => [...applicationKeys.lists(), filters] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
  
  // Specialized queries for applications
  byVolunteer: (volunteerId: string, filters?: any) => 
    [...applicationKeys.all, 'by-volunteer', volunteerId, filters] as const,
  byProject: (projectId: string, filters?: any) => 
    [...applicationKeys.all, 'by-project', projectId, filters] as const,
};

// ============================================================================
// VOLUNTEERS (Task A3) - To Be Implemented
// ============================================================================

export const volunteerKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteerKeys.all, 'list'] as const,
  list: (filters?: any) => [...volunteerKeys.lists(), filters] as const,
  details: () => [...volunteerKeys.all, 'detail'] as const,
  detail: (id: string) => [...volunteerKeys.details(), id] as const,
  
  // Specialized queries for volunteers
  applications: (volunteerId: string) => 
    [...volunteerKeys.detail(volunteerId), 'applications'] as const,
  projects: (volunteerId: string) => 
    [...volunteerKeys.detail(volunteerId), 'projects'] as const,
  certificates: (volunteerId: string) => 
    [...volunteerKeys.detail(volunteerId), 'certificates'] as const,
};

// ============================================================================
// PAYMENTS (Task A4) - To Be Implemented
// ============================================================================

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (filters?: any) => [...paymentKeys.lists(), filters] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  
  // Specialized queries for payments
  byCorporate: (corporateId: string, filters?: any) => 
    [...paymentKeys.all, 'by-corporate', corporateId, filters] as const,
  byProject: (projectId: string, filters?: any) => 
    [...paymentKeys.all, 'by-project', projectId, filters] as const,
  approvals: (filters?: any) => 
    [...paymentKeys.all, 'approvals', filters] as const,
};

// ============================================================================
// ORGANIZATIONS (Task A4) - To Be Implemented
// ============================================================================

export const organizationKeys = {
  all: ['organizations'] as const,
  lists: () => [...organizationKeys.all, 'list'] as const,
  list: (filters?: any) => [...organizationKeys.lists(), filters] as const,
  details: () => [...organizationKeys.all, 'detail'] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
  
  // Specialized queries for organizations (NGOs)
  projects: (organizationId: string, filters?: any) => 
    [...organizationKeys.detail(organizationId), 'projects', filters] as const,
  payments: (organizationId: string, filters?: any) => 
    [...organizationKeys.detail(organizationId), 'payments', filters] as const,
  verification: (organizationId: string) => 
    [...organizationKeys.detail(organizationId), 'verification'] as const,
};

// ============================================================================
// ADMIN (Task A5) - To Be Implemented
// ============================================================================

export const adminKeys = {
  all: ['admin'] as const,
  
  // Platform statistics
  stats: () => [...adminKeys.all, 'stats'] as const,
  statsDetailed: (timeRange?: string) => 
    [...adminKeys.all, 'stats', 'detailed', timeRange] as const,
  
  // Vetting queue
  vettingQueue: (filters?: any) => 
    [...adminKeys.all, 'vetting-queue', filters] as const,
  vettingItem: (id: string) => 
    [...adminKeys.all, 'vetting-queue', id] as const,
  
  // Audit logs
  auditLogs: (filters?: any) => 
    [...adminKeys.all, 'audit-logs', filters] as const,
  auditLog: (id: string) => 
    [...adminKeys.all, 'audit-logs', id] as const,
  
  // User management
  users: (filters?: any) => 
    [...adminKeys.all, 'users', filters] as const,
  user: (userId: string) => 
    [...adminKeys.all, 'users', userId] as const,
};

// ============================================================================
// CONSOLIDATED EXPORT
// ============================================================================

/**
 * Centralized query keys for all domains
 * 
 * Usage:
 * ```typescript
 * import { queryKeys } from '@/hooks/queries/queryKeys';
 * 
 * // Use in hooks
 * const { data } = useQuery({
 *   queryKey: queryKeys.projects.list(filters),
 *   queryFn: () => fetchProjects(filters)
 * });
 * 
 * // Invalidate queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
 * ```
 */
export const queryKeys = {
  projects: projectKeys,
  applications: applicationKeys,
  volunteers: volunteerKeys,
  payments: paymentKeys,
  organizations: organizationKeys,
  admin: adminKeys,
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * Type helpers for query key inference
 */
export type QueryKey = ReturnType<typeof queryKeys[keyof typeof queryKeys][keyof typeof queryKeys[keyof typeof queryKeys]]>;

/**
 * Domain names for type-safe domain access
 */
export type QueryDomain = keyof typeof queryKeys;
