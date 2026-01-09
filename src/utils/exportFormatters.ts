/**
 * Export Format Generation Utilities
 * Functions to generate CSV, Excel, PDF, and JSON exports
 */

import { ExportFormat, ColumnDefinition } from '../components/exports/types';

/**
 * Convert data to CSV format
 */
export function generateCSV(data: any[], columns: ColumnDefinition[]): string {
  if (!data || data.length === 0) return '';

  // Header row
  const headers = columns.map((col) => col.label).join(',');

  // Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.field];
        // Escape commas and quotes
        const escaped = String(value || '')
          .replace(/"/g, '""')
          .replace(/\n/g, ' ');
        return `"${escaped}"`;
      })
      .join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Convert data to JSON format
 */
export function generateJSON(
  data: any[],
  columns: ColumnDefinition[],
  pretty = true
): string {
  const filtered = data.map((row) => {
    const obj: Record<string, any> = {};
    columns.forEach((col) => {
      obj[col.field] = row[col.field];
    });
    return obj;
  });

  return JSON.stringify(filtered, null, pretty ? 2 : 0);
}

/**
 * Format value based on column type
 */
export function formatValue(value: any, type: ColumnDefinition['type']): string {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();

    case 'currency':
      return `PKR ${Number(value).toLocaleString()}`;

    case 'number':
      return Number(value).toLocaleString();

    case 'boolean':
      return value ? 'Yes' : 'No';

    default:
      return String(value);
  }
}

/**
 * Download file to user's computer
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
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
 * Generate filename with timestamp
 */
export function generateFilename(
  entityType: string,
  format: ExportFormat
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const extension = format === 'excel' ? 'xlsx' : format;
  return `wasilah_${entityType}_${timestamp}.${extension}`;
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: ExportFormat): string {
  const mimeTypes: Record<ExportFormat, string> = {
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
    json: 'application/json',
  };
  return mimeTypes[format];
}

/**
 * Estimate file size
 */
export function estimateFileSize(
  recordCount: number,
  columnCount: number,
  format: ExportFormat
): number {
  // Rough estimates in bytes
  const bytesPerCell: Record<ExportFormat, number> = {
    csv: 20,
    excel: 30,
    pdf: 50,
    json: 40,
  };

  return recordCount * columnCount * bytesPerCell[format];
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
