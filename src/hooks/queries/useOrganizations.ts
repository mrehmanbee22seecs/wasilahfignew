/**
 * useOrganizations Hook - React Query Hooks for Organizations CRUD
 * 
 * @fileoverview
 * Production-grade React Query hooks for fetching and managing NGO/organization entities.
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
 * - Support for filtering by verification status, location, focus areas
 * - Document management and verification workflows
 * 
 * ## Usage:
 * 
 * ```tsx
 * // Fetch organizations list
 * const { data, isLoading, error } = useOrganizations({ 
 *   verification_status: ['verified'],
 *   city: 'Lahore'
 * });
 * 
 * // Fetch single organization with stats
 * const { data, isLoading } = useOrganization('org-123', true);
 * 
 * // Fetch organization documents
 * const { data: docs } = useOrganizationDocuments('org-123');
 * 
 * // Update organization profile
 * const updateOrg = useUpdateOrganization({
 *   onSuccess: () => toast.success('Profile updated!'),
 * });
 * updateOrg.mutate({
 *   id: 'org-123',
 *   updates: {
 *     description: 'Updated mission statement',
 *     focus_areas: ['education', 'health'],
 *     social_links: {
 *       facebook: 'https://facebook.com/org'
 *     }
 *   }
 * });
 * 
 * // Upload document
 * const uploadDoc = useUploadOrganizationDocument();
 * uploadDoc.mutate({
 *   organizationId: 'org-123',
 *   file: fileObject,
 *   documentType: 'registration'
 * });
 * 
 * // Update verification status
 * const updateVerification = useUpdateOrganizationVerification({
 *   onSuccess: () => toast.success('Verification status updated!'),
 * });
 * updateVerification.mutate({
 *   organizationId: 'org-123',
 *   status: 'verified',
 *   notes: 'All documents verified'
 * });
 * ```
 * 
 * ## Query Key Structure:
 * - List: ['organizations', 'list', filters, pagination]
 * - Detail: ['organizations', 'detail', organizationId, includeStats]
 * - Documents: ['organizations', 'documents', organizationId]
 * - Stats: ['organizations', 'stats', organizationId]
 * - Projects: ['organizations', 'projects', organizationId]
 * 
 * ## Cache Invalidation:
 * - Update: Updates detail cache + invalidates lists
 * - Upload Document: Invalidates documents queries
 * - Verify Document: Updates documents cache + invalidates organization detail
 * - Update Verification: Updates detail cache + invalidates lists
 * 
 * @module hooks/queries/useOrganizations
 * @since 2026-01-31
 * @estimated-time 75-90 minutes
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  ngosApi,
  NGO,
  NGOFilters,
  UpdateNGOInput,
  NGODocument,
} from '../../lib/api/ngos';
import { PaginationParams } from '../../lib/api/base';

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

/**
 * Extended organization data with stats
 */
export interface OrganizationWithStats extends NGO {
  stats?: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBeneficiaries: number;
    totalVolunteers: number;
  };
}

/**
 * React Query hook for fetching organizations list
 * 
 * @param filters - Optional filters for verification status, location, etc.
 * @param pagination - Optional pagination parameters
 * @returns Query result with organizations data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useOrganizations({
 *   verification_status: ['verified'],
 *   city: 'Lahore',
 *   focus_areas: ['education']
 * });
 * 
 * // With pagination
 * const { data } = useOrganizations(
 *   { verification_status: ['verified'] },
 *   { page: 1, limit: 20 }
 * );
 * ```
 */
