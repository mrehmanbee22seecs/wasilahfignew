/**
 * Tests for useAdmin hooks
 * 
 * Tests the admin query hooks to ensure they:
 * - Fetch platform stats successfully
 * - Fetch users list with pagination
 * - Fetch user details by ID
 * - Fetch vetting queue with filters
 * - Fetch audit logs with filters
 * - Handle errors appropriately
 * - Use React Query caching correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  usePlatformStats,
  useAllUsers,
  useUserById,
  useVettingQueue,
  useAuditLogs,
} from '../useAdmin';
import { adminApi } from '../../../lib/api/admin';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/admin', () => ({
  adminApi: {
    getPlatformStats: vi.fn(),
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
    getVettingQueue: vi.fn(),
    getAuditLogs: vi.fn(),
  },
}));

describe('usePlatformStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch platform stats successfully', async () => {
    // Arrange
    const mockStats = {
      users: {
        total: 1000,
        active: 750,
        new_this_month: 50,
        by_role: {
          admin: 5,
          corporate: 100,
          ngo: 200,
          volunteer: 695,
        },
      },
      projects: {
        total: 150,
        active: 100,
        completed: 40,
        total_budget: 5000000,
      },
      ngos: {
        total: 200,
        verified: 180,
        pending_verification: 20,
      },
      volunteers: {
        total: 695,
        active: 500,
        total_hours: 15000,
      },
    };

    vi.mocked(adminApi.getPlatformStats).mockResolvedValue({
      success: true,
      data: mockStats,
    });

    // Act
    const { result } = renderHook(() => usePlatformStats(), {
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
    expect(result.current.data).toEqual(mockStats);
    expect(result.current.data?.users.total).toBe(1000);
    expect(result.current.data?.projects.active).toBe(100);
    expect(result.current.error).toBeNull();
    expect(adminApi.getPlatformStats).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch platform stats';
    vi.mocked(adminApi.getPlatformStats).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => usePlatformStats(), {
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
});

describe('useAllUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all users successfully', async () => {
    // Arrange
    const mockUsers = {
      data: [
        {
          id: 'user-1',
          email: 'user1@example.com',
          role: 'volunteer' as const,
          display_name: 'User One',
          created_at: '2026-01-01T00:00:00Z',
          last_login_at: '2026-01-30T00:00:00Z',
          is_active: true,
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          role: 'ngo' as const,
          display_name: 'User Two',
          created_at: '2026-01-15T00:00:00Z',
          last_login_at: '2026-01-29T00:00:00Z',
          is_active: true,
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(adminApi.getAllUsers).mockResolvedValue({
      success: true,
      data: mockUsers,
    });

    // Act
    const { result } = renderHook(() => useAllUsers(), {
      wrapper: createQueryWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.total).toBe(2);
    expect(adminApi.getAllUsers).toHaveBeenCalledTimes(1);
  });

  it('should handle pagination parameters', async () => {
    // Arrange
    const pagination = {
      page: 2,
      limit: 5,
      sortBy: 'created_at',
      sortOrder: 'desc' as const,
    };

    const mockUsers = {
      data: [],
      total: 10,
      page: 2,
      limit: 5,
      totalPages: 2,
    };

    vi.mocked(adminApi.getAllUsers).mockResolvedValue({
      success: true,
      data: mockUsers,
    });

    // Act
    const { result } = renderHook(() => useAllUsers(pagination), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - pagination passed to API
    expect(adminApi.getAllUsers).toHaveBeenCalledWith(pagination);
    expect(result.current.data?.page).toBe(2);
  });
});

describe('useUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch user details successfully', async () => {
    // Arrange
    const mockUser = {
      id: 'user-123',
      email: 'testuser@example.com',
      role: 'admin' as const,
      display_name: 'Test User',
      created_at: '2026-01-01T00:00:00Z',
      last_login_at: '2026-01-31T00:00:00Z',
      is_active: true,
    };

    vi.mocked(adminApi.getUserById).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    // Act
    const { result } = renderHook(() => useUserById('user-123'), {
      wrapper: createQueryWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockUser);
    expect(result.current.data?.id).toBe('user-123');
    expect(adminApi.getUserById).toHaveBeenCalledWith('user-123');
    expect(adminApi.getUserById).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    // Arrange
    const errorMessage = 'User not found';
    vi.mocked(adminApi.getUserById).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useUserById('invalid-id'), {
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
  });
});

describe('useVettingQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch vetting queue successfully', async () => {
    // Arrange
    const mockQueue = {
      data: [
        {
          id: 'vetting-1',
          entity_type: 'ngo' as const,
          entity_id: 'ngo-123',
          status: 'pending' as const,
          priority: 'high' as const,
          submitted_date: '2026-01-30T00:00:00Z',
          sla_deadline: '2026-02-05T00:00:00Z',
          sla_status: 'on_time' as const,
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(adminApi.getVettingQueue).mockResolvedValue({
      success: true,
      data: mockQueue,
    });

    // Act
    const { result } = renderHook(() => useVettingQueue(), {
      wrapper: createQueryWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockQueue);
    expect(result.current.data?.data).toHaveLength(1);
    expect(adminApi.getVettingQueue).toHaveBeenCalledTimes(1);
  });

  it('should support filters', async () => {
    // Arrange
    const filters = {
      status: 'pending' as const,
      priority: 'high' as const,
      entity_type: 'ngo' as const,
    };

    const mockQueue = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    vi.mocked(adminApi.getVettingQueue).mockResolvedValue({
      success: true,
      data: mockQueue,
    });

    // Act
    const { result } = renderHook(() => useVettingQueue(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - filters passed to API
    expect(adminApi.getVettingQueue).toHaveBeenCalledWith(filters, {});
  });
});

describe('useAuditLogs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch audit logs successfully', async () => {
    // Arrange
    const mockLogs = {
      data: [
        {
          id: 'log-1',
          user_id: 'user-123',
          action: 'update_role',
          entity_type: 'user',
          entity_id: 'user-456',
          changes: { role: 'admin' },
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
          timestamp: '2026-01-31T00:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    vi.mocked(adminApi.getAuditLogs).mockResolvedValue({
      success: true,
      data: mockLogs,
    });

    // Act
    const { result } = renderHook(() => useAuditLogs(), {
      wrapper: createQueryWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - data loaded
    expect(result.current.data).toEqual(mockLogs);
    expect(result.current.data?.data).toHaveLength(1);
    expect(adminApi.getAuditLogs).toHaveBeenCalledTimes(1);
  });

  it('should support filters', async () => {
    // Arrange
    const filters = {
      user_id: 'user-123',
      action: 'update_role',
      start_date: '2026-01-01',
      end_date: '2026-01-31',
    };

    const mockLogs = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    vi.mocked(adminApi.getAuditLogs).mockResolvedValue({
      success: true,
      data: mockLogs,
    });

    // Act
    const { result } = renderHook(() => useAuditLogs(filters), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert - filters passed to API
    expect(adminApi.getAuditLogs).toHaveBeenCalledWith(filters, {});
  });
});
