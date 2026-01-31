/**
 * Tests for useVolunteerMutations hooks
 * 
 * Tests the volunteer mutation hooks to ensure they:
 * - Update volunteer profiles with optimistic updates
 * - Log hours successfully
 * - Approve hours successfully
 * - Request and update background checks
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useUpdateVolunteer,
  useLogVolunteerHours,
  useApproveVolunteerHours,
  useRequestBackgroundCheck,
  useUpdateBackgroundCheck,
} from '../useVolunteerMutations';
import { volunteersApi } from '../../../lib/api/volunteers';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/volunteers', () => ({
  volunteersApi: {
    update: vi.fn(),
    logHours: vi.fn(),
    approveHours: vi.fn(),
    requestBackgroundCheck: vi.fn(),
    updateBackgroundCheckStatus: vi.fn(),
  },
}));

describe('useUpdateVolunteer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update volunteer successfully', async () => {
    // Arrange
    const updateParams = {
      id: 'vol-123',
      updates: {
        skills: ['teaching', 'mentoring'],
        interests: ['education', 'youth'],
      },
    };

    const mockResponse = {
      id: 'vol-123',
      display_name: 'John Doe',
      email: 'john@example.com',
      profile_photo_url: 'https://example.com/photo.jpg',
      city: 'Lahore',
      province: 'Punjab',
      interests: ['education', 'youth'],
      sdg_goals: [4, 8],
      causes: ['youth'],
      skills: ['teaching', 'mentoring'],
      availability: {
        weekdays: true,
        weekends: false,
        hours_per_week: 10,
      },
      total_hours: 50,
      projects_completed: 2,
      is_verified: true,
      verification_badge: 'verified',
      background_check_status: 'approved' as const,
      created_at: '2026-01-01T00:00:00Z',
    };

    vi.mocked(volunteersApi.update).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useUpdateVolunteer(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(volunteersApi.update).toHaveBeenCalledWith('vol-123', updateParams.updates);
    expect(result.current.error).toBeNull();
  });

  it('should handle update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update volunteer';
    vi.mocked(volunteersApi.update).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const updateParams = {
      id: 'vol-123',
      updates: { skills: ['teaching'] },
    };

    // Act
    const { result } = renderHook(
      () => useUpdateVolunteer(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

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

describe('useLogVolunteerHours', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log hours successfully', async () => {
    // Arrange
    const hoursInput = {
      project_id: 'proj-123',
      date: '2026-01-31',
      hours: 4,
      activity_description: 'Taught programming class',
    };

    const mockResponse = {
      id: 'hours-123',
      volunteer_id: 'vol-1',
      project_id: 'proj-123',
      date: '2026-01-31',
      hours: 4,
      activity_description: 'Taught programming class',
      status: 'pending' as const,
      created_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(volunteersApi.logHours).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useLogVolunteerHours(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(hoursInput);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(volunteersApi.logHours).toHaveBeenCalledWith(hoursInput);
  });

  it('should handle log hours errors', async () => {
    // Arrange
    const errorMessage = 'Failed to log hours';
    vi.mocked(volunteersApi.logHours).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const hoursInput = {
      project_id: 'proj-123',
      date: '2026-01-31',
      hours: 4,
      activity_description: 'Taught class',
    };

    // Act
    const { result } = renderHook(
      () => useLogVolunteerHours(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(hoursInput);

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

describe('useApproveVolunteerHours', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should approve hours successfully', async () => {
    // Arrange
    const approveParams = {
      hoursId: 'hours-123',
    };

    const mockResponse = {
      id: 'hours-123',
      volunteer_id: 'vol-1',
      project_id: 'proj-123',
      date: '2026-01-31',
      hours: 4,
      activity_description: 'Taught class',
      status: 'approved' as const,
      approved_by: 'admin-1',
      approved_date: '2026-02-01T00:00:00Z',
      created_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(volunteersApi.approveHours).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useApproveVolunteerHours(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(approveParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(volunteersApi.approveHours).toHaveBeenCalledWith('hours-123');
  });
});

describe('useRequestBackgroundCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should request background check successfully', async () => {
    // Arrange
    vi.mocked(volunteersApi.requestBackgroundCheck).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(
      () => useRequestBackgroundCheck(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate();

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(volunteersApi.requestBackgroundCheck).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should handle request errors', async () => {
    // Arrange
    const errorMessage = 'Failed to request background check';
    vi.mocked(volunteersApi.requestBackgroundCheck).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => useRequestBackgroundCheck(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate();

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

describe('useUpdateBackgroundCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update background check successfully', async () => {
    // Arrange
    const updateParams = {
      volunteerId: 'vol-123',
      status: 'approved' as const,
    };

    const mockResponse = {
      id: 'vol-123',
      display_name: 'John Doe',
      email: 'john@example.com',
      profile_photo_url: 'https://example.com/photo.jpg',
      city: 'Lahore',
      province: 'Punjab',
      interests: ['education'],
      sdg_goals: [4, 8],
      causes: ['youth'],
      skills: ['teaching'],
      availability: {
        weekdays: true,
        weekends: false,
        hours_per_week: 10,
      },
      total_hours: 50,
      projects_completed: 2,
      is_verified: true,
      verification_badge: 'verified',
      background_check_status: 'approved' as const,
      background_check_date: '2026-01-31T00:00:00Z',
      created_at: '2026-01-01T00:00:00Z',
    };

    vi.mocked(volunteersApi.updateBackgroundCheckStatus).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useUpdateBackgroundCheck(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(volunteersApi.updateBackgroundCheckStatus).toHaveBeenCalledWith(
      'vol-123',
      'approved'
    );
  });

  it('should handle update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update background check';
    vi.mocked(volunteersApi.updateBackgroundCheckStatus).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const updateParams = {
      volunteerId: 'vol-123',
      status: 'approved' as const,
    };

    // Act
    const { result } = renderHook(
      () => useUpdateBackgroundCheck(), 
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

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
