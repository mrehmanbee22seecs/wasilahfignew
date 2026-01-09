# 🔐 OAuth Provider Setup Guide

This guide walks you through setting up social login (OAuth) for Wasilah authentication.

---

## 📋 Prerequisites

- Active Supabase project
- Access to Supabase Dashboard
- Admin access to provider developer consoles (Google, LinkedIn, etc.)

---

## ✅ Supported Providers

- ✅ **Google** (Recommended - most commonly used)
- ✅ **LinkedIn** (For professional networking)
- ⚠️ **Microsoft** (Optional)
- ⚠️ **Apple** (Optional)

---

## 🔧 Provider Setup Instructions

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**

#### Step 2: Configure OAuth Consent Screen

1. Navigate to **APIs & Services → OAuth consent screen**
2. Select **External** user type (or Internal if G Workspace)
3. Fill in application details:
   - **App name:** Wasilah CSR Platform
   - **User support email:** support@wasilah.pk
   - **Logo:** Upload Wasilah logo (optional)
   - **Application home page:** https://wasilah.pk
   - **Privacy policy:** https://wasilah.pk/privacy
   - **Terms of service:** https://wasilah.pk/terms
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (for testing phase)
6. Save and continue

#### Step 3: Create OAuth Credentials

1. Navigate to **Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `Wasilah Production`
5. **Authorized JavaScript origins:**
   ```
   https://wasilah.pk
   http://localhost:3000
   ```
