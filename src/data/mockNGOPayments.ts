import type { PaymentRequest, Invoice, BudgetCategory, Expense, ProjectBudgetSummary, PaymentMilestone } from '../types/ngo-payments';

export const MOCK_PAYMENT_REQUESTS: PaymentRequest[] = [
  {
    id: 'pr-001',
    ngoId: 'ngo-1',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    corporateId: 'corp-1',
    corporateName: 'Systems Limited',
    amount: 150000,
    currency: 'PKR',
    description: 'Beach cleanup equipment and volunteer stipends for 50 participants',
    invoiceNumber: 'INV-2025-001',
    invoiceUrl: 'https://example.com/invoices/inv-2025-001.pdf',
    supportingDocs: [
      'https://example.com/receipts/receipt-001.pdf',
      'https://example.com/photos/cleanup-jan.jpg'
    ],
    milestoneId: 'm-1',
    milestoneName: 'Phase 1 Completion',
    requestedAt: '2025-01-05T10:30:00Z',
    requestedBy: 'Sara Khan',
    status: 'submitted',
  },
  {
    id: 'pr-002',
    ngoId: 'ngo-1',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    corporateId: 'corp-1',
    corporateName: 'Systems Limited',
    amount: 175000,
    currency: 'PKR',
    description: 'Initial project setup and equipment',
    invoiceNumber: 'INV-2024-065',
    invoiceUrl: 'https://example.com/invoices/inv-2024-065.pdf',
    supportingDocs: [],
    requestedAt: '2024-12-01T10:00:00Z',
    requestedBy: 'Sara Khan',
    status: 'paid',
    corporateApprovedAt: '2024-12-02T14:00:00Z',
    corporateApprovedBy: 'John Smith',
    corporateNotes: 'Approved - all documentation verified',
    adminApprovedAt: '2024-12-03T09:00:00Z',
    adminApprovedBy: 'Admin Finance',
    paidAt: '2024-12-05T16:00:00Z'
  },
  {
    id: 'pr-003',
    ngoId: 'ngo-1',
    projectId: 'proj-2',
    projectName: 'Tree Plantation Drive',
    corporateId: 'corp-2',
    corporateName: 'Engro Corporation',
    amount: 85000,
    currency: 'PKR',
    description: 'Purchase of 500 saplings and planting materials',
    invoiceNumber: 'INV-2025-002',
    invoiceUrl: 'https://example.com/invoices/inv-2025-002.pdf',
    supportingDocs: ['https://example.com/receipts/nursery-receipt.pdf'],
    requestedAt: '2025-01-03T09:00:00Z',
    requestedBy: 'Sara Khan',
    status: 'corporate_approved',
    corporateApprovedAt: '2025-01-04T11:00:00Z',
    corporateApprovedBy: 'Ahmed Raza',
    corporateNotes: 'Good work, approved'
  },
  {
    id: 'pr-draft',
    ngoId: 'ngo-1',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    corporateId: 'corp-1',
    corporateName: 'Systems Limited',
    amount: 125000,
    currency: 'PKR',
    description: '',
    invoiceNumber: '',
    invoiceUrl: '',
    supportingDocs: [],
    requestedAt: '2025-01-07T08:00:00Z',
    requestedBy: 'Sara Khan',
    status: 'draft'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    ngoId: 'ngo-1',
    invoiceNumber: 'INV-2025-001',
    fileName: 'invoice-jan-2025.pdf',
    fileUrl: 'https://example.com/invoices/inv-2025-001.pdf',
    fileSize: 245000,
    uploadedAt: '2025-01-05T09:00:00Z',
    uploadedBy: 'Sara Khan',
    paymentRequestId: 'pr-001'
  },
  {
    id: 'inv-2',
    ngoId: 'ngo-1',
    invoiceNumber: 'INV-2024-065',
    fileName: 'invoice-dec-2024.pdf',
    fileUrl: 'https://example.com/invoices/inv-2024-065.pdf',
    fileSize: 198000,
    uploadedAt: '2024-12-01T08:30:00Z',
    uploadedBy: 'Sara Khan',
    paymentRequestId: 'pr-002'
  }
];

