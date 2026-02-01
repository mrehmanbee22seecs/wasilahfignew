/**
 * Excel Export Utility
 * 
 * Provides robust Excel export functionality with:
 * - Multi-sheet support
 * - Styled headers and alternating row colors
 * - Excel formulas (SUM, AVERAGE, COUNT, etc.)
 * - Conditional formatting
 * - Summary sheets with analytics
 */

import ExcelJS from 'exceljs';
import { ExportConfig, ExportEntityType } from '../components/exports/types';

export interface ExcelSheetConfig {
  name: string;
  data: any[];
  columns: ExcelColumnConfig[];
  includeFormulas?: boolean;
  includeSummary?: boolean;
  freezeHeader?: boolean;
}

export interface ExcelColumnConfig {
  header: string;
  key: string;
  width?: number;
  style?: Partial<ExcelJS.Style>;
  format?: string; // For dates, currency, etc.
  formula?: string; // For summary rows
}

export interface ExcelExportOptions {
  sheets: ExcelSheetConfig[];
  filename: string;
  creator?: string;
  includeAnalytics?: boolean;
}

/**
 * Style definitions for consistent formatting
 */
const STYLES = {
  header: {
    font: { bold: true, size: 12, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FF0369A1' } },
    alignment: { horizontal: 'left' as const, vertical: 'middle' as const },
    border: {
      top: { style: 'thin' as const, color: { argb: 'FF000000' } },
      bottom: { style: 'thin' as const, color: { argb: 'FF000000' } },
      left: { style: 'thin' as const, color: { argb: 'FF000000' } },
      right: { style: 'thin' as const, color: { argb: 'FF000000' } },
    },
  },
  evenRow: {
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFF3F4F6' } },
  },
  oddRow: {
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFFFFFFF' } },
  },
  summaryRow: {
    font: { bold: true, size: 11 },
    fill: { type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: 'FFDBEAFE' } },
    border: {
      top: { style: 'medium' as const, color: { argb: 'FF0369A1' } },
    },
  },
  currency: {
    numFmt: '"PKR "#,##0.00',
  },
  date: {
    numFmt: 'dd/mm/yyyy',
  },
  percentage: {
    numFmt: '0.00%',
  },
};

/**
 * Create Excel workbook with multiple sheets and styling
 */
export async function createExcelWorkbook(options: ExcelExportOptions): Promise<ExcelJS.Workbook> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = options.creator || 'Wasilah Platform';
  workbook.lastModifiedBy = options.creator || 'Wasilah Platform';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Add each sheet
  for (const sheetConfig of options.sheets) {
    await addWorksheet(workbook, sheetConfig);
  }

  // Add analytics/summary sheet if requested
  if (options.includeAnalytics && options.sheets.length > 0) {
    await addAnalyticsSheet(workbook, options.sheets);
  }

  return workbook;
}

/**
 * Add a worksheet with data, styling, and formulas
 */
async function addWorksheet(
  workbook: ExcelJS.Workbook,
  config: ExcelSheetConfig
): Promise<void> {
  const worksheet = workbook.addWorksheet(config.name, {
    views: [{ state: 'frozen', xSplit: 0, ySplit: config.freezeHeader !== false ? 1 : 0 }],
  });

  // Define columns
  worksheet.columns = config.columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 15,
    style: col.style,
  }));

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.style = STYLES.header;
  });

  // Add data rows with alternating colors
  config.data.forEach((rowData, index) => {
    const row = worksheet.addRow(rowData);
    
    // Apply alternating row colors
    const rowStyle = index % 2 === 0 ? STYLES.evenRow : STYLES.oddRow;
    row.eachCell((cell) => {
      cell.fill = rowStyle.fill;
      
      // Apply column-specific formatting
      const column = config.columns.find((col) => col.key === cell.address.replace(/\d+/g, '').toLowerCase());
      if (column?.format) {
        applyFormat(cell, column.format);
      }
    });
  });

  // Add summary row with formulas if requested
  if (config.includeSummary !== false && config.data.length > 0) {
    await addSummaryRow(worksheet, config);
  }

  // Auto-filter on header row
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: config.columns.length },
  };
}

