# 🔧 TASK 1 TROUBLESHOOTING GUIDE

## 🚨 Common Issues & Quick Fixes

---

### Issue 1: "Relation 'profiles' does not exist"

**Symptom:** Error in console when trying to fetch profile

**Cause:** Database migration hasn't been run

**Fix:**
```
1. Go to Supabase Dashboard → SQL Editor
2. Copy /supabase/migrations/001_create_auth_tables.sql
3. Paste and click RUN
4. Verify tables exist in Table Editor
```

**Verify Fix:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'profiles';
-- Should return 1 row
```

---

### Issue 2: "Invalid API key" or "Failed to fetch"

**Symptom:** Can't connect to Supabase, network errors

**Cause:** Wrong or missing environment variables

**Fix:**
```
1. Check .env file exists in root
2. Verify VITE_SUPABASE_URL is set
3. Verify VITE_SUPABASE_ANON_KEY is set
4. RESTART dev server after changing .env
```

**Common Mistakes:**
- ❌ Using `service_role` key (NEVER expose this!)
- ❌ Using `anon` `secret` instead of `anon` `public`
- ❌ Missing `VITE_` prefix
- ❌ Quotes around values (don't use quotes in .env)

**Correct .env:**
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Verify Fix:**
```javascript
// Add to App.tsx temporarily
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
// Should see your URL and true
```

---

### Issue 3: CORS Error

**Symptom:** "Access to fetch blocked by CORS policy"

**Cause:** Site URL not configured in Supabase

**Fix:**
```
1. Go to: Authentication → Settings
2. Find "Site URL" field
3. Enter your app URL:
   - Figma Make: https://your-app.figma.app
   - Localhost: http://localhost:5173
4. Add to "Redirect URLs":
   - https://your-app.figma.app/**
   - http://localhost:5173/**
5. Click Save
```

---

### Issue 4: Email Verification Not Sending

**Symptom:** Sign up works but no email received

**Cause:** Email provider not enabled OR email in spam

**Fix Option 1 - Check Email:**
```
1. Check spam/junk folder
2. Check "Promotions" tab (Gmail)
3. Wait 5 minutes (can be delayed)
```

**Fix Option 2 - Disable Verification (Testing Only):**
```
1. Go to: Authentication → Settings
2. Find "Enable email confirmations"
3. Toggle OFF (for testing only!)
4. Try signing up again
5. REMEMBER to turn back ON for production
```

**Fix Option 3 - Check Email Provider:**
```
1. Go to: Authentication → Settings
2. Verify "Email" provider is enabled
3. Check "Enable email confirmations" is ON
```

---

### Issue 5: Can't Access Dashboard After Login

**Symptom:** Logged in but redirected to unauthorized page

**Cause:** Profile not created or role not set

**Fix:**
```
1. Go to: Supabase → Table Editor → profiles
2. Find your user (by email)
3. Check if row exists
4. Check if 'role' field is set
5. If missing, complete onboarding flow again
```

**Verify Fix:**
```sql
-- Run in SQL Editor
SELECT id, email, role, onboarding_completed 
FROM profiles 
WHERE email = 'your-email@example.com';
-- Should show your profile with role set
```

---

### Issue 6: "User already registered"

**Symptom:** Can't sign up, says user exists

**Cause:** Email already used (maybe you tested before)

**Fix Option 1 - Use Different Email:**
```
Try: test+1@example.com, test+2@example.com
(Gmail ignores +anything)
```

**Fix Option 2 - Delete Old User:**
```
1. Go to: Authentication → Users
2. Find the test user
3. Click ... → Delete User
4. Try signing up again
```

---

### Issue 7: Session Doesn't Persist (Logs Out on Reload)

**Symptom:** Must log in every time you refresh

**Cause:** localStorage blocked or auth config wrong

**Fix:**
```
1. Check browser allows localStorage
2. Check Private/Incognito mode (disable it)
3. Verify /lib/supabase.ts has:
   persistSession: true
```

**Verify Fix:**
```javascript
// Check in browser console
console.log('Storage:', localStorage.getItem('supabase.auth.token'));
// Should see a token object
```

---

### Issue 8: RLS Blocking Everything

**Symptom:** Can't read own profile, "permission denied"

**Cause:** RLS policies too restrictive or not set correctly

**Fix:**
```
1. Go to: Authentication → Policies
2. Verify these policies exist:
   - "Users can view own profile" (profiles)
   - "Users can update own profile" (profiles)
