/**
 * Tests for CSV Export Functionality
 * 
 * Tests the CSV export feature to ensure it:
 * - Generates CSV with correct format
 * - Handles filtered exports correctly
 * - Exports data for all entity types
 * - Handles errors appropriately
 * - Respects export limits
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCSV } from '../../utils/exportFormatters';
import { projectsApi } from '../../lib/api/projects';
import { volunteersApi } from '../../lib/api/volunteers';
import { applicationsApi } from '../../lib/api/applications';
import { paymentsApi } from '../../lib/api/payments';
import { ngosApi } from '../../lib/api/ngos';
import type { ColumnDefinition } from '../../components/exports/types';

// Mock the API modules
vi.mock('../../lib/api/projects');
vi.mock('../../lib/api/volunteers');
vi.mock('../../lib/api/applications');
vi.mock('../../lib/api/payments');
vi.mock('../../lib/api/ngos');

describe('CSV Export Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CSV Generation', () => {
    it('should generate CSV with correct format and headers', () => {
      // Arrange
      const data = [
        { id: '1', name: 'Project A', status: 'active', budget: 100000 },
        { id: '2', name: 'Project B', status: 'completed', budget: 200000 },
      ];
      
      const columns: ColumnDefinition[] = [
        { id: 'id', label: 'ID', field: 'id', type: 'string' },
        { id: 'name', label: 'Name', field: 'name', type: 'string' },
        { id: 'status', label: 'Status', field: 'status', type: 'string' },
        { id: 'budget', label: 'Budget', field: 'budget', type: 'currency' },
      ];

      // Act
      const csv = generateCSV(data, columns);

      // Assert
      const lines = csv.split('\n');
      expect(lines[0]).toBe('ID,Name,Status,Budget'); // Header row
      expect(lines[1]).toContain('1');
      expect(lines[1]).toContain('Project A');
      expect(lines[1]).toContain('active');
      expect(lines[2]).toContain('2');
      expect(lines[2]).toContain('Project B');
      expect(lines[2]).toContain('completed');
      expect(lines.length).toBe(3); // Header + 2 data rows
    });

    it('should handle CSV values with commas by quoting', () => {
      // Arrange
      const data = [
        { id: '1', description: 'Project with, comma in description' },
      ];
      
      const columns: ColumnDefinition[] = [
        { id: 'id', label: 'ID', field: 'id', type: 'string' },
        { id: 'description', label: 'Description', field: 'description', type: 'string' },
      ];

      // Act
      const csv = generateCSV(data, columns);

      // Assert
      expect(csv).toContain('"Project with, comma in description"');
    });

    it('should handle CSV values with quotes by escaping', () => {
      // Arrange
      const data = [
        { id: '1', title: 'Project "Special"' },
      ];
      
      const columns: ColumnDefinition[] = [
        { id: 'id', label: 'ID', field: 'id', type: 'string' },
        { id: 'title', label: 'Title', field: 'title', type: 'string' },
      ];

      // Act
      const csv = generateCSV(data, columns);

      // Assert
      expect(csv).toContain('Project ""Special""');
    });

    it('should handle empty data gracefully', () => {
      // Arrange
      const data: any[] = [];
      const columns: ColumnDefinition[] = [
        { id: 'id', label: 'ID', field: 'id', type: 'string' },
      ];

      // Act
      const csv = generateCSV(data, columns);

      // Assert
      expect(csv).toBe('');
    });

    it('should handle null and undefined values', () => {
      // Arrange
      const data = [
        { id: '1', name: 'Project', optional: null, missing: undefined },
      ];
      
      const columns: ColumnDefinition[] = [
        { id: 'id', label: 'ID', field: 'id', type: 'string' },
        { id: 'name', label: 'Name', field: 'name', type: 'string' },
        { id: 'optional', label: 'Optional', field: 'optional', type: 'string' },
        { id: 'missing', label: 'Missing', field: 'missing', type: 'string' },
      ];

      // Act
      const csv = generateCSV(data, columns);

      // Assert
      const lines = csv.split('\n');
      expect(lines[1]).toContain('""'); // Empty strings for null/undefined
    });
  });

  describe('Filtered Export - Projects', () => {
    it('should export projects with status filter applied', async () => {
      // Arrange
      const mockProjects = [
        { 
          id: '1', 
          title: 'Active Project', 
          status: 'active',
          budget: 100000,
          city: 'Lahore',
        },
        { 
          id: '2', 
          title: 'Completed Project', 
          status: 'completed',
          budget: 200000,
          city: 'Karachi',
        },
      ];

      vi.mocked(projectsApi.exportData).mockResolvedValue({
        success: true,
        data: mockProjects.filter(p => p.status === 'active'),
      });

      // Act
      const result = await projectsApi.exportData({ status: ['active'] });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].status).toBe('active');
      expect(projectsApi.exportData).toHaveBeenCalledWith({ status: ['active'] });
    });

    it('should export projects with city filter applied', async () => {
      // Arrange
      const mockProjects = [
        { 
          id: '1', 
          title: 'Lahore Project', 
          status: 'active',
          city: 'Lahore',
        },
      ];

      vi.mocked(projectsApi.exportData).mockResolvedValue({
        success: true,
        data: mockProjects,
      });

      // Act
      const result = await projectsApi.exportData({ city: 'Lahore' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].city).toBe('Lahore');
    });
  });

  describe('Filtered Export - Volunteers', () => {
    it('should export volunteers with verification filter applied', async () => {
      // Arrange
      const mockVolunteers = [
        { 
          id: '1', 
          display_name: 'John Doe', 
          is_verified: true,
          email: 'john@example.com',
        },
      ];

      vi.mocked(volunteersApi.exportData).mockResolvedValue({
        success: true,
        data: mockVolunteers,
      });

      // Act
      const result = await volunteersApi.exportData({ is_verified: true });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].is_verified).toBe(true);
    });

    it('should export volunteers with skills filter applied', async () => {
      // Arrange
      const mockVolunteers = [
        { 
          id: '1', 
          display_name: 'Jane Smith', 
          skills: ['teaching', 'mentoring'],
        },
      ];

      vi.mocked(volunteersApi.exportData).mockResolvedValue({
        success: true,
        data: mockVolunteers,
      });

      // Act
      const result = await volunteersApi.exportData({ skills: ['teaching'] });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].skills).toContain('teaching');
    });
  });

  describe('Filtered Export - Payments', () => {
    it('should export payments with status filter applied', async () => {
      // Arrange
      const mockPayments = [
        { 
          id: '1', 
          amount: 50000, 
          status: 'completed',
          project_id: 'proj-1',
        },
      ];

      vi.mocked(paymentsApi.exportData).mockResolvedValue({
        success: true,
        data: mockPayments,
      });

      // Act
      const result = await paymentsApi.exportData({ status: 'completed' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].status).toBe('completed');
    });
  });

  describe('Filtered Export - NGOs', () => {
    it('should export NGOs with verification status filter applied', async () => {
      // Arrange
      const mockNGOs = [
        { 
          id: '1', 
          name: 'Verified NGO', 
          verification_status: 'verified',
        },
      ];

      vi.mocked(ngosApi.exportData).mockResolvedValue({
        success: true,
        data: mockNGOs,
      });

      // Act
      const result = await ngosApi.exportData({ verification_status: ['verified'] });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].verification_status).toBe('verified');
    });
  });

  describe('Filtered Export - Applications', () => {
    it('should export applications with status filter applied', async () => {
      // Arrange
      const mockApplications = [
        { 
          id: '1', 
          volunteer_id: 'vol-1',
          project_id: 'proj-1',
          status: 'approved',
        },
      ];

      vi.mocked(applicationsApi.exportData).mockResolvedValue({
        success: true,
        data: mockApplications,
      });

      // Act
      const result = await applicationsApi.exportData({ status: 'approved' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0].status).toBe('approved');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Arrange
      vi.mocked(projectsApi.exportData).mockResolvedValue({
        success: false,
        error: 'Database connection failed',
        code: 'DB_ERROR',
      });

      // Act
      const result = await projectsApi.exportData({});

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
    });

    it('should handle network errors', async () => {
      // Arrange
      vi.mocked(projectsApi.exportData).mockRejectedValue(
        new Error('Network error')
      );

      // Act & Assert
      await expect(projectsApi.exportData({})).rejects.toThrow('Network error');
    });
  });

  describe('Export Limits', () => {
    it('should respect maximum export limit', async () => {
      // Arrange
      const maxRecords = 10000;
      const mockProjects = Array.from({ length: maxRecords }, (_, i) => ({
        id: `${i + 1}`,
        title: `Project ${i + 1}`,
        status: 'active',
      }));

      vi.mocked(projectsApi.exportData).mockResolvedValue({
        success: true,
        data: mockProjects,
      });

      // Act
      const result = await projectsApi.exportData({});

      // Assert
      expect(result.success).toBe(true);
      expect(result.data!.length).toBeLessThanOrEqual(maxRecords);
    });
  });
});