/**
 * Add summary row with formulas
 */
async function addSummaryRow(
  worksheet: ExcelJS.Worksheet,
  config: ExcelSheetConfig
): Promise<void> {
  const dataRowCount = config.data.length;
  const summaryRowNum = dataRowCount + 2; // +1 for header, +1 for blank row
  
  // Add blank row before summary
  worksheet.addRow([]);
  
  // Create summary row data
  const summaryData: any = {};
  
  config.columns.forEach((col, colIndex) => {
    const columnLetter = String.fromCharCode(65 + colIndex); // A, B, C, etc.
    
    // Determine if column is numeric and should have a formula
    const isNumeric = config.data.some(
      (row) => typeof row[col.key] === 'number' && !isNaN(row[col.key])
    );
    
    if (col.formula) {
      // Use custom formula if provided
      summaryData[col.key] = { formula: col.formula };
    } else if (isNumeric) {
      // Auto-generate SUM formula for numeric columns
      const startRow = 2; // After header
      const endRow = dataRowCount + 1;
      summaryData[col.key] = { formula: `SUM(${columnLetter}${startRow}:${columnLetter}${endRow})` };
    } else if (colIndex === 0) {
      // First column shows "Total" or "Summary"
      summaryData[col.key] = 'TOTAL';
    } else {
      summaryData[col.key] = '';
    }
  });
  
  const summaryRow = worksheet.addRow(summaryData);
  
  // Style summary row
  summaryRow.eachCell((cell) => {
    cell.style = STYLES.summaryRow;
    
    // Apply column-specific formatting to formula results
    const column = config.columns.find((col) => {
      const cellCol = cell.address.replace(/\d+/g, '').toLowerCase();
      return col.key.toLowerCase() === cellCol || col.key.toLowerCase().startsWith(cellCol);
    });
    
    if (column?.format) {
      applyFormat(cell, column.format);
    }
  });
}

/**
 * Add analytics/summary sheet with cross-entity analytics
 */
async function addAnalyticsSheet(
  workbook: ExcelJS.Workbook,
  sheets: ExcelSheetConfig[]
): Promise<void> {
  const worksheet = workbook.addWorksheet('Analytics Summary', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  // Title
  const titleRow = worksheet.addRow(['Wasilah Platform - Analytics Summary']);
  titleRow.font = { bold: true, size: 16, color: { argb: 'FF0369A1' } };
  titleRow.height = 30;
  worksheet.mergeCells('A1:D1');
  
  // Add export date
  worksheet.addRow([]);
  const dateRow = worksheet.addRow(['Export Date:', new Date().toLocaleString()]);
  dateRow.getCell(2).numFmt = 'dd/mm/yyyy hh:mm';
  
  worksheet.addRow([]);
  
  // Summary statistics for each sheet
  const summaryHeaderRow = worksheet.addRow(['Sheet Name', 'Total Records', 'Columns', 'Status']);
  summaryHeaderRow.eachCell((cell) => {
    cell.style = STYLES.header;
  });
  
  sheets.forEach((sheet) => {
    const row = worksheet.addRow([
      sheet.name,
      sheet.data.length,
      sheet.columns.length,
      'Complete',
    ]);
    
    // Alternating colors
    const rowNum = row.number;
    if (rowNum % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = STYLES.evenRow.fill;
      });
    }
  });
  
  // Set column widths
  worksheet.getColumn(1).width = 25;
  worksheet.getColumn(2).width = 15;
  worksheet.getColumn(3).width = 15;
  worksheet.getColumn(4).width = 15;
  
  // Add totals
  worksheet.addRow([]);
  const totalRow = worksheet.addRow([
    'TOTAL',
    { formula: `SUM(B6:B${5 + sheets.length})` },
    '',
    '',
  ]);
  totalRow.eachCell((cell) => {
    cell.style = STYLES.summaryRow;
  });
}

/**
 * Apply format to a cell based on format type
 */
