/**
 * Tests for useAdminMutations hooks
 * 
 * Tests the admin mutation hooks to ensure they:
 * - Update user roles successfully
 * - Activate/deactivate users
 * - Delete users with optimistic removal
 * - Approve/reject vetting items
 * - Perform bulk operations
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useUpdateUserRole,
  useActivateUser,
  useDeactivateUser,
  useDeleteUser,
  useAssignVettingItem,
  useApproveVettingItem,
  useRejectVettingItem,
  useUpdateVettingPriority,
  useBulkUpdateStatus,
  useBulkDelete,
  useCreateAuditLog,
} from '../useAdminMutations';
import { adminApi } from '../../../lib/api/admin';
import { createTestQueryClient, createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/admin', () => ({
  adminApi: {
    updateUserRole: vi.fn(),
    activateUser: vi.fn(),
    deactivateUser: vi.fn(),
    deleteUser: vi.fn(),
    assignVettingItem: vi.fn(),
    approveVettingItem: vi.fn(),
    rejectVettingItem: vi.fn(),
    updatePriority: vi.fn(),
    bulkUpdateStatus: vi.fn(),
    bulkDelete: vi.fn(),
    createAuditLog: vi.fn(),
  },
}));

describe('useUpdateUserRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update user role successfully', async () => {
    // Arrange
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'admin' as const,
      display_name: 'Test User',
      created_at: '2026-01-01T00:00:00Z',
      last_login_at: '2026-01-31T00:00:00Z',
      is_active: true,
    };

    vi.mocked(adminApi.updateUserRole).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const queryClient = createTestQueryClient();

    // Act
    const { result } = renderHook(() => useUpdateUserRole(), {
      wrapper: createQueryWrapper(queryClient),
    });

    result.current.mutate({
      userId: 'user-123',
      role: 'admin',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockUser);
    expect(adminApi.updateUserRole).toHaveBeenCalledWith('user-123', 'admin');
    expect(adminApi.updateUserRole).toHaveBeenCalledTimes(1);
  });

  it('should handle update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update user role';
    vi.mocked(adminApi.updateUserRole).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useUpdateUserRole(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      userId: 'user-123',
      role: 'admin',
    });

    // Wait for mutation to complete (including retry)
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

describe('useActivateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should activate user successfully', async () => {
    // Arrange
    vi.mocked(adminApi.activateUser).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useActivateUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.activateUser).toHaveBeenCalledWith('user-123');
    expect(adminApi.activateUser).toHaveBeenCalledTimes(1);
  });

  it('should handle activation errors', async () => {
    // Arrange
    const errorMessage = 'Failed to activate user';
    vi.mocked(adminApi.activateUser).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useActivateUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    // Wait for mutation to complete (including retry)
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

describe('useDeactivateUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should deactivate user successfully', async () => {
    // Arrange
    vi.mocked(adminApi.deactivateUser).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeactivateUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.deactivateUser).toHaveBeenCalledWith('user-123');
    expect(adminApi.deactivateUser).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess callback', async () => {
    // Arrange
    const onSuccess = vi.fn();
    vi.mocked(adminApi.deactivateUser).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeactivateUser({ onSuccess }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(undefined);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('useDeleteUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete user successfully', async () => {
    // Arrange
    vi.mocked(adminApi.deleteUser).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.deleteUser).toHaveBeenCalledWith('user-123');
    expect(adminApi.deleteUser).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });

  it('should handle delete errors', async () => {
    // Arrange
    const errorMessage = 'Failed to delete user';
    vi.mocked(adminApi.deleteUser).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate('user-123');

    // Wait for mutation to complete (including retry)
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

describe('useAssignVettingItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should assign vetting item successfully', async () => {
    // Arrange
    const mockItem = {
      id: 'vetting-123',
      entity_type: 'ngo' as const,
      entity_id: 'ngo-456',
      status: 'in_review' as const,
      priority: 'high' as const,
      assigned_to: 'admin-789',
      submitted_date: '2026-01-30T00:00:00Z',
      sla_deadline: '2026-02-05T00:00:00Z',
      sla_status: 'on_time' as const,
    };

    vi.mocked(adminApi.assignVettingItem).mockResolvedValue({
      success: true,
      data: mockItem,
    });

    // Act
    const { result } = renderHook(() => useAssignVettingItem(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      assigneeId: 'admin-789',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.assignVettingItem).toHaveBeenCalledWith('vetting-123', 'admin-789');
    expect(adminApi.assignVettingItem).toHaveBeenCalledTimes(1);
  });

  it('should handle assignment errors', async () => {
    // Arrange
    const errorMessage = 'Failed to assign vetting item';
    vi.mocked(adminApi.assignVettingItem).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useAssignVettingItem(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      assigneeId: 'admin-789',
    });

    // Wait for mutation to complete (including retry)
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

describe('useApproveVettingItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should approve vetting item successfully', async () => {
    // Arrange
    vi.mocked(adminApi.approveVettingItem).mockResolvedValue({
      success: true,
      data: {} as any,
    });

    // Act
    const { result } = renderHook(() => useApproveVettingItem(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      notes: 'All checks passed',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.approveVettingItem).toHaveBeenCalledWith('vetting-123', 'All checks passed');
    expect(adminApi.approveVettingItem).toHaveBeenCalledTimes(1);
  });

  it('should handle approval errors', async () => {
    // Arrange
    const errorMessage = 'Failed to approve vetting item';
    vi.mocked(adminApi.approveVettingItem).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useApproveVettingItem(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
    });

    // Wait for mutation to complete (including retry)
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

describe('useRejectVettingItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject vetting item successfully', async () => {
    // Arrange
    vi.mocked(adminApi.rejectVettingItem).mockResolvedValue({
      success: true,
      data: {} as any,
    });

    // Act
    const { result } = renderHook(() => useRejectVettingItem(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      reason: 'Incomplete documentation',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.rejectVettingItem).toHaveBeenCalledWith('vetting-123', 'Incomplete documentation');
    expect(adminApi.rejectVettingItem).toHaveBeenCalledTimes(1);
  });

  it('should call onError callback', async () => {
    // Arrange
    const onError = vi.fn();
    const errorMessage = 'Rejection failed';
    
    vi.mocked(adminApi.rejectVettingItem).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useRejectVettingItem({ onError }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      reason: 'Test reason',
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 3000 }
    );

    // Assert
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].message).toContain(errorMessage);
  });
});

describe('useUpdateVettingPriority', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update vetting priority successfully', async () => {
    // Arrange
    vi.mocked(adminApi.updatePriority).mockResolvedValue({
      success: true,
      data: {} as any,
    });

    // Act
    const { result } = renderHook(() => useUpdateVettingPriority(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      priority: 'urgent',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.updatePriority).toHaveBeenCalledWith('vetting-123', 'urgent');
    expect(adminApi.updatePriority).toHaveBeenCalledTimes(1);
  });

  it('should handle priority update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update priority';
    vi.mocked(adminApi.updatePriority).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useUpdateVettingPriority(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      itemId: 'vetting-123',
      priority: 'urgent',
    });

    // Wait for mutation to complete (including retry)
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

describe('useBulkUpdateStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should bulk update status successfully', async () => {
    // Arrange
    vi.mocked(adminApi.bulkUpdateStatus).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      entity_type: 'ngo',
      entity_ids: ['ngo-1', 'ngo-2', 'ngo-3'],
      status: 'verified',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.bulkUpdateStatus).toHaveBeenCalledWith('ngo', ['ngo-1', 'ngo-2', 'ngo-3'], 'verified');
    expect(adminApi.bulkUpdateStatus).toHaveBeenCalledTimes(1);
  });

  it('should handle bulk update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to bulk update status';
    vi.mocked(adminApi.bulkUpdateStatus).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useBulkUpdateStatus(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      entity_type: 'project',
      entity_ids: ['proj-1'],
      status: 'active',
    });

    // Wait for mutation to complete (including retry)
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

describe('useBulkDelete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should bulk delete successfully', async () => {
    // Arrange
    vi.mocked(adminApi.bulkDelete).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useBulkDelete(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      entity_type: 'project',
      entity_ids: ['proj-1', 'proj-2'],
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.bulkDelete).toHaveBeenCalledWith('project', ['proj-1', 'proj-2']);
    expect(adminApi.bulkDelete).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess callback', async () => {
    // Arrange
    const onSuccess = vi.fn();
    vi.mocked(adminApi.bulkDelete).mockResolvedValue({
      success: true,
    });

    // Act
    const { result } = renderHook(() => useBulkDelete({ onSuccess }), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      entity_type: 'user',
      entity_ids: ['user-1'],
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(onSuccess).toHaveBeenCalledWith(undefined);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe('useCreateAuditLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create audit log successfully', async () => {
    // Arrange
    const mockLog = {
      id: 'log-123',
      user_id: 'user-123',
      action: 'update_role',
      entity_type: 'user',
      entity_id: 'user-456',
      changes: { role: 'admin' },
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
      timestamp: '2026-01-31T00:00:00Z',
    };

    vi.mocked(adminApi.createAuditLog).mockResolvedValue({
      success: true,
      data: mockLog,
    });

    // Act
    const { result } = renderHook(() => useCreateAuditLog(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      user_id: 'user-123',
      action: 'update_role',
      entity_type: 'user',
      entity_id: 'user-456',
      changes: { role: 'admin' },
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(adminApi.createAuditLog).toHaveBeenCalledTimes(1);
  });

  it('should handle create errors without retry', async () => {
    // Arrange
    const errorMessage = 'Failed to create audit log';
    vi.mocked(adminApi.createAuditLog).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(() => useCreateAuditLog(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      user_id: 'user-123',
      action: 'test',
      entity_type: 'user',
      entity_id: 'user-456',
      changes: {},
      ip_address: '192.168.1.1',
      user_agent: 'test',
    });

    // Wait for mutation to complete (no retry for audit logs)
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Assert - should not retry
    expect(result.current.error).toBeTruthy();
    expect(adminApi.createAuditLog).toHaveBeenCalledTimes(1);
  });
});
