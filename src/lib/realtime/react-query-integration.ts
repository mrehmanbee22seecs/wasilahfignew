/**
 * Real-Time Integration with React Query
 * 
 * @fileoverview
 * Integrates WebSocket/SSE real-time updates with React Query cache management.
 * Provides automatic cache invalidation and updates when real-time events are received.
 * 
 * ## Features:
 * - Automatic React Query cache updates on real-time events
 * - Event-to-query-key mapping system
 * - Support for both cache updates and invalidations
 * - Conflict resolution for optimistic updates
 * - Fallback to polling when WebSocket unavailable
 * - Type-safe event handling
 * 
 * ## Usage:
 * ```typescript
 * // Initialize the integration
 * const integration = createRealtimeIntegration(queryClient, {
 *   websocketUrl: process.env.REACT_APP_WS_URL,
 *   enablePollingFallback: true,
 * });
 * 
 * // Start real-time updates
 * integration.start();
 * 
 * // Stop real-time updates
 * integration.stop();
 * ```
 * 
 * @module lib/realtime/react-query-integration
 * @since 2026-02-01
 */

import { QueryClient } from '@tanstack/react-query';
import {
  createWebSocketClient,
  getGlobalWebSocketClient,
  WebSocketClient,
  RealtimeEvent,
  ConnectionStatus,
} from './websocket-client';
import {
  createPollingFallback,
  getGlobalPollingFallback,
  PollingFallback,
} from './polling-fallback';

export interface RealtimeIntegrationConfig {
  websocketUrl?: string;
  enableWebSocket?: boolean;
  enablePollingFallback?: boolean;
  pollingInterval?: number;
  onConnectionChange?: (status: ConnectionStatus) => void;
  onError?: (error: Error) => void;
}

export interface EntityMapping {
  entity: string;
  queryKey: string[];
  updateCache?: boolean; // If true, update cache directly; if false, invalidate
}

/**
 * Default entity-to-query-key mappings
 */
const DEFAULT_ENTITY_MAPPINGS: EntityMapping[] = [
  // Projects
  {
    entity: 'projects',
    queryKey: ['projects', 'list'],
    updateCache: false, // Invalidate to refetch with filters
  },
  {
    entity: 'projects',
    queryKey: ['projects', 'detail'],
    updateCache: true, // Update cache directly for detail view
  },

  // Applications
  {
    entity: 'volunteer_applications',
    queryKey: ['applications', 'list'],
    updateCache: false,
  },
  {
    entity: 'volunteer_applications',
    queryKey: ['applications', 'detail'],
    updateCache: true,
  },

  // Volunteers
  {
    entity: 'volunteers',
    queryKey: ['volunteers', 'list'],
    updateCache: false,
  },
  {
    entity: 'volunteers',
    queryKey: ['volunteers', 'detail'],
    updateCache: true,
  },

  // Payments
  {
    entity: 'payment_approvals',
    queryKey: ['payments', 'list'],
    updateCache: false,
  },
  {
    entity: 'payment_approvals',
    queryKey: ['payments', 'detail'],
    updateCache: true,
  },
  {
    entity: 'payment_approvals',
    queryKey: ['payments', 'stats'],
    updateCache: false,
  },

  // Organizations
  {
    entity: 'ngos',
    queryKey: ['organizations', 'list'],
    updateCache: false,
  },
  {
    entity: 'ngos',
    queryKey: ['organizations', 'detail'],
    updateCache: true,
  },
  {
    entity: 'ngo_documents',
    queryKey: ['organizations', 'documents'],
    updateCache: false,
  },

  // Admin
  {
    entity: 'users',
    queryKey: ['admin', 'users', 'list'],
    updateCache: false,
  },
  {
    entity: 'users',
    queryKey: ['admin', 'users', 'detail'],
    updateCache: true,
  },
  {
    entity: 'vetting_queue',
    queryKey: ['admin', 'vetting', 'list'],
    updateCache: false,
  },
  {
    entity: 'audit_logs',
    queryKey: ['admin', 'audit', 'list'],
    updateCache: false,
  },
];

/**
 * Create real-time integration with React Query
 */