function applyFormat(cell: ExcelJS.Cell, format: string): void {
  switch (format) {
    case 'currency':
      cell.numFmt = STYLES.currency.numFmt;
      break;
    case 'date':
      cell.numFmt = STYLES.date.numFmt;
      break;
    case 'percentage':
      cell.numFmt = STYLES.percentage.numFmt;
      break;
    default:
      if (format.startsWith('numFmt:')) {
        cell.numFmt = format.replace('numFmt:', '');
      }
  }
}

/**
 * Export Excel file to browser download
 */
export async function exportExcelToDownload(
  options: ExcelExportOptions
): Promise<void> {
  const workbook = await createExcelWorkbook(options);
  
  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  
  // Create blob and download
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prepare data for entity-specific export
 */
export function prepareEntitySheets(
  entityType: ExportEntityType,
  data: any[],
  config?: ExportConfig
): ExcelSheetConfig[] {
  const sheets: ExcelSheetConfig[] = [];
  
  switch (entityType) {
    case 'projects':
      sheets.push(prepareProjectsSheet(data));
      if (data.length > 0) {
        sheets.push(prepareProjectsSummarySheet(data));
      }
      break;
      
    case 'volunteers':
      sheets.push(prepareVolunteersSheet(data));
      if (data.length > 0) {
        sheets.push(prepareVolunteersSummarySheet(data));
      }
      break;
      
    case 'payments':
      sheets.push(preparePaymentsSheet(data));
      if (data.length > 0) {
        sheets.push(preparePaymentsSummarySheet(data));
      }
      break;
      
    case 'ngos':
      sheets.push(prepareNGOsSheet(data));
      if (data.length > 0) {
        sheets.push(prepareNGOsSummarySheet(data));
      }
      break;
      
    case 'opportunities':
      sheets.push(prepareOpportunitiesSheet(data));
      break;
      
    case 'audit_logs':
      sheets.push(prepareAuditLogsSheet(data));
      break;
      
    default:
      sheets.push({
        name: entityType,
        data,
        columns: Object.keys(data[0] || {}).map((key) => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          key,
        })),
      });
  }
  
  return sheets;
}

// Entity-specific sheet preparation functions

function prepareProjectsSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'Projects',
    data: data.map((project) => ({
      id: project.id,
      title: project.title || project.name,
      ngo: project.ngo_name || project.organization,
      status: project.status,
      category: project.category,
      budget: project.budget || 0,
      spent: project.amount_spent || project.spent || 0,
      remaining: (project.budget || 0) - (project.amount_spent || project.spent || 0),
      startDate: project.start_date || project.startDate,
      endDate: project.end_date || project.endDate,
      beneficiaries: project.beneficiaries || 0,
      impactScore: project.impact_score || project.impactScore || 0,
    })),
    columns: [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'NGO', key: 'ngo', width: 25 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Budget', key: 'budget', width: 15, format: 'currency' },
      { header: 'Spent', key: 'spent', width: 15, format: 'currency' },
      { header: 'Remaining', key: 'remaining', width: 15, format: 'currency' },
      { header: 'Start Date', key: 'startDate', width: 12, format: 'date' },
      { header: 'End Date', key: 'endDate', width: 12, format: 'date' },
      { header: 'Beneficiaries', key: 'beneficiaries', width: 12 },
      { header: 'Impact Score', key: 'impactScore', width: 12 },
    ],
    includeSummary: true,
  };
}

