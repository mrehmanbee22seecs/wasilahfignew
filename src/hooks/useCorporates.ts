import { useState, useEffect } from 'react';
import { corporatesApi, UpdateCorporateInput, UpdateOrganizationInput } from '../lib/api/corporates';
import { useApiMutation } from './useApi';

export function useCorporateProjects(corporateId: string | null) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchProjects = async () => {
      setLoading(true);
      const response = await corporatesApi.getProjects(corporateId);

      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }

      setLoading(false);
    };

    fetchProjects();
  }, [corporateId]);

  return { projects, loading, error };
}

export function useUpdateCorporateProfile(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (id: string, input: UpdateCorporateInput) => corporatesApi.update(id, input),
    options
  );
}

export function useUpdateCorporateOrganization(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (orgId: string, input: UpdateOrganizationInput) => corporatesApi.updateOrganization(orgId, input),
    options
  );
}

// Budget
export function useCorporateBudget(corporateId: string | null, fiscalYear?: string) {
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchBudget = async () => {
      setLoading(true);
      const response = await corporatesApi.getBudget(corporateId, fiscalYear);

      if (response.success) {
        setBudget(response.data);
      } else {
        setError(response.error || 'Failed to fetch budget');
      }

      setLoading(false);
    };

    fetchBudget();
  }, [corporateId, fiscalYear]);

  return { budget, loading, error };
}

export function useUpdateBudget(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (corporateId: string, fiscalYear: string, budget: any) =>
      corporatesApi.updateBudget(corporateId, fiscalYear, budget),
    options
  );
}

export function useAllocateBudget(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (corporateId: string, projectId: string, amount: number) =>
      corporatesApi.allocateBudget(corporateId, projectId, amount),
    options
  );
}

// Payment Approvals
export function usePaymentApprovals(corporateId: string | null) {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchApprovals = async () => {
      setLoading(true);
      const response = await corporatesApi.getPaymentApprovals(corporateId);

      if (response.success && response.data) {
        setApprovals(response.data);
      } else {
        setError(response.error || 'Failed to fetch payment approvals');
      }

      setLoading(false);
    };

    fetchApprovals();
  }, [corporateId]);

  return { approvals, loading, error };
}

export function useCreatePaymentApproval(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (projectId: string, amount: number, invoiceUrl?: string, notes?: string) =>
      corporatesApi.createPaymentApproval(projectId, amount, invoiceUrl, notes),
    options
  );
}

export function useApprovePayment(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (approvalId: string) => corporatesApi.approvePayment(approvalId),
    options
  );
}

export function useRejectPayment(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (approvalId: string, reason: string) => corporatesApi.rejectPayment(approvalId, reason),
    options
  );
}

// Dashboard Stats
export function useCorporateDashboardStats(corporateId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchStats = async () => {
      setLoading(true);
      const response = await corporatesApi.getDashboardStats(corporateId);

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch stats');
      }

      setLoading(false);
    };

    fetchStats();
  }, [corporateId]);

  return { stats, loading, error };
}

// Reports
export function useGenerateImpactReport(options?: {
  onSuccess?: (report: any) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (corporateId: string, startDate: string, endDate: string) =>
      corporatesApi.generateImpactReport(corporateId, startDate, endDate),
    options
  );
}
