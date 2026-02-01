# Security Headers Implementation Guide

## Overview

This application implements comprehensive security headers following OWASP best practices to protect against XSS, clickjacking, MIME-sniffing, and other common web vulnerabilities.

## Implemented Headers

### 1. Content-Security-Policy (CSP)

**Purpose**: Prevents Cross-Site Scripting (XSS) attacks by controlling which resources can be loaded.

**Configuration**:
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https: blob:;
connect-src 'self' https://*.supabase.co wss://*.supabase.co;
font-src 'self' https://fonts.gstatic.com data:;
object-src 'none';
frame-ancestors 'self';
base-uri 'self';
form-action 'self';
```

**What it protects against**:
- XSS attacks via injected scripts
- Clickjacking via iframes
- Protocol downgrade attacks
- Mixed content vulnerabilities

### 2. X-Frame-Options

**Purpose**: Prevents clickjacking attacks.

**Configuration**: `SAMEORIGIN`

**What it protects against**:
- Clickjacking (iframe embedding by malicious sites)
- UI redress attacks

### 3. X-Content-Type-Options

**Purpose**: Prevents MIME-sniffing vulnerabilities.

**Configuration**: `nosniff`

**What it protects against**:
- MIME-type confusion attacks
- Execution of malicious files disguised as safe types

### 4. Strict-Transport-Security (HSTS)

**Purpose**: Forces HTTPS connections.

**Configuration**: `max-age=31536000; includeSubDomains; preload`

**What it protects against**:
- Protocol downgrade attacks
- Man-in-the-middle attacks
- Cookie hijacking

**Note**: Only enabled in production with valid SSL certificate.

### 5. Referrer-Policy

**Purpose**: Controls referrer information sent in requests.

**Configuration**: `strict-origin-when-cross-origin`

**What it protects against**:
- Information leakage via referrer
- Privacy violations

### 6. Permissions-Policy

**Purpose**: Controls which browser features can be used.

**Configuration**:
```
accelerometer=(),
camera=(),
geolocation=(),
gyroscope=(),
magnetometer=(),
microphone=(),
payment=(),
usb=(),
interest-cohort=()
```

**What it protects against**:
- Unauthorized access to device features
- Privacy violations
- FLoC tracking

### 7. X-XSS-Protection

**Purpose**: Legacy XSS protection for older browsers.

**Configuration**: `1; mode=block`

**What it protects against**:
- XSS attacks in older browsers without CSP support

### 8. Cache-Control / Pragma / Expires

**Purpose**: Prevents caching of sensitive data.

**Configuration**:
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

**What it protects against**:
- Sensitive data leakage via browser/proxy caches

## Implementation

### Development Server (Vite)

Security headers are automatically applied via Vite plugin:

```typescript
// vite.config.ts
import { securityHeadersPlugin } from './src/lib/security/viteSecurityPlugin';

export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
});
```

### Production Server (Supabase Edge Functions)

Security headers are applied via middleware:

```typescript
// src/supabase/functions/server/index.tsx
app.use('*', async (c, next) => {
  await next();
  
  // Apply security headers
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    c.header(key, value);
  });
});
```

### Static Hosting (Vercel/Netlify)

For static hosting, add headers configuration:

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Netlify** (`netlify.toml`):
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

## Configuration

### Environment-Based Configuration

Headers are automatically adjusted based on environment:

**Development**:
- More permissive CSP (allows `unsafe-eval` for HMR)
- No HSTS (local development uses HTTP)
- No CSP reporting
- Includes localhost in connect-src

**Production**:
- Strict CSP (no `unsafe-eval`)
- HSTS enabled
- CSP reporting enabled (if configured)
- Only HTTPS connections allowed

### Custom Configuration

Override default configuration:

```typescript
import { getSecurityHeaders } from '@/lib/security/headers';

const headers = getSecurityHeaders({
  environment: 'production',
  enableHSTS: true,
  reportCSPViolations: true,
  cspReportUri: 'https://your-logging-service.com/csp-report'
});
```

## CSP Directives Explained

### default-src 'self'
Default policy for all resource types. Only allow resources from same origin.

### script-src 'self' 'unsafe-inline'
- `'self'`: Allow scripts from same origin
- `'unsafe-inline'`: Required for React inline scripts
- Production: Remove `'unsafe-eval'` (development only for HMR)

### style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
- `'self'`: Allow stylesheets from same origin
- `'unsafe-inline'`: Required for styled-components/inline styles
- External: Google Fonts API

### img-src 'self' data: https: blob:
- `'self'`: Same origin images
- `data:`: Data URLs for inline images
- `https:`: All HTTPS images (user content)
- `blob:`: Blob URLs for dynamic images

### connect-src 'self' https://*.supabase.co wss://*.supabase.co
- `'self'`: Same origin API calls
- Supabase: Backend API endpoints
- WebSocket: Real-time subscriptions

### object-src 'none'
Block all plugins (Flash, Java, etc.)

### frame-ancestors 'self'
Only allow embedding in same origin (prevents clickjacking)

### upgrade-insecure-requests
Automatically upgrade HTTP requests to HTTPS (production only)

### block-all-mixed-content
Block mixed HTTP/HTTPS content (production only)

## Testing

### Automated Tests

Run security header tests:

```bash
npm test -- src/tests/security/headers.test.ts
```

Tests verify:
- All required headers are present
- Headers have correct values
- Environment-specific configuration
- CSP directive coverage
- HSTS configuration

### Manual Testing

#### 1. Check Headers in Browser

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Click on the document request
5. Check Response Headers section

#### 2. Test CSP Violations

Try to inject malicious script:
```javascript
// This should be blocked by CSP
const script = document.createElement('script');
script.src = 'https://evil.com/malicious.js';
document.body.appendChild(script);
```

Check console for CSP violation report.

#### 3. Test Clickjacking Protection

Try to embed the app in an iframe:
```html
<iframe src="https://yourapp.com"></iframe>
```

Should be blocked by X-Frame-Options and CSP frame-ancestors.

#### 4. Online Security Scanners

Use these tools to validate headers:
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

Expected grades:
- Security Headers: A or A+
- Mozilla Observatory: A or A+
- SSL Labs: A or A+ (with proper SSL config)

## Common Issues & Solutions

### Issue: CSP Blocking Legitimate Resources

**Symptom**: Console shows CSP violations for expected resources.

**Solution**: Update CSP directives to allow the resource:
```typescript
// Add to connect-src for API calls
"connect-src 'self' https://api.example.com"

