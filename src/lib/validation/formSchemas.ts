import { z } from 'zod';

// =====================================================
// COMMON FIELD SCHEMAS
// =====================================================

export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z.string().regex(
  /^(\+92|0)?[0-9]{10}$/,
  'Please enter a valid Pakistani phone number'
);

export const cnicSchema = z.string().regex(
  /^[0-9]{5}-[0-9]{7}-[0-9]$/,
  'Please enter a valid CNIC (e.g., 12345-1234567-1)'
);

export const urlSchema = z.string().url('Please enter a valid URL').optional().or(z.literal(''));

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const sdgGoalsSchema = z.array(z.number().min(1).max(17)).min(1, 'Select at least one SDG goal');

export const provinceSchema = z.enum([
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Kashmir',
  'Islamabad Capital Territory',
]);

export const dateSchema = z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: 'Please enter a valid date',
});

export const futureDateSchema = z.string().refine((date) => new Date(date) >= new Date(), {
  message: 'Date must be in the future',
});

// =====================================================
// AUTH FORMS
// =====================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Name is too long'),
  companyName: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const otpSchema = z.object({
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^[0-9]+$/, 'OTP must contain only numbers'),
});

// =====================================================
// ONBOARDING FORMS
// =====================================================

export const roleSelectionSchema = z.object({
  role: z.enum(['corporate', 'ngo', 'volunteer'], {
    required_error: 'Please select a role',
  }),
});

export const volunteerOnboardingSchema = z.object({
  displayName: z.string().min(2, 'Display name is required').max(100),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  phone: phoneSchema.optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  sdgGoals: sdgGoalsSchema,
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    hours_per_week: z.number().min(1).max(168),
  }),
  profilePhotoUrl: z.string().optional(),
});

