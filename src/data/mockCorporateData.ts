import type { PendingPayment, BudgetLine, BudgetAlert, Contract, BudgetForecast } from '../types/corporate';

export const MOCK_PENDING_PAYMENTS: PendingPayment[] = [
  {
    id: 'pmt-001',
    projectId: 'p1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    amount: 150000,
    currency: 'PKR',
    requestedBy: 'Sara Khan (NGO Admin)',
    requestedAt: '2025-01-05T10:30:00Z',
    invoiceUrl: 'https://example.com/invoice-001.pdf',
    invoiceNumber: 'INV-2025-001',
    milestone: 'Phase 1 Completion',
    description: 'Beach cleanup equipment and volunteer stipends for 50 participants',
    status: 'pending_corporate',
    supportingDocs: [
      'https://example.com/receipts-001.pdf',
      'https://example.com/attendance-001.pdf'
    ],
    dueDate: '2025-01-15T00:00:00Z'
  },
  {
    id: 'pmt-002',
    projectId: 'p2',
    projectName: 'Skills Training for Youth',
    ngoId: 'ngo-2',
    ngoName: 'The Citizens Foundation',
    amount: 250000,
    currency: 'PKR',
    requestedBy: 'Ahmed Ali (NGO Finance)',
    requestedAt: '2025-01-03T14:20:00Z',
    invoiceUrl: 'https://example.com/invoice-002.pdf',
    invoiceNumber: 'INV-2025-002',
    milestone: 'Q1 Training Completion',
    description: 'Trainer fees, materials, and certificates for 30 students',
    status: 'pending_corporate',
    dueDate: '2025-01-10T00:00:00Z'
  },
  {
    id: 'pmt-003',
    projectId: 'p3',
    projectName: 'Healthcare Access Initiative',
    ngoId: 'ngo-3',
    ngoName: 'Akhuwat Foundation',
    amount: 300000,
    currency: 'PKR',
    requestedBy: 'Dr. Fatima Malik',
    requestedAt: '2024-12-28T09:00:00Z',
    invoiceUrl: 'https://example.com/invoice-003.pdf',
    invoiceNumber: 'INV-2024-087',
    milestone: 'Medical Camp Setup',
    description: 'Medical supplies, equipment rental, and doctor fees',
    status: 'pending_admin',
    corporateApprovedBy: 'John Smith (CSR Manager)',
    corporateApprovedAt: '2024-12-29T11:30:00Z',
    corporateNotes: 'Approved - all documentation verified',
    dueDate: '2025-01-05T00:00:00Z'
  }
];

export const MOCK_PAYMENT_HISTORY: PendingPayment[] = [
  {
    id: 'pmt-100',
    projectId: 'p1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    amount: 175000,
    currency: 'PKR',
    requestedBy: 'Sara Khan',
    requestedAt: '2024-12-01T10:00:00Z',
    invoiceNumber: 'INV-2024-065',
    description: 'Initial project setup and equipment',
    status: 'paid',
    corporateApprovedBy: 'John Smith',
    corporateApprovedAt: '2024-12-02T14:00:00Z',
    adminApprovedBy: 'Admin Finance',
    adminApprovedAt: '2024-12-03T09:00:00Z',
    paidAt: '2024-12-05T16:00:00Z'
  },
  {
    id: 'pmt-101',
    projectId: 'p2',
    projectName: 'Skills Training for Youth',
    ngoId: 'ngo-2',
    ngoName: 'The Citizens Foundation',
    amount: 50000,
    currency: 'PKR',
    requestedBy: 'Ahmed Ali',
    requestedAt: '2024-11-15T10:00:00Z',
    invoiceNumber: 'INV-2024-042',
    description: 'Training materials procurement',
    status: 'rejected',
    corporateApprovedBy: 'John Smith',
    corporateApprovedAt: '2024-11-16T10:00:00Z',
    adminApprovedBy: 'Admin Finance',
    adminApprovedAt: '2024-11-16T14:00:00Z',
    rejectionReason: 'Incomplete documentation - missing receipts'
  }
];

