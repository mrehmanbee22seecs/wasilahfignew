# Rate Limiting & Validation Implementation Guide

## Overview

This document describes the rate limiting and input validation implementation for brute force protection in the Wasilah platform. The system provides comprehensive protection against abuse while maintaining a smooth user experience.

## Table of Contents

1. [Rate Limiting Strategy](#rate-limiting-strategy)
2. [Configuration](#configuration)
3. [Implementation Details](#implementation-details)
4. [Validation Rules](#validation-rules)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Monitoring & Logging](#monitoring--logging)

## Rate Limiting Strategy

### Architecture

The rate limiting system is implemented client-side using localStorage for persistence. This approach provides:

- **Session persistence**: Rate limits survive page refreshes
- **Immediate feedback**: No server round-trip required
- **Exponential backoff**: Progressive penalties for repeated failures
- **Automatic cleanup**: Old entries are removed automatically

### Protected Endpoints

#### Authentication (Strict Limits)
- **Login**: 5 attempts per 15 minutes
- **Signup**: 3 attempts per hour
- **Password Reset**: 3 attempts per hour
- **OTP Verification**: 5 attempts per 10 minutes

#### Mutations (Moderate Limits)
- **Create Project**: 10 attempts per minute
- **Update Project**: 20 attempts per minute
- **Delete Project**: 5 attempts per minute
- **Create Application**: 5 attempts per 5 minutes
- **Create Payment**: 3 attempts per 5 minutes (very strict)

#### Admin Operations (Higher Limits)
- **Vetting Operations**: 30 attempts per minute
- **Bulk Operations**: 5 attempts per 5 minutes

### Exponential Backoff

For critical endpoints (login, signup, OTP, payments), exponential backoff is enabled:

- **First violation**: Base block duration (e.g., 15 minutes)
- **Second violation**: 2× base duration (30 minutes)
- **Third violation**: 4× base duration (1 hour)
- **Maximum**: 24 hours

## Configuration

### Environment Variables

All rate limits are configurable via environment variables in `.env`:

```bash
# Authentication Rate Limits
VITE_RATE_LIMIT_LOGIN_MAX=5
VITE_RATE_LIMIT_LOGIN_WINDOW_MS=900000          # 15 minutes
VITE_RATE_LIMIT_LOGIN_BLOCK_MS=900000           # 15 minutes

VITE_RATE_LIMIT_SIGNUP_MAX=3
VITE_RATE_LIMIT_SIGNUP_WINDOW_MS=3600000        # 1 hour
VITE_RATE_LIMIT_SIGNUP_BLOCK_MS=3600000         # 1 hour

VITE_RATE_LIMIT_PASSWORD_RESET_MAX=3
VITE_RATE_LIMIT_PASSWORD_RESET_WINDOW_MS=3600000
VITE_RATE_LIMIT_PASSWORD_RESET_BLOCK_MS=3600000

VITE_RATE_LIMIT_OTP_MAX=5
VITE_RATE_LIMIT_OTP_WINDOW_MS=600000            # 10 minutes
VITE_RATE_LIMIT_OTP_BLOCK_MS=1800000            # 30 minutes

# Mutation Rate Limits
VITE_RATE_LIMIT_CREATE_MAX=10
VITE_RATE_LIMIT_CREATE_WINDOW_MS=60000          # 1 minute
VITE_RATE_LIMIT_CREATE_BLOCK_MS=300000          # 5 minutes

VITE_RATE_LIMIT_UPDATE_MAX=20
VITE_RATE_LIMIT_UPDATE_WINDOW_MS=60000
VITE_RATE_LIMIT_UPDATE_BLOCK_MS=180000          # 3 minutes

VITE_RATE_LIMIT_DELETE_MAX=5
VITE_RATE_LIMIT_DELETE_WINDOW_MS=60000
VITE_RATE_LIMIT_DELETE_BLOCK_MS=300000

VITE_RATE_LIMIT_APPLICATION_MAX=5
VITE_RATE_LIMIT_APPLICATION_WINDOW_MS=300000    # 5 minutes
VITE_RATE_LIMIT_APPLICATION_BLOCK_MS=600000     # 10 minutes

VITE_RATE_LIMIT_PAYMENT_MAX=3
VITE_RATE_LIMIT_PAYMENT_WINDOW_MS=300000
VITE_RATE_LIMIT_PAYMENT_BLOCK_MS=1800000        # 30 minutes

# Admin Rate Limits
VITE_RATE_LIMIT_ADMIN_MAX=30
VITE_RATE_LIMIT_ADMIN_WINDOW_MS=60000
VITE_RATE_LIMIT_ADMIN_BLOCK_MS=300000

VITE_RATE_LIMIT_ADMIN_BULK_MAX=5
VITE_RATE_LIMIT_ADMIN_BULK_WINDOW_MS=300000
VITE_RATE_LIMIT_ADMIN_BULK_BLOCK_MS=600000
```

### Adjusting Limits

To modify rate limits:

1. Update the appropriate environment variable in `.env`
2. Restart the development server: `npm run dev`
3. For production, update environment variables in your hosting platform
4. No code changes required

## Implementation Details

### Core Functions

#### Check Rate Limit

```typescript
import { checkRateLimit } from '@/lib/rateLimit';

const result = checkRateLimit('login', 'user-identifier');

if (!result.allowed) {
  console.log(`Rate limited: ${result.message}`);
  console.log(`Retry after: ${result.retryAfter} seconds`);
} else {
  console.log(`Remaining attempts: ${result.remainingAttempts}`);
}
```

#### Record Attempt

```typescript
import { recordAttempt } from '@/lib/rateLimit';

// Record successful attempt (resets failure count)
recordAttempt('login', 'user-identifier', true);

// Record failed attempt (increments failure count)
recordAttempt('login', 'user-identifier', false);
```

#### Reset Rate Limit

```typescript
import { resetRateLimit } from '@/lib/rateLimit';

// Clear rate limit for specific endpoint/user
resetRateLimit('login', 'user-identifier');
```

### Integration Examples

#### Auth Service Integration

```typescript
import { checkRateLimit, recordAttempt, getIdentifier } from '@/lib/rateLimit';

export async function login(data: LoginData) {
  const identifier = getIdentifier(data.email);
  
  // Check rate limit before attempting login
  const rateLimit = checkRateLimit('login', identifier);
  if (!rateLimit.allowed) {
    return { 
      success: false, 
      error: rateLimit.message, 
      code: 'RATE_LIMIT_EXCEEDED' 
    };
  }
  
  // Attempt login
  const result = await supabase.auth.signInWithPassword(data);
  
  // Record result
  recordAttempt('login', identifier, !result.error);
  
  return result;
}
```

#### API Integration

```typescript
import { wrapApiCallWithRateLimit } from '@/lib/api/base';

// Projects API
async create(input: CreateProjectInput) {
  return wrapApiCallWithRateLimit(
    () => supabase.from('projects').insert(input).select().single(),
    'createProject'  // Rate limit endpoint key
  );
}
```

#### React Query Integration

```typescript
import { useRateLimitedMutation } from '@/lib/rateLimit';

// In a component or hook
const loginMutation = useRateLimitedMutation(
  (data: LoginData) => authApi.login(data),
  {
    rateLimitKey: 'login',
    useUserRateLimit: false,  // Use email-based rate limiting
    onSuccess: (data) => {
      toast.success('Login successful');
    },
    onError: (error) => {
      if (error instanceof RateLimitError) {
        toast.error(error.userMessage);
      }
    }
  }
);
```

## Validation Rules

### Authentication

#### Login
- Email: Valid email format
- Password: Required (any string)

#### Signup
- Email: Valid email format
- Password: Minimum 8 characters, at least one uppercase, one lowercase, one number
- Full Name: Minimum 2 characters, maximum 100 characters

#### Password Reset
- Email: Valid email format

### Projects

- **Title**: 5-200 characters
- **Description**: 50-5000 characters
- **Budget**: PKR 10,000 - 100,000,000
- **Start Date**: Must be in the future
- **End Date**: Must be after start date
- **Location**: Minimum 3 characters
- **City**: Minimum 2 characters
- **Province**: Must be valid Pakistani province
- **SDG Goals**: At least one goal (1-17)
- **Focus Areas**: At least one area
- **Volunteer Capacity**: 1-1000 volunteers

### Applications

- **Project ID**: Valid UUID
- **Cover Letter**: 100-2000 characters
- **Availability Notes**: Minimum 20 characters
- **Skills Offered**: At least one skill
- **Hours Committed**: 1-40 hours per week

### Payments

- **Project ID**: Valid UUID
- **Amount**: PKR 1,000 - 50,000,000
- **Invoice URL**: Valid URL (optional)
- **Notes**: Maximum 1000 characters (optional)

## Error Handling

### Error Types

Rate limit errors are handled via the `RateLimitError` class:

```typescript
export class RateLimitError extends BaseError {
  retryAfter?: number;  // seconds until can retry
  endpoint?: string;    // affected endpoint
}
```

### User Messages

Rate limit errors provide user-friendly messages:

- "Too many attempts. Please try again in 5 minutes."
- "Too many requests. Please wait 30 seconds before trying again."

### Error Display

In UI components:

```typescript
if (error instanceof RateLimitError) {
  toast.error(error.userMessage, {
    duration: error.retryAfter ? error.retryAfter * 1000 : 5000
  });
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:run -- src/lib/rateLimit/__tests__/rateLimiter.test.ts
npm run test:run -- src/lib/validation/__tests__/validation.test.ts

# Run with coverage
npm run test:coverage
```

### Test Coverage

#### Rate Limiting Tests (17 tests)
- ✅ Allow first request
- ✅ Allow requests within limit
- ✅ Block after exceeding limit
- ✅ Reset after time window expires
- ✅ Handle successful attempts
- ✅ Implement exponential backoff
- ✅ Record attempts correctly
- ✅ Reset rate limits
- ✅ Generate identifiers
- ✅ Track violations
- ✅ Different limits for different endpoints

#### Validation Tests (23 tests)
- ✅ Login validation (3 tests)
- ✅ Signup validation (5 tests)
- ✅ Project validation (7 tests)
- ✅ Application validation (5 tests)
- ✅ Payment validation (3 tests)

## Monitoring & Logging

### Violation Logging

Rate limit violations are automatically logged:

```typescript
{
  type: 'RATE_LIMIT_VIOLATION',
  endpoint: 'login',
  identifier: 'email_123...',
  attempts: 5,
  failures: 5,
  blockedUntil: 1769942163700,
  timestamp: '2026-02-01T06:36:03.700Z',
  userAgent: 'Mozilla/5.0...'
}
```

### Accessing Violations

```typescript
import { getRateLimitViolations } from '@/lib/rateLimit';

// Get all active violations
const violations = getRateLimitViolations();

violations.forEach(v => {
  console.log(`${v.endpoint} - ${v.identifier} - blocked until ${v.blockedUntil}`);
});
```

### Production Logging

In production, violations are sent to a logging service:

```typescript
// Automatically sent to /api/logs/security endpoint
// Configure your backend to capture these logs
```

## Best Practices

### 1. Choose Appropriate Limits

- Authentication: Strict (3-5 attempts)
- Mutations: Moderate (10-20 attempts)
- Admin: Higher (30+ attempts)

### 2. Use Exponential Backoff for Critical Endpoints

Enable exponential backoff for:
- Login attempts
- Password reset
- Payment creation
- Any endpoint with sensitive operations

### 3. Clear Rate Limits on Success

Always record successful attempts to reset failure counts:

```typescript
recordAttempt(endpoint, identifier, true);
```

### 4. Provide Clear User Feedback

Always display:
- Why the request was blocked
- How long until they can retry
- Remaining attempts (when not blocked)

### 5. Monitor and Adjust

Regularly review:
- Rate limit violations
- User complaints about being blocked
- Adjust limits based on legitimate use patterns

## Troubleshooting

### Issue: Users Blocked Too Quickly

**Solution**: Increase `maxAttempts` or `windowMs` for the endpoint

```bash
# In .env
VITE_RATE_LIMIT_LOGIN_MAX=10  # Increase from 5 to 10
```

### Issue: Rate Limits Not Working

**Check**:
1. localStorage is enabled in browser
2. Environment variables are set correctly
3. Rate limit key matches in code
4. Identifiers are consistent

### Issue: Exponential Backoff Too Aggressive

**Solution**: Disable exponential backoff or adjust base duration

```typescript
// In rateLimiter.ts config
{
  useExponentialBackoff: false,  // Disable
  // OR
  blockDurationMs: 300000,  // Reduce base duration
}
```

## Security Considerations

### 1. Client-Side Limitations

- Client-side rate limiting can be bypassed by clearing localStorage
- Implement server-side rate limiting for production (Supabase RLS + Edge Functions)
- Use this implementation as first line of defense

### 2. Identifier Privacy

- Email addresses are hashed before storage
- User IDs are preferred over emails when available
- No personally identifiable information in logs

### 3. Storage Security

- Rate limit data stored in localStorage (not sensitive)
- Violations logged without PII
- Automatic cleanup prevents storage bloat

## Future Enhancements

### 1. Server-Side Rate Limiting

Implement complementary server-side limits using:
- Supabase Edge Functions
- Rate limiting middleware (Hono.js)
- Database-backed tracking

### 2. IP-Based Tracking

Add IP address tracking for anonymous users:
- Requires backend support
- More accurate than client-side only
- Prevents easy bypass

### 3. Advanced Analytics

- Dashboard for rate limit metrics
- Alert on suspicious patterns
- Automatic adjustment based on traffic

### 4. CAPTCHA Integration

Trigger reCAPTCHA after repeated failures:
- Already implemented for auth endpoints
- Extend to other endpoints as needed

## Support

For questions or issues:
1. Check this documentation
2. Review test files for examples
3. Consult the code comments in `/src/lib/rateLimit/`
4. Contact the development team

---

**Last Updated**: 2026-02-01  
**Version**: 1.0.0