export const ngoOnboardingSchema = z.object({
  displayName: z.string().min(2, 'Display name is required'),
  organizationName: z.string().min(2, 'Organization name is required').max(200),
  registrationNumber: z.string().min(5, 'Registration number is required'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  phone: phoneSchema,
  website: urlSchema,
  mission: z.string().min(50, 'Mission statement must be at least 50 characters').max(1000),
  sdgGoals: sdgGoalsSchema,
  focusAreas: z.array(z.string()).min(1, 'Select at least one focus area'),
  profilePhotoUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

export const corporateOnboardingSchema = z.object({
  displayName: z.string().min(2, 'Display name is required'),
  organizationName: z.string().min(2, 'Company name is required').max(200),
  industry: z.string().min(2, 'Industry is required'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  phone: phoneSchema,
  website: urlSchema,
  csrFocus: z.array(z.string()).min(1, 'Select at least one CSR focus area'),
  sdgGoals: sdgGoalsSchema,
  profilePhotoUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

// =====================================================
// PROJECT FORMS
// =====================================================

export const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description is too long'),
  budget: z.number().min(10000, 'Budget must be at least PKR 10,000').max(100000000, 'Budget cannot exceed PKR 100M'),
  start_date: futureDateSchema,
  end_date: dateSchema,
  location: z.string().min(3, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  sdg_goals: sdgGoalsSchema,
  focus_areas: z.array(z.string()).min(1, 'Select at least one focus area'),
  volunteer_capacity: z.number().min(1, 'Volunteer capacity must be at least 1').max(1000, 'Capacity is too high'),
  requirements: z.string().min(20, 'Requirements must be at least 20 characters').optional(),
  benefits: z.string().optional(),
  ngo_id: z.string().uuid().optional(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const updateProjectSchema = createProjectSchema.partial();

export const milestoneSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  due_date: dateSchema,
  budget: z.number().min(0).max(100000000).optional(),
  deliverables: z.array(z.string()).optional(),
});

export const projectUpdateSchema = z.object({
  title: z.string().min(5, 'Title is required').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  media_urls: z.array(z.string().url()).optional(),
  metrics: z.object({
    beneficiaries: z.number().min(0).optional(),
    volunteers_engaged: z.number().min(0).optional(),
    budget_utilized: z.number().min(0).optional(),
  }).optional(),
});

// =====================================================
// VOLUNTEER APPLICATION FORMS
// =====================================================

export const volunteerApplicationSchema = z.object({
  motivation: z.string().min(100, 'Please write at least 100 characters about your motivation').max(2000),
  availability_start: dateSchema,
  availability_end: dateSchema,
  hours_per_week: z.number().min(1, 'Minimum 1 hour per week').max(40, 'Maximum 40 hours per week'),
  skills: z.array(z.string()).min(1, 'Select at least one relevant skill'),
  experience: z.string().max(1000).optional(),
  emergency_contact_name: z.string().min(2, 'Emergency contact name is required'),
  emergency_contact_phone: phoneSchema,
  emergency_contact_relationship: z.string().min(2, 'Relationship is required'),
  agreed_to_terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => new Date(data.availability_end) > new Date(data.availability_start), {
  message: 'End date must be after start date',
  path: ['availability_end'],
});

export const logHoursSchema = z.object({
  project_id: z.string().uuid(),
  hours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Maximum 24 hours per entry'),
  date: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  description: z.string().min(10, 'Please describe what you did (minimum 10 characters)').max(500),
  tasks_completed: z.array(z.string()).optional(),
});

export const withdrawApplicationSchema = z.object({
  reason: z.string().min(20, 'Please provide a reason (minimum 20 characters)').max(500),
});

// =====================================================
// NGO FORMS
// =====================================================

export const ngoProfileSchema = z.object({
  organization_name: z.string().min(2, 'Organization name is required').max(200),
  registration_number: z.string().min(5, 'Registration number is required'),
  founded_year: z.number().min(1900).max(new Date().getFullYear()),
  legal_status: z.enum(['registered_ngo', 'trust', 'society', 'foundation', 'company']),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  phone: phoneSchema,
  email: emailSchema,
  website: urlSchema,
  mission: z.string().min(50, 'Mission statement is required').max(1000),
  vision: z.string().max(1000).optional(),
  about: z.string().min(100, 'About section is required').max(5000),
  sdg_goals: sdgGoalsSchema,
  focus_areas: z.array(z.string()).min(1, 'Select at least one focus area'),
  service_areas: z.array(provinceSchema).min(1, 'Select at least one service area'),
  team_size: z.number().min(1).max(100000),
  annual_budget: z.number().min(0).max(10000000000),
  beneficiaries_reached: z.number().min(0).max(100000000).optional(),
  social_media: z.object({
    facebook: urlSchema,
    twitter: urlSchema,
    linkedin: urlSchema,
    instagram: urlSchema,
  }).optional(),
});

export const ngoDocumentUploadSchema = z.object({
  document_type: z.enum([
    'registration_certificate',
    'tax_exemption',
    'annual_report',
    'financial_statement',
    'ntn_certificate',
    'bank_details',
    'board_resolution',
    'other',
  ]),
  title: z.string().min(5, 'Document title is required').max(200),
  description: z.string().max(500).optional(),
  file_url: z.string().url('Please upload a valid file'),
  issue_date: dateSchema.optional(),
  expiry_date: dateSchema.optional(),
});

export const requestVerificationSchema = z.object({
  verification_type: z.enum(['organization', 'documents', 'bank_details', 'full']),
  notes: z.string().max(1000).optional(),
  urgency: z.enum(['low', 'medium', 'high']).optional(),
});

// =====================================================
// CORPORATE FORMS
// =====================================================

export const corporateProfileSchema = z.object({
  organization_name: z.string().min(2, 'Company name is required').max(200),
  industry: z.string().min(2, 'Industry is required'),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  phone: phoneSchema,
  email: emailSchema,
  website: urlSchema,
  about: z.string().min(100, 'About section is required').max(5000),
  csr_policy: z.string().min(100, 'CSR policy is required').max(2000),
  sdg_goals: sdgGoalsSchema,
  csr_focus_areas: z.array(z.string()).min(1, 'Select at least one CSR focus area'),
  annual_csr_budget: z.number().min(0).max(10000000000),
  social_media: z.object({
    facebook: urlSchema,
    twitter: urlSchema,
    linkedin: urlSchema,
  }).optional(),
});

export const allocateBudgetSchema = z.object({
  project_id: z.string().uuid(),
  amount: z.number().min(1000, 'Minimum allocation is PKR 1,000').max(100000000),
  category: z.enum(['direct_costs', 'indirect_costs', 'admin', 'contingency']),
  notes: z.string().max(500).optional(),
  approval_required: z.boolean().optional(),
});

export const paymentApprovalSchema = z.object({
  project_id: z.string().uuid(),
  amount: z.number().min(100, 'Minimum amount is PKR 100').max(100000000),
  payment_type: z.enum(['milestone', 'reimbursement', 'advance', 'final']),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(20, 'Description is required').max(1000),
  recipient_name: z.string().min(2, 'Recipient name is required'),
  recipient_account: z.string().min(10, 'Account number is required'),
  recipient_bank: z.string().min(2, 'Bank name is required'),
  invoice_number: z.string().optional(),
  invoice_date: dateSchema.optional(),
  supporting_documents: z.array(z.string().url()).optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const approvePaymentSchema = z.object({
  notes: z.string().max(500).optional(),
  approved_amount: z.number().min(0).optional(),
  payment_reference: z.string().optional(),
});

export const rejectPaymentSchema = z.object({
  reason: z.string().min(20, 'Please provide a reason for rejection').max(1000),
  requires_revision: z.boolean().optional(),
});

// =====================================================
// ADMIN FORMS
// =====================================================

export const createUserSchema = z.object({
  email: emailSchema,
  full_name: z.string().min(2, 'Full name is required').max(100),
  role: z.enum(['admin', 'corporate', 'ngo', 'volunteer']),
  send_invite: z.boolean().default(true),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'corporate', 'ngo', 'volunteer']),
  reason: z.string().min(10, 'Please provide a reason').max(500),
});

export const vettingDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected', 'requires_info']),
  notes: z.string().min(20, 'Please provide detailed notes').max(2000),
  conditions: z.array(z.string()).optional(),
  follow_up_date: dateSchema.optional(),
});

export const assignVettingSchema = z.object({
  assignee_id: z.string().uuid(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  deadline: dateSchema.optional(),
  notes: z.string().max(500).optional(),
});

export const bulkActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'archive', 'delete', 'update_status']),
  entity_ids: z.array(z.string().uuid()).min(1, 'Select at least one item'),
  reason: z.string().min(10, 'Please provide a reason').max(500),
  new_status: z.string().optional(),
});

export const platformSettingsSchema = z.object({
  platform_name: z.string().min(2).max(100),
  support_email: emailSchema,
  support_phone: phoneSchema,
  maintenance_mode: z.boolean(),
  registration_enabled: z.boolean(),
  vetting_required: z.boolean(),
  auto_approval_threshold: z.number().min(0).max(1000000),
  session_timeout: z.number().min(5).max(1440),
  max_file_size_mb: z.number().min(1).max(100),
});

// =====================================================
// DOCUMENT & MEDIA FORMS
// =====================================================

export const uploadMediaSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  file_url: z.string().url('Please upload a valid file'),
  file_type: z.enum(['image', 'video', 'document', 'pdf']),
  file_size: z.number().max(50000000, 'File size must be less than 50MB'),
  tags: z.array(z.string()).optional(),
});

