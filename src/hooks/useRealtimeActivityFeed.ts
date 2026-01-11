import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { supabase } from '../lib/supabase';

export interface ActivityItem {
  id: string;
  user_id: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'team';
  metadata?: any;
  created_at: string;
  actor?: {
    display_name: string;
    profile_photo_url?: string;
  };
}

export function useRealtimeActivityFeed(userId: string | null, limit: number = 20) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          actor:profiles!actor_id(display_name, profile_photo_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data) {
        setActivities(data);
      }
      setLoading(false);
    };

    fetchActivities();
  }, [userId, limit]);

  const { isConnected } = useRealtimeSubscription<ActivityItem>(
    {
      table: 'activity_feed',
      filter: userId ? `user_id=eq.${userId}` : undefined,
    },
    {
      onInsert: (newActivity) => {
        setActivities((prev) => [newActivity, ...prev.slice(0, limit - 1)]);
      },
    },
    !!userId
  );

  return { activities, loading, isConnected };
}
