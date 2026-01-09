/**
 * Export & Report Type Definitions
 * Types for the export and reporting system
 */

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export type ExportEntityType =
  | 'projects'
  | 'ngos'
  | 'volunteers'
  | 'opportunities'
  | 'payments'
  | 'audit_logs'
  | 'cases'
  | 'users'
  | 'custom';

export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type ExportPriority = 'low' | 'normal' | 'high';

export type ExportConfig = {
  format: ExportFormat;
  entityType: ExportEntityType;
  includeColumns: string[];
  excludeColumns?: string[];
  filters?: ExportFilters;
  dateRange?: DateRange;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  maxRows?: number;
  includeMetadata?: boolean;
  customTemplate?: string;
};

export type ExportFilters = {
  status?: string[];
  category?: string[];
  tags?: string[];
  sdgs?: string[];
  minAmount?: number;
  maxAmount?: number;
  location?: string[];
  customFields?: Record<string, any>;
};

export type DateRange = {
  start: string; // ISO date string
  end: string; // ISO date string
  preset?: 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'this_month' | 'last_month' | 'this_year' | 'custom';
};

export type ExportJob = {
  id: string;
  name: string;
  config: ExportConfig;
  status: ExportStatus;
  priority: ExportPriority;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  createdBy: string;
  rowCount?: number;
  fileSize?: number;
  filePath?: string;
  downloadUrl?: string;
  error?: string;
  progress?: number; // 0-100
  emailDelivery?: {
    enabled: boolean;
    recipients: string[];
    subject?: string;
    message?: string;
  };
};

export type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  entityType: ExportEntityType;
  format: ExportFormat;
  icon?: React.ReactNode;
  config: Partial<ExportConfig>;
  isCustom?: boolean;
};

export type ColumnOption = {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  group?: string;
};

export type ExportStats = {
  totalExports: number;
  completedExports: number;
  failedExports: number;
  totalDataExported: number; // rows
  totalFileSizeExported: number; // bytes
  averageExportTime: number; // ms
  byFormat: Record<ExportFormat, number>;
  byEntityType: Record<ExportEntityType, number>;
};
