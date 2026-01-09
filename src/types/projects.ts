// Project Types & Data Contracts for Supabase Integration

export type ProjectStatus = 'draft' | 'pending' | 'active' | 'completed' | 'archived';
export type DeliveryMode = 'on-ground' | 'remote' | 'hybrid';
export type ProjectType = 'education' | 'health' | 'environment' | 'other';
export type MediaType = 'image' | 'document' | 'video';

export interface Location {
  country: string;
  city: string;
  address?: string;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  notes?: string;
}

export interface Approver {
  name: string;
  email: string;
}

export interface Media {
  id: string;
  project_id: string;
  company_id: string;
  type: MediaType;
  storage_path: string;
  thumbnail?: string;
  meta?: Record<string, any>;
  uploaded_by: string;
  created_at: string;
}

export interface Project {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  short_description: string;
  sdgs: string[]; // SDG IDs like ['4', '6', '11']
  type: ProjectType;
  location: Location;
  start_date: string;
  end_date: string;
  volunteer_target: number;
  delivery_mode: DeliveryMode;
  budget: number;
  budget_breakdown: BudgetBreakdown[];
  approvers?: Approver[];
  media_ids: string[];
  documents_ids: string[];
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  company_id: string;
  title: string;
  slug: string;
  short_description: string;
  sdgs: string[];
  type: ProjectType;
  location: Location;
  start_date: string;
  end_date: string;
  volunteer_target: number;
  delivery_mode: DeliveryMode;
  budget: number;
  budget_breakdown: BudgetBreakdown[];
  approvers?: Approver[];
  media_ids?: string[];
  documents_ids?: string[];
  status?: ProjectStatus;
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus[];
  sdgs?: string[];
  location?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface PaginationParams {
  limit: number;
  startAfter?: string;
}

// React Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (companyId: string, filters: ProjectFilters) => 
    [...projectKeys.lists(), companyId, filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  kpis: (companyId: string) => [...projectKeys.all, 'kpis', companyId] as const,
};

// SDG Master List
export const SDG_LIST = [
  { id: '1', name: 'No Poverty', color: '#E5243B' },
  { id: '2', name: 'Zero Hunger', color: '#DDA63A' },
  { id: '3', name: 'Good Health and Well-being', color: '#4C9F38' },
  { id: '4', name: 'Quality Education', color: '#C5192D' },
  { id: '5', name: 'Gender Equality', color: '#FF3A21' },
  { id: '6', name: 'Clean Water and Sanitation', color: '#26BDE2' },
  { id: '7', name: 'Affordable and Clean Energy', color: '#FCC30B' },
  { id: '8', name: 'Decent Work and Economic Growth', color: '#A21942' },
  { id: '9', name: 'Industry, Innovation and Infrastructure', color: '#FD6925' },
  { id: '10', name: 'Reduced Inequality', color: '#DD1367' },
  { id: '11', name: 'Sustainable Cities and Communities', color: '#FD9D24' },
  { id: '12', name: 'Responsible Consumption and Production', color: '#BF8B2E' },
  { id: '13', name: 'Climate Action', color: '#3F7E44' },
  { id: '14', name: 'Life Below Water', color: '#0A97D9' },
  { id: '15', name: 'Life on Land', color: '#56C02B' },
  { id: '16', name: 'Peace and Justice Strong Institutions', color: '#00689D' },
  { id: '17', name: 'Partnerships to achieve the Goal', color: '#19486A' },
];
