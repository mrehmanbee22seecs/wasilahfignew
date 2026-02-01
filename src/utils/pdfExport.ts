/**
 * PDF Export Utility
 * 
 * Provides robust PDF export functionality with:
 * - Professional headers with logo and branding
 * - Tables with pagination and styling
 * - Summary sections with analytics
 * - Footer with page numbers and metadata
 * - High-quality print format
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportConfig, ExportEntityType } from '../components/exports/types';

export interface PDFTableConfig {
  title: string;
  data: any[];
  columns: PDFColumnConfig[];
  includeSummary?: boolean;
  summaryData?: Record<string, any>;
}

export interface PDFColumnConfig {
  header: string;
  dataKey: string;
  width?: number;
}

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  tables: PDFTableConfig[];
  filename: string;
  creator?: string;
  includeMetadata?: boolean;
  orientation?: 'portrait' | 'landscape';
}

// Color palette for consistent branding
const COLORS = {
  primary: [3, 105, 161], // #0369a1 - Wasilah blue
  secondary: [219, 234, 254], // #dbeafe - Light blue
  text: [31, 41, 55], // #1f2937 - Dark gray
  textLight: [107, 114, 128], // #6b7280 - Medium gray
  border: [229, 231, 235], // #e5e7eb - Light gray
  white: [255, 255, 255],
  background: [249, 250, 251], // #f9fafb
};

/**
 * Create PDF document with tables and styling
 */
export async function createPDFDocument(options: PDFExportOptions): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: options.orientation || 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set document properties
  doc.setProperties({
    title: options.title,
    author: options.creator || 'Wasilah Platform',
    creator: 'Wasilah CSR Platform',
    subject: 'Report Export',
  });

  let currentY = 20;

  // Add header with branding
  currentY = addDocumentHeader(doc, options.title, options.subtitle, currentY);

  // Add tables
  for (let i = 0; i < options.tables.length; i++) {
    const table = options.tables[i];
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    // Add table title
    if (table.title) {
      doc.setFontSize(14);
      doc.setTextColor(...COLORS.text);
      doc.setFont('helvetica', 'bold');
      doc.text(table.title, 14, currentY);
      currentY += 10;
    }

    // Generate table
    const columns = table.columns.map(col => ({ 
      header: col.header, 
      dataKey: col.dataKey 
    }));

    autoTable(doc, {
      startY: currentY,
      head: [columns.map(col => col.header)],
      body: table.data.map(row => 
        columns.map(col => formatCellValue(row[col.dataKey]))
      ),
      theme: 'striped',
      headStyles: {
        fillColor: COLORS.primary as [number, number, number],
        textColor: COLORS.white as [number, number, number],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: COLORS.text as [number, number, number],
      },
      alternateRowStyles: {
        fillColor: COLORS.background as [number, number, number],
      },
      columnStyles: table.columns.reduce((acc, col, idx) => {
        if (col.width) {
          acc[idx] = { cellWidth: col.width };
        }
        return acc;
      }, {} as Record<number, any>),
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Add page footer
        addPageFooter(doc, options.creator);
      },
    });

    // Get the final Y position after table
    const finalY = (doc as any).lastAutoTable?.finalY || currentY;
    currentY = finalY + 10;

    // Add summary section if requested
    if (table.includeSummary && table.summaryData) {
      currentY = addSummarySection(doc, table.summaryData, currentY);
    }

    // Add spacing between tables
    if (i < options.tables.length - 1) {
      currentY += 5;
    }
  }

  // Add metadata section if requested
  if (options.includeMetadata) {
    addMetadataSection(doc, options, currentY);
  }

  return doc;
}

/**
 * Add document header with logo and title
 */
