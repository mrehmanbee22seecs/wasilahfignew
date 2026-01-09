# 🚀 Wasilah Auth System - Production Setup Guide

Complete guide to deploy the authentication system to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Migration](#database-migration)
4. [Environment Configuration](#environment-configuration)
5. [OAuth Setup](#oauth-setup)
6. [Frontend Deployment](#frontend-deployment)
7. [Testing](#testing)
8. [Monitoring & Security](#monitoring--security)

---

## ✅ Prerequisites

### Required Software

- [ ] **Node.js** 18+ installed
- [ ] **npm** or **pnpm** package manager
- [ ] **Git** for version control
- [ ] **Supabase CLI** (optional but recommended)

### Required Accounts

- [ ] **Supabase** account ([Sign up](https://supabase.com))
- [ ] **Google Cloud** account (for OAuth)
- [ ] **LinkedIn Developer** account (optional)
- [ ] **Domain** for production deployment

---

## 🗄️ Supabase Project Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **New Project**
3. Fill in details:
   - **Name:** Wasilah Production
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to Pakistan (e.g., Singapore, Mumbai)
   - **Plan:** Free (can upgrade later)
4. Click **Create new project**
5. Wait ~2 minutes for project initialization

### Step 2: Get API Credentials

1. Go to **Settings → API**
2. Copy these values (you'll need them):
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGc...` (safe for frontend)
   - **Service Role Key:** `eyJhbGc...` (NEVER expose to frontend!)

### Step 3: Configure Email Settings (Important!)

By default, Supabase uses their email service with rate limits.

#### Option A: Use Supabase Email (Quick Start)

1. Go to **Authentication → Email Templates**
2. Customize email templates:
   - **Confirm signup:** Welcome email with OTP
   - **Reset password:** Password reset instructions
3. Test by signing up a test account

#### Option B: Use Custom SMTP (Production)

1. Go to **Settings → Auth → SMTP Settings**
2. Enable custom SMTP
3. Configure your email service:
   ```
   Host: smtp.sendgrid.net (or your provider)
   Port: 587
   Username: apikey
   Password: [Your SendGrid API key]
   Sender email: noreply@wasilah.pk
   Sender name: Wasilah
   ```
4. Test email delivery

---

## 📊 Database Migration

### Step 1: Install Supabase CLI (Optional)

```bash
npm install -g supabase
```

### Step 2: Run Migration Manually

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy contents of `/supabase/migrations/001_create_auth_tables.sql`
4. Paste into SQL Editor
5. Click **Run**
6. Verify success (should see "Success" message)

### Step 3: Verify Tables Created

1. Go to **Table Editor**
2. Check for these tables:
   - ✅ `profiles`
   - ✅ `organizations`
   - ✅ `auth_metadata`
   - ✅ `rate_limits`

### Step 4: Test Database Functions

Run this query to test the rate limit function:

```sql
SELECT check_rate_limit(
  'test@example.com',
  'email',
  'login_attempt',
  5,
  15
);
```

Expected result: `{"allowed": true, "attempts_left": 4}`

---

## ⚙️ Environment Configuration

### Step 1: Copy Environment Template

```bash
cp .env.example .env
```

### Step 2: Fill in Values

Edit `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

# Environment
NODE_ENV=production

# App Configuration
VITE_APP_NAME=Wasilah
VITE_APP_URL=https://wasilah.pk
```

### Step 3: Verify Environment Variables

Create a test file `test-env.js`:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

Run: `node test-env.js`

---

## 🔐 OAuth Setup

### Google OAuth (Recommended - 15 minutes)

Follow detailed guide: [`/docs/OAUTH_SETUP.md`](/docs/OAUTH_SETUP.md)

**Quick Steps:**

1. Google Cloud Console → Create OAuth Client
2. Add callback URL: `https://your-project-id.supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → Google
4. Enable and add Client ID + Secret
5. Test: Click "Continue with Google" in your app

### LinkedIn OAuth (Optional - 30 minutes + review)

1. LinkedIn Developers → Create App
2. Request "Sign In with LinkedIn" access
3. Add callback URL
4. Configure in Supabase
5. Test

---

## 🚀 Frontend Deployment

### Option A: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Configure Domain**
   - Add custom domain: wasilah.pk
   - Update OAuth redirect URLs to use new domain

### Option B: Netlify

1. **Connect Git Repository**
2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables:**
   - Add Supabase URL and key
4. **Deploy**

### Option C: Manual Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server

3. **Configure Nginx/Apache** for SPA routing

---

## 🧪 Testing

### Pre-Launch Testing Checklist

#### Authentication Flow

- [ ] **Signup**
  - [ ] Email/password signup works
  - [ ] Strong password validation enforced
  - [ ] OTP email received within 1 minute
  - [ ] Duplicate email detected and blocked
  
- [ ] **Email Verification**
  - [ ] 6-digit OTP entry works
  - [ ] Paste functionality works
  - [ ] Invalid code shows error
  - [ ] Resend cooldown timer works (30s)
  - [ ] Expired codes rejected
  
- [ ] **Login**
  - [ ] Email/password login works
  - [ ] Wrong password shows error
  - [ ] Remember me checkbox works
  - [ ] Account lockout after failed attempts
  
- [ ] **OAuth**
  - [ ] Google OAuth works
  - [ ] LinkedIn OAuth works (if enabled)
  - [ ] OAuth account linking works
  - [ ] Email conflict handled gracefully
  
- [ ] **Password Reset**
  - [ ] Forgot password modal opens
  - [ ] Reset email received
  - [ ] Reset link works
  - [ ] New password can be set
  
- [ ] **Role Selection**
  - [ ] All 3 roles selectable
  - [ ] Organization name field appears when checked
  - [ ] Skip option works
  
- [ ] **Onboarding**
  - [ ] Step 1 form validation works
  - [ ] Step 2 interests selectable
  - [ ] Profile photo upload works
  - [ ] Back button works
  - [ ] Complete button redirects correctly

#### Rate Limiting

- [ ] Signup rate limit (3 per hour) enforced
- [ ] Login rate limit (10 per 15 min) enforced
- [ ] OTP resend rate limit (3 per hour) enforced
- [ ] Password reset rate limit (3 per hour) enforced

#### Security

- [ ] HTTPS enforced in production
- [ ] Passwords hashed (Supabase handles this)
- [ ] SQL injection protected (Supabase RLS)
- [ ] XSS protected (React escapes by default)
- [ ] CSRF protected (Supabase handles this)

#### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus states visible
- [ ] Error messages announced
- [ ] Color contrast meets WCAG AA

#### Performance

- [ ] Page loads in <3 seconds
- [ ] No console errors
- [ ] Images optimized
- [ ] Bundle size <500KB

---

## 📊 Monitoring & Security

### Enable Supabase Auth Logging

1. Supabase Dashboard → **Logs → Auth Logs**
2. Monitor for:
   - Failed login attempts
   - Unusual signup patterns
   - OAuth errors

### Set Up Error Tracking

**Option 1: Sentry**

```bash
npm install @sentry/react
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://...@sentry.io/...",
  environment: "production",
});
```

**Option 2: LogRocket**

```bash
npm install logrocket
```

### Monitor Key Metrics

Track these in analytics:

- **Signup funnel:**
  - Signup form viewed
  - Signup attempted
  - OTP sent
  - OTP verified
  - Role selected
  - Onboarding completed

- **Error rates:**
  - Failed logins
  - Failed signups
  - OTP errors
  - OAuth errors

- **Performance:**
  - Auth flow completion time
  - Page load times

---

## 🔒 Security Checklist

### Before Going Live

- [ ] **Environment Variables**
  - [ ] Service Role key NOT in frontend code
  - [ ] .env file in .gitignore
  - [ ] Production secrets rotated from dev

- [ ] **Supabase Security**
  - [ ] Row Level Security (RLS) enabled on all tables
  - [ ] Email confirmation required for signup
  - [ ] Rate limiting configured
  - [ ] JWT expiry set (default 1 hour is good)

- [ ] **OAuth Security**
  - [ ] Redirect URIs restricted to production domain
  - [ ] Client secrets not committed to Git
  - [ ] HTTPS enforced

- [ ] **Email Security**
  - [ ] SPF/DKIM records configured (if custom SMTP)
  - [ ] Email templates reviewed for phishing protection
  - [ ] Sender domain verified

- [ ] **Application Security**
  - [ ] HTTPS everywhere
  - [ ] Content Security Policy (CSP) configured
  - [ ] CORS configured correctly
  - [ ] Dependencies updated (no known vulnerabilities)

---

## 🆘 Troubleshooting

### "Supabase client error: Invalid API key"

**Cause:** Wrong or missing anon key

**Fix:**
1. Check `.env` file has correct `VITE_SUPABASE_ANON_KEY`
2. Restart dev server after changing `.env`
3. Verify key in Supabase Dashboard → Settings → API

### "Email not received"

**Cause:** Email service not configured or in spam

**Fix:**
1. Check Supabase email logs: Logs → Auth Logs
2. Check spam folder
3. Configure custom SMTP (SendGrid, AWS SES)
4. Verify sender domain

### "OAuth redirect mismatch"

**Cause:** Callback URL doesn't match

**Fix:**
1. Supabase callback URL: `https://xxx.supabase.co/auth/v1/callback`
2. Must match exactly in OAuth provider console
3. No trailing slashes, include /auth/v1/callback

### "Rate limit exceeded"

**Cause:** Too many attempts

**Fix:**
1. Wait for cooldown period
2. Check rate limit logic in database
3. Adjust limits if needed for testing

---

## 📚 Post-Launch Tasks

### Week 1

- [ ] Monitor error logs daily
- [ ] Fix any critical bugs
- [ ] Collect user feedback
- [ ] Track signup conversion rate

### Week 2-4

- [ ] Analyze auth funnel drop-off
- [ ] A/B test OAuth button placement
- [ ] Optimize onboarding flow
- [ ] Add more OAuth providers if needed

### Ongoing

- [ ] Rotate OAuth secrets every 6 months
- [ ] Update dependencies monthly
- [ ] Monitor failed auth attempts
- [ ] Review and update email templates

---

## 🎯 Success Metrics

Track these KPIs:

- **Signup Completion Rate:** >60%
- **Email Verification Rate:** >80%
- **OAuth Usage:** >30% of signups
- **Failed Login Rate:** <5%
- **Avg. Onboarding Time:** <3 minutes

---

## 📞 Support

- **Documentation:** `/docs/AUTH_HANDOFF.md`
- **OAuth Setup:** `/docs/OAUTH_SETUP.md`
- **Supabase Docs:** https://supabase.com/docs
- **Email:** developers@wasilah.pk

---

**Version:** 1.0.0  
**Last Updated:** January 7, 2024  
**Status:** Production Ready
