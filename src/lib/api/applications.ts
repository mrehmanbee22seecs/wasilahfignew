import { supabase } from '../supabase';
import { wrapApiCall } from './base';
import type { ApiResponse, PaginatedResponse } from './base';

export interface VolunteerApplication {
  id: string;
  volunteer_id: string;
  project_id: string;
  motivation: string;
  availability_start: string;
  availability_end: string;
  hours_per_week: number;
  skills: string[];
  experience?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  project_id: string;
  motivation: string;
  availability_start: string;
  availability_end: string;
  hours_per_week: number;
  skills: string[];
  experience?: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
}

export interface ReviewApplicationRequest {
  status: 'approved' | 'rejected';
  review_notes?: string;
  rejection_reason?: string;
}

class ApplicationsApi {
  // Get applications for volunteer
  async getVolunteerApplications(
    volunteerId: string,
    filters?: {
      status?: string;
      project_id?: string;
    }
  ): Promise<ApiResponse<VolunteerApplication[]>> {
    let query = supabase
      .from('volunteer_applications')
      .select('*')
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.project_id) {
      query = query.eq('project_id', filters.project_id);
    }

    return wrapApiCall(query);
  }

  // Get applications for project
  async getProjectApplications(
    projectId: string,
    filters?: {
      status?: string;
    }
  ): Promise<ApiResponse<VolunteerApplication[]>> {
    let query = supabase
      .from('volunteer_applications')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    return wrapApiCall(query);
  }

  // Get application by ID
  async getApplication(id: string): Promise<ApiResponse<VolunteerApplication>> {
    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .select('*')
        .eq('id', id)
        .single()
    );
  }

  // Create application
  async createApplication(data: CreateApplicationRequest): Promise<ApiResponse<VolunteerApplication>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .insert([{
          ...data,
          volunteer_id: user?.id,
          status: 'pending',
        }])
        .select()
        .single()
    );
  }

  // Review application
  async reviewApplication(
    id: string,
    data: ReviewApplicationRequest
  ): Promise<ApiResponse<VolunteerApplication>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .update({
          status: data.status,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: data.review_notes,
          rejection_reason: data.rejection_reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  // Withdraw application
  async withdrawApplication(id: string, reason: string): Promise<ApiResponse<VolunteerApplication>> {
    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .update({
          status: 'withdrawn',
          rejection_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  // Get application statistics
  async getApplicationStats(projectId?: string): Promise<ApiResponse<{
    total_pending: number;
    total_approved: number;
    total_rejected: number;
    total_withdrawn: number;
  }>> {
    const rpcName = projectId ? 'get_project_application_stats' : 'get_application_stats';
    const params = projectId ? { p_project_id: projectId } : {};
    
    return wrapApiCall(
      supabase.rpc(rpcName, params)
    );
  }

  // Get paginated applications
  async getPaginatedApplications(
    projectId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
    }
  ): Promise<PaginatedResponse<VolunteerApplication>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('volunteer_applications')
      .select('*', { count: 'exact' })
      .eq('project_id', projectId)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    return wrapApiCall(query);
  }

  // Bulk approve applications
  async bulkApproveApplications(
    ids: string[],
    review_notes?: string
  ): Promise<ApiResponse<VolunteerApplication[]>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes,
          updated_at: new Date().toISOString(),
        })
        .in('id', ids)
        .select()
    );
  }

  // Bulk reject applications
  async bulkRejectApplications(
    ids: string[],
    rejection_reason: string
  ): Promise<ApiResponse<VolunteerApplication[]>> {
    const { data: { user } } = await supabase.auth.getUser();

    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason,
          updated_at: new Date().toISOString(),
        })
        .in('id', ids)
        .select()
    );
  }
}

export const applicationsApi = new ApplicationsApi();
