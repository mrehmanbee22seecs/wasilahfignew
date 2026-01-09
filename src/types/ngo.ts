// NGO Dashboard TypeScript Types
// Based on Supabase schema for NGO management platform

export type VerificationStatus = 'unverified' | 'pending' | 'in_progress' | 'verified' | 'rejected';
export type DocumentStatus = 'uploaded' | 'under_review' | 'accepted' | 'rejected' | 'expired';
export type VettingAction = 'submit' | 'approve' | 'reject' | 'comment' | 'site_visit';

export interface NGO {
  id: string;
  name: string;
  slug: string;
  mission: string;
  website?: string;
  primary_contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street?: string;
    city: string;
    province: string;
    country: string;
    postal_code?: string;
  };
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface NGODocument {
  id: string;
  ngo_id: string;
  type: DocumentType;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number; // in bytes
  uploaded_by: string; // user id
  uploaded_at: string;
  issued_at?: string;
  expiry_date?: string;
  status: DocumentStatus;
  notes?: string;
  thumbnail_url?: string;
}

export type DocumentType =
  | 'registration_certificate'
  | 'ntn_tax'
  | 'audited_financials'
  | 'bank_verification'
  | 'safeguarding_policy'
  | 'health_safety_sop'
  | 'project_reports'
  | 'other';

export interface DocumentChecklistItem {
  type: DocumentType;
  label: string;
  description: string;
  required: boolean;
  status: 'missing' | 'uploaded' | 'under_review' | 'accepted' | 'expired';
  documents?: NGODocument[];
}

export interface VettingRequest {
  id: string;
  ngo_id: string;
  requested_by: string;
  status: VerificationStatus;
  created_at: string;
  updated_at: string;
  notes?: string;
  assigned_to?: string; // Wasilah ops user
  site_visit_date?: string;
  completed_at?: string;
}

export interface VettingAudit {
  id: string;
  vetting_request_id: string;
  action: VettingAction;
  user_id: string;
  user_name: string;
  user_role: 'ngo_admin' | 'wasilah_ops' | 'system';
  note?: string;
  created_at: string;
}

export interface NGOProject {
  id: string;
  ngo_id: string;
  title: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  start_date: string;
  end_date: string;
  progress: number; // 0-100
  budget: number;
  volunteers_count: number;
  location: {
    city: string;
    province: string;
  };
  thumbnail_url?: string;
}

export interface DashboardStats {
  activeProjects: number;
  volunteers: number;
  lastVettingScore?: number;
  avgResponseTime?: number; // in days
}

export interface ScorecardCategory {
  label: string;
  weight: number; // percentage
  score: number; // 0-100
  details: string[];
  evidence_doc_ids?: string[];
}

export interface NGOScorecard {
  overall_score: number; // 0-100
  breakdown: ScorecardCategory[];
  last_updated: string;
  notes?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'document_uploaded' | 'vetting_status_change' | 'project_update' | 'message_received' | 'profile_updated' | 'verification_requested';
  title: string;
  description: string;
  timestamp: string;
  user_name?: string;
  metadata?: Record<string, any>;
}

export interface RecentUpload {
  id: string;
  filename: string;
  thumbnail_url?: string;
  uploaded_at: string;
  type: DocumentType;
}

export interface NGODashboardData {
  ngo: NGO;
  stats: DashboardStats;
  documents: NGODocument[];
  vetting: {
    status: VerificationStatus;
    last_request?: VettingRequest;
    timeline: VettingAudit[];
  };
  recent_uploads: RecentUpload[];
  projects: NGOProject[];
  activity_feed: ActivityFeedItem[];
  scorecard?: NGOScorecard;
}

// Component Props Interfaces

export interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DocumentUploaderProps {
  ngoId: string;
  acceptedTypes?: string[];
  maxSizeMb?: number;
  onUploadComplete?: (doc: NGODocument) => void;
  onUploadError?: (error: Error) => void;
}

export interface ScorecardViewerProps {
  score: number;
  breakdown: ScorecardCategory[];
  lastUpdated: string;
  notes?: string;
  onRequestReview?: () => void;
}

export interface VerificationTimelineProps {
  timeline: VettingAudit[];
  currentStatus: VerificationStatus;
}

export interface TimelineStepperProps {
  currentStep: number;
  steps: Array<{
    label: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
}

// Upload state management
export interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'queued';
  error?: string;
  uploadedDoc?: NGODocument;
}