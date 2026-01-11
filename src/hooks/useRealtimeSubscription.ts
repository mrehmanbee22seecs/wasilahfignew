import { useEffect, useRef, useState } from 'react';
import { RealtimeSubscription, SubscriptionConfig, RealtimeCallback, createRealtimeSubscription } from '../lib/realtime/base';

export function useRealtimeSubscription<T = any>(
  config: SubscriptionConfig,
  callbacks: RealtimeCallback<T>,
  enabled: boolean = true
) {
  const subscriptionRef = useRef<RealtimeSubscription | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const subscription = createRealtimeSubscription(config, callbacks);
    subscription.subscribe();
    subscriptionRef.current = subscription;
    setIsConnected(true);

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        setIsConnected(false);
      }
    };
  }, [enabled, config.table, config.filter]);

  return { isConnected };
}
