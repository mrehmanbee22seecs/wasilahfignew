# 🔐 TASK 1: AUTHENTICATION SETUP - COMPLETE GUIDE

**Status:** ⏳ In Progress  
**Time Required:** 20-30 minutes  
**Prerequisites:** ✅ Supabase connected to Figma Make

---

## 📋 CURRENT STATUS

✅ **Done:**
- Supabase project created
- Supabase connected to Figma Make
- Environment variables configured (.env)
- Auth code written (AuthContext, ProtectedRoute, etc.)

❌ **Still Needed:**
- Database tables (profiles, organizations, auth_metadata, rate_limits)
- Row Level Security (RLS) policies
- Helper functions and triggers
- Testing the complete flow

---

## 🚀 STEP-BY-STEP SETUP INSTRUCTIONS

### **STEP 1: Access Supabase SQL Editor**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your **Wasilah Figma** project
3. Click on **SQL Editor** in the left sidebar
4. Click **+ New Query** button

---

### **STEP 2: Run the Database Migration**

#### Option A: Copy-Paste Method (Recommended)

1. Open the file `/supabase/migrations/001_create_auth_tables.sql` from your project
2. **Copy the entire contents** (all 485 lines)
3. **Paste** into the Supabase SQL Editor
4. Click **RUN** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for "Success. No rows returned" message

#### Option B: Supabase CLI Method (Advanced)

```bash
# If you have Supabase CLI installed
supabase db push

# Or link and push
supabase link --project-ref your-project-ref
supabase db push
```

---

### **STEP 3: Verify Tables Were Created**

1. In Supabase Dashboard, go to **Table Editor** (left sidebar)
2. You should see **4 new tables**:
   - ✅ `profiles`
   - ✅ `organizations`
   - ✅ `auth_metadata`
   - ✅ `rate_limits`

3. Click on each table to verify columns exist

**Expected Columns for `profiles` table:**
- id (UUID, Primary Key)
- role (text)
- display_name (text)
- email (text)
- organization_name (text)
- organization_id (UUID)
- location (text)
- city (text)
- country (text)
- profile_photo_url (text)
- interests (text[])
- sdg_goals (integer[])
- causes (text[])
- availability (jsonb)
- notification_preferences (jsonb)
- onboarding_completed (boolean)
- profile_completeness (integer)
- created_at (timestamp)
- updated_at (timestamp)
- last_login_at (timestamp)
- is_verified (boolean)
- verified_at (timestamp)

---

### **STEP 4: Verify Row Level Security (RLS) is Enabled**

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. You should see policies for each table:

**Profiles Table Policies:**
- ✅ "Users can view own profile"
- ✅ "Users can update own profile"
- ✅ "Users can insert own profile"
- ✅ "Public can view verified profiles"

**Organizations Table Policies:**
- ✅ "Users can view own organization"
- ✅ "Authenticated users can create organizations"
- ✅ "Users can update own organization"
- ✅ "Public can view verified organizations"

**Auth Metadata Table Policies:**
- ✅ "Users can view own auth metadata"
- ✅ "Service role can insert auth metadata"

**Rate Limits Table Policies:**
- ✅ "Service role can manage rate limits"

---

### **STEP 5: Verify Helper Functions Were Created**

1. In SQL Editor, run this query:

```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

2. You should see:
   - ✅ `calculate_profile_completeness`
   - ✅ `check_rate_limit`
   - ✅ `update_updated_at_column`

---

### **STEP 6: Configure Supabase Auth Settings**

1. Go to **Authentication** → **Settings** in Supabase
2. **Enable Email Auth:**
   - ✅ Enable Email provider
   - ✅ Confirm email: **Enabled** (recommended for production)
   - ✅ Secure email change: **Enabled**

3. **Set Site URL:**
   - If using Figma Make preview: `https://your-preview-url.figma.app`
   - If using localhost: `http://localhost:5173`
   - For production: Your actual domain

4. **Add Redirect URLs:**
   Add these to the "Redirect URLs" whitelist:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5173/auth/verify`
   - `https://your-preview-url.figma.app/auth/callback` (if using Figma Make)
   - `https://your-preview-url.figma.app/auth/verify`

