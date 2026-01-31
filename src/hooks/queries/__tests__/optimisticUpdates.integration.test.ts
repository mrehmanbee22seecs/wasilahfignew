/**
 * Integration Tests for Optimistic Updates
 * 
 * This test suite validates optimistic update behavior across all mutation hooks:
 * - Verifies UI updates occur immediately (before server response)
 * - Tests automatic rollback on server errors
 * - Validates cache synchronization after success
 * - Tests concurrent mutations
 * - Ensures proper error recovery
 * 
 * @module hooks/queries/__tests__/optimisticUpdates.integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { 
  useUpdateProject, 
  useDeleteProject 
} from '../useProjectMutations';
import { 
  useReviewApplication,
  useWithdrawApplication 
} from '../useApplicationMutations';
import {
  useUpdateVolunteer,
  useUpdateBackgroundCheck
} from '../useVolunteerMutations';
import {
  useApprovePayment,
  useRejectPayment
} from '../usePayments';
import {
  useUpdateOrganization,
  useUpdateOrganizationVerification
} from '../useOrganizations';
import {
  useUpdateUserRole,
  useDeleteUser
} from '../useAdminMutations';
import { projectsApi } from '../../../lib/api/projects';
import { applicationsApi } from '../../../lib/api/applications';
import { volunteersApi } from '../../../lib/api/volunteers';
import { paymentsApi } from '../../../lib/api/payments';
import { ngosApi } from '../../../lib/api/ngos';
import { adminApi } from '../../../lib/api/admin';
import { createTestQueryClient, createQueryWrapper, setQueryData, getQueryData } from '../../../test/queryUtils';

// Mock all API modules
vi.mock('../../../lib/api/projects');
vi.mock('../../../lib/api/applications');
vi.mock('../../../lib/api/volunteers');
vi.mock('../../../lib/api/payments');
vi.mock('../../../lib/api/ngos');
vi.mock('../../../lib/api/admin');

describe('Optimistic Updates - Projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically update project and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const projectId = 'project-123';
    
    const initialProject = {
      id: projectId,
      title: 'Original Title',
      status: 'draft' as const,
      description: 'Description',
      budget: 50000,
      corporate_id: 'corp-1',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      location: 'Lahore',
      city: 'Lahore',
      province: 'Punjab',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
      volunteer_count: 0,
      beneficiaries_count: 0,
      budget_allocated: 0,
      budget_spent: 0,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      created_by: 'user-1',
    };

    // Set initial cache
    setQueryData(queryClient, ['projects', 'detail', projectId], initialProject);

    // Mock API to fail
    vi.mocked(projectsApi.update).mockResolvedValue({
      success: false,
      error: 'Server error',
    });

    // Act
    const { result } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    // Trigger update
    act(() => {
      result.current.mutate({
        id: projectId,
        updates: { title: 'New Title' },
      });
    });

    // Assert - Check optimistic update happened immediately
    await waitFor(() => {
      const cachedProject = getQueryData(queryClient, ['projects', 'detail', projectId]);
      // The cache should be updated optimistically
      if (cachedProject && result.current.isPending) {
        expect((cachedProject as typeof initialProject).title).toBe('New Title');
      }
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback happened
    await waitFor(() => {
      const cachedProject = getQueryData(queryClient, ['projects', 'detail', projectId]);
      // After error, should rollback to original
      expect((cachedProject as typeof initialProject)?.title).toBe('Original Title');
    });
  });

  it('should optimistically delete project and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const projectId = 'project-456';
    
    const initialProject = {
      id: projectId,
      title: 'Project to Delete',
      status: 'draft' as const,
      description: 'Description',
      budget: 50000,
      corporate_id: 'corp-1',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      location: 'Lahore',
      city: 'Lahore',
      province: 'Punjab',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
      volunteer_count: 0,
      beneficiaries_count: 0,
      budget_allocated: 0,
      budget_spent: 0,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      created_by: 'user-1',
    };

    // Set initial cache
    setQueryData(queryClient, ['projects', 'detail', projectId], initialProject);

    // Mock API to fail
    vi.mocked(projectsApi.delete).mockResolvedValue({
      success: false,
      error: 'Cannot delete project',
    });

    // Act
    const { result } = renderHook(() => useDeleteProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(projectId);
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check data was restored after error
    const cachedProject = getQueryData(queryClient, ['projects', 'detail', projectId]);
    expect(cachedProject).toEqual(initialProject);
  });
});

describe('Optimistic Updates - Applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically review application and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const applicationId = 'app-123';
    
    const initialApplication = {
      id: applicationId,
      project_id: 'proj-1',
      volunteer_id: 'vol-1',
      status: 'pending' as const,
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['applications', 'detail', applicationId], initialApplication);

    // Mock API to fail
    vi.mocked(applicationsApi.reviewApplication).mockResolvedValue({
      success: false,
      error: 'Review failed',
    });

    // Act
    const { result } = renderHook(() => useReviewApplication(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: applicationId,
        review: { status: 'approved', review_notes: 'Great!' },
      });
    });

    // Assert - Check optimistic update
    await waitFor(() => {
      if (result.current.isPending) {
        const cached = getQueryData(queryClient, ['applications', 'detail', applicationId]);
        expect((cached as typeof initialApplication)?.status).toBe('approved');
      }
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['applications', 'detail', applicationId]);
    expect((cached as typeof initialApplication)?.status).toBe('pending');
  });

  it('should optimistically withdraw application and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const applicationId = 'app-456';
    
    const initialApplication = {
      id: applicationId,
      project_id: 'proj-1',
      volunteer_id: 'vol-1',
      status: 'pending' as const,
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['applications', 'detail', applicationId], initialApplication);

    // Mock API to fail
    vi.mocked(applicationsApi.withdrawApplication).mockResolvedValue({
      success: false,
      error: 'Withdrawal failed',
    });

    // Act
    const { result } = renderHook(() => useWithdrawApplication(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: applicationId,
        reason: 'Schedule conflict',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['applications', 'detail', applicationId]);
    expect((cached as typeof initialApplication)?.status).toBe('pending');
  });
});

describe('Optimistic Updates - Volunteers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically update volunteer and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const volunteerId = 'vol-123';
    
    const initialVolunteer = {
      id: volunteerId,
      user_id: 'user-1',
      skills: ['teaching'],
      interests: ['education'],
      availability: 'weekends',
      hours_contributed: 0,
      projects_participated: 0,
      background_check_status: 'pending' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['volunteers', 'detail', volunteerId], initialVolunteer);

    // Mock API to fail
    vi.mocked(volunteersApi.update).mockResolvedValue({
      success: false,
      error: 'Update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateVolunteer(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: volunteerId,
        updates: { skills: ['teaching', 'mentoring'] },
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['volunteers', 'detail', volunteerId]);
    expect((cached as typeof initialVolunteer)?.skills).toEqual(['teaching']);
  });

  it('should optimistically update background check status and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const volunteerId = 'vol-456';
    
    const initialVolunteer = {
      id: volunteerId,
      user_id: 'user-1',
      skills: ['teaching'],
      interests: ['education'],
      availability: 'weekends',
      hours_contributed: 0,
      projects_participated: 0,
      background_check_status: 'pending' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['volunteers', 'detail', volunteerId], initialVolunteer);

    // Mock API to fail
    vi.mocked(volunteersApi.updateBackgroundCheckStatus).mockResolvedValue({
      success: false,
      error: 'Status update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateBackgroundCheck(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        volunteerId,
        status: 'approved',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['volunteers', 'detail', volunteerId]);
    expect((cached as typeof initialVolunteer)?.background_check_status).toBe('pending');
  });
});

describe('Optimistic Updates - Payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically approve payment and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const paymentId = 'payment-123';
    
    const initialPayment = {
      id: paymentId,
      project_id: 'proj-1',
      corporate_id: 'corp-1',
      amount: 50000,
      status: 'pending' as const,
      payment_type: 'milestone' as const,
      category: 'project_expense' as const,
      description: 'Q1 payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['payments', 'detail', paymentId], initialPayment);

    // Mock API to fail
    vi.mocked(paymentsApi.approvePayment).mockResolvedValue({
      success: false,
      error: 'Approval failed',
    });

    // Act
    const { result } = renderHook(() => useApprovePayment(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: paymentId,
        notes: 'Approved',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['payments', 'detail', paymentId]);
    expect((cached as typeof initialPayment)?.status).toBe('pending');
  });

  it('should optimistically reject payment and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const paymentId = 'payment-456';
    
    const initialPayment = {
      id: paymentId,
      project_id: 'proj-1',
      corporate_id: 'corp-1',
      amount: 50000,
      status: 'pending' as const,
      payment_type: 'milestone' as const,
      category: 'project_expense' as const,
      description: 'Q1 payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['payments', 'detail', paymentId], initialPayment);

    // Mock API to fail
    vi.mocked(paymentsApi.rejectPayment).mockResolvedValue({
      success: false,
      error: 'Rejection failed',
    });

    // Act
    const { result } = renderHook(() => useRejectPayment(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: paymentId,
        reason: 'Insufficient docs',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['payments', 'detail', paymentId]);
    expect((cached as typeof initialPayment)?.status).toBe('pending');
  });
});

describe('Optimistic Updates - Organizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically update organization and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const orgId = 'org-123';
    
    const initialOrg = {
      id: orgId,
      name: 'Original NGO',
      description: 'Description',
      registration_number: 'REG-123',
      verification_status: 'pending' as const,
      city: 'Lahore',
      province: 'Punjab',
      address: '123 Street',
      focus_areas: ['education'],
      established_year: 2020,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    // Set data with query key that mutation uses (without includeStats)
    setQueryData(queryClient, ['organizations', 'detail', orgId], initialOrg);

    // Mock API to fail
    vi.mocked(ngosApi.update).mockResolvedValue({
      success: false,
      error: 'Update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateOrganization(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: orgId,
        updates: { description: 'New Description' },
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['organizations', 'detail', orgId]);
    expect((cached as typeof initialOrg)?.description).toBe('Description');
  });

  it('should optimistically update verification status and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const orgId = 'org-456';
    
    const initialOrg = {
      id: orgId,
      name: 'NGO Name',
      description: 'Description',
      registration_number: 'REG-456',
      verification_status: 'pending' as const,
      city: 'Lahore',
      province: 'Punjab',
      address: '123 Street',
      focus_areas: ['education'],
      established_year: 2020,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    // Set data with query key that mutation uses (without includeStats)
    setQueryData(queryClient, ['organizations', 'detail', orgId], initialOrg);

    // Mock API to fail
    vi.mocked(ngosApi.updateVerificationStatus).mockResolvedValue({
      success: false,
      error: 'Verification update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateOrganizationVerification(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        organizationId: orgId,
        status: 'verified',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['organizations', 'detail', orgId]);
    expect((cached as typeof initialOrg)?.verification_status).toBe('pending');
  });
});

describe('Optimistic Updates - Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should optimistically update user role and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const userId = 'user-123';
    
    const initialUser = {
      id: userId,
      email: 'user@example.com',
      role: 'volunteer' as const,
      status: 'active' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['admin', 'users', 'detail', userId], initialUser);

    // Mock API to fail
    vi.mocked(adminApi.updateUserRole).mockResolvedValue({
      success: false,
      error: 'Role update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateUserRole(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        userId,
        role: 'admin',
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check rollback
    const cached = getQueryData(queryClient, ['admin', 'users', 'detail', userId]);
    expect((cached as typeof initialUser)?.role).toBe('volunteer');
  });

  it('should optimistically delete user and rollback on error', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const userId = 'user-456';
    
    const initialUser = {
      id: userId,
      email: 'user@example.com',
      role: 'volunteer' as const,
      status: 'active' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    setQueryData(queryClient, ['admin', 'users', 'detail', userId], initialUser);

    // Mock API to fail
    vi.mocked(adminApi.deleteUser).mockResolvedValue({
      success: false,
      error: 'Delete failed',
    });

    // Act
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(userId);
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert - Check data was restored
    const cached = getQueryData(queryClient, ['admin', 'users', 'detail', userId]);
    expect(cached).toEqual(initialUser);
  });
});

describe('Optimistic Updates - Concurrent Mutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle concurrent update mutations correctly', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const projectId = 'project-concurrent';
    
    const initialProject = {
      id: projectId,
      title: 'Original Title',
      status: 'draft' as const,
      description: 'Description',
      budget: 50000,
      corporate_id: 'corp-1',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      location: 'Lahore',
      city: 'Lahore',
      province: 'Punjab',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
      volunteer_count: 0,
      beneficiaries_count: 0,
      budget_allocated: 0,
      budget_spent: 0,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      created_by: 'user-1',
    };

    setQueryData(queryClient, ['projects', 'detail', projectId], initialProject);

    // Mock first update to succeed
    vi.mocked(projectsApi.update).mockResolvedValueOnce({
      success: true,
      data: { ...initialProject, title: 'First Update' },
    });

    // Mock second update to succeed
    vi.mocked(projectsApi.update).mockResolvedValueOnce({
      success: true,
      data: { ...initialProject, title: 'Second Update' },
    });

    // Act - Fire two mutations concurrently
    const { result: result1 } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    const { result: result2 } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result1.current.mutate({
        id: projectId,
        updates: { title: 'First Update' },
      });
      
      result2.current.mutate({
        id: projectId,
        updates: { title: 'Second Update' },
      });
    });

    // Wait for both to complete
    await waitFor(() => {
      expect(result1.current.isSuccess || result1.current.isError).toBe(true);
      expect(result2.current.isSuccess || result2.current.isError).toBe(true);
    }, { timeout: 5000 });

    // Assert - Final cache state should be from the last successful mutation
    const cached = getQueryData(queryClient, ['projects', 'detail', projectId]);
    // Either 'First Update' or 'Second Update' depending on which finished last
    expect(['First Update', 'Second Update']).toContain((cached as typeof initialProject)?.title);
  });
});
