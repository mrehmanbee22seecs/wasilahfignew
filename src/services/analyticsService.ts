/**
 * Analytics Service
 * 
 * Centralized analytics tracking for Wasilah platform
 * Supports multiple providers: Google Analytics, Mixpanel, custom events
 * 
 * SETUP:
 * 1. Add analytics keys to .env:
 *    - VITE_GA_MEASUREMENT_ID (Google Analytics 4)
 *    - VITE_MIXPANEL_TOKEN (optional)
 * 2. Import and use trackEvent() throughout the app
 */

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface UserProperties {
  userId: string;
  role?: 'corporate' | 'ngo' | 'volunteer';
  email?: string;
  signupDate?: string;
  plan?: string;
  organizationId?: string;
  [key: string]: any;
}

// =====================================================
// CONFIGURATION
// =====================================================

const GA_MEASUREMENT_ID = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_GA_MEASUREMENT_ID || ''
  : '';
const MIXPANEL_TOKEN = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_MIXPANEL_TOKEN || ''
  : '';
const IS_PRODUCTION = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.NODE_ENV === 'production'
  : false;
const ANALYTICS_ENABLED = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_ANALYTICS_ENABLED !== 'false'
  : false;

// =====================================================
// GOOGLE ANALYTICS 4 (GA4)
// =====================================================

/**
 * Initialize Google Analytics 4
 */
export function initializeGA4() {
  if (!GA_MEASUREMENT_ID || !ANALYTICS_ENABLED) {
    console.log('[Analytics] GA4 not configured or disabled');
    return;
  }

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('[Analytics] GA4 initialized:', GA_MEASUREMENT_ID);
}

/**
 * Track event in Google Analytics
 */
function trackGA4Event(event: AnalyticsEvent) {
  if (!window.gtag || !ANALYTICS_ENABLED) return;

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    user_id: event.userId,
    ...event.metadata,
  });
}

/**
 * Track page view in GA4
 */
export function trackPageView(path: string, title?: string) {
  if (!window.gtag || !ANALYTICS_ENABLED) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });

  console.log('[Analytics] Page view:', path);
}

// =====================================================
// MIXPANEL (OPTIONAL)
// =====================================================

/**
 * Initialize Mixpanel
 */
export function initializeMixpanel() {
  if (!MIXPANEL_TOKEN || !ANALYTICS_ENABLED) {
    console.log('[Analytics] Mixpanel not configured or disabled');
    return;
  }

  // Load Mixpanel SDK
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
  script.onload = () => {
    if (window.mixpanel) {
      window.mixpanel.init(MIXPANEL_TOKEN, {
        debug: !IS_PRODUCTION,
        track_pageview: true,
        persistence: 'localStorage',
      });
      console.log('[Analytics] Mixpanel initialized');
    }
  };
  document.head.appendChild(script);
}

/**
 * Track event in Mixpanel
 */
function trackMixpanelEvent(event: AnalyticsEvent) {
  if (!window.mixpanel || !ANALYTICS_ENABLED) return;

  window.mixpanel.track(event.action, {
    category: event.category,
    label: event.label,
    value: event.value,
    ...event.metadata,
  });
}

// =====================================================
// UNIFIED ANALYTICS API
// =====================================================

/**
 * Track event across all analytics providers
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number,
  metadata?: Record<string, any>
) {
  if (!ANALYTICS_ENABLED) return;

  const event: AnalyticsEvent = {
    category,
    action,
    label,
    value,
    metadata,
  };

  // Track in all providers
  trackGA4Event(event);
  trackMixpanelEvent(event);

  // Console log in development
  if (!IS_PRODUCTION) {
    console.log('[Analytics] Event tracked:', {
      category,
      action,
      label,
      value,
      metadata,
    });
  }
}

/**
 * Identify user (set user ID)
 */
