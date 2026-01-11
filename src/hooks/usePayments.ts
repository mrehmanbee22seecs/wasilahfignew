import { useState, useEffect } from 'react';
import { paymentsApi, type PaymentApproval, type PaymentRequest, type ApprovePaymentRequest, type RejectPaymentRequest } from '../lib/api/payments';

// Get payment approvals for corporate
export function usePaymentApprovals(corporateId: string | null) {
  const [approvals, setApprovals] = useState<PaymentApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchApprovals = async () => {
      setLoading(true);
      setError(null);
      const response = await paymentsApi.getPaymentApprovals(corporateId);

      if (response.success && response.data) {
        setApprovals(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch payment approvals'));
      }

      setLoading(false);
    };

    fetchApprovals();
  }, [corporateId]);

  return { approvals, loading, error, refetch: () => {} };
}

// Get payment approvals for project
export function useProjectPaymentApprovals(projectId: string | null) {
  const [approvals, setApprovals] = useState<PaymentApproval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchApprovals = async () => {
      setLoading(true);
      setError(null);
      const response = await paymentsApi.getProjectPaymentApprovals(projectId);

      if (response.success && response.data) {
        setApprovals(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch payment approvals'));
      }

      setLoading(false);
    };

    fetchApprovals();
  }, [projectId]);

  return { approvals, loading, error };
}

// Get single payment approval
export function usePaymentApproval(id: string | null) {
  const [approval, setApproval] = useState<PaymentApproval | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchApproval = async () => {
      setLoading(true);
      setError(null);
      const response = await paymentsApi.getPaymentApproval(id);

      if (response.success && response.data) {
        setApproval(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch payment approval'));
      }

      setLoading(false);
    };

    fetchApproval();
  }, [id]);

  return { approval, loading, error };
}

// Create payment approval
export function useCreatePaymentApproval() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createApproval = async (data: PaymentRequest) => {
    setLoading(true);
    setError(null);

    const response = await paymentsApi.createPaymentApproval(data);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to create payment approval');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { createApproval, loading, error };
}

// Approve payment
export function useApprovePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = async (id: string, data: ApprovePaymentRequest) => {
    setLoading(true);
    setError(null);

    const response = await paymentsApi.approvePayment(id, data);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to approve payment');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { approve, loading, error };
}

// Reject payment
export function useRejectPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reject = async (id: string, data: RejectPaymentRequest) => {
    setLoading(true);
    setError(null);

    const response = await paymentsApi.rejectPayment(id, data);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to reject payment');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { reject, loading, error };
}

// Get payment statistics
export function usePaymentStats(corporateId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      const response = await paymentsApi.getPaymentStats(corporateId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch payment stats'));
      }

      setLoading(false);
    };

    fetchStats();
  }, [corporateId]);

  return { stats, loading, error };
}