5. **JWT Settings (leave as default):**
   - JWT expiry: 3600 (1 hour) - default is fine
   - Refresh token expiry: 2592000 (30 days) - default is fine

---

### **STEP 7: Configure Email Templates (Optional but Recommended)**

1. Go to **Authentication** → **Email Templates**
2. Customize these templates for your brand:

**Confirm Signup Template:**
```html
<h2>Welcome to Wasilah!</h2>
<p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
```

**Reset Password Template:**
```html
<h2>Reset Your Password</h2>
<p>Someone requested a password reset for your Wasilah account.</p>
<p>If this was you, click the button below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

---

### **STEP 8: Test Environment Variables in Figma Make**

1. In Figma Make, check your `.env` file has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Get these from: Supabase → **Settings** → **API**
   - Project URL → Copy to `VITE_SUPABASE_URL`
   - Project API keys → `anon` `public` → Copy to `VITE_SUPABASE_ANON_KEY`

3. **Restart your dev server** after setting env variables

---

### **STEP 9: Test the Authentication Flow**

Now test each step manually:

#### ✅ Test 1: Sign Up
1. Navigate to `/auth` page
2. Click "Sign Up"
3. Enter:
   - Email: `test@wasilah.pk`
   - Password: `Test123456!`
   - Full Name: `Test User`
4. Submit the form
5. **Expected:** 
   - Success message
   - Verification email sent (check spam folder)
   - Redirected to OTP verification page

#### ✅ Test 2: Email Verification
1. Check your email inbox
2. Click the verification link
3. **Expected:**
   - Redirected back to app
   - "Email verified" message
   - Automatically logged in

#### ✅ Test 3: Profile Creation
1. After email verification, you should see role selection
2. Select a role (e.g., "Volunteer")
3. Complete onboarding wizard
4. **Expected:**
   - Profile created in `profiles` table
   - Redirected to appropriate dashboard

#### ✅ Test 4: Check Database
1. Go to Supabase → **Table Editor** → **profiles**
2. You should see your new profile:
   - ✅ ID matches your user ID from auth.users
   - ✅ Email is correct
   - ✅ Role is set
   - ✅ onboarding_completed = true

#### ✅ Test 5: Sign Out and Sign In
1. Click sign out
2. Go to `/auth`
3. Click "Sign In"
4. Enter same credentials
5. **Expected:**
   - Successfully logged in
   - Redirected to dashboard based on role
   - No "verify email" step

#### ✅ Test 6: Protected Routes
1. Sign out
2. Try to access `/corporate-dashboard` directly
3. **Expected:**
   - Redirected to `/auth` page
   - See "Please sign in" message

4. Sign in with a volunteer account
5. Try to access `/corporate-dashboard`
6. **Expected:**
   - See "Access Denied" page
   - Cannot access corporate dashboard
   - Can access `/volunteer-dashboard`

#### ✅ Test 7: Session Persistence
1. Sign in
2. Reload the page
3. **Expected:**
   - Still logged in
   - No re-authentication required
   - Session persists

---

### **STEP 10: Verify RLS is Working**

Run this test in SQL Editor:

```sql
-- This should fail (good!) because RLS blocks it
SELECT * FROM profiles WHERE id != auth.uid();

