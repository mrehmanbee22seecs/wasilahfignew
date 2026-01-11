import { supabase } from '../supabase';
import { ApiResponse, PaginationParams, wrapApiCall, withPagination } from './base';

export interface Corporate {
  id: string;
  display_name: string;
  email: string;
  organization_id: string;
  organization_name: string;
  profile_photo_url: string;
  city: string;
  province: string;
  created_at: string;
}

export interface CorporateOrganization {
  id: string;
  type: 'corporate';
  name: string;
  legal_name: string;
  registration_number: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  province: string;
  description: string;
  industry: string;
  employee_count_range: string;
  founded_year: number;
  logo_url: string;
  cover_photo_url: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  csr_budget_annual: number;
  focus_areas: string[];
  sdg_alignment: number[];
  created_at: string;
}

export interface UpdateCorporateInput {
  display_name?: string;
  organization_name?: string;
  city?: string;
  province?: string;
  profile_photo_url?: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  description?: string;
  industry?: string;
  employee_count_range?: string;
  logo_url?: string;
  cover_photo_url?: string;
  csr_budget_annual?: number;
  focus_areas?: string[];
  sdg_alignment?: number[];
}

export interface CSRBudget {
  id: string;
  corporate_id: string;
  fiscal_year: string;
  total_budget: number;
  allocated: number;
  spent: number;
  remaining: number;
  breakdown: {
    category: string;
    allocated: number;
    spent: number;
  }[];
  updated_at: string;
}

export interface PaymentApproval {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requested_by: string;
  requested_date: string;
  approved_by?: string;
  approved_date?: string;
  rejection_reason?: string;
  invoice_url?: string;
  notes?: string;
}

