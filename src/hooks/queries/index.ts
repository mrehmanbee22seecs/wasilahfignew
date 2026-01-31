/**
 * Query Hooks - Centralized Exports
 * 
 * @fileoverview
 * Central export point for all React Query hooks (Projects, Applications, Volunteers, Payments, Organizations).
 * Provides easy imports for consuming components.
 * 
 * @example
 * ```tsx
 * // Projects
 * import { useProjects, useProject, useCreateProject } from '@/hooks/queries';
 * 
 * // Applications
 * import { useApplications, useApplication, useCreateApplication } from '@/hooks/queries';
 * 
 * // Volunteers
 * import { useVolunteers, useVolunteer, useUpdateVolunteer } from '@/hooks/queries';
 * 
 * // Payments
 * import { usePayments, usePayment, useApprovePayment } from '@/hooks/queries';
 * 
 * // Organizations
 * import { useOrganizations, useOrganization, useUpdateOrganization } from '@/hooks/queries';
 * ```
 * 
 * @module hooks/queries
 * @since 2026-01-31
 */

// ============================================================================
// PROJECT HOOKS
// ============================================================================

// Query hooks
export { useProjects } from './useProjects';
export { useProject } from './useProject';

// Mutation hooks
export {
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from './useProjectMutations';

// Type exports
export type { UseProjectsReturn } from './useProjects';
export type { UseProjectReturn } from './useProject';
export type {
  UseCreateProjectReturn,
  UseUpdateProjectReturn,
  UseDeleteProjectReturn,
} from './useProjectMutations';

// ============================================================================
// APPLICATION HOOKS
// ============================================================================

// Query hooks
export { useApplications } from './useApplications';
export { useApplication } from './useApplication';

// Mutation hooks
export {
  useCreateApplication,
  useReviewApplication,
  useWithdrawApplication,
  useBulkApproveApplications,
  useBulkRejectApplications,
} from './useApplicationMutations';

// Type exports
export type { UseApplicationsReturn } from './useApplications';
export type { UseApplicationReturn } from './useApplication';
export type {
  UseCreateApplicationReturn,
  UseReviewApplicationReturn,
  UseWithdrawApplicationReturn,
  UseBulkApproveApplicationsReturn,
  UseBulkRejectApplicationsReturn,
} from './useApplicationMutations';

// ============================================================================
// VOLUNTEER HOOKS
// ============================================================================

// Query hooks
export { useVolunteers } from './useVolunteersQuery';
export { useVolunteer } from './useVolunteer';

// Mutation hooks
export {
  useUpdateVolunteer,
  useLogVolunteerHours,
  useApproveVolunteerHours,
  useRequestBackgroundCheck,
  useUpdateBackgroundCheck,
} from './useVolunteerMutations';

// Type exports
export type { UseVolunteersReturn } from './useVolunteersQuery';
export type { UseVolunteerReturn } from './useVolunteer';
export type {
  UseUpdateVolunteerReturn,
  UseLogVolunteerHoursReturn,
  UseApproveVolunteerHoursReturn,
  UseRequestBackgroundCheckReturn,
  UseUpdateBackgroundCheckReturn,
} from './useVolunteerMutations';

// ============================================================================
// PAYMENT HOOKS
// ============================================================================

// Query hooks
export {
  usePayments,
  usePayment,
  usePaymentsByProject,
  usePaymentStats,
} from './usePayments';

// Mutation hooks
export {
  useCreatePayment,
  useApprovePayment,
  useRejectPayment,
  useDualApprovePayment,
} from './usePayments';

// Type exports
export type {
  UsePaymentsReturn,
  UsePaymentReturn,
  UsePaymentsByProjectReturn,
  UsePaymentStatsReturn,
  UseCreatePaymentReturn,
  UseApprovePaymentReturn,
  UseRejectPaymentReturn,
  UseDualApprovePaymentReturn,
} from './usePayments';

// ============================================================================
// ORGANIZATION HOOKS
// ============================================================================

// Query hooks
export {
  useOrganizations,
  useOrganization,
  useOrganizationDocuments,
  useOrganizationProjects,
} from './useOrganizations';

// Mutation hooks
export {
  useUpdateOrganization,
  useUploadOrganizationDocument,
  useVerifyOrganizationDocument,
  useUpdateOrganizationVerification,
  useUploadOrganizationLogo,
} from './useOrganizations';

// Type exports
export type {
  UseOrganizationsReturn,
  UseOrganizationReturn,
  UseOrganizationDocumentsReturn,
  UseOrganizationProjectsReturn,
  UseUpdateOrganizationReturn,
  UseUploadOrganizationDocumentReturn,
  UseVerifyOrganizationDocumentReturn,
  UseUpdateOrganizationVerificationReturn,
  UseUploadOrganizationLogoReturn,
} from './useOrganizations';
