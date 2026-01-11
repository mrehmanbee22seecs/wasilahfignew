import { useState, useEffect, useCallback } from 'react';
import { ngosApi, NGO, CreateNGOInput, UpdateNGOInput, NGOFilters } from '../lib/api/ngos';
import { PaginationParams } from '../lib/api/base';
import { useApi, useApiMutation } from './useApi';

export function useNGOs(filters?: NGOFilters, pagination?: PaginationParams) {
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNGOs = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await ngosApi.list(filters, pagination);

    if (response.success && response.data) {
      setNGOs(response.data.data);
      setTotal(response.data.total);
    } else {
      setError(response.error || 'Failed to fetch NGOs');
    }

    setLoading(false);
  }, [filters, pagination]);

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  return {
    ngos,
    total,
    loading,
    error,
    refetch: fetchNGOs,
  };
}

export function useNGO(ngoId: string | null) {
  return useApi((id: string) => ngosApi.getById(id));
}

export function useCreateNGO(options?: {
  onSuccess?: (ngo: NGO) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (input: CreateNGOInput) => ngosApi.create(input),
    options
  );
}

export function useUpdateNGO(options?: {
  onSuccess?: (ngo: NGO) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (id: string, input: UpdateNGOInput) => ngosApi.update(id, input),
    options
  );
}

export function useUploadNGOLogo(options?: {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (ngoId: string, file: File) => ngosApi.uploadLogo(ngoId, file),
    options
  );
}

export function useNGODocuments(ngoId: string | null) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ngoId) return;

    const fetchDocuments = async () => {
      setLoading(true);
      const response = await ngosApi.getDocuments(ngoId);

      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError(response.error || 'Failed to fetch documents');
      }

      setLoading(false);
    };

    fetchDocuments();
  }, [ngoId]);

  return { documents, loading, error };
}

export function useUploadNGODocument(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (ngoId: string, file: File, documentType: any) => 
      ngosApi.uploadDocument(ngoId, file, documentType),
    options
  );
}

export function useNGOStats(ngoId: string | null) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ngoId) return;

    const fetchStats = async () => {
      setLoading(true);
      const response = await ngosApi.getStats(ngoId);

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.error || 'Failed to fetch stats');
      }

      setLoading(false);
    };

    fetchStats();
  }, [ngoId]);

  return { stats, loading, error };
}

export function useUpdateNGOVerification(options?: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  return useApiMutation(
    (ngoId: string, status: 'pending' | 'verified' | 'rejected' | 'suspended', notes?: string) =>
      ngosApi.updateVerificationStatus(ngoId, status, notes),
    options
  );
}
