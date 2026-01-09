/**
 * reCAPTCHA Service
 * 
 * Provides Google reCAPTCHA v3 integration for abuse prevention
 * Protects signup, login, password reset, and other sensitive operations
 * 
 * SETUP:
 * 1. Get reCAPTCHA keys from: https://www.google.com/recaptcha/admin
 * 2. Add to .env:
 *    - VITE_RECAPTCHA_SITE_KEY (public, for frontend)
 *    - VITE_RECAPTCHA_SECRET_KEY (private, for backend - NOT in frontend!)
 * 3. Call initializeRecaptcha() in main.tsx
 * 4. Use executeRecaptcha() before sensitive operations
 */

// =====================================================
// CONFIGURATION
// =====================================================

const RECAPTCHA_SITE_KEY = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_RECAPTCHA_SITE_KEY || '' 
  : '';
const RECAPTCHA_ENABLED = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.VITE_RECAPTCHA_ENABLED !== 'false'
  : false;
const IS_PRODUCTION = typeof import.meta !== 'undefined' && import.meta.env 
  ? import.meta.env.NODE_ENV === 'production'
  : false;

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface RecaptchaResponse {
  success: boolean;
  token?: string;
  error?: string;
  score?: number; // Only available after backend verification
}

export type RecaptchaAction = 
  | 'signup'
  | 'login'
  | 'password_reset'
  | 'otp_resend'
  | 'contact_form'
  | 'project_create'
  | 'payment'
  | 'comment';

// =====================================================
// INITIALIZATION
// =====================================================

let isRecaptchaLoaded = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Load Google reCAPTCHA v3 script
 */
