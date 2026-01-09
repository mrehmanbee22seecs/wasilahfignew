/**
 * Volunteer Verification & Hours Tracking Types
 */

export interface BackgroundCheck {
  id: string;
  volunteerId: string;
  volunteerName: string;
  status: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected' | 'expired';
  checkType: 'basic' | 'enhanced' | 'police_clearance';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  expiresAt?: string;
  documents: BackgroundCheckDocument[];
  notes?: string;
  rejectionReason?: string;
}

export interface BackgroundCheckDocument {
  id: string;
  type: 'cnic' | 'police_certificate' | 'character_certificate' | 'education_certificate' | 'reference_letter' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export interface VolunteerHoursSession {
  id: string;
  volunteerId: string;
  volunteerName: string;
  projectId: string;
  projectName: string;
  ngoId: string;
  ngoName: string;
  checkInTime: string;
  checkInLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  checkInPhoto?: string;
  checkOutTime?: string;
  checkOutLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  checkOutPhoto?: string;
  totalHours?: number;
  status: 'checked_in' | 'checked_out' | 'verified' | 'disputed';
  taskDescription?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  disputeReason?: string;
  notes?: string;
}

export interface VolunteerHoursSummary {
  volunteerId: string;
  totalHours: number;
  verifiedHours: number;
  pendingHours: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
  byProject: {
    projectId: string;
    projectName: string;
    hours: number;
  }[];
  byMonth: {
    month: string;
    hours: number;
  }[];
}

export interface CheckInRequest {
  projectId: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  photo?: string;
  taskDescription?: string;
}

export interface CheckOutRequest {
  sessionId: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  photo?: string;
  notes?: string;
}

export interface BackgroundCheckRequirement {
  checkType: BackgroundCheck['checkType'];
  required: boolean;
  description: string;
  validityPeriod: number; // in days
  documents: {
    type: BackgroundCheckDocument['type'];
    required: boolean;
    label: string;
    description: string;
    acceptedFormats: string[];
    maxSizeBytes: number;
  }[];
}
