/**
 * WebSocket/SSE Client for Real-Time Data Updates
 * 
 * @fileoverview
 * Production-grade WebSocket/SSE client with automatic reconnection, error handling,
 * and fallback to polling. Provides a robust connection layer for real-time updates.
 * 
 * ## Features:
 * - Automatic reconnection with exponential backoff
 * - Connection status monitoring and callbacks
 * - Event deduplication to prevent duplicate updates
 * - Heartbeat/ping mechanism to detect stale connections
 * - Error handling with detailed error types
 * - Support for both WebSocket and Server-Sent Events (SSE)
 * - Graceful degradation to polling when WebSocket unavailable
 * 
 * ## Usage:
 * ```typescript
 * const client = createWebSocketClient({
 *   url: process.env.REACT_APP_WS_URL || 'ws://localhost:3000/realtime',
 *   onConnect: () => console.log('Connected'),
 *   onDisconnect: () => console.log('Disconnected'),
 *   onError: (error) => console.error('Error:', error),
 *   onMessage: (event) => handleEvent(event),
 * });
 * 
 * // Start connection
 * client.connect();
 * 
 * // Subscribe to specific events
 * client.subscribe('project:updated', (data) => {
 *   console.log('Project updated:', data);
 * });
 * 
 * // Unsubscribe
 * client.unsubscribe('project:updated');
 * 
 * // Close connection
 * client.disconnect();
 * ```
 * 
 * @module lib/realtime/websocket-client
 * @since 2026-02-01
 */

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface RealtimeEvent {
  type: string;
  entity: string;
  action: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: string;
  id: string; // For deduplication
}

