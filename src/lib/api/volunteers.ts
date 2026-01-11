import { supabase } from '../supabase';
import { ApiResponse, PaginationParams, wrapApiCall, withPagination } from './base';

export interface Volunteer {
  id: string;
  display_name: string;
  email: string;
  profile_photo_url: string;
  city: string;
  province: string;
  interests: string[];
  sdg_goals: number[];
  causes: string[];
  skills: string[];
  availability: {
    weekdays: boolean;
    weekends: boolean;
    hours_per_week: number;
  };
  total_hours: number;
  projects_completed: number;
  is_verified: boolean;
  verification_badge: string;
  background_check_status: 'pending' | 'approved' | 'rejected';
  background_check_date?: string;
  created_at: string;
}

export interface VolunteerFilters {
  city?: string;
  province?: string;
  interests?: string[];
  sdg_goals?: number[];
  skills?: string[];
  is_verified?: boolean;
  background_check_status?: string;
  search?: string;
  availability?: 'weekdays' | 'weekends' | 'both';
}

export interface VolunteerApplication {
  id: string;
  volunteer_id: string;
  project_id: string;
  opportunity_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  application_date: string;
  approved_date?: string;
  rejected_date?: string;
  rejection_reason?: string;
  cover_letter: string;
  availability_notes: string;
  skills_offered: string[];
  hours_committed: number;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationInput {
  project_id: string;
  opportunity_id?: string;
  cover_letter: string;
  availability_notes: string;
  skills_offered: string[];
  hours_committed: number;
}

export interface VolunteerHours {
  id: string;
  volunteer_id: string;
  project_id: string;
  date: string;
  hours: number;
  activity_description: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_date?: string;
  created_at: string;
}

export interface LogHoursInput {
  project_id: string;
  date: string;
  hours: number;
  activity_description: string;
}

class VolunteersApi {
  async getById(id: string): Promise<ApiResponse<Volunteer>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'volunteer')
        .single()
    );
  }

  async list(filters: VolunteerFilters = {}, pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'volunteer');

    // Apply filters
    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.province) {
      query = query.eq('province', filters.province);
    }

    if (filters.interests && filters.interests.length > 0) {
      query = query.overlaps('interests', filters.interests);
    }

    if (filters.sdg_goals && filters.sdg_goals.length > 0) {
      query = query.overlaps('sdg_goals', filters.sdg_goals);
    }

    if (filters.skills && filters.skills.length > 0) {
      query = query.overlaps('skills', filters.skills);
    }

    if (filters.is_verified !== undefined) {
      query = query.eq('is_verified', filters.is_verified);
    }

    if (filters.background_check_status) {
      query = query.eq('background_check_status', filters.background_check_status);
    }

    if (filters.search) {
      query = query.or(`display_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.availability) {
      if (filters.availability === 'weekdays') {
        query = query.eq('availability->>weekdays', 'true');
      } else if (filters.availability === 'weekends') {
        query = query.eq('availability->>weekends', 'true');
      }
    }

    return withPagination(query, pagination);
  }

  async update(id: string, updates: Partial<Volunteer>): Promise<ApiResponse<Volunteer>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );
  }

  // Applications
  async createApplication(input: CreateApplicationInput): Promise<ApiResponse<VolunteerApplication>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase.from('volunteer_applications').insert({
        ...input,
        volunteer_id: user.user.id,
        status: 'pending',
        application_date: new Date().toISOString(),
      }).select().single()
    );
  }

  async getApplications(volunteerId: string): Promise<ApiResponse<VolunteerApplication[]>> {
    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .select(`
          *,
          project:projects(*),
          opportunity:opportunities(*)
        `)
        .eq('volunteer_id', volunteerId)
        .order('application_date', { ascending: false })
    );
  }

  async updateApplicationStatus(
    applicationId: string,
    status: VolunteerApplication['status'],
    rejectionReason?: string
  ): Promise<ApiResponse<VolunteerApplication>> {
    const updates: any = { status };

    if (status === 'approved') {
      updates.approved_date = new Date().toISOString();
    } else if (status === 'rejected') {
      updates.rejected_date = new Date().toISOString();
      if (rejectionReason) {
        updates.rejection_reason = rejectionReason;
      }
    }

    return wrapApiCall(
      supabase
        .from('volunteer_applications')
        .update(updates)
        .eq('id', applicationId)
        .select()
        .single()
    );
  }

  async withdrawApplication(applicationId: string): Promise<ApiResponse<VolunteerApplication>> {
    return this.updateApplicationStatus(applicationId, 'withdrawn');
  }

  // Hours Tracking
  async logHours(input: LogHoursInput): Promise<ApiResponse<VolunteerHours>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase.from('volunteer_hours').insert({
        ...input,
        volunteer_id: user.user.id,
        status: 'pending',
      }).select().single()
    );
  }

  async getHours(volunteerId: string): Promise<ApiResponse<VolunteerHours[]>> {
    return wrapApiCall(
      supabase
        .from('volunteer_hours')
        .select(`
          *,
          project:projects(id, title)
        `)
        .eq('volunteer_id', volunteerId)
        .order('date', { ascending: false })
    );
  }

  async approveHours(hoursId: string): Promise<ApiResponse<VolunteerHours>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('volunteer_hours')
        .update({
          status: 'approved',
          approved_by: user.user.id,
          approved_date: new Date().toISOString(),
        })
        .eq('id', hoursId)
        .select()
        .single()
    );
  }

  async rejectHours(hoursId: string): Promise<ApiResponse<VolunteerHours>> {
    return wrapApiCall(
      supabase
        .from('volunteer_hours')
        .update({ status: 'rejected' })
        .eq('id', hoursId)
        .select()
        .single()
    );
  }

  // Background Check
  async requestBackgroundCheck(): Promise<ApiResponse<void>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('profiles')
        .update({ background_check_status: 'pending' })
        .eq('id', user.user.id)
    );
  }

  async updateBackgroundCheckStatus(
    volunteerId: string,
    status: 'approved' | 'rejected'
  ): Promise<ApiResponse<Volunteer>> {
    return wrapApiCall(
      supabase
        .from('profiles')
        .update({
          background_check_status: status,
          background_check_date: new Date().toISOString(),
        })
        .eq('id', volunteerId)
        .select()
        .single()
    );
  }

  // Stats
  async getStats(volunteerId: string): Promise<ApiResponse<any>> {
    const [hoursRes, applicationsRes, certificatesRes] = await Promise.all([
      supabase
        .from('volunteer_hours')
        .select('hours')
        .eq('volunteer_id', volunteerId)
        .eq('status', 'approved'),
      supabase
        .from('volunteer_applications')
        .select('id, status')
        .eq('volunteer_id', volunteerId),
      supabase
        .from('certificates')
        .select('id')
        .eq('volunteer_id', volunteerId),
    ]);

    const hours = hoursRes.data || [];
    const applications = applicationsRes.data || [];
    const certificates = certificatesRes.data || [];

    const stats = {
      totalHours: hours.reduce((sum, h) => sum + h.hours, 0),
      applicationsSubmitted: applications.length,
      applicationsApproved: applications.filter((a: any) => a.status === 'approved').length,
      certificatesEarned: certificates.length,
      activeProjects: applications.filter((a: any) => a.status === 'approved').length,
    };

    return { success: true, data: stats };
  }

  // Certificates
  async getCertificates(volunteerId: string): Promise<ApiResponse<any[]>> {
    return wrapApiCall(
      supabase
        .from('certificates')
        .select(`
          *,
          project:projects(id, title)
        `)
        .eq('volunteer_id', volunteerId)
        .order('issued_date', { ascending: false })
    );
  }

  async issueCertificate(volunteerId: string, projectId: string): Promise<ApiResponse<any>> {
    const certificateData = {
      volunteer_id: volunteerId,
      project_id: projectId,
      issued_date: new Date().toISOString(),
      certificate_number: `CERT-${Date.now()}-${volunteerId.slice(0, 8)}`,
    };

    return wrapApiCall(
      supabase.from('certificates').insert(certificateData).select().single()
    );
  }
}

export const volunteersApi = new VolunteersApi();
