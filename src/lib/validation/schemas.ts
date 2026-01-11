import { z } from 'zod';

// =====================================================
// COMMON SCHEMAS
// =====================================================

export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z.string().regex(
  /^(\+92|0)?[0-9]{10}$/,
  'Please enter a valid Pakistani phone number'
);

export const urlSchema = z.string().url('Please enter a valid URL').optional().or(z.literal(''));

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

// =====================================================
// PROJECT SCHEMAS
// =====================================================

export const createProjectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000, 'Description is too long'),
  budget: z.number().min(10000, 'Budget must be at least PKR 10,000').max(100000000, 'Budget cannot exceed PKR 100M'),
  start_date: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'Start date must be in the future',
  }),
  end_date: z.string(),
  location: z.string().min(3, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  sdg_goals: sdgGoalsSchema,
  focus_areas: z.array(z.string()).min(1, 'Select at least one focus area'),
  volunteer_capacity: z.number().min(1, 'Volunteer capacity must be at least 1').max(1000, 'Capacity is too high'),
  ngo_id: z.string().uuid().optional(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const updateProjectSchema = createProjectSchema.partial();

export const addMilestoneSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  due_date: z.string(),
  completed_date: z.string().optional(),
  evidence_urls: z.array(z.string().url()).optional(),
});

// =====================================================
// NGO SCHEMAS
// =====================================================

export const createNGOSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name is too long'),
  legal_name: z.string().min(3, 'Legal name is required'),
  registration_number: z.string().min(5, 'Registration number is required'),
  email: emailSchema,
  phone: phoneSchema,
  website: urlSchema,
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  description: z.string().min(100, 'Description must be at least 100 characters').max(5000, 'Description is too long'),
  mission_statement: z.string().min(50, 'Mission statement must be at least 50 characters').max(1000, 'Mission statement is too long'),
  founded_year: z.number().min(1947, 'Year must be 1947 or later').max(new Date().getFullYear(), 'Year cannot be in the future'),
  focus_areas: z.array(z.string()).min(1, 'Select at least one focus area'),
  sdg_alignment: sdgGoalsSchema,
});

export const updateNGOSchema = createNGOSchema.partial();

export const uploadDocumentSchema = z.object({
  document_type: z.enum(['registration', 'tax_exemption', 'financial_statement', 'annual_report', 'other']),
  file: z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: 'File size must be less than 10MB',
  }).refine((file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type), {
    message: 'File must be PDF, JPEG, or PNG',
  }),
});

// =====================================================
// VOLUNTEER SCHEMAS
// =====================================================

export const createVolunteerApplicationSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  opportunity_id: z.string().uuid().optional(),
  cover_letter: z.string().min(100, 'Cover letter must be at least 100 characters').max(2000, 'Cover letter is too long'),
  availability_notes: z.string().min(20, 'Please describe your availability'),
  skills_offered: z.array(z.string()).min(1, 'Select at least one skill'),
  hours_committed: z.number().min(1, 'Hours committed must be at least 1').max(40, 'Cannot commit more than 40 hours per week'),
});

export const logHoursSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  date: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Date cannot be in the future',
  }),
  hours: z.number().min(0.5, 'Minimum 0.5 hours').max(24, 'Cannot log more than 24 hours in a day'),
  activity_description: z.string().min(20, 'Description must be at least 20 characters').max(500, 'Description is too long'),
});

export const updateVolunteerProfileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  sdg_goals: sdgGoalsSchema,
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  availability: z.object({
    weekdays: z.boolean(),
    weekends: z.boolean(),
    hours_per_week: z.number().min(1).max(40),
  }),
}).partial();

// =====================================================
// CORPORATE SCHEMAS
// =====================================================

export const updateCorporateProfileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  organization_name: z.string().min(2, 'Organization name is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
}).partial();

export const updateCorporateOrganizationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200, 'Name is too long'),
  legal_name: z.string().min(3, 'Legal name is required'),
  email: emailSchema,
  phone: phoneSchema,
  website: urlSchema,
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  province: provinceSchema,
  description: z.string().min(100, 'Description must be at least 100 characters').max(5000, 'Description is too long'),
  industry: z.string().min(2, 'Industry is required'),
  employee_count_range: z.enum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
  csr_budget_annual: z.number().min(0, 'Budget cannot be negative'),
  focus_areas: z.array(z.string()).min(1, 'Select at least one focus area'),
  sdg_alignment: sdgGoalsSchema,
}).partial();

export const createPaymentApprovalSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  amount: z.number().min(1000, 'Amount must be at least PKR 1,000').max(50000000, 'Amount cannot exceed PKR 50M'),
  invoice_url: urlSchema,
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

export const updateBudgetSchema = z.object({
  fiscal_year: z.string().regex(/^\d{4}$/, 'Invalid fiscal year'),
  total_budget: z.number().min(100000, 'Budget must be at least PKR 100,000'),
  allocated: z.number().min(0).optional(),
  spent: z.number().min(0).optional(),
  breakdown: z.array(z.object({
    category: z.string(),
    allocated: z.number().min(0),
    spent: z.number().min(0),
  })).optional(),
});

// =====================================================
// ADMIN SCHEMAS
// =====================================================

export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'corporate', 'ngo', 'volunteer']),
});

export const assignVettingSchema = z.object({
  assignee_id: z.string().uuid('Invalid user ID'),
});

export const approveVettingSchema = z.object({
  notes: z.string().max(1000, 'Notes are too long').optional(),
});

export const rejectVettingSchema = z.object({
  reason: z.string().min(10, 'Rejection reason must be at least 10 characters').max(1000, 'Reason is too long'),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export const bulkUpdateSchema = z.object({
  entity_type: z.enum(['ngo', 'project', 'volunteer']),
  entity_ids: z.array(z.string().uuid()).min(1, 'Select at least one item'),
  status: z.string().min(1, 'Status is required'),
});

export const bulkDeleteSchema = z.object({
  entity_type: z.enum(['ngo', 'project', 'user']),
  entity_ids: z.array(z.string().uuid()).min(1, 'Select at least one item'),
});

export const generateReportSchema = z.object({
  report_type: z.enum(['users', 'projects', 'financial', 'activity']),
  start_date: z.string(),
  end_date: z.string(),
}).refine((data) => new Date(data.end_date) > new Date(data.start_date), {
  message: 'End date must be after start date',
  path: ['end_date'],
});

// =====================================================
// AUTH SCHEMAS
// =====================================================

export const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name is required').max(100, 'Name is too long'),
  companyName: z.string().max(200, 'Company name is too long').optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// =====================================================
// PROFILE SCHEMAS
// =====================================================

export const updateProfileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  location: z.string().min(2, 'Location is required').optional(),
  city: z.string().min(2, 'City is required').optional(),
  province: provinceSchema.optional(),
  interests: z.array(z.string()).optional(),
  sdg_goals: z.array(z.number().min(1).max(17)).optional(),
  notification_preferences: z.object({
    email_notifications: z.boolean(),
    weekly_digest: z.boolean(),
    project_updates: z.boolean(),
    marketing: z.boolean(),
  }).partial().optional(),
}).partial();

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _general: 'Validation failed' } };
  }
}

export function getFieldError(errors: Record<string, string> | undefined, field: string): string | undefined {
  if (!errors) return undefined;
  return errors[field];
}
