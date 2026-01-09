// Volunteer Dashboard Types
// This file contains all type definitions for the Volunteer experience

// ============================================================================
// USER & STATS TYPES
// ============================================================================

export type UserStats = {
  points: number;
  pointsTrend: string; // e.g., "+120 this month"
  badges: Badge[];
  hoursYTD: number;
  projectsCompleted: number;
};

export type Badge = {
  id: string;
  name: string;
  iconUrl?: string;
  description: string;
  earnedAt?: string; // ISO timestamp
};

// ============================================================================
// OPPORTUNITY TYPES
// ============================================================================

export type ApplicationStatus = 
  | 'not_applied' 
  | 'applied' 
  | 'under_review' 
  | 'selected' 
  | 'rejected' 
  | 'withdrawn';

export type SDG = {
  id: string;
  label: string;
  iconUrl?: string;
  color?: string; // hex color for badge
};

export type OpportunityBase = {
  id: string;
  title: string;
  orgName: string;
  orgLogoUrl?: string;
  location?: string;
  sdgs: SDG[];
  summary: string;
  dateStarts?: string; // ISO timestamp
  timeCommitment?: string; // "4 hours/week", "One-day event"
  totalVolunteers?: number;
  imageUrl?: string;
  category?: string; // education, health, environment, etc.
};

export type OpportunityWithStatus = OpportunityBase & {
  appliedStatus: ApplicationStatus;
  appliedDate?: string; // ISO timestamp
};

export type DiscoverOpportunity = OpportunityBase & {
  appliedStatus?: ApplicationStatus;
};

// ============================================================================
// PROJECT TYPES
// ============================================================================

export type UserProject = {
  id: string;
  title: string;
  organizationName: string;
  location?: string;
  startDate: string; // ISO date
  endDate?: string; // ISO date
  progress: number; // 0-100
  sdgs?: SDG[];
  hoursContributed?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  imageUrl?: string;
  status?: 'active' | 'completed' | 'paused';
};

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export type Certificate = {
  id: string;
  projectName: string;
  hours: number;
  issuedDate: string; // ISO date
  downloadUrl: string;
  language?: 'en' | 'ur';
  organizationName?: string;
  certificateNumber?: string;
  skills?: string[]; // Skills gained from the project
};

// ============================================================================
// APPLICATION TYPES
// ============================================================================

export type ApplicationPayload = {
  userId: string;
  opportunityId: string;
  why: string; // Why applying (min 30 chars)
  availability: string; // When available
  resumeUrl?: string; // Optional uploaded file URL
  extraNotes?: string; // Optional additional notes
  createdAt?: string; // ISO timestamp
};

export type Application = ApplicationPayload & {
  id: string;
  status: ApplicationStatus;
  updatedAt: string; // ISO timestamp
  reviewedBy?: string; // Admin/NGO user ID
  reviewNotes?: string;
};

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export type FilterOption = {
  value: string;
  label: string;
  count?: number; // Number of opportunities matching this filter
};

export type FilterOptions = {
  categories: FilterOption[];
  locations: FilterOption[];
  sdgs: SDG[];
  dateRanges: FilterOption[];
};

export type ActiveFilters = {
  search?: string;
  category?: string;
  location?: string;
  sdgs?: string[]; // Array of SDG IDs
  dateRange?: string;
};

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export type PaginationCursor = {
  cursor?: string; // Opaque cursor for next page
  hasMore: boolean;
  total?: number; // Total count if available
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationCursor;
};

// ============================================================================
// TAB TYPES
// ============================================================================

export type VolunteerTabType = 
  | 'my-opportunities' 
  | 'discover' 
  | 'saved' 
  | 'projects' 
  | 'certificates' 
  | 'profile';

// ============================================================================
// ANALYTICS EVENT TYPES
// ============================================================================

export type AnalyticsEventName =
  | 'discover_view'
  | 'filter_applied'
  | 'opportunity_click'
  | 'apply_start'
  | 'apply_submit_success'
  | 'apply_submit_failure'
  | 'auth_gate_show'
  | 'auth_gate_login_click'
  | 'auth_gate_signup_click'
  | 'opportunity_save'
  | 'opportunity_unsave'
  | 'certificate_download'
  | 'project_view';

export type AnalyticsEvent = {
  event: AnalyticsEventName;
  properties?: Record<string, any>;
  timestamp?: string;
};

// ============================================================================
// SUPABASE SCHEMA TYPES
// These types mirror the expected Supabase database schema
// ============================================================================

