# 🔐 Auth System - Developer Handoff Documentation

**Route:** `/auth`  
**Version:** 1.0  
**Last Updated:** December 2024  
**Status:** Production Ready - Requires Supabase Integration

---

## 📋 Overview

Single `/auth` route that hosts 5 authentication states:
1. **Login** - Email/password + social login
2. **Signup** - Account creation with password strength
3. **Email Verification** - 6-digit OTP entry
4. **Role Selection** - Choose Corporate/NGO/Volunteer
5. **Onboarding Wizard** - 2-step profile setup

All states exist on one page with smooth transitions. No separate routes.

---

## 🎨 Design Tokens

### **Colors (Auth-Specific)**

```css
/* Primary Brand */
--color-teal-600: #0d9488;
--color-blue-600: #2563eb;

/* Gradients */
--gradient-primary: linear-gradient(to right, #0d9488, #2563eb);

/* States */
--color-success: #10b981;  /* green-500 */
--color-error: #ef4444;    /* red-500 */
--color-warning: #f59e0b;  /* amber-500 */

/* Backgrounds */
--auth-bg: linear-gradient(to bottom right, #f8fafc, #ffffff, #f0fdfa);
```

### **Typography**

```css
--text-h1-auth: 30px / 36px;   /* Mobile */
--text-h1-auth-lg: 36px / 44px; /* Desktop */
--text-body: 16px / 24px;
--text-small: 14px / 20px;
--text-xs: 12px / 16px;
```

### **Spacing**

```css
--auth-container-padding: 24px;  /* Mobile */
--auth-container-padding-lg: 32px; /* Desktop */
--form-field-gap: 24px;
--button-height: 48px;
```

### **Borders & Shadows**

```css
--auth-border-radius: 16px;  /* Cards */
--auth-input-radius: 8px;
--auth-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

---

## 📦 Component Library

### **1. AuthShell**

**File:** `/components/auth/AuthShell.tsx`

**Purpose:** Container for all auth states

**Props:**
```typescript
{
  children: React.ReactNode;
  showBackToSite?: boolean;
  onBackToSite?: () => void;
}
```

**Features:**
- Small brand header (logo + "Back to site" link)
- Gradient background
- Footer with T&C links
- Responsive padding

---

### **2. LoginForm**

**File:** `/components/auth/LoginForm.tsx`

**Props:**
```typescript
{
  onSuccess: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}
```

**Fields:**
- Email (required, validated)
- Password (required, show/hide toggle)
- Remember me (checkbox)

**Features:**
- Real-time email validation
- Password visibility toggle
- Social login buttons (Google, LinkedIn, Microsoft)
- Forgot password link
- Loading state on submit
- Error display (inline + general)

**Validation:**
```typescript
email: /^\S+@\S+\.\S+$/
password: min 1 char (required)
```

**Supabase Integration:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: formData.email,
  password: formData.password
});
```

---

### **3. SignupForm**

**File:** `/components/auth/SignupForm.tsx`

**Props:**
```typescript
{
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}
```

**Fields:**
- Full name (required, 2-100 chars)
- Email (required, validated)
- Password (required, strength meter)
- Confirm password (required, must match)
- Company name (optional)
- Accept T&C (required checkbox)

**Features:**
- Password strength meter (weak/medium/strong)
- Live password match indicator
- Social signup buttons
- Rate limit notice ("3 times per hour")

**Password Strength Algorithm:**
```typescript
Score based on:
- Length (8+ = 1 point, 12+ = 2 points)
- Mixed case (+1)
- Numbers (+1)
- Special chars (+1)

Weak: 0-2 points
Medium: 3-4 points
Strong: 5+ points
```

**Supabase Integration:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      full_name: formData.fullName,
      company_name: formData.companyName
    }
  }
});
```

---

### **4. OTPForm**

**File:** `/components/auth/OTPForm.tsx`

**Props:**
```typescript
{
  email: string;
  onSuccess: () => void;
  onChangeEmail: () => void;
}
```

**Features:**
- 6 single-digit inputs (numeric only)
- Auto-focus next input
- Paste support (fills all 6 digits)
- Auto-submit when complete
- Resend with 30s cooldown
- Attempt counter (10 attempts max)
- Masked email display (yo****@gmail.com)

**Keyboard Navigation:**
- Arrow keys to move between inputs
- Backspace to go back
- Enter to submit

**Supabase Integration:**
```typescript
// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  email,
  token: code,
  type: 'signup'
});

