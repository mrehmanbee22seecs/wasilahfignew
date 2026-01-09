// NGO Projects Page TypeScript Types
// Frontend-only definitions ready for Supabase integration

export type ProjectStatus = 'active' | 'completed' | 'pending_review' | 'on_hold';
export type TaskStatus = 'pending' | 'completed' | 'blocked';
export type ReportType = 'draft' | 'final';
export type ReportStatus = 'under_review' | 'approved' | 'revision_requested';
export type MediaType = 'image' | 'video' | 'document';

export interface NGOAssignedProject {
  id: string;
  title: string;
  description: string;
  corporate_partner: {
    id: string;
    name: string;
    logo_url?: string;
  };
  ngo_id: string;
  status: ProjectStatus;
  progress: number; // 0-100
  start_date: string;
  end_date: string;
  last_update: string;
  location: {
    city: string;
    province: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  budget_allocated: number;
  tasks_total: number;
  tasks_completed: number;
  updates_count: number;
  beneficiaries_target: number;
  beneficiaries_reached: number;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  evidence_required: boolean;
  evidence_count?: number;
  order: number;
  completed_at?: string;
  blocked_reason?: string;
  assigned_to?: string;
}

export interface MediaItem {
  id: string;
  project_id: string;
  update_id?: string;
  task_id?: string;
  type: MediaType;
  filename: string;
  storage_path: string;
  mime_type: string;
  size: number;
  uploaded_at: string;
  uploaded_by: string;
  thumbnail_url?: string;
  metadata: {
    timestamp: string;
    location?: {
      city?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    device?: string;
    caption?: string;
  };
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  ngo_id: string;
  submitted_by: string;
  submitted_at: string;
  tasks_completed: string[]; // task IDs
  report_text: string;
  beneficiaries_count?: number;
  on_ground_notes?: string;
  media_items: MediaItem[];
  challenges?: string;
  immediate_outcomes?: string;
  status: 'submitted' | 'under_review' | 'approved';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

export interface ProjectReport {
  id: string;
  project_id: string;
  project_title: string;
  type: ReportType;
  status: ReportStatus;
  period_start: string;
  period_end: string;
  generated_at: string;
  generated_by: string;
  file_url: string;
  file_url_docx?: string;
  file_size: number;
  summary: {
    tasks_completed: number;
    beneficiaries_reached: number;
    updates_included: number;
    media_count: number;
  };
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
}

// Component Props

export interface ProjectCardProps {
  project: NGOAssignedProject;
  onSubmitUpdate: (projectId: string) => void;
  onViewDetails: (projectId: string) => void;
}

export interface TaskChecklistItemProps {
  task: ProjectTask;
  onToggle: (taskId: string, completed: boolean) => void;
  onViewEvidence?: (taskId: string) => void;
  disabled?: boolean;
}

export interface MediaUploaderProps {
  projectId: string;
  onUploadComplete: (media: MediaItem) => void;
  onUploadError?: (error: Error) => void;
  maxSizeMb?: number;
  allowedTypes?: MediaType[];
  requireTaskLink?: boolean;
}

export interface SubmitUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: NGOAssignedProject;
  onSubmit: (update: Partial<ProjectUpdate>) => Promise<void>;
}

export interface ReportRowProps {
  report: ProjectReport;
  onDownload: (reportId: string, format: 'pdf' | 'docx') => void;
}

// Form State for Submit Update Modal

export interface UpdateFormState {
  currentStep: number;
  tasksCompleted: string[];
  mediaItems: MediaItem[];
  reportText: string;
  beneficiariesCount?: number;
  onGroundNotes?: string;
  challenges?: string;
  immediateOutcomes?: string;
  confirmed: boolean;
}

export const INITIAL_UPDATE_FORM_STATE: UpdateFormState = {
  currentStep: 1,
  tasksCompleted: [],
  mediaItems: [],
  reportText: '',
  confirmed: false
};

// API Response Types (for documentation)

export interface ProjectsListResponse {
  projects: NGOAssignedProject[];
  total: number;
  active_count: number;
  completed_count: number;
}

export interface ProjectDetailsResponse {
  project: NGOAssignedProject;
  tasks: ProjectTask[];
  recent_updates: ProjectUpdate[];
  reports: ProjectReport[];
}

export interface SubmitUpdateRequest {
  project_id: string;
  tasks_completed: string[];
  media_items: string[]; // media IDs
  report_text: string;
  beneficiaries_count?: number;
  on_ground_notes?: string;
  challenges?: string;
  immediate_outcomes?: string;
}

export interface SubmitUpdateResponse {
  update: ProjectUpdate;
  project: NGOAssignedProject; // updated project with new progress
}
