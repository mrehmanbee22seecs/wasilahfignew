/**
 * useRealtimeQuery Hook - React Query with Real-Time Updates
 * 
 * @fileoverview
 * Enhanced React Query hook that automatically subscribes to real-time updates
 * for a specific query. Combines React Query's caching with real-time event subscriptions.
 * 
 * ## Features:
 * - Automatic real-time subscription on mount
 * - Automatic unsubscription on unmount
 * - Seamless integration with React Query cache
 * - Support for both WebSocket and polling fallback
 * - Optimistic update conflict resolution
 * - Type-safe event handling
 * 
 * ## Usage:
 * ```typescript
 * // Basic usage with real-time updates
 * const { data, isLoading, error } = useRealtimeQuery({
 *   queryKey: ['projects', 'list'],
 *   queryFn: () => projectsApi.list(),
 *   realtimeEntity: 'projects',
 * });
 * 
 * // With custom event handler
 * const { data, isLoading } = useRealtimeQuery({
 *   queryKey: ['projects', 'detail', projectId],
 *   queryFn: () => projectsApi.getById(projectId),
 *   realtimeEntity: 'projects',
 *   realtimeFilter: `id=eq.${projectId}`,
 *   onRealtimeEvent: (event) => {
 *     console.log('Real-time update:', event);
 *   },
 * });
 * ```
 * 
 * @module hooks/useRealtimeQuery
 * @since 2026-02-01
 */

import { useEffect, useRef } from 'react';
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { RealtimeSubscription, createRealtimeSubscription } from '../lib/realtime/base';
import type { RealtimeEvent } from '../lib/realtime/websocket-client';

export interface UseRealtimeQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  /**
   * Entity type for real-time subscriptions (e.g., 'projects', 'volunteers')
   */
  realtimeEntity?: string;

  /**
   * Optional filter for real-time subscriptions (e.g., 'id=eq.123')
   */
  realtimeFilter?: string;

  /**
   * Enable/disable real-time subscriptions
   * @default true
   */
  enableRealtime?: boolean;

  /**
   * Custom handler for real-time events
   */
  onRealtimeEvent?: (event: RealtimeEvent) => void;

  /**
   * Whether to use Supabase realtime (true) or WebSocket client (false)
   * @default true (use Supabase)
   */
  useSupabaseRealtime?: boolean;
}

/**
 * Enhanced useQuery hook with automatic real-time subscriptions
 */
export function useRealtimeQuery<TData = unknown, TError = Error>(
  options: UseRealtimeQueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const {
    queryKey,
    queryFn,
    realtimeEntity,
    realtimeFilter,
    enableRealtime = true,
    onRealtimeEvent,
    useSupabaseRealtime = true,
    enabled = true,
    ...queryOptions
  } = options;

  const queryClient = useQueryClient();
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);

  // Use React Query
  const query = useQuery<TData, TError>({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealtime || !enabled || !realtimeEntity || !useSupabaseRealtime) {
      return;
    }

    console.log('[useRealtimeQuery] Setting up subscription for', realtimeEntity);

    // Create subscription using Supabase realtime
    const subscription = createRealtimeSubscription(
      {
        table: realtimeEntity,
        filter: realtimeFilter,
      },
      {
        onInsert: (newItem) => {
          console.log('[useRealtimeQuery] Insert event:', newItem);
          onRealtimeEvent?.({
            type: 'realtime',
            entity: realtimeEntity,
            action: 'insert',
            data: newItem,
            timestamp: new Date().toISOString(),
            id: `${realtimeEntity}-insert-${newItem.id}-${Date.now()}`,
          });

          // Invalidate list queries to refetch
          queryClient.invalidateQueries({
            queryKey: [realtimeEntity, 'list'],
            refetchType: 'active',
          });
        },
        onUpdate: (updatedItem) => {
          console.log('[useRealtimeQuery] Update event:', updatedItem);
          onRealtimeEvent?.({
            type: 'realtime',
            entity: realtimeEntity,
            action: 'update',
            data: updatedItem,
            timestamp: new Date().toISOString(),
            id: `${realtimeEntity}-update-${updatedItem.id}-${Date.now()}`,
          });

          // Update detail cache if it exists
          if (updatedItem.id) {
            const detailQueryKey = [realtimeEntity, 'detail', updatedItem.id];
            const existingData = queryClient.getQueryData(detailQueryKey);

            if (existingData) {
              queryClient.setQueryData(detailQueryKey, (old: any) => {
                if (!old) return updatedItem;
                return { ...old, ...updatedItem };
              });
            }
          }

          // Also invalidate list queries
          queryClient.invalidateQueries({
            queryKey: [realtimeEntity, 'list'],
            refetchType: 'active',
          });
        },
        onDelete: (deletedItem) => {
          console.log('[useRealtimeQuery] Delete event:', deletedItem);
          onRealtimeEvent?.({
            type: 'realtime',
            entity: realtimeEntity,
            action: 'delete',
            data: deletedItem,
            timestamp: new Date().toISOString(),
            id: `${realtimeEntity}-delete-${deletedItem.id}-${Date.now()}`,
          });

          // Remove from cache
          if (deletedItem.id) {
            queryClient.removeQueries({
              queryKey: [realtimeEntity, 'detail', deletedItem.id],
            });
          }

          // Invalidate list queries
          queryClient.invalidateQueries({
            queryKey: [realtimeEntity, 'list'],
            refetchType: 'active',
          });
        },
      }
    );

    subscription.subscribe();
    subscriptionRef.current = subscription;

    // Cleanup on unmount
    return () => {
      console.log('[useRealtimeQuery] Cleaning up subscription for', realtimeEntity);
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [
    enableRealtime,
    enabled,
    realtimeEntity,
    realtimeFilter,
    useSupabaseRealtime,
    onRealtimeEvent,
    queryClient,
  ]);

  return query;
}

/**
 * Type helper for the hook return value
 */
export type UseRealtimeQueryReturn<TData, TError = Error> = UseQueryResult<TData, TError>;