function loadRecaptchaScript(): Promise<void> {
  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Already loaded
  if (isRecaptchaLoaded && window.grecaptcha) {
    return Promise.resolve();
  }

  loadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="recaptcha"]`);
    if (existingScript) {
      isRecaptchaLoaded = true;
      resolve();
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isRecaptchaLoaded = true;
      console.log('[reCAPTCHA] Script loaded successfully');
      
      // Wait for grecaptcha to be ready
      const checkReady = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          clearInterval(checkReady);
          window.grecaptcha.ready(() => {
            console.log('[reCAPTCHA] Ready');
            resolve();
          });
        }
      }, 100);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if (!isRecaptchaLoaded) {
          reject(new Error('reCAPTCHA failed to initialize'));
        }
      }, 5000);
    };

    script.onerror = () => {
      loadingPromise = null;
      reject(new Error('Failed to load reCAPTCHA script'));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}

/**
 * Initialize reCAPTCHA
 * Call this once in main.tsx or App.tsx
 */
export async function initializeRecaptcha(): Promise<void> {
  if (!RECAPTCHA_SITE_KEY) {
    console.warn('[reCAPTCHA] Site key not configured. reCAPTCHA disabled.');
    return;
  }

  if (!RECAPTCHA_ENABLED) {
    console.log('[reCAPTCHA] Disabled via environment variable');
    return;
  }

  try {
    await loadRecaptchaScript();
    console.log('[reCAPTCHA] Initialized successfully');
  } catch (error) {
    console.error('[reCAPTCHA] Initialization error:', error);
  }
}

// =====================================================
// EXECUTE RECAPTCHA
// =====================================================

/**
 * Execute reCAPTCHA and get token
 * 
 * @param action - Action identifier (e.g., 'login', 'signup')
 * @returns Promise with token or error
 */
export async function executeRecaptcha(action: RecaptchaAction): Promise<RecaptchaResponse> {
  // Skip if disabled
  if (!RECAPTCHA_ENABLED || !RECAPTCHA_SITE_KEY) {
    console.log('[reCAPTCHA] Skipped (disabled or not configured)');
    return { success: true }; // Allow operation to proceed
  }

  try {
    // Ensure reCAPTCHA is loaded
    if (!isRecaptchaLoaded) {
      await loadRecaptchaScript();
    }

    // Check if grecaptcha is available
    if (!window.grecaptcha || !window.grecaptcha.execute) {
      throw new Error('reCAPTCHA not loaded');
    }

    // Execute reCAPTCHA
    const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });

    if (!token) {
      throw new Error('Failed to get reCAPTCHA token');
    }

    console.log(`[reCAPTCHA] Token generated for action: ${action}`);

    return {
      success: true,
      token,
    };
  } catch (error: any) {
    console.error('[reCAPTCHA] Execution error:', error);
    
    // In development, allow operations to proceed even on error
    if (!IS_PRODUCTION) {
      console.warn('[reCAPTCHA] Error ignored in development mode');
      return { success: true };
    }

    return {
      success: false,
      error: error.message || 'reCAPTCHA verification failed',
    };
  }
}

// =====================================================
// BACKEND VERIFICATION (Server-side)
// =====================================================

/**
 * Verify reCAPTCHA token on backend
 * 
 * IMPORTANT: This should be called on your backend, NOT in frontend!
 * The secret key must NEVER be exposed to the client.
 * 
 * Backend implementation example (Supabase Edge Function):
 * 
 * ```typescript
 * async function verifyRecaptchaToken(token: string, expectedAction?: string) {
 *   const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');
 *   
 *   const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
 *     body: `secret=${secretKey}&response=${token}`
 *   });
 *   
 *   const data = await response.json();
 *   
 *   // Check score (v3 specific)
 *   if (data.success && data.score >= 0.5) {
 *     // Check action matches
 *     if (expectedAction && data.action !== expectedAction) {
 *       return { success: false, error: 'Action mismatch' };
 *     }
 *     return { success: true, score: data.score };
 *   }
 *   
 *   return { success: false, error: 'Low score or verification failed' };
 * }
 * ```
 */

// =====================================================
// FRONTEND UTILITIES
// =====================================================

/**
 * Check if reCAPTCHA is loaded and ready
 */
export function isRecaptchaReady(): boolean {
  return isRecaptchaLoaded && !!window.grecaptcha;
}

/**
 * Reset reCAPTCHA (useful for testing or after errors)
 */
export function resetRecaptcha(): void {
  if (window.grecaptcha && window.grecaptcha.reset) {
    window.grecaptcha.reset();
    console.log('[reCAPTCHA] Reset');
  }
}

/**
 * Hide reCAPTCHA badge (optional, but must show terms in UI)
 * 
 * Add this CSS to hide the badge:
 * .grecaptcha-badge { visibility: hidden; }
 * 
 * AND display this text in your UI:
 * "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
 */
export function hideRecaptchaBadge(): void {
  const style = document.createElement('style');
  style.innerHTML = '.grecaptcha-badge { visibility: hidden; }';
  document.head.appendChild(style);
  
  console.log('[reCAPTCHA] Badge hidden. Remember to show reCAPTCHA terms in UI!');
}

// =====================================================
// CONVENIENCE WRAPPERS FOR COMMON ACTIONS
// =====================================================

export const RecaptchaActions = {
  /**
   * Execute reCAPTCHA for signup
   */
  signup: () => executeRecaptcha('signup'),

  /**
   * Execute reCAPTCHA for login
   */
  login: () => executeRecaptcha('login'),

  /**
   * Execute reCAPTCHA for password reset
   */
  passwordReset: () => executeRecaptcha('password_reset'),

  /**
   * Execute reCAPTCHA for OTP resend
   */
  otpResend: () => executeRecaptcha('otp_resend'),

  /**
   * Execute reCAPTCHA for contact form
   */
  contactForm: () => executeRecaptcha('contact_form'),

  /**
   * Execute reCAPTCHA for project creation
   */
  projectCreate: () => executeRecaptcha('project_create'),

  /**
   * Execute reCAPTCHA for payment
   */
  payment: () => executeRecaptcha('payment'),

  /**
   * Execute reCAPTCHA for comment submission
   */
  comment: () => executeRecaptcha('comment'),
};

// =====================================================
// SCORE INTERPRETATION (Reference)
// =====================================================

/**
 * reCAPTCHA v3 Score Guidelines:
 * 
 * 1.0 - Very likely a legitimate user
 * 0.9 - Likely legitimate
 * 0.7 - Possibly legitimate (recommended threshold)
 * 0.5 - Suspicious (may require additional verification)
 * 0.3 - Likely a bot
 * 0.0 - Very likely a bot
 * 
 * Recommended Actions:
 * - >= 0.7: Allow action
 * - 0.5-0.7: Allow with caution, maybe add email verification
 * - 0.3-0.5: Challenge with additional verification (email OTP, etc.)
 * - < 0.3: Block action
 */

// =====================================================
// TYPE AUGMENTATION FOR WINDOW
// =====================================================

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      reset: () => void;
    };
  }
}

export default {
  initialize: initializeRecaptcha,
  execute: executeRecaptcha,
  isReady: isRecaptchaReady,
  reset: resetRecaptcha,
  hideBadge: hideRecaptchaBadge,
  actions: RecaptchaActions,
};