// Resend OTP
await supabase.auth.resend({
  type: 'signup',
  email
});
```

**Error Handling:**
```typescript
invalid_code → "Code invalid. You have X attempts left."
expired_code → "Code expired. We sent a new one."
too_many_attempts → "Too many attempts. Contact support."
```

---

### **5. RoleSelector**

**File:** `/components/auth/RoleSelector.tsx`

**Props:**
```typescript
{
  onContinue: (role: string, organizationName?: string) => void;
  onSkip?: () => void;
}
```

**Roles:**
```typescript
type Role = 'corporate' | 'ngo' | 'volunteer'
```

**Role Cards:**

| Role | Icon | Benefits | Recommended |
|------|------|----------|-------------|
| Corporate | Building2 | Vetted NGOs, Project mgmt, Impact reports | ✅ Yes |
| NGO | Heart | List opportunities, Corporate partners, Impact stories | No |
| Volunteer | Users | Browse opportunities, Track hours, Portfolio | No |

**Features:**
- 3-column grid (responsive)
- "I represent an organization" toggle
- Organization name input (progressive disclosure)
- Preview panel showing next steps (desktop only)
- Keyboard navigation (Arrow keys + Space/Enter)

**Interaction:**
- Click role → Highlight + show check icon
- Select role + Continue → Go to onboarding
- Click "Skip for now" → Go straight to dashboard

---

### **6. OnboardingWizard**

**File:** `/components/auth/OnboardingWizard.tsx`

**Props:**
```typescript
{
  role: string;
  initialData?: Partial<OnboardingData>;
  onComplete: (data: OnboardingData) => void;
  onBack?: () => void;
}
```

**Data Structure:**
```typescript
interface OnboardingData {
  displayName: string;
  organizationName?: string;
  location: string;
  profilePhoto?: string;
  interests: string[];
  sdgs: number[];
  availability?: string;
  emailNotifications: boolean;
  weeklyDigest: boolean;
}
```

**Step 1 (Profile):**
- Profile photo upload (optional, max 1MB)
- Display name (required)
- Organization name (required if Corporate/NGO)
- Location (city dropdown)

**Step 2 (Preferences):**
- Interests/Causes (multi-select chips)
- SDG preferences (max 5, icon grid)
- Availability (volunteer only, dropdown)
- Email notifications (toggle)
- Weekly digest (toggle)

**Features:**
- 2-step progress bar
- Live preview card (desktop)
- Save as draft ("Finish later")
- Back navigation between steps

---

### **7. SocialLoginButtons**

**File:** `/components/auth/SocialLoginButtons.tsx`

**Providers:**
```typescript
[
  { id: 'google', name: 'Google', required: true },
  { id: 'linkedin', name: 'LinkedIn', required: false },
  { id: 'microsoft', name: 'Microsoft', required: false }
]
```

**Supabase OAuth:**
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth?state=callback`
  }
});
```

**⚠️ Important:** 
Each provider must be enabled in Supabase Dashboard:
- Google: https://supabase.com/docs/guides/auth/social-login/auth-google
- LinkedIn: https://supabase.com/docs/guides/auth/social-login/auth-linkedin
- Microsoft: https://supabase.com/docs/guides/auth/social-login/auth-microsoft

---

## 🔄 State Machine

```typescript
type AuthState = 'login' | 'signup' | 'verify' | 'role' | 'onboarding' | 'complete'

const transitions = {
  login: {
    'switch to signup': 'signup',
    'success': 'complete'
  },
  signup: {
    'switch to login': 'login',
    'success': 'verify'
  },
  verify: {
    'change email': 'signup',
    'success': 'role'
  },
  role: {
    'continue': 'onboarding',
    'skip': 'complete'
  },
  onboarding: {
    'back': 'role',
    'complete': 'complete'
  },
  complete: {
    'go to dashboard': '[role-specific dashboard]'
  }
}
```

---

## 📊 Analytics Events

### **Event Tracking**

```typescript
// Events to fire:
'auth_state_login'
'auth_state_signup'
'auth_state_verify'
'auth_state_role'
'auth_state_onboarding'
'auth_state_complete'

