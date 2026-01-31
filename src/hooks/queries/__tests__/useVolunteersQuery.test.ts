/**
 * Tests for useVolunteersQuery hook
 * 
 * Tests the volunteers list query hook to ensure it:
 * - Fetches volunteers successfully
 * - Handles errors appropriately
 * - Supports filtering and pagination
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVolunteers } from '../useVolunteersQuery';
import { volunteersApi } from '../../../lib/api/volunteers';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/volunteers', () => ({
  volunteersApi: {
    list: vi.fn(),
  },
}));

describe('useVolunteers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch volunteers successfully', async () => {
    // Arrange
    const mockVolunteers = {
      data: [
        { 
          id: '1', 
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
          created_at: '2026-01-01T00:00:00Z',
        },
        { 
          id: '2', 
          display_name: 'Jane Smith',
          email: 'jane@example.com',
          profile_photo_url: 'https://example.com/photo2.jpg',
          city: 'Karachi',
          province: 'Sindh',
          interests: ['health'],
          sdg_goals: [3],
          causes: ['health'],
          skills: ['nursing', 'communication'],
          availability: {
            weekdays: true,
            weekends: true,
            hours_per_week: 15,
          },
          total_hours: 120,
          projects_completed: 5,
          is_verified: true,
          verification_badge: 'expert',
          background_check_status: 'approved' as const,
          created_at: '2025-12-01T00:00:00Z',
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(volunteersApi.list).mockResolvedValue({
      success: true,
      data: mockVolunteers,
    });

    // Act
    const { result } = renderHook(() => useVolunteers(), {
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
    expect(result.current.data).toEqual(mockVolunteers);
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
    expect(result.current.error).toBeNull();
    expect(volunteersApi.list).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch volunteers';
    vi.mocked(volunteersApi.list).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useVolunteers(), {
      wrapper: createQueryWrapper(),
    });

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
      city: 'Lahore',
      is_verified: true,
    };

    const mockVolunteers = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    vi.mocked(volunteersApi.list).mockResolvedValue({
      success: true,
      data: mockVolunteers,
    });

    // Act
    const { result } = renderHook(() => useVolunteers(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - filters passed to API
    expect(volunteersApi.list).toHaveBeenCalledWith(filters, {});
  });

  it('should support pagination', async () => {
    // Arrange
    const pagination = {
      page: 2,
      limit: 5,
    };

    const mockVolunteers = {
      data: [],
      total: 10,
      page: 2,
      limit: 5,
      totalPages: 2,
    };

    vi.mocked(volunteersApi.list).mockResolvedValue({
      success: true,
      data: mockVolunteers,
    });

    // Act
    const { result } = renderHook(() => useVolunteers({}, pagination), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - pagination passed to API
    expect(volunteersApi.list).toHaveBeenCalledWith({}, pagination);
    expect(result.current.data?.page).toBe(2);
  });

  it('should support complex filters', async () => {
    // Arrange
    const filters = {
      city: 'Islamabad',
      skills: ['teaching', 'mentoring'],
      sdg_goals: [4, 8],
      is_verified: true,
      availability: 'weekdays' as const,
    };

    const mockVolunteers = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    vi.mocked(volunteersApi.list).mockResolvedValue({
      success: true,
      data: mockVolunteers,
    });

    // Act
    const { result } = renderHook(() => useVolunteers(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - complex filters passed to API
    expect(volunteersApi.list).toHaveBeenCalledWith(filters, {});
  });
});
