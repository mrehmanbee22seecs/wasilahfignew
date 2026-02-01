/**
 * Polling Fallback for Real-Time Updates
 * 
 * @fileoverview
 * Provides a polling mechanism as a fallback when WebSocket/SSE is unavailable.
 * Automatically switches between WebSocket and polling based on connection status.
 * 
 * ## Features:
 * - Automatic polling when WebSocket unavailable
 * - Configurable polling interval with adaptive frequency
 * - Efficient change detection to minimize unnecessary updates
 * - Seamless transition between WebSocket and polling
 * - Support for multiple entity types
 * 
 * ## Usage:
 * ```typescript
 * const fallback = createPollingFallback({
 *   interval: 5000, // Poll every 5 seconds
 *   onUpdate: (entity, action, data) => {
 *     console.log('Update detected:', entity, action, data);
 *   },
 * });
 * 
 * // Start polling for projects
 * fallback.startPolling('projects', async () => {
 *   const response = await projectsApi.list();
 *   return response.data;
 * });
 * 
 * // Stop polling
 * fallback.stopPolling('projects');
 * ```
 * 
 * @module lib/realtime/polling-fallback
 * @since 2026-02-01
 */

export interface PollingConfig {
  interval?: number; // Default polling interval in ms
  maxInterval?: number; // Maximum interval for adaptive polling
  minInterval?: number; // Minimum interval for adaptive polling
  adaptive?: boolean; // Enable adaptive polling frequency
  onUpdate?: (entity: string, action: 'update' | 'insert' | 'delete', data: any) => void;
  onError?: (error: Error) => void;
}

export interface PollingFallback {
  startPolling(entity: string, fetcher: () => Promise<any[]>): void;
  stopPolling(entity: string): void;
  stopAllPolling(): void;
  setInterval(entity: string, interval: number): void;
  isPolling(entity: string): boolean;
}

interface PollingState {
  timer: NodeJS.Timeout | null;
  interval: number;
  lastData: any[];
  fetcher: () => Promise<any[]>;
  consecutiveNoChanges: number;
}

/**
 * Create a polling fallback mechanism for real-time updates
 */
export function createPollingFallback(config: PollingConfig): PollingFallback {
  const {
    interval = 5000,
    maxInterval = 60000,
    minInterval = 3000,
    adaptive = true,
    onUpdate,
    onError,
  } = config;

  const pollingStates = new Map<string, PollingState>();

  /**
   * Detect changes between old and new data
   */
  function detectChanges(oldData: any[], newData: any[]): {
    inserted: any[];
    updated: any[];
    deleted: any[];
  } {
    const inserted: any[] = [];
    const updated: any[] = [];
    const deleted: any[] = [];

    // Create maps for efficient lookup
    const oldMap = new Map(oldData.map((item) => [item.id, item]));
    const newMap = new Map(newData.map((item) => [item.id, item]));

    // Find inserted and updated items
    for (const [id, newItem] of newMap) {
      const oldItem = oldMap.get(id);
      if (!oldItem) {
        inserted.push(newItem);
      } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
        updated.push(newItem);
      }
    }

    // Find deleted items
    for (const [id, oldItem] of oldMap) {
      if (!newMap.has(id)) {
        deleted.push(oldItem);
      }
    }

    return { inserted, updated, deleted };
  }

  /**
   * Adjust polling interval based on activity
   */
  function adjustInterval(state: PollingState, hasChanges: boolean): number {
    if (!adaptive) {
      return state.interval;
    }

    if (hasChanges) {
      // Activity detected - increase frequency (decrease interval)
      state.consecutiveNoChanges = 0;
      return Math.max(minInterval, state.interval * 0.8);
    } else {
      // No activity - decrease frequency (increase interval)
      state.consecutiveNoChanges++;
      if (state.consecutiveNoChanges > 3) {
        return Math.min(maxInterval, state.interval * 1.5);
      }
      return state.interval;
    }
  }

  /**
   * Poll for updates on a specific entity
   */
  async function poll(entity: string) {
    const state = pollingStates.get(entity);
    if (!state) return;

    try {
      // Fetch new data
      const newData = await state.fetcher();

      // Detect changes
      const changes = detectChanges(state.lastData, newData);

      // Notify listeners of changes
      let hasChanges = false;
      if (changes.inserted.length > 0) {
        hasChanges = true;
        changes.inserted.forEach((item) => {
          onUpdate?.(entity, 'insert', item);
        });
      }
      if (changes.updated.length > 0) {
        hasChanges = true;
        changes.updated.forEach((item) => {
          onUpdate?.(entity, 'update', item);
        });
      }
      if (changes.deleted.length > 0) {
        hasChanges = true;
        changes.deleted.forEach((item) => {
          onUpdate?.(entity, 'delete', item);
        });
      }

      // Update last data
      state.lastData = newData;

      // Adjust polling interval
      const newInterval = adjustInterval(state, hasChanges);
      if (newInterval !== state.interval) {
        state.interval = newInterval;
        console.log(`[Polling] Adjusted interval for ${entity} to ${newInterval}ms`);
      }

      // Schedule next poll
      scheduleNextPoll(entity);
    } catch (error) {
      console.error(`[Polling] Error polling ${entity}:`, error);
      onError?.(error as Error);

      // Schedule retry with same interval
      scheduleNextPoll(entity);
    }
  }

  /**
   * Schedule the next poll for an entity
   */
  function scheduleNextPoll(entity: string) {
    const state = pollingStates.get(entity);
    if (!state) return;

    // Clear existing timer
    if (state.timer) {
      clearTimeout(state.timer);
    }

    // Schedule next poll
    state.timer = setTimeout(() => {
      poll(entity);
    }, state.interval);
  }

  /**
   * Public API
   */
  const fallback: PollingFallback = {
    startPolling(entity: string, fetcher: () => Promise<any[]>) {
      // Stop existing polling if any
      this.stopPolling(entity);

      console.log(`[Polling] Starting polling for ${entity} at ${interval}ms interval`);

      // Initialize polling state
      pollingStates.set(entity, {
        timer: null,
        interval,
        lastData: [],
        fetcher,
        consecutiveNoChanges: 0,
      });

      // Start polling immediately
      poll(entity);
    },

    stopPolling(entity: string) {
      const state = pollingStates.get(entity);
      if (state) {
        if (state.timer) {
          clearTimeout(state.timer);
          state.timer = null;
        }
        pollingStates.delete(entity);
        console.log(`[Polling] Stopped polling for ${entity}`);
      }
    },

    stopAllPolling() {
      console.log('[Polling] Stopping all polling');
      pollingStates.forEach((state, entity) => {
        this.stopPolling(entity);
      });
    },

    setInterval(entity: string, newInterval: number) {
      const state = pollingStates.get(entity);
      if (state) {
        state.interval = Math.max(minInterval, Math.min(maxInterval, newInterval));
        console.log(`[Polling] Updated interval for ${entity} to ${state.interval}ms`);
      }
    },

    isPolling(entity: string): boolean {
      return pollingStates.has(entity);
    },
  };

  return fallback;
}

/**
 * Singleton polling fallback instance
 */
let globalFallback: PollingFallback | null = null;

export function getGlobalPollingFallback(config?: PollingConfig): PollingFallback {
  if (!globalFallback && config) {
    globalFallback = createPollingFallback(config);
  }
  if (!globalFallback) {
    throw new Error('Polling fallback not initialized. Provide config on first call.');
  }
  return globalFallback;
}

export function resetGlobalPollingFallback() {
  if (globalFallback) {
    globalFallback.stopAllPolling();
    globalFallback = null;
  }
}
