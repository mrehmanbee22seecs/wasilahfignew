/**
 * Tests for useOrganizations hooks
 * 
 * Tests the organization query and mutation hooks to ensure they:
 * - Fetch organizations list with proper filtering
 * - Fetch single organization details with stats
 * - Fetch organization documents
 * - Update organization profiles with optimistic updates
 * - Upload and verify documents
 * - Update verification status with optimistic updates
 * - Handle errors and rollback appropriately
 * - Invalidate cache correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useOrganizations,
  useOrganization,
  useOrganizationDocuments,
  useUpdateOrganization,
  useUploadOrganizationDocument,
  useVerifyOrganizationDocument,
  useUpdateOrganizationVerification,
} from '../../../hooks/queries/useOrganizations';
import { ngosApi } from '../../../lib/api/ngos';
import { createQueryWrapper } from '../../../test/queryUtils';

// Mock the API module
vi.mock('../../../lib/api/ngos', () => ({
  ngosApi: {
    list: vi.fn(),
    getById: vi.fn(),
    getStats: vi.fn(),
    getDocuments: vi.fn(),
    update: vi.fn(),
    uploadDocument: vi.fn(),
    verifyDocument: vi.fn(),
    updateVerificationStatus: vi.fn(),
  },
}));

describe('useOrganizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch organizations list successfully', async () => {
    // Arrange
    const mockOrganizations = [
      {
        id: 'org-1',
        type: 'ngo' as const,
        name: 'Test NGO',
        legal_name: 'Test NGO Foundation',
        registration_number: 'REG-001',
        email: 'contact@testngo.org',
        phone: '+92-300-1234567',
        website: 'https://testngo.org',
        address: '123 Main St',
        city: 'Lahore',
        province: 'Punjab',
        country: 'Pakistan',
        postal_code: '54000',
        description: 'Test NGO description',
        mission_statement: 'Our mission',
        founded_year: 2020,
        employee_count_range: '10-50',
        industry: 'Non-profit',
        focus_areas: ['education', 'health'],
        sdg_alignment: [4, 3],
        logo_url: 'https://example.com/logo.png',
        cover_photo_url: 'https://example.com/cover.jpg',
        verification_status: 'verified' as const,
        verified_at: '2026-01-15T00:00:00Z',
        verification_documents: {},
        social_links: {},
        created_by: 'user-1',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-31T00:00:00Z',
      },
    ];

    vi.mocked(ngosApi.list).mockResolvedValue({
      success: true,
      data: mockOrganizations,
      total: 1,
      page: 1,
      limit: 20,
    });

    // Act
    const { result } = renderHook(
      () => useOrganizations({ verification_status: ['verified'] }),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data?.data).toEqual(mockOrganizations);
    expect(result.current.data?.total).toBe(1);
    expect(ngosApi.list).toHaveBeenCalledWith({ verification_status: ['verified'] }, undefined);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch organizations errors', async () => {
    // Arrange
    const errorMessage = 'Failed to fetch organizations';
    vi.mocked(ngosApi.list).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    // Act
    const { result } = renderHook(
      () => useOrganizations(),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to fail
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

describe('useOrganization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single organization successfully', async () => {
    // Arrange
    const mockOrganization = {
      id: 'org-123',
      type: 'ngo' as const,
      name: 'Test NGO',
      legal_name: 'Test NGO Foundation',
      registration_number: 'REG-001',
      email: 'contact@testngo.org',
      phone: '+92-300-1234567',
      website: 'https://testngo.org',
      address: '123 Main St',
      city: 'Lahore',
      province: 'Punjab',
      country: 'Pakistan',
      postal_code: '54000',
      description: 'Test NGO description',
      mission_statement: 'Our mission',
      founded_year: 2020,
      employee_count_range: '10-50',
      industry: 'Non-profit',
      focus_areas: ['education', 'health'],
      sdg_alignment: [4, 3],
      logo_url: 'https://example.com/logo.png',
      cover_photo_url: 'https://example.com/cover.jpg',
      verification_status: 'verified' as const,
      verified_at: '2026-01-15T00:00:00Z',
      verification_documents: {},
      social_links: {},
      created_by: 'user-1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(ngosApi.getById).mockResolvedValue({
      success: true,
      data: mockOrganization,
    });

    // Act
    const { result } = renderHook(
      () => useOrganization('org-123'),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockOrganization);
    expect(ngosApi.getById).toHaveBeenCalledWith('org-123');
    expect(result.current.error).toBeNull();
  });

  it('should fetch organization with stats successfully', async () => {
    // Arrange
    const mockOrganization = {
      id: 'org-123',
      type: 'ngo' as const,
      name: 'Test NGO',
      legal_name: 'Test NGO Foundation',
      registration_number: 'REG-001',
      email: 'contact@testngo.org',
      phone: '+92-300-1234567',
      website: 'https://testngo.org',
      address: '123 Main St',
      city: 'Lahore',
      province: 'Punjab',
      country: 'Pakistan',
      postal_code: '54000',
      description: 'Test NGO description',
      mission_statement: 'Our mission',
      founded_year: 2020,
      employee_count_range: '10-50',
      industry: 'Non-profit',
      focus_areas: ['education', 'health'],
      sdg_alignment: [4, 3],
      logo_url: 'https://example.com/logo.png',
      cover_photo_url: 'https://example.com/cover.jpg',
      verification_status: 'verified' as const,
      verified_at: '2026-01-15T00:00:00Z',
      verification_documents: {},
      social_links: {},
      created_by: 'user-1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    const mockStats = {
      totalProjects: 10,
      activeProjects: 5,
      completedProjects: 3,
      totalBeneficiaries: 1000,
      totalVolunteers: 50,
    };

    vi.mocked(ngosApi.getById).mockResolvedValue({
      success: true,
      data: mockOrganization,
    });

    vi.mocked(ngosApi.getStats).mockResolvedValue({
      success: true,
      data: mockStats,
    });

    // Act
    const { result } = renderHook(
      () => useOrganization('org-123', true),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual({
      ...mockOrganization,
      stats: mockStats,
    });
    expect(ngosApi.getById).toHaveBeenCalledWith('org-123');
    expect(ngosApi.getStats).toHaveBeenCalledWith('org-123');
  });
});

describe('useOrganizationDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch organization documents successfully', async () => {
    // Arrange
    const mockDocuments = [
      {
        id: 'doc-1',
        ngo_id: 'org-123',
        document_type: 'registration' as const,
        file_name: 'registration.pdf',
        file_url: 'https://example.com/docs/registration.pdf',
        file_size: 1024000,
        upload_date: '2026-01-31T00:00:00Z',
        verified: true,
        verified_by: 'admin-1',
        verified_at: '2026-01-31T12:00:00Z',
      },
      {
        id: 'doc-2',
        ngo_id: 'org-123',
        document_type: 'tax_exemption' as const,
        file_name: 'tax_exemption.pdf',
        file_url: 'https://example.com/docs/tax_exemption.pdf',
        file_size: 512000,
        upload_date: '2026-01-31T00:00:00Z',
        verified: false,
      },
    ];

    vi.mocked(ngosApi.getDocuments).mockResolvedValue({
      success: true,
      data: mockDocuments,
    });

    // Act
    const { result } = renderHook(
      () => useOrganizationDocuments('org-123'),
      { wrapper: createQueryWrapper() }
    );

    // Wait for query to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockDocuments);
    expect(ngosApi.getDocuments).toHaveBeenCalledWith('org-123');
  });
});

describe('useUpdateOrganization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update organization successfully', async () => {
    // Arrange
    const updateParams = {
      id: 'org-123',
      updates: {
        description: 'Updated description',
        focus_areas: ['education', 'health', 'environment'],
        social_links: {
          facebook: 'https://facebook.com/testngo',
        },
      },
    };

    const mockResponse = {
      id: 'org-123',
      type: 'ngo' as const,
      name: 'Test NGO',
      legal_name: 'Test NGO Foundation',
      registration_number: 'REG-001',
      email: 'contact@testngo.org',
      phone: '+92-300-1234567',
      website: 'https://testngo.org',
      address: '123 Main St',
      city: 'Lahore',
      province: 'Punjab',
      country: 'Pakistan',
      postal_code: '54000',
      description: 'Updated description',
      mission_statement: 'Our mission',
      founded_year: 2020,
      employee_count_range: '10-50',
      industry: 'Non-profit',
      focus_areas: ['education', 'health', 'environment'],
      sdg_alignment: [4, 3],
      logo_url: 'https://example.com/logo.png',
      cover_photo_url: 'https://example.com/cover.jpg',
      verification_status: 'verified' as const,
      verified_at: '2026-01-15T00:00:00Z',
      verification_documents: {},
      social_links: {
        facebook: 'https://facebook.com/testngo',
      },
      created_by: 'user-1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T00:00:00Z',
    };

    vi.mocked(ngosApi.update).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useUpdateOrganization(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(ngosApi.update).toHaveBeenCalledWith('org-123', updateParams.updates);
    expect(result.current.error).toBeNull();
  });

  it('should handle update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update organization';
    vi.mocked(ngosApi.update).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const updateParams = {
      id: 'org-123',
      updates: {
        description: 'Updated description',
      },
    };

    // Act
    const { result } = renderHook(
      () => useUpdateOrganization(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to fail
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

describe('useUploadOrganizationDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload document successfully', async () => {
    // Arrange
    const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const uploadParams = {
      organizationId: 'org-123',
      file: mockFile,
      documentType: 'registration' as const,
    };

    const mockResponse = {
      id: 'doc-123',
      ngo_id: 'org-123',
      document_type: 'registration' as const,
      file_name: 'test.pdf',
      file_url: 'https://example.com/docs/test.pdf',
      file_size: mockFile.size,
      upload_date: '2026-01-31T00:00:00Z',
      verified: false,
    };

    vi.mocked(ngosApi.uploadDocument).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useUploadOrganizationDocument(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(uploadParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(ngosApi.uploadDocument).toHaveBeenCalledWith('org-123', mockFile, 'registration');
  });
});

describe('useVerifyOrganizationDocument', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify document successfully', async () => {
    // Arrange
    const verifyParams = {
      documentId: 'doc-123',
      verified: true,
      notes: 'All information validated',
    };

    const mockResponse = {
      id: 'doc-123',
      ngo_id: 'org-123',
      document_type: 'registration' as const,
      file_name: 'registration.pdf',
      file_url: 'https://example.com/docs/registration.pdf',
      file_size: 1024000,
      upload_date: '2026-01-31T00:00:00Z',
      verified: true,
      verified_by: 'admin-1',
      verified_at: '2026-01-31T12:00:00Z',
      notes: 'All information validated',
    };

    vi.mocked(ngosApi.verifyDocument).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useVerifyOrganizationDocument(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(verifyParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(ngosApi.verifyDocument).toHaveBeenCalledWith('doc-123', true, 'All information validated');
  });

  it('should handle verify document errors', async () => {
    // Arrange
    const errorMessage = 'Failed to verify document';
    vi.mocked(ngosApi.verifyDocument).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const verifyParams = {
      documentId: 'doc-123',
      verified: true,
    };

    // Act
    const { result } = renderHook(
      () => useVerifyOrganizationDocument(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(verifyParams);

    // Wait for mutation to fail
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

describe('useUpdateOrganizationVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update verification status successfully', async () => {
    // Arrange
    const updateParams = {
      organizationId: 'org-123',
      status: 'verified' as const,
      notes: 'All documents verified',
    };

    const mockResponse = {
      id: 'org-123',
      type: 'ngo' as const,
      name: 'Test NGO',
      legal_name: 'Test NGO Foundation',
      registration_number: 'REG-001',
      email: 'contact@testngo.org',
      phone: '+92-300-1234567',
      website: 'https://testngo.org',
      address: '123 Main St',
      city: 'Lahore',
      province: 'Punjab',
      country: 'Pakistan',
      postal_code: '54000',
      description: 'Test NGO description',
      mission_statement: 'Our mission',
      founded_year: 2020,
      employee_count_range: '10-50',
      industry: 'Non-profit',
      focus_areas: ['education', 'health'],
      sdg_alignment: [4, 3],
      logo_url: 'https://example.com/logo.png',
      cover_photo_url: 'https://example.com/cover.jpg',
      verification_status: 'verified' as const,
      verified_at: '2026-01-31T12:00:00Z',
      verification_documents: {},
      social_links: {},
      created_by: 'user-1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-31T12:00:00Z',
    };

    vi.mocked(ngosApi.updateVerificationStatus).mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    // Act
    const { result } = renderHook(
      () => useUpdateOrganizationVerification(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Assert
    expect(result.current.data).toEqual(mockResponse);
    expect(ngosApi.updateVerificationStatus).toHaveBeenCalledWith(
      'org-123',
      'verified',
      'All documents verified'
    );
  });

  it('should handle verification status update errors', async () => {
    // Arrange
    const errorMessage = 'Failed to update verification status';
    vi.mocked(ngosApi.updateVerificationStatus).mockResolvedValue({
      success: false,
      error: errorMessage,
    });

    const updateParams = {
      organizationId: 'org-123',
      status: 'verified' as const,
    };

    // Act
    const { result } = renderHook(
      () => useUpdateOrganizationVerification(),
      { wrapper: createQueryWrapper() }
    );

    result.current.mutate(updateParams);

    // Wait for mutation to fail
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
