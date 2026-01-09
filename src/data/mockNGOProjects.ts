import type {
  NGOAssignedProject,
  ProjectTask,
  MediaItem,
  ProjectUpdate,
  ProjectReport,
  ProjectsListResponse
} from '../types/ngo-projects';

// Mock Assigned Projects
export const MOCK_NGO_PROJECTS: NGOAssignedProject[] = [
  {
    id: 'proj_urban_trees_001',
    title: 'Urban Tree Plantation Drive - F-9 Park',
    description: 'Large-scale tree plantation initiative in Islamabad\'s F-9 Park to combat urban pollution and create green spaces for the community.',
    corporate_partner: {
      id: 'corp_engro_001',
      name: 'Engro Corporation',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop'
    },
    ngo_id: 'ngo_green_future_001',
    status: 'active',
    progress: 65,
    start_date: '2025-11-01',
    end_date: '2026-03-31',
    last_update: '2025-12-10T14:30:00Z',
    location: {
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      coordinates: {
        lat: 33.7077,
        lng: 73.0515
      }
    },
    budget_allocated: 500000,
    tasks_total: 8,
    tasks_completed: 5,
    updates_count: 3,
    beneficiaries_target: 5000,
    beneficiaries_reached: 3200
  },
  {
    id: 'proj_water_access_002',
    title: 'Clean Water Access - Tharparkar Villages',
    description: 'Installation of water filtration systems in 10 villages across Tharparkar district to provide safe drinking water.',
    corporate_partner: {
      id: 'corp_nestle_001',
      name: 'Nestlé Pakistan',
      logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop'
    },
    ngo_id: 'ngo_green_future_001',
    status: 'active',
    progress: 42,
    start_date: '2025-10-15',
    end_date: '2026-06-30',
    last_update: '2025-12-08T11:20:00Z',
    location: {
      city: 'Tharparkar',
      province: 'Sindh',
      coordinates: {
        lat: 24.8616,
        lng: 69.7439
      }
    },
    budget_allocated: 1200000,
    tasks_total: 12,
    tasks_completed: 5,
    updates_count: 2,
    beneficiaries_target: 15000,
    beneficiaries_reached: 6300
  },
  {
    id: 'proj_education_003',
    title: 'Environmental Education in Schools',
    description: 'Comprehensive environmental education program across 25 schools in Karachi, including curriculum development and teacher training.',
    corporate_partner: {
      id: 'corp_unilever_001',
      name: 'Unilever Pakistan',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop'
    },
    ngo_id: 'ngo_green_future_001',
    status: 'active',
    progress: 78,
    start_date: '2025-09-01',
    end_date: '2026-05-31',
    last_update: '2025-12-12T09:15:00Z',
    location: {
      city: 'Karachi',
      province: 'Sindh',
      coordinates: {
        lat: 24.8607,
        lng: 67.0011
      }
    },
    budget_allocated: 350000,
    tasks_total: 10,
    tasks_completed: 8,
    updates_count: 5,
    beneficiaries_target: 7500,
    beneficiaries_reached: 5850
  },
  {
    id: 'proj_waste_management_004',
    title: 'Community Waste Management - Lahore',
    description: 'Pilot waste segregation and recycling program in residential areas of Lahore with community engagement.',
    corporate_partner: {
      id: 'corp_packages_001',
      name: 'Packages Limited',
      logo_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&h=150&fit=crop'
    },
    ngo_id: 'ngo_green_future_001',
    status: 'completed',
    progress: 100,
    start_date: '2025-06-01',
    end_date: '2025-11-30',
    last_update: '2025-11-28T16:45:00Z',
    location: {
      city: 'Lahore',
      province: 'Punjab',
      coordinates: {
        lat: 31.5204,
        lng: 74.3587
      }
    },
    budget_allocated: 280000,
    tasks_total: 6,
    tasks_completed: 6,
    updates_count: 4,
    beneficiaries_target: 3000,
    beneficiaries_reached: 3200
  }
];