3. If missing, re-run migration
```

**Test RLS:**
```sql
-- This should work (returns your profile)
SELECT * FROM profiles WHERE id = auth.uid();

-- This should be empty (blocked by RLS)
SELECT * FROM profiles WHERE id != auth.uid();
```

---

### Issue 9: "JWT expired" Error

**Symptom:** Randomly logged out, expired token error

**Cause:** Normal behavior - tokens expire after 1 hour

**Fix:**
```
This is expected! The system should auto-refresh.

If auto-refresh fails:
1. Check /lib/supabase.ts has:
   autoRefreshToken: true
2. Make sure user isn't in incognito mode
3. Check network - needs internet to refresh
```

---

### Issue 10: Can See Other Users' Profiles

**Symptom:** Can query profiles of other users

**Cause:** RLS not enabled or policies wrong

**Fix:**
```
1. Go to: Table Editor → profiles
2. Check "Enable RLS" toggle is ON
3. Run verification script:
```

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
-- rowsecurity should be 't' (true)
```

---

## 🔍 Debugging Tools

### Tool 1: Check Supabase Logs
```
Go to: Dashboard → Logs → API Logs
Look for failed requests
Check error messages
```

### Tool 2: Browser Console
```
Press F12 → Console tab
Look for red errors
Check "Failed to fetch" messages
```

### Tool 3: Network Tab
```
Press F12 → Network tab
Filter: Fetch/XHR
Look for failed requests (red)
Click on request → Preview tab
Read error message
```

### Tool 4: Test Supabase Connection
```javascript
// Add to your code temporarily
import { supabase } from './lib/supabase';

async function testConnection() {
  console.log('Testing Supabase...');
  const { data, error } = await supabase.from('profiles').select('count');
  console.log('Result:', data, error);
}
testConnection();
```

---

## 📋 Verification Checklist

Run through this checklist if something isn't working:

**Environment:**
- [ ] .env file exists
- [ ] VITE_SUPABASE_URL is set correctly
- [ ] VITE_SUPABASE_ANON_KEY is set correctly (not service_role!)
- [ ] Dev server restarted after .env changes

**Database:**
- [ ] Migration ran successfully
- [ ] 4 tables exist (profiles, organizations, auth_metadata, rate_limits)
- [ ] RLS is enabled on all tables
- [ ] Policies exist (run VERIFY_TASK_1.sql)

**Supabase Config:**
- [ ] Email provider enabled
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] Email confirmations enabled (or disabled for testing)

**Code:**
- [ ] AuthProvider wraps App
- [ ] ProtectedRoute on dashboards
- [ ] /lib/supabase.ts exists and exports client
- [ ] No TypeScript errors

**Testing:**
- [ ] Can access /auth page
- [ ] Sign up form appears
- [ ] Can submit sign up (no errors)
- [ ] Email received (or verification disabled)
- [ ] Can complete onboarding
- [ ] Profile created in database
- [ ] Can sign in
- [ ] Redirected to correct dashboard

---

## 🆘 Still Stuck?

### Step 1: Run Full Verification
```sql
-- Copy and run /VERIFY_TASK_1.sql in SQL Editor
-- All checks should be ✅ PASS
```

### Step 2: Check Browser Console
```
F12 → Console
Look for errors
Copy exact error message
```

### Step 3: Check Supabase Logs
```
Dashboard → Logs
Look for 400/500 errors
Check timestamps match your action
```

### Step 4: Start Fresh
```
1. Delete .env
2. Create new .env with fresh API keys
3. Re-run migration (/supabase/migrations/001_create_auth_tables.sql)
4. Clear browser cache
5. Hard refresh (Ctrl+Shift+R)
6. Try again
```

---

## ✅ Success Indicators

You'll know Task 1 is working when:

1. ✅ No console errors
2. ✅ Can sign up without errors
3. ✅ Profile created in database (visible in Table Editor)
4. ✅ Can sign in
5. ✅ Session persists on reload
6. ✅ Redirected to correct dashboard
7. ✅ Wrong role shows "Access Denied"
8. ✅ No auth = redirect to login

---

**If all else fails:** Re-read `/TASK_1_SETUP_GUIDE.md` step by step. Most issues are from skipped steps!
