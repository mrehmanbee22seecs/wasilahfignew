/**
 * Corporate Dashboard Types
 */

export interface PendingPayment {
  id: string;
  projectId: string;
  projectName: string;
  ngoId: string;
  ngoName: string;
  amount: number;
  currency: 'PKR';
  requestedBy: string;
  requestedAt: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  milestone?: string;
  description: string;
  status: 'pending_corporate' | 'pending_admin' | 'approved' | 'rejected' | 'paid';
  supportingDocs?: string[];
  dueDate?: string;
  corporateApprovedBy?: string;
  corporateApprovedAt?: string;
  corporateNotes?: string;
  adminApprovedBy?: string;
  adminApprovedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
}

export interface BudgetLine {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  committed: number; // Approved but not yet paid
  remaining: number;
  variance: number; // spent - budgeted
  variancePercent: number;
  projectId?: string;
  projectName?: string;
}

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  message: string;
  threshold: number; // percentage
  projectId?: string;
  projectName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  acknowledged: boolean;
}

export interface Contract {
  id: string;
  ngoId: string;
  ngoName: string;
  projectId: string;
  projectName: string;
  contractType: 'mou' | 'service_agreement' | 'grant_agreement' | 'partnership';
  signedAt?: string;
  startDate: string;
  expiresAt: string;
  totalValue: number;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  documentUrl?: string;
  clauses: {
    deliverables: string[];
    paymentTerms: string;
    terminationClause: string;
    liabilityClause?: string;
  };
  signatories: {
    corporateName: string;
    corporateDesignation: string;
    corporateSignedAt?: string;
    ngoName: string;
    ngoDesignation: string;
    ngoSignedAt?: string;
  };
  milestones?: {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface PaymentHistory {
  id: string;
  paymentId: string;
  action: 'submitted' | 'corporate_approved' | 'corporate_rejected' | 'admin_approved' | 'admin_rejected' | 'paid';
  performedBy: string;
  performedAt: string;
  notes?: string;
}

export interface BudgetForecast {
  month: string;
  projected: number;
  actual: number;
  variance: number;
}
