import { useEffect, useRef, useState } from 'react';
import { createBroadcastChannel, BroadcastChannel } from '../lib/realtime/base';

export function useBroadcast(channelName: string, onMessage?: (payload: any) => void) {
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!channelName) return;

    const channel = createBroadcastChannel(channelName);
    broadcastChannelRef.current = channel;

    if (onMessage) {
      channel.subscribe((payload) => {
        onMessage(payload.payload);
      });
    }

    setIsConnected(true);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.unsubscribe();
        broadcastChannelRef.current = null;
        setIsConnected(false);
      }
    };
  }, [channelName]);

  const broadcast = (event: string, payload: any) => {
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.send(event, payload);
    }
  };

  return { broadcast, isConnected };
}

export function useTypingIndicator(channelName: string, userId: string | null, userName: string) {
  const [typingUsers, setTypingUsers] = useState<{ userId: string; userName: string }[]>([]);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const { broadcast } = useBroadcast(channelName, (payload) => {
    if (payload.event === 'typing') {
      const { userId: typingUserId, userName: typingUserName } = payload;

      if (typingUserId === userId) return;

      setTypingUsers((prev) => {
        const exists = prev.find((u) => u.userId === typingUserId);
        if (!exists) {
          return [...prev, { userId: typingUserId, userName: typingUserName }];
        }
        return prev;
      });

      if (typingTimeoutRef.current[typingUserId]) {
        clearTimeout(typingTimeoutRef.current[typingUserId]);
      }

      typingTimeoutRef.current[typingUserId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== typingUserId));
        delete typingTimeoutRef.current[typingUserId];
      }, 3000);
    } else if (payload.event === 'stopped_typing') {
      const { userId: stoppedUserId } = payload;
      setTypingUsers((prev) => prev.filter((u) => u.userId !== stoppedUserId));
      if (typingTimeoutRef.current[stoppedUserId]) {
        clearTimeout(typingTimeoutRef.current[stoppedUserId]);
        delete typingTimeoutRef.current[stoppedUserId];
      }
    }
  });

  const startTyping = () => {
    if (userId) {
      broadcast('typing', { userId, userName });
    }
  };

  const stopTyping = () => {
    if (userId) {
      broadcast('stopped_typing', { userId, userName });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  return { typingUsers, startTyping, stopTyping };
}
