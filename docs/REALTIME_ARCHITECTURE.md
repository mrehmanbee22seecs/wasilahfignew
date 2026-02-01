# Real-Time Data Updates Architecture

## Overview

This application uses a robust real-time data update system that integrates WebSocket/SSE connections with React Query for automatic cache synchronization. The system provides live updates across all major entities (Projects, Applications, Volunteers, Payments, Organizations, Admin) while maintaining React Query's powerful caching and optimistic update capabilities.

## Architecture Components

### 1. WebSocket/SSE Client (`lib/realtime/websocket-client.ts`)

Production-grade client with:
- **Automatic Reconnection**: Exponential backoff strategy with configurable max attempts
- **Connection Status Monitoring**: Real-time status updates (connecting, connected, disconnected, reconnecting, error)
- **Event Deduplication**: Prevents duplicate processing of events using unique IDs
- **Heartbeat Mechanism**: Ping/pong to detect stale connections
- **Protocol Flexibility**: Supports both WebSocket and Server-Sent Events (SSE)

```typescript
const client = createWebSocketClient({
  url: process.env.REACT_APP_WS_URL || 'ws://localhost:3000/realtime',
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  onConnect: () => console.log('Connected'),
  onMessage: handleEvent,
});
```

### 2. Polling Fallback (`lib/realtime/polling-fallback.ts`)

Graceful degradation when WebSocket unavailable:
- **Adaptive Polling**: Automatically adjusts frequency based on activity
- **Change Detection**: Efficiently computes diffs to minimize unnecessary updates
- **Multiple Entity Support**: Can poll different entities at different intervals

```typescript
const fallback = createPollingFallback({
  interval: 5000,
  adaptive: true,
  onUpdate: (entity, action, data) => {
    // Handle update
  },
});

fallback.startPolling('projects', async () => {
  const response = await projectsApi.list();
  return response.data;
});
```

### 3. React Query Integration (`lib/realtime/react-query-integration.ts`)

Seamless integration with React Query cache:
- **Automatic Cache Updates**: Real-time events trigger cache updates/invalidations
- **Event-to-Query-Key Mapping**: Maps entity events to React Query cache keys
- **Optimistic Update Support**: Resolves conflicts between optimistic updates and real-time events
- **Selective Invalidation**: Only refetches active queries

```typescript
const integration = createRealtimeIntegration(queryClient, {
  websocketUrl: process.env.REACT_APP_WS_URL,
  enablePollingFallback: true,
});

integration.start();
```

### 4. useRealtimeQuery Hook (`hooks/useRealtimeQuery.ts`)

Enhanced React Query hook with built-in real-time subscriptions:

```typescript
const { data, isLoading, error } = useRealtimeQuery({
  queryKey: ['projects', 'list'],
  queryFn: () => projectsApi.list(),
  realtimeEntity: 'projects',
  enableRealtime: true,
});
```

## Entity Integration

All major entity hooks now support real-time updates:

### Projects
```typescript
// Automatically subscribes to project updates
const { data, isLoading } = useProjects({ status: ['active'] });
```

### Applications
```typescript
// Real-time application status updates
const { data } = useApplications({ project_id: projectId });
```

### Volunteers
```typescript
// Live volunteer profile updates
const { data } = useVolunteers({ city: 'Lahore' });
```

### Payments
```typescript
// Real-time payment approval updates
const { data } = usePayments(corporateId, { status: 'pending' });
```

### Organizations
```typescript
// Live NGO verification status updates
const { data } = useOrganizations({ verification_status: ['verified'] });
```

### Admin
```typescript
// Real-time admin dashboard updates
const { data: stats } = usePlatformStats();
const { data: queue } = useVettingQueue({ status: 'pending' });
```

## Event Flow

```
Backend Change (INSERT/UPDATE/DELETE)
  ↓
WebSocket Event / Polling Detection
  ↓
Event Deduplication
  ↓
React Query Cache Update
  ↓
Component Re-render
  ↓
UI Updates Automatically
```

## Configuration

### Environment Variables

```env
# WebSocket endpoint (optional, defaults to Supabase realtime)
REACT_APP_WS_URL=ws://localhost:3000/realtime

# Enable/disable WebSocket (optional, default: true)
REACT_APP_ENABLE_WEBSOCKET=true

# Enable/disable polling fallback (optional, default: true)
REACT_APP_ENABLE_POLLING_FALLBACK=true

# Polling interval in milliseconds (optional, default: 10000)
REACT_APP_POLLING_INTERVAL=10000
```

### Per-Hook Configuration

Each hook supports disabling real-time updates:

```typescript
// Disable real-time for specific queries
const { data } = useProjects({}, {}, false); // Last param disables realtime
```

## Event Types

### Standard Event Structure

```typescript
interface RealtimeEvent {
  type: string;           // 'realtime' or 'polling'
  entity: string;         // 'projects', 'volunteers', etc.
  action: 'insert' | 'update' | 'delete';
  data: any;             // The entity data
  timestamp: string;      // ISO 8601 timestamp
  id: string;            // Unique event ID for deduplication
}
```

### Supported Entities

| Entity | Table Name | Query Keys |
|--------|-----------|------------|
| Projects | `projects` | `['projects', 'list']`, `['projects', 'detail', id]` |
| Applications | `volunteer_applications` | `['applications', 'list']`, `['applications', 'detail', id]` |
| Volunteers | `volunteers` | `['volunteers', 'list']`, `['volunteers', 'detail', id]` |
| Payments | `payment_approvals` | `['payments', 'list']`, `['payments', 'detail', id]` |
| Organizations | `ngos` | `['organizations', 'list']`, `['organizations', 'detail', id]` |
| Admin Users | `users` | `['admin', 'users', 'list']`, `['admin', 'users', 'detail', id]` |
| Vetting Queue | `vetting_queue` | `['admin', 'vetting', 'list']` |

## Best Practices

1. **Enable real-time by default** for user-facing data
2. **Disable for analytics/reports** that don't need live updates
3. **Use filters** to reduce event volume (e.g., `realtimeFilter: 'project_id=eq.${id}'`)
4. **Test offline behavior** regularly
5. **Monitor connection quality** in production
6. **Document entity changes** that trigger events

## Troubleshooting

### WebSocket Not Connecting
Check `REACT_APP_WS_URL` and verify server is running

### Updates Not Appearing
Verify `enableRealtime: true` and entity name matches table

### Performance Issues
Reduce polling interval or disable real-time for non-critical queries

## Extending the System

### Adding New Entity

1. Add entity mapping in `react-query-integration.ts`
2. Create hook using `useRealtimeQuery`
3. Add tests for integration

---

**Last Updated**: 2026-02-01
**Version**: 1.0.0
