/**
 * Offline Application Queue
 * Stores failed/offline applications in secure storage and retries when online
 */

import type { ApplicationPayload } from '../types/volunteer';
import { secureStorage } from '../lib/security/secureStorage';
import { logger } from '../lib/security/secureLogger';

export type QueuedApplication = {
  id: string; // Unique queue ID
  payload: ApplicationPayload;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'retrying' | 'failed';
  error?: string;
};

const QUEUE_KEY = 'wasilah_offline_application_queue';
const MAX_RETRIES = 3;

/**
 * Get all queued applications from secure storage
 */
export function getQueuedApplications(): QueuedApplication[] {
  try {
    const stored = secureStorage.getItem<QueuedApplication[]>(QUEUE_KEY);
    return stored || [];
  } catch (error) {
    logger.error('Error reading offline queue', { error });
    return [];
  }
}

/**
 * Add an application to the offline queue
 */
export function queueApplication(payload: ApplicationPayload): string {
  const queueId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const queuedApp: QueuedApplication = {
    id: queueId,
    payload,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: 'pending',
  };

  const queue = getQueuedApplications();
  queue.push(queuedApp);
  
  try {
    secureStorage.setItem(QUEUE_KEY, queue, { encrypt: true });
    return queueId;
  } catch (error) {
    logger.error('Error saving to offline queue', { error });
    throw new Error('Failed to save application to offline queue');
  }
}

/**
 * Update a queued application
 */
export function updateQueuedApplication(
  queueId: string,
  updates: Partial<QueuedApplication>
): void {
  const queue = getQueuedApplications();
  const index = queue.findIndex((app) => app.id === queueId);
  
  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    secureStorage.setItem(QUEUE_KEY, queue, { encrypt: true });
  }
}

/**
 * Remove an application from the queue
 */
export function removeFromQueue(queueId: string): void {
  const queue = getQueuedApplications();
  const filtered = queue.filter((app) => app.id !== queueId);
  secureStorage.setItem(QUEUE_KEY, filtered, { encrypt: true });
}

/**
 * Clear the entire queue
 */
export function clearQueue(): void {
  secureStorage.removeItem(QUEUE_KEY);
}

/**
 * Get pending applications count
 */
export function getPendingCount(): number {
  const queue = getQueuedApplications();
  return queue.filter((app) => app.status === 'pending' || app.status === 'retrying').length;
}

/**
 * Retry all pending applications
 * Returns array of successfully submitted queue IDs
 */
export async function retryPendingApplications(
  submitFn: (payload: ApplicationPayload) => Promise<void>
): Promise<{ succeeded: string[]; failed: string[] }> {
  const queue = getQueuedApplications();
  const pending = queue.filter(
    (app) => app.status === 'pending' || (app.status === 'retrying' && app.retryCount < MAX_RETRIES)
  );

  const succeeded: string[] = [];
  const failed: string[] = [];

  for (const app of pending) {
    try {
      // Update status to retrying
      updateQueuedApplication(app.id, {
        status: 'retrying',
        retryCount: app.retryCount + 1,
      });

      // Attempt submission
      await submitFn(app.payload);

      // Success - remove from queue
      removeFromQueue(app.id);
      succeeded.push(app.id);
    } catch (error) {
      // Failed - update retry count
      const newRetryCount = app.retryCount + 1;
      
      if (newRetryCount >= MAX_RETRIES) {
        updateQueuedApplication(app.id, {
          status: 'failed',
          retryCount: newRetryCount,
          error: String(error),
        });
        failed.push(app.id);
      } else {
        updateQueuedApplication(app.id, {
          status: 'pending',
          retryCount: newRetryCount,
          error: String(error),
        });
      }
    }
  }

  return { succeeded, failed };
}

/**
 * Check if browser is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Setup online/offline event listeners
 */
export function setupOnlineListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  const handleOnline = () => {
    logger.info('Browser is online, retrying pending applications');
    onOnline();
  };

  const handleOffline = () => {
    logger.info('Browser is offline');
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
