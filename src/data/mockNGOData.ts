import type {
  NGO,
  NGODocument,
  VettingRequest,
  VettingAudit,
  NGOProject,
  DashboardStats,
  NGOScorecard,
  ActivityFeedItem,
  RecentUpload,
  NGODashboardData,
  DocumentChecklistItem
} from '../types/ngo';

// Mock NGO Organization
export const MOCK_NGO: NGO = {
  id: 'ngo_green_future_001',
  name: 'Green Future Pakistan',
  slug: 'green-future-pakistan',
  mission: 'Empowering communities through environmental education and sustainable development initiatives across Pakistan.',
  website: 'https://www.greenfuturepk.org',
  primary_contact: {
    name: 'Dr. Fatima Malik',
    email: 'fatima.malik@greenfuturepk.org',
    phone: '+92-300-1234567'
  },
  address: {
    street: 'House 23, Street 12, F-7/2',
    city: 'Islamabad',
    province: 'Islamabad Capital Territory',
    country: 'Pakistan',
    postal_code: '44000'
  },
  social_links: {
    facebook: 'https://facebook.com/greenfuturepk',
    twitter: 'https://twitter.com/greenfuturepk',
    linkedin: 'https://linkedin.com/company/greenfuturepk',
    instagram: 'https://instagram.com/greenfuturepk'
  },
  logo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
  created_at: '2024-03-15T10:30:00Z',
  updated_at: '2025-12-10T14:22:00Z'
};

// Mock Documents
export const MOCK_DOCUMENTS: NGODocument[] = [
  {
    id: 'doc_001',
    ngo_id: 'ngo_green_future_001',
    type: 'registration_certificate',
    filename: 'GreenFuture_SECP_Registration.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/registration.pdf',
    mime_type: 'application/pdf',
    size: 2458624,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-11-10T09:15:00Z',
    issued_at: '2024-03-01',
    status: 'accepted',
    notes: 'SECP registration certificate - valid',
    thumbnail_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=150&h=150&fit=crop'
  },
  {
    id: 'doc_002',
    ngo_id: 'ngo_green_future_001',
    type: 'ntn_tax',
    filename: 'NTN_Certificate_2024.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/ntn.pdf',
    mime_type: 'application/pdf',
    size: 1245678,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-11-10T09:20:00Z',
    issued_at: '2024-04-15',
    status: 'accepted',
    thumbnail_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=150&h=150&fit=crop'
  },
  {
    id: 'doc_003',
    ngo_id: 'ngo_green_future_001',
    type: 'audited_financials',
    filename: 'Audited_Financials_2024.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/financials_2024.pdf',
    mime_type: 'application/pdf',
    size: 4567890,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-11-12T14:30:00Z',
    issued_at: '2024-12-31',
    expiry_date: '2025-12-31',
    status: 'accepted',
    notes: 'Audited by Khan & Associates',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150&h=150&fit=crop'
  },
  {
    id: 'doc_004',
    ngo_id: 'ngo_green_future_001',
    type: 'bank_verification',
    filename: 'Bank_Account_Letter.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/bank.pdf',
    mime_type: 'application/pdf',
    size: 876543,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-11-15T11:00:00Z',
    issued_at: '2025-11-01',
    status: 'under_review',
    thumbnail_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=150&h=150&fit=crop'
  },
  {
    id: 'doc_005',
    ngo_id: 'ngo_green_future_001',
    type: 'safeguarding_policy',
    filename: 'Child_Safeguarding_Policy_2025.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/safeguarding.pdf',
    mime_type: 'application/pdf',
    size: 1987654,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-12-01T10:00:00Z',
    issued_at: '2025-01-01',
    expiry_date: '2026-12-31',
    status: 'accepted',
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=150&h=150&fit=crop'
  },
  {
    id: 'doc_006',
    ngo_id: 'ngo_green_future_001',
    type: 'project_reports',
    filename: 'Tree_Plantation_Drive_2024_Report.pdf',
    storage_path: 'ngos/ngo_green_future_001/docs/tree_report.pdf',
    mime_type: 'application/pdf',
    size: 3456789,
    uploaded_by: 'user_fatima',
    uploaded_at: '2025-12-05T16:20:00Z',
    issued_at: '2024-10-30',
    status: 'accepted',
    notes: 'Complete project report with photos and impact metrics',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop'
  }
];

