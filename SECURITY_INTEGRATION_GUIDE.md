# Security Utilities Integration Guide

## Quick Start

This guide shows how to integrate the new security utilities into your application.

---

## 1. Secure Storage

### Setup

Add to your app initialization:

```typescript
// src/main.tsx or App.tsx
import { initializeSecureStorage } from '@/lib/security/secureStorage';

// Initialize on app startup
initializeSecureStorage();
```

### Usage

```typescript
import { secureStorage, storageHelpers } from '@/lib/security/secureStorage';

// Store encrypted auth token
await storageHelpers.setAuthToken(token, 3600000); // 1 hour expiry

// Retrieve token
const token = await storageHelpers.getAuthToken();

// Store user preferences (non-sensitive)
await storageHelpers.setUserPreferences({
  theme: 'dark',
  language: 'en',
});

// Custom storage with encryption
await secureStorage.setItem('sensitive-data', data, {
  ttl: 7200000, // 2 hours
  encrypt: true,
  storageType: 'sessionStorage',
});

// Retrieve
const data = await secureStorage.getItem('sensitive-data');
```

### Migration from localStorage

```typescript
// Before
localStorage.setItem('token', token);
const token = localStorage.getItem('token');

// After (encrypted)
await secureStorage.setItem('token', token, { encrypt: true });
const token = await secureStorage.getItem('token');
```

---

## 2. Environment Validation

### Setup

Add to your app initialization:

```typescript
// src/main.tsx
import { initializeEnvironment, validateSecureContext } from '@/lib/security/envValidator';

// Validate environment on startup
try {
  initializeEnvironment();
  validateSecureContext();
} catch (error) {
  console.error('Environment validation failed:', error);
  // Handle error appropriately
}
```

### Check Values

```typescript
import { getEnvValue, isSecureContext } from '@/lib/security/envValidator';

// Get validated environment value
const supabaseUrl = getEnvValue('supabaseUrl', 'default-value');

// Check if running in secure context (HTTPS)
if (!isSecureContext()) {
  console.warn('Running in insecure context');
}
```

---

## 3. Secure Logging

### Replace console.log

```typescript
import { logger, securityLogger } from '@/lib/security/secureLogger';

// Before
console.log('User data:', { email, password }); // UNSAFE!

// After (auto-redacted)
logger.info('User data', { email, userId });
// Output: email: u***@domain.com, userId: user-1234***

// Log errors
try {
  // ... code
} catch (error) {
  logger.error('Operation failed', error, { context: 'additional-info' });
}

// Debug logging (dev only)
logger.debug('Debug info', { data });

// Security events
securityLogger.authEvent('login', userId, true);
securityLogger.securityViolation('csrf', { endpoint: '/api/data' });
securityLogger.rateLimitHit('/api/login', identifier);
```

### Performance Tracking

```typescript
import { logger } from '@/lib/security/secureLogger';

// Track performance
logger.time('expensive-operation');
// ... operation
logger.timeEnd('expensive-operation');
```

---

## 4. Input Validation

### String Validation

```typescript
import { validateInput } from '@/lib/security/inputValidator';

// Validate user input
const result = validateInput.string(userInput, {
  maxLength: 100,
  minLength: 3,
  allowSpecialChars: false,
});

if (result.valid) {
  // Safe to use result.sanitized
  saveData(result.sanitized);
} else {
  // Show errors to user
  console.error(result.errors);
}
```

### Email Validation

```typescript
import { validateInput, isValid } from '@/lib/security/inputValidator';

// Quick validation
if (isValid.email(email)) {
  // Email is valid
}

// Detailed validation
const result = validateInput.email(email);
if (result.valid) {
  // Use result.sanitized (lowercased, trimmed)
  sendEmail(result.sanitized);
} else {
  showErrors(result.errors);
}
```

### URL Validation

```typescript
import { validateInput } from '@/lib/security/inputValidator';

const result = validateInput.url(url, {
  allowedProtocols: ['https:'], // Only HTTPS
  allowedDomains: ['trusted.com'], // Only trusted domains
  blockLocalhost: true,
});

if (result.valid) {
  fetch(result.sanitized);
}
```

### File Upload Validation

```typescript
import { validateFileUpload, sanitizeFileName } from '@/lib/security/inputValidator';

const handleFileUpload = (file: File) => {
  // Validate file
  const validation = validateFileUpload(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
  });
  
  if (!validation.valid) {
    alert(validation.errors.join('\n'));
    return;
  }
  
  // Sanitize file name
  const safeName = sanitizeFileName(file.name);
  
  // Upload file
  uploadFile(file, safeName);
};
```

### Object Sanitization

```typescript
import { sanitizeObject } from '@/lib/security/inputValidator';

// Sanitize entire object
const userInput = {
  name: 'John<script>',
  email: 'john@example.com',
  bio: 'Developer with <iframe>',
};

const sanitized = sanitizeObject(userInput);
// All strings sanitized, XSS attempts removed
```

---

## 5. Integration with Existing Code

### Auth Service Integration

