import { supabase } from '../supabase';
import { ApiResponse, PaginationParams, wrapApiCall, withPagination } from './base';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'on_hold' | 'cancelled';
  corporate_id: string;
  ngo_id?: string;
  budget: number;
  budget_allocated: number;
  budget_spent: number;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  province: string;
  sdg_goals: number[];
  focus_areas: string[];
  volunteer_count: number;
  volunteer_capacity: number;
  beneficiaries_count: number;
  media_urls: string[];
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completed_date?: string;
  evidence_urls?: string[];
}

export interface CreateProjectInput {
  title: string;
  description: string;
  budget: number;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  province: string;
  sdg_goals: number[];
  focus_areas: string[];
  volunteer_capacity: number;
  ngo_id?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  status?: Project['status'];
  budget?: number;
  start_date?: string;
  end_date?: string;
  location?: string;
  city?: string;
  province?: string;
  sdg_goals?: number[];
  focus_areas?: string[];
  volunteer_capacity?: number;
  ngo_id?: string;
}

export interface ProjectFilters {
  status?: Project['status'][];
  corporate_id?: string;
  ngo_id?: string;
  city?: string;
  province?: string;
  sdg_goals?: number[];
  search?: string;
}

class ProjectsApi {
  async create(input: CreateProjectInput): Promise<ApiResponse<Project>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase.from('projects').insert({
        ...input,
        created_by: user.user.id,
        corporate_id: user.user.id,
        status: 'draft',
        budget_allocated: 0,
        budget_spent: 0,
        volunteer_count: 0,
        beneficiaries_count: 0,
        media_urls: [],
        milestones: [],
      }).select().single()
    );
  }

  async getById(id: string): Promise<ApiResponse<Project>> {
    return wrapApiCall(
      supabase
        .from('projects')
        .select(`
          *,
          corporate:profiles!corporate_id(*),
          ngo:organizations!ngo_id(*)
        `)
        .eq('id', id)
        .single()
    );
  }

  async list(filters: ProjectFilters = {}, pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    let query = supabase
      .from('projects')
      .select(`
        *,
        corporate:profiles!corporate_id(id, display_name, organization_name),
        ngo:organizations!ngo_id(id, name, logo_url)
      `, { count: 'exact' });

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters.corporate_id) {
      query = query.eq('corporate_id', filters.corporate_id);
    }

    if (filters.ngo_id) {
      query = query.eq('ngo_id', filters.ngo_id);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.province) {
      query = query.eq('province', filters.province);
    }

    if (filters.sdg_goals && filters.sdg_goals.length > 0) {
      query = query.overlaps('sdg_goals', filters.sdg_goals);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return withPagination(query, pagination);
  }

  async update(id: string, input: UpdateProjectInput): Promise<ApiResponse<Project>> {
    return wrapApiCall(
      supabase
        .from('projects')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return wrapApiCall(
      supabase.from('projects').delete().eq('id', id)
    );
  }

  async attachNGO(projectId: string, ngoId: string): Promise<ApiResponse<Project>> {
    return wrapApiCall(
      supabase
        .from('projects')
        .update({ ngo_id: ngoId })
        .eq('id', projectId)
        .select()
        .single()
    );
  }

  async addMilestone(projectId: string, milestone: Omit<Milestone, 'id'>): Promise<ApiResponse<Project>> {
    const { data: project } = await this.getById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }

    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      ...milestone,
    };

    const updatedMilestones = [...(project.milestones || []), newMilestone];

    return wrapApiCall(
      supabase
        .from('projects')
        .update({ milestones: updatedMilestones })
        .eq('id', projectId)
        .select()
        .single()
    );
  }

  async updateMilestone(
    projectId: string,
    milestoneId: string,
    updates: Partial<Milestone>
  ): Promise<ApiResponse<Project>> {
    const { data: project } = await this.getById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }

    const updatedMilestones = project.milestones.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, ...updates } : m
    );

    return wrapApiCall(
      supabase
        .from('projects')
        .update({ milestones: updatedMilestones })
        .eq('id', projectId)
        .select()
        .single()
    );
  }

  async uploadMedia(projectId: string, files: File[]): Promise<ApiResponse<string[]>> {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${projectId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('project-media')
        .upload(fileName, file);

      if (error) {
        console.error('Upload error:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-media')
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return { success: false, error: 'Failed to upload media', code: 'UPLOAD_ERROR' };
    }

    // Update project with new media URLs
    const { data: project } = await this.getById(projectId);
    if (project) {
      const allMediaUrls = [...(project.media_urls || []), ...uploadedUrls];
      await this.update(projectId, { media_urls: allMediaUrls } as any);
    }

    return { success: true, data: uploadedUrls };
  }

  async getProjectStats(projectId: string): Promise<ApiResponse<any>> {
    const { data: project } = await this.getById(projectId);
    if (!project) {
      return { success: false, error: 'Project not found', code: 'NOT_FOUND' };
    }

    const stats = {
      budgetUtilization: project.budget > 0 ? (project.budget_spent / project.budget) * 100 : 0,
      volunteerFillRate: project.volunteer_capacity > 0 
        ? (project.volunteer_count / project.volunteer_capacity) * 100 
        : 0,
      milestonesCompleted: project.milestones.filter((m: Milestone) => m.status === 'completed').length,
      milestonesTotal: project.milestones.length,
      daysRemaining: Math.ceil(
        (new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
      status: project.status,
    };

    return { success: true, data: stats };
  }
}

export const projectsApi = new ProjectsApi();