export const MOCK_BUDGET_LINES: BudgetLine[] = [
  {
    id: 'bl-1',
    category: 'Education',
    budgeted: 500000,
    spent: 300000,
    committed: 150000,
    remaining: 50000,
    variance: -200000,
    variancePercent: -40
  },
  {
    id: 'bl-2',
    category: 'Health',
    budgeted: 750000,
    spent: 600000,
    committed: 200000,
    remaining: -50000,
    variance: -150000,
    variancePercent: -20
  },
  {
    id: 'bl-3',
    category: 'Environment',
    budgeted: 250000,
    spent: 125000,
    committed: 75000,
    remaining: 50000,
    variance: -125000,
    variancePercent: -50
  },
  {
    id: 'bl-4',
    category: 'Women Empowerment',
    budgeted: 300000,
    spent: 280000,
    committed: 0,
    remaining: 20000,
    variance: -20000,
    variancePercent: -6.7
  }
];

export const MOCK_PROJECT_BUDGETS: BudgetLine[] = [
  {
    id: 'pb-1',
    category: 'Project Budget',
    projectId: 'p1',
    projectName: 'Clean Karachi Drive',
    budgeted: 500000,
    spent: 325000,
    committed: 150000,
    remaining: 25000,
    variance: -175000,
    variancePercent: -35
  },
  {
    id: 'pb-2',
    category: 'Project Budget',
    projectId: 'p2',
    projectName: 'Skills Training for Youth',
    budgeted: 750000,
    spent: 300000,
    committed: 250000,
    remaining: 200000,
    variance: -450000,
    variancePercent: -60
  },
  {
    id: 'pb-3',
    category: 'Project Budget',
    projectId: 'p3',
    projectName: 'Healthcare Access Initiative',
    budgeted: 1000000,
    spent: 400000,
    committed: 300000,
    remaining: 300000,
    variance: -600000,
    variancePercent: -60
  }
];

