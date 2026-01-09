import { useState, useCallback } from 'react';
import { ExportConfig, ExportJob, ExportFormat, ExportEntityType, ExportStatus } from '../components/exports/types';
import {
  generateCSV,
  generateExcelCSV,
  generateJSON,
  generatePDFPlaceholder,
  downloadFile,
  getMimeType,
  generateFilename,
  applyFilters,
  applySorting,
  selectColumns,
} from '../utils/exportUtils';
import { toast } from 'sonner@2.0.3';

// Mock data for different entity types
const mockEntityData: Record<ExportEntityType, any[]> = {
  projects: [
    {
      id: 'PROJ-001',
      title: 'Rural Solar Electrification Program',
      ngo: 'Green Pakistan Initiative',
      status: 'Active',
      budget: 'PKR 12,500,000',
      spent: 'PKR 3,125,000',
      startDate: '2025-10-01',
      endDate: '2026-09-30',
      beneficiaries: 25000,
      sdgs: 'SDG-7, SDG-13',
      category: 'Energy & Environment',
      impactScore: 92,
      completionRate: '25%',
    },
    {
      id: 'PROJ-002',
      title: 'Clean Water Well Installation',
      ngo: 'Clean Water Alliance',
      status: 'Active',
      budget: 'PKR 8,200,000',
      spent: 'PKR 4,100,000',
      startDate: '2025-08-15',
      endDate: '2026-08-14',
      beneficiaries: 15000,
      sdgs: 'SDG-6',
      category: 'Water & Sanitation',
      impactScore: 88,
      completionRate: '50%',
    },
    {
      id: 'PROJ-003',
      title: 'Girls Education Initiative - Sindh',
      ngo: 'Education First Pakistan',
      status: 'Active',
      budget: 'PKR 15,000,000',
      spent: 'PKR 5,250,000',
      startDate: '2025-07-01',
      endDate: '2027-06-30',
      beneficiaries: 5000,
      sdgs: 'SDG-4, SDG-5',
      category: 'Education',
      impactScore: 95,
      completionRate: '35%',
    },
  ],
  ngos: [
    {
      id: 'NGO-001',
      name: 'Green Pakistan Initiative',
      category: 'Environment',
      status: 'Verified',
      verificationStatus: 'Approved',
      founded: 2015,
      projectCount: 45,
      volunteerCount: 2500,
      contact: 'info@greenpakistan.org',
      impactScore: 94,
      rating: 4.8,
      complianceScore: 98,
    },
    {
      id: 'NGO-002',
      name: 'Education First Pakistan',
      category: 'Education',
      status: 'Verified',
      verificationStatus: 'Approved',
      founded: 2012,
      projectCount: 38,
      volunteerCount: 1800,
      contact: 'contact@educationfirst.pk',
      impactScore: 96,
      rating: 4.9,
      complianceScore: 99,
    },
    {
      id: 'NGO-003',
      name: 'Clean Water Alliance',
      category: 'Water & Sanitation',
      status: 'Verified',
      verificationStatus: 'Approved',
      founded: 2018,
      projectCount: 22,
      volunteerCount: 800,
      contact: 'hello@cleanwater.pk',
      impactScore: 91,
      rating: 4.7,
      complianceScore: 97,
    },
  ],
  volunteers: [
    {
      id: 'VOL-001',
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@email.com',
      skills: 'Engineering, Solar Energy, Project Management',
      totalHours: 250,
      projectsCompleted: 12,
      joinDate: '2024-01-15',
      lastActive: '2026-01-03',
      status: 'Active',
    },
    {
      id: 'VOL-002',
      name: 'Ahmed Khan',
      email: 'ahmed.khan@email.com',
      skills: 'Teaching, Education, Rural Development',
      totalHours: 180,
      projectsCompleted: 8,
      joinDate: '2024-03-20',
      lastActive: '2026-01-02',
      status: 'Active',
    },
    {
      id: 'VOL-003',
      name: 'Fatima Malik',
      email: 'fatima.malik@email.com',
      skills: 'Healthcare, Medicine, Community Service',
      totalHours: 320,
      projectsCompleted: 15,
      joinDate: '2023-11-10',
      lastActive: '2026-01-03',
      status: 'Active',
    },
  ],
  opportunities: [
    {
      id: 'OPP-001',
      title: 'Solar Panel Installation Volunteers Needed',
      ngo: 'Green Pakistan Initiative',
      category: 'Environment',
      positions: 20,
      applicants: 45,
      location: 'Lahore, Punjab',
      duration: '3 months',
      postedDate: '2025-12-15',
      status: 'Open',
    },
    {
      id: 'OPP-002',
      title: 'Teaching Assistant - Girls School',
      ngo: 'Education First Pakistan',
      category: 'Education',
      positions: 10,
      applicants: 28,
      location: 'Sindh',
      duration: '6 months',
      postedDate: '2025-12-20',
      status: 'Open',
    },
  ],
  payments: [
    {
      id: 'PAY-001',
      project: 'Rural Solar Electrification Program',
      ngo: 'Green Pakistan Initiative',
      amount: 'PKR 3,125,000',
      status: 'Completed',
      paymentDate: '2026-01-02',
      method: 'Bank Transfer',
      approvedBy: 'Ahmed Khan, Fatima Hassan',
      milestone: 'Q1 2026',
      notes: 'Quarterly disbursement',
    },
    {
      id: 'PAY-002',
      project: 'Girls Education Initiative',
      ngo: 'Education First Pakistan',
      amount: 'PKR 850,000',
      status: 'Hold',
      paymentDate: '-',
      method: '-',
      approvedBy: '-',
      milestone: 'Dec 2025',
      holdReason: 'Document verification pending',
      requestedBy: 'NGO Manager',
      holdDate: '2025-12-28',
    },
  ],
  audit_logs: [
    {
      timestamp: '2026-01-03 10:30:45',
      user: 'admin@wasilah.pk',
      action: 'Payment Approved',
      entity: 'Payment',
      entityId: 'PAY-001',
      changes: 'Status: Pending → Completed',
      ipAddress: '192.168.1.1',
    },
    {
      timestamp: '2026-01-03 09:15:22',
      user: 'ngo.manager@wasilah.pk',
      action: 'NGO Verified',
      entity: 'NGO',
      entityId: 'NGO-005',
      changes: 'Verification Status: Pending → Approved',
      ipAddress: '192.168.1.2',
    },
  ],
  cases: [
    {
      caseId: 'CASE-005',
      type: 'Funding Dispute',
      priority: 'High',
      status: 'Escalated',
      assignee: 'Ahmed Khan',
      createdDate: '2025-12-28',
      lastUpdate: '2026-01-02',
      escalated: 'Yes',
    },
    {
      caseId: 'CASE-008',
      type: 'NGO Verification Issue',
      priority: 'Medium',
      status: 'Open',
      assignee: 'Sarah Ahmed',
      createdDate: '2025-12-30',
      lastUpdate: '2026-01-03',
      escalated: 'No',
    },
  ],
  users: [
    {
      id: 'USER-001',
      name: 'Ahmed Khan',
      email: 'admin@wasilah.pk',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '2026-01-03',
      permissions: 'All',
    },
    {
      id: 'USER-002',
      name: 'Fatima Hassan',
      email: 'fatima.hassan@wasilah.pk',
      role: 'NGO Manager',
      status: 'Active',
      lastLogin: '2026-01-03',
      permissions: 'NGO Management',
    },
  ],
  custom: [],
};