// Mock Vetting Request
export const MOCK_VETTING_REQUEST: VettingRequest = {
  id: 'vetting_req_001',
  ngo_id: 'ngo_green_future_001',
  requested_by: 'user_fatima',
  status: 'in_progress',
  created_at: '2025-12-08T09:00:00Z',
  updated_at: '2025-12-12T15:30:00Z',
  notes: 'Initial vetting request submitted with all required documents',
  assigned_to: 'wasilah_ops_ahmed',
  site_visit_date: '2025-12-18T10:00:00Z'
};

// Mock Vetting Timeline/Audits
export const MOCK_VETTING_TIMELINE: VettingAudit[] = [
  {
    id: 'audit_001',
    vetting_request_id: 'vetting_req_001',
    action: 'submit',
    user_id: 'user_fatima',
    user_name: 'Dr. Fatima Malik',
    user_role: 'ngo_admin',
    note: 'Submitted verification request with all required documents including SECP registration, NTN certificate, audited financials (FY 2024), bank verification letter from MCB Bank, safeguarding policy, and project reports from previous initiatives.',
    created_at: '2025-12-08T09:00:00Z'
  },
  {
    id: 'audit_002',
    vetting_request_id: 'vetting_req_001',
    action: 'comment',
    user_id: 'wasilah_ops_ahmed',
    user_name: 'Ahmed Hassan',
    user_role: 'wasilah_ops',
    note: 'Documents received and under initial review. Bank verification document needs additional official bank stamp and branch manager signature. Please also provide contact details for your previous corporate partners (Al-Khidmat Foundation and Engro Foundation) for reference verification.',
    created_at: '2025-12-09T14:20:00Z'
  },
  {
    id: 'audit_003',
    vetting_request_id: 'vetting_req_001',
    action: 'comment',
    user_id: 'user_fatima',
    user_name: 'Dr. Fatima Malik',
    user_role: 'ngo_admin',
    note: 'Updated bank verification document with official bank stamp and branch manager signature from MCB F-7 Branch. Also shared contact details for reference verification: Mr. Asim Khan (Al-Khidmat, asim.khan@alkhidmat.org) and Ms. Sara Ahmed (Engro Foundation, sara.ahmed@engro.com).',
    created_at: '2025-12-10T11:15:00Z'
  },
  {
    id: 'audit_004',
    vetting_request_id: 'vetting_req_001',
    action: 'comment',
    user_id: 'wasilah_ops_ahmed',
    user_name: 'Ahmed Hassan',
    user_role: 'wasilah_ops',
    note: 'Reference verification completed successfully. Both references provided positive feedback on project delivery and financial management. Moving forward with site visit scheduling.',
    created_at: '2025-12-11T16:45:00Z'
  },
  {
    id: 'audit_005',
    vetting_request_id: 'vetting_req_001',
    action: 'site_visit',
    user_id: 'wasilah_ops_ahmed',
    user_name: 'Ahmed Hassan',
    user_role: 'wasilah_ops',
    note: 'Site visit scheduled for December 18, 2025 at 10:00 AM at your registered office (House 23, Street 12, F-7/2, Islamabad). Our team will verify physical infrastructure, staff capacity, project documentation systems, and safeguarding procedures. Please have all original documents ready for verification.',
    created_at: '2025-12-12T15:30:00Z'
  }
];

// Mock Projects
export const MOCK_PROJECTS: NGOProject[] = [
  {
    id: 'proj_001',
    ngo_id: 'ngo_green_future_001',
    title: 'Urban Tree Plantation Drive - Islamabad',
    status: 'active',
    start_date: '2025-11-01',
    end_date: '2026-03-31',
    progress: 45,
    budget: 500000,
    volunteers_count: 28,
    location: {
      city: 'Islamabad',
      province: 'Islamabad Capital Territory'
    },
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=250&fit=crop'
  },
  {
    id: 'proj_002',
    ngo_id: 'ngo_green_future_001',
    title: 'Clean Water Access - Rural Sindh',
    status: 'active',
    start_date: '2025-10-15',
    end_date: '2026-06-30',
    progress: 62,
    budget: 1200000,
    volunteers_count: 15,
    location: {
      city: 'Tharparkar',
      province: 'Sindh'
    },
    thumbnail_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop'
  },
  {
    id: 'proj_003',
    ngo_id: 'ngo_green_future_001',
    title: 'Environmental Education Program - Schools',
    status: 'active',
    start_date: '2025-09-01',
    end_date: '2026-05-31',
    progress: 78,
    budget: 350000,
    volunteers_count: 12,
    location: {
      city: 'Karachi',
      province: 'Sindh'
    },
    thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop'
  }
];