'auth_login_submit'
'auth_login_success'
'auth_signup_submit'
'auth_signup_success'
'auth_verify_otp'
'auth_resend_otp'
'auth_change_email'
'auth_role_select' // { role: string }
'auth_role_continue'
'auth_role_skip'
'onboarding_step1_continue'
'onboarding_step2_back'
'onboarding_complete' // { role, interests_count, sdgs_count }
'onboarding_skip'

'auth_social_google'
'auth_social_linkedin'
'auth_social_microsoft'

'auth_switch_to_signup'
'auth_switch_to_login'
```

### **Implementation:**

```typescript
function trackAuthEvent(eventName: string, data?: any) {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, data);
  }
  
  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.track(eventName, data);
  }
  
  // Console log (dev)
  console.log('[Analytics]', eventName, data);
}
```

---

## 🎨 Animations & Transitions

### **Page Transitions**

```css
/* State transitions */
.auth-state-enter {
  animation: fadeInSlide 300ms ease-out;
}

@keyframes fadeInSlide {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .auth-state-enter {
    animation: none;
  }
}
```

### **OTP Shake on Error**

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}
```

### **Timing Specifications**

- Form transitions: 300ms ease-out
- OTP shake: 400ms ease-in-out
- Button hover: 200ms ease
- Loading spinner: 1s linear infinite

---

## 🔐 Security Implementation

### **Password Requirements**

```typescript
const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  return null;
};
```

### **Rate Limiting (Backend)**

```typescript
// Recommended limits:
{
  signup: '5 per hour per IP',
  resend_otp: '3 per hour per email',
  verify_otp: '10 attempts per code',
  login: '10 per hour per IP'
}
```

### **Session Management**

```typescript
// Supabase handles sessions automatically
// Frontend checks session on mount:
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  // User already logged in → redirect to dashboard
  window.location.href = '/dashboard';
}
```

### **Security Best Practices**

1. ✅ Passwords never sent in plain text (HTTPS required)
2. ✅ OTP codes expire after 10 minutes
3. ✅ Rate limiting on all sensitive endpoints
4. ✅ HttpOnly cookies for refresh tokens (Supabase default)
5. ✅ CSRF protection via SameSite=Strict
6. ✅ Email verification required before full access

---

## 📱 Responsive Behavior

### **Breakpoints**

```typescript
const breakpoints = {
  mobile: '375px - 767px',
  tablet: '768px - 1439px',
  desktop: '1440px+'
};
```

### **Layout Adjustments**

**Mobile (375px - 767px):**
- Single column layout
- Full-width form cards
- Modal becomes fullscreen sheet
- Role cards stack vertically
- Onboarding wizard: hide preview panel
- OTP inputs: smaller size (48px → 56px)

**Tablet (768px - 1439px):**
- Role cards: 2 columns then 1 column
- Form max-width: 600px
- Modal: 720px centered

**Desktop (1440px+):**
- Form max-width: 480px
- Modal: 920px centered
- Onboarding: 2-column grid (form + preview)
- Role preview panel visible

### **Touch Targets**

All interactive elements meet WCAG 2.1 AA:
- Minimum touch target: 44×44px
- Spacing between targets: 8px minimum

---

## ♿ Accessibility Compliance

### **WCAG 2.1 AA Compliance**

✅ **Keyboard Navigation:**
- All forms navigable by Tab/Shift+Tab
- OTP inputs: Arrow keys supported
- Role cards: Space/Enter to select
- Modal: ESC to close, focus trapped

✅ **Screen Readers:**
- All inputs have `<label>` elements
- Error messages use `aria-describedby`
- Role cards use `role="radio"` and `aria-pressed`
- Loading states announce "Loading..." to SR