export const uploadEvidenceSchema = z.object({
  title: z.string().min(5, 'Title is required').max(200),
  description: z.string().min(20, 'Description is required').max(1000),
  file_urls: z.array(z.string().url()).min(1, 'Upload at least one file'),
  evidence_type: z.enum(['photo', 'video', 'document', 'receipt', 'certificate']),
  date_captured: dateSchema,
  location: z.string().optional(),
  metadata: z.object({
    photographer: z.string().optional(),
    camera: z.string().optional(),
    gps_coordinates: z.string().optional(),
  }).optional(),
});

// =====================================================
// CERTIFICATE & BACKGROUND CHECK FORMS
// =====================================================

export const issueCertificateSchema = z.object({
  volunteer_id: z.string().uuid(),
  project_id: z.string().uuid(),
  certificate_type: z.enum(['completion', 'appreciation', 'achievement', 'leadership']),
  hours_completed: z.number().min(1),
  start_date: dateSchema,
  end_date: dateSchema,
  achievements: z.array(z.string()).optional(),
  special_notes: z.string().max(500).optional(),
});

export const requestBackgroundCheckSchema = z.object({
  volunteer_id: z.string().uuid(),
  check_type: z.enum(['basic', 'standard', 'enhanced']),
  urgency: z.enum(['normal', 'urgent']),
  reason: z.string().min(20, 'Please provide a reason').max(500),
  consent_obtained: z.boolean().refine((val) => val === true, {
    message: 'Consent must be obtained',
  }),
});