// Mock Dashboard Stats
export const MOCK_STATS: DashboardStats = {
  activeProjects: 3,
  volunteers: 55,
  lastVettingScore: 78,
  avgResponseTime: 2.5
};

// Mock Scorecard
export const MOCK_SCORECARD: NGOScorecard = {
  overall_score: 78,
  breakdown: [
    {
      label: 'Legal Compliance',
      weight: 20,
      score: 90,
      details: [
        'Valid SECP registration',
        'NTN certificate on file',
        'All legal documents current'
      ],
      evidence_doc_ids: ['doc_001', 'doc_002']
    },
    {
      label: 'Financial Transparency',
      weight: 20,
      score: 85,
      details: [
        'Audited financials provided',
        'Bank account verified',
        'Clear financial reporting'
      ],
      evidence_doc_ids: ['doc_003', 'doc_004']
    },
    {
      label: 'Past Delivery',
      weight: 20,
      score: 75,
      details: [
        '2 completed projects documented',
        'Positive impact metrics',
        'Community feedback available'
      ],
      evidence_doc_ids: ['doc_006']
    },
    {
      label: 'Safeguarding',
      weight: 15,
      score: 80,
      details: [
        'Child protection policy in place',
        'Staff background checks completed',
        'Incident reporting system established'
      ],
      evidence_doc_ids: ['doc_005']
    },
    {
      label: 'Organizational Capacity',
      weight: 15,
      score: 70,
      details: [
        'Qualified team members',
        'Operational procedures documented',
        'Some capacity gaps identified'
      ]
    },
    {
      label: 'Media & Trust Signals',
      weight: 10,
      score: 65,
      details: [
        'Active social media presence',
        'Website functional',
        'Limited media coverage'
      ]
    }
  ],
  last_updated: '2025-12-12T15:30:00Z',
  notes: 'Overall strong compliance. Recommend increasing media presence and documenting additional completed projects.'
};

// Mock Activity Feed
export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'activity_001',
    type: 'vetting_status_change',
    title: 'Site visit scheduled',
    description: 'Wasilah ops team scheduled site visit for December 18, 2025',
    timestamp: '2025-12-12T15:30:00Z',
    user_name: 'Ahmed Hassan',
    metadata: {
      old_status: 'pending',
      new_status: 'in_progress',
      site_visit_date: '2025-12-18T10:00:00Z'
    }
  },
  {
    id: 'activity_002',
    type: 'document_uploaded',
    title: 'Document uploaded',
    description: 'Bank verification letter updated with official stamp',
    timestamp: '2025-12-10T11:15:00Z',
    user_name: 'Dr. Fatima Malik',
    metadata: {
      document_type: 'bank_verification',
      filename: 'Bank_Account_Letter_Updated.pdf'
    }
  },
  {
    id: 'activity_003',
    type: 'message_received',
    title: 'Message from Wasilah',
    description: 'Bank verification document needs additional stamp',
    timestamp: '2025-12-09T14:20:00Z',
    user_name: 'Ahmed Hassan'
  },
  {
    id: 'activity_004',
    type: 'verification_requested',
    title: 'Verification request submitted',
    description: 'Your verification request has been submitted and is under review',
    timestamp: '2025-12-08T09:00:00Z',
    user_name: 'Dr. Fatima Malik',
    metadata: {
      documents_count: 6
    }
  },
  {
    id: 'activity_005',
    type: 'document_uploaded',
    title: 'Project report uploaded',
    description: 'Tree Plantation Drive 2024 Report uploaded',
    timestamp: '2025-12-05T16:20:00Z',
    user_name: 'Dr. Fatima Malik',
    metadata: {
      document_type: 'project_reports',
      filename: 'Tree_Plantation_Drive_2024_Report.pdf'
    }
  },
  {
    id: 'activity_006',
    type: 'project_update',
    title: 'Project milestone reached',
    description: 'Environmental Education Program reached 75% completion',
    timestamp: '2025-12-03T10:00:00Z',
    metadata: {
      project_name: 'Environmental Education Program',
      progress: 75
    }
  },
  {
    id: 'activity_007',
    type: 'document_uploaded',
    title: 'Safeguarding policy uploaded',
    description: 'Child Safeguarding Policy 2025 uploaded',
    timestamp: '2025-12-01T10:00:00Z',
    user_name: 'Dr. Fatima Malik',
    metadata: {
      document_type: 'safeguarding_policy',
      filename: 'Child_Safeguarding_Policy_2025.pdf'
    }
  },
  {
    id: 'activity_008',
    type: 'vetting_status_change',
    title: 'Profile created',
    description: 'Organization profile created successfully',
    timestamp: '2024-03-15T10:30:00Z',
    user_name: 'Dr. Fatima Malik',
    metadata: {
      old_status: null,
      new_status: 'unverified'
    }
  }
];