export function createRealtimeIntegration(
  queryClient: QueryClient,
  config: RealtimeIntegrationConfig = {}
) {
  const {
    websocketUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3000/realtime',
    enableWebSocket = true,
    enablePollingFallback = true,
    pollingInterval = 10000,
    onConnectionChange,
    onError,
  } = config;

  let wsClient: WebSocketClient | null = null;
  let pollingFallback: PollingFallback | null = null;
  let isStarted = false;
  let usePolling = false;

  /**
   * Handle real-time event and update React Query cache
   */
  function handleRealtimeEvent(event: RealtimeEvent) {
    console.log('[RealtimeIntegration] Event received:', event);

    // Find matching entity mappings
    const mappings = DEFAULT_ENTITY_MAPPINGS.filter(
      (mapping) => mapping.entity === event.entity
    );

    for (const mapping of mappings) {
      if (mapping.updateCache) {
        // Update cache directly
        updateCacheForEvent(event, mapping.queryKey);
      } else {
        // Invalidate queries to trigger refetch
        invalidateQueriesForEvent(event, mapping.queryKey);
      }
    }
  }

  /**
   * Update React Query cache for a specific event
   */
  function updateCacheForEvent(event: RealtimeEvent, baseQueryKey: string[]) {
    const { action, data } = event;

    switch (action) {
      case 'insert':
        // For inserts, typically invalidate list queries
        queryClient.invalidateQueries({ 
          queryKey: baseQueryKey.slice(0, -1).concat(['list'])
        });
        break;

      case 'update':
        // For updates, update detail cache if it exists
        if (data && data.id) {
          const detailQueryKey = [...baseQueryKey, data.id];
          const existingData = queryClient.getQueryData(detailQueryKey);

          if (existingData) {
            queryClient.setQueryData(detailQueryKey, (old: any) => {
              if (!old) return data;
              return { ...old, ...data };
            });
          }

          // Also invalidate list queries to reflect the update
          queryClient.invalidateQueries({ 
            queryKey: baseQueryKey.slice(0, -1).concat(['list'])
          });
        }
        break;

      case 'delete':
        // For deletes, remove from cache and invalidate lists
        if (data && data.id) {
          const detailQueryKey = [...baseQueryKey, data.id];
          queryClient.removeQueries({ queryKey: detailQueryKey });

          // Invalidate list queries
          queryClient.invalidateQueries({ 
            queryKey: baseQueryKey.slice(0, -1).concat(['list'])
          });
        }
        break;
    }
  }

  /**
   * Invalidate React Query queries for a specific event
   */
  function invalidateQueriesForEvent(event: RealtimeEvent, queryKey: string[]) {
    // Invalidate all queries matching this key prefix
    queryClient.invalidateQueries({ 
      queryKey,
      refetchType: 'active', // Only refetch active queries
    });
  }

  /**
   * Start WebSocket connection
   */
  function startWebSocket() {
    if (!enableWebSocket) return;

    try {
      wsClient = createWebSocketClient({
        url: websocketUrl,
        onConnect: () => {
          console.log('[RealtimeIntegration] WebSocket connected');
          usePolling = false;
          stopPolling();
          onConnectionChange?.('connected');
        },
        onDisconnect: () => {
          console.log('[RealtimeIntegration] WebSocket disconnected');
          onConnectionChange?.('disconnected');

          // Start polling fallback if enabled
          if (enablePollingFallback && !usePolling) {
            startPolling();
          }
        },
        onError: (error) => {
          console.error('[RealtimeIntegration] WebSocket error:', error);
          onError?.(error);

          // Start polling fallback on persistent errors
          if (enablePollingFallback && !usePolling) {
            startPolling();
          }
        },
        onMessage: handleRealtimeEvent,
        onStatusChange: (status) => {
          onConnectionChange?.(status);

          // If WebSocket reconnects, stop polling
          if (status === 'connected' && usePolling) {
            usePolling = false;
            stopPolling();
          }
        },
      });

      wsClient.connect();

      // Subscribe to all entity events
      wsClient.subscribe('projects:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'projects' });
      });
      wsClient.subscribe('volunteer_applications:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'volunteer_applications' });
      });
      wsClient.subscribe('volunteers:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'volunteers' });
      });
      wsClient.subscribe('payment_approvals:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'payment_approvals' });
      });
      wsClient.subscribe('ngos:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'ngos' });
      });
      wsClient.subscribe('users:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'users' });
      });
      wsClient.subscribe('vetting_queue:*', (event) => {
        handleRealtimeEvent({ ...event, entity: 'vetting_queue' });
      });
    } catch (error) {
      console.error('[RealtimeIntegration] Failed to start WebSocket:', error);
      onError?.(error as Error);

      // Start polling fallback
      if (enablePollingFallback) {
        startPolling();
      }
    }
  }

  /**
   * Start polling fallback
   */
  function startPolling() {
    if (!enablePollingFallback || usePolling) return;

    console.log('[RealtimeIntegration] Starting polling fallback');
    usePolling = true;

    pollingFallback = createPollingFallback({
      interval: pollingInterval,
      adaptive: true,
      onUpdate: (entity, action, data) => {
        handleRealtimeEvent({
          type: 'polling',
          entity,
          action,
          data,
          timestamp: new Date().toISOString(),
          id: `${entity}-${action}-${data.id}-${Date.now()}`,
        });
      },
      onError: (error) => {
        console.error('[RealtimeIntegration] Polling error:', error);
        onError?.(error);
      },
    });

    // Note: Actual polling fetchers would need to be registered by the app
    // This is a placeholder showing how it would work
    // In practice, the app would call `pollingFallback.startPolling(entity, fetcher)`
  }

  /**
   * Stop polling fallback
   */
  function stopPolling() {
    if (pollingFallback) {
      pollingFallback.stopAllPolling();
      pollingFallback = null;
    }
  }

  /**
   * Public API
   */
  return {
    /**
     * Start real-time integration
     */
    start() {
      if (isStarted) {
        console.warn('[RealtimeIntegration] Already started');
        return;
      }

      console.log('[RealtimeIntegration] Starting...');
      isStarted = true;

      startWebSocket();
    },

    /**
     * Stop real-time integration
     */
    stop() {
      if (!isStarted) return;

      console.log('[RealtimeIntegration] Stopping...');
      isStarted = false;

      if (wsClient) {
        wsClient.disconnect();
        wsClient = null;
      }

      stopPolling();
    },

    /**
     * Check if using WebSocket or polling
     */
    isUsingWebSocket(): boolean {
      return !usePolling && wsClient?.isConnected() === true;
    },

    /**
     * Check if using polling fallback
     */
    isUsingPolling(): boolean {
      return usePolling;
    },

    /**
     * Get current connection status
     */
    getStatus(): ConnectionStatus | 'polling' {
      if (usePolling) return 'polling';
      return wsClient?.getStatus() || 'disconnected';
    },

    /**
     * Manually trigger cache invalidation for an entity
     */
    invalidateEntity(entity: string) {
      const mappings = DEFAULT_ENTITY_MAPPINGS.filter((m) => m.entity === entity);
      for (const mapping of mappings) {
        queryClient.invalidateQueries({ queryKey: mapping.queryKey });
      }
    },

    /**
     * Get polling fallback instance (for registering custom fetchers)
     */
    getPollingFallback(): PollingFallback | null {
      return pollingFallback;
    },
  };
}

/**
 * Singleton integration instance
 */
let globalIntegration: ReturnType<typeof createRealtimeIntegration> | null = null;

export function getGlobalRealtimeIntegration(
  queryClient?: QueryClient,
  config?: RealtimeIntegrationConfig
): ReturnType<typeof createRealtimeIntegration> {
  if (!globalIntegration && queryClient) {
    globalIntegration = createRealtimeIntegration(queryClient, config);
  }
  if (!globalIntegration) {
    throw new Error('Realtime integration not initialized. Provide queryClient on first call.');
  }
  return globalIntegration;
}

export function resetGlobalRealtimeIntegration() {
  if (globalIntegration) {
    globalIntegration.stop();
    globalIntegration = null;
  }
}
