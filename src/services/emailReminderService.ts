/**
 * Email Verification Reminder Service
 * 
 * Automatically sends reminder emails to users who haven't verified their email
 * Implements smart retry logic with exponential backoff
 * 
 * IMPLEMENTATION NOTES:
 * - This service runs on the backend (Supabase Edge Function)
 * - Triggered by a cron job or manually
 * - Tracks reminder history to avoid spam
 */

import { supabase } from './authService';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface ReminderConfig {
  firstReminderAfterMinutes: number;  // Default: 60 (1 hour)
  secondReminderAfterHours: number;   // Default: 24 (1 day)
  thirdReminderAfterHours: number;    // Default: 72 (3 days)
  maxReminders: number;                // Default: 3
}

export interface ReminderStatus {
  userId: string;
  email: string;
  signupDate: Date;
  remindersSent: number;
  lastReminderSent?: Date;
  nextReminderDue?: Date;
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

const DEFAULT_CONFIG: ReminderConfig = {
  firstReminderAfterMinutes: 60,     // 1 hour after signup
  secondReminderAfterHours: 24,      // 1 day after signup
  thirdReminderAfterHours: 72,       // 3 days after signup
  maxReminders: 3,
};

// =====================================================
// REMINDER LOGIC
// =====================================================

/**
 * Check if a user needs a verification reminder
 * 
 * BACKEND ONLY - This function should run on Supabase Edge Function
 */
export async function checkAndSendReminders(config: ReminderConfig = DEFAULT_CONFIG) {
  try {
    // Get unverified users
    const { data: unverifiedUsers, error } = await supabase
      .from('profiles')
      .select('id, email, created_at, email_verified')
      .eq('email_verified', false)
      .eq('onboarding_completed', false)
      .lt('created_at', new Date(Date.now() - config.firstReminderAfterMinutes * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching unverified users:', error);
      return { success: false, error };
    }

    if (!unverifiedUsers || unverifiedUsers.length === 0) {
      console.log('No unverified users found');
      return { success: true, remindersSent: 0 };
    }

    let remindersSent = 0;

    for (const user of unverifiedUsers) {
      // Check reminder history
      const { data: reminderHistory } = await supabase
        .from('auth_metadata')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', 'verification_reminder_sent')
        .order('created_at', { ascending: false });

      const reminderCount = reminderHistory?.length || 0;

      // Don't send more than max reminders
      if (reminderCount >= config.maxReminders) {
        continue;
      }

      // Calculate when next reminder should be sent
      const signupDate = new Date(user.created_at);
      const now = new Date();
      const hoursSinceSignup = (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60);

      let shouldSendReminder = false;

      if (reminderCount === 0) {
        // First reminder: after firstReminderAfterMinutes
        const minutesSinceSignup = (now.getTime() - signupDate.getTime()) / (1000 * 60);
        shouldSendReminder = minutesSinceSignup >= config.firstReminderAfterMinutes;
      } else if (reminderCount === 1) {
        // Second reminder: after secondReminderAfterHours
        shouldSendReminder = hoursSinceSignup >= config.secondReminderAfterHours;
      } else if (reminderCount === 2) {
        // Third reminder: after thirdReminderAfterHours
        shouldSendReminder = hoursSinceSignup >= config.thirdReminderAfterHours;
      }

      if (shouldSendReminder) {
        // Send reminder email
        const sent = await sendReminderEmail(user.id, user.email, reminderCount + 1);
        
        if (sent) {
          // Log reminder in auth_metadata
          await supabase.from('auth_metadata').insert({
            user_id: user.id,
            event_type: 'verification_reminder_sent',
            success: true,
            metadata: { reminder_number: reminderCount + 1 },
          });

          remindersSent++;
        }
      }
    }

    return { success: true, remindersSent };
  } catch (error: any) {
    console.error('Error in checkAndSendReminders:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send verification reminder email
 * 
 * BACKEND ONLY - Uses Supabase's email service
 */
async function sendReminderEmail(
  userId: string,
  email: string,
  reminderNumber: number
): Promise<boolean> {
  try {
    // In production, use Supabase's built-in email service
    // or custom SMTP configuration

    // Get user's verification OTP (or generate new one)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Error sending reminder email:', error);
      return false;
    }

    console.log(`Reminder email ${reminderNumber} sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
}

// =====================================================
// FRONTEND UTILITIES
// =====================================================

/**
 * Get reminder status for current user (frontend)
 */
export async function getReminderStatus(userId: string): Promise<ReminderStatus | null> {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('created_at, email')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return null;
    }

    // Get reminder history
    const { data: reminders, error: remindersError } = await supabase
      .from('auth_metadata')
      .select('created_at')
      .eq('user_id', userId)
      .eq('event_type', 'verification_reminder_sent')
      .order('created_at', { ascending: false });

    if (remindersError) {
      return null;
    }

    const remindersSent = reminders?.length || 0;
    const lastReminder = reminders && reminders.length > 0 ? new Date(reminders[0].created_at) : undefined;

    // Calculate next reminder due date
    let nextReminderDue: Date | undefined;
    const signupDate = new Date(profile.created_at);

    if (remindersSent === 0) {
      nextReminderDue = new Date(signupDate.getTime() + DEFAULT_CONFIG.firstReminderAfterMinutes * 60 * 1000);
    } else if (remindersSent === 1) {
      nextReminderDue = new Date(signupDate.getTime() + DEFAULT_CONFIG.secondReminderAfterHours * 60 * 60 * 1000);
    } else if (remindersSent === 2) {
      nextReminderDue = new Date(signupDate.getTime() + DEFAULT_CONFIG.thirdReminderAfterHours * 60 * 60 * 1000);
    }

    return {
      userId,
      email: profile.email,
      signupDate,
      remindersSent,
      lastReminderSent: lastReminder,
      nextReminderDue,
    };
  } catch (error) {
    console.error('Error getting reminder status:', error);
    return null;
  }
}

/**
 * Show reminder notification in frontend
 */
export function showReminderNotification(status: ReminderStatus) {
  const now = new Date();
  
  if (!status.nextReminderDue || status.remindersSent >= DEFAULT_CONFIG.maxReminders) {
    return null;
  }

  const hoursSinceSignup = (now.getTime() - status.signupDate.getTime()) / (1000 * 60 * 60);

  if (hoursSinceSignup < 1) {
    return {
      message: 'Check your email to verify your account',
      severity: 'info' as const,
    };
  } else if (hoursSinceSignup < 24) {
    return {
      message: 'Please verify your email to access all features',
      severity: 'warning' as const,
    };
  } else {
    return {
      message: 'Your account is not verified. Check your email or request a new code.',
      severity: 'error' as const,
    };
  }
}

// =====================================================
// CRON JOB SETUP (Backend)
// =====================================================

/**
 * Example Supabase Edge Function for cron job
 * 
 * File: /supabase/functions/send-verification-reminders/index.ts
 * 
 * ```typescript
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
 * import { checkAndSendReminders } from './emailReminderService.ts';
 * 
 * serve(async (req) => {
 *   // Verify cron secret for security
 *   const authHeader = req.headers.get('authorization');
 *   if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 * 
 *   const result = await checkAndSendReminders();
 *   
 *   return new Response(
 *     JSON.stringify(result),
 *     { 
 *       headers: { 'Content-Type': 'application/json' },
 *       status: result.success ? 200 : 500
 *     }
 *   );
 * });
 * ```
 * 
 * Configure in supabase/functions/.env:
 * CRON_SECRET=your-secret-key
 * 
 * Set up cron job (using GitHub Actions, Vercel Cron, or cron-job.org):
 * Schedule: "0 * * * *" (every hour)
 * URL: https://your-project.supabase.co/functions/v1/send-verification-reminders
 * Headers: Authorization: Bearer your-cron-secret
 */

// =====================================================
// EXPORT
// =====================================================

export default {
  checkAndSendReminders,
  getReminderStatus,
  showReminderNotification,
  DEFAULT_CONFIG,
};