// Mock Recent Uploads
export const MOCK_RECENT_UPLOADS: RecentUpload[] = [
  {
    id: 'upload_001',
    filename: 'Tree_Plantation_Photos_Nov2025.jpg',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
    uploaded_at: '2025-12-14T09:30:00Z',
    type: 'project_reports'
  },
  {
    id: 'upload_002',
    filename: 'Water_Project_Update_Dec.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=200&fit=crop',
    uploaded_at: '2025-12-13T14:20:00Z',
    type: 'project_reports'
  },
  {
    id: 'upload_003',
    filename: 'Volunteer_Training_Certificate.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=200&fit=crop',
    uploaded_at: '2025-12-12T11:00:00Z',
    type: 'other'
  },
  {
    id: 'upload_004',
    filename: 'Bank_Statement_Nov2025.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop',
    uploaded_at: '2025-12-10T16:45:00Z',
    type: 'bank_verification'
  }
];

// Document Checklist Configuration
export const DOCUMENT_CHECKLIST: DocumentChecklistItem[] = [
  {
    type: 'registration_certificate',
    label: 'Registration Certificate',
    description: 'SECP / Societies Act / Trust registration document',
    required: true,
    status: 'uploaded'
  },
  {
    type: 'ntn_tax',
    label: 'NTN / Tax Document',
    description: 'National Tax Number certificate',
    required: true,
    status: 'uploaded'
  },
  {
    type: 'audited_financials',
    label: 'Audited Financials',
    description: 'Last 1-2 years audited financial statements',
    required: true,
    status: 'uploaded'
  },
  {
    type: 'bank_verification',
    label: 'Bank Account Verification',
    description: 'Cancelled cheque or bank letter',
    required: true,
    status: 'uploaded'
  },
  {
    type: 'safeguarding_policy',
    label: 'Safeguarding / Child Protection Policy',
    description: 'Child protection and safeguarding procedures',
    required: true,
    status: 'uploaded'
  },
  {
    type: 'health_safety_sop',
    label: 'Health & Safety SOP',
    description: 'Health and safety standard operating procedures',
    required: false,
    status: 'missing'
  },
  {
    type: 'project_reports',
    label: 'Project Reports or References',
    description: 'At least 2 completed project reports or references',
    required: true,
    status: 'uploaded'
  }
];

// Full Dashboard Data
export const MOCK_NGO_DASHBOARD: NGODashboardData = {
  ngo: MOCK_NGO,
  stats: MOCK_STATS,
  documents: MOCK_DOCUMENTS,
  vetting: {
    status: 'in_progress',
    last_request: MOCK_VETTING_REQUEST,
    timeline: MOCK_VETTING_TIMELINE
  },
  recent_uploads: MOCK_RECENT_UPLOADS,
  projects: MOCK_PROJECTS,
  activity_feed: MOCK_ACTIVITY_FEED,
  scorecard: MOCK_SCORECARD
};

// API Response Mocks (for developer handoff)
export const API_MOCKS = {
  getDashboard: {
    endpoint: 'GET /api/ngos/:id/dashboard',
    response: MOCK_NGO_DASHBOARD
  },
  getDocuments: {
    endpoint: 'GET /api/ngos/:id/documents',
    response: MOCK_DOCUMENTS
  },
  uploadDocument: {
    endpoint: 'POST /api/ngos/:id/documents',
    request: {
      file: '<File>',
      type: 'registration_certificate',
      issued_at: '2024-03-01',
      expiry_date: '2029-03-01',
      notes: 'SECP registration'
    },
    response: MOCK_DOCUMENTS[0]
  },
  requestVerification: {
    endpoint: 'POST /api/ngos/:id/vetting_requests',
    request: {
      notes: 'All required documents uploaded and ready for review'
    },
    response: MOCK_VETTING_REQUEST
  }
};

// Export alias for backward compatibility
export const MOCK_DASHBOARD_DATA = MOCK_NGO_DASHBOARD;