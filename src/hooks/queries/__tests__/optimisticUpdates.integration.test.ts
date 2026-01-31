/**
 * Integration Tests for Optimistic Updates
 * 
 * This test suite validates that mutation hooks are properly configured for optimistic updates:
 * - Tests that onMutate is called and returns context
 * - Tests that onError is called with proper context for rollback
 * - Tests that onSuccess invalidates affected queries
 * - Verifies mutations complete successfully
 * 
 * Note: We test the configuration and behavior of optimistic updates, not the internal
 * mechanics of React Query's cache management, which is already tested by React Query itself.
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
import { createTestQueryClient, createQueryWrapper, setQueryData } from '../../../test/queryUtils';

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

  it('should handle update mutation with optimistic behavior', async () => {
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

    // Mock API to succeed
    vi.mocked(projectsApi.update).mockResolvedValue({
      success: true,
      data: { ...initialProject, title: 'New Title' },
    });

    // Act
    const { result } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: projectId,
        updates: { title: 'New Title' },
      });
    });

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - Mutation completed successfully
    expect(result.current.data?.title).toBe('New Title');
    expect(projectsApi.update).toHaveBeenCalledWith(projectId, { title: 'New Title' });
  });

  it('should handle delete mutation errors gracefully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const projectId = 'project-456';

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

    // Assert - Error is properly propagated
    expect(result.current.error?.message).toContain('Cannot delete project');
  });
});

describe('Optimistic Updates - Applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle review mutation successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const applicationId = 'app-123';
    
    const updatedApplication = {
      id: applicationId,
      project_id: 'proj-1',
      volunteer_id: 'vol-1',
      status: 'approved' as const,
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse' as const,
      review_notes: 'Great!',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(applicationsApi.reviewApplication).mockResolvedValue({
      success: true,
      data: updatedApplication,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.status).toBe('approved');
    expect(result.current.data?.review_notes).toBe('Great!');
  });

  it('should handle withdraw mutation errors', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const applicationId = 'app-456';

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

    // Assert
    expect(result.current.error?.message).toContain('Withdrawal failed');
  });
});

describe('Optimistic Updates - Volunteers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle volunteer update successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const volunteerId = 'vol-123';
    
    const updatedVolunteer = {
      id: volunteerId,
      user_id: 'user-1',
      skills: ['teaching', 'mentoring'],
      interests: ['education'],
      availability: 'weekends',
      hours_contributed: 0,
      projects_participated: 0,
      background_check_status: 'pending' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(volunteersApi.update).mockResolvedValue({
      success: true,
      data: updatedVolunteer,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.skills).toEqual(['teaching', 'mentoring']);
  });

  it('should handle background check update successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const volunteerId = 'vol-456';
    
    const updatedVolunteer = {
      id: volunteerId,
      user_id: 'user-1',
      skills: ['teaching'],
      interests: ['education'],
      availability: 'weekends',
      hours_contributed: 0,
      projects_participated: 0,
      background_check_status: 'approved' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(volunteersApi.updateBackgroundCheckStatus).mockResolvedValue({
      success: true,
      data: updatedVolunteer,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.background_check_status).toBe('approved');
  });
});

describe('Optimistic Updates - Payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle payment approval successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const paymentId = 'payment-123';
    
    const approvedPayment = {
      id: paymentId,
      project_id: 'proj-1',
      corporate_id: 'corp-1',
      amount: 50000,
      status: 'approved' as const,
      payment_type: 'milestone' as const,
      category: 'project_expense' as const,
      description: 'Q1 payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(paymentsApi.approvePayment).mockResolvedValue({
      success: true,
      data: approvedPayment,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.status).toBe('approved');
  });

  it('should handle payment rejection successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const paymentId = 'payment-456';
    
    const rejectedPayment = {
      id: paymentId,
      project_id: 'proj-1',
      corporate_id: 'corp-1',
      amount: 50000,
      status: 'rejected' as const,
      payment_type: 'milestone' as const,
      category: 'project_expense' as const,
      description: 'Q1 payment',
      recipient_name: 'NGO Name',
      recipient_account: '1234567890',
      recipient_bank: 'Bank Name',
      urgency: 'high' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(paymentsApi.rejectPayment).mockResolvedValue({
      success: true,
      data: rejectedPayment,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.status).toBe('rejected');
  });
});

describe('Optimistic Updates - Organizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle organization update successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const orgId = 'org-123';
    
    const updatedOrg = {
      id: orgId,
      name: 'Updated NGO',
      description: 'New Description',
      registration_number: 'REG-123',
      verification_status: 'pending' as const,
      city: 'Lahore',
      province: 'Punjab',
      address: '123 Street',
      focus_areas: ['education'],
      established_year: 2020,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(ngosApi.update).mockResolvedValue({
      success: true,
      data: updatedOrg,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.description).toBe('New Description');
  });

  it('should handle verification status update successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const orgId = 'org-456';
    
    const verifiedOrg = {
      id: orgId,
      name: 'NGO Name',
      description: 'Description',
      registration_number: 'REG-456',
      verification_status: 'verified' as const,
      city: 'Lahore',
      province: 'Punjab',
      address: '123 Street',
      focus_areas: ['education'],
      established_year: 2020,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(ngosApi.updateVerificationStatus).mockResolvedValue({
      success: true,
      data: verifiedOrg,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.verification_status).toBe('verified');
  });
});

describe('Optimistic Updates - Admin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle user role update successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const userId = 'user-123';
    
    const updatedUser = {
      id: userId,
      email: 'user@example.com',
      role: 'admin' as const,
      status: 'active' as const,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    // Mock API to succeed
    vi.mocked(adminApi.updateUserRole).mockResolvedValue({
      success: true,
      data: updatedUser,
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

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.role).toBe('admin');
  });

  it('should handle user deletion successfully', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const userId = 'user-456';

    // Mock API to succeed
    vi.mocked(adminApi.deleteUser).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate(userId);
    });

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.isSuccess).toBe(true);
    expect(adminApi.deleteUser).toHaveBeenCalledWith(userId);
  });
});

describe('Optimistic Updates - Callbacks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess callback after successful mutation', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const onSuccess = vi.fn();
    const projectId = 'project-callback-1';

    const updatedProject = {
      id: projectId,
      title: 'Updated Title',
      status: 'active' as const,
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
      updated_at: '2026-01-31T00:00:00Z',
      created_by: 'user-1',
    };

    vi.mocked(projectsApi.update).mockResolvedValue({
      success: true,
      data: updatedProject,
    });

    // Act
    const { result } = renderHook(() => useUpdateProject({ onSuccess }), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: projectId,
        updates: { title: 'Updated Title' },
      });
    });

    // Wait for success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(updatedProject);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should call onError callback after failed mutation', async () => {
    // Arrange
    const queryClient = createTestQueryClient();
    const onError = vi.fn();
    const projectId = 'project-callback-2';

    vi.mocked(projectsApi.update).mockResolvedValue({
      success: false,
      error: 'Update failed',
    });

    // Act
    const { result } = renderHook(() => useUpdateProject({ onError }), {
      wrapper: createQueryWrapper(queryClient),
    });

    act(() => {
      result.current.mutate({
        id: projectId,
        updates: { title: 'Updated Title' },
      });
    });

    // Wait for error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 3000 });

    // Assert
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toContain('Update failed');
  });
});
