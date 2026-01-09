/**
 * Export Utility Functions
 * Functions for generating exports in different formats
 */

import { ExportConfig, ExportFormat } from './types';

/**
 * Generate CSV content from data
 */
export function generateCSV(data: any[], columns: string[]): string {
  // Header row
  const header = columns.join(',');

  // Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col];
        // Escape quotes and wrap in quotes if contains comma
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Generate Excel-compatible CSV (with BOM for UTF-8)
 */
export function generateExcelCSV(data: any[], columns: string[]): string {
  const csv = generateCSV(data, columns);
  // Add BOM for Excel UTF-8 compatibility
  return '\uFEFF' + csv;
}

/**
 * Generate JSON export
 */
export function generateJSON(data: any[], config: ExportConfig): string {
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      format: config.format,
      entityType: config.entityType,
      rowCount: data.length,
      filters: config.filters,
      dateRange: config.dateRange,
    },
    data: data,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Generate PDF (placeholder - would use jsPDF in production)
 */
export function generatePDFPlaceholder(data: any[], config: ExportConfig): string {
  // In production, use jsPDF or similar library
  // This is a placeholder that returns HTML that can be printed to PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Export Report - ${config.entityType}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #0369a1; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #0369a1; color: white; }
    tr:nth-child(even) { background-color: #f2f2f2; }
    .metadata { color: #666; margin-bottom: 20px; }
  </style>
</head>
<body>
  <h1>Wasilah Export Report</h1>
  <div class="metadata">
    <p><strong>Entity Type:</strong> ${config.entityType}</p>
    <p><strong>Exported At:</strong> ${new Date().toLocaleString()}</p>
    <p><strong>Total Records:</strong> ${data.length}</p>
  </div>
  <table>
    <thead>
      <tr>
        ${config.includeColumns.map(col => `<th>${col}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          ${config.includeColumns.map(col => `<td>${row[col] || ''}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `;

  return html;
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get MIME type for export format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    csv: 'text/csv;charset=utf-8',
    excel: 'application/vnd.ms-excel;charset=utf-8',
    pdf: 'application/pdf',
    json: 'application/json;charset=utf-8',
  };
  return mimeTypes[format];
}

/**
 * Get file extension for format
 */
export function getFileExtension(format: ExportFormat): string {
  const extensions: Record<ExportFormat, string> = {
    csv: '.csv',
    excel: '.xlsx',
    pdf: '.pdf',
    json: '.json',
  };
  return extensions[format];
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(entityType: string, format: ExportFormat): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const sanitized = entityType.toLowerCase().replace(/\s+/g, '_');
  return `wasilah_${sanitized}_${timestamp}${getFileExtension(format)}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Estimate file size before export
 */
export function estimateFileSize(rowCount: number, columnCount: number, format: ExportFormat): number {
  // Rough estimation based on format
  const bytesPerCell: Record<ExportFormat, number> = {
    csv: 20,
    excel: 25,
    pdf: 50,
    json: 30,
  };

  const baseSize = rowCount * columnCount * bytesPerCell[format];
  
  // Add overhead for headers, formatting, etc.
  const overhead: Record<ExportFormat, number> = {
    csv: 1.1,
    excel: 1.3,
    pdf: 1.5,
    json: 1.2,
  };

  return Math.round(baseSize * overhead[format]);
}

/**
 * Apply filters to data
 */
export function applyFilters(data: any[], config: ExportConfig): any[] {
  let filtered = [...data];

  if (!config.filters) return filtered;

  const { filters } = config;

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((item) => filters.status!.includes(item.status));
  }

  // Category filter
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((item) => filters.category!.includes(item.category));
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((item) =>
      item.tags?.some((tag: string) => filters.tags!.includes(tag))
    );
  }

  // Amount range filter
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter((item) => item.amount >= filters.minAmount!);
  }
  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter((item) => item.amount <= filters.maxAmount!);
  }

  // Date range filter
  if (config.dateRange) {
    const start = new Date(config.dateRange.start);
    const end = new Date(config.dateRange.end);
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.createdAt || item.date || item.timestamp);
      return itemDate >= start && itemDate <= end;
    });
  }

  return filtered;
}

/**
 * Apply sorting to data
 */
export function applySorting(data: any[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): any[] {
  if (!sortBy) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === bVal) return 0;

    let comparison = 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else {
      comparison = aVal < bVal ? -1 : 1;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

/**
 * Select columns from data
 */
export function selectColumns(data: any[], columns: string[]): any[] {
  return data.map((row) => {
    const selected: any = {};
    columns.forEach((col) => {
      selected[col] = row[col];
    });
    return selected;
  });
}
