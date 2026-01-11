import { useState, useEffect } from 'react';
import { applicationsApi, type VolunteerApplication, type CreateApplicationRequest, type ReviewApplicationRequest } from '../lib/api/applications';

// Get applications for volunteer
export function useVolunteerApplications(volunteerId: string | null) {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!volunteerId) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      const response = await applicationsApi.getVolunteerApplications(volunteerId);

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch applications'));
      }

      setLoading(false);
    };

    fetchApplications();
  }, [volunteerId]);

  return { applications, loading, error };
}

// Get applications for project
export function useProjectApplications(projectId: string | null) {
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      const response = await applicationsApi.getProjectApplications(projectId);

      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch applications'));
      }

      setLoading(false);
    };

    fetchApplications();
  }, [projectId]);

  return { applications, loading, error };
}

// Get single application
export function useApplication(id: string | null) {
  const [application, setApplication] = useState<VolunteerApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      const response = await applicationsApi.getApplication(id);

      if (response.success && response.data) {
        setApplication(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch application'));
      }

      setLoading(false);
    };

    fetchApplication();
  }, [id]);

  return { application, loading, error };
}

// Create application
export function useCreateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createApplication = async (data: CreateApplicationRequest) => {
    setLoading(true);
    setError(null);

    const response = await applicationsApi.createApplication(data);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to create application');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { createApplication, loading, error };
}

// Review application
export function useReviewApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reviewApplication = async (id: string, data: ReviewApplicationRequest) => {
    setLoading(true);
    setError(null);

    const response = await applicationsApi.reviewApplication(id, data);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to review application');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { reviewApplication, loading, error };
}

// Withdraw application
export function useWithdrawApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdrawApplication = async (id: string, reason: string) => {
    setLoading(true);
    setError(null);

    const response = await applicationsApi.withdrawApplication(id, reason);

    if (response.success && response.data) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to withdraw application');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { withdrawApplication, loading, error };
}

// Get application statistics
export function useApplicationStats(projectId?: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      const response = await applicationsApi.getApplicationStats(projectId);

      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch application stats'));
      }

      setLoading(false);
    };

    fetchStats();
  }, [projectId]);

  return { stats, loading, error };
}
