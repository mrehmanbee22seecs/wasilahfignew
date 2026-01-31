/**
 * Tests for useApplications hook
 * 
 * Tests the applications list query hook to ensure it:
 * - Fetches applications successfully
 * - Handles errors appropriately
 * - Supports filtering and pagination
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApplications } from '../useApplications';
import { applicationsApi } from '../../../lib/api/applications';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/applications', () => ({
  applicationsApi: {
    getPaginatedApplications: vi.fn(),
    getVolunteerApplications: vi.fn(),
  },
}));

describe('useApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch paginated applications for a project successfully', async () => {
    // Arrange
    const mockApplications = {
      data: [
        { 
          id: '1', 
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
          status: 'pending' as const,
          created_at: '2026-01-15T00:00:00Z',
          updated_at: '2026-01-15T00:00:00Z',
        },
        { 
          id: '2', 
          volunteer_id: 'vol-2',
          project_id: 'proj-1',
          motivation: 'Passionate about education',
          availability_start: '2026-03-01',
          availability_end: '2026-08-31',
          hours_per_week: 15,
          skills: ['mentoring', 'communication'],
          emergency_contact_name: 'Jane Smith',
          emergency_contact_phone: '+92-301-7654321',
          emergency_contact_relationship: 'parent',
          status: 'approved' as const,
          reviewed_by: 'admin-1',
          reviewed_at: '2026-01-16T00:00:00Z',
          review_notes: 'Excellent candidate',
          created_at: '2026-01-15T00:00:00Z',
          updated_at: '2026-01-16T00:00:00Z',
        },
      ],
      total: 2,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    vi.mocked(applicationsApi.getPaginatedApplications).mockResolvedValue({
      success: true,
      data: mockApplications,
    });

    // Act
    const { result } = renderHook(
      () => useApplications({ project_id: 'proj-1' }), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockApplications);
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
    expect(result.current.error).toBeNull();
    expect(applicationsApi.getPaginatedApplications).toHaveBeenCalledWith('proj-1', 1, 20, {});
  });

  it('should fetch volunteer applications successfully', async () => {
    // Arrange
    const mockApplications = [
      { 
        id: '1', 
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
        status: 'pending' as const,
        created_at: '2026-01-15T00:00:00Z',
        updated_at: '2026-01-15T00:00:00Z',
      },
    ];

    vi.mocked(applicationsApi.getVolunteerApplications).mockResolvedValue({
      success: true,
      data: mockApplications,
    });

    // Act
    const { result } = renderHook(
      () => useApplications({ volunteer_id: 'vol-1' }), 
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].volunteer_id).toBe('vol-1');
    expect(applicationsApi.getVolunteerApplications).toHaveBeenCalledWith('vol-1', { volunteer_id: 'vol-1' });
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch applications';
    vi.mocked(applicationsApi.getPaginatedApplications).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => useApplications({ project_id: 'proj-1' }), 
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert - error handled
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should support filters', async () => {
    // Arrange
    const filters = {
      project_id: 'proj-1',
      status: 'pending',
    };

    const mockApplications = {
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    };

    vi.mocked(applicationsApi.getPaginatedApplications).mockResolvedValue({
      success: true,
      data: mockApplications,
    });

    // Act
    const { result } = renderHook(
      () => useApplications(filters), 
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - filters passed to API
    expect(applicationsApi.getPaginatedApplications).toHaveBeenCalledWith(
      'proj-1', 
      1, 
      20, 
      { status: 'pending' }
    );
  });

  it('should support pagination', async () => {
    // Arrange
    const filters = {
      project_id: 'proj-1',
    };
    const pagination = {
      page: 2,
      limit: 10,
    };

    const mockApplications = {
      data: [],
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3,
    };

    vi.mocked(applicationsApi.getPaginatedApplications).mockResolvedValue({
      success: true,
      data: mockApplications,
    });

    // Act
    const { result } = renderHook(
      () => useApplications(filters, pagination), 
      { wrapper: createQueryWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - pagination passed to API
    expect(applicationsApi.getPaginatedApplications).toHaveBeenCalledWith(
      'proj-1', 
      2, 
      10, 
      {}
    );
    expect(result.current.data?.page).toBe(2);
  });

  it('should not fetch when no filters provided', async () => {
    // Act
    const { result } = renderHook(
      () => useApplications(), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(applicationsApi.getPaginatedApplications).not.toHaveBeenCalled();
    expect(applicationsApi.getVolunteerApplications).not.toHaveBeenCalled();
  });
});