function addDocumentHeader(doc: jsPDF, title: string, subtitle?: string, startY: number = 20): number {
  let currentY = startY;

  // Add logo placeholder (would be replaced with actual logo)
  doc.setFillColor(...COLORS.primary);
  doc.rect(14, currentY - 5, 30, 8, 'F');
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('WASILAH', 16, currentY);
  
  currentY += 15;

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, currentY);
  currentY += 8;

  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, currentY);
    currentY += 6;
  }

  // Add date
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textLight);
  doc.text(`Generated on: ${new Date().toLocaleString('en-US', { 
    dateStyle: 'long', 
    timeStyle: 'short' 
  })}`, 14, currentY);
  currentY += 10;

  // Add horizontal line
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.5);
  doc.line(14, currentY, 196, currentY);
  currentY += 10;

  return currentY;
}

/**
 * Add page footer with page numbers
 */
function addPageFooter(doc: jsPDF, creator?: string): void {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    // Footer text
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textLight);
    doc.setFont('helvetica', 'normal');
    
    // Left: Creator/Organization
    doc.text(creator || 'Wasilah CSR Platform', 14, pageHeight - 10);
    
    // Right: Page number
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: 'right' }
    );
  }
}

/**
 * Add summary section with key metrics
 */
function addSummarySection(doc: jsPDF, summaryData: Record<string, any>, startY: number): number {
  let currentY = startY;

  // Check if we need a new page
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, currentY);
  currentY += 8;

  // Add summary items
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  Object.entries(summaryData).forEach(([key, value]) => {
    const label = formatHeaderName(key);
    doc.setTextColor(...COLORS.textLight);
    doc.text(`${label}:`, 14, currentY);
    doc.setTextColor(...COLORS.text);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), 80, currentY);
    doc.setFont('helvetica', 'normal');
    currentY += 6;
  });

  return currentY + 10;
}

/**
 * Add metadata section
 */
function addMetadataSection(doc: jsPDF, options: PDFExportOptions, startY: number): void {
  // Metadata is typically added on a new page
  doc.addPage();
  
  let currentY = 20;
  
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('Export Information', 14, currentY);
  currentY += 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.textLight);

  const metadata = [
    ['Export Date', new Date().toLocaleString()],
    ['Generated By', options.creator || 'System'],
    ['Format', 'PDF Document'],
    ['Tables Included', String(options.tables.length)],
  ];

  metadata.forEach(([key, value]) => {
    doc.text(`${key}:`, 14, currentY);
    doc.text(value, 60, currentY);
    currentY += 6;
  });
}

/**
 * Format cell value for display
 */
function formatCellValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'number') {
    // Check if it's a currency value (large numbers)
    if (value > 10000) {
      return `PKR ${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // Check if it's an ISO date string
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (e) {
      // Not a valid date
    }
  }

  return String(value);
}

/**
 * Format header name (snake_case/camelCase to Title Case)
 */
function formatHeaderName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

/**
 * Export PDF to browser download
 */
export async function exportPDFToDownload(options: PDFExportOptions): Promise<void> {
  const doc = await createPDFDocument(options);
  doc.save(options.filename);
}

/**
 * Prepare entity-specific PDF tables
 */
export function prepareEntityPDFTables(
  entityType: ExportEntityType,
  data: any[],
  config?: ExportConfig
): PDFTableConfig[] {
  const tables: PDFTableConfig[] = [];

  switch (entityType) {
    case 'projects':
      tables.push({
        title: 'Projects Report',
        data: data,
        columns: [
          { header: 'Project Name', dataKey: 'name' },
          { header: 'NGO', dataKey: 'ngoName' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Budget (PKR)', dataKey: 'budget' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Beneficiaries', dataKey: 'beneficiaries' },
        ],
        includeSummary: true,
        summaryData: {
          totalProjects: data.length,
          totalBudget: data.reduce((sum, p) => sum + (Number(p.budget) || 0), 0).toLocaleString(),
          totalBeneficiaries: data.reduce((sum, p) => sum + (Number(p.beneficiaries) || 0), 0).toLocaleString(),
          activeProjects: data.filter(p => p.status === 'Active').length,
        },
      });
      break;

    case 'volunteers':
      tables.push({
        title: 'Volunteers Report',
        data: data,
        columns: [
          { header: 'Name', dataKey: 'name' },
          { header: 'Email', dataKey: 'email' },
          { header: 'Skills', dataKey: 'skills' },
          { header: 'Total Hours', dataKey: 'totalHours' },
          { header: 'Projects Completed', dataKey: 'projectsCompleted' },
          { header: 'Status', dataKey: 'status' },
        ],
        includeSummary: true,
        summaryData: {
          totalVolunteers: data.length,
          totalHours: data.reduce((sum, v) => sum + (Number(v.totalHours) || 0), 0).toLocaleString(),
          activeVolunteers: data.filter(v => v.status === 'Active').length,
          avgHoursPerVolunteer: Math.round(
            data.reduce((sum, v) => sum + (Number(v.totalHours) || 0), 0) / data.length
          ),
        },
      });
      break;

    case 'payments':
      tables.push({
        title: 'Payments Report',
        data: data,
        columns: [
          { header: 'Project', dataKey: 'projectName' },
          { header: 'NGO', dataKey: 'ngoName' },
          { header: 'Amount (PKR)', dataKey: 'amount' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Date', dataKey: 'disbursedAt' },
          { header: 'Milestone', dataKey: 'milestone' },
        ],
        includeSummary: true,
        summaryData: {
          totalPayments: data.length,
          totalAmount: data.reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString(),
          completed: data.filter(p => p.status === 'Completed').length,
          pending: data.filter(p => p.status === 'Pending').length,
        },
      });
      break;

    case 'ngos':
      tables.push({
        title: 'Organizations Report',
        data: data,
        columns: [
          { header: 'Organization', dataKey: 'name' },
          { header: 'Category', dataKey: 'category' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Projects', dataKey: 'projectCount' },
          { header: 'Volunteers', dataKey: 'volunteerCount' },
          { header: 'Email', dataKey: 'email' },
        ],
        includeSummary: true,
        summaryData: {
          totalOrganizations: data.length,
          verified: data.filter(n => n.status === 'Verified').length,
          totalProjects: data.reduce((sum, n) => sum + (Number(n.projectCount) || 0), 0),
          totalVolunteers: data.reduce((sum, n) => sum + (Number(n.volunteerCount) || 0), 0),
        },
      });
      break;

    case 'opportunities':
      tables.push({
        title: 'Volunteer Opportunities Report',
        data: data,
        columns: [
          { header: 'Position', dataKey: 'position' },
          { header: 'Project', dataKey: 'projectName' },
          { header: 'Skills Required', dataKey: 'skills' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Start Date', dataKey: 'startDate' },
        ],
        includeSummary: true,
        summaryData: {
          totalOpportunities: data.length,
          openPositions: data.filter(o => o.status === 'Open').length,
        },
      });
      break;

    case 'audit_logs':
      tables.push({
        title: 'Audit Logs Report',
        data: data,
        columns: [
          { header: 'Action', dataKey: 'action' },
          { header: 'User', dataKey: 'userName' },
          { header: 'Entity Type', dataKey: 'entityType' },
          { header: 'Timestamp', dataKey: 'timestamp' },
          { header: 'IP Address', dataKey: 'ipAddress' },
        ],
        includeSummary: true,
        summaryData: {
          totalLogs: data.length,
          uniqueUsers: new Set(data.map(l => l.userName)).size,
        },
      });
      break;

    default:
      // Generic table for unknown entity types
      if (data.length > 0) {
        const sampleRow = data[0];
        const columns = Object.keys(sampleRow).slice(0, 6).map(key => ({
          header: formatHeaderName(key),
          dataKey: key,
        }));

        tables.push({
          title: `${entityType} Report`,
          data: data,
          columns: columns,
          includeSummary: true,
          summaryData: {
            totalRecords: data.length,
          },
        });
      }
  }

  return tables;
}