6. **Authorized redirect URIs:**
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
7. Click **Create**
8. **Copy Client ID and Client Secret** (you'll need these)

#### Step 4: Configure in Supabase

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **Authentication → Providers**
3. Find **Google** and enable it
4. Paste:
   - **Client ID** (from Google)
   - **Client Secret** (from Google)
5. Copy the **Callback URL** from Supabase
6. Go back to Google Console and verify redirect URI matches
7. **Save** in Supabase

#### Step 5: Test

1. Go to your app's login page
2. Click "Continue with Google"
3. You should see Google's OAuth consent screen
4. After approval, you'll be redirected back with session

---

### 2. LinkedIn OAuth Setup

#### Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in details:
   - **App name:** Wasilah CSR Platform
   - **LinkedIn Page:** Your company page (required)
   - **App logo:** Upload Wasilah logo
   - **Privacy policy URL:** https://wasilah.pk/privacy
   - **Terms of service:** https://wasilah.pk/terms
4. Verify company page (if needed)
5. Click **Create app**

#### Step 2: Configure OAuth Settings

1. Go to **Auth** tab
2. Add **Redirect URLs:**
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
3. Request access to **Sign In with LinkedIn** product
   - May require LinkedIn review (1-2 weeks)

#### Step 3: Get Credentials

1. Go to **Auth** tab
2. Copy:
   - **Client ID**
   - **Client Secret**

#### Step 4: Configure in Supabase

1. Open Supabase Dashboard
2. Go to **Authentication → Providers**
3. Find **LinkedIn** and enable it
4. Paste:
   - **Client ID** (from LinkedIn)
   - **Client Secret** (from LinkedIn)
5. **Save**

---

### 3. Microsoft OAuth Setup (Optional)

#### Step 1: Register Application

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory → App registrations**
3. Click **New registration**
4. Configure:
   - **Name:** Wasilah CSR Platform
   - **Supported account types:** Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI:** Web → `https://your-project-id.supabase.co/auth/v1/callback`
5. **Register**

#### Step 2: Configure Permissions

1. Go to **API permissions**
2. Add **Microsoft Graph** permissions:
   - `User.Read`
   - `email`
   - `openid`
   - `profile`
3. Grant admin consent (if required)

#### Step 3: Create Client Secret

1. Go to **Certificates & secrets**
2. Click **New client secret**
3. Description: `Wasilah Production`
4. Expiry: Choose duration (max 24 months)
5. **Copy the secret value** (only shown once!)

#### Step 4: Configure in Supabase

1. Supabase Dashboard → **Authentication → Providers**
2. Enable **Microsoft (Azure)**
3. Paste:
   - **Application (client) ID**
   - **Client secret value**
4. **Save**

---

## 🔍 Testing OAuth Flow

### Test Checklist

- [ ] OAuth button appears on login/signup page
- [ ] Clicking button opens provider consent screen
- [ ] After approval, redirects back to your app
- [ ] User session is created successfully
- [ ] User profile data is populated correctly
- [ ] Email is verified automatically (if provided by OAuth)

### Debug Common Issues

#### "Redirect URI mismatch"
- **Cause:** Callback URL doesn't match registered redirect URI
- **Fix:** Ensure Supabase callback URL matches exactly in provider console

#### "Invalid client"
- **Cause:** Wrong Client ID or Client Secret
- **Fix:** Double-check credentials, regenerate if needed

#### "Access denied"
- **Cause:** User declined consent or missing permissions
- **Fix:** Check OAuth scopes, update consent screen

#### "Provider not enabled"
- **Cause:** Provider not configured in Supabase
- **Fix:** Enable provider in Supabase Dashboard → Authentication → Providers

---

## 🔒 Security Best Practices

### ✅ Do's

- ✅ Use HTTPS in production (required for OAuth)
- ✅ Keep client secrets in environment variables
- ✅ Rotate client secrets periodically (every 6-12 months)
- ✅ Use state parameter to prevent CSRF attacks (Supabase handles this)
- ✅ Request minimum necessary scopes
- ✅ Verify email addresses from OAuth providers

### ❌ Don'ts

- ❌ Never commit client secrets to Git
- ❌ Don't hardcode credentials in code
- ❌ Don't request excessive scopes
- ❌ Don't skip email verification for OAuth users
- ❌ Don't allow OAuth on HTTP (except localhost for dev)

---

## 📊 Provider Comparison

| Provider | Setup Time | Business Approval | Email Always Provided | Recommended For |
|----------|-----------|-------------------|----------------------|-----------------|
| **Google** | 15 min | No | ✅ Yes | All users |
| **LinkedIn** | 30 min + review | Yes (1-2 weeks) | ✅ Yes | Professionals/Corporate |
| **Microsoft** | 20 min | Optional | ✅ Yes | Enterprise users |
| **Apple** | 30 min | Yes | ⚠️ Optional (user can hide) | iOS users |

---

## 🧪 Development vs Production

### Development (localhost)

- Redirect URI: `http://localhost:54321/auth/v1/callback`
- Test with personal accounts
- No HTTPS required

### Production (wasilah.pk)

- Redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
- HTTPS required
- May need business verification for some providers

---

## 🚀 Going Live

### Pre-Launch Checklist

1. **OAuth Consent Screen**
   - [ ] Remove test user restrictions
   - [ ] Submit for verification (Google)
   - [ ] Update branding (logo, colors)

2. **Credentials**
   - [ ] Create production credentials (separate from dev)
   - [ ] Add production redirect URIs
   - [ ] Store secrets securely

3. **Supabase**
   - [ ] Update provider settings with production credentials
   - [ ] Test OAuth flow in production
   - [ ] Monitor auth logs for errors

4. **Monitoring**
   - [ ] Set up error tracking (Sentry, etc.)
   - [ ] Monitor failed OAuth attempts
   - [ ] Track provider usage (Google Analytics)

---

## 🆘 Troubleshooting

### Error: "Provider is not enabled"

**Solution:**
1. Supabase Dashboard → Authentication → Providers
2. Enable the provider
3. Add Client ID and Secret
4. Save changes
5. Restart your app

### Error: "Invalid redirect URI"

**Solution:**
1. Check Supabase callback URL: `Settings → API → URL`
2. Copy full callback URL
3. Add to provider console (must match exactly)
4. Include protocol (https://) and trailing path (/auth/v1/callback)

### Error: "Email already registered"

**Solution:**
This means a user signed up with email/password using the same email. Options:
1. Link accounts (Supabase supports account linking)
2. Ask user to login with original method
3. Implement email conflict resolution UI

---

## 📚 Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [LinkedIn OAuth Guide](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/)

---

## 🎯 Quick Start (Google Only)

If you just want to get Google OAuth working quickly:

```bash
# 1. Go to Google Cloud Console
https://console.cloud.google.com/

# 2. Create OAuth Client ID

# 3. Get Supabase callback URL
https://your-project-id.supabase.co/auth/v1/callback

# 4. Add to Supabase Dashboard
Authentication → Providers → Google → Enable

# 5. Test
Click "Continue with Google" in your app
```

---

**Last Updated:** January 7, 2024  
**Maintained by:** Wasilah Engineering Team  
**Support:** developers@wasilah.pk
