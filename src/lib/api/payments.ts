import { supabase } from '../supabase';
import { wrapApiCall, wrapApiCallWithRateLimit } from './base';
import type { ApiResponse, PaginatedResponse } from './base';

export interface PaymentApproval {
  id: string;
  project_id: string;
  corporate_id: string;
  amount: number;
  payment_type: 'milestone' | 'reimbursement' | 'advance' | 'final';
  category: string;
  description: string;
  recipient_name: string;
  recipient_account: string;
  recipient_bank: string;
  invoice_number?: string;
  invoice_date?: string;
  supporting_documents?: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approver_id?: string;
  approved_at?: string;
  approved_amount?: number;
  payment_reference?: string;
  notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  project_id: string;
  corporate_id: string;
  amount: number;
  payment_type: 'milestone' | 'reimbursement' | 'advance' | 'final';
  category: string;
  description: string;
  recipient_name: string;
  recipient_account: string;
  recipient_bank: string;
  invoice_number?: string;
  invoice_date?: string;
  supporting_documents?: string[];
  urgency?: 'low' | 'medium' | 'high';
}

export interface ApprovePaymentRequest {
  notes?: string;
  approved_amount?: number;
  payment_reference?: string;
}

export interface RejectPaymentRequest {
  reason: string;
  requires_revision?: boolean;
}

class PaymentsApi {
  // Get payment approvals for corporate
  async getPaymentApprovals(
    corporateId: string,
    filters?: {
      status?: string;
      project_id?: string;
    }
  ): Promise<ApiResponse<PaymentApproval[]>> {
    let query = supabase
      .from('payment_approvals')
      .select('*')
      .eq('corporate_id', corporateId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    return wrapApiCall(query);
  }

  // Get payment approvals for project
  async getProjectPaymentApprovals(projectId: string): Promise<ApiResponse<PaymentApproval[]>> {
    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
    );
  }

  // Get payment approval by ID
  async getPaymentApproval(id: string): Promise<ApiResponse<PaymentApproval>> {
    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  // Create payment approval request
  async createPaymentApproval(data: PaymentRequest): Promise<ApiResponse<PaymentApproval>> {
    return wrapApiCallWithRateLimit(
      () => supabase
        .from('payment_approvals')
        .insert([{
          ...data,
          status: 'pending',
          urgency: data.urgency || 'medium',
        }])
        .select()
        .single(),
      'createPayment'
    );
  }

  // Approve payment
  async approvePayment(
    id: string,
    data: ApprovePaymentRequest
  ): Promise<ApiResponse<PaymentApproval>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCallWithRateLimit(
      () => supabase
        .from('payment_approvals')
        .update({
          status: 'approved',
          approver_id: user?.id,
          approved_at: new Date().toISOString(),
          notes: data.notes,
          approved_amount: data.approved_amount,
          payment_reference: data.payment_reference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single(),
      'adminVetting'
    );
  }

  // Reject payment
  async rejectPayment(
    id: string,
    data: RejectPaymentRequest
  ): Promise<ApiResponse<PaymentApproval>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCallWithRateLimit(
      () => supabase
        .from('payment_approvals')
        .update({
          status: 'rejected',
          approver_id: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: data.reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single(),
      'adminVetting'
    );
  }

  // Mark payment as paid
  async markAsPaid(
    id: string,
    payment_reference: string
  ): Promise<ApiResponse<PaymentApproval>> {
    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .update({
          status: 'paid',
          payment_reference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  // Get payment statistics
  async getPaymentStats(corporateId: string): Promise<ApiResponse<{
    total_pending: number;
    total_approved: number;
    total_paid: number;
    total_amount_pending: number;
    total_amount_approved: number;
    total_amount_paid: number;
  }>> {
    return wrapApiCall(
      supabase.rpc('get_payment_stats', { p_corporate_id: corporateId })
    );
  }

  // Get paginated payment approvals
  async getPaginatedPaymentApprovals(
    corporateId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      project_id?: string;
    }
  ): Promise<PaginatedResponse<PaymentApproval>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('payment_approvals')
      .select('*', { count: 'exact' })
      .eq('corporate_id', corporateId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    return wrapApiCall(query);
  }

  // Bulk approve payments
  async bulkApprovePayments(
    ids: string[],
    data: ApprovePaymentRequest
  ): Promise<ApiResponse<PaymentApproval[]>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .update({
          status: 'approved',
          approver_id: user?.id,
          approved_at: new Date().toISOString(),
          notes: data.notes,
          updated_at: new Date().toISOString(),
        })
        .in('id', ids)
        .select()
    );
  }

  // Bulk reject payments
  async bulkRejectPayments(
    ids: string[],
    data: RejectPaymentRequest
  ): Promise<ApiResponse<PaymentApproval[]>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .update({
          status: 'rejected',
          approver_id: user?.id,
          approved_at: new Date().toISOString(),
          rejection_reason: data.reason,
          updated_at: new Date().toISOString(),
        })
        .in('id', ids)
        .select()
    );
  }

  /**
   * Export payments data for CSV/Excel export
   * Fetches all payment approvals matching filters without pagination for export purposes
   */
  async exportData(filters?: {
    status?: string;
    project_id?: string;
    corporate_id?: string;
  }): Promise<ApiResponse<PaymentApproval[]>> {
    let query = supabase
      .from('payment_approvals')
      .select(`
        *,
        project:projects!project_id(title),
        corporate:profiles!corporate_id(display_name, organization_name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    if (filters?.corporate_id) {
      query = query.eq('corporate_id', filters.corporate_id);
    }

    // Limit to reasonable export size (max 10,000 records)
    query = query.limit(10000);

    return wrapApiCall(query);
  }
}

export const paymentsApi = new PaymentsApi();