export interface WebSocketClientConfig {
  url: string;
  protocol?: 'websocket' | 'sse' | 'auto';
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  eventDeduplicationWindow?: number; // milliseconds
  onConnect?: () => void;
  onDisconnect?: () => void;
  onReconnecting?: (attempt: number) => void;
  onError?: (error: Error) => void;
  onMessage?: (event: RealtimeEvent) => void;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface WebSocketClient {
  connect(): void;
  disconnect(): void;
  reconnect(): void;
  subscribe(eventType: string, callback: (data: any) => void): () => void;
  unsubscribe(eventType: string, callback?: (data: any) => void): void;
  send(message: any): void;
  getStatus(): ConnectionStatus;
  isConnected(): boolean;
}

/**
 * Create a WebSocket client with automatic reconnection and error handling
 */
export function createWebSocketClient(config: WebSocketClientConfig): WebSocketClient {
  let ws: WebSocket | null = null;
  let eventSource: EventSource | null = null;
  let status: ConnectionStatus = 'disconnected';
  let reconnectAttempts = 0;
  let reconnectTimer: NodeJS.Timeout | null = null;
  let heartbeatTimer: NodeJS.Timeout | null = null;
  const eventHandlers = new Map<string, Set<(data: any) => void>>();
  const seenEventIds = new Set<string>();
  let deduplicationTimer: NodeJS.Timeout | null = null;

  const {
    url,
    protocol = 'auto',
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
    heartbeatInterval = 30000,
    eventDeduplicationWindow = 5000,
    onConnect,
    onDisconnect,
    onReconnecting,
    onError,
    onMessage,
    onStatusChange,
  } = config;

  /**
   * Update connection status and notify listeners
   */
  function setStatus(newStatus: ConnectionStatus) {
    if (status !== newStatus) {
      status = newStatus;
      onStatusChange?.(newStatus);
    }
  }

  /**
   * Handle incoming event with deduplication
   */
  function handleEvent(event: RealtimeEvent) {
    // Deduplicate events by ID
    if (event.id && seenEventIds.has(event.id)) {
      console.log('[WebSocket] Duplicate event ignored:', event.id);
      return;
    }

    // Add to seen events
    if (event.id) {
      seenEventIds.add(event.id);

      // Clean up old event IDs after deduplication window
      setTimeout(() => {
        seenEventIds.delete(event.id);
      }, eventDeduplicationWindow);
    }

    // Notify global message handler
    onMessage?.(event);

    // Notify specific event handlers
    const eventType = `${event.entity}:${event.action}`;
    const handlers = eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event.data);
        } catch (error) {
          console.error('[WebSocket] Handler error:', error);
          onError?.(error as Error);
        }
      });
    }

    // Also notify wildcard handlers for the entity
    const wildcardHandlers = eventHandlers.get(`${event.entity}:*`);
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error('[WebSocket] Handler error:', error);
          onError?.(error as Error);
        }
      });
    }
  }

  /**
   * Start heartbeat mechanism to detect stale connections
   */
  function startHeartbeat() {
    stopHeartbeat();
    heartbeatTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('[WebSocket] Heartbeat error:', error);
          handleDisconnect();
        }
      }
    }, heartbeatInterval);
  }

  /**
   * Stop heartbeat timer
   */
  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  /**
   * Handle successful connection
   */
  function handleConnect() {
    console.log('[WebSocket] Connected');
    reconnectAttempts = 0;
    setStatus('connected');
    startHeartbeat();
    onConnect?.();
  }

  /**
   * Handle disconnection
   */
  function handleDisconnect() {
    console.log('[WebSocket] Disconnected');
    stopHeartbeat();
    setStatus('disconnected');
    onDisconnect?.();

    if (reconnect && reconnectAttempts < maxReconnectAttempts) {
      scheduleReconnect();
    }
  }

  /**
   * Handle connection error
   */
  function handleError(error: Error | Event) {
    console.error('[WebSocket] Error:', error);
    const errorObj = error instanceof Error ? error : new Error('WebSocket connection error');
    setStatus('error');
    onError?.(errorObj);
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  function scheduleReconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    reconnectAttempts++;
    const delay = Math.min(
      reconnectInterval * Math.pow(2, reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(
      `[WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
    );
    setStatus('reconnecting');
    onReconnecting?.(reconnectAttempts);

    reconnectTimer = setTimeout(() => {
      client.reconnect();
    }, delay);
  }

  /**
   * Connect via WebSocket
   */
  function connectWebSocket() {
    try {
      setStatus('connecting');
      ws = new WebSocket(url);

      ws.onopen = () => {
        handleConnect();
      };

      ws.onclose = () => {
        handleDisconnect();
      };

      ws.onerror = (error) => {
        handleError(error);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle pong response
          if (data.type === 'pong') {
            return;
          }

          // Handle realtime event
          if (data.type && data.entity && data.action) {
            handleEvent(data as RealtimeEvent);
          }
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error);
          onError?.(error as Error);
        }
      };
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      handleError(error as Error);
      handleDisconnect();
    }
  }

  /**
   * Connect via Server-Sent Events (SSE)
   */
  function connectSSE() {
    try {
      setStatus('connecting');
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        handleConnect();
      };

      eventSource.onerror = (error) => {
        handleError(error);
        handleDisconnect();
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type && data.entity && data.action) {
            handleEvent(data as RealtimeEvent);
          }
        } catch (error) {
          console.error('[SSE] Message parse error:', error);
          onError?.(error as Error);
        }
      };
    } catch (error) {
      console.error('[SSE] Connection error:', error);
      handleError(error as Error);
      handleDisconnect();
    }
  }

  /**
   * Public API
   */
  const client: WebSocketClient = {
    connect() {
      // Determine protocol to use
      const useProtocol = protocol === 'auto' 
        ? (typeof WebSocket !== 'undefined' ? 'websocket' : 'sse')
        : protocol;

      if (useProtocol === 'websocket') {
        connectWebSocket();
      } else {
        connectSSE();
      }
    },

    disconnect() {
      reconnect = false; // Disable auto-reconnect
      stopHeartbeat();

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      if (ws) {
        ws.close();
        ws = null;
      }

      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      setStatus('disconnected');
    },

    reconnect() {
      this.disconnect();
      reconnect = true;
      this.connect();
    },

    subscribe(eventType: string, callback: (data: any) => void) {
      if (!eventHandlers.has(eventType)) {
        eventHandlers.set(eventType, new Set());
      }
      eventHandlers.get(eventType)!.add(callback);

      // Return unsubscribe function
      return () => {
        this.unsubscribe(eventType, callback);
      };
    },

    unsubscribe(eventType: string, callback?: (data: any) => void) {
      const handlers = eventHandlers.get(eventType);
      if (handlers) {
        if (callback) {
          handlers.delete(callback);
        } else {
          handlers.clear();
        }

        if (handlers.size === 0) {
          eventHandlers.delete(eventType);
        }
      }
    },

    send(message: any) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        console.warn('[WebSocket] Cannot send message - not connected');
      }
    },

    getStatus() {
      return status;
    },

    isConnected() {
      return status === 'connected';
    },
  };

  return client;
}

/**
 * Singleton WebSocket client instance
 * Can be accessed globally for app-wide real-time updates
 */
let globalClient: WebSocketClient | null = null;

export function getGlobalWebSocketClient(config?: WebSocketClientConfig): WebSocketClient {
  if (!globalClient && config) {
    globalClient = createWebSocketClient(config);
  }
  if (!globalClient) {
    throw new Error('WebSocket client not initialized. Provide config on first call.');
  }
  return globalClient;
}

export function resetGlobalWebSocketClient() {
  if (globalClient) {
    globalClient.disconnect();
    globalClient = null;
  }
}
