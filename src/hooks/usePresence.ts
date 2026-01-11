import { useState, useEffect, useRef } from 'react';
import { createPresenceChannel, PresenceChannel } from '../lib/realtime/base';

export interface PresenceState {
  [userId: string]: {
    user_id: string;
    online_at: string;
    [key: string]: any;
  }[];
}

export function usePresence(channelName: string, userId: string | null, initialState: any = {}) {
  const [presenceState, setPresenceState] = useState<PresenceState>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const presenceChannelRef = useRef<PresenceChannel | null>(null);

  useEffect(() => {
    if (!userId || !channelName) {
      return;
    }

    const channel = createPresenceChannel(channelName);
    presenceChannelRef.current = channel;

    channel.join(userId, initialState).then(() => {
      const interval = setInterval(() => {
        const state = channel.getPresenceState();
        setPresenceState(state);
        setOnlineUsers(Object.keys(state));
      }, 1000);

      return () => clearInterval(interval);
    });

    return () => {
      if (presenceChannelRef.current) {
        presenceChannelRef.current.leave();
        presenceChannelRef.current = null;
      }
    };
  }, [channelName, userId]);

  const updatePresence = async (state: any) => {
    if (presenceChannelRef.current) {
      await presenceChannelRef.current.updateState(state);
    }
  };

  const isUserOnline = (checkUserId: string): boolean => {
    return onlineUsers.includes(checkUserId);
  };

  return {
    presenceState,
    onlineUsers,
    updatePresence,
    isUserOnline,
  };
}

export function useProjectPresence(projectId: string | null, userId: string | null) {
  return usePresence(
    projectId ? `project:${projectId}` : '',
    userId,
    { type: 'project_viewer' }
  );
}

export function useVettingPresence(userId: string | null) {
  return usePresence(
    'vetting_queue',
    userId,
    { type: 'vetting_reviewer' }
  );
}