// Mock Tasks for Urban Tree Project
export const MOCK_PROJECT_TASKS: ProjectTask[] = [
  {
    id: 'task_001',
    project_id: 'proj_urban_trees_001',
    title: 'Site Survey & Assessment',
    description: 'Complete survey of F-9 Park areas suitable for plantation',
    status: 'completed',
    evidence_required: true,
    evidence_count: 3,
    order: 1,
    completed_at: '2025-11-05T10:00:00Z'
  },
  {
    id: 'task_002',
    project_id: 'proj_urban_trees_001',
    title: 'Procurement of Saplings',
    description: 'Source 500 native tree saplings from approved nurseries',
    status: 'completed',
    evidence_required: true,
    evidence_count: 2,
    order: 2,
    completed_at: '2025-11-10T14:30:00Z'
  },
  {
    id: 'task_003',
    project_id: 'proj_urban_trees_001',
    title: 'Community Mobilization',
    description: 'Organize community sessions to involve local residents',
    status: 'completed',
    evidence_required: true,
    evidence_count: 4,
    order: 3,
    completed_at: '2025-11-15T11:00:00Z'
  },
  {
    id: 'task_004',
    project_id: 'proj_urban_trees_001',
    title: 'First Plantation Drive',
    description: 'Plant 200 saplings in designated areas with volunteers',
    status: 'completed',
    evidence_required: true,
    evidence_count: 8,
    order: 4,
    completed_at: '2025-11-22T09:00:00Z'
  },
  {
    id: 'task_005',
    project_id: 'proj_urban_trees_001',
    title: 'Second Plantation Drive',
    description: 'Plant remaining 300 saplings in northern section',
    status: 'completed',
    evidence_required: true,
    evidence_count: 6,
    order: 5,
    completed_at: '2025-12-01T08:30:00Z'
  },
  {
    id: 'task_006',
    project_id: 'proj_urban_trees_001',
    title: 'Install Watering System',
    description: 'Set up drip irrigation for newly planted trees',
    status: 'pending',
    evidence_required: true,
    evidence_count: 0,
    order: 6
  },
  {
    id: 'task_007',
    project_id: 'proj_urban_trees_001',
    title: 'Training Volunteers',
    description: 'Train community volunteers for ongoing maintenance',
    status: 'pending',
    evidence_required: false,
    evidence_count: 0,
    order: 7
  },
  {
    id: 'task_008',
    project_id: 'proj_urban_trees_001',
    title: 'Final Impact Assessment',
    description: 'Conduct end-of-project impact measurement and documentation',
    status: 'blocked',
    evidence_required: true,
    evidence_count: 0,
    order: 8,
    blocked_reason: 'Dependent on completion of watering system installation'
  }
];

// Mock Media Items
export const MOCK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'media_001',
    project_id: 'proj_urban_trees_001',
    update_id: 'update_003',
    task_id: 'task_004',
    type: 'image',
    filename: 'plantation_drive_volunteers.jpg',
    storage_path: 'projects/proj_urban_trees_001/updates/update_003/plantation_drive_volunteers.jpg',
    mime_type: 'image/jpeg',
    size: 2458624,
    uploaded_at: '2025-11-22T10:30:00Z',
    uploaded_by: 'user_fatima',
    thumbnail_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    metadata: {
      timestamp: '2025-11-22T09:15:00Z',
      location: {
        city: 'Islamabad',
        coordinates: {
          lat: 33.7077,
          lng: 73.0515
        }
      },
      device: 'iPhone 14',
      caption: 'Community volunteers participating in first plantation drive'
    }
  },
  {
    id: 'media_002',
    project_id: 'proj_urban_trees_001',
    update_id: 'update_003',
    task_id: 'task_004',
    type: 'image',
    filename: 'saplings_planted.jpg',
    storage_path: 'projects/proj_urban_trees_001/updates/update_003/saplings_planted.jpg',
    mime_type: 'image/jpeg',
    size: 1987456,
    uploaded_at: '2025-11-22T10:35:00Z',
    uploaded_by: 'user_fatima',
    thumbnail_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
    metadata: {
      timestamp: '2025-11-22T11:45:00Z',
      location: {
        city: 'Islamabad'
      },
      caption: 'Newly planted saplings with support stakes'
    }
  },
  {
    id: 'media_003',
    project_id: 'proj_urban_trees_001',
    update_id: 'update_003',
    task_id: 'task_003',
    type: 'video',
    filename: 'community_session.mp4',
    storage_path: 'projects/proj_urban_trees_001/updates/update_003/community_session.mp4',
    mime_type: 'video/mp4',
    size: 12456789,
    uploaded_at: '2025-11-22T10:40:00Z',
    uploaded_by: 'user_fatima',
    thumbnail_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
    metadata: {
      timestamp: '2025-11-15T10:00:00Z',
      location: {
        city: 'Islamabad'
      },
      caption: 'Community mobilization session at local community center'
    }
  }
];