export function useOrganizations(
  filters?: NGOFilters,
  pagination?: PaginationParams
): UseQueryResult<{ data: NGO[]; total: number; page: number; limit: number }, Error> {
  return useQuery({
    queryKey: ['organizations', 'list', filters, pagination],
    queryFn: async () => {
      const response = await ngosApi.list(filters, pagination);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch organizations');
      }

      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 20,
      };
    },
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching a single organization by ID
 * 
 * @param organizationId - The ID of the organization to fetch (optional)
 * @param includeStats - Whether to include organization statistics (default: false)
 * @returns Query result with organization data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useOrganization('org-123', true);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (!data) return <NotFound />;
 * return <OrganizationProfile organization={data} />;
 * ```
 */
export function useOrganization(
  organizationId?: string,
  includeStats: boolean = false
): UseQueryResult<OrganizationWithStats, Error> {
  return useQuery<OrganizationWithStats, Error>({
    queryKey: ['organizations', 'detail', organizationId, includeStats],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      // Fetch organization profile
      const response = await ngosApi.getById(organizationId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch organization');
      }

      const organization = response.data as NGO;

      // Optionally fetch stats
      if (includeStats) {
        const statsResponse = await ngosApi.getStats(organizationId);

        if (statsResponse.success) {
          return {
            ...organization,
            stats: statsResponse.data,
          };
        }
      }

      return organization;
    },
    // Only fetch if we have an ID
    enabled: !!organizationId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching organization documents
 * 
 * @param organizationId - The ID of the organization to fetch documents for (optional)
 * @returns Query result with documents data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data: docs, isLoading } = useOrganizationDocuments('org-123');
 * ```
 */
export function useOrganizationDocuments(
  organizationId?: string
): UseQueryResult<NGODocument[], Error> {
  return useQuery<NGODocument[], Error>({
    queryKey: ['organizations', 'documents', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      const response = await ngosApi.getDocuments(organizationId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch documents');
      }

      return response.data as NGODocument[];
    },
    // Only fetch if we have an ID
    enabled: !!organizationId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * React Query hook for fetching organization projects
 * 
 * @param organizationId - The ID of the organization to fetch projects for (optional)
 * @returns Query result with projects data, loading state, and error
 * 
 * @example
 * ```tsx
 * const { data: projects, isLoading } = useOrganizationProjects('org-123');
 * ```
 */
export function useOrganizationProjects(
  organizationId?: string
): UseQueryResult<any[], Error> {
  return useQuery<any[], Error>({
    queryKey: ['organizations', 'projects', organizationId],
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('Organization ID is required');
      }

      const response = await ngosApi.getProjects(organizationId);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch organization projects');
      }

      return response.data as any[];
    },
    // Only fetch if we have an ID
    enabled: !!organizationId,
    // Prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Retry once on failure
    retry: 1,
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
  });
}

/**
 * Update organization mutation parameters
 */
interface UpdateOrganizationParams {
  id: string;
  updates: UpdateNGOInput;
}

/**
 * Hook for updating organization profile
 * 
 * Implements optimistic updates: changes appear immediately in the UI,
 * and are rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateOrg = useUpdateOrganization({
 *   onSuccess: () => toast.success('Profile updated!'),
 *   onError: (error) => toast.error(error.message)
 * });
 * 
 * // Usage
 * updateOrg.mutate({
 *   id: 'org-123',
 *   updates: {
 *     description: 'Updated mission statement',
 *     focus_areas: ['education', 'health'],
 *     social_links: {
 *       facebook: 'https://facebook.com/org',
 *       twitter: 'https://twitter.com/org'
 *     }
 *   }
 * });
 * ```
 */
export function useUpdateOrganization(
  options?: MutationOptions<NGO>
): UseMutationResult<NGO, Error, UpdateOrganizationParams> {
  const queryClient = useQueryClient();

  return useMutation<NGO, Error, UpdateOrganizationParams>({
    mutationFn: async ({ id, updates }: UpdateOrganizationParams) => {
      const response = await ngosApi.update(id, updates);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update organization');
      }

      return response.data as NGO;
    },
    onMutate: async ({ id, updates }: UpdateOrganizationParams) => {
      // Cancel any outgoing refetches for this organization
      await queryClient.cancelQueries({ queryKey: ['organizations', 'detail', id] });

      // Snapshot the previous value for rollback
      const previousOrg = queryClient.getQueryData<NGO>(
        ['organizations', 'detail', id]
      );

      // Optimistically update the cache
      if (previousOrg) {
        queryClient.setQueryData<NGO>(
          ['organizations', 'detail', id],
          { ...previousOrg, ...updates }
        );
      }

      // Return context with previous data for rollback
      return { previousOrg, id };
    },
    onSuccess: (data, { id }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['organizations', 'detail', id], data);

      // Invalidate all organization list queries to refetch
      queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { id }, context: any) => {
      // Rollback to previous value on error
      if (context?.previousOrg) {
        queryClient.setQueryData(['organizations', 'detail', id], context.previousOrg);
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ['organizations', 'detail', id] });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Upload document mutation parameters
 */
interface UploadDocumentParams {
  organizationId: string;
  file: File;
  documentType: NGODocument['document_type'];
}

/**
 * Hook for uploading organization documents
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const uploadDoc = useUploadOrganizationDocument({
 *   onSuccess: () => toast.success('Document uploaded!'),
 * });
 * 
 * // Usage
 * uploadDoc.mutate({
 *   organizationId: 'org-123',
 *   file: fileObject,
 *   documentType: 'registration'
 * });
 * ```
 */
export function useUploadOrganizationDocument(
  options?: MutationOptions<NGODocument>
): UseMutationResult<NGODocument, Error, UploadDocumentParams> {
  const queryClient = useQueryClient();

  return useMutation<NGODocument, Error, UploadDocumentParams>({
    mutationFn: async ({ organizationId, file, documentType }: UploadDocumentParams) => {
      const response = await ngosApi.uploadDocument(organizationId, file, documentType);

      if (!response.success) {
        throw new Error(response.error || 'Failed to upload document');
      }

      return response.data as NGODocument;
    },
    onSuccess: (data, { organizationId }) => {
      // Invalidate organization documents queries
      queryClient.invalidateQueries({ 
        queryKey: ['organizations', 'documents', organizationId] 
      });

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
 * Verify document mutation parameters
 */
interface VerifyDocumentParams {
  documentId: string;
  verified: boolean;
  notes?: string;
}

/**
 * Hook for verifying organization documents (admin)
 * 
 * Implements optimistic updates: verification status changes immediately in the UI,
 * and is rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const verifyDoc = useVerifyOrganizationDocument({
 *   onSuccess: () => toast.success('Document verified!'),
 * });
 * 
 * // Usage
 * verifyDoc.mutate({
 *   documentId: 'doc-123',
 *   verified: true,
 *   notes: 'All information validated'
 * });
 * ```
 */
export function useVerifyOrganizationDocument(
  options?: MutationOptions<NGODocument>
): UseMutationResult<NGODocument, Error, VerifyDocumentParams> {
  const queryClient = useQueryClient();

  return useMutation<NGODocument, Error, VerifyDocumentParams>({
    mutationFn: async ({ documentId, verified, notes }: VerifyDocumentParams) => {
      const response = await ngosApi.verifyDocument(documentId, verified, notes);

      if (!response.success) {
        throw new Error(response.error || 'Failed to verify document');
      }

      return response.data as NGODocument;
    },
    onMutate: async ({ documentId, verified }: VerifyDocumentParams) => {
      // Get organization ID from existing document data
      const existingDocs = queryClient.getQueriesData<NGODocument[]>({
        queryKey: ['organizations', 'documents'],
      });

      let organizationId: string | undefined;
      let previousDocs: NGODocument[] | undefined;

      for (const [queryKey, docs] of existingDocs) {
        if (docs) {
          const doc = docs.find((d) => d.id === documentId);
          if (doc) {
            organizationId = doc.ngo_id;
            previousDocs = docs;
            
            // Optimistically update document in cache
            const updatedDocs = docs.map((d) =>
              d.id === documentId ? { ...d, verified } : d
            );
            
            queryClient.setQueryData(queryKey, updatedDocs);
            break;
          }
        }
      }

      return { organizationId, previousDocs };
    },
    onSuccess: (data, variables, context: any) => {
      // Invalidate documents queries for this organization
      if (context?.organizationId) {
        queryClient.invalidateQueries({ 
          queryKey: ['organizations', 'documents', context.organizationId] 
        });

        // Invalidate organization detail (verification status may change)
        queryClient.invalidateQueries({ 
          queryKey: ['organizations', 'detail', context.organizationId] 
        });
      }

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, variables, context: any) => {
      // Rollback on error
      if (context?.organizationId && context?.previousDocs) {
        queryClient.setQueryData(
          ['organizations', 'documents', context.organizationId],
          context.previousDocs
        );
      }

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
 * Update verification status mutation parameters
 */
interface UpdateVerificationParams {
  organizationId: string;
  status: NGO['verification_status'];
  notes?: string;
}

/**
 * Hook for updating organization verification status (admin)
 * 
 * Implements optimistic updates: status changes immediately in the UI,
 * and is rolled back if the server request fails.
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateVerification = useUpdateOrganizationVerification({
 *   onSuccess: () => toast.success('Verification status updated!'),
 * });
 * 
 * // Usage
 * updateVerification.mutate({
 *   organizationId: 'org-123',
 *   status: 'verified',
 *   notes: 'All documents verified'
 * });
 * ```
 */
export function useUpdateOrganizationVerification(
  options?: MutationOptions<NGO>
): UseMutationResult<NGO, Error, UpdateVerificationParams> {
  const queryClient = useQueryClient();

  return useMutation<NGO, Error, UpdateVerificationParams>({
    mutationFn: async ({ organizationId, status, notes }: UpdateVerificationParams) => {
      const response = await ngosApi.updateVerificationStatus(organizationId, status, notes);

      if (!response.success) {
        throw new Error(response.error || 'Failed to update verification status');
      }

      return response.data as NGO;
    },
    onMutate: async ({ organizationId, status }: UpdateVerificationParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: ['organizations', 'detail', organizationId] 
      });

      // Snapshot the previous organization for rollback
      const previousOrg = queryClient.getQueryData<NGO>(
        ['organizations', 'detail', organizationId]
      );

      // Optimistically update status
      if (previousOrg) {
        queryClient.setQueryData<NGO>(
          ['organizations', 'detail', organizationId],
          { ...previousOrg, verification_status: status }
        );
      }

      // Return context for rollback
      return { previousOrg, organizationId };
    },
    onSuccess: (data, { organizationId }) => {
      // Update the detail cache with server response
      queryClient.setQueryData(['organizations', 'detail', organizationId], data);

      // Invalidate all organization queries
      queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(data);
    },
    onError: (error, { organizationId }, context: any) => {
      // Restore organization cache on error
      if (context?.previousOrg) {
        queryClient.setQueryData(
          ['organizations', 'detail', organizationId],
          context.previousOrg
        );
      }

      // Call user's onError callback
      options?.onError?.(error);
    },
    onSettled: (data, error, { organizationId }) => {
      // Ensure cache is in sync
      queryClient.invalidateQueries({ 
        queryKey: ['organizations', 'detail', organizationId] 
      });

      // Call user's onSettled callback
      options?.onSettled?.();
    },
    // Retry once on failure
    retry: 1,
  });
}

/**
 * Upload logo mutation parameters
 */
interface UploadLogoParams {
  organizationId: string;
  file: File;
}

/**
 * Hook for uploading organization logo
 * 
 * @param options - Optional callbacks for success, error, and settled states
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 * 
 * @example
 * ```tsx
 * const uploadLogo = useUploadOrganizationLogo({
 *   onSuccess: () => toast.success('Logo uploaded!'),
 * });
 * 
 * // Usage
 * uploadLogo.mutate({
 *   organizationId: 'org-123',
 *   file: logoFile
 * });
 * ```
 */
export function useUploadOrganizationLogo(
  options?: MutationOptions<string>
): UseMutationResult<string, Error, UploadLogoParams> {
  const queryClient = useQueryClient();

  return useMutation<string, Error, UploadLogoParams>({
    mutationFn: async ({ organizationId, file }: UploadLogoParams) => {
      const response = await ngosApi.uploadLogo(organizationId, file);

      if (!response.success) {
        throw new Error(response.error || 'Failed to upload logo');
      }

      return response.data as string;
    },
    onSuccess: (logoUrl, { organizationId }) => {
      // Update organization cache with new logo URL
      const existingOrg = queryClient.getQueryData<NGO>([
        'organizations',
        'detail',
        organizationId,
      ]);

      if (existingOrg) {
        queryClient.setQueryData(['organizations', 'detail', organizationId], {
          ...existingOrg,
          logo_url: logoUrl,
        });
      }

      // Invalidate organization lists
      queryClient.invalidateQueries({ queryKey: ['organizations', 'list'] });

      // Call user's onSuccess callback
      options?.onSuccess?.(logoUrl);
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
 * Type exports for hook return values
 * Makes it easier to type component props that receive these hooks' results
 */
export type UseOrganizationsReturn = ReturnType<typeof useOrganizations>;
export type UseOrganizationReturn = ReturnType<typeof useOrganization>;
export type UseOrganizationDocumentsReturn = ReturnType<typeof useOrganizationDocuments>;
export type UseOrganizationProjectsReturn = ReturnType<typeof useOrganizationProjects>;
export type UseUpdateOrganizationReturn = ReturnType<typeof useUpdateOrganization>;
export type UseUploadOrganizationDocumentReturn = ReturnType<typeof useUploadOrganizationDocument>;
export type UseVerifyOrganizationDocumentReturn = ReturnType<typeof useVerifyOrganizationDocument>;
export type UseUpdateOrganizationVerificationReturn = ReturnType<typeof useUpdateOrganizationVerification>;
export type UseUploadOrganizationLogoReturn = ReturnType<typeof useUploadOrganizationLogo>;
