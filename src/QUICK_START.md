# ⚡ TASK 1 - QUICK START (5 Minutes)

**Current Status:** Supabase connected ✅ | Database empty ❌

---

## 🎯 What You Need To Do Now:

### 1️⃣ Run Database Migration (2 minutes)

```sql
-- Go to: https://app.supabase.com → Your Project → SQL Editor
-- Copy ALL contents from: /supabase/migrations/001_create_auth_tables.sql
-- Paste into SQL Editor → Click RUN

-- You should see: "Success. No rows returned"
```

### 2️⃣ Verify Setup (1 minute)

```sql
-- Go to: SQL Editor → New Query
-- Copy ALL contents from: /VERIFY_TASK_1.sql
-- Paste → Click RUN

-- You should see all ✅ PASS checks
```

### 3️⃣ Configure Auth (1 minute)

```
Go to: Authentication → Settings
1. ✅ Enable "Email" provider
2. Add your Site URL (Figma Make preview URL)
3. Add Redirect URLs:
   - https://your-app.figma.app/auth/callback
   - https://your-app.figma.app/auth/verify
```

### 4️⃣ Test It (1 minute)

```
1. Go to /auth page
2. Sign up with email
3. Check email for verification
4. Complete onboarding
5. Should redirect to dashboard ✅
```

---

## ✅ Done! Task 1 Complete When:

- [ ] All tables exist (check Table Editor)
- [ ] RLS enabled (check VERIFY_TASK_1.sql results)
- [ ] Can sign up successfully
- [ ] Can sign in successfully
- [ ] Redirected to correct dashboard
- [ ] Protected routes work (try accessing wrong dashboard)

---

## 🐛 Quick Fixes:

**"Relation profiles does not exist"**
→ Migration didn't run. Go back to Step 1.

**"Invalid API key"**
→ Check .env has correct VITE_SUPABASE_ANON_KEY

**Email not sending**
→ Check spam folder OR disable email confirmation temporarily

**Can't access dashboard**
→ Check you completed onboarding and profile was created

---

## 📚 Full Details:

- **Setup Guide:** `/TASK_1_SETUP_GUIDE.md` (detailed 30-min guide)
- **Verification:** `/VERIFY_TASK_1.sql` (run in Supabase SQL Editor)
- **Completion Log:** `/TASK_1_COMPLETE.txt` (what was built)

---

**Next:** Once all checks pass → Move to Task 2: API Service Layer 🚀
