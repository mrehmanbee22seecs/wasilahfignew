/**
 * Authentication Service
 * 
 * Handles all authentication operations with Supabase Auth
 * Replaces mock API calls with real Supabase integration
 * 
 * SETUP REQUIRED:
 * 1. Install Supabase client: npm install @supabase/supabase-js
 * 2. Set environment variables in .env:
 *    - VITE_SUPABASE_URL=your_supabase_project_url
 *    - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
 * 3. Run migration: supabase/migrations/001_create_auth_tables.sql
 */

import { createClient, SupabaseClient, AuthError, User, Session } from '@supabase/supabase-js';
import { executeRecaptcha } from './recaptchaService';
import { AuthEvents } from './analyticsService';
import { getMaskedEmailForLogging } from '../utils/emailMasking';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../lib/supabase';
import { 
  checkRateLimit as checkClientRateLimit, 
  recordAttempt, 
  getIdentifier 
} from '../lib/rateLimit/rateLimiter';
import { RateLimitError } from '../lib/errors/types';

// Export the supabase client from lib for consistency
export { supabase } from '../lib/supabase';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface OTPVerifyData {
  email: string;
  token: string;
  type: 'signup' | 'recovery';
}

export interface ProfileData {
  role: 'corporate' | 'ngo' | 'volunteer';
  displayName: string;
  organizationName?: string;
  location?: string;
  city?: string;
  profilePhotoUrl?: string;
  interests?: string[];
  sdgGoals?: number[];
  availability?: any;
  notificationPreferences?: any;
}

export interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Maps Supabase auth errors to user-friendly messages
 */
function mapAuthError(error: AuthError | null): { message: string; code: string } {
  if (!error) return { message: 'Unknown error occurred', code: 'UNKNOWN_ERROR' };

  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Incorrect email or password. If you forgot your password, click Reset.',
    'Email not confirmed': 'Please verify your email before logging in.',
    'User already registered': 'An account with this email already exists.',
    'Password should be at least 6 characters': 'Password must be at least 8 characters.',
    'Unable to validate email address': 'Please enter a valid email address.',
    'Email rate limit exceeded': 'Too many attempts. Please try again in 1 hour.',
    'Token has expired': 'This code has expired. Please request a new one.',
    'Invalid token': 'Invalid verification code. Please try again.',
  };

  const message = errorMap[error.message] || error.message || 'An error occurred. Please try again.';
  const code = error.code || error.message?.toUpperCase().replace(/\s/g, '_') || 'UNKNOWN_ERROR';

  return { message, code };
}

/**
 * Tracks authentication events for analytics and security
 */
async function trackAuthEvent(
  userId: string | null,
  eventType: string,
  metadata?: any
) {
  try {
    const { error } = await supabase.from('auth_metadata').insert({
      user_id: userId,
      event_type: eventType,
      provider: metadata?.provider || 'email',
      success: metadata?.success !== false,
      failure_reason: metadata?.error,
      ip_address: metadata?.ip,
      user_agent: navigator.userAgent,
    });

    if (error) {
      console.error('Failed to track auth event:', error);
    }
  } catch (err) {
    console.error('Error tracking auth event:', err);
  }
}

/**
 * Checks rate limit for an action using client-side rate limiter
 */
function checkRateLimit(
  email: string,
  endpoint: 'login' | 'signup' | 'passwordReset' | 'otpVerify'
): { allowed: boolean; error?: string; code?: string } {
  try {
    const identifier = getIdentifier(email);
    const result = checkClientRateLimit(endpoint, identifier);
    
    if (!result.allowed) {
      return {
        allowed: false,
        error: result.message || 'Too many attempts. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      };
    }
    
    return { allowed: true };
  } catch (err) {
    console.error('Rate limit check failed:', err);
    return { allowed: true }; // Allow on error to not block users
  }
}

// =====================================================
// SIGNUP
// =====================================================

export async function signup(data: SignupData): Promise<AuthResponse<{ user: User; needsVerification: boolean }>> {
  try {
    // Track signup started
    AuthEvents.signupStarted();
    
    const identifier = getIdentifier(data.email);
    
    // Check rate limit
    const rateLimit = checkRateLimit(data.email, 'signup');
    if (!rateLimit.allowed) {
      AuthEvents.signupFailed(rateLimit.error || 'Rate limit');
      return { success: false, error: rateLimit.error, code: rateLimit.code };
    }

    // Execute reCAPTCHA
    const recaptchaResult = await executeRecaptcha('signup');
    if (!recaptchaResult.success) {
      AuthEvents.signupFailed('reCAPTCHA failed');
      recordAttempt('signup', identifier, false);
      return { success: false, error: 'Security verification failed. Please try again.', code: 'RECAPTCHA_ERROR' };
    }

    console.log('[Auth] Signup attempt:', getMaskedEmailForLogging(data.email));

    // Signup with Supabase
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          company_name: data.companyName,
        },
        emailRedirectTo: `${window.location.origin}/auth/verify`,
      }
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      await trackAuthEvent(null, 'signup', { success: false, error: message });
      AuthEvents.signupFailed(message);
      recordAttempt('signup', identifier, false);
      return { success: false, error: message, code };
    }

    if (!authData.user) {
      AuthEvents.signupFailed('No user returned');
      recordAttempt('signup', identifier, false);
      return { success: false, error: 'Failed to create account. Please try again.', code: 'SIGNUP_FAILED' };
    }

    // Track successful signup
    await trackAuthEvent(authData.user.id, 'signup', { success: true });
    AuthEvents.signupCompleted('email');
    AuthEvents.verificationEmailSent();
    recordAttempt('signup', identifier, true);

    // Send verification email
    await trackAuthEvent(authData.user.id, 'email_verification_sent', { success: true });

    return {
      success: true,
      data: {
        user: authData.user,
        needsVerification: !authData.session, // If no session, email verification is required
      }
    };
  } catch (err: any) {
    console.error('Signup error:', err);
    AuthEvents.signupFailed('Unexpected error');
    recordAttempt('signup', getIdentifier(data.email), false);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'SIGNUP_ERROR'
    };
  }
}

