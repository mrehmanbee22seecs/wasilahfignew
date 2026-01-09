/**
 * Column Definitions for Each Entity Type
 * Defines available columns for export configuration
 */

import { ColumnDefinition } from './types';

export const projectColumns: ColumnDefinition[] = [
  { id: 'id', label: 'Project ID', field: 'id', type: 'string', required: true },
  { id: 'name', label: 'Project Name', field: 'name', type: 'string', required: true },
  { id: 'ngo', label: 'NGO', field: 'ngoName', type: 'string' },
  { id: 'category', label: 'Category', field: 'category', type: 'string' },
  { id: 'budget', label: 'Budget', field: 'budget', type: 'currency' },
  { id: 'status', label: 'Status', field: 'status', type: 'string' },
  { id: 'beneficiaries', label: 'Beneficiaries', field: 'beneficiaries', type: 'number' },
  { id: 'sdgs', label: 'SDGs', field: 'sdgs', type: 'string' },
  { id: 'startDate', label: 'Start Date', field: 'startDate', type: 'date' },
  { id: 'endDate', label: 'End Date', field: 'endDate', type: 'date' },
  { id: 'progress', label: 'Progress %', field: 'progress', type: 'number' },
  { id: 'location', label: 'Location', field: 'location', type: 'string' },
];

export const ngoColumns: ColumnDefinition[] = [
  { id: 'id', label: 'NGO ID', field: 'id', type: 'string', required: true },
  { id: 'name', label: 'NGO Name', field: 'name', type: 'string', required: true },
  { id: 'status', label: 'Status', field: 'status', type: 'string' },
  { id: 'category', label: 'Category', field: 'category', type: 'string' },
  { id: 'registrationNumber', label: 'Registration #', field: 'registrationNumber', type: 'string' },
  { id: 'email', label: 'Email', field: 'email', type: 'string' },
  { id: 'phone', label: 'Phone', field: 'phone', type: 'string' },
  { id: 'address', label: 'Address', field: 'address', type: 'string' },
  { id: 'founded', label: 'Founded', field: 'founded', type: 'date' },
  { id: 'projectCount', label: 'Projects', field: 'projectCount', type: 'number' },
  { id: 'volunteerCount', label: 'Volunteers', field: 'volunteerCount', type: 'number' },
  { id: 'verified', label: 'Verified', field: 'verified', type: 'boolean' },
  { id: 'rating', label: 'Rating', field: 'rating', type: 'number' },
];

export const volunteerColumns: ColumnDefinition[] = [
  { id: 'id', label: 'Volunteer ID', field: 'id', type: 'string', required: true },
  { id: 'name', label: 'Name', field: 'name', type: 'string', required: true },
  { id: 'email', label: 'Email', field: 'email', type: 'string' },
  { id: 'phone', label: 'Phone', field: 'phone', type: 'string' },
  { id: 'skills', label: 'Skills', field: 'skills', type: 'string' },
  { id: 'totalHours', label: 'Total Hours', field: 'totalHours', type: 'number' },
  { id: 'projectsCompleted', label: 'Projects Completed', field: 'projectsCompleted', type: 'number' },
  { id: 'status', label: 'Status', field: 'status', type: 'string' },
  { id: 'joinedAt', label: 'Joined Date', field: 'joinedAt', type: 'date' },
  { id: 'lastActivity', label: 'Last Activity', field: 'lastActivity', type: 'date' },
  { id: 'city', label: 'City', field: 'city', type: 'string' },
  { id: 'education', label: 'Education', field: 'education', type: 'string' },
];

export const paymentColumns: ColumnDefinition[] = [
  { id: 'id', label: 'Payment ID', field: 'id', type: 'string', required: true },
  { id: 'project', label: 'Project', field: 'projectName', type: 'string' },
  { id: 'ngo', label: 'NGO', field: 'ngoName', type: 'string' },
  { id: 'corporate', label: 'Corporate', field: 'corporateName', type: 'string' },
  { id: 'amount', label: 'Amount', field: 'amount', type: 'currency' },
  { id: 'status', label: 'Status', field: 'status', type: 'string' },
  { id: 'type', label: 'Type', field: 'type', type: 'string' },
  { id: 'disbursedAt', label: 'Disbursed At', field: 'disbursedAt', type: 'date' },
  { id: 'approvedBy', label: 'Approved By', field: 'approvedBy', type: 'string' },
  { id: 'reference', label: 'Reference', field: 'reference', type: 'string' },
  { id: 'milestone', label: 'Milestone', field: 'milestone', type: 'string' },
];

export const auditLogColumns: ColumnDefinition[] = [
  { id: 'timestamp', label: 'Timestamp', field: 'timestamp', type: 'date', required: true },
  { id: 'user', label: 'User', field: 'userName', type: 'string', required: true },
  { id: 'action', label: 'Action', field: 'action', type: 'string' },
  { id: 'resource', label: 'Resource', field: 'resource', type: 'string' },
  { id: 'resourceId', label: 'Resource ID', field: 'resourceId', type: 'string' },
  { id: 'details', label: 'Details', field: 'details', type: 'string' },
  { id: 'ipAddress', label: 'IP Address', field: 'ipAddress', type: 'string' },
  { id: 'userAgent', label: 'User Agent', field: 'userAgent', type: 'string' },
  { id: 'success', label: 'Success', field: 'success', type: 'boolean' },
];

export const opportunityColumns: ColumnDefinition[] = [
  { id: 'id', label: 'Opportunity ID', field: 'id', type: 'string', required: true },
  { id: 'title', label: 'Title', field: 'title', type: 'string', required: true },
  { id: 'ngo', label: 'NGO', field: 'ngoName', type: 'string' },
  { id: 'category', label: 'Category', field: 'category', type: 'string' },
  { id: 'location', label: 'Location', field: 'location', type: 'string' },
  { id: 'positions', label: 'Positions', field: 'positions', type: 'number' },
  { id: 'filled', label: 'Filled', field: 'filled', type: 'number' },
  { id: 'status', label: 'Status', field: 'status', type: 'string' },
  { id: 'startDate', label: 'Start Date', field: 'startDate', type: 'date' },
  { id: 'endDate', label: 'End Date', field: 'endDate', type: 'date' },
  { id: 'commitment', label: 'Commitment', field: 'commitment', type: 'string' },
];

/**
 * Get column definitions by entity type
 */
export function getColumnsByEntityType(entityType: string): ColumnDefinition[] {
  const columnMap: Record<string, ColumnDefinition[]> = {
    projects: projectColumns,
    ngos: ngoColumns,
    volunteers: volunteerColumns,
    payments: paymentColumns,
    audit_logs: auditLogColumns,
    opportunities: opportunityColumns,
  };

  return columnMap[entityType] || [];
}
