/**
 * Idle Detection Hook
 * 
 * Detects when a user is idle (no activity) for a specified duration.
 * Useful for triggering actions like session timeout warnings.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface IdleDetectionOptions {
  /** Idle timeout in milliseconds */
  timeout: number;
  /** Events that count as activity */
  events?: string[];
  /** Whether detection is enabled */
  enabled?: boolean;
  /** Callback when user becomes idle */
  onIdle?: () => void;
  /** Callback when user becomes active */
  onActive?: () => void;
}

export interface IdleDetectionState {
  /** Whether user is currently idle */
  isIdle: boolean;
  /** Last activity timestamp */
  lastActivity: Date;
  /** Remaining time until idle (in milliseconds) */
  remainingTime: number;
}

const DEFAULT_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

/**
 * Hook to detect user idleness
 */
export function useIdleDetection(options: IdleDetectionOptions): IdleDetectionState {
  const {
    timeout,
    events = DEFAULT_EVENTS,
    enabled = true,
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [remainingTime, setRemainingTime] = useState(timeout);
  
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const onIdleRef = useRef(onIdle);
  const onActiveRef = useRef(onActive);

  // Update refs when callbacks change
  useEffect(() => {
    onIdleRef.current = onIdle;
    onActiveRef.current = onActive;
  }, [onIdle, onActive]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    const now = new Date();
    setLastActivity(now);
    setRemainingTime(timeout);

    // If was idle, trigger onActive callback
    if (isIdle) {
      setIsIdle(false);
      if (onActiveRef.current) {
        onActiveRef.current();
      }
    }

    // Reset timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setIsIdle(true);
      if (onIdleRef.current) {
        onIdleRef.current();
      }
    }, timeout);
  }, [timeout, isIdle]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) {
      // Clean up and reset state
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      setIsIdle(false);
      setRemainingTime(timeout);
      return;
    }

    // Create debounced handler
    let debounceTimer: NodeJS.Timeout | null = null;
    const debouncedHandler = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(handleActivity, 1000); // 1 second debounce
    };

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, debouncedHandler, true);
    });

    // Initial timeout
    handleActivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, debouncedHandler, true);
      });
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [enabled, timeout, events, handleActivity]);

  // Update remaining time periodically
  useEffect(() => {
    if (!enabled || isIdle) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastActivityTime = lastActivity.getTime();
      const elapsed = now - lastActivityTime;
      const remaining = Math.max(0, timeout - elapsed);
      setRemainingTime(remaining);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [enabled, isIdle, lastActivity, timeout]);

  return {
    isIdle,
    lastActivity,
    remainingTime,
  };
}

/**
 * Hook for simple idle detection with boolean result
 */
export function useIdleStatus(timeout: number, enabled: boolean = true): boolean {
  const { isIdle } = useIdleDetection({ timeout, enabled });
  return isIdle;
}

/**
 * Hook for idle detection with callback
 */
export function useIdleCallback(
  timeout: number,
  callback: () => void,
  enabled: boolean = true
): void {
  useIdleDetection({
    timeout,
    enabled,
    onIdle: callback,
  });
}