function prepareProjectsSummarySheet(data: any[]): ExcelSheetConfig {
  const statusCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  
  data.forEach((project) => {
    const status = project.status || 'unknown';
    const category = project.category || 'uncategorized';
    
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  const summaryData = [
    { metric: 'Total Projects', value: data.length },
    { metric: 'Active Projects', value: statusCounts['active'] || 0 },
    { metric: 'Completed Projects', value: statusCounts['completed'] || 0 },
    { metric: 'Total Budget', value: data.reduce((sum, p) => sum + (p.budget || 0), 0) },
    { metric: 'Total Spent', value: data.reduce((sum, p) => sum + (p.amount_spent || p.spent || 0), 0) },
    { metric: 'Total Beneficiaries', value: data.reduce((sum, p) => sum + (p.beneficiaries || 0), 0) },
    { metric: 'Average Impact Score', value: data.reduce((sum, p) => sum + (p.impact_score || p.impactScore || 0), 0) / data.length },
  ];
  
  return {
    name: 'Projects Summary',
    data: summaryData,
    columns: [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Value', key: 'value', width: 20, format: 'currency' },
    ],
    includeSummary: false,
  };
}

function prepareVolunteersSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'Volunteers',
    data: data.map((volunteer) => ({
      id: volunteer.id,
      name: volunteer.name || `${volunteer.first_name} ${volunteer.last_name}`,
      email: volunteer.email,
      phone: volunteer.phone,
      skills: Array.isArray(volunteer.skills) ? volunteer.skills.join(', ') : volunteer.skills,
      totalHours: volunteer.total_hours || volunteer.totalHours || 0,
      projectsCompleted: volunteer.projects_completed || volunteer.projectsCompleted || 0,
      joinDate: volunteer.join_date || volunteer.created_at,
      lastActive: volunteer.last_active || volunteer.lastActive,
      status: volunteer.status,
    })),
    columns: [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Skills', key: 'skills', width: 30 },
      { header: 'Total Hours', key: 'totalHours', width: 12 },
      { header: 'Projects Completed', key: 'projectsCompleted', width: 15 },
      { header: 'Join Date', key: 'joinDate', width: 12, format: 'date' },
      { header: 'Last Active', key: 'lastActive', width: 12, format: 'date' },
      { header: 'Status', key: 'status', width: 12 },
    ],
    includeSummary: true,
  };
}

function prepareVolunteersSummarySheet(data: any[]): ExcelSheetConfig {
  const summaryData = [
    { metric: 'Total Volunteers', value: data.length },
    { metric: 'Active Volunteers', value: data.filter((v) => v.status === 'active').length },
    { metric: 'Total Volunteer Hours', value: data.reduce((sum, v) => sum + (v.total_hours || v.totalHours || 0), 0) },
    { metric: 'Average Hours per Volunteer', value: data.reduce((sum, v) => sum + (v.total_hours || v.totalHours || 0), 0) / data.length },
    { metric: 'Total Projects Completed', value: data.reduce((sum, v) => sum + (v.projects_completed || v.projectsCompleted || 0), 0) },
  ];
  
  return {
    name: 'Volunteers Summary',
    data: summaryData,
    columns: [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ],
    includeSummary: false,
  };
}

function preparePaymentsSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'Payments',
    data: data.map((payment) => ({
      id: payment.id,
      project: payment.project_name || payment.project,
      ngo: payment.ngo_name || payment.ngo,
      amount: payment.amount,
      status: payment.status,
      paymentDate: payment.payment_date || payment.paymentDate,
      method: payment.payment_method || payment.method,
      approvedBy: payment.approved_by || payment.approvedBy,
      milestone: payment.milestone,
      reference: payment.reference_number || payment.reference,
    })),
    columns: [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Project', key: 'project', width: 30 },
      { header: 'NGO', key: 'ngo', width: 25 },
      { header: 'Amount', key: 'amount', width: 15, format: 'currency' },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Payment Date', key: 'paymentDate', width: 12, format: 'date' },
      { header: 'Method', key: 'method', width: 15 },
      { header: 'Approved By', key: 'approvedBy', width: 20 },
      { header: 'Milestone', key: 'milestone', width: 15 },
      { header: 'Reference', key: 'reference', width: 20 },
    ],
    includeSummary: true,
  };
}

function preparePaymentsSummarySheet(data: any[]): ExcelSheetConfig {
  const statusCounts: Record<string, number> = {};
  const statusAmounts: Record<string, number> = {};
  
  data.forEach((payment) => {
    const status = payment.status || 'unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
    statusAmounts[status] = (statusAmounts[status] || 0) + (payment.amount || 0);
  });
  
  const summaryData = [
    { metric: 'Total Payments', value: data.length, amount: data.reduce((sum, p) => sum + (p.amount || 0), 0) },
    { metric: 'Completed Payments', value: statusCounts['completed'] || 0, amount: statusAmounts['completed'] || 0 },
    { metric: 'Pending Payments', value: statusCounts['pending'] || 0, amount: statusAmounts['pending'] || 0 },
    { metric: 'Failed Payments', value: statusCounts['failed'] || 0, amount: statusAmounts['failed'] || 0 },
  ];
  
  return {
    name: 'Payments Summary',
    data: summaryData,
    columns: [
      { header: 'Metric', key: 'metric', width: 25 },
      { header: 'Count', key: 'value', width: 15 },
      { header: 'Amount', key: 'amount', width: 20, format: 'currency' },
    ],
    includeSummary: false,
  };
}

function prepareNGOsSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'NGOs',
    data: data.map((ngo) => ({
      id: ngo.id,
      name: ngo.name,
      category: ngo.category,
      status: ngo.status,
      founded: ngo.founded_year || ngo.founded,
      projectCount: ngo.project_count || ngo.projectCount || 0,
      volunteerCount: ngo.volunteer_count || ngo.volunteerCount || 0,
      contact: ngo.contact_email || ngo.email,
      phone: ngo.phone,
      location: ngo.city || ngo.location,
      impactScore: ngo.impact_score || ngo.impactScore || 0,
    })),
    columns: [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Founded', key: 'founded', width: 12 },
      { header: 'Projects', key: 'projectCount', width: 10 },
      { header: 'Volunteers', key: 'volunteerCount', width: 10 },
      { header: 'Contact', key: 'contact', width: 30 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Impact Score', key: 'impactScore', width: 12 },
    ],
    includeSummary: true,
  };
}

function prepareNGOsSummarySheet(data: any[]): ExcelSheetConfig {
  const summaryData = [
    { metric: 'Total NGOs', value: data.length },
    { metric: 'Active NGOs', value: data.filter((n) => n.status === 'active').length },
    { metric: 'Total Projects', value: data.reduce((sum, n) => sum + (n.project_count || n.projectCount || 0), 0) },
    { metric: 'Total Volunteers', value: data.reduce((sum, n) => sum + (n.volunteer_count || n.volunteerCount || 0), 0) },
    { metric: 'Average Impact Score', value: data.reduce((sum, n) => sum + (n.impact_score || n.impactScore || 0), 0) / data.length },
  ];
  
  return {
    name: 'NGOs Summary',
    data: summaryData,
    columns: [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ],
    includeSummary: false,
  };
}

function prepareOpportunitiesSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'Opportunities',
    data: data.map((opp) => ({
      id: opp.id,
      title: opp.title,
      ngo: opp.ngo_name || opp.organization,
      category: opp.category,
      positions: opp.positions || opp.total_positions || 0,
      applicants: opp.applicants || opp.total_applicants || 0,
      location: opp.location || opp.city,
      duration: opp.duration,
      postedDate: opp.posted_date || opp.created_at,
      status: opp.status,
    })),
    columns: [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'NGO', key: 'ngo', width: 25 },
      { header: 'Category', key: 'category', width: 15 },
      { header: 'Positions', key: 'positions', width: 10 },
      { header: 'Applicants', key: 'applicants', width: 10 },
      { header: 'Location', key: 'location', width: 20 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Posted Date', key: 'postedDate', width: 12, format: 'date' },
      { header: 'Status', key: 'status', width: 12 },
    ],
    includeSummary: true,
  };
}

function prepareAuditLogsSheet(data: any[]): ExcelSheetConfig {
  return {
    name: 'Audit Logs',
    data: data.map((log) => ({
      timestamp: log.timestamp || log.created_at,
      user: log.user_name || log.user,
      action: log.action,
      entity: log.entity_type || log.entity,
      entityId: log.entity_id,
      ipAddress: log.ip_address,
      status: log.status,
      details: log.details || log.description,
    })),
    columns: [
      { header: 'Timestamp', key: 'timestamp', width: 20, format: 'date' },
      { header: 'User', key: 'user', width: 25 },
      { header: 'Action', key: 'action', width: 20 },
      { header: 'Entity', key: 'entity', width: 15 },
      { header: 'Entity ID', key: 'entityId', width: 15 },
      { header: 'IP Address', key: 'ipAddress', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Details', key: 'details', width: 40 },
    ],
    includeSummary: false,
  };
}
