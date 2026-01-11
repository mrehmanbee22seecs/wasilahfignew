# ✅ TASK 1 COMPLETION CHECKLIST

Print this or keep it open while setting up!

---

## 🎯 PHASE 1: DATABASE SETUP (10 min)

### Step 1: Run Database Migration
- [ ] Open Supabase Dashboard (https://app.supabase.com)
- [ ] Select "Wasilah Figma" project
- [ ] Click "SQL Editor" in left sidebar
- [ ] Click "+ New Query"
- [ ] Open `/supabase/migrations/001_create_auth_tables.sql`
- [ ] Copy ALL content (485 lines)
- [ ] Paste into SQL Editor
- [ ] Click "RUN" button
- [ ] See "Success. No rows returned" message
- [ ] **Result:** 4 tables created ✅

### Step 2: Verify Tables Created
- [ ] Click "Table Editor" in left sidebar
- [ ] See `profiles` table
- [ ] See `organizations` table
- [ ] See `auth_metadata` table
- [ ] See `rate_limits` table
- [ ] **Result:** All 4 tables visible ✅

### Step 3: Run Verification Script
- [ ] Go back to "SQL Editor"
- [ ] Click "+ New Query"
- [ ] Open `/VERIFY_TASK_1.sql`
- [ ] Copy ALL content
- [ ] Paste into SQL Editor
- [ ] Click "RUN"
- [ ] See all "✅ PASS" messages
- [ ] **Result:** Database fully configured ✅

---

## 🎯 PHASE 2: SUPABASE CONFIGURATION (5 min)

### Step 4: Get API Credentials
- [ ] In Supabase Dashboard, click "Settings" (gear icon)
- [ ] Click "API" in submenu
- [ ] Copy "Project URL" → Save for later
- [ ] Copy "anon" "public" key → Save for later
- [ ] **DO NOT** copy service_role key
- [ ] **Result:** API credentials saved ✅

### Step 5: Set Environment Variables
- [ ] Open project in code editor
- [ ] Check if `.env` file exists in root
- [ ] If not, create `.env` file
- [ ] Add: `VITE_SUPABASE_URL=` (paste Project URL)
- [ ] Add: `VITE_SUPABASE_ANON_KEY=` (paste anon public key)
- [ ] Save `.env` file
- [ ] **Restart dev server**
- [ ] **Result:** Environment configured ✅

### Step 6: Configure Auth Settings
- [ ] In Supabase Dashboard, click "Authentication"
- [ ] Click "Providers" in submenu
- [ ] Find "Email" provider
- [ ] Toggle to **Enabled**
- [ ] **Result:** Email auth enabled ✅

### Step 7: Set Site URL
- [ ] Still in Authentication section
- [ ] Click "URL Configuration"
- [ ] Find "Site URL" field
- [ ] Enter your app URL:
  - Figma Make: `https://your-preview.figma.app`
  - Localhost: `http://localhost:5173`
- [ ] Click "Save"
- [ ] **Result:** Site URL configured ✅

### Step 8: Add Redirect URLs
- [ ] Still in "URL Configuration"
- [ ] Find "Redirect URLs" section
- [ ] Click "Add URL"
- [ ] Add: `https://your-app.figma.app/auth/callback`
- [ ] Click "Add URL" again
- [ ] Add: `https://your-app.figma.app/auth/verify`
- [ ] If testing locally, also add:
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/auth/verify`
- [ ] Click "Save"
- [ ] **Result:** Redirect URLs configured ✅

---

## 🎯 PHASE 3: TESTING (10 min)

### Step 9: Test Sign Up
- [ ] Open your app in browser
- [ ] Navigate to `/auth` page
- [ ] Click "Sign Up" tab
- [ ] Fill in form:
  - Email: `test@wasilah.pk`
  - Password: `Test123456!`
  - Full Name: `Test User`
- [ ] Click "Sign Up" button
- [ ] See success message (no errors)
- [ ] **Result:** Sign up works ✅

### Step 10: Test Email Verification
- [ ] Check email inbox (or spam folder)
- [ ] Find email from Supabase
- [ ] Click verification link
- [ ] Redirected back to app
- [ ] See "Email verified" message
- [ ] **Result:** Email verification works ✅

### Step 11: Test Onboarding
- [ ] See role selection screen
- [ ] Select role (e.g., "Volunteer")
- [ ] Complete onboarding steps
- [ ] Submit final step
- [ ] Redirected to dashboard
- [ ] **Result:** Onboarding complete ✅

### Step 12: Verify Profile in Database
- [ ] Go to Supabase Dashboard
- [ ] Click "Table Editor"
- [ ] Click "profiles" table
- [ ] See your test user row
- [ ] Check these columns:
  - [ ] `email` = `test@wasilah.pk`
  - [ ] `role` = `volunteer` (or chosen role)
  - [ ] `display_name` = `Test User`
  - [ ] `onboarding_completed` = `true`
- [ ] **Result:** Profile created correctly ✅

### Step 13: Test Sign In
- [ ] Sign out from app
- [ ] Go to `/auth` page
- [ ] Click "Sign In" tab
- [ ] Enter credentials:
  - Email: `test@wasilah.pk`
  - Password: `Test123456!`
- [ ] Click "Sign In"
- [ ] See loading spinner
- [ ] Redirected to dashboard
- [ ] **Result:** Sign in works ✅

### Step 14: Test Role-Based Redirect
- [ ] Note which dashboard you're on
- [ ] It should match your role:
  - Volunteer → `/volunteer-dashboard`
  - Corporate → `/corporate-dashboard`
  - NGO → `/ngo-dashboard`
  - Admin → `/admin-dashboard`
- [ ] **Result:** Correct dashboard loaded ✅

### Step 15: Test Session Persistence
- [ ] While logged in, refresh page (F5)
- [ ] Still logged in (not redirected to auth)
- [ ] Dashboard still showing
- [ ] **Result:** Session persists ✅

### Step 16: Test Protected Routes
- [ ] While logged in as Volunteer
- [ ] Try to access `/corporate-dashboard` in URL
- [ ] Should see "Access Denied" page
- [ ] Try to access `/ngo-dashboard`
- [ ] Should see "Access Denied" page
- [ ] Try to access `/admin-dashboard`
- [ ] Should see "Access Denied" page
- [ ] **Result:** Protected routes work ✅

### Step 17: Test Unauthorized Access
- [ ] Sign out
- [ ] Try to access `/volunteer-dashboard` in URL
- [ ] Redirected to `/auth` page
- [ ] Try to access `/corporate-dashboard`
- [ ] Redirected to `/auth` page
- [ ] **Result:** Unauthenticated blocked ✅

### Step 18: Test Sign Out
- [ ] Sign in again
- [ ] Find "Sign Out" button (in dashboard)
- [ ] Click "Sign Out"
- [ ] Redirected to home or auth page
- [ ] Try to access dashboard again
- [ ] Should be blocked (redirected to auth)
- [ ] **Result:** Sign out works ✅

---

## 🎯 PHASE 4: SECURITY VERIFICATION (5 min)

### Step 19: Verify RLS is Working
- [ ] Go to Supabase SQL Editor
- [ ] Run this query:
```sql
SELECT * FROM profiles WHERE id != auth.uid();
```
- [ ] Should return **0 rows** (or give permission error)
- [ ] **Result:** RLS blocks unauthorized access ✅

### Step 20: Test Multiple Accounts
- [ ] Create second test account:
  - Email: `test2@wasilah.pk`
  - Different role from first account
- [ ] Sign in with second account
- [ ] Check you see different dashboard
- [ ] Cannot access first account's dashboard
- [ ] **Result:** Multi-user works ✅

---

## ✅ FINAL VERIFICATION

### Run Complete Verification:
- [ ] All Phase 1 steps complete (8 items)
- [ ] All Phase 2 steps complete (7 items)
- [ ] All Phase 3 steps complete (12 items)
- [ ] All Phase 4 steps complete (2 items)
- [ ] **Total: 29 items checked**

### Quick Smoke Test:
- [ ] Can sign up
- [ ] Can verify email
- [ ] Profile created in database
- [ ] Can sign in
- [ ] Redirected to correct dashboard
- [ ] Session persists
- [ ] Wrong role blocked
- [ ] No auth redirects to login
- [ ] Can sign out
- [ ] RLS working

### Code Review:
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] `.env` file has correct values
- [ ] `AuthProvider` wraps App
- [ ] `ProtectedRoute` on all dashboards
- [ ] All auth files imported correctly

---

## 🎉 COMPLETION

When ALL items above are checked:

✅ **TASK 1 IS COMPLETE!**

You can now:
- Move to Task 2: API Service Layer
- Connect dashboards to real data
- Build remaining features

---

## 📊 Progress Summary

```
Database Setup:       _____ / 8 items
Supabase Config:      _____ / 7 items  
Testing:              _____ / 12 items
Security:             _____ / 2 items
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                _____ / 29 items

Percentage Complete:  _____% 

Status: [  ] In Progress  [  ] Complete
```

---

## 🆘 If Stuck

**Not all checks passing?**
1. Review: `/TROUBLESHOOTING.md`
2. Re-read: `/TASK_1_SETUP_GUIDE.md`
3. Re-run: `/VERIFY_TASK_1.sql`

**Common issues:**
- Migration didn't run → Go back to Step 1
- Wrong API key → Check Step 5
- CORS error → Check Step 7-8
- RLS blocking → Check Step 19

**Still stuck?**
- Check browser console for errors
- Check Supabase logs
- Verify all 29 items above

---

**Good luck! 🚀**

_When complete, update progress in `/FIGMA_MAKE_BACKEND_TASKS.md`_