export const MOCK_BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: 'bc-1',
    projectId: 'proj-1',
    category: 'Staff Salaries',
    budgeted: 200000,
    spent: 150000,
    committed: 0,
    remaining: 50000,
    variance: -50000,
    variancePercent: -25,
    lastUpdated: '2025-01-07T00:00:00Z'
  },
  {
    id: 'bc-2',
    projectId: 'proj-1',
    category: 'Equipment & Materials',
    budgeted: 150000,
    spent: 125000,
    committed: 0,
    remaining: 25000,
    variance: -25000,
    variancePercent: -16.7,
    lastUpdated: '2025-01-07T00:00:00Z'
  },
  {
    id: 'bc-3',
    projectId: 'proj-1',
    category: 'Volunteer Stipends',
    budgeted: 100000,
    spent: 75000,
    committed: 0,
    remaining: 25000,
    variance: -25000,
    variancePercent: -25,
    lastUpdated: '2025-01-07T00:00:00Z'
  },
  {
    id: 'bc-4',
    projectId: 'proj-1',
    category: 'Transportation',
    budgeted: 50000,
    spent: 45000,
    committed: 0,
    remaining: 5000,
    variance: -5000,
    variancePercent: -10,
    lastUpdated: '2025-01-07T00:00:00Z'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    projectId: 'proj-1',
    budgetCategoryId: 'bc-2',
    category: 'Equipment & Materials',
    amount: 45000,
    currency: 'PKR',
    description: 'Trash bags, gloves, and cleaning tools (500 units)',
    expenseDate: '2024-12-15T00:00:00Z',
    receiptUrl: 'https://example.com/receipts/receipt-001.pdf',
    vendor: 'ABC Suppliers',
    paymentMethod: 'bank_transfer',
    approvedBy: 'Sara Khan',
    createdAt: '2024-12-15T10:00:00Z',
    createdBy: 'Finance Team'
  },
  {
    id: 'exp-2',
    projectId: 'proj-1',
    budgetCategoryId: 'bc-3',
    category: 'Volunteer Stipends',
    amount: 25000,
    currency: 'PKR',
    description: 'Stipends for 50 volunteers (PKR 500 each)',
    expenseDate: '2024-12-20T00:00:00Z',
    vendor: 'N/A',
    paymentMethod: 'cash',
    approvedBy: 'Sara Khan',
    createdAt: '2024-12-20T14:00:00Z',
    createdBy: 'Finance Team'
  },
  {
    id: 'exp-3',
    projectId: 'proj-1',
    budgetCategoryId: 'bc-4',
    category: 'Transportation',
    amount: 18000,
    currency: 'PKR',
    description: 'Bus rental for volunteer transport (3 buses)',
    expenseDate: '2024-12-18T00:00:00Z',
    receiptUrl: 'https://example.com/receipts/transport-receipt.pdf',
    vendor: 'Karachi Transport Co.',
    paymentMethod: 'check',
    approvedBy: 'Sara Khan',
    createdAt: '2024-12-18T09:00:00Z',
    createdBy: 'Finance Team'
  },
  {
    id: 'exp-4',
    projectId: 'proj-1',
    budgetCategoryId: 'bc-1',
    category: 'Staff Salaries',
    amount: 75000,
    currency: 'PKR',
    description: 'December salaries for project coordinator and 2 supervisors',
    expenseDate: '2024-12-31T00:00:00Z',
    paymentMethod: 'bank_transfer',
    approvedBy: 'Sara Khan',
    createdAt: '2024-12-31T10:00:00Z',
    createdBy: 'HR Department'
  }
];

export const MOCK_PROJECT_BUDGET_SUMMARY: ProjectBudgetSummary = {
  projectId: 'proj-1',
  projectName: 'Clean Karachi Drive',
  totalBudget: 500000,
  totalReceived: 175000, // From paid payment request
  totalSpent: 395000,
  totalCommitted: 150000, // Pending payment request
  remaining: -45000, // Over budget
  utilizationPercent: 109, // 545000 / 500000 * 100
  categories: MOCK_BUDGET_CATEGORIES
};

export const MOCK_PAYMENT_MILESTONES: PaymentMilestone[] = [
  {
    id: 'm-1',
    projectId: 'proj-1',
    title: 'Phase 1 Completion',
    amount: 150000,
    dueDate: '2025-01-15T00:00:00Z',
    deliverables: [
      '5 beach cleanup events completed',
      '250+ volunteers engaged',
      'Waste collection documentation submitted'
    ],
    status: 'completed',
    completedAt: '2025-01-05T00:00:00Z',
    paymentRequestId: 'pr-001'
  },
  {
    id: 'm-2',
    projectId: 'proj-1',
    title: 'Mid-point Review',
    amount: 175000,
    dueDate: '2025-04-15T00:00:00Z',
    deliverables: [
      '10 cleanup events total',
      '500+ volunteers engaged',
      'Impact assessment report'
    ],
    status: 'pending'
  },
  {
    id: 'm-3',
    projectId: 'proj-1',
    title: 'Project Completion',
    amount: 150000,
    dueDate: '2025-06-30T00:00:00Z',
    deliverables: [
      'All 15 events completed',
      '750+ volunteers engaged',
      'Final impact report and media coverage'
    ],
    status: 'pending'
  }
];
