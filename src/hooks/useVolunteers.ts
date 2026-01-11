import { useState, useEffect, useCallback } from 'react';
import { volunteersApi, Volunteer, VolunteerFilters, CreateApplicationInput, LogHoursInput } from '../lib/api/volunteers';
import { PaginationParams } from '../lib/api/base';
import { useApi, useApiMutation } from './useApi';

export function useVolunteers(filters?: VolunteerFilters, pagination?: PaginationParams) {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await volunteersApi.list(filters, pagination);

    if (response.success && response.data) {
      setVolunteers(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch volunteers');
    }

    setLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return {
    volunteers,
    total,
    loading,
    error,
    refetch: fetchVolunteers,
  };
}

export function useVolunteer(volunteerId: string | null) {
  return useApi((id: string) => volunteersApi.getById(id));
}

export function useUpdateVolunteer(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (id: string, updates: Partial<Volunteer>) => volunteersApi.update(id, updates),
    options
  );
}

// Applications
export function useVolunteerApplications(volunteerId: string | null) {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!volunteerId) return;

    const fetchApplications = async () => {
      setLoading(true);
      const response = await volunteersApi.getApplications(volunteerId);

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(response.error || 'Failed to fetch applications');
      }

      setLoading(false);
    };

    fetchApplications();
  }, [volunteerId]);

  return { applications, loading, error };
}

export function useCreateApplication(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (input: CreateApplicationInput) => volunteersApi.createApplication(input),
    options
  );
}

export function useUpdateApplicationStatus(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (applicationId: string, status: any, rejectionReason?: string) =>
      volunteersApi.updateApplicationStatus(applicationId, status, rejectionReason),
    options
  );
}

export function useWithdrawApplication(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (applicationId: string) => volunteersApi.withdrawApplication(applicationId),
    options
  );
}

// Hours Tracking
export function useVolunteerHours(volunteerId: string | null) {
  const [hours, setHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!volunteerId) return;

    const fetchHours = async () => {
      setLoading(true);
      const response = await volunteersApi.getHours(volunteerId);

      if (response.success && response.data) {
        setHours(response.data);
      } else {
        setError(response.error || 'Failed to fetch hours');
      }

      setLoading(false);
    };

    fetchHours();
  }, [volunteerId]);

  return { hours, loading, error };
}

export function useLogHours(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (input: LogHoursInput) => volunteersApi.logHours(input),
    options
  );
}

export function useApproveHours(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (hoursId: string) => volunteersApi.approveHours(hoursId),
    options
  );
}

// Stats
export function useVolunteerStats(volunteerId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!volunteerId) return;

    const fetchStats = async () => {
      setLoading(true);
      const response = await volunteersApi.getStats(volunteerId);

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch stats');
      }

      setLoading(false);
    };

    fetchStats();
  }, [volunteerId]);

  return { stats, loading, error };
}

// Certificates
export function useVolunteerCertificates(volunteerId: string | null) {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!volunteerId) return;

    const fetchCertificates = async () => {
      setLoading(true);
      const response = await volunteersApi.getCertificates(volunteerId);

      if (response.success && response.data) {
        setCertificates(response.data);
      } else {
        setError(response.error || 'Failed to fetch certificates');
      }

      setLoading(false);
    };

    fetchCertificates();
  }, [volunteerId]);

  return { certificates, loading, error };
}

export function useIssueCertificate(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (volunteerId: string, projectId: string) => volunteersApi.issueCertificate(volunteerId, projectId),
    options
  );
}

// Background Check
export function useRequestBackgroundCheck(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    () => volunteersApi.requestBackgroundCheck(),
    options
  );
}

export function useUpdateBackgroundCheck(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (volunteerId: string, status: 'approved' | 'rejected') =>
      volunteersApi.updateBackgroundCheckStatus(volunteerId, status),
    options
  );
}