export function identifyUser(userId: string, properties?: UserProperties) {
  if (!ANALYTICS_ENABLED) return;

  // GA4
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      user_id: userId,
    });
  }

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.identify(userId);
    if (properties) {
      window.mixpanel.people.set(properties);
    }
  }

  console.log('[Analytics] User identified:', userId);
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>) {
  if (!ANALYTICS_ENABLED) return;

  // GA4
  if (window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.people.set(properties);
  }
}

/**
 * Reset analytics (on logout)
 */
export function resetAnalytics() {
  if (!ANALYTICS_ENABLED) return;

  // Mixpanel
  if (window.mixpanel) {
    window.mixpanel.reset();
  }

  console.log('[Analytics] Reset');
}

// =====================================================
// AUTH-SPECIFIC EVENT TRACKING
// =====================================================

export const AuthEvents = {
  // Signup Flow
  signupStarted: () => trackEvent('Auth', 'signup_started'),
  signupCompleted: (method: 'email' | 'oauth', provider?: string) =>
    trackEvent('Auth', 'signup_completed', method, undefined, { provider }),
  signupFailed: (error: string) =>
    trackEvent('Auth', 'signup_failed', error),

  // Email Verification
  verificationEmailSent: () => trackEvent('Auth', 'verification_email_sent'),
  verificationStarted: () => trackEvent('Auth', 'verification_started'),
  verificationCompleted: () => trackEvent('Auth', 'verification_completed'),
  verificationFailed: (error: string) =>
    trackEvent('Auth', 'verification_failed', error),
  verificationResend: (attemptNumber: number) =>
    trackEvent('Auth', 'verification_resend', undefined, attemptNumber),

  // Login Flow
  loginStarted: (method: 'email' | 'oauth') =>
    trackEvent('Auth', 'login_started', method),
  loginCompleted: (method: 'email' | 'oauth', provider?: string) =>
    trackEvent('Auth', 'login_completed', method, undefined, { provider }),
  loginFailed: (error: string) =>
    trackEvent('Auth', 'login_failed', error),

  // Password Reset
  passwordResetRequested: () => trackEvent('Auth', 'password_reset_requested'),
  passwordResetEmailSent: () => trackEvent('Auth', 'password_reset_email_sent'),
  passwordResetCompleted: () => trackEvent('Auth', 'password_reset_completed'),
  passwordResetFailed: (error: string) =>
    trackEvent('Auth', 'password_reset_failed', error),

  // OAuth
  oauthStarted: (provider: string) =>
    trackEvent('Auth', 'oauth_started', provider),
  oauthCompleted: (provider: string) =>
    trackEvent('Auth', 'oauth_completed', provider),
  oauthFailed: (provider: string, error: string) =>
    trackEvent('Auth', 'oauth_failed', provider, undefined, { error }),

  // Role Selection
  roleSelected: (role: 'corporate' | 'ngo' | 'volunteer') =>
    trackEvent('Auth', 'role_selected', role),
  roleSkipped: () => trackEvent('Auth', 'role_skipped'),

  // Onboarding
  onboardingStarted: (role: string) =>
    trackEvent('Auth', 'onboarding_started', role),
  onboardingStep1Completed: () => trackEvent('Auth', 'onboarding_step1_completed'),
  onboardingStep2Completed: () => trackEvent('Auth', 'onboarding_step2_completed'),
  onboardingCompleted: (role: string, completionTime?: number) =>
    trackEvent('Auth', 'onboarding_completed', role, completionTime),
  onboardingSkipped: () => trackEvent('Auth', 'onboarding_skipped'),

  // Logout
  logoutCompleted: () => trackEvent('Auth', 'logout_completed'),

  // Errors
  rateLimitExceeded: (action: string) =>
    trackEvent('Auth', 'rate_limit_exceeded', action),
  errorOccurred: (errorCode: string, errorMessage: string) =>
    trackEvent('Auth', 'error_occurred', errorCode, undefined, { message: errorMessage }),
};

// =====================================================
// CMS-SPECIFIC EVENT TRACKING
// =====================================================

