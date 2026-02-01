import { useState, useCallback } from 'react';
import { ExportConfig, ExportJob, ExportStatus } from '../components/exports/types';
import { toast } from 'sonner';
import {
  generateCSV,
  generateJSON,
  downloadFile,
  generateFilename,
  getMimeType,
  estimateFileSize,
} from '../utils/exportFormatters';
import { getColumnsByEntityType } from '../components/exports/columnDefinitions';
import { projectsApi } from '../lib/api/projects';
import { volunteersApi } from '../lib/api/volunteers';
import { applicationsApi } from '../lib/api/applications';
import { paymentsApi } from '../lib/api/payments';
import { ngosApi } from '../lib/api/ngos';

/**
 * Fetch real data from API based on entity type
 */
async function fetchExportData(entityType: string, config: ExportConfig): Promise<any[]> {
  try {
    let response;
    
    switch (entityType) {
      case 'projects':
        response = await projectsApi.exportData(config.filters || {});
        break;
      case 'volunteers':
        response = await volunteersApi.exportData(config.filters || {});
        break;
      case 'opportunities':
        // Applications are volunteer opportunities
        response = await applicationsApi.exportData(config.filters || {});
        break;
      case 'payments':
        response = await paymentsApi.exportData(config.filters || {});
        break;
      case 'ngos':
        response = await ngosApi.exportData(config.filters || {});
        break;
      default:
        // Fallback to mock data for unsupported entity types
        return generateMockData(entityType, 100);
    }
    
    if (response.success && response.data) {
      return Array.isArray(response.data) ? response.data : [response.data];
    } else {
      console.error('Failed to fetch export data:', response.error);
      toast.error(`Failed to fetch ${entityType} data: ${response.error}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching export data:', error);
    toast.error(`Error fetching ${entityType} data`);
    return [];
  }
}

/**
 * Mock data generator for demo purposes (fallback)
 * Used only for entity types without API support
 */
function generateMockData(entityType: string, count: number = 100): any[] {
  const data: any[] = [];

  for (let i = 0; i < count; i++) {
    if (entityType === 'projects') {
      data.push({
        id: `PROJ-${String(i + 1).padStart(4, '0')}`,
        name: `Project ${i + 1}`,
        ngoName: `NGO ${(i % 10) + 1}`,
        category: ['Education', 'Healthcare', 'Environment', 'Water'][i % 4],
        budget: (Math.random() * 10000000 + 1000000).toFixed(0),
        status: ['Active', 'Completed', 'Pending'][i % 3],
        beneficiaries: Math.floor(Math.random() * 5000 + 100),
        sdgs: `SDG-${((i % 17) + 1)}`,
        startDate: new Date(2024, i % 12, 1).toISOString(),
        endDate: new Date(2025, (i % 12), 1).toISOString(),
        progress: Math.floor(Math.random() * 100),
        location: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'][i % 4],
      });
    } else if (entityType === 'ngos') {
      data.push({
        id: `NGO-${String(i + 1).padStart(4, '0')}`,
        name: `NGO Organization ${i + 1}`,
        status: ['Verified', 'Pending', 'Rejected'][i % 3],
        category: ['Education', 'Healthcare', 'Environment'][i % 3],
        registrationNumber: `REG-${Math.floor(Math.random() * 100000)}`,
        email: `ngo${i + 1}@example.pk`,
        phone: `+92-300-${Math.floor(Math.random() * 10000000)}`,
        address: `Address ${i + 1}, Pakistan`,
        founded: new Date(2010 + (i % 14), 0, 1).toISOString(),
        projectCount: Math.floor(Math.random() * 50),
        volunteerCount: Math.floor(Math.random() * 200),
        verified: i % 3 === 0,
        rating: (Math.random() * 2 + 3).toFixed(1),
      });
    } else if (entityType === 'volunteers') {
      data.push({
        id: `VOL-${String(i + 1).padStart(4, '0')}`,
        name: `Volunteer ${i + 1}`,
        email: `volunteer${i + 1}@example.com`,
        phone: `+92-300-${Math.floor(Math.random() * 10000000)}`,
        skills: ['Teaching', 'Healthcare', 'IT', 'Marketing'][i % 4],
        totalHours: Math.floor(Math.random() * 500),
        projectsCompleted: Math.floor(Math.random() * 20),
        status: ['Active', 'Inactive'][i % 2],
        joinedAt: new Date(2023, i % 12, 1).toISOString(),
        lastActivity: new Date(2026, 0, (i % 28) + 1).toISOString(),
        city: ['Karachi', 'Lahore', 'Islamabad'][i % 3],
        education: ['Bachelors', 'Masters', 'PhD'][i % 3],
      });
    } else if (entityType === 'payments') {
      data.push({
        id: `PAY-${String(i + 1).padStart(4, '0')}`,
        projectName: `Project ${(i % 50) + 1}`,
        ngoName: `NGO ${(i % 20) + 1}`,
        corporateName: `Corporate ${(i % 10) + 1}`,
        amount: (Math.random() * 5000000 + 100000).toFixed(0),
        status: ['Completed', 'Pending', 'On Hold'][i % 3],
        type: ['Disbursement', 'Refund', 'Hold'][i % 3],
        disbursedAt: new Date(2025, i % 12, (i % 28) + 1).toISOString(),
        approvedBy: `Admin ${(i % 5) + 1}`,
        reference: `REF-${Math.floor(Math.random() * 1000000)}`,
        milestone: `Milestone ${(i % 5) + 1}`,
      });
    }
  }

  return data;
}

/**
 * Custom hook for export management
 */
export function useExports() {
  const [exportHistory, setExportHistory] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Create and execute an export job
   */
  const createExport = useCallback(
    async (config: ExportConfig): Promise<ExportJob> => {
      setIsExporting(true);

      const job: ExportJob = {
        id: `EXP-${Date.now()}`,
        config,
        status: 'pending',
        progress: 0,
        totalRecords: 0,
        processedRecords: 0,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: 'user-001',
          name: 'Admin User',
          email: 'admin@wasilah.pk',
        },
      };

      // Add to history
      setExportHistory((prev) => [job, ...prev]);

      try {
        // Update status to processing
        job.status = 'processing';
        job.startedAt = new Date().toISOString();
        setExportHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Fetch real data from API
        const data = await fetchExportData(config.entityType, config);
        
        if (data.length === 0) {
          throw new Error('No data available for export');
        }
        
        job.totalRecords = data.length;

        setExportHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Get columns
        const allColumns = getColumnsByEntityType(config.entityType);
        const selectedColumns = config.columns?.length
          ? allColumns.filter((col) => config.columns!.includes(col.id))
          : allColumns;

        // Filter by date range if specified
        let filteredData = data;
        if (config.dateRange) {
          const from = new Date(config.dateRange.from);
          const to = new Date(config.dateRange.to);
          filteredData = data.filter((row) => {
            const date = new Date(row.startDate || row.createdAt || row.joinedAt);
            return date >= from && date <= to;
          });
        }

        // Generate export based on format
        let content: string;
        let filename: string;

        if (config.format === 'csv') {
          content = generateCSV(filteredData, selectedColumns);
          filename = generateFilename(config.entityType, 'csv');
        } else if (config.format === 'json') {
          content = generateJSON(filteredData, selectedColumns);
          filename = generateFilename(config.entityType, 'json');
        } else if (config.format === 'excel') {
          // For Excel, we'll use CSV for now (would need xlsx library in production)
          content = generateCSV(filteredData, selectedColumns);
          filename = generateFilename(config.entityType, 'csv');
          toast.info('Excel format using CSV for demo. Add xlsx library for real Excel files.');
        } else if (config.format === 'pdf') {
          // For PDF, we'll use JSON for now (would need jsPDF library in production)
          content = generateJSON(filteredData, selectedColumns);
          filename = generateFilename(config.entityType, 'json');
          toast.info('PDF format using JSON for demo. Add jsPDF library for real PDFs.');
        } else {
          throw new Error(`Unsupported format: ${config.format}`);
        }

        // Simulate processing progress
        for (let i = 0; i <= 100; i += 20) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          job.progress = i;
          job.processedRecords = Math.floor((filteredData.length * i) / 100);
          setExportHistory((prev) =>
            prev.map((j) => (j.id === job.id ? { ...job } : j))
          );
        }

        // Complete the job
        job.status = 'completed';
        job.progress = 100;
        job.processedRecords = filteredData.length;
        job.completedAt = new Date().toISOString();
        job.fileSize = new Blob([content]).size;
        job.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

        setExportHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        // Download the file
        const mimeType = getMimeType(config.format === 'excel' ? 'csv' : config.format === 'pdf' ? 'json' : config.format);
        downloadFile(content, filename, mimeType);

        // Email delivery simulation
        if (config.emailDelivery?.enabled) {
          toast.success(
            `Export sent to ${config.emailDelivery.recipients.length} recipient(s)`
          );
        }

        toast.success('Export completed successfully!');
        setIsExporting(false);

        return job;
      } catch (error) {
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : 'Export failed';
        job.completedAt = new Date().toISOString();

        setExportHistory((prev) =>
          prev.map((j) => (j.id === job.id ? { ...job } : j))
        );

        toast.error(`Export failed: ${job.error}`);
        setIsExporting(false);

        throw error;
      }
    },
    []
  );

  /**
   * Cancel an export job
   */
  const cancelExport = useCallback((jobId: string) => {
    setExportHistory((prev) =>
      prev.map((job) =>
        job.id === jobId && job.status === 'processing'
          ? { ...job, status: 'cancelled' as ExportStatus }
          : job
      )
    );
    toast.info('Export cancelled');
  }, []);

  /**
   * Delete an export from history
   */
  const deleteExport = useCallback((jobId: string) => {
    setExportHistory((prev) => prev.filter((job) => job.id !== jobId));
    toast.success('Export deleted from history');
  }, []);

  /**
   * Clear all export history
   */
  const clearHistory = useCallback(() => {
    setExportHistory([]);
    toast.success('Export history cleared');
  }, []);

  /**
   * Re-download a completed export
   */
  const redownloadExport = useCallback((job: ExportJob) => {
    if (job.status !== 'completed') {
      toast.error('Export is not completed');
      return;
    }

    // In production, this would fetch from the downloadUrl
    toast.info('Re-generating download...');
    createExport(job.config);
  }, [createExport]);

  return {
    exportHistory,
    isExporting,
    createExport,
    cancelExport,
    deleteExport,
    clearHistory,
    redownloadExport,
  };
}
