import { supabase } from '../supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export interface SubscriptionConfig {
  table: string;
  event?: RealtimeEvent | RealtimeEvent[];
  filter?: string;
  schema?: string;
}

export interface RealtimeCallback<T = any> {
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export class RealtimeSubscription {
  private channel: RealtimeChannel | null = null;
  private config: SubscriptionConfig;
  private callbacks: RealtimeCallback;
  private isSubscribed: boolean = false;

  constructor(config: SubscriptionConfig, callbacks: RealtimeCallback) {
    this.config = config;
    this.callbacks = callbacks;
  }

  subscribe(): void {
    if (this.isSubscribed) {
      console.warn('[Realtime] Already subscribed to', this.config.table);
      return;
    }

    const channelName = `${this.config.table}_${Date.now()}`;
    this.channel = supabase.channel(channelName);

    const events = Array.isArray(this.config.event) 
      ? this.config.event 
      : this.config.event 
        ? [this.config.event] 
        : ['INSERT', 'UPDATE', 'DELETE'];

    events.forEach(event => {
      let postgresChanges: any = {
        event,
        schema: this.config.schema || 'public',
        table: this.config.table,
      };

      if (this.config.filter) {
        postgresChanges.filter = this.config.filter;
      }

      this.channel!.on(
        'postgres_changes',
        postgresChanges,
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('[Realtime]', event, 'on', this.config.table, payload);

          if (this.callbacks.onChange) {
            this.callbacks.onChange(payload);
          }

          switch (payload.eventType) {
            case 'INSERT':
              this.callbacks.onInsert?.(payload.new);
              break;
            case 'UPDATE':
              this.callbacks.onUpdate?.(payload.new);
              break;
            case 'DELETE':
              this.callbacks.onDelete?.(payload.old);
              break;
          }
        }
      );
    });

    this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        this.isSubscribed = true;
        console.log('[Realtime] Subscribed to', this.config.table);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[Realtime] Error subscribing to', this.config.table);
        this.isSubscribed = false;
      } else if (status === 'TIMED_OUT') {
        console.error('[Realtime] Subscription timed out for', this.config.table);
        this.isSubscribed = false;
      }
    });
  }

  unsubscribe(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.isSubscribed = false;
      console.log('[Realtime] Unsubscribed from', this.config.table);
    }
  }

  isActive(): boolean {
    return this.isSubscribed;
  }
}

export function createRealtimeSubscription(
  config: SubscriptionConfig,
  callbacks: RealtimeCallback
): RealtimeSubscription {
  return new RealtimeSubscription(config, callbacks);
}

export class PresenceChannel {
  private channel: RealtimeChannel | null = null;
  private channelName: string;
  private userId: string | null = null;
  private userState: any = {};

  constructor(channelName: string) {
    this.channelName = channelName;
  }

  async join(userId: string, state: any = {}): Promise<void> {
    this.userId = userId;
    this.userState = state;

    this.channel = supabase.channel(this.channelName, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    this.channel.on('presence', { event: 'sync' }, () => {
      const presenceState = this.channel!.presenceState();
      console.log('[Presence] Synced', presenceState);
    });

    this.channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('[Presence] User joined', key, newPresences);
    });

    this.channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('[Presence] User left', key, leftPresences);
    });

    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.channel!.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          ...state,
        });
      }
    });
  }

  async updateState(state: any): Promise<void> {
    if (this.channel && this.userId) {
      await this.channel.track({
        user_id: this.userId,
        online_at: new Date().toISOString(),
        ...this.userState,
        ...state,
      });
      this.userState = { ...this.userState, ...state };
    }
  }

  getPresenceState(): any {
    return this.channel?.presenceState() || {};
  }

  leave(): void {
    if (this.channel) {
      this.channel.untrack();
      supabase.removeChannel(this.channel);
      this.channel = null;
      console.log('[Presence] Left channel', this.channelName);
    }
  }
}

export function createPresenceChannel(channelName: string): PresenceChannel {
  return new PresenceChannel(channelName);
}

export class BroadcastChannel {
  private channel: RealtimeChannel | null = null;
  private channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
  }

  subscribe(callback: (payload: any) => void): void {
    this.channel = supabase.channel(this.channelName);

    this.channel.on('broadcast', { event: 'message' }, (payload) => {
      console.log('[Broadcast] Received', payload);
      callback(payload);
    });

    this.channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Broadcast] Subscribed to', this.channelName);
      }
    });
  }

  send(event: string, payload: any): void {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: event,
        payload: payload,
      });
    }
  }

  unsubscribe(): void {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      console.log('[Broadcast] Unsubscribed from', this.channelName);
    }
  }
}

export function createBroadcastChannel(channelName: string): BroadcastChannel {
  return new BroadcastChannel(channelName);
}
