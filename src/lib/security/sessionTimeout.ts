/**
 * Session Timeout Utility
 * 
 * Manages automatic session timeout after period of inactivity.
 * Tracks user activity and provides warnings before auto-logout.
 * 
 * Features:
 * - Configurable timeout periods
 * - Activity detection (mouse, keyboard, touch)
 * - Warning notifications before timeout
 * - Session extension capability
 * - Integration with existing auth system
 */

import { logger } from './secureLogger';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface SessionTimeoutConfig {
  /** Timeout duration in milliseconds (default: 30 minutes) */
  timeoutDuration: number;
  /** Warning duration before timeout in milliseconds (default: 5 minutes) */
  warningDuration: number;
  /** Whether timeout is enabled (default: true) */
  enabled: boolean;
  /** Events that count as activity */
  activityEvents: string[];
  /** Whether to respect "Remember Me" setting */
  respectRememberMe: boolean;
}

export interface SessionTimeoutState {
  /** Whether timeout is currently active */
  isActive: boolean;
  /** Whether warning is being shown */
  showWarning: boolean;
  /** Remaining time in milliseconds */
  remainingTime: number;
  /** Last activity timestamp */
  lastActivity: Date;
  /** Whether user is considered idle */
  isIdle: boolean;
}

export type SessionTimeoutCallback = () => void;
export type ActivityCallback = () => void;

// =====================================================
// CONSTANTS
// =====================================================

const DEFAULT_CONFIG: SessionTimeoutConfig = {
  timeoutDuration: 30 * 60 * 1000, // 30 minutes
  warningDuration: 5 * 60 * 1000, // 5 minutes
  enabled: true,
  activityEvents: [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
  ],
  respectRememberMe: true,
};

// =====================================================
// SESSION TIMEOUT MANAGER
// =====================================================

export class SessionTimeoutManager {
  private config: SessionTimeoutConfig;
  private timeoutId: NodeJS.Timeout | null = null;
  private warningTimeoutId: NodeJS.Timeout | null = null;
  private lastActivity: Date = new Date();
  private isWarningShown: boolean = false;
  private onTimeout: SessionTimeoutCallback | null = null;
  private onWarning: SessionTimeoutCallback | null = null;
  private onActivity: ActivityCallback | null = null;
  private activityListeners: (() => void)[] = [];

  constructor(config: Partial<SessionTimeoutConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Start timeout monitoring
   */
  start(callbacks: {
    onTimeout?: SessionTimeoutCallback;
    onWarning?: SessionTimeoutCallback;
    onActivity?: ActivityCallback;
  } = {}): void {
    if (!this.config.enabled) {
      logger.info('Session timeout is disabled');
      return;
    }

    this.onTimeout = callbacks.onTimeout || null;
    this.onWarning = callbacks.onWarning || null;
    this.onActivity = callbacks.onActivity || null;

    // Register activity listeners
    this.registerActivityListeners();

    // Start timeout timer
    this.resetTimeout();

    logger.info('Session timeout started', {
      timeoutDuration: this.config.timeoutDuration,
      warningDuration: this.config.warningDuration,
    });
  }

  /**
   * Stop timeout monitoring
   */
  stop(): void {
    // Clear timers
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }

    // Remove activity listeners
    this.unregisterActivityListeners();

    logger.info('Session timeout stopped');
  }

  /**
   * Reset timeout (call on user activity)
   */
  resetTimeout(): void {
    // Clear existing timers
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
    }

    this.lastActivity = new Date();
    this.isWarningShown = false;

