/**
 * Tests for useVolunteer hook
 * 
 * Tests the single volunteer query hook to ensure it:
 * - Fetches volunteer successfully
 * - Handles errors appropriately
 * - Only fetches when ID is provided
 * - Optionally includes stats
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useVolunteer } from '../useVolunteer';
import { volunteersApi } from '../../../lib/api/volunteers';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/volunteers', () => ({
  volunteersApi: {
    getById: vi.fn(),
    getStats: vi.fn(),
  },
}));

describe('useVolunteer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch volunteer successfully', async () => {
    // Arrange
    const mockVolunteer = { 
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
      created_at: '2026-01-01T00:00:00Z',
    };

    vi.mocked(volunteersApi.getById).mockResolvedValue({
      success: true,
      data: mockVolunteer,
    });

    // Act
    const { result } = renderHook(
      () => useVolunteer('vol-123'), 
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
    expect(result.current.data).toEqual(mockVolunteer);
    expect(result.current.data?.id).toBe('vol-123');
    expect(result.current.error).toBeNull();
    expect(volunteersApi.getById).toHaveBeenCalledWith('vol-123');
    expect(volunteersApi.getById).toHaveBeenCalledTimes(1);
  });

  it('should fetch volunteer with stats', async () => {
    // Arrange
    const mockVolunteer = { 
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
      created_at: '2026-01-01T00:00:00Z',
    };

    const mockStats = {
      totalHours: 50,
      applicationsSubmitted: 5,
      applicationsApproved: 3,
      certificatesEarned: 2,
      activeProjects: 1,
    };

    vi.mocked(volunteersApi.getById).mockResolvedValue({
      success: true,
      data: mockVolunteer,
    });

    vi.mocked(volunteersApi.getStats).mockResolvedValue({
      success: true,
      data: mockStats,
    });

    // Act
    const { result } = renderHook(
      () => useVolunteer('vol-123', true), 
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded with stats
    expect(result.current.data?.stats).toEqual(mockStats);
    expect(volunteersApi.getById).toHaveBeenCalledWith('vol-123');
    expect(volunteersApi.getStats).toHaveBeenCalledWith('vol-123');
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Volunteer not found';
    vi.mocked(volunteersApi.getById).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => useVolunteer('vol-123'), 
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

  it('should not fetch when no ID is provided', async () => {
    // Act
    const { result } = renderHook(
      () => useVolunteer(), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(volunteersApi.getById).not.toHaveBeenCalled();
  });

  it('should not fetch when undefined ID is provided', async () => {
    // Act
    const { result } = renderHook(
      () => useVolunteer(undefined), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(volunteersApi.getById).not.toHaveBeenCalled();
  });
});