// =====================================================
// LOGIN
// =====================================================

export async function login(data: LoginData): Promise<AuthResponse<{ user: User; session: Session }>> {
  try {
    const identifier = getIdentifier(data.email);
    
    // Check rate limit
    const rateLimit = checkRateLimit(data.email, 'login');
    if (!rateLimit.allowed) {
      return { success: false, error: rateLimit.error, code: rateLimit.code };
    }

    // Execute reCAPTCHA
    const recaptchaToken = await executeRecaptcha();
    if (!recaptchaToken) {
      recordAttempt('login', identifier, false);
      return { success: false, error: 'Please complete the reCAPTCHA.', code: 'RECAPTCHA_ERROR' };
    }

    // Login with Supabase
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      await trackAuthEvent(null, 'login', { success: false, error: message });
      recordAttempt('login', identifier, false);
      return { success: false, error: message, code };
    }

    if (!authData.user || !authData.session) {
      recordAttempt('login', identifier, false);
      return { success: false, error: 'Login failed. Please try again.', code: 'LOGIN_FAILED' };
    }

    // Update last login time
    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', authData.user.id);

    // Track successful login
    await trackAuthEvent(authData.user.id, 'login', { success: true });
    recordAttempt('login', identifier, true);

    return {
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
      }
    };
  } catch (err: any) {
    console.error('Login error:', err);
    recordAttempt('login', getIdentifier(data.email), false);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'LOGIN_ERROR'
    };
  }
}

// =====================================================
// OTP VERIFICATION
// =====================================================

export async function verifyOTP(data: OTPVerifyData): Promise<AuthResponse<{ user: User; session: Session }>> {
  try {
    const identifier = getIdentifier(data.email);
    
    // Check rate limit
    const rateLimit = checkRateLimit(data.email, 'otpVerify');
    if (!rateLimit.allowed) {
      return { success: false, error: rateLimit.error, code: rateLimit.code };
    }

    // Verify OTP with Supabase
    const { data: authData, error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: data.type,
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      recordAttempt('otpVerify', identifier, false);
      return { success: false, error: message, code };
    }

    if (!authData.user || !authData.session) {
      recordAttempt('otpVerify', identifier, false);
      return { success: false, error: 'Verification failed. Please try again.', code: 'VERIFICATION_FAILED' };
    }

    // Track successful verification
    await trackAuthEvent(authData.user.id, 'email_verified', { success: true });
    recordAttempt('otpVerify', identifier, true);

    return {
      success: true,
      data: {
        user: authData.user,
        session: authData.session,
      }
    };
  } catch (err: any) {
    console.error('OTP verification error:', err);
    recordAttempt('otpVerify', getIdentifier(data.email), false);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'VERIFY_ERROR'
    };
  }
}

// =====================================================
// RESEND OTP
// =====================================================

