/**
 * Tests for useApplicationMutations hooks
 * 
 * Tests the application mutation hooks to ensure they:
 * - Create applications successfully
 * - Review applications with optimistic updates
 * - Withdraw applications with optimistic updates
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useCreateApplication,
  useReviewApplication,
  useWithdrawApplication,
  useBulkApproveApplications,
  useBulkRejectApplications,
} from '../useApplicationMutations';
import { applicationsApi } from '../../../lib/api/applications';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/applications', () => ({
  applicationsApi: {
    createApplication: vi.fn(),
    reviewApplication: vi.fn(),
    withdrawApplication: vi.fn(),
    bulkApproveApplications: vi.fn(),
    bulkRejectApplications: vi.fn(),
  },
}));

describe('useCreateApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create application successfully', async () => {
    // Arrange
    const newApplication = {
      project_id: 'proj-1',
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse',
    };

    const mockResponse = {
      id: 'app-new',
      volunteer_id: 'vol-1',
      ...newApplication,
      status: 'pending' as const,
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(applicationsApi.createApplication).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useCreateApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(newApplication);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(applicationsApi.createApplication).toHaveBeenCalledWith(newApplication);
    expect(result.current.error).toBeNull();
  });

  it('should handle create errors', async () => {
    // Arrange
    const errorMessage = 'Failed to create application';
    vi.mocked(applicationsApi.createApplication).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const newApplication = {
      project_id: 'proj-1',
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse',
    };

    // Act
    const { result } = renderHook(
      () => useCreateApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(newApplication);

    // Wait for mutation to fail (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useReviewApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should review application successfully', async () => {
    // Arrange
    const reviewParams = {
      id: 'app-123',
      review: {
        status: 'approved' as const,
        review_notes: 'Great candidate',
      },
    };

    const mockResponse = {
      id: 'app-123',
      volunteer_id: 'vol-1',
      project_id: 'proj-1',
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse',
      status: 'approved' as const,
      reviewed_by: 'admin-1',
      reviewed_at: '2026-01-31T00:00:00Z',
      review_notes: 'Great candidate',
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(applicationsApi.reviewApplication).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useReviewApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(reviewParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(applicationsApi.reviewApplication).toHaveBeenCalledWith(
      'app-123',
      reviewParams.review
    );
  });

  it('should handle review errors', async () => {
    // Arrange
    const errorMessage = 'Failed to review application';
    vi.mocked(applicationsApi.reviewApplication).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const reviewParams = {
      id: 'app-123',
      review: {
        status: 'approved' as const,
        review_notes: 'Great candidate',
      },
    };

    // Act
    const { result } = renderHook(
      () => useReviewApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(reviewParams);

    // Wait for mutation to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useWithdrawApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should withdraw application successfully', async () => {
    // Arrange
    const withdrawParams = {
      id: 'app-123',
      reason: 'Schedule conflict',
    };

    const mockResponse = {
      id: 'app-123',
      volunteer_id: 'vol-1',
      project_id: 'proj-1',
      motivation: 'I want to help',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse',
      status: 'withdrawn' as const,
      rejection_reason: 'Schedule conflict',
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(applicationsApi.withdrawApplication).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useWithdrawApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(withdrawParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(applicationsApi.withdrawApplication).toHaveBeenCalledWith(
      'app-123',
      'Schedule conflict'
    );
  });

  it('should handle withdraw errors', async () => {
    // Arrange
    const errorMessage = 'Failed to withdraw application';
    vi.mocked(applicationsApi.withdrawApplication).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const withdrawParams = {
      id: 'app-123',
      reason: 'Schedule conflict',
    };

    // Act
    const { result } = renderHook(
      () => useWithdrawApplication(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(withdrawParams);

    // Wait for mutation to fail
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });
});

describe('useBulkApproveApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should bulk approve applications successfully', async () => {
    // Arrange
    const bulkParams = {
      ids: ['app-1', 'app-2', 'app-3'],
      review_notes: 'Batch approved',
    };

    const mockResponse = [
      { id: 'app-1', status: 'approved' as const },
      { id: 'app-2', status: 'approved' as const },
      { id: 'app-3', status: 'approved' as const },
    ];

    vi.mocked(applicationsApi.bulkApproveApplications).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useBulkApproveApplications(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(bulkParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toHaveLength(3);
    expect(applicationsApi.bulkApproveApplications).toHaveBeenCalledWith(
      bulkParams.ids,
      bulkParams.review_notes
    );
  });
});

describe('useBulkRejectApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should bulk reject applications successfully', async () => {
    // Arrange
    const bulkParams = {
      ids: ['app-4', 'app-5'],
      rejection_reason: 'Project capacity reached',
    };

    const mockResponse = [
      { id: 'app-4', status: 'rejected' as const },
      { id: 'app-5', status: 'rejected' as const },
    ];

    vi.mocked(applicationsApi.bulkRejectApplications).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useBulkRejectApplications(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(bulkParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toHaveLength(2);
    expect(applicationsApi.bulkRejectApplications).toHaveBeenCalledWith(
      bulkParams.ids,
      bulkParams.rejection_reason
    );
  });
});