// Add to script-src for external scripts
"script-src 'self' https://cdn.example.com"
```

### Issue: HSTS Causing Problems in Development

**Symptom**: Browser forces HTTPS in local development.

**Solution**: 
- Clear HSTS cache in browser
- Ensure HSTS is disabled in development config
- Use different domain for testing

### Issue: X-Frame-Options Blocking Legitimate Embedding

**Symptom**: App cannot be embedded where needed.

**Solution**: Update X-Frame-Options:
```typescript
// Allow specific origin
"X-Frame-Options": "ALLOW-FROM https://trusted-site.com"

// Or update CSP frame-ancestors
"frame-ancestors 'self' https://trusted-site.com"
```

### Issue: Inline Styles Blocked

**Symptom**: Styles not applying due to CSP.

**Solution**: Add nonce or hash to CSP:
```typescript
// Generate nonce
const nonce = generateNonce();

// Add to CSP
"style-src 'self' 'nonce-${nonce}'"

// Use in HTML
<style nonce="${nonce}">...</style>
```

## Performance Impact

Security headers have minimal performance impact:

- **Header Size**: ~1-2 KB additional headers
- **Processing Time**: Negligible (<1ms)
- **Network Overhead**: One-time per request
- **Browser Processing**: Native browser feature

Benefits far outweigh the minimal overhead.

## Browser Compatibility

All implemented headers are widely supported:

| Header | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| CSP | 25+ | 23+ | 7+ | 12+ |
| X-Frame-Options | All | All | All | All |
| HSTS | 4+ | 4+ | 7+ | 12+ |
| X-Content-Type-Options | 1+ | 50+ | 11+ | 12+ |
| Referrer-Policy | 56+ | 50+ | 11.1+ | 79+ |
| Permissions-Policy | 88+ | 74+ | 15.4+ | 88+ |

Legacy browsers may not support all features but will degrade gracefully.

## Security Best Practices

### DO

✅ Keep headers up to date with latest best practices
✅ Test headers in development before deploying
✅ Monitor CSP violations in production
✅ Use strict CSP directives
✅ Enable HSTS in production
✅ Regular security audits

### DON'T

❌ Use `unsafe-eval` in production
❌ Use `*` wildcards in CSP
❌ Disable security headers for convenience
❌ Ignore CSP violation reports
❌ Allow `unsafe-inline` scripts without nonces
❌ Skip header validation tests

## Monitoring

### CSP Violation Reporting

Configure CSP reporting endpoint:

```typescript
const config = {
  reportCSPViolations: true,
  cspReportUri: 'https://your-logging.com/csp-report'
};
```

### Violation Report Format

```json
{
  "csp-report": {
    "document-uri": "https://yourapp.com/page",
    "violated-directive": "script-src",
    "blocked-uri": "https://evil.com/script.js",
    "original-policy": "default-src 'self'; ..."
  }
}
```

### Alerting

Set up alerts for:
- Repeated CSP violations
- Attempts to embed in iframe
- Mixed content warnings
- HSTS bypass attempts

## Compliance

These security headers help meet compliance requirements:

- **OWASP Top 10**: Addresses A03 (Injection), A05 (Security Misconfiguration)
- **PCI DSS**: Section 6.5.7 (XSS), 6.5.9 (Clickjacking)
- **GDPR**: Privacy and security requirements
- **SOC 2**: Security controls

## Additional Resources

- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Content Security Policy Guide](https://content-security-policy.com/)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)

## Updates & Maintenance

Review and update security headers:
- **Monthly**: Check for new vulnerabilities
- **Quarterly**: Review CSP violation reports
- **Annually**: Full security audit
- **On Changes**: Test headers after major updates

## Support

For issues with security headers:
1. Check browser console for errors
2. Validate headers with online tools
3. Review this documentation
4. Check test files for examples
5. Open issue with header configuration and errors
