export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
}

export interface ProposalFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  role: string;
  budgetRange: string;
  services: string[];
  preferredSDGs: number[];
  message: string;
  attachments: UploadedFile[];
  consent: boolean;
  website: string; // honeypot
}

export interface ProposalFormErrors {
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  role?: string;
  budgetRange?: string;
  services?: string;
  message?: string;
  attachments?: string;
  consent?: string;
}

export const initialFormData: ProposalFormData = {
  companyName: '',
  contactName: '',
  email: '',
  phone: '',
  role: '',
  budgetRange: '',
  services: [],
  preferredSDGs: [],
  message: '',
  attachments: [],
  consent: false,
  website: '' // honeypot
};

export const roleOptions = [
  { value: 'Corporate', label: 'Corporate' },
  { value: 'NGO', label: 'NGO' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Other', label: 'Other' }
];

export const budgetOptions = [
  { value: '<PKR 50k', label: 'Under PKR 50,000' },
  { value: 'PKR 50k–200k', label: 'PKR 50,000 – 200,000' },
  { value: 'PKR 200k–1M', label: 'PKR 200,000 – 1 Million' },
  { value: '>PKR 1M', label: 'Over PKR 1 Million' },
  { value: 'Not decided', label: 'Not decided yet' }
];

export const serviceOptions = [
  'CSR Strategy',
  'NGO Vetting',
  'Project Execution',
  'Impact Reporting',
  'Employee Volunteering',
  'Compliance & Audit',
  'Events & Experiences'
];

export function validateForm(data: ProposalFormData): ProposalFormErrors {
  const errors: ProposalFormErrors = {};

  // Company name validation
  if (!data.companyName.trim()) {
    errors.companyName = 'Please enter your company name.';
  } else if (data.companyName.length < 2 || data.companyName.length > 100) {
    errors.companyName = 'Company name must be between 2 and 100 characters.';
  }

  // Contact name validation
  if (!data.contactName.trim()) {
    errors.contactName = 'Please enter your name.';
  } else if (data.contactName.length < 2 || data.contactName.length > 50) {
    errors.contactName = 'Name must be between 2 and 50 characters.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'Please enter a valid email address.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Phone validation (optional but if provided must be valid)
  if (data.phone.trim()) {
    const phoneRegex = /^[\d+\s()-]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }
  }

  // Role validation
  if (!data.role) {
    errors.role = 'Please select your role.';
  }

  // Budget range validation
  if (!data.budgetRange) {
    errors.budgetRange = 'Please select an approximate budget range.';
  }

  // Services validation (optional but max 5)
  if (data.services.length > 5) {
    errors.services = 'Please select a maximum of 5 services.';
  }

  // Message validation
  if (data.message.length > 1000) {
    errors.message = 'Too long — keep it under 1000 characters.';
  }

  // Attachments validation
  const totalSize = data.attachments.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = totalSize / (1024 * 1024);
  if (totalSizeMB > 10) {
    errors.attachments = 'Total file size exceeds 10MB limit.';
  }

  // Consent validation
  if (!data.consent) {
    errors.consent = 'Please consent for us to contact you.';
  }

  // Honeypot check (should be empty)
  if (data.website.trim() !== '') {
    errors.companyName = 'Invalid submission detected.';
  }

  return errors;
}

export function trackAnalytics(eventName: string, payload?: any) {
  // In production, this would send to Google Analytics, Mixpanel, etc.
  console.log('[Analytics Event]', eventName, payload);
}