// =====================================================
// CONTACT & PROPOSAL FORMS
// =====================================================

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, 'Subject is required').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
  organization: z.string().max(200).optional(),
  inquiry_type: z.enum(['general', 'partnership', 'support', 'feedback', 'other']),
});

export const proposalFormSchema = z.object({
  project_title: z.string().min(10, 'Project title is required').max(200),
  organization_name: z.string().min(2, 'Organization name is required').max(200),
  contact_person: z.string().min(2, 'Contact person is required').max(100),
  email: emailSchema,
  phone: phoneSchema,
  project_summary: z.string().min(100, 'Project summary must be at least 100 characters').max(1000),
  problem_statement: z.string().min(100, 'Problem statement is required').max(2000),
  proposed_solution: z.string().min(100, 'Proposed solution is required').max(2000),
  target_beneficiaries: z.string().min(50, 'Target beneficiaries description is required').max(1000),
  expected_impact: z.string().min(50, 'Expected impact is required').max(1000),
  budget_requested: z.number().min(10000, 'Minimum budget is PKR 10,000').max(100000000),
  budget_breakdown: z.string().min(100, 'Budget breakdown is required').max(2000),
  timeline: z.string().min(50, 'Timeline is required').max(1000),
  sdg_alignment: sdgGoalsSchema,
  province: provinceSchema,
  city: z.string().min(2, 'City is required'),
  supporting_documents: z.array(z.string().url()).optional(),
});

// =====================================================
// COMMENT & FEEDBACK FORMS
// =====================================================

export const commentSchema = z.object({
  content: z.string().min(2, 'Comment is required').max(1000, 'Comment is too long'),
  parent_id: z.string().uuid().optional(),
  mentions: z.array(z.string().uuid()).optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  title: z.string().min(5, 'Title is required').max(200),
  comment: z.string().min(20, 'Feedback must be at least 20 characters').max(2000),
  category: z.enum(['platform', 'project', 'ngo', 'support', 'other']),
  would_recommend: z.boolean(),
  improvements: z.string().max(1000).optional(),
});