-- This should work (returns your own profile)
SELECT * FROM profiles WHERE id = auth.uid();
```

If the first query returns rows when you're logged in, **RLS is not working correctly**.

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "Failed to fetch" or CORS error
**Solution:**
- Check Site URL in Supabase Auth settings
- Add your URL to redirect URLs whitelist
- Make sure you're using the correct Supabase URL

### Issue 2: "No rows returned" after running migration
**Solution:**
- This is actually SUCCESS! No error means it worked
- Go to Table Editor to verify tables exist

### Issue 3: "relation profiles does not exist"
**Solution:**
- Migration didn't run successfully
- Re-run the SQL migration
- Check for error messages in SQL editor

### Issue 4: Email verification not sending
**Solution:**
- Check Supabase → Authentication → Settings
- Email provider must be enabled
- Check spam folder
- For testing, you can disable email confirmation temporarily

### Issue 5: "Invalid API key" error
**Solution:**
- Copy the `anon` `public` key, NOT the `service_role` key
- The service_role key should NEVER be in frontend code
- Update your .env file with correct key

### Issue 6: User can't access their dashboard
**Solution:**
- Check if profile exists in `profiles` table
- Check if `role` field is set correctly
- Check browser console for errors

### Issue 7: "Profile not found" after sign up
**Solution:**
- User hasn't completed onboarding
- Profile isn't created until role selection is complete
- Check `onboarding_completed` field in profiles table

---

## ✅ FINAL CHECKLIST

Before considering Task 1 complete, verify ALL of these:

### Database Setup:
- [ ] ✅ 4 tables created (profiles, organizations, auth_metadata, rate_limits)
- [ ] ✅ All columns exist in each table
- [ ] ✅ RLS is enabled on all 4 tables
- [ ] ✅ 11 RLS policies exist
- [ ] ✅ 3 helper functions exist
- [ ] ✅ 2 triggers exist (updated_at)
- [ ] ✅ Indexes created for performance

### Supabase Configuration:
- [ ] ✅ Email provider enabled
- [ ] ✅ Site URL configured
- [ ] ✅ Redirect URLs whitelisted
- [ ] ✅ Email templates customized (optional)
- [ ] ✅ Environment variables set correctly

### Code Integration:
- [ ] ✅ AuthContext wraps entire app
- [ ] ✅ ProtectedRoute components on dashboards
- [ ] ✅ RoleBasedRedirect on auth success
- [ ] ✅ UnauthorizedPage shows for wrong role
- [ ] ✅ Supabase client configured

### Testing:
- [ ] ✅ Can sign up new user
- [ ] ✅ Email verification works
- [ ] ✅ Can complete onboarding
- [ ] ✅ Profile created in database
- [ ] ✅ Can sign in
- [ ] ✅ Redirected to correct dashboard based on role
- [ ] ✅ Can sign out
- [ ] ✅ Protected routes block unauthorized access
- [ ] ✅ Session persists on page reload
- [ ] ✅ RLS prevents accessing other users' data

---

## 🎉 TASK 1 COMPLETION CRITERIA

**Task 1 is COMPLETE when:**

1. ✅ Database schema is deployed
2. ✅ RLS policies are active
3. ✅ You can sign up and create a profile
4. ✅ You can sign in and access correct dashboard
5. ✅ Protected routes work (redirect unauthorized users)
6. ✅ Session persists across page reloads
7. ✅ RLS prevents data leaks

---

## 📞 WHAT TO DO IF STUCK

1. **Check Supabase logs:**
   - Supabase Dashboard → Logs
   - Look for API errors

2. **Check browser console:**
   - F12 → Console tab
   - Look for JavaScript errors

3. **Check network tab:**
   - F12 → Network tab
   - Look for failed API requests
   - Check request/response details

4. **Verify environment variables:**
   ```javascript
   // Add this temporarily to test
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

5. **Test Supabase connection:**
   ```javascript
   // Add this to test
   import { supabase } from './lib/supabase';
   console.log('Testing connection...');
   supabase.from('profiles').select('count').then(res => {
     console.log('Connection test:', res);
   });
   ```

---

## 🚀 AFTER TASK 1 IS COMPLETE

Once everything above is verified, you're ready for:

- ✅ **Task 2:** API Service Layer (12 hours)
- Create TypeScript API clients for all entities
- Connect to real Supabase data
- Add form validation

---

## 📊 PROGRESS TRACKER

Update this as you complete each step:

```
[✅] Step 1: Access SQL Editor
[✅] Step 2: Run migration
[✅] Step 3: Verify tables created
[✅] Step 4: Verify RLS enabled
[✅] Step 5: Verify functions created
[✅] Step 6: Configure auth settings
[✅] Step 7: Configure email templates
[✅] Step 8: Test environment variables
[✅] Step 9: Test authentication flow
[✅] Step 10: Verify RLS is working

FINAL CHECKLIST:
[✅] All database items checked
[✅] All Supabase config items checked
[✅] All code integration items checked
[✅] All testing items checked

STATUS: ✅ TASK 1 COMPLETE!
```

---

**Need help?** Double-check each step above. Most issues are from:
1. Missing environment variables
2. Migration didn't run
3. Wrong API key (using service_role instead of anon)
4. Site URL not configured in Supabase

Good luck! 🚀