    // Set warning timer
    const warningTime = this.config.timeoutDuration - this.config.warningDuration;
    this.warningTimeoutId = setTimeout(() => {
      this.showWarning();
    }, warningTime);

    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      this.handleTimeout();
    }, this.config.timeoutDuration);
  }

  /**
   * Extend session (user chose to stay logged in)
   */
  extendSession(): void {
    logger.info('Session extended by user');
    this.isWarningShown = false;
    this.resetTimeout();
  }

  /**
   * Get current timeout state
   */
  getState(): SessionTimeoutState {
    const now = new Date().getTime();
    const lastActivityTime = this.lastActivity.getTime();
    const elapsedTime = now - lastActivityTime;
    const remainingTime = Math.max(0, this.config.timeoutDuration - elapsedTime);
    const isIdle = elapsedTime > (this.config.timeoutDuration - this.config.warningDuration);

    return {
      isActive: this.config.enabled && this.timeoutId !== null,
      showWarning: this.isWarningShown,
      remainingTime,
      lastActivity: this.lastActivity,
      isIdle,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SessionTimeoutConfig>): void {
    const wasEnabled = this.config.enabled;
    this.config = { ...this.config, ...config };

    // Restart if enabling or reconfiguring
    if (this.config.enabled && (!wasEnabled || this.timeoutId)) {
      this.stop();
      this.start({
        onTimeout: this.onTimeout || undefined,
        onWarning: this.onWarning || undefined,
        onActivity: this.onActivity || undefined,
      });
    } else if (!this.config.enabled && wasEnabled) {
      this.stop();
    }
  }

  // =====================================================
  // PRIVATE METHODS
  // =====================================================

  private showWarning(): void {
    if (this.isWarningShown) return;

    this.isWarningShown = true;
    logger.warn('Session timeout warning shown', {
      remainingTime: this.config.warningDuration,
    });

    if (this.onWarning) {
      this.onWarning();
    }
  }

  private handleTimeout(): void {
    logger.warn('Session timed out due to inactivity', {
      lastActivity: this.lastActivity,
      timeoutDuration: this.config.timeoutDuration,
    });

    if (this.onTimeout) {
      this.onTimeout();
    }

    this.stop();
  }

  private handleActivity = (): void => {
    // Only reset if not in warning state or user took action
    if (!this.isWarningShown) {
      this.resetTimeout();
    }

    if (this.onActivity) {
      this.onActivity();
    }
  };

  private registerActivityListeners(): void {
    // Create debounced activity handler
    let debounceTimer: NodeJS.Timeout | null = null;
    const debouncedHandler = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => {
        this.handleActivity();
      }, 1000); // 1 second debounce
    };

    // Register listeners for each activity event
    this.config.activityEvents.forEach((event) => {
      window.addEventListener(event, debouncedHandler, true);
      this.activityListeners.push(() => {
        window.removeEventListener(event, debouncedHandler, true);
      });
    });
  }

  private unregisterActivityListeners(): void {
    this.activityListeners.forEach((cleanup) => cleanup());
    this.activityListeners = [];
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Format remaining time as human-readable string
 */
export function formatRemainingTime(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Get timeout configuration from environment
 */
export function getTimeoutConfigFromEnv(): Partial<SessionTimeoutConfig> {
  const config: Partial<SessionTimeoutConfig> = {};

  // Check for environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env;

    if (env.VITE_SESSION_TIMEOUT_MINUTES) {
      config.timeoutDuration = parseInt(env.VITE_SESSION_TIMEOUT_MINUTES) * 60 * 1000;
    }

    if (env.VITE_SESSION_WARNING_MINUTES) {
      config.warningDuration = parseInt(env.VITE_SESSION_WARNING_MINUTES) * 60 * 1000;
    }

    if (env.VITE_SESSION_TIMEOUT_ENABLED !== undefined) {
      config.enabled = env.VITE_SESSION_TIMEOUT_ENABLED === 'true';
    }
  }

  return config;
}

// =====================================================
// SINGLETON INSTANCE
// =====================================================

let globalTimeoutManager: SessionTimeoutManager | null = null;

/**
 * Get or create global timeout manager instance
 */
export function getSessionTimeoutManager(): SessionTimeoutManager {
  if (!globalTimeoutManager) {
    const envConfig = getTimeoutConfigFromEnv();
    globalTimeoutManager = new SessionTimeoutManager(envConfig);
  }
  return globalTimeoutManager;
}

/**
 * Reset global timeout manager (useful for testing)
 */
export function resetSessionTimeoutManager(): void {
  if (globalTimeoutManager) {
    globalTimeoutManager.stop();
    globalTimeoutManager = null;
  }
}