export const reportIssueSchema = z.object({
  issue_type: z.enum(['bug', 'content', 'user_behavior', 'payment', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(10, 'Title is required').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  steps_to_reproduce: z.string().max(1000).optional(),
  expected_behavior: z.string().max(500).optional(),
  actual_behavior: z.string().max(500).optional(),
  screenshots: z.array(z.string().url()).optional(),
  browser: z.string().optional(),
  device: z.string().optional(),
});

// =====================================================
// SEARCH & FILTER FORMS
// =====================================================

export const projectSearchSchema = z.object({
  query: z.string().optional(),
  sdg_goals: z.array(z.number()).optional(),
  focus_areas: z.array(z.string()).optional(),
  provinces: z.array(provinceSchema).optional(),
  status: z.array(z.enum(['draft', 'active', 'completed', 'archived'])).optional(),
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  start_date_from: dateSchema.optional(),
  start_date_to: dateSchema.optional(),
  volunteer_capacity_min: z.number().min(0).optional(),
  sort_by: z.enum(['newest', 'oldest', 'budget_high', 'budget_low', 'ending_soon']).optional(),
});

export const ngoSearchSchema = z.object({
  query: z.string().optional(),
  sdg_goals: z.array(z.number()).optional(),
  focus_areas: z.array(z.string()).optional(),
  provinces: z.array(provinceSchema).optional(),
  verified_only: z.boolean().optional(),
  team_size_min: z.number().min(0).optional(),
  sort_by: z.enum(['newest', 'oldest', 'name_asc', 'name_desc']).optional(),
});

// =====================================================
// EXPORT & REPORT FORMS
// =====================================================

export const exportDataSchema = z.object({
  entity_type: z.enum(['projects', 'volunteers', 'ngos', 'applications', 'payments', 'hours']),
  format: z.enum(['csv', 'excel', 'pdf', 'json']),
  date_from: dateSchema.optional(),
  date_to: dateSchema.optional(),
  filters: z.record(z.any()).optional(),
  columns: z.array(z.string()).optional(),
  include_archived: z.boolean().optional(),
});

export const generateReportSchema = z.object({
  report_type: z.enum(['impact', 'financial', 'volunteer_hours', 'project_status', 'ngo_performance']),
  period: z.enum(['week', 'month', 'quarter', 'year', 'custom']),
  date_from: dateSchema.optional(),
  date_to: dateSchema.optional(),
  include_charts: z.boolean().default(true),
  include_summary: z.boolean().default(true),
  include_details: z.boolean().default(true),
  filters: z.record(z.any()).optional(),
});

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });
  
  return { success: false, errors };
}

export function getFieldError(errors: Record<string, string> | undefined, field: string): string | undefined {
  return errors?.[field];
}

export function hasErrors(errors: Record<string, string> | undefined): boolean {
  return errors !== undefined && Object.keys(errors).length > 0;
}

// Export all schemas as a collection
export const schemas = {
  // Auth
  login: loginSchema,
  signup: signupSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
  otp: otpSchema,
  
  // Onboarding
  roleSelection: roleSelectionSchema,
  volunteerOnboarding: volunteerOnboardingSchema,
  ngoOnboarding: ngoOnboardingSchema,
  corporateOnboarding: corporateOnboardingSchema,
  
  // Projects
  createProject: createProjectSchema,
  updateProject: updateProjectSchema,
  milestone: milestoneSchema,
  projectUpdate: projectUpdateSchema,
  
  // Volunteer
  volunteerApplication: volunteerApplicationSchema,
  logHours: logHoursSchema,
  withdrawApplication: withdrawApplicationSchema,
  
  // NGO
  ngoProfile: ngoProfileSchema,
  ngoDocumentUpload: ngoDocumentUploadSchema,
  requestVerification: requestVerificationSchema,
  
  // Corporate
  corporateProfile: corporateProfileSchema,
  allocateBudget: allocateBudgetSchema,
  paymentApproval: paymentApprovalSchema,
  approvePayment: approvePaymentSchema,
  rejectPayment: rejectPaymentSchema,
  
  // Admin
  createUser: createUserSchema,
  updateUserRole: updateUserRoleSchema,
  vettingDecision: vettingDecisionSchema,
  assignVetting: assignVettingSchema,
  bulkAction: bulkActionSchema,
  platformSettings: platformSettingsSchema,
  
  // Media
  uploadMedia: uploadMediaSchema,
  uploadEvidence: uploadEvidenceSchema,
  
  // Certificates
  issueCertificate: issueCertificateSchema,
  requestBackgroundCheck: requestBackgroundCheckSchema,
  
  // Contact
  contactForm: contactFormSchema,
  proposalForm: proposalFormSchema,
  
  // Feedback
  comment: commentSchema,
  feedback: feedbackSchema,
  reportIssue: reportIssueSchema,
  
  // Search
  projectSearch: projectSearchSchema,
  ngoSearch: ngoSearchSchema,
  
  // Export
  exportData: exportDataSchema,
  generateReport: generateReportSchema,
};