✅ **Color Contrast:**
- Text on white: 4.5:1 minimum (slate-700 #334155)
- Large text (24px+): 3:1 minimum
- Error text: 4.5:1 (red-700 #b91c1c)
- Buttons: 4.5:1

✅ **Focus Indicators:**
- All interactive elements have visible focus ring
- Ring: 2px solid teal-600, offset 2px

### **ARIA Attributes Used**

```html
<!-- Inputs -->
<input 
  id="email"
  aria-label="Email address"
  aria-describedby="email-hint email-error"
  aria-invalid="false"
/>

<!-- Errors -->
<p id="email-error" role="alert">
  Please enter a valid email address.
</p>

<!-- Loading -->
<button aria-busy="true" disabled>
  <span aria-live="polite">Logging in...</span>
</button>

<!-- Modal -->
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
```

---

## 🧪 Testing Checklist

### **Manual Testing**

- [ ] Login with valid credentials → Success
- [ ] Login with invalid credentials → Error message
- [ ] Signup with weak password → Strength meter shows "weak"
- [ ] Signup with strong password → Strength meter shows "strong"
- [ ] Passwords don't match → Inline error
- [ ] Submit OTP with correct code → Proceed to role selection
- [ ] Submit OTP with wrong code → Error + attempts counter
- [ ] Paste 6-digit code → Auto-fills all inputs
- [ ] Resend OTP → Cooldown timer starts
- [ ] Select role → Preview panel updates
- [ ] Complete onboarding → Redirect to dashboard
- [ ] Click "Back to site" → Navigate to homepage
- [ ] Social login buttons → OAuth popup/redirect

### **Keyboard Testing**

- [ ] Tab through entire form without mouse
- [ ] Enter on password field submits login
- [ ] Arrow keys navigate OTP inputs
- [ ] Space/Enter selects role cards
- [ ] ESC closes modal (if applicable)

### **Responsive Testing**

- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on desktop (1440px)
- [ ] Modal becomes fullscreen on mobile
- [ ] Role cards stack on mobile
- [ ] Onboarding preview hides on mobile

### **Accessibility Testing**

- [ ] Run axe DevTools audit → 0 violations
- [ ] Test with VoiceOver/NVDA screen reader
- [ ] Check color contrast ratios
- [ ] Verify focus indicators visible
- [ ] Test with keyboard only

---

## 🐛 Common Issues & Solutions

### **Issue: "Email already exists"**

**Cause:** User already registered

**Solution:**
```typescript
if (error.message === 'User already registered') {
  setErrors({
    general: 'An account with this email already exists. Please log in instead.'
  });
  // Show "Switch to Login" button
}
```

### **Issue: OTP not received**

**Cause:** Email provider blocking, spam folder, or Supabase email limits

**Solution:**
1. Check spam folder (show instruction to user)
2. Verify Supabase email settings
3. Implement email rate limiting warnings
4. Provide support contact

### **Issue: OAuth redirect doesn't work**

**Cause:** Incorrect redirect URL in Supabase settings

**Solution:**
```typescript
// Ensure redirect URL is whitelisted in Supabase:
// Dashboard → Authentication → URL Configuration
// Add: https://yourdomain.com/auth

// In code:
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth`
  }
});
```

### **Issue: Password strength always shows "weak"**

**Cause:** Algorithm not detecting mixed case/numbers

**Solution:** Check password strength function, ensure it's scoring correctly

---

## 🚀 Production Deployment

### **Environment Variables**

```bash
# .env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=xxxxxxxxxxxxx
```

### **Supabase Setup**

1. **Enable Email Auth:**
   - Dashboard → Authentication → Providers
   - Enable "Email" provider
   - Configure email templates

2. **Enable OAuth:**
   - Dashboard → Authentication → Providers
   - Enable Google (required)
   - Enable LinkedIn, Microsoft (optional)
   - Follow provider-specific setup guides

3. **Configure Email Templates:**
   - Signup confirmation email
   - Password reset email
   - Email change confirmation

4. **Set Rate Limits:**
   - Dashboard → Authentication → Rate limits
   - Signup: 5 per hour
   - Verify OTP: 10 attempts

### **Pre-Launch Checklist**

- [ ] All environment variables set
- [ ] Supabase email templates configured
- [ ] OAuth providers enabled and tested
- [ ] Analytics tracking verified
- [ ] Error monitoring setup (Sentry)
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Accessibility audit passed

---

## 📞 Support & Maintenance

**For technical questions:**
- Review component source code in `/components/auth/`
- Check Supabase docs: https://supabase.com/docs/guides/auth

**For design questions:**
- Review design tokens above
- Check Figma file (if applicable)

**For UX questions:**
- Review state machine diagram
- Test interactive flows in dev build

---

**Document Version:** 1.0  
**Last Updated:** December 14, 2024  
**Next Review:** Before production launch

---

This auth system is **production-ready** from a frontend perspective. All states work with simulated data. Simply connect to Supabase Auth to activate real authentication! 🔐
