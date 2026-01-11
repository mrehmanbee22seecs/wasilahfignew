import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../lib/api/admin';
import { PaginationParams } from '../lib/api/base';
import { useApiMutation } from './useApi';

// Platform Stats
export function usePlatformStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const response = await adminApi.getPlatformStats();

    if (response.success) {
      setStats(response.data);
    } else {
      setError(response.error || 'Failed to fetch stats');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// User Management
export function useAllUsers(pagination?: PaginationParams) {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const response = await adminApi.getAllUsers(pagination);

    if (response.success && response.data) {
      setUsers(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch users');
    }

    setLoading(false);
  }, [pagination]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, total, loading, error, refetch: fetchUsers };
}

export function useUpdateUserRole(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (userId: string, role: any) => adminApi.updateUserRole(userId, role),
    options
  );
}

export function useDeactivateUser(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (userId: string) => adminApi.deactivateUser(userId),
    options
  );
}

export function useActivateUser(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (userId: string) => adminApi.activateUser(userId),
    options
  );
}

export function useDeleteUser(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (userId: string) => adminApi.deleteUser(userId),
    options
  );
}

// Vetting Queue
export function useVettingQueue(
  filters?: {
    entity_type?: any;
    status?: any;
    priority?: any;
    assigned_to?: string;
  },
  pagination?: PaginationParams
) {
  const [queue, setQueue] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    const response = await adminApi.getVettingQueue(filters, pagination);

    if (response.success && response.data) {
      setQueue(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch vetting queue');
    }

    setLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  return { queue, total, loading, error, refetch: fetchQueue };
}

export function useAssignVettingItem(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (itemId: string, assigneeId: string) => adminApi.assignVettingItem(itemId, assigneeId),
    options
  );
}

export function useApproveVettingItem(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (itemId: string, notes?: string) => adminApi.approveVettingItem(itemId, notes),
    options
  );
}

export function useRejectVettingItem(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (itemId: string, reason: string) => adminApi.rejectVettingItem(itemId, reason),
    options
  );
}

export function useUpdateVettingPriority(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (itemId: string, priority: any) => adminApi.updatePriority(itemId, priority),
    options
  );
}

// Audit Logs
export function useAuditLogs(
  filters?: {
    user_id?: string;
    action?: string;
    entity_type?: string;
    start_date?: string;
    end_date?: string;
  },
  pagination?: PaginationParams
) {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const response = await adminApi.getAuditLogs(filters, pagination);

    if (response.success && response.data) {
      setLogs(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch audit logs');
    }

    setLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, loading, error, refetch: fetchLogs };
}

export function useCreateAuditLog(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (log: any) => adminApi.createAuditLog(log),
    options
  );
}

// Bulk Operations
export function useBulkUpdateStatus(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (entity_type: any, entity_ids: string[], status: string) =>
      adminApi.bulkUpdateStatus(entity_type, entity_ids, status),
    options
  );
}

export function useBulkDelete(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (entity_type: any, entity_ids: string[]) => adminApi.bulkDelete(entity_type, entity_ids),
    options
  );
}

// Reports
export function useGenerateSystemReport(options?: {
  onSuccess?: (report: any) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (reportType: any, startDate: string, endDate: string) =>
      adminApi.generateSystemReport(reportType, startDate, endDate),
    options
  );
}
