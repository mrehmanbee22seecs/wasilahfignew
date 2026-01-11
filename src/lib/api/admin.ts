import { supabase } from '../supabase';
import { ApiResponse, PaginationParams, wrapApiCall, withPagination } from './base';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'corporate' | 'ngo' | 'volunteer';
  display_name: string;
  created_at: string;
  last_login_at: string;
  is_active: boolean;
}

export interface VettingQueue {
  id: string;
  entity_type: 'ngo' | 'volunteer' | 'project' | 'document';
  entity_id: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  submitted_date: string;
  reviewed_date?: string;
  sla_deadline: string;
  sla_status: 'on_time' | 'approaching' | 'overdue';
  notes?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

export interface PlatformStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    by_role: Record<string, number>;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    total_budget: number;
  };
  ngos: {
    total: number;
    verified: number;
    pending_verification: number;
  };
  volunteers: {
    total: number;
    active: number;
    total_hours: number;
  };
}

class AdminApi {
  // User Management
  async getAllUsers(pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    const query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    return withPagination(query, pagination);
  }

  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    );
  }

  async updateUserRole(userId: string, role: AdminUser['role']): Promise<ApiResponse<AdminUser>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()
    );
  }

  async deactivateUser(userId: string): Promise<ApiResponse<void>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId)
    );
  }

  async activateUser(userId: string): Promise<ApiResponse<void>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId)
    );
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    // This will cascade delete due to foreign key constraints
    return wrapApiCall(
      supabase.auth.admin.deleteUser(userId)
    );
  }

  // Vetting Queue
  async getVettingQueue(filters: {
    entity_type?: VettingQueue['entity_type'];
    status?: VettingQueue['status'];
    priority?: VettingQueue['priority'];
    assigned_to?: string;
  } = {}, pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    let query = supabase
      .from('vetting_queue')
      .select(`
        *,
        entity:entity_id(*),
        assignee:profiles!assigned_to(display_name)
      `, { count: 'exact' });

    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters.assigned_to) {
      query = query.eq('assigned_to', filters.assigned_to);
    }

    return withPagination(query, pagination);
  }

  async assignVettingItem(itemId: string, assigneeId: string): Promise<ApiResponse<VettingQueue>> {
    return wrapApiCall(
      supabase
        .from('vetting_queue')
        .update({
          assigned_to: assigneeId,
          status: 'in_review',
        })
        .eq('id', itemId)
        .select()
        .single()
    );
  }

  async approveVettingItem(itemId: string, notes?: string): Promise<ApiResponse<VettingQueue>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('vetting_queue')
        .update({
          status: 'approved',
          reviewed_date: new Date().toISOString(),
          notes,
        })
        .eq('id', itemId)
        .select()
        .single()
    );
  }

  async rejectVettingItem(itemId: string, reason: string): Promise<ApiResponse<VettingQueue>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('vetting_queue')
        .update({
          status: 'rejected',
          reviewed_date: new Date().toISOString(),
          notes: reason,
        })
        .eq('id', itemId)
        .select()
        .single()
    );
  }

  async updatePriority(itemId: string, priority: VettingQueue['priority']): Promise<ApiResponse<VettingQueue>> {
    return wrapApiCall(
      supabase
        .from('vetting_queue')
        .update({ priority })
        .eq('id', itemId)
        .select()
        .single()
    );
  }

  // Audit Logs
  async getAuditLogs(filters: {
    user_id?: string;
    action?: string;
    entity_type?: string;
    start_date?: string;
    end_date?: string;
  } = {}, pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:profiles!user_id(display_name, email)
      `, { count: 'exact' })
      .order('timestamp', { ascending: false });

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters.action) {
      query = query.eq('action', filters.action);
    }

    if (filters.entity_type) {
      query = query.eq('entity_type', filters.entity_type);
    }

    if (filters.start_date) {
      query = query.gte('timestamp', filters.start_date);
    }

    if (filters.end_date) {
      query = query.lte('timestamp', filters.end_date);
    }

    return withPagination(query, pagination);
  }

  async createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<ApiResponse<AuditLog>> {
    return wrapApiCall(
      supabase
        .from('audit_logs')
        .insert({
          ...log,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single()
    );
  }

  // Platform Statistics
  async getPlatformStats(): Promise<ApiResponse<PlatformStats>> {
    const [usersRes, projectsRes, ngosRes, volunteersRes, hoursRes] = await Promise.all([
      supabase.from('profiles').select('id, role, created_at, last_login_at'),
      supabase.from('projects').select('id, status, budget'),
      supabase.from('organizations').select('id, verification_status').eq('type', 'ngo'),
      supabase.from('profiles').select('id').eq('role', 'volunteer'),
      supabase.from('volunteer_hours').select('hours').eq('status', 'approved'),
    ]);

    const users = usersRes.data || [];
    const projects = projectsRes.data || [];
    const ngos = ngosRes.data || [];
    const volunteers = volunteersRes.data || [];
    const hours = hoursRes.data || [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats: PlatformStats = {
      users: {
        total: users.length,
        active: users.filter(u => u.last_login_at && new Date(u.last_login_at) > thirtyDaysAgo).length,
        new_this_month: users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length,
        by_role: users.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      projects: {
        total: projects.length,
        active: projects.filter((p: any) => p.status === 'active').length,
        completed: projects.filter((p: any) => p.status === 'completed').length,
        total_budget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      },
      ngos: {
        total: ngos.length,
        verified: ngos.filter((n: any) => n.verification_status === 'verified').length,
        pending_verification: ngos.filter((n: any) => n.verification_status === 'pending').length,
      },
      volunteers: {
        total: volunteers.length,
        active: users.filter(u => u.role === 'volunteer' && u.last_login_at && new Date(u.last_login_at) > thirtyDaysAgo).length,
        total_hours: hours.reduce((sum, h) => sum + h.hours, 0),
      },
    };

    return { success: true, data: stats };
  }

  // Bulk Operations
  async bulkUpdateStatus(
    entity_type: 'ngo' | 'project' | 'volunteer',
    entity_ids: string[],
    status: string
  ): Promise<ApiResponse<void>> {
    const table = entity_type === 'ngo' ? 'organizations' : entity_type === 'project' ? 'projects' : 'profiles';
    const statusField = entity_type === 'ngo' ? 'verification_status' : 'status';

    return wrapApiCall(
      supabase
        .from(table)
        .update({ [statusField]: status })
        .in('id', entity_ids)
    );
  }

  async bulkDelete(
    entity_type: 'ngo' | 'project' | 'user',
    entity_ids: string[]
  ): Promise<ApiResponse<void>> {
    const table = entity_type === 'ngo' ? 'organizations' : entity_type === 'project' ? 'projects' : 'profiles';

    if (entity_type === 'user') {
      // Use auth admin API for users
      for (const id of entity_ids) {
        await supabase.auth.admin.deleteUser(id);
      }
      return { success: true };
    } else if (entity_type === 'ngo') {
      // Soft delete for NGOs
      return wrapApiCall(
        supabase
          .from(table)
          .update({ deleted_at: new Date().toISOString() })
          .in('id', entity_ids)
      );
    } else {
      // Hard delete for projects
      return wrapApiCall(
        supabase
          .from(table)
          .delete()
          .in('id', entity_ids)
      );
    }
  }

  // Reports & Analytics
  async generateSystemReport(reportType: 'users' | 'projects' | 'financial' | 'activity', startDate: string, endDate: string): Promise<ApiResponse<any>> {
    switch (reportType) {
      case 'users':
        return this.generateUsersReport(startDate, endDate);
      case 'projects':
        return this.generateProjectsReport(startDate, endDate);
      case 'financial':
        return this.generateFinancialReport(startDate, endDate);
      case 'activity':
        return this.generateActivityReport(startDate, endDate);
      default:
        return { success: false, error: 'Invalid report type', code: 'INVALID_REPORT_TYPE' };
    }
  }

  private async generateUsersReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    const { data: users } = await supabase
      .from('profiles')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    return {
      success: true,
      data: {
        total: users?.length || 0,
        by_role: users?.reduce((acc, u) => {
          acc[u.role] = (acc[u.role] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_location: users?.reduce((acc, u) => {
          const key = `${u.city}, ${u.province}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }

  private async generateProjectsReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    return {
      success: true,
      data: {
        total: projects?.length || 0,
        by_status: projects?.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        total_budget: projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0,
        beneficiaries: projects?.reduce((sum, p) => sum + (p.beneficiaries_count || 0), 0) || 0,
      },
    };
  }

  private async generateFinancialReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    const { data: projects } = await supabase
      .from('projects')
      .select('budget, budget_allocated, budget_spent')
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    const total_budget = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
    const total_allocated = projects?.reduce((sum, p) => sum + (p.budget_allocated || 0), 0) || 0;
    const total_spent = projects?.reduce((sum, p) => sum + (p.budget_spent || 0), 0) || 0;

    return {
      success: true,
      data: {
        total_budget,
        total_allocated,
        total_spent,
        utilization_rate: total_budget > 0 ? (total_spent / total_budget) * 100 : 0,
      },
    };
  }

  private async generateActivityReport(startDate: string, endDate: string): Promise<ApiResponse<any>> {
    const { data: logs } = await supabase
      .from('audit_logs')
      .select('action, entity_type')
      .gte('timestamp', startDate)
      .lte('timestamp', endDate);

    return {
      success: true,
      data: {
        total_actions: logs?.length || 0,
        by_action: logs?.reduce((acc, l) => {
          acc[l.action] = (acc[l.action] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_entity: logs?.reduce((acc, l) => {
          acc[l.entity_type] = (acc[l.entity_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }
}

export const adminApi = new AdminApi();
