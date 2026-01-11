import { useState, useEffect, useCallback } from 'react';
import { projectsApi, Project, CreateProjectInput, UpdateProjectInput, ProjectFilters } from '../lib/api/projects';
import { PaginationParams } from '../lib/api/base';
import { useApi, useApiMutation } from './useApi';

export function useProjects(filters?: ProjectFilters, pagination?: PaginationParams) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await projectsApi.list(filters, pagination);

    if (response.success && response.data) {
      setProjects(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch projects');
    }

    setLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    total,
    loading,
    error,
    refetch: fetchProjects,
  };
}

export function useProject(projectId: string | null) {
  return useApi((id: string) => projectsApi.getById(id));
}

export function useCreateProject(options?: {
  onSuccess?: (project: Project) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (input: CreateProjectInput) => projectsApi.create(input),
    options
  );
}

export function useUpdateProject(options?: {
  onSuccess?: (project: Project) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (id: string, input: UpdateProjectInput) => projectsApi.update(id, input),
    options
  );
}

export function useDeleteProject(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (id: string) => projectsApi.delete(id),
    options
  );
}

export function useProjectStats(projectId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchStats = async () => {
      setLoading(true);
      const response = await projectsApi.getProjectStats(projectId);

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch stats');
      }

      setLoading(false);
    };

    fetchStats();
  }, [projectId]);

  return { stats, loading, error };
}

export function useAddMilestone(options?: {
  onSuccess?: (project: Project) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (projectId: string, milestone: any) => projectsApi.addMilestone(projectId, milestone),
    options
  );
}

export function useUploadProjectMedia(options?: {
  onSuccess?: (urls: string[]) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (projectId: string, files: File[]) => projectsApi.uploadMedia(projectId, files),
    options
  );
}
