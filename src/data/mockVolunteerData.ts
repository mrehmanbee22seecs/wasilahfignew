import type { BackgroundCheck, BackgroundCheckDocument, VolunteerHoursSession, VolunteerHoursSummary, BackgroundCheckRequirement } from '../types/volunteer-verification';

export const BACKGROUND_CHECK_REQUIREMENTS: BackgroundCheckRequirement[] = [
  {
    checkType: 'basic',
    required: true,
    description: 'Basic identity verification required for all volunteers',
    validityPeriod: 365, // 1 year
    documents: [
      {
        type: 'cnic',
        required: true,
        label: 'CNIC (Computerized National Identity Card)',
        description: 'Front and back photos of your valid CNIC',
        acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSizeBytes: 5 * 1024 * 1024 // 5MB
      },
      {
        type: 'character_certificate',
        required: false,
        label: 'Character Certificate',
        description: 'Optional character reference from employer, teacher, or community leader',
        acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSizeBytes: 5 * 1024 * 1024
      }
    ]
  },
  {
    checkType: 'enhanced',
    required: false,
    description: 'Enhanced verification for volunteers working with vulnerable groups',
    validityPeriod: 180, // 6 months
    documents: [
      {
        type: 'police_certificate',
        required: true,
        label: 'Police Clearance Certificate',
        description: 'Valid police character certificate from local police station',
        acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSizeBytes: 5 * 1024 * 1024
      },
      {
        type: 'reference_letter',
        required: true,
        label: 'Reference Letters (2)',
        description: 'Two professional or character references',
        acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
        maxSizeBytes: 5 * 1024 * 1024
      }
    ]
  }
];

export const MOCK_BACKGROUND_CHECK: BackgroundCheck = {
  id: 'bgc-001',
  volunteerId: 'vol-123',
  volunteerName: 'Ahmed Khan',
  status: 'pending_review',
  checkType: 'basic',
  submittedAt: '2025-01-05T10:00:00Z',
  documents: [
    {
      id: 'doc-001',
      type: 'cnic',
      fileName: 'cnic_front_back.pdf',
      fileUrl: 'https://example.com/documents/cnic_001.pdf',
      fileSize: 2400000,
      uploadedAt: '2025-01-05T10:00:00Z',
      status: 'pending'
    },
    {
      id: 'doc-002',
      type: 'character_certificate',
      fileName: 'character_cert.pdf',
      fileUrl: 'https://example.com/documents/char_cert_001.pdf',
      fileSize: 1800000,
      uploadedAt: '2025-01-05T10:05:00Z',
      status: 'pending'
    }
  ],
  notes: 'All documents submitted for review'
};

export const MOCK_VOLUNTEER_SESSIONS: VolunteerHoursSession[] = [
  {
    id: 'session-001',
    volunteerId: 'vol-123',
    volunteerName: 'Ahmed Khan',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    checkInTime: '2025-01-07T09:00:00Z',
    checkInLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    checkInPhoto: 'https://example.com/photos/checkin-001.jpg',
    status: 'checked_in',
    taskDescription: 'Beach cleanup and waste collection'
  },
  {
    id: 'session-002',
    volunteerId: 'vol-123',
    volunteerName: 'Ahmed Khan',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    checkInTime: '2025-01-06T08:30:00Z',
    checkInLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    checkOutTime: '2025-01-06T13:30:00Z',
    checkOutLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    totalHours: 5,
    status: 'checked_out',
    taskDescription: 'Beach cleanup - collected 50kg of waste',
    notes: 'Great work today! Very productive session.'
  },
  {
    id: 'session-003',
    volunteerId: 'vol-123',
    volunteerName: 'Ahmed Khan',
    projectId: 'proj-2',
    projectName: 'Skills Training for Youth',
    ngoId: 'ngo-2',
    ngoName: 'The Citizens Foundation',
    checkInTime: '2025-01-04T14:00:00Z',
    checkInLocation: {
      latitude: 24.9056,
      longitude: 67.0822,
      address: 'TCF Campus, Gulshan-e-Iqbal, Karachi'
    },
    checkOutTime: '2025-01-04T18:00:00Z',
    checkOutLocation: {
      latitude: 24.9056,
      longitude: 67.0822,
      address: 'TCF Campus, Gulshan-e-Iqbal, Karachi'
    },
    totalHours: 4,
    status: 'verified',
    verifiedBy: 'NGO Supervisor',
    verifiedAt: '2025-01-05T09:00:00Z',
    taskDescription: 'Assisted with computer training session'
  },
  {
    id: 'session-004',
    volunteerId: 'vol-123',
    volunteerName: 'Ahmed Khan',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    checkInTime: '2025-01-03T09:00:00Z',
    checkInLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    checkOutTime: '2025-01-03T14:00:00Z',
    checkOutLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    totalHours: 5,
    status: 'verified',
    verifiedBy: 'Sara Khan',
    verifiedAt: '2025-01-04T08:00:00Z',
    taskDescription: 'Beach cleanup and volunteer coordination'
  },
  {
    id: 'session-005',
    volunteerId: 'vol-123',
    volunteerName: 'Ahmed Khan',
    projectId: 'proj-1',
    projectName: 'Clean Karachi Drive',
    ngoId: 'ngo-1',
    ngoName: 'Shehri CBE',
    checkInTime: '2024-12-28T10:00:00Z',
    checkInLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    checkOutTime: '2024-12-28T15:00:00Z',
    checkOutLocation: {
      latitude: 24.8607,
      longitude: 67.0011,
      address: 'Clifton Beach, Karachi'
    },
    totalHours: 5,
    status: 'verified',
    verifiedBy: 'Sara Khan',
    verifiedAt: '2024-12-29T09:00:00Z',
    taskDescription: 'Year-end cleanup event'
  }
];

export const MOCK_HOURS_SUMMARY: VolunteerHoursSummary = {
  volunteerId: 'vol-123',
  totalHours: 19,
  verifiedHours: 14,
  pendingHours: 5,
  thisWeek: 10,
  thisMonth: 19,
  allTime: 54,
  byProject: [
    {
      projectId: 'proj-1',
      projectName: 'Clean Karachi Drive',
      hours: 15
    },
    {
      projectId: 'proj-2',
      projectName: 'Skills Training for Youth',
      hours: 4
    }
  ],
  byMonth: [
    { month: 'Jan 2025', hours: 19 },
    { month: 'Dec 2024', hours: 15 },
    { month: 'Nov 2024', hours: 12 },
    { month: 'Oct 2024', hours: 8 }
  ]
};

export const MOCK_AVAILABLE_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Clean Karachi Drive',
    ngoName: 'Shehri CBE',
    location: 'Clifton Beach, Karachi',
    requiresCheckIn: true
  },
  {
    id: 'proj-2',
    name: 'Skills Training for Youth',
    ngoName: 'The Citizens Foundation',
    location: 'TCF Campus, Gulshan-e-Iqbal',
    requiresCheckIn: true
  },
  {
    id: 'proj-3',
    name: 'Tree Plantation Drive',
    ngoName: 'Shehri CBE',
    location: 'Various locations in Karachi',
    requiresCheckIn: true
  }
];
