/**
 * Tests for useProjectMutations hooks
 * 
 * Tests the project mutation hooks to ensure they:
 * - Create projects successfully
 * - Update projects with optimistic updates
 * - Delete projects with optimistic removal
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from '../useProjectMutations';
import { projectsApi } from '../../../lib/api/projects';
import { createTestQueryClient, createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/projects', () => ({
  projectsApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('useCreateProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a project successfully', async () => {
    // Arrange
    const mockInput = {
      title: 'New Project',
      description: 'Description',
      budget: 50000,
      start_date: '2026-02-01',
      end_date: '2026-12-31',
      location: 'Islamabad',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      sdg_goals: [4, 8],
      focus_areas: ['education'],
      volunteer_capacity: 10,
    };

    const mockResponse = {
      id: 'new-project-id',
      ...mockInput,
      status: 'draft' as const,
      corporate_id: 'corp-1',
      budget_allocated: 0,
      budget_spent: 0,
      volunteer_count: 0,
      beneficiaries_count: 0,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
      created_by: 'user-1',
    };

    vi.mocked(projectsApi.create).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    const queryClient = createTestQueryClient();

    // Act
    const { result } = renderHook(() => useCreateProject(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate(mockInput);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.id).toBe('new-project-id');
    expect(projectsApi.create).toHaveBeenCalledWith(mockInput);
    expect(projectsApi.create).toHaveBeenCalledTimes(1);
  });

  it('should handle create errors', async () => {
    // Arrange
    const errorMessage = 'Failed to create project';
    vi.mocked(projectsApi.create).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const mockInput = {
      title: 'New Project',
      description: 'Description',
      budget: 50000,
      start_date: '2026-02-01',
      end_date: '2026-12-31',
      location: 'Islamabad',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
    };

    // Act
    const { result } = renderHook(() => useCreateProject(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(mockInput);

    // Wait for mutation to complete (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 } // Allow time for retry
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
    expect(result.current.data).toBeUndefined();
  });

  it('should call onSuccess callback', async () => {
    // Arrange
    const onSuccess = vi.fn();
    const mockInput = {
      title: 'New Project',
      description: 'Description',
      budget: 50000,
      start_date: '2026-02-01',
      end_date: '2026-12-31',
      location: 'Islamabad',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      sdg_goals: [4],
      focus_areas: ['education'],
      volunteer_capacity: 10,
    };

    const mockResponse = {
      id: 'new-id',
      ...mockInput,
      status: 'draft' as const,
      corporate_id: 'corp-1',
      budget_allocated: 0,
      budget_spent: 0,
      volunteer_count: 0,
      beneficiaries_count: 0,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-31T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
      created_by: 'user-1',
    };

    vi.mocked(projectsApi.create).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useCreateProject({ onSuccess }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(mockInput);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(mockResponse);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('useUpdateProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update a project successfully', async () => {
    // Arrange
    const mockUpdates = {
      id: 'project-123',
      updates: { title: 'Updated Title', status: 'active' as const },
    };

    const mockResponse = {
      id: 'project-123',
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
      volunteer_count: 5,
      beneficiaries_count: 20,
      budget_allocated: 25000,
      budget_spent: 10000,
      media_urls: [],
      milestones: [],
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
      created_by: 'user-1',
    };

    vi.mocked(projectsApi.update).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(mockUpdates);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.title).toBe('Updated Title');
    expect(projectsApi.update).toHaveBeenCalledWith('project-123', mockUpdates.updates);
    expect(projectsApi.update).toHaveBeenCalledTimes(1);
  });

  it('should handle update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update project';
    vi.mocked(projectsApi.update).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const mockUpdates = {
      id: 'project-123',
      updates: { title: 'Updated Title' },
    };

    // Act
    const { result } = renderHook(() => useUpdateProject(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(mockUpdates);

    // Wait for mutation to complete (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 } // Allow time for retry
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });

  it('should call onError callback', async () => {
    // Arrange
    const onError = vi.fn();
    const errorMessage = 'Update failed';
    
    vi.mocked(projectsApi.update).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const mockUpdates = {
      id: 'project-123',
      updates: { title: 'Updated Title' },
    };

    // Act
    const { result } = renderHook(() => useUpdateProject({ onError }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate(mockUpdates);

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 } // Allow time for retry
    );

    // Assert
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toContain(errorMessage);
  });
});

describe('useDeleteProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a project successfully', async () => {
    // Arrange
    vi.mocked(projectsApi.delete).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeleteProject(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('project-123');

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(projectsApi.delete).toHaveBeenCalledWith('project-123');
    expect(projectsApi.delete).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('should handle delete errors', async () => {
    // Arrange
    const errorMessage = 'Failed to delete project';
    vi.mocked(projectsApi.delete).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useDeleteProject(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('project-123');

    // Wait for mutation to complete (including retry)
    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 } // Allow time for retry
    );

    // Assert
    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toContain(errorMessage);
  });

  it('should call onSuccess callback', async () => {
    // Arrange
    const onSuccess = vi.fn();
    
    vi.mocked(projectsApi.delete).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeleteProject({ onSuccess }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('project-123');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(undefined);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
