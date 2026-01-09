/**
 * Email Masking Utility
 * 
 * Provides consistent email masking for privacy across the application
 * Used in auth flows, user profiles, and anywhere PII needs protection
 */

// =====================================================
// EMAIL MASKING FUNCTIONS
// =====================================================

/**
 * Mask email for privacy
 * 
 * Examples:
 * - "john.doe@example.com" → "jo***@example.com"
 * - "a@b.com" → "a***@b.com"
 * - "verylongemail@company.co.uk" → "ve***@company.co.uk"
 * 
 * @param email - Email address to mask
 * @param options - Masking options
 * @returns Masked email string
 */
export function maskEmail(
  email: string,
  options: {
    visibleChars?: number;  // Number of chars to show at start (default: 2)
    maskChar?: string;      // Character to use for masking (default: *)
    showFullDomain?: boolean; // Show full domain or mask it too (default: true)
  } = {}
): string {
  const {
    visibleChars = 2,
    maskChar = '*',
    showFullDomain = true
  } = options;

  if (!email || !email.includes('@')) {
    return email; // Return as-is if invalid
  }

  const [localPart, domain] = email.split('@');

  // Handle very short local parts
  const charsToShow = Math.min(visibleChars, localPart.length);
  const visiblePart = localPart.slice(0, charsToShow);
  const maskedLocalPart = visiblePart + maskChar.repeat(3);

  // Optionally mask domain too
  const maskedDomain = showFullDomain 
    ? domain 
    : maskDomain(domain, maskChar);

  return `${maskedLocalPart}@${maskedDomain}`;
}

/**
 * Mask domain name
 * 
 * Examples:
 * - "example.com" → "ex***le.com"
 * - "company.co.uk" → "co***ny.co.uk"
 */
function maskDomain(domain: string, maskChar: string = '*'): string {
  const parts = domain.split('.');
  
  if (parts.length === 0) return domain;

  // Mask the main domain part (before TLD)
  const mainDomain = parts[0];
  if (mainDomain.length <= 4) {
    return domain; // Too short to mask effectively
  }

  const maskedMain = 
    mainDomain.slice(0, 2) + 
    maskChar.repeat(3) + 
    mainDomain.slice(-2);

  parts[0] = maskedMain;
  return parts.join('.');
}

/**
 * Mask email for display in OTP/verification screens
 * Shows more context than standard masking
 * 
 * Examples:
 * - "john.doe@example.com" → "joh****oe@example.com"
 * - "user@domain.com" → "us***r@domain.com"
 */
export function maskEmailForVerification(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 4) {
    // For very short local parts, show first 2 chars
    return maskEmail(email, { visibleChars: 2 });
  }

  // Show first 3 and last 2 characters
  const start = localPart.slice(0, 3);
  const end = localPart.slice(-2);
  const maskedLocalPart = `${start}****${end}`;

  return `${maskedLocalPart}@${domain}`;
}

/**
 * Mask email for public display (e.g., in testimonials, comments)
 * More aggressive masking for public contexts
 * 
 * Examples:
 * - "john.doe@example.com" → "j***@e***.com"
 * - "admin@company.co.uk" → "a***@c***.co.uk"
 */
export function maskEmailForPublic(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');

  // Show only first character of local part
  const maskedLocal = localPart[0] + '***';

  // Mask domain too
  const maskedDomain = maskDomain(domain);

  return `${maskedLocal}@${maskedDomain}`;
}

/**
 * Partially reveal email (for account recovery, etc.)
 * Shows more information than masked version
 * 
 * Examples:
 * - "john.doe@example.com" → "john.***@example.com"
 * - "user123@domain.com" → "user***@domain.com"
 */
export function partiallyRevealEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email;
  }

  const [localPart, domain] = email.split('@');

  if (localPart.length <= 4) {
    return maskEmail(email, { visibleChars: localPart.length });
  }

  // Show first 4 characters
  const visible = localPart.slice(0, 4);
  const maskedLocalPart = `${visible}***`;

  return `${maskedLocalPart}@${domain}`;
}

// =====================================================
// PHONE NUMBER MASKING
// =====================================================

/**
 * Mask phone number for privacy
 * 
 * Examples:
 * - "+923001234567" → "+9230012***67"
 * - "03001234567" → "03001***567"
 */
export function maskPhoneNumber(
  phone: string,
  options: {
    visibleStart?: number;
    visibleEnd?: number;
    maskChar?: string;
  } = {}
): string {
  const {
    visibleStart = 5,
    visibleEnd = 2,
    maskChar = '*'
  } = options;

  if (!phone || phone.length < 8) {
    return phone;
  }

  const start = phone.slice(0, visibleStart);
  const end = phone.slice(-visibleEnd);
  const masked = maskChar.repeat(3);

  return `${start}${masked}${end}`;
}

// =====================================================
// NAME MASKING (for GDPR compliance)
// =====================================================

/**
 * Mask name for privacy
 * 
 * Examples:
 * - "John Doe" → "John D."
 * - "Sarah Ahmed Khan" → "Sarah A. K."
 */
export function maskName(name: string): string {
  if (!name) return name;

  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return name; // Single name, return as-is
  }

  // Keep first name, initial-ize the rest
  const firstName = parts[0];
  const initials = parts.slice(1).map(part => part[0] + '.').join(' ');

  return `${firstName} ${initials}`;
}

/**
 * Mask full name more aggressively
 * 
 * Examples:
 * - "John Doe" → "J*** D***"
 * - "Sarah Ahmed" → "S*** A***"
 */
export function maskNameFull(name: string): string {
  if (!name) return name;

  const parts = name.trim().split(/\s+/);
  
  return parts
    .map(part => part[0] + '***')
    .join(' ');
}

// =====================================================
// VALIDATION HELPERS
// =====================================================

/**
 * Check if email appears to be masked
 */
export function isEmailMasked(email: string): boolean {
  return email.includes('***') || email.includes('****');
}

/**
 * Extract domain from email (works with masked emails)
 */
export function extractDomain(email: string): string {
  if (!email || !email.includes('@')) {
    return '';
  }

  return email.split('@')[1];
}

// =====================================================
// UTILITIES FOR ANALYTICS (Hash for tracking)
// =====================================================

/**
 * Create a privacy-safe identifier from email
 * Uses simple hash for analytics tracking without exposing PII
 * 
 * Note: Not cryptographically secure, just for analytics
 */
export function createEmailHash(email: string): string {
  if (!email) return '';

  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `user_${Math.abs(hash)}`;
}

/**
 * Get masked email suitable for logging/debugging
 * Shows just enough to identify issues without exposing PII
 */
export function getMaskedEmailForLogging(email: string): string {
  if (!email || !email.includes('@')) {
    return '[invalid-email]';
  }

  const [localPart, domain] = email.split('@');
  
  // Show only: first char + length + domain
  const maskedLocal = `${localPart[0]}[${localPart.length}]`;
  
  return `${maskedLocal}@${domain}`;
}

// =====================================================
// EXPORT DEFAULT OBJECT
// =====================================================

export default {
  maskEmail,
  maskEmailForVerification,
  maskEmailForPublic,
  partiallyRevealEmail,
  maskPhoneNumber,
  maskName,
  maskNameFull,
  isEmailMasked,
  extractDomain,
  createEmailHash,
  getMaskedEmailForLogging,
};