/**
 * Custom hook for export functionality
 */
export function useExport() {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Load export history from localStorage
  const loadExportHistory = useCallback(() => {
    const stored = localStorage.getItem('wasilah_export_history');
    if (stored) {
      try {
        setExportJobs(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load export history:', e);
      }
    }
  }, []);

  // Save export history to localStorage
  const saveExportHistory = useCallback((jobs: ExportJob[]) => {
    try {
      localStorage.setItem('wasilah_export_history', JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save export history:', e);
    }
  }, []);

  // Create export job
  const createExportJob = useCallback(
    (name: string, config: ExportConfig, emailDelivery?: ExportJob['emailDelivery']): ExportJob => {
      const job: ExportJob = {
        id: `EXP-${Date.now()}`,
        name,
        config,
        status: 'pending',
        priority: 'normal',
        createdAt: new Date().toISOString(),
        createdBy: 'current_user@wasilah.pk', // Would come from auth context
        progress: 0,
        emailDelivery,
      };

      return job;
    },
    []
  );

  // Perform export
  const performExport = useCallback(
    async (config: ExportConfig, jobName: string): Promise<void> => {
      setIsExporting(true);

      const job = createExportJob(jobName, config);
      const updatedJobs = [job, ...exportJobs];
      setExportJobs(updatedJobs);
      saveExportHistory(updatedJobs);

      try {
        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get data for entity type
        let data = mockEntityData[config.entityType] || [];

        // Apply filters
        data = applyFilters(data, config);

        // Apply sorting
        data = applySorting(data, config.sortBy, config.sortOrder);

        // Apply max rows limit
        if (config.maxRows && data.length > config.maxRows) {
          data = data.slice(0, config.maxRows);
        }

        // Select columns
        data = selectColumns(data, config.includeColumns);

        // Generate export based on format
        let content: string;
        let mimeType: string;
        let filename: string;

        switch (config.format) {
          case 'csv':
            content = generateCSV(data, config.includeColumns);
            mimeType = getMimeType('csv');
            filename = generateFilename(config.entityType, 'csv');
            break;

          case 'excel':
            content = generateExcelCSV(data, config.includeColumns);
            mimeType = getMimeType('excel');
            filename = generateFilename(config.entityType, 'excel');
            break;

          case 'json':
            content = generateJSON(data, config);
            mimeType = getMimeType('json');
            filename = generateFilename(config.entityType, 'json');
            break;

          case 'pdf':
            content = generatePDFPlaceholder(data, config);
            mimeType = getMimeType('pdf');
            filename = generateFilename(config.entityType, 'pdf');
            break;

          default:
            throw new Error(`Unsupported format: ${config.format}`);
        }

        // Download file
        downloadFile(content, filename, mimeType);

        // Update job status
        const completedJob: ExportJob = {
          ...job,
          status: 'completed',
          completedAt: new Date().toISOString(),
          rowCount: data.length,
          fileSize: new Blob([content]).size,
          progress: 100,
        };

        const finalJobs = updatedJobs.map((j) => (j.id === job.id ? completedJob : j));
        setExportJobs(finalJobs);
        saveExportHistory(finalJobs);

        toast.success(`Export completed: ${filename}`, {
          description: `${data.length} rows exported successfully`,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';

        const failedJob: ExportJob = {
          ...job,
          status: 'failed',
          failedAt: new Date().toISOString(),
          error: errorMessage,
        };

        const finalJobs = updatedJobs.map((j) => (j.id === job.id ? failedJob : j));
        setExportJobs(finalJobs);
        saveExportHistory(finalJobs);

        toast.error('Export failed', {
          description: errorMessage,
        });
      } finally {
        setIsExporting(false);
      }
    },
    [exportJobs, createExportJob, saveExportHistory]
  );

  // Cancel export job
  const cancelExportJob = useCallback(
    (jobId: string) => {
      const updatedJobs = exportJobs.map((job) =>
        job.id === jobId ? { ...job, status: 'cancelled' as ExportStatus } : job
      );
      setExportJobs(updatedJobs);
      saveExportHistory(updatedJobs);
      toast.success('Export cancelled');
    },
    [exportJobs, saveExportHistory]
  );

  // Delete export job from history
  const deleteExportJob = useCallback(
    (jobId: string) => {
      const updatedJobs = exportJobs.filter((job) => job.id !== jobId);
      setExportJobs(updatedJobs);
      saveExportHistory(updatedJobs);
      toast.success('Export deleted from history');
    },
    [exportJobs, saveExportHistory]
  );

  // Clear all export history
  const clearExportHistory = useCallback(() => {
    setExportJobs([]);
    localStorage.removeItem('wasilah_export_history');
    toast.success('Export history cleared');
  }, []);

  return {
    exportJobs,
    isExporting,
    performExport,
    cancelExportJob,
    deleteExportJob,
    clearExportHistory,
    loadExportHistory,
  };
}
