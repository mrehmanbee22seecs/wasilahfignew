/**
 * NGO Payment & Budget Types
 */

export interface PaymentRequest {
  id: string;
  ngoId: string;
  projectId: string;
  projectName: string;
  corporateId: string;
  corporateName: string;
  amount: number;
  currency: 'PKR';
  description: string;
  invoiceNumber: string;
  invoiceUrl: string; // Required!
  supportingDocs: string[]; // Receipts, bills, photos
  milestoneId?: string;
  milestoneName?: string;
  requestedAt: string;
  requestedBy: string;
  status: 'draft' | 'submitted' | 'corporate_approved' | 'admin_approved' | 'rejected' | 'paid';
  corporateApprovedAt?: string;
  corporateApprovedBy?: string;
  corporateNotes?: string;
  adminApprovedAt?: string;
  adminApprovedBy?: string;
  paidAt?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
}

export interface Invoice {
  id: string;
  ngoId: string;
  invoiceNumber: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  paymentRequestId?: string;
}

export interface BudgetCategory {
  id: string;
  projectId: string;
  category: string;
  budgeted: number;
  spent: number;
  committed: number; // Payment requests pending approval
  remaining: number;
  variance: number;
  variancePercent: number;
  lastUpdated: string;
}

export interface Expense {
  id: string;
  projectId: string;
  budgetCategoryId: string;
  category: string;
  amount: number;
  currency: 'PKR';
  description: string;
  expenseDate: string;
  receiptUrl?: string;
  vendor?: string;
  paymentMethod?: 'cash' | 'bank_transfer' | 'check';
  approvedBy?: string;
  createdAt: string;
  createdBy: string;
}

export interface ProjectBudgetSummary {
  projectId: string;
  projectName: string;
  totalBudget: number;
  totalReceived: number;
  totalSpent: number;
  totalCommitted: number;
  remaining: number;
  utilizationPercent: number;
  categories: BudgetCategory[];
}

export interface PaymentMilestone {
  id: string;
  projectId: string;
  title: string;
  amount: number;
  dueDate: string;
  deliverables: string[];
  status: 'pending' | 'completed' | 'paid';
  completedAt?: string;
  paymentRequestId?: string;
}
