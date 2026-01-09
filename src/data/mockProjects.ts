import { Project } from '../types/projects';

export const mockProjects: Project[] = [
  {
    id: 'proj_1',
    company_id: 'comp_123',
    title: 'Clean Karachi Drive 2026',
    slug: 'clean-karachi-drive-2026',
    short_description: 'A community cleanup campaign in Clifton neighborhoods to promote environmental sustainability and civic responsibility.',
    sdgs: ['11', '6', '13'],
    type: 'environment',
    location: {
      country: 'Pakistan',
      city: 'Karachi',
      address: 'Clifton, Karachi'
    },
    start_date: '2026-02-15',
    end_date: '2026-02-20',
    volunteer_target: 120,
    delivery_mode: 'on-ground',
    budget: 250000,
    budget_breakdown: [
      { category: 'Logistics', amount: 100000, notes: 'Transportation and equipment' },
      { category: 'Materials', amount: 100000, notes: 'Cleaning supplies and bags' },
      { category: 'Media', amount: 50000, notes: 'Documentation and outreach' }
    ],
    approvers: [
      { name: 'Ayesha Malik', email: 'ayesha@company.com' }
    ],
    media_ids: ['media_1', 'media_2'],
    documents_ids: ['doc_1'],
    status: 'active',
    created_by: 'user_1',
    created_at: '2025-12-01T10:00:00Z',
    updated_at: '2025-12-01T10:00:00Z'
  },
  {
    id: 'proj_2',
    company_id: 'comp_123',
    title: 'Digital Literacy for Rural Schools',
    slug: 'digital-literacy-rural-schools',
    short_description: 'Providing computer training and digital skills to students in 15 rural schools across Punjab province.',
    sdgs: ['4', '9', '10'],
    type: 'education',
    location: {
      country: 'Pakistan',
      city: 'Lahore',
      address: 'Various rural locations, Punjab'
    },
    start_date: '2026-03-01',
    end_date: '2026-08-31',
    volunteer_target: 80,
    delivery_mode: 'hybrid',
    budget: 1500000,
    budget_breakdown: [
      { category: 'Equipment', amount: 800000, notes: 'Laptops and tablets' },
      { category: 'Training', amount: 400000, notes: 'Trainer fees and materials' },
      { category: 'Internet', amount: 200000, notes: '6-month connectivity' },
      { category: 'Admin', amount: 100000, notes: 'Coordination and logistics' }
    ],
    approvers: [
      { name: 'Ahmed Khan', email: 'ahmed@company.com' },
      { name: 'Sara Iqbal', email: 'sara@company.com' }
    ],
    media_ids: ['media_3'],
    documents_ids: ['doc_2', 'doc_3'],
    status: 'active',
    created_by: 'user_2',
    created_at: '2025-11-15T14:30:00Z',
    updated_at: '2025-12-05T09:15:00Z'
  },
  {
    id: 'proj_3',
    company_id: 'comp_123',
    title: 'Free Medical Camp - Islamabad',
    slug: 'free-medical-camp-islamabad',
    short_description: 'A 3-day free health screening and medical consultation camp in underserved areas of Islamabad.',
    sdgs: ['3', '10'],
    type: 'health',
    location: {
      country: 'Pakistan',
      city: 'Islamabad',
      address: 'F-7 Community Center'
    },
    start_date: '2026-01-20',
    end_date: '2026-01-22',
    volunteer_target: 45,
    delivery_mode: 'on-ground',
    budget: 350000,
    budget_breakdown: [
      { category: 'Medical Staff', amount: 150000, notes: 'Doctors and nurses' },
      { category: 'Medicines', amount: 120000, notes: 'Basic medications and supplies' },
      { category: 'Equipment', amount: 50000, notes: 'Medical devices rental' },
      { category: 'Venue', amount: 30000, notes: 'Community center rental' }
    ],
    approvers: [
      { name: 'Dr. Fatima Noor', email: 'fatima@company.com' }
    ],
    media_ids: [],
    documents_ids: ['doc_4'],
    status: 'pending',
    created_by: 'user_3',
    created_at: '2025-12-10T11:00:00Z',
    updated_at: '2025-12-10T11:00:00Z'
  },
  {
    id: 'proj_4',
    company_id: 'comp_123',
    title: 'Women Empowerment Workshop Series',
    slug: 'women-empowerment-workshop-series',
    short_description: 'Monthly workshops on entrepreneurship, financial literacy, and leadership skills for women in Sindh.',
    sdgs: ['5', '8', '10'],
    type: 'education',
    location: {
      country: 'Pakistan',
      city: 'Karachi',
      address: 'Virtual and On-ground'
    },
    start_date: '2026-04-01',
    end_date: '2026-12-31',
    volunteer_target: 30,
    delivery_mode: 'hybrid',
    budget: 600000,
    budget_breakdown: [
      { category: 'Facilitators', amount: 300000, notes: 'Workshop trainers' },
      { category: 'Materials', amount: 150000, notes: 'Training kits and handouts' },
      { category: 'Venue', amount: 100000, notes: 'Monthly venue rental' },
      { category: 'Tech', amount: 50000, notes: 'Zoom and recording equipment' }
    ],
    media_ids: ['media_4', 'media_5'],
    documents_ids: [],
    status: 'draft',
    created_by: 'user_1',
    created_at: '2025-12-12T16:45:00Z',
    updated_at: '2025-12-13T10:20:00Z'
  },
  {
    id: 'proj_5',
    company_id: 'comp_123',
    title: 'Tree Plantation Initiative - Margalla Hills',
    slug: 'tree-plantation-margalla-hills',
    short_description: 'Planting 5,000 native trees in Margalla Hills to combat deforestation and promote biodiversity.',
    sdgs: ['13', '15'],
    type: 'environment',
    location: {
      country: 'Pakistan',
      city: 'Islamabad',
      address: 'Margalla Hills National Park'
    },
    start_date: '2025-08-15',
    end_date: '2025-09-30',
    volunteer_target: 200,
    delivery_mode: 'on-ground',
    budget: 450000,
    budget_breakdown: [
      { category: 'Saplings', amount: 250000, notes: '5,000 native tree saplings' },
      { category: 'Tools', amount: 100000, notes: 'Planting equipment' },
      { category: 'Logistics', amount: 70000, notes: 'Transport and water' },
      { category: 'Coordination', amount: 30000, notes: 'Forest dept coordination' }
    ],
    approvers: [
      { name: 'Hassan Ali', email: 'hassan@company.com' }
    ],
    media_ids: ['media_6'],
    documents_ids: ['doc_5'],
    status: 'completed',
    created_by: 'user_2',
    created_at: '2025-07-01T09:00:00Z',
    updated_at: '2025-10-05T14:30:00Z'
  },
  {
    id: 'proj_6',
    company_id: 'comp_123',
    title: 'Ramadan Food Distribution Drive',
    slug: 'ramadan-food-distribution-drive',
    short_description: 'Distributing 1,000 food packages to underprivileged families during Ramadan in Peshawar.',
    sdgs: ['1', '2'],
    type: 'other',
    location: {
      country: 'Pakistan',
      city: 'Peshawar',
      address: 'Multiple distribution points'
    },
    start_date: '2026-03-10',
    end_date: '2026-04-10',
    volunteer_target: 60,
    delivery_mode: 'on-ground',
    budget: 800000,
    budget_breakdown: [
      { category: 'Food Items', amount: 600000, notes: 'Rice, flour, oil, lentils' },
      { category: 'Packaging', amount: 100000, notes: 'Bags and labeling' },
      { category: 'Distribution', amount: 80000, notes: 'Transport and manpower' },
      { category: 'Admin', amount: 20000, notes: 'Coordination costs' }
    ],
    media_ids: [],
    documents_ids: [],
    status: 'archived',
    created_by: 'user_3',
    created_at: '2025-02-01T08:00:00Z',
    updated_at: '2025-05-15T17:00:00Z'
  }
];
