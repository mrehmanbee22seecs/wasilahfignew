# 🚀 WASILAH BACKEND - COMPLETE SETUP GUIDE

**Last Updated:** January 9, 2026  
**Estimated Time:** 45-60 minutes

This guide will take you through every manual step needed to make your Wasilah backend fully functional.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#1-prerequisites)
2. [Supabase Project Setup](#2-supabase-project-setup)
3. [Environment Variables](#3-environment-variables)
4. [Database Migrations](#4-database-migrations)
5. [Authentication Configuration](#5-authentication-configuration)
6. [OAuth Provider Setup](#6-oauth-provider-setup)
7. [Storage Buckets](#7-storage-buckets)
8. [Realtime Configuration](#8-realtime-configuration)
9. [Email Templates](#9-email-templates)
10. [Security & RLS Verification](#10-security--rls-verification)
11. [Testing](#11-testing)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. PREREQUISITES

### What You Need:
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] A Supabase account (free tier works)
- [ ] Google Cloud Console account (for OAuth - optional)
- [ ] LinkedIn Developer account (for OAuth - optional)
- [ ] Microsoft Azure account (for OAuth - optional)
- [ ] Apple Developer account (for OAuth - optional)

### Install Dependencies:
```bash
npm install zod @supabase/supabase-js motion sonner@2.0.3
```

---

## 2. SUPABASE PROJECT SETUP

### Step 1: Create New Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `wasilah-production` (or your choice)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to Pakistan (e.g., Singapore, Mumbai)
   - **Pricing Plan:** Free (or Pro if needed)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - **Keep this secret!**

---

## 3. ENVIRONMENT VARIABLES

### Step 1: Create `.env` File

In your project root, create a `.env` file:

```bash
touch .env
```

### Step 2: Add Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service Role Key (for admin operations only - never expose to client!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: OAuth Redirect URLs (fill in after OAuth setup)
VITE_GOOGLE_REDIRECT_URL=https://your-project.supabase.co/auth/v1/callback
VITE_LINKEDIN_REDIRECT_URL=https://your-project.supabase.co/auth/v1/callback
VITE_MICROSOFT_REDIRECT_URL=https://your-project.supabase.co/auth/v1/callback
VITE_APPLE_REDIRECT_URL=https://your-project.supabase.co/auth/v1/callback

# App Configuration
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Wasilah
```

### Step 3: Update `/lib/supabase.ts`

Verify your supabase configuration file has correct imports:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 4. DATABASE MIGRATIONS

### Step 1: Access SQL Editor

1. In Supabase Dashboard, click **SQL Editor** in left sidebar
2. Click **"New query"**

### Step 2: Run Migrations in Order

**IMPORTANT:** Run these migrations in exact order, one at a time.

#### Migration 1: Auth Tables

1. Open `/supabase/migrations/001_create_auth_tables.sql`
2. Copy the **entire contents**
3. Paste into Supabase SQL Editor
4. Click **"Run"** (bottom right)
5. Verify: Should see "Success. No rows returned"

**What this creates:**
- profiles table
- organizations table
- auth_metadata table
- rate_limits table
- Helper functions
- RLS policies

#### Migration 2: Application Tables

1. Open `/supabase/migrations/002_create_application_tables.sql`
2. Copy the **entire contents**
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Verify success

**What this creates:**
- projects table
- volunteer_applications table
- volunteer_hours table
- certificates table
- ngo_documents table
- csr_budgets table
- payment_approvals table
- vetting_queue table
- audit_logs table

#### Migration 3: Realtime Tables

1. Open `/supabase/migrations/003_create_realtime_tables.sql`
2. Copy the **entire contents**
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Verify success

**What this creates:**
- notifications table
- activity_feed table
- user_sessions table
- realtime_events table
- Notification functions
- Activity tracking functions

#### Migration 4: Error Logs

1. Open `/supabase/migrations/004_create_error_logs_table.sql`
2. Copy the **entire contents**
3. Paste into Supabase SQL Editor
4. Click **"Run"**
5. Verify success

**What this creates:**
- error_logs table
- Error statistics functions
- Error cleanup functions

### Step 3: Verify Tables Created

1. In Supabase, go to **Table Editor**
2. You should see **18 tables**:
   - profiles
   - organizations
   - auth_metadata
   - rate_limits
   - projects
   - volunteer_applications
   - volunteer_hours
   - certificates
   - ngo_documents
   - csr_budgets
   - payment_approvals
   - vetting_queue
   - audit_logs
   - notifications
   - activity_feed
   - user_sessions
   - realtime_events
   - error_logs

3. Click on each table to verify structure

---

## 5. AUTHENTICATION CONFIGURATION

### Step 1: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Toggle **ON** if not already enabled
4. Configure:
   - ✅ Enable email confirmations
   - ✅ Enable email change confirmations
   - ✅ Secure email change
   - Confirmation expiry: `24 hours`
   - Rate limit: `10 per hour`

### Step 2: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:5173` (for development)
3. Add **Redirect URLs:**
   ```
   http://localhost:5173
   http://localhost:5173/auth/callback
   http://localhost:5173/dashboard
   https://yourdomain.com (when deployed)
   https://yourdomain.com/auth/callback (when deployed)
   ```

### Step 3: Configure Email Settings

1. Go to **Authentication** → **Email Settings**
2. **Sender name:** `Wasilah`
3. **Sender email:** Your verified email or use Supabase default
4. **Enable email confirmations:** ✅ ON
5. **Double confirm email changes:** ✅ ON

### Step 4: Rate Limiting

1. Go to **Authentication** → **Rate Limits**
2. Configure:
   - Sign up: `10 per hour`
   - Sign in: `30 per hour`
   - Password reset: `5 per hour`
   - Email change: `5 per hour`

---

## 6. OAUTH PROVIDER SETUP

### 🔵 Google OAuth (Recommended)

#### Step 1: Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: **"Wasilah"**
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
6. Configure consent screen:
   - User type: **External**
   - App name: **Wasilah**
   - User support email: Your email
   - Authorized domains: Your domain
   - Scopes: `email`, `profile`, `openid`
7. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Wasilah Web**
   - Authorized redirect URIs:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
8. Copy **Client ID** and **Client Secret**

#### Step 2: Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Find **Google**
3. Toggle **ON**
4. Paste:
   - **Client ID:** (from Google)
   - **Client Secret:** (from Google)
5. Copy the **Callback URL** shown (use this in Google Console)
6. Click **Save**

### 🔵 LinkedIn OAuth

#### Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers)
2. Click **"Create app"**
3. Fill in:
   - App name: **Wasilah**
   - LinkedIn Page: Your company page
   - App logo: Upload logo
4. In **Auth** tab:
   - Add Redirect URL: `https://your-project.supabase.co/auth/v1/callback`
5. In **Products** tab:
   - Request access to **"Sign In with LinkedIn"**
6. Copy **Client ID** and **Client Secret**

#### Step 2: Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Find **LinkedIn**
3. Toggle **ON**
4. Paste:
   - **Client ID:** (from LinkedIn)
   - **Client Secret:** (from LinkedIn)
5. Click **Save**

### 🔵 Microsoft OAuth

#### Step 1: Create Microsoft App

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Fill in:
   - Name: **Wasilah**
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: `https://your-project.supabase.co/auth/v1/callback`
5. Copy **Application (client) ID**
6. Go to **Certificates & secrets** → **New client secret**
7. Copy the **secret value** (you can only see it once!)

#### Step 2: Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Find **Azure (Microsoft)**
3. Toggle **ON**
4. Paste:
   - **Client ID:** (from Azure)
   - **Client Secret:** (from Azure)
5. Click **Save**

### 🔵 Apple OAuth

#### Step 1: Create Apple App

1. Go to [Apple Developer](https://developer.apple.com)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **+** button
4. Select **App IDs** → Continue
5. Fill in:
   - Description: **Wasilah**
   - Bundle ID: `com.wasilah.app`
   - Capabilities: Enable **Sign In with Apple**
6. Create **Service ID**:
   - Identifier: `com.wasilah.service`
   - Enable **Sign In with Apple**
   - Configure:
     - Domains: `your-project.supabase.co`
     - Return URLs: `https://your-project.supabase.co/auth/v1/callback`
7. Create **Key** for Sign in with Apple
8. Download key file (.p8)

#### Step 2: Configure in Supabase

1. Go to **Authentication** → **Providers**
2. Find **Apple**
3. Toggle **ON**
4. Fill in:
   - **Services ID:** (from Apple)
   - **Team ID:** (from Apple Developer account)
   - **Key ID:** (from key you created)
   - **Private Key:** (paste contents of .p8 file)
5. Click **Save**

---

## 7. STORAGE BUCKETS

### Step 1: Create Buckets

1. Go to **Storage** in Supabase Dashboard
2. Click **"Create a new bucket"**

#### Bucket 1: project-media

- **Name:** `project-media`
- **Public bucket:** ✅ YES
- **File size limit:** 5 MB
- **Allowed MIME types:** `image/png, image/jpeg, image/jpg, image/webp, video/mp4`
- Click **Create bucket**

#### Bucket 2: ngo-media

- **Name:** `ngo-media`
- **Public bucket:** ✅ YES
- **File size limit:** 5 MB
- **Allowed MIME types:** `image/png, image/jpeg, image/jpg, image/webp`
- Click **Create bucket**

#### Bucket 3: ngo-documents

- **Name:** `ngo-documents`
- **Public bucket:** ❌ NO (private)
- **File size limit:** 10 MB
- **Allowed MIME types:** `application/pdf, image/png, image/jpeg, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Click **Create bucket**

### Step 2: Configure Bucket Policies

For each bucket, click on it → **Policies** tab → **New Policy**

#### project-media Policies:

**Policy 1: Public Read**
```sql
-- Name: Public read access
-- Operation: SELECT
CREATE POLICY "Public can view project media"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-media');
```

**Policy 2: Authenticated Upload**
```sql
-- Name: Authenticated users can upload
-- Operation: INSERT
CREATE POLICY "Authenticated users can upload project media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-media' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Owner Delete**
```sql
-- Name: Users can delete their own files
-- Operation: DELETE
CREATE POLICY "Users can delete own project media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-media' 
  AND auth.uid() = owner
);
```

#### ngo-media Policies:

Same as project-media, but replace `'project-media'` with `'ngo-media'`

#### ngo-documents Policies:

**Policy 1: NGO Read Own**
```sql
-- Name: NGOs can view their own documents
-- Operation: SELECT
CREATE POLICY "NGOs can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ngo-documents' 
  AND auth.uid() = owner
);
```

**Policy 2: NGO Upload**
```sql
-- Name: NGOs can upload documents
-- Operation: INSERT
CREATE POLICY "NGOs can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ngo-documents' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Admin Read All**
```sql
-- Name: Admins can view all documents
-- Operation: SELECT
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ngo-documents'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
```

---

## 8. REALTIME CONFIGURATION

### Step 1: Enable Realtime

1. Go to **Database** → **Replication**
2. Find **Realtime** section
3. Toggle **ON** for these tables:
   - ✅ profiles
   - ✅ projects
   - ✅ volunteer_applications
   - ✅ volunteer_hours
   - ✅ payment_approvals
   - ✅ vetting_queue
   - ✅ notifications
   - ✅ activity_feed
   - ✅ user_sessions
   - ✅ audit_logs
   - ✅ csr_budgets

### Step 2: Configure Realtime Policies

1. Go to **Authentication** → **Policies**
2. For each table, ensure RLS is **ENABLED** (should already be from migrations)
3. Verify policies allow realtime subscriptions

### Step 3: Test Realtime Connection

Run this in browser console after app starts:
```javascript
import { supabase } from './lib/supabase';

const channel = supabase
  .channel('test')
  .on('presence', { event: 'sync' }, () => {
    console.log('Realtime connected!');
  })
  .subscribe();
```

---

## 9. EMAIL TEMPLATES

### Step 1: Configure Email Templates

1. Go to **Authentication** → **Email Templates**

### Template 1: Confirm Signup

Replace default template with:

**Subject:** `Verify your Wasilah account`

**Body (HTML):**
```html
<h2>Welcome to Wasilah!</h2>
<p>Hi there,</p>
<p>Thank you for signing up with Wasilah - Pakistan's premier CSR platform connecting corporates, NGOs, and volunteers for meaningful impact.</p>
<p>Please verify your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 6px;">Verify Email Address</a></p>
<p>This link will expire in 24 hours.</p>
<p>If you didn't create an account with Wasilah, you can safely ignore this email.</p>
<br>
<p>Best regards,<br>The Wasilah Team</p>
<hr>
<p style="font-size: 12px; color: #666;">Wasilah | Building Bridges for Social Impact | www.wasilah.pk</p>
```

### Template 2: Invite User

**Subject:** `You've been invited to join Wasilah`

**Body (HTML):**
```html
<h2>You're invited to Wasilah!</h2>
<p>Hi there,</p>
<p>You've been invited to join Wasilah - Pakistan's leading CSR platform.</p>
<p>Click the button below to accept your invitation and create your account:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 6px;">Accept Invitation</a></p>
<br>
<p>Best regards,<br>The Wasilah Team</p>
```

### Template 3: Magic Link

**Subject:** `Your Wasilah login link`

**Body (HTML):**
```html
<h2>Login to Wasilah</h2>
<p>Hi there,</p>
<p>Click the button below to securely log in to your Wasilah account:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 6px;">Log In</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this login link, please ignore this email.</p>
<br>
<p>Best regards,<br>The Wasilah Team</p>
```

### Template 4: Reset Password

**Subject:** `Reset your Wasilah password`

**Body (HTML):**
```html
<h2>Reset Your Password</h2>
<p>Hi there,</p>
<p>We received a request to reset your Wasilah account password.</p>
<p>Click the button below to create a new password:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request a password reset, please ignore this email - your password will remain unchanged.</p>
<br>
<p>Best regards,<br>The Wasilah Team</p>
```

### Template 5: Email Change

**Subject:** `Confirm your new email address`

**Body (HTML):**
```html
<h2>Confirm Email Change</h2>
<p>Hi there,</p>
<p>We received a request to change your Wasilah account email address.</p>
<p>Click the button below to confirm this change:</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0066CC; color: white; text-decoration: none; border-radius: 6px;">Confirm Email Change</a></p>
<p>If you didn't request this change, please contact support immediately.</p>
<br>
<p>Best regards,<br>The Wasilah Team</p>
```

---

## 10. SECURITY & RLS VERIFICATION

### Step 1: Verify RLS is Enabled

1. Go to **Table Editor**
2. For each of the 18 tables, click on it
3. Click **"..."** menu → **"View policies"**
4. Verify **"RLS enabled"** shows ✅ (green checkmark)

If any table shows ❌, enable it:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Step 2: Test RLS Policies

Run these tests in SQL Editor:

**Test 1: Anonymous users can't read profiles**
```sql
SET ROLE anon;
SELECT * FROM profiles;
-- Should return: 0 rows (even if profiles exist)
RESET ROLE;
```

**Test 2: Users can only see their own profile**
```sql
-- First, create a test user through the app
-- Then run this with their JWT token
-- Should only return 1 row (their own profile)
```

### Step 3: Verify API Keys

1. **Never expose service_role key** to client
2. Only use **anon key** in frontend
3. Check `.env` is in `.gitignore`

---

## 11. TESTING

### Step 1: Start Development Server

```bash
npm run dev
```

### Step 2: Test Authentication Flow

1. **Sign Up:**
   - Go to `/signup`
   - Create account with email
   - Check email for verification link
   - Click verify
   - Should redirect to onboarding

2. **Sign In:**
   - Go to `/login`
   - Enter credentials
   - Should redirect to appropriate dashboard based on role

3. **OAuth (if configured):**
   - Click "Continue with Google"
   - Authorize
   - Should redirect to onboarding

4. **Password Reset:**
   - Go to `/forgot-password`
   - Enter email
   - Check email for reset link
   - Reset password
   - Login with new password

### Step 3: Test Database Operations

1. **Create a Project (as NGO):**
   - Go to NGO dashboard
   - Click "Create Project"
   - Fill form and submit
   - Check Table Editor → projects table
   - Should see new row

2. **Apply to Project (as Volunteer):**
   - Go to volunteer dashboard
   - Find project
   - Click "Apply"
   - Submit application
   - Check volunteer_applications table

3. **Upload File:**
   - Try uploading project image
   - Check Storage → project-media bucket
   - Should see uploaded file

### Step 4: Test Realtime

1. Open app in **two different browsers** (or incognito + regular)
2. Login as different users
3. In browser 1: Create a project
4. In browser 2: Should see project appear immediately (without refresh)

### Step 5: Test Error Handling

1. **Network Error:**
   - Open DevTools → Network tab
   - Set to "Offline"
   - Try any action
   - Should see error toast
   - Check Console → error logged

2. **Validation Error:**
   - Submit form with invalid data
   - Should see field-level errors
   - Error should be logged to error_logs table

3. **Permission Error:**
   - As volunteer, try accessing admin dashboard directly
   - Should see 403 page

### Step 6: Verify Data in Tables

1. Go to **Table Editor** in Supabase
2. Check each table has correct structure:
   - **profiles:** User profiles created
   - **projects:** Test projects created
   - **notifications:** Notifications generated
   - **error_logs:** Errors logged
   - **audit_logs:** Actions logged

---

## 12. TROUBLESHOOTING

### Issue: "Invalid API Key"

**Cause:** Environment variables not loaded

**Fix:**
1. Verify `.env` file exists in root
2. Restart dev server: `npm run dev`
3. Check console for env variable errors

### Issue: "RLS Policy Violation"

**Cause:** Row Level Security blocking query

**Fix:**
1. Check user is authenticated: `const { data: { user } } = await supabase.auth.getUser()`
2. Verify RLS policies allow the operation
3. Check user's role in profiles table matches policy requirements

### Issue: "Failed to fetch"

**Cause:** CORS or network issue

**Fix:**
1. Check Supabase project is running (green status)
2. Verify URL in `.env` is correct
3. Check browser console for CORS errors
4. Ensure redirect URLs are configured in Supabase

### Issue: "Email not received"

**Cause:** Email delivery issues

**Fix:**
1. Check spam/junk folder
2. Verify email settings in Supabase → Authentication → Email Settings
3. For development, check **Authentication** → **Logs** to see email events
4. Consider using custom SMTP (Settings → Auth → Email)

### Issue: "OAuth redirect error"

**Cause:** Redirect URLs mismatch

**Fix:**
1. Verify redirect URL in OAuth provider matches EXACTLY:
   `https://your-project.supabase.co/auth/v1/callback`
2. Check Site URL in Supabase → Authentication → URL Configuration
3. Clear browser cache and try again

### Issue: "File upload fails"

**Cause:** Storage bucket policies or size limits

**Fix:**
1. Verify bucket exists
2. Check file size is within limit
3. Verify MIME type is allowed
4. Check storage policies allow authenticated uploads
5. Verify bucket is public (for public files)

### Issue: "Realtime not working"

**Cause:** Realtime not enabled for table

**Fix:**
1. Go to Database → Replication
2. Enable Realtime for the table
3. Refresh the page
4. Check browser console for subscription errors

### Issue: "Migration failed"

**Cause:** SQL syntax error or constraint violation

**Fix:**
1. Read the error message carefully
2. Check if table already exists (drop it first if testing)
3. Run migrations in correct order
4. Ensure no syntax errors in SQL

### Issue: "User can see other users' data"

**Cause:** RLS policy too permissive

**Fix:**
1. Review RLS policies for the table
2. Ensure policies filter by `auth.uid()`
3. Test with different users
4. Use SQL Editor to test policies as different roles

---

## 📊 SETUP VERIFICATION CHECKLIST

### Environment
- [ ] `.env` file created with correct values
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors

### Supabase Project
- [ ] Project created
- [ ] API keys copied to `.env`
- [ ] Project URL copied to `.env`

### Database
- [ ] Migration 1 (Auth) completed successfully
- [ ] Migration 2 (Applications) completed successfully
- [ ] Migration 3 (Realtime) completed successfully
- [ ] Migration 4 (Error Logs) completed successfully
- [ ] All 18 tables visible in Table Editor
- [ ] RLS enabled on all tables

### Authentication
- [ ] Email provider enabled
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Email templates customized
- [ ] Google OAuth configured (optional)
- [ ] LinkedIn OAuth configured (optional)
- [ ] Microsoft OAuth configured (optional)
- [ ] Apple OAuth configured (optional)

### Storage
- [ ] `project-media` bucket created with policies
- [ ] `ngo-media` bucket created with policies
- [ ] `ngo-documents` bucket created with policies
- [ ] Test file upload works

### Realtime
- [ ] Realtime enabled for all required tables
- [ ] Realtime connection test passes
- [ ] Cross-browser real-time updates work

### Testing
- [ ] Sign up works
- [ ] Email verification works
- [ ] Sign in works
- [ ] OAuth login works (if configured)
- [ ] Password reset works
- [ ] Role-based redirects work
- [ ] Protected routes work
- [ ] CRUD operations work
- [ ] File uploads work
- [ ] Realtime updates work
- [ ] Error handling works
- [ ] Error logging works

---

## 🎉 YOU'RE DONE!

If all checkboxes are checked, your Wasilah backend is **fully functional and production-ready**!

### Next Steps:

1. **Development:**
   - Start building features
   - Test thoroughly
   - Monitor error logs

2. **Production Deployment:**
   - Update `.env` with production URLs
   - Configure custom domain
   - Set up custom SMTP for emails
   - Enable Supabase Production features
   - Set up monitoring and alerts

3. **Ongoing Maintenance:**
   - Monitor error_logs table weekly
   - Review audit_logs for security
   - Check Supabase usage metrics
   - Update OAuth tokens when needed
   - Clean up old data using provided functions

---

## 📞 SUPPORT

**Issues with setup?**
- Check Supabase Dashboard → Logs
- Review browser console errors
- Check Network tab in DevTools
- Verify all environment variables
- Re-run failed migration
- Contact: support@wasilah.pk

**Useful Commands:**

```bash
# Start dev server
npm run dev

# Clear cache and restart
rm -rf node_modules/.vite && npm run dev

# Check environment variables
echo $VITE_SUPABASE_URL

# View Supabase logs
# Go to Supabase Dashboard → Logs
```

---

**Setup Guide Version:** 1.0  
**Last Updated:** January 9, 2026  
**Estimated Setup Time:** 45-60 minutes

Good luck! 🚀
