/**
 * Report Templates
 * Pre-defined report configurations
 */

import {
  FileText,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Shield,
  AlertCircle,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import { ReportTemplate } from './types';

export const reportTemplates: ReportTemplate[] = [
  // Financial Reports
  {
    id: 'financial-payments-summary',
    name: 'Payments Summary Report',
    description: 'Complete overview of all payments, disbursements, and holds',
    category: 'Financial',
    entityType: 'payments',
    format: 'excel',
    icon: <DollarSign className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'payments',
      includeColumns: [
        'id',
        'project',
        'ngo',
        'amount',
        'status',
        'paymentDate',
        'method',
        'approvedBy',
        'notes',
      ],
      includeMetadata: true,
    },
  },
  {
    id: 'financial-disbursement-history',
    name: 'Disbursement History',
    description: 'Historical record of all fund disbursements',
    category: 'Financial',
    entityType: 'payments',
    format: 'csv',
    icon: <TrendingUp className="w-5 h-5" />,
    config: {
      format: 'csv',
      entityType: 'payments',
      includeColumns: [
        'date',
        'project',
        'ngo',
        'amount',
        'milestone',
        'approver1',
        'approver2',
      ],
      filters: {
        status: ['completed'],
      },
    },
  },
  {
    id: 'financial-holds-report',
    name: 'Payment Holds Report',
    description: 'All payments currently on hold with reasons',
    category: 'Financial',
    entityType: 'payments',
    format: 'pdf',
    icon: <AlertCircle className="w-5 h-5" />,
    config: {
      format: 'pdf',
      entityType: 'payments',
      includeColumns: ['project', 'amount', 'holdReason', 'requestedBy', 'holdDate'],
      filters: {
        status: ['hold', 'pending_review'],
      },
    },
  },

  // Project Reports
  {
    id: 'projects-active',
    name: 'Active Projects Report',
    description: 'All currently active projects with key metrics',
    category: 'Projects',
    entityType: 'projects',
    format: 'excel',
    icon: <FileText className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'projects',
      includeColumns: [
        'id',
        'title',
        'ngo',
        'status',
        'budget',
        'spent',
        'startDate',
        'endDate',
        'beneficiaries',
        'sdgs',
      ],
      filters: {
        status: ['active', 'in_progress'],
      },
    },
  },
  {
    id: 'projects-impact',
    name: 'Impact Metrics Report',
    description: 'Project outcomes and impact data',
    category: 'Projects',
    entityType: 'projects',
    format: 'pdf',
    icon: <BarChart3 className="w-5 h-5" />,
    config: {
      format: 'pdf',
      entityType: 'projects',
      includeColumns: [
        'title',
        'beneficiaries',
        'sdgs',
        'impactScore',
        'outcomes',
        'completionRate',
      ],
      includeMetadata: true,
    },
  },
  {
    id: 'projects-sdg-alignment',
    name: 'SDG Alignment Report',
    description: 'Projects categorized by SDG goals',
    category: 'Projects',
    entityType: 'projects',
    format: 'excel',
    icon: <TrendingUp className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'projects',
      includeColumns: ['title', 'ngo', 'sdgs', 'category', 'budget', 'status'],
    },
  },

  // NGO Reports
  {
    id: 'ngo-directory',
    name: 'NGO Directory Export',
    description: 'Complete list of all registered NGOs',
    category: 'NGOs',
    entityType: 'ngos',
    format: 'excel',
    icon: <Building2 className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'ngos',
      includeColumns: [
        'id',
        'name',
        'category',
        'status',
        'verificationStatus',
        'founded',
        'projectCount',
        'volunteerCount',
        'contact',
      ],
    },
  },
  {
    id: 'ngo-vetting-status',
    name: 'NGO Vetting Status Report',
    description: 'Vetting status for all NGOs in review',
    category: 'NGOs',
    entityType: 'ngos',
    format: 'csv',
    icon: <Shield className="w-5 h-5" />,
    config: {
      format: 'csv',
      entityType: 'ngos',
      includeColumns: [
        'name',
        'status',
        'submittedDate',
        'reviewer',
        'vettingStage',
        'documents',
      ],
      filters: {
        status: ['pending_review', 'in_review', 'pending_documents'],
      },
    },
  },
  {
    id: 'ngo-performance',
    name: 'NGO Performance Report',
    description: 'Performance metrics for partner NGOs',
    category: 'NGOs',
    entityType: 'ngos',
    format: 'pdf',
    icon: <BarChart3 className="w-5 h-5" />,
    config: {
      format: 'pdf',
      entityType: 'ngos',
      includeColumns: [
        'name',
        'projectCount',
        'completedProjects',
        'impactScore',
        'rating',
        'complianceScore',
      ],
      filters: {
        status: ['verified', 'active_partner'],
      },
    },
  },

  // Volunteer Reports
  {
    id: 'volunteers-active',
    name: 'Active Volunteers Report',
    description: 'All active volunteers with contribution hours',
    category: 'Volunteers',
    entityType: 'volunteers',
    format: 'excel',
    icon: <Users className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'volunteers',
      includeColumns: [
        'id',
        'name',
        'email',
        'skills',
        'totalHours',
        'projectsCompleted',
        'joinDate',
        'lastActive',
      ],
      filters: {
        status: ['active'],
      },
    },
  },
  {
    id: 'volunteers-hours',
    name: 'Volunteer Hours Report',
    description: 'Detailed breakdown of volunteer hours by project',
    category: 'Volunteers',
    entityType: 'volunteers',
    format: 'csv',
    icon: <TrendingUp className="w-5 h-5" />,
    config: {
      format: 'csv',
      entityType: 'volunteers',
      includeColumns: ['name', 'project', 'hoursLogged', 'date', 'activity', 'approved'],
    },
  },

  // Opportunity Reports
  {
    id: 'opportunities-open',
    name: 'Open Opportunities Report',
    description: 'All currently open volunteer opportunities',
    category: 'Opportunities',
    entityType: 'opportunities',
    format: 'pdf',
    icon: <Briefcase className="w-5 h-5" />,
    config: {
      format: 'pdf',
      entityType: 'opportunities',
      includeColumns: [
        'title',
        'ngo',
        'category',
        'positions',
        'applicants',
        'location',
        'duration',
        'postedDate',
      ],
      filters: {
        status: ['open', 'urgent'],
      },
    },
  },

  // Audit Reports
  {
    id: 'audit-log-export',
    name: 'Audit Log Export',
    description: 'Complete audit trail of system activities',
    category: 'Audit',
    entityType: 'audit_logs',
    format: 'csv',
    icon: <FileSpreadsheet className="w-5 h-5" />,
    config: {
      format: 'csv',
      entityType: 'audit_logs',
      includeColumns: [
        'timestamp',
        'user',
        'action',
        'entity',
        'entityId',
        'changes',
        'ipAddress',
      ],
    },
  },
  {
    id: 'audit-compliance',
    name: 'Compliance Report',
    description: 'Compliance and regulatory audit report',
    category: 'Audit',
    entityType: 'audit_logs',
    format: 'pdf',
    icon: <Shield className="w-5 h-5" />,
    config: {
      format: 'pdf',
      entityType: 'audit_logs',
      includeColumns: ['date', 'complianceCheck', 'status', 'reviewer', 'notes'],
      includeMetadata: true,
    },
  },

  // Case Management
  {
    id: 'cases-open',
    name: 'Open Cases Report',
    description: 'All open support and dispute cases',
    category: 'Cases',
    entityType: 'cases',
    format: 'excel',
    icon: <AlertCircle className="w-5 h-5" />,
    config: {
      format: 'excel',
      entityType: 'cases',
      includeColumns: [
        'caseId',
        'type',
        'priority',
        'status',
        'assignee',
        'createdDate',
        'lastUpdate',
        'escalated',
      ],
      filters: {
        status: ['open', 'escalated', 'pending'],
      },
    },
  },
];

// Group templates by category
export const templatesByCategory = reportTemplates.reduce((acc, template) => {
  if (!acc[template.category]) {
    acc[template.category] = [];
  }
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, ReportTemplate[]>);