/**
 * SUPABASE TABLE: opportunities
 * 
 * CREATE TABLE opportunities (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   title TEXT NOT NULL,
 *   org_id UUID REFERENCES organizations(id),
 *   summary TEXT,
 *   description TEXT,
 *   sdg_ids TEXT[], -- Array of SDG identifiers
 *   location TEXT,
 *   city TEXT,
 *   province TEXT,
 *   start_date TIMESTAMPTZ,
 *   end_date TIMESTAMPTZ,
 *   time_commitment TEXT,
 *   volunteer_capacity INTEGER,
 *   volunteers_enrolled INTEGER DEFAULT 0,
 *   image_url TEXT,
 *   category TEXT,
 *   status TEXT DEFAULT 'open', -- open | closed | filled
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export type SupabaseOpportunity = {
  id: string;
  title: string;
  org_id: string;
  summary: string;
  description?: string;
  sdg_ids: string[];
  location?: string;
  city?: string;
  province?: string;
  start_date?: string;
  end_date?: string;
  time_commitment?: string;
  volunteer_capacity?: number;
  volunteers_enrolled?: number;
  image_url?: string;
  category?: string;
  status: 'open' | 'closed' | 'filled';
  created_at: string;
  updated_at: string;
};

/**
 * SUPABASE TABLE: applications
 * 
 * CREATE TABLE applications (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   why TEXT NOT NULL,
 *   availability TEXT NOT NULL,
 *   resume_url TEXT,
 *   extra_notes TEXT,
 *   status TEXT DEFAULT 'submitted', -- submitted | reviewing | accepted | rejected | withdrawn
 *   reviewed_by UUID REFERENCES auth.users(id),
 *   review_notes TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(opportunity_id, user_id)
 * );
 * 
 * CREATE INDEX idx_applications_user ON applications(user_id);
 * CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
 * CREATE INDEX idx_applications_status ON applications(status);
 */
export type SupabaseApplication = {
  id: string;
  opportunity_id: string;
  user_id: string;
  why: string;
  availability: string;
  resume_url?: string;
  extra_notes?: string;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  reviewed_by?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
};

/**
 * SUPABASE TABLE: certificates
 * 
 * CREATE TABLE certificates (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   project_id UUID REFERENCES projects(id),
 *   project_name TEXT NOT NULL,
 *   organization_name TEXT NOT NULL,
 *   hours NUMERIC NOT NULL,
 *   skills TEXT[], -- Array of skills gained
 *   certificate_number TEXT UNIQUE,
 *   pdf_url TEXT NOT NULL,
 *   language TEXT DEFAULT 'en', -- en | ur
 *   issued_at TIMESTAMPTZ DEFAULT NOW(),
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_certificates_user ON certificates(user_id);
 * CREATE INDEX idx_certificates_project ON certificates(project_id);
 */
export type SupabaseCertificate = {
  id: string;
  user_id: string;
  project_id?: string;
  project_name: string;
  organization_name: string;
  hours: number;
  skills?: string[];
  certificate_number?: string;
  pdf_url: string;
  language: 'en' | 'ur';
  issued_at: string;
  created_at: string;
};

/**
 * SUPABASE TABLE: users (extends auth.users)
 * 
 * Additional fields in public.profiles table:
 * 
 * CREATE TABLE profiles (
 *   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 *   full_name TEXT,
 *   avatar_url TEXT,
 *   city TEXT,
 *   province TEXT,
 *   phone TEXT,
 *   points INTEGER DEFAULT 0,
 *   badges JSONB DEFAULT '[]'::jsonb, -- Array of badge objects
 *   hours_ytd INTEGER DEFAULT 0,
 *   projects_completed INTEGER DEFAULT 0,
 *   interests TEXT[], -- Array of interest categories
 *   preferred_location TEXT,
 *   email_notifications BOOLEAN DEFAULT TRUE,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export type SupabaseUserProfile = {
  id: string;
  full_name?: string;
  avatar_url?: string;
  city?: string;
  province?: string;
  phone?: string;
  points: number;
  badges: Badge[];
  hours_ytd: number;
  projects_completed: number;
  interests?: string[];
  preferred_location?: string;
  email_notifications: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * SUPABASE TABLE: saved_opportunities
 * 
 * CREATE TABLE saved_opportunities (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *   opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   UNIQUE(user_id, opportunity_id)
 * );
 * 
 * CREATE INDEX idx_saved_opportunities_user ON saved_opportunities(user_id);
 */
export type SupabaseSavedOpportunity = {
  id: string;
  user_id: string;
  opportunity_id: string;
  created_at: string;
};