```typescript
// src/services/authService.ts
import { secureStorage } from '@/lib/security/secureStorage';
import { logger, securityLogger } from '@/lib/security/secureLogger';
import { validateInput } from '@/lib/security/inputValidator';

export async function login(email: string, password: string) {
  // Validate input
  const emailValidation = validateInput.email(email);
  if (!emailValidation.valid) {
    throw new Error('Invalid email format');
  }
  
  try {
    // Perform login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailValidation.sanitized,
      password,
    });
    
    if (error) {
      securityLogger.authEvent('login-failed', email, false);
      throw error;
    }
    
    // Store token securely
    if (data.session) {
      await secureStorage.setItem('auth_session', data.session, {
        ttl: data.session.expires_in * 1000,
        encrypt: true,
      });
    }
    
    securityLogger.authEvent('login-success', data.user?.id, true);
    logger.info('User logged in', { userId: data.user?.id });
    
    return data;
  } catch (error) {
    logger.error('Login failed', error, { email: emailValidation.sanitized });
    throw error;
  }
}
```

### Form Validation

```typescript
// src/components/forms/ContactForm.tsx
import { validateInput } from '@/lib/security/inputValidator';

function ContactForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all inputs
    const emailResult = validateInput.email(email);
    const phoneResult = validateInput.phone(phone);
    const messageResult = validateInput.string(message, {
      maxLength: 1000,
      minLength: 10,
    });
    
    // Check all valid
    if (!emailResult.valid || !phoneResult.valid || !messageResult.valid) {
      setErrors([
        ...emailResult.errors,
        ...phoneResult.errors,
        ...messageResult.errors,
      ]);
      return;
    }
    
    // Submit with sanitized data
    await submitForm({
      email: emailResult.sanitized,
      phone: phoneResult.sanitized,
      message: messageResult.sanitized,
    });
  };
  
  // ... rest of component
}
```

### API Integration

```typescript
// src/lib/api/base.ts
import { logger } from '@/lib/security/secureLogger';
import { validateInput } from '@/lib/security/inputValidator';

export async function apiCall(endpoint: string, data: any) {
  // Validate endpoint
  const urlResult = validateInput.url(endpoint, {
    allowedProtocols: ['https:'],
    blockLocalhost: false, // Allow in development
  });
  
  if (!urlResult.valid) {
    logger.error('Invalid API endpoint', undefined, { endpoint });
    throw new Error('Invalid endpoint');
  }
  
  try {
    const response = await fetch(urlResult.sanitized, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    logger.error('API call failed', error, { endpoint });
    throw error;
  }
}
```

---

## 6. Testing

### Test Secure Storage

```typescript
import { secureStorage } from '@/lib/security/secureStorage';

describe('Secure Storage Integration', () => {
  it('should store and retrieve encrypted data', async () => {
    await secureStorage.setItem('test', 'value', { encrypt: true });
    const result = await secureStorage.getItem('test');
    expect(result).toBe('value');
  });
  
  it('should expire data after TTL', async () => {
    await secureStorage.setItem('temp', 'value', { ttl: 100 });
    await new Promise(resolve => setTimeout(resolve, 150));
    const result = await secureStorage.getItem('temp');
    expect(result).toBeNull();
  });
});
```

### Test Input Validation

```typescript
import { validateInput } from '@/lib/security/inputValidator';

describe('Input Validation', () => {
  it('should detect SQL injection', () => {
    const result = validateInput.string("'; DROP TABLE users; --");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(expect.stringContaining('SQL injection'));
  });
  
  it('should validate email', () => {
    expect(isValid.email('user@example.com')).toBe(true);
    expect(isValid.email('invalid')).toBe(false);
  });
});
```

---

## 7. Best Practices

### DO ✅

- ✅ Use secure storage for auth tokens and sensitive data
- ✅ Validate all user inputs before processing
- ✅ Use secure logger instead of console.log in production
- ✅ Initialize environment validation at app startup
- ✅ Sanitize file names before uploading
- ✅ Log security events for monitoring
- ✅ Set appropriate TTL for temporary data
- ✅ Use type-safe storage operations

### DON'T ❌

- ❌ Store unencrypted sensitive data in localStorage
- ❌ Use console.log for production logging
- ❌ Skip input validation for "trusted" sources
- ❌ Ignore environment validation errors
- ❌ Allow unrestricted file uploads
- ❌ Log sensitive data without redaction
- ❌ Use localStorage for authentication tokens
- ❌ Trust client-side validation alone

---

## 8. Checklist

Use this checklist to ensure proper integration:

- [ ] Initialize secure storage on app startup
- [ ] Initialize environment validation on app startup
- [ ] Replace localStorage calls for sensitive data
- [ ] Replace console.log with secure logger
- [ ] Add input validation to all forms
- [ ] Add file upload validation
- [ ] Add security event logging
- [ ] Test secure storage with encryption
- [ ] Test input validation with malicious inputs
- [ ] Verify environment validation catches errors
- [ ] Check logs for sensitive data leakage
- [ ] Run security tests

---

## 9. Troubleshooting

### Secure Storage Issues

**Problem:** "Encryption key generation failed"  
**Solution:** Ensure running in secure context (HTTPS or localhost)

**Problem:** "Data not found after refresh"  
**Solution:** Check TTL settings, data may have expired

### Input Validation Issues

**Problem:** "Valid input rejected"  
**Solution:** Check validation rules, may be too strict

**Problem:** "XSS still possible"  
**Solution:** Use DOMPurify for HTML rendering, validation is pre-processing

### Logging Issues

**Problem:** "Sensitive data still visible"  
**Solution:** Check redaction patterns, add custom patterns if needed

---

## 10. Support

For issues or questions:
1. Check this integration guide
2. Review test files for examples
3. Check security documentation
4. Review SECURITY_AUDIT_REPORT.md

---

**Last Updated:** February 1, 2026  
**Version:** 1.0