export const CMSEvents = {
  // Content Creation
  contentCreated: (type: 'testimonial' | 'case_study' | 'resource') =>
    trackEvent('CMS', 'content_created', type),
  contentPublished: (type: string, contentId: string) =>
    trackEvent('CMS', 'content_published', type, undefined, { contentId }),
  contentUnpublished: (type: string) =>
    trackEvent('CMS', 'content_unpublished', type),
  contentDeleted: (type: string) =>
    trackEvent('CMS', 'content_deleted', type),

  // Bulk Actions
  bulkActionPerformed: (action: string, count: number) =>
    trackEvent('CMS', 'bulk_action_performed', action, count),

  // Search & Filter
  searchPerformed: (query: string, resultsCount: number) =>
    trackEvent('CMS', 'search_performed', query, resultsCount),
  filterApplied: (filterType: string) =>
    trackEvent('CMS', 'filter_applied', filterType),
};

// =====================================================
// ADMIN-SPECIFIC EVENT TRACKING
// =====================================================

export const AdminEvents = {
  // Moderation
  itemModerated: (action: 'approve' | 'reject', itemType: string) =>
    trackEvent('Admin', 'item_moderated', action, undefined, { itemType }),
  
  // User Management
  userRoleChanged: (newRole: string) =>
    trackEvent('Admin', 'user_role_changed', newRole),
  userBlocked: () => trackEvent('Admin', 'user_blocked'),
  userUnblocked: () => trackEvent('Admin', 'user_unblocked'),

  // Payments
  paymentApproved: (amount: number) =>
    trackEvent('Admin', 'payment_approved', undefined, amount),
  paymentRejected: () =>
    trackEvent('Admin', 'payment_rejected'),
};

// =====================================================
// CONVERSION TRACKING
// =====================================================

export const ConversionEvents = {
  // Signup Funnel
  signupFunnelStarted: () => trackEvent('Conversion', 'signup_funnel_started'),
  signupFunnelCompleted: (durationSeconds: number) =>
    trackEvent('Conversion', 'signup_funnel_completed', undefined, durationSeconds),
  signupFunnelAbandoned: (step: string) =>
    trackEvent('Conversion', 'signup_funnel_abandoned', step),

  // Onboarding Funnel
  onboardingFunnelStarted: () => trackEvent('Conversion', 'onboarding_funnel_started'),
  onboardingFunnelCompleted: (durationSeconds: number) =>
    trackEvent('Conversion', 'onboarding_funnel_completed', undefined, durationSeconds),

  // Key Actions
  firstProjectCreated: () => trackEvent('Conversion', 'first_project_created'),
  firstVolunteerMatched: () => trackEvent('Conversion', 'first_volunteer_matched'),
  firstDonationMade: (amount: number) =>
    trackEvent('Conversion', 'first_donation_made', undefined, amount),
};

// =====================================================
// PERFORMANCE TRACKING
// =====================================================

export const PerformanceEvents = {
  pageLoadTime: (page: string, loadTime: number) =>
    trackEvent('Performance', 'page_load_time', page, loadTime),
  apiCallDuration: (endpoint: string, duration: number) =>
    trackEvent('Performance', 'api_call_duration', endpoint, duration),
  errorRate: (errorType: string, count: number) =>
    trackEvent('Performance', 'error_rate', errorType, count),
};

// =====================================================
// INITIALIZATION
// =====================================================

/**
 * Initialize all analytics providers
 * Call this once in your main.tsx or App.tsx
 */
export function initializeAnalytics() {
  if (!ANALYTICS_ENABLED) {
    console.log('[Analytics] Analytics disabled');
    return;
  }

  initializeGA4();
  initializeMixpanel();

  console.log('[Analytics] All providers initialized');
}

// =====================================================
// TYPE AUGMENTATION FOR WINDOW
// =====================================================

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    mixpanel: any;
  }
}

export default {
  initialize: initializeAnalytics,
  trackEvent,
  trackPageView,
  identifyUser,
  setUserProperties,
  resetAnalytics,
  AuthEvents,
  CMSEvents,
  AdminEvents,
  ConversionEvents,
  PerformanceEvents,
};