class CorporatesApi {
  async getById(id: string): Promise<ApiResponse<Corporate>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations!organization_id(*)
        `)
        .eq('id', id)
        .eq('role', 'corporate')
        .single()
    );
  }

  async list(pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    const query = supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations!organization_id(*)
      `, { count: 'exact' })
      .eq('role', 'corporate');

    return withPagination(query, pagination);
  }

  async update(id: string, input: UpdateCorporateInput): Promise<ApiResponse<Corporate>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    );
  }

  async getOrganization(orgId: string): Promise<ApiResponse<CorporateOrganization>> {
    return wrapApiCall(
      supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .eq('type', 'corporate')
        .single()
    );
  }

  async updateOrganization(orgId: string, input: UpdateOrganizationInput): Promise<ApiResponse<CorporateOrganization>> {
    return wrapApiCall(
      supabase
        .from('organizations')
        .update(input)
        .eq('id', orgId)
        .select()
        .single()
    );
  }

  // Projects
  async getProjects(corporateId: string): Promise<ApiResponse<any[]>> {
    return wrapApiCall(
      supabase
        .from('projects')
        .select(`
          *,
          ngo:organizations!ngo_id(id, name, logo_url)
        `)
        .eq('corporate_id', corporateId)
        .order('created_at', { ascending: false })
    );
  }

  // Budget Management
  async getBudget(corporateId: string, fiscalYear?: string): Promise<ApiResponse<CSRBudget>> {
    const year = fiscalYear || new Date().getFullYear().toString();

    return wrapApiCall(
      supabase
        .from('csr_budgets')
        .select('*')
        .eq('corporate_id', corporateId)
        .eq('fiscal_year', year)
        .single()
    );
  }

  async updateBudget(corporateId: string, fiscalYear: string, budget: Partial<CSRBudget>): Promise<ApiResponse<CSRBudget>> {
    // Check if budget exists
    const { data: existing } = await supabase
      .from('csr_budgets')
      .select('id')
      .eq('corporate_id', corporateId)
      .eq('fiscal_year', fiscalYear)
      .single();

    if (existing) {
      // Update existing
      return wrapApiCall(
        supabase
          .from('csr_budgets')
          .update(budget)
          .eq('id', existing.id)
          .select()
          .single()
      );
    } else {
      // Create new
      return wrapApiCall(
        supabase
          .from('csr_budgets')
          .insert({
            corporate_id: corporateId,
            fiscal_year: fiscalYear,
            ...budget,
          })
          .select()
          .single()
      );
    }
  }

  async allocateBudget(corporateId: string, projectId: string, amount: number): Promise<ApiResponse<void>> {
    // Get current budget
    const { data: budget } = await this.getBudget(corporateId);
    if (!budget) {
      return { success: false, error: 'Budget not found', code: 'NOT_FOUND' };
    }

    if (budget.remaining < amount) {
      return { success: false, error: 'Insufficient budget', code: 'INSUFFICIENT_BUDGET' };
    }

    // Update budget
    const newAllocated = budget.allocated + amount;
    const newRemaining = budget.total_budget - newAllocated;

    await this.updateBudget(corporateId, budget.fiscal_year, {
      allocated: newAllocated,
      remaining: newRemaining,
    });

    // Update project budget
    await supabase
      .from('projects')
      .update({ budget_allocated: amount })
      .eq('id', projectId);

    return { success: true };
  }

  // Payment Approvals
  async getPaymentApprovals(corporateId: string): Promise<ApiResponse<PaymentApproval[]>> {
    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .select(`
          *,
          project:projects(id, title),
          requester:profiles!requested_by(display_name)
        `)
        .eq('projects.corporate_id', corporateId)
        .order('requested_date', { ascending: false })
    );
  }

  async createPaymentApproval(projectId: string, amount: number, invoiceUrl?: string, notes?: string): Promise<ApiResponse<PaymentApproval>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .insert({
          project_id: projectId,
          amount,
          status: 'pending',
          requested_by: user.user.id,
          requested_date: new Date().toISOString(),
          invoice_url: invoiceUrl,
          notes,
        })
        .select()
        .single()
    );
  }

  async approvePayment(approvalId: string): Promise<ApiResponse<PaymentApproval>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .update({
          status: 'approved',
          approved_by: user.user.id,
          approved_date: new Date().toISOString(),
        })
        .eq('id', approvalId)
        .select()
        .single()
    );
  }

  async rejectPayment(approvalId: string, reason: string): Promise<ApiResponse<PaymentApproval>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('payment_approvals')
        .update({
          status: 'rejected',
          approved_by: user.user.id,
          approved_date: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', approvalId)
        .select()
        .single()
    );
  }

  // Dashboard Stats
  async getDashboardStats(corporateId: string): Promise<ApiResponse<any>> {
    const [projectsRes, budgetRes, volunteersRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, status, beneficiaries_count')
        .eq('corporate_id', corporateId),
      this.getBudget(corporateId),
      supabase
        .from('volunteer_applications')
        .select('id, project_id')
        .in('project_id', supabase.from('projects').select('id').eq('corporate_id', corporateId)),
    ]);

    const projects = projectsRes.data || [];
    const budget = budgetRes.data;
    const volunteers = volunteersRes.data || [];

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p: any) => p.status === 'active').length,
      completedProjects: projects.filter((p: any) => p.status === 'completed').length,
      totalBeneficiaries: projects.reduce((sum: number, p: any) => sum + (p.beneficiaries_count || 0), 0),
      totalVolunteers: volunteers.length,
      budgetUtilization: budget ? (budget.spent / budget.total_budget) * 100 : 0,
      budgetRemaining: budget?.remaining || 0,
    };

    return { success: true, data: stats };
  }

  // Reports
  async generateImpactReport(corporateId: string, startDate: string, endDate: string): Promise<ApiResponse<any>> {
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('corporate_id', corporateId)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!projects) {
      return { success: false, error: 'No projects found', code: 'NOT_FOUND' };
    }

    const report = {
      period: { start: startDate, end: endDate },
      summary: {
        totalProjects: projects.length,
        totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
        totalSpent: projects.reduce((sum, p) => sum + p.budget_spent, 0),
        beneficiariesReached: projects.reduce((sum, p) => sum + (p.beneficiaries_count || 0), 0),
        volunteersEngaged: projects.reduce((sum, p) => sum + (p.volunteer_count || 0), 0),
      },
      projectsBySDG: this.groupProjectsBySDG(projects),
      projectsByStatus: this.groupProjectsByStatus(projects),
      projects: projects,
    };

    return { success: true, data: report };
  }

  private groupProjectsBySDG(projects: any[]): Record<number, number> {
    const sdgMap: Record<number, number> = {};
    projects.forEach(p => {
      (p.sdg_goals || []).forEach((sdg: number) => {
        sdgMap[sdg] = (sdgMap[sdg] || 0) + 1;
      });
    });
    return sdgMap;
  }

  private groupProjectsByStatus(projects: any[]): Record<string, number> {
    const statusMap: Record<string, number> = {};
    projects.forEach(p => {
      statusMap[p.status] = (statusMap[p.status] || 0) + 1;
    });
    return statusMap;
  }
}

export const corporatesApi = new CorporatesApi();
