/**
 * Tests for useProjects hook
 * 
 * Tests the projects list query hook to ensure it:
 * - Fetches projects successfully
 * - Handles errors appropriately
 * - Supports filtering and pagination
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProjects } from '../useProjects';
import { projectsApi } from '../../../lib/api/projects';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/projects', () => ({
  projectsApi: {
    list: vi.fn(),
  },
}));

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch projects successfully', async () => {
    // Arrange
    const mockProjects = {
      data: [
        { 
          id: '1', 
          title: 'Project 1', 
          status: 'active',
          description: 'Description 1',
          budget: 100000,
          corporate_id: 'corp-1',
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          location: 'Lahore',
          city: 'Lahore',
          province: 'Punjab',
          sdg_goals: [4, 8],
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
        },
        { 
          id: '2', 
          title: 'Project 2', 
          status: 'completed',
          description: 'Description 2',
          budget: 200000,
          corporate_id: 'corp-1',
          start_date: '2026-01-01',
          end_date: '2026-06-30',
          location: 'Karachi',
          city: 'Karachi',
          province: 'Sindh',
          sdg_goals: [3, 10],
          focus_areas: ['health'],
          volunteer_capacity: 20,
          volunteer_count: 15,
          beneficiaries_count: 100,
          budget_allocated: 150000,
          budget_spent: 145000,
          media_urls: [],
          milestones: [],
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-06-30T00:00:00Z',
          created_by: 'user-1',
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(projectsApi.list).mockResolvedValue({
      success: true,
      data: mockProjects,
    });

    // Act
    const { result } = renderHook(() => useProjects(), {
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
    expect(result.current.data).toEqual(mockProjects);
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
    expect(result.current.error).toBeNull();
    expect(projectsApi.list).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch projects';
    vi.mocked(projectsApi.list).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useProjects(), {
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
  });

  it('should support filters', async () => {
    // Arrange
    const filters = {
      status: ['active' as const],
      city: 'Lahore',
    };

    const mockProjects = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    vi.mocked(projectsApi.list).mockResolvedValue({
      success: true,
      data: mockProjects,
    });

    // Act
    const { result } = renderHook(() => useProjects(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - filters passed to API
    expect(projectsApi.list).toHaveBeenCalledWith(filters, {});
  });

  it('should support pagination', async () => {
    // Arrange
    const pagination = {
      page: 2,
      limit: 5,
    };

    const mockProjects = {
      data: [],
      total: 10,
      page: 2,
      limit: 5,
      totalPages: 2,
    };

    vi.mocked(projectsApi.list).mockResolvedValue({
      success: true,
      data: mockProjects,
    });

    // Act
    const { result } = renderHook(() => useProjects({}, pagination), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - pagination passed to API
    expect(projectsApi.list).toHaveBeenCalledWith({}, pagination);
    expect(result.current.data?.page).toBe(2);
  });
});
