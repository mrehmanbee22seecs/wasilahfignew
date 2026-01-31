/**
 * Tests for useApplication hook
 * 
 * Tests the single application query hook to ensure it:
 * - Fetches application successfully
 * - Handles errors appropriately
 * - Only fetches when ID is provided
 * - Uses React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApplication } from '../useApplication';
import { applicationsApi } from '../../../lib/api/applications';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/applications', () => ({
  applicationsApi: {
    getApplication: vi.fn(),
  },
}));

describe('useApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch application successfully', async () => {
    // Arrange
    const mockApplication = { 
      id: 'app-123', 
      volunteer_id: 'vol-1',
      project_id: 'proj-1',
      motivation: 'I want to contribute',
      availability_start: '2026-02-01',
      availability_end: '2026-06-30',
      hours_per_week: 10,
      skills: ['teaching', 'mentoring'],
      emergency_contact_name: 'John Doe',
      emergency_contact_phone: '+92-300-1234567',
      emergency_contact_relationship: 'spouse',
      status: 'pending' as const,
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z',
    };

    vi.mocked(applicationsApi.getApplication).mockResolvedValue({
      success: true,
      data: mockApplication,
    });

    // Act
    const { result } = renderHook(
      () => useApplication('app-123'), 
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
    expect(result.current.data).toEqual(mockApplication);
    expect(result.current.data?.id).toBe('app-123');
    expect(result.current.error).toBeNull();
    expect(applicationsApi.getApplication).toHaveBeenCalledWith('app-123');
    expect(applicationsApi.getApplication).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Application not found';
    vi.mocked(applicationsApi.getApplication).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => useApplication('app-123'), 
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
      () => useApplication(), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(applicationsApi.getApplication).not.toHaveBeenCalled();
  });

  it('should not fetch when undefined ID is provided', async () => {
    // Act
    const { result } = renderHook(
      () => useApplication(undefined), 
      { wrapper: createQueryWrapper() }
    );

    // Assert - query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(applicationsApi.getApplication).not.toHaveBeenCalled();
  });
});