export async function resendOTP(email: string, type: 'signup' | 'recovery' = 'signup'): Promise<AuthResponse> {
  try {
    const identifier = getIdentifier(email);
    
    // Check rate limit (max 3 resends per hour)
    const rateLimit = checkRateLimit(email, 'passwordReset'); // Use passwordReset limits for OTP resend
    if (!rateLimit.allowed) {
      return { success: false, error: rateLimit.error, code: rateLimit.code };
    }

    // Resend OTP
    const { error } = await supabase.auth.resend({
      type: type === 'signup' ? 'signup' : 'recovery',
      email: email,
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      recordAttempt('passwordReset', identifier, false);
      return { success: false, error: message, code };
    }

    recordAttempt('passwordReset', identifier, true);
    return {
      success: true,
      data: {
        cooldownSeconds: 30,
        attemptsLeft: 0,
      }
    };
  } catch (err: any) {
    console.error('Resend OTP error:', err);
    recordAttempt('passwordReset', getIdentifier(email), false);
    return {
      success: false,
      error: 'Failed to resend code. Please try again.',
      code: 'RESEND_ERROR'
    };
  }
}

// =====================================================
// PASSWORD RESET
// =====================================================

export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    const identifier = getIdentifier(email);
    
    // Check rate limit
    const rateLimit = checkRateLimit(email, 'passwordReset');
    if (!rateLimit.allowed) {
      return { success: false, error: rateLimit.error, code: rateLimit.code };
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      recordAttempt('passwordReset', identifier, false);
      return { success: false, error: message, code };
    }

    recordAttempt('passwordReset', identifier, true);
    return { success: true };
  } catch (err: any) {
    console.error('Password reset error:', err);
    recordAttempt('passwordReset', getIdentifier(email), false);
    return {
      success: false,
      error: 'Failed to send reset email. Please try again.',
      code: 'RESET_ERROR'
    };
  }
}

// =====================================================
// OAUTH LOGIN
// =====================================================

export async function loginWithOAuth(
  provider: 'google' | 'linkedin' | 'microsoft' | 'apple'
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      const { message, code } = mapAuthError(error);
      return { success: false, error: message, code };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('OAuth login error:', err);
    return {
      success: false,
      error: `Failed to login with ${provider}. Please try again.`,
      code: 'OAUTH_ERROR'
    };
  }
}

// =====================================================
// LOGOUT
// =====================================================

export async function logout(): Promise<AuthResponse> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      const { message, code } = mapAuthError(error);
      return { success: false, error: message, code };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Logout error:', err);
    return {
      success: false,
      error: 'Failed to logout. Please try again.',
      code: 'LOGOUT_ERROR'
    };
  }
}

// =====================================================
// GET CURRENT SESSION
// =====================================================

export async function getCurrentSession(): Promise<AuthResponse<{ user: User; session: Session }>> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      const { message, code } = mapAuthError(error);
      return { success: false, error: message, code };
    }

    if (!data.session || !data.session.user) {
      return { success: false, error: 'No active session', code: 'NO_SESSION' };
    }

    return {
      success: true,
      data: {
        user: data.session.user,
        session: data.session,
      }
    };
  } catch (err: any) {
    console.error('Get session error:', err);
    return {
      success: false,
      error: 'Failed to get session.',
      code: 'SESSION_ERROR'
    };
  }
}

// =====================================================
// CREATE/UPDATE PROFILE
// =====================================================

export async function createProfile(userId: string, profileData: ProfileData): Promise<AuthResponse> {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    const profilePayload = {
      id: userId,
      role: profileData.role,
      display_name: profileData.displayName,
      email: (await supabase.auth.getUser()).data.user?.email || '',
      organization_name: profileData.organizationName,
      location: profileData.location,
      city: profileData.city,
      profile_photo_url: profileData.profilePhotoUrl,
      interests: profileData.interests || [],
      sdg_goals: profileData.sdgGoals || [],
      availability: profileData.availability,
      notification_preferences: profileData.notificationPreferences,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    };

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('id', userId);
    } else {
      // Insert new profile
      result = await supabase
        .from('profiles')
        .insert(profilePayload);
    }

    if (result.error) {
      console.error('Profile creation error:', result.error);
      return {
        success: false,
        error: 'Failed to save profile. Please try again.',
        code: 'PROFILE_ERROR'
      };
    }

    // Calculate and update profile completeness
    await supabase.rpc('calculate_profile_completeness', { profile_id: userId });

    return { success: true };
  } catch (err: any) {
    console.error('Profile creation error:', err);
    return {
      success: false,
      error: 'Failed to create profile. Please try again.',
      code: 'PROFILE_ERROR'
    };
  }
}

// =====================================================
// GET PROFILE
// =====================================================

export async function getProfile(userId: string): Promise<AuthResponse<any>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return {
        success: false,
        error: 'Profile not found.',
        code: 'PROFILE_NOT_FOUND'
      };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Get profile error:', err);
    return {
      success: false,
      error: 'Failed to load profile.',
      code: 'PROFILE_ERROR'
    };
  }
}

// =====================================================
// AUTH STATE LISTENER
// =====================================================

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}