// Mock Project Updates
export const MOCK_PROJECT_UPDATES: ProjectUpdate[] = [
  {
    id: 'update_003',
    project_id: 'proj_urban_trees_001',
    ngo_id: 'ngo_green_future_001',
    submitted_by: 'user_fatima',
    submitted_at: '2025-11-22T15:00:00Z',
    tasks_completed: ['task_004'],
    report_text: 'Successfully completed first plantation drive with 200 saplings. Over 45 community volunteers participated, including 15 students from local schools. All saplings were planted according to forestry guidelines with proper spacing and support stakes. Weather conditions were favorable. Next drive scheduled for December 1st.',
    beneficiaries_count: 850,
    on_ground_notes: 'Strong community enthusiasm. Local schools requested additional environmental education sessions.',
    challenges: 'Transportation of saplings took longer than expected due to traffic. Resolved by starting earlier next time.',
    immediate_outcomes: '200 trees planted, 45 volunteers trained, increased community awareness about urban forestry',
    media_items: [MOCK_MEDIA_ITEMS[0], MOCK_MEDIA_ITEMS[1], MOCK_MEDIA_ITEMS[2]],
    status: 'approved',
    reviewed_by: 'wasilah_ops_ahmed',
    reviewed_at: '2025-11-23T10:00:00Z',
    review_notes: 'Excellent documentation. Strong community engagement evident.'
  },
  {
    id: 'update_002',
    project_id: 'proj_urban_trees_001',
    ngo_id: 'ngo_green_future_001',
    submitted_by: 'user_fatima',
    submitted_at: '2025-11-15T16:30:00Z',
    tasks_completed: ['task_003'],
    report_text: 'Completed community mobilization with 3 sessions across different neighborhoods. Total of 120 residents attended. Distributed informational materials about the project benefits and volunteer opportunities.',
    beneficiaries_count: 120,
    media_items: [],
    status: 'approved',
    reviewed_by: 'wasilah_ops_ahmed',
    reviewed_at: '2025-11-16T09:00:00Z'
  }
];

// Mock Reports
export const MOCK_PROJECT_REPORTS: ProjectReport[] = [
  {
    id: 'report_001',
    project_id: 'proj_urban_trees_001',
    project_title: 'Urban Tree Plantation Drive - F-9 Park',
    type: 'draft',
    status: 'under_review',
    period_start: '2025-11-01',
    period_end: '2025-11-30',
    generated_at: '2025-12-01T10:00:00Z',
    generated_by: 'system',
    file_url: '/reports/proj_urban_trees_001_draft_nov2025.pdf',
    file_url_docx: '/reports/proj_urban_trees_001_draft_nov2025.docx',
    file_size: 3456789,
    summary: {
      tasks_completed: 5,
      beneficiaries_reached: 970,
      updates_included: 2,
      media_count: 7
    }
  },
  {
    id: 'report_002',
    project_id: 'proj_education_003',
    project_title: 'Environmental Education in Schools',
    type: 'final',
    status: 'approved',
    period_start: '2025-09-01',
    period_end: '2025-10-31',
    generated_at: '2025-11-05T14:00:00Z',
    generated_by: 'system',
    file_url: '/reports/proj_education_003_final_oct2025.pdf',
    file_url_docx: '/reports/proj_education_003_final_oct2025.docx',
    file_size: 5678901,
    summary: {
      tasks_completed: 6,
      beneficiaries_reached: 3200,
      updates_included: 3,
      media_count: 15
    },
    reviewed_by: 'wasilah_ops_ahmed',
    reviewed_at: '2025-11-06T11:00:00Z',
    review_notes: 'Comprehensive documentation. Approved for corporate sharing.'
  },
  {
    id: 'report_003',
    project_id: 'proj_waste_management_004',
    project_title: 'Community Waste Management - Lahore',
    type: 'final',
    status: 'approved',
    period_start: '2025-06-01',
    period_end: '2025-11-30',
    generated_at: '2025-12-02T09:00:00Z',
    generated_by: 'system',
    file_url: '/reports/proj_waste_management_004_final_complete.pdf',
    file_size: 8901234,
    summary: {
      tasks_completed: 6,
      beneficiaries_reached: 3200,
      updates_included: 4,
      media_count: 22
    },
    reviewed_by: 'wasilah_ops_sarah',
    reviewed_at: '2025-12-03T10:30:00Z',
    review_notes: 'Excellent project completion. All deliverables met.'
  }
];

// Mock API Response
export const MOCK_PROJECTS_LIST_RESPONSE: ProjectsListResponse = {
  projects: MOCK_NGO_PROJECTS,
  total: 4,
  active_count: 3,
  completed_count: 1
};

// Export grouped data for easy import
export const NGO_PROJECTS_MOCK_DATA = {
  projects: MOCK_NGO_PROJECTS,
  tasks: MOCK_PROJECT_TASKS,
  media: MOCK_MEDIA_ITEMS,
  updates: MOCK_PROJECT_UPDATES,
  reports: MOCK_PROJECT_REPORTS
};
