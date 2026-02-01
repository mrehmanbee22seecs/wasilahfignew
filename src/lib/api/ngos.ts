import { supabase } from '../supabase';
import { ApiResponse, PaginationParams, wrapApiCall, withPagination } from './base';

export interface NGO {
  id: string;
  type: 'ngo' | 'foundation' | 'government';
  name: string;
  legal_name: string;
  registration_number: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  description: string;
  mission_statement: string;
  founded_year: number;
  employee_count_range: string;
  industry: string;
  focus_areas: string[];
  sdg_alignment: number[];
  logo_url: string;
  cover_photo_url: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'suspended';
  verified_at: string;
  verification_documents: any;
  social_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNGOInput {
  name: string;
  legal_name: string;
  registration_number: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city: string;
  province: string;
  description: string;
  mission_statement: string;
  founded_year: number;
  focus_areas: string[];
  sdg_alignment: number[];
}

export interface UpdateNGOInput {
  name?: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  province?: string;
  description?: string;
  mission_statement?: string;
  focus_areas?: string[];
  sdg_alignment?: number[];
  logo_url?: string;
  cover_photo_url?: string;
  social_links?: NGO['social_links'];
}

export interface NGOFilters {
  verification_status?: NGO['verification_status'][];
  city?: string;
  province?: string;
  focus_areas?: string[];
  sdg_alignment?: number[];
  search?: string;
}

export interface NGODocument {
  id: string;
  ngo_id: string;
  document_type: 'registration' | 'tax_exemption' | 'financial_statement' | 'annual_report' | 'other';
  file_name: string;
  file_url: string;
  file_size: number;
  upload_date: string;
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
}

class NGOsApi {
  async create(input: CreateNGOInput): Promise<ApiResponse<NGO>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase.from('organizations').insert({
        ...input,
        type: 'ngo',
        created_by: user.user.id,
        verification_status: 'pending',
        country: 'Pakistan',
        social_links: {},
      }).select().single()
    );
  }

  async getById(id: string): Promise<ApiResponse<NGO>> {
    return wrapApiCall(
      supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .eq('type', 'ngo')
        .single()
    );
  }

  async list(filters: NGOFilters = {}, pagination: PaginationParams = {}): Promise<ApiResponse<any>> {
    let query = supabase
      .from('organizations')
      .select('*', { count: 'exact' })
      .eq('type', 'ngo')
      .is('deleted_at', null);

    // Apply filters
    if (filters.verification_status && filters.verification_status.length > 0) {
      query = query.in('verification_status', filters.verification_status);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.province) {
      query = query.eq('province', filters.province);
    }

    if (filters.focus_areas && filters.focus_areas.length > 0) {
      query = query.overlaps('focus_areas', filters.focus_areas);
    }

    if (filters.sdg_alignment && filters.sdg_alignment.length > 0) {
      query = query.overlaps('sdg_alignment', filters.sdg_alignment);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    return withPagination(query, pagination);
  }

  async update(id: string, input: UpdateNGOInput): Promise<ApiResponse<NGO>> {
    return wrapApiCall(
      supabase
        .from('organizations')
        .update(input)
        .eq('id', id)
        .select()
        .single()
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    // Soft delete
    return wrapApiCall(
      supabase
        .from('organizations')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
    );
  }

  async uploadLogo(ngoId: string, file: File): Promise<ApiResponse<string>> {
    const fileName = `${ngoId}/logo_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('ngo-media')
      .upload(fileName, file);

    if (error) {
      return { success: false, error: error.message, code: 'UPLOAD_ERROR' };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ngo-media')
      .getPublicUrl(data.path);

    // Update NGO with new logo URL
    await this.update(ngoId, { logo_url: publicUrl });

    return { success: true, data: publicUrl };
  }

  async uploadDocument(
    ngoId: string,
    file: File,
    documentType: NGODocument['document_type']
  ): Promise<ApiResponse<NGODocument>> {
    const fileName = `${ngoId}/documents/${documentType}_${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('ngo-documents')
      .upload(fileName, file);

    if (error) {
      return { success: false, error: error.message, code: 'UPLOAD_ERROR' };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ngo-documents')
      .getPublicUrl(data.path);

    const document: Omit<NGODocument, 'id' | 'upload_date'> = {
      ngo_id: ngoId,
      document_type: documentType,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      verified: false,
    };

    return wrapApiCall(
      supabase.from('ngo_documents').insert(document).select().single()
    );
  }

  async getDocuments(ngoId: string): Promise<ApiResponse<NGODocument[]>> {
    return wrapApiCall(
      supabase
        .from('ngo_documents')
        .select('*')
        .eq('ngo_id', ngoId)
        .order('upload_date', { ascending: false })
    );
  }

  async verifyDocument(documentId: string, verified: boolean, notes?: string): Promise<ApiResponse<NGODocument>> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { success: false, error: 'Not authenticated', code: 'AUTH_ERROR' };
    }

    return wrapApiCall(
      supabase
        .from('ngo_documents')
        .update({
          verified,
          verified_by: user.user.id,
          verified_at: new Date().toISOString(),
          notes,
        })
        .eq('id', documentId)
        .select()
        .single()
    );
  }

  async updateVerificationStatus(
    ngoId: string,
    status: NGO['verification_status'],
    notes?: string
  ): Promise<ApiResponse<NGO>> {
    const updates: any = {
      verification_status: status,
    };

    if (status === 'verified') {
      updates.verified_at = new Date().toISOString();
    }

    return wrapApiCall(
      supabase
        .from('organizations')
        .update(updates)
        .eq('id', ngoId)
        .select()
        .single()
    );
  }

  async getProjects(ngoId: string): Promise<ApiResponse<any[]>> {
    return wrapApiCall(
      supabase
        .from('projects')
        .select(`
          *,
          corporate:profiles!corporate_id(id, display_name, organization_name)
        `)
        .eq('ngo_id', ngoId)
        .order('created_at', { ascending: false })
    );
  }

  async getStats(ngoId: string): Promise<ApiResponse<any>> {
    const [projectsRes, volunteersRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, status, beneficiaries_count, volunteer_count')
        .eq('ngo_id', ngoId),
      supabase
        .from('volunteer_applications')
        .select('id')
        .eq('ngo_id', ngoId),
    ]);

    const projects = projectsRes.data || [];
    const volunteers = volunteersRes.data || [];

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p: any) => p.status === 'active').length,
      completedProjects: projects.filter((p: any) => p.status === 'completed').length,
      totalBeneficiaries: projects.reduce((sum: number, p: any) => sum + (p.beneficiaries_count || 0), 0),
      totalVolunteers: volunteers.length,
    };

    return { success: true, data: stats };
  }

  /**
   * Export NGOs data for CSV/Excel export
   * Fetches all NGOs matching filters without pagination for export purposes
   */
  async exportData(filters: NGOFilters = {}): Promise<ApiResponse<NGO[]>> {
    let query = supabase
      .from('organizations')
      .select('*');

    // Apply the same filters as list()
    if (filters.verification_status && filters.verification_status.length > 0) {
      query = query.in('verification_status', filters.verification_status);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.province) {
      query = query.eq('province', filters.province);
    }

    if (filters.focus_areas && filters.focus_areas.length > 0) {
      query = query.overlaps('focus_areas', filters.focus_areas);
    }

    if (filters.sdg_alignment && filters.sdg_alignment.length > 0) {
      query = query.overlaps('sdg_alignment', filters.sdg_alignment);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Limit to reasonable export size (max 10,000 records)
    query = query.limit(10000);

    return wrapApiCall(query);
  }
}

export const ngosApi = new NGOsApi();