export const MOCK_BUDGET_ALERTS: BudgetAlert[] = [
  {
    id: 'alert-1',
    type: 'danger',
    message: 'Health category is over budget by PKR 50,000',
    threshold: 100,
    severity: 'critical',
    createdAt: '2025-01-07T08:00:00Z',
    acknowledged: false
  },
  {
    id: 'alert-2',
    type: 'warning',
    message: 'Women Empowerment budget 93% utilized',
    threshold: 93,
    severity: 'medium',
    createdAt: '2025-01-06T10:00:00Z',
    acknowledged: false
  },
  {
    id: 'alert-3',
    type: 'danger',
    message: 'Clean Karachi Drive is 95% over budget',
    threshold: 95,
    projectId: 'p1',
    projectName: 'Clean Karachi Drive',
    severity: 'critical',
    createdAt: '2025-01-05T14:00:00Z',
    acknowledged: true
  },
  {
    id: 'alert-4',
    type: 'warning',
    message: 'Projected to exceed annual CSR budget by 10% at current burn rate',
    threshold: 110,
    severity: 'high',
    createdAt: '2025-01-04T09:00:00Z',
    acknowledged: false
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    projectId: 'p1',
    projectName: 'Clean Karachi Drive',
    contractType: 'service_agreement',
    signedAt: '2024-12-15T10:00:00Z',
    startDate: '2025-01-01T00:00:00Z',
    expiresAt: '2025-06-30T23:59:59Z',
    totalValue: 500000,
    status: 'active',
    documentUrl: 'https://example.com/contracts/contract-001.pdf',
    clauses: {
      deliverables: [
        'Organize 10 beach cleanup events',
        'Engage 500+ volunteers',
        'Collect 5 tons of waste',
        'Submit monthly progress reports'
      ],
      paymentTerms: 'Milestone-based payments: 35% upon start, 35% at midpoint, 30% upon completion',
      terminationClause: 'Either party may terminate with 30 days written notice',
      liabilityClause: 'NGO responsible for volunteer safety and insurance'
    },
    signatories: {
      corporateName: 'John Smith',
      corporateDesignation: 'CSR Director',
      corporateSignedAt: '2024-12-15T10:00:00Z',
      ngoName: 'Sara Khan',
      ngoDesignation: 'Executive Director',
      ngoSignedAt: '2024-12-15T14:30:00Z'
    },
    milestones: [
      {
        id: 'm1',
        title: 'Project Kickoff',
        amount: 175000,
        dueDate: '2025-01-15T00:00:00Z',
        completed: true
      },
      {
        id: 'm2',
        title: 'Mid-point Review',
        amount: 175000,
        dueDate: '2025-04-15T00:00:00Z',
        completed: false
      },
      {
        id: 'm3',
        title: 'Project Completion',
        amount: 150000,
        dueDate: '2025-06-30T00:00:00Z',
        completed: false
      }
    ]
  },
  {
    id: 'contract-002',
    ngoId: 'ngo-2',
    ngoName: 'The Citizens Foundation',
    projectId: 'p2',
    projectName: 'Skills Training for Youth',
    contractType: 'grant_agreement',
    signedAt: '2025-01-10T09:00:00Z',
    startDate: '2025-02-01T00:00:00Z',
    expiresAt: '2025-08-31T23:59:59Z',
    totalValue: 750000,
    status: 'active',
    documentUrl: 'https://example.com/contracts/contract-002.pdf',
    clauses: {
      deliverables: [
        'Train 200 youth in digital skills',
        'Achieve 80% course completion rate',
        'Provide certificates to all graduates',
        'Submit quarterly impact reports'
      ],
      paymentTerms: 'Quarterly disbursements based on verified student enrollment',
      terminationClause: 'Termination requires 60 days notice and return of unused funds'
    },
    signatories: {
      corporateName: 'John Smith',
      corporateDesignation: 'CSR Director',
      corporateSignedAt: '2025-01-10T09:00:00Z',
      ngoName: 'Ahmed Ali',
      ngoDesignation: 'Program Director',
      ngoSignedAt: '2025-01-10T11:00:00Z'
    }
  },
  {
    id: 'contract-003',
    ngoId: 'ngo-3',
    ngoName: 'Akhuwat Foundation',
    projectId: 'p3',
    projectName: 'Healthcare Access Initiative',
    contractType: 'mou',
    startDate: '2025-04-01T00:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    totalValue: 1000000,
    status: 'pending_signature',
    documentUrl: 'https://example.com/contracts/contract-003-draft.pdf',
    clauses: {
      deliverables: [
        'Conduct 12 medical camps',
        'Serve 1000+ patients',
        'Provide free medicines',
        'Maintain detailed patient records'
      ],
      paymentTerms: 'Monthly advances against submitted invoices with receipts',
      terminationClause: 'Either party may terminate with 90 days notice'
    },
    signatories: {
      corporateName: 'John Smith',
      corporateDesignation: 'CSR Director',
      ngoName: 'Dr. Fatima Malik',
      ngoDesignation: 'Medical Director'
    }
  },
  {
    id: 'contract-004',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    projectId: 'p1',
    projectName: 'Clean Karachi Drive (2024)',
    contractType: 'service_agreement',
    signedAt: '2024-06-01T10:00:00Z',
    startDate: '2024-07-01T00:00:00Z',
    expiresAt: '2024-12-31T23:59:59Z',
    totalValue: 400000,
    status: 'expired',
    documentUrl: 'https://example.com/contracts/contract-004.pdf',
    clauses: {
      deliverables: [
        'Pilot program - 5 cleanup events',
        'Engage 250 volunteers',
        'Document impact with photos/videos'
      ],
      paymentTerms: '50% advance, 50% upon completion',
      terminationClause: 'Standard 30-day notice period'
    },
    signatories: {
      corporateName: 'John Smith',
      corporateDesignation: 'CSR Director',
      corporateSignedAt: '2024-06-01T10:00:00Z',
      ngoName: 'Sara Khan',
      ngoDesignation: 'Executive Director',
      ngoSignedAt: '2024-06-01T15:00:00Z'
    }
  }
];

export const MOCK_BUDGET_FORECAST: BudgetForecast[] = [
  { month: 'Jan 2025', projected: 200000, actual: 225000, variance: 25000 },
  { month: 'Feb 2025', projected: 180000, actual: 0, variance: 0 },
  { month: 'Mar 2025', projected: 220000, actual: 0, variance: 0 },
  { month: 'Apr 2025', projected: 150000, actual: 0, variance: 0 },
  { month: 'May 2025', projected: 200000, actual: 0, variance: 0 },
  { month: 'Jun 2025', projected: 180000, actual: 0, variance: 0 }
];
