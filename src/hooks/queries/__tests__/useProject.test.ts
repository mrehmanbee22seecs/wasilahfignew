/**
 * Tests for useProject hook
 * 
 * Tests the single project query hook to ensure it:
 * - Fetches a project successfully by ID
 * - Handles errors appropriately
 * - Supports conditional fetching (disabled when ID is null)
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProject } from '../useProject';
import { projectsApi } from '../../../lib/api/projects';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/projects', () => ({
  projectsApi: {
    getById: vi.fn(),
  },
}));

describe('useProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a project successfully', async () => {
    // Arrange
    const mockProject = {
      id: 'project-123',
      title: 'Test Project',
      description: 'Test Description',
      status: 'active' as const,
      budget: 100000,
      budget_allocated: 50000,
      budget_spent: 25000,
      corporate_id: 'corp-1',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      location: 'Islamabad',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      sdg_goals: [4, 8, 10],
      focus_areas: ['education', 'employment'],
      volunteer_capacity: 15,
      volunteer_count: 10,
      beneficiaries_count: 50,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z',
      created_by: 'user-1',
    };

    vi.mocked(projectsApi.getById).mockResolvedValue({
      success: true,
      data: mockProject,
    });

    // Act
    const { result } = renderHook(() => useProject('project-123'), {
      wrapper: createQueryWrapper(),
    });

    // Assert - initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockProject);
    expect(result.current.data?.id).toBe('project-123');
    expect(result.current.data?.title).toBe('Test Project');
    expect(result.current.error).toBeNull();
    expect(projectsApi.getById).toHaveBeenCalledWith('project-123');
    expect(projectsApi.getById).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Project not found';
    vi.mocked(projectsApi.getById).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useProject('invalid-id'), {
      wrapper: createQueryWrapper(),
    });

    // Wait for query to complete (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 } // Allow time for retry
    );

    // Assert - error handled
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(projectsApi.getById).toHaveBeenCalledWith('invalid-id');
  });

  it('should not fetch when projectId is null', async () => {
    // Act
    const { result } = renderHook(() => useProject(null), {
      wrapper: createQueryWrapper(),
    });

    // Wait a bit to ensure no fetch occurs
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Assert - query disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
    expect(projectsApi.getById).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('should refetch when projectId changes', async () => {
    // Arrange
    const mockProject1 = {
      id: 'project-1',
      title: 'Project 1',
      description: 'Description 1',
      status: 'active' as const,
      budget: 100000,
      corporate_id: 'corp-1',
      start_date: '2026-01-01',
      end_date: '2026-12-31',
      location: 'Lahore',
      city: 'Lahore',
      province: 'Punjab',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
      volunteer_count: 5,
      beneficiaries_count: 25,
      budget_allocated: 50000,
      budget_spent: 25000,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      created_by: 'user-1',
    };

    const mockProject2 = {
      ...mockProject1,
      id: 'project-2',
      title: 'Project 2',
    };

    vi.mocked(projectsApi.getById)
      .mockResolvedValueOnce({ success: true, data: mockProject1 })
      .mockResolvedValueOnce({ success: true, data: mockProject2 });

    // Act
    const { result, rerender } = renderHook(
      ({ id }) => useProject(id),
      {
        wrapper: createQueryWrapper(),
        initialProps: { id: 'project-1' },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.id).toBe('project-1');

    // Change project ID
    rerender({ id: 'project-2' });

    await waitFor(() => {
      expect(result.current.data?.id).toBe('project-2');
    });

    // Assert - both projects fetched
    expect(projectsApi.getById).toHaveBeenCalledWith('project-1');
    expect(projectsApi.getById).toHaveBeenCalledWith('project-2');
    expect(projectsApi.getById).toHaveBeenCalledTimes(2);
  });
});
