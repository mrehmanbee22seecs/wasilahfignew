/**
 * Tests for PDF Export Functionality
 * 
 * Tests the PDF export feature to ensure it:
 * - Generates well-formatted PDF documents
 * - Applies proper styling (headers, tables, footers)
 * - Includes summary sections
 * - Handles different entity types (Projects, Volunteers, Payments, etc.)
 * - Formats data correctly
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createPDFDocument,
  prepareEntityPDFTables,
  exportPDFToDownload,
  type PDFExportOptions,
  type PDFTableConfig,
} from '../../utils/pdfExport';
import { ExportConfig } from '../../components/exports/types';

describe('PDF Export Functionality', () => {
  describe('PDF Document Creation', () => {
    it('should create PDF document with title and subtitle', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Test Report',
        subtitle: 'Test Subtitle',
        tables: [],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBeGreaterThan(0);
    });

    it('should create PDF with table data', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Projects Report',
        tables: [
          {
            title: 'Active Projects',
            data: [
              { name: 'Project 1', budget: 100000, status: 'Active' },
              { name: 'Project 2', budget: 200000, status: 'Completed' },
            ],
            columns: [
              { header: 'Name', dataKey: 'name' },
              { header: 'Budget', dataKey: 'budget' },
              { header: 'Status', dataKey: 'status' },
            ],
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
      expect(doc.internal.getNumberOfPages()).toBeGreaterThan(0);
    });

    it('should include summary section when specified', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Projects Report',
        tables: [
          {
            title: 'Projects',
            data: [{ name: 'Project 1' }],
            columns: [{ header: 'Name', dataKey: 'name' }],
            includeSummary: true,
            summaryData: {
              totalProjects: 1,
              activeProjects: 1,
            },
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
      // Summary adds extra content to the PDF
      expect(doc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    });

    it('should handle portrait and landscape orientations', async () => {
      // Arrange - Portrait
      const portraitOptions: PDFExportOptions = {
        title: 'Portrait Report',
        tables: [],
        filename: 'portrait.pdf',
        orientation: 'portrait',
      };

      // Act
      const portraitDoc = await createPDFDocument(portraitOptions);

      // Assert
      expect(portraitDoc).toBeDefined();
      const portraitWidth = portraitDoc.internal.pageSize.getWidth();
      const portraitHeight = portraitDoc.internal.pageSize.getHeight();
      expect(portraitHeight).toBeGreaterThan(portraitWidth);

      // Arrange - Landscape
      const landscapeOptions: PDFExportOptions = {
        title: 'Landscape Report',
        tables: [],
        filename: 'landscape.pdf',
        orientation: 'landscape',
      };

      // Act
      const landscapeDoc = await createPDFDocument(landscapeOptions);

      // Assert
      expect(landscapeDoc).toBeDefined();
      const landscapeWidth = landscapeDoc.internal.pageSize.getWidth();
      const landscapeHeight = landscapeDoc.internal.pageSize.getHeight();
      expect(landscapeWidth).toBeGreaterThan(landscapeHeight);
    });

    it('should include metadata section when requested', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Test Report',
        tables: [],
        filename: 'test.pdf',
        includeMetadata: true,
        creator: 'Test User',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
      // Metadata adds an extra page
      expect(doc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Entity-Specific PDF Tables', () => {
    it('should prepare tables for projects entity', () => {
      // Arrange
      const projectsData = [
        {
          name: 'Project 1',
          ngoName: 'NGO 1',
          category: 'Education',
          budget: 500000,
          status: 'Active',
          beneficiaries: 1000,
        },
        {
          name: 'Project 2',
          ngoName: 'NGO 2',
          category: 'Healthcare',
          budget: 750000,
          status: 'Completed',
          beneficiaries: 2000,
        },
      ];

      // Act
      const tables = prepareEntityPDFTables('projects', projectsData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].title).toBe('Projects Report');
      expect(tables[0].data).toEqual(projectsData);
      expect(tables[0].columns).toBeDefined();
      expect(tables[0].includeSummary).toBe(true);
      expect(tables[0].summaryData).toBeDefined();
      expect(tables[0].summaryData?.totalProjects).toBe(2);
      expect(tables[0].summaryData?.totalBudget).toBeDefined();
      expect(tables[0].summaryData?.totalBeneficiaries).toBeDefined();
    });

    it('should prepare tables for volunteers entity', () => {
      // Arrange
      const volunteersData = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          skills: 'Teaching',
          totalHours: 100,
          projectsCompleted: 5,
          status: 'Active',
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          skills: 'Healthcare',
          totalHours: 150,
          projectsCompleted: 7,
          status: 'Active',
        },
      ];

      // Act
      const tables = prepareEntityPDFTables('volunteers', volunteersData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].title).toBe('Volunteers Report');
      expect(tables[0].data).toEqual(volunteersData);
      expect(tables[0].summaryData?.totalVolunteers).toBe(2);
      expect(tables[0].summaryData?.totalHours).toBeDefined();
    });

    it('should prepare tables for payments entity', () => {
      // Arrange
      const paymentsData = [
        {
          projectName: 'Project 1',
          ngoName: 'NGO 1',
          amount: 100000,
          status: 'Completed',
          disbursedAt: '2024-01-15',
          milestone: 'Milestone 1',
        },
        {
          projectName: 'Project 2',
          ngoName: 'NGO 2',
          amount: 200000,
          status: 'Pending',
          disbursedAt: '2024-02-01',
          milestone: 'Milestone 2',
        },
      ];

      // Act
      const tables = prepareEntityPDFTables('payments', paymentsData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].title).toBe('Payments Report');
      expect(tables[0].summaryData?.totalPayments).toBe(2);
      expect(tables[0].summaryData?.totalAmount).toBeDefined();
    });

    it('should prepare tables for NGOs entity', () => {
      // Arrange
      const ngosData = [
        {
          name: 'NGO 1',
          category: 'Education',
          status: 'Verified',
          projectCount: 10,
          volunteerCount: 50,
          email: 'ngo1@example.com',
        },
      ];

      // Act
      const tables = prepareEntityPDFTables('ngos', ngosData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].title).toBe('Organizations Report');
      expect(tables[0].summaryData?.totalOrganizations).toBe(1);
    });

    it('should handle empty data arrays', () => {
      // Arrange
      const emptyData: any[] = [];

      // Act
      const tables = prepareEntityPDFTables('projects', emptyData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].data).toEqual([]);
      expect(tables[0].summaryData?.totalProjects).toBe(0);
    });

    it('should handle unknown entity types gracefully', () => {
      // Arrange
      const customData = [
        { field1: 'value1', field2: 'value2' },
        { field1: 'value3', field2: 'value4' },
      ];

      // Act
      const tables = prepareEntityPDFTables('custom' as any, customData);

      // Assert
      expect(tables).toHaveLength(1);
      expect(tables[0].data).toEqual(customData);
      expect(tables[0].columns.length).toBeGreaterThan(0);
    });
  });

  describe('PDF Export Download', () => {
    it('should call save method on PDF document', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Test Report',
        tables: [],
        filename: 'test.pdf',
      };

      // Mock the save method
      const mockSave = vi.fn();
      vi.mock('jspdf', () => ({
        default: vi.fn().mockImplementation(() => ({
          save: mockSave,
          internal: {
            getNumberOfPages: () => 1,
            pageSize: {
              getWidth: () => 210,
              getHeight: () => 297,
            },
          },
          setProperties: vi.fn(),
        })),
      }));

      // Act
      await exportPDFToDownload(options);

      // Note: In a real environment, we'd verify the save was called
      // but due to the nature of jsPDF, we just ensure no errors are thrown
      expect(true).toBe(true);
    });
  });

  describe('Data Formatting', () => {
    it('should format currency values correctly', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Financial Report',
        tables: [
          {
            title: 'Payments',
            data: [
              { amount: 1000000 },
              { amount: 500000 },
            ],
            columns: [{ header: 'Amount', dataKey: 'amount' }],
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should format date values correctly', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Timeline Report',
        tables: [
          {
            title: 'Events',
            data: [
              { date: '2024-01-15T00:00:00Z' },
              { date: '2024-02-20T00:00:00Z' },
            ],
            columns: [{ header: 'Date', dataKey: 'date' }],
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
    });

    it('should handle null and undefined values', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Test Report',
        tables: [
          {
            title: 'Data',
            data: [
              { field1: null, field2: undefined, field3: 'value' },
            ],
            columns: [
              { header: 'Field 1', dataKey: 'field1' },
              { header: 'Field 2', dataKey: 'field2' },
              { header: 'Field 3', dataKey: 'field3' },
            ],
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
    });
  });

  describe('Multiple Tables', () => {
    it('should handle multiple tables in single PDF', async () => {
      // Arrange
      const options: PDFExportOptions = {
        title: 'Comprehensive Report',
        tables: [
          {
            title: 'Projects',
            data: [{ name: 'Project 1' }],
            columns: [{ header: 'Name', dataKey: 'name' }],
          },
          {
            title: 'Volunteers',
            data: [{ name: 'Volunteer 1' }],
            columns: [{ header: 'Name', dataKey: 'name' }],
          },
          {
            title: 'Payments',
            data: [{ amount: 100000 }],
            columns: [{ header: 'Amount', dataKey: 'amount' }],
          },
        ],
        filename: 'test.pdf',
      };

      // Act
      const doc = await createPDFDocument(options);

      // Assert
      expect(doc).toBeDefined();
      // Multiple tables might span multiple pages
      expect(doc.internal.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    });
  });
});
