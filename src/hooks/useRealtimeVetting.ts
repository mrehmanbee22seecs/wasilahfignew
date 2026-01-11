import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';

export interface VettingItem {
  id: string;
  entity_type: 'ngo' | 'volunteer' | 'project' | 'document';
  entity_id: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  submitted_date: string;
  reviewed_date?: string;
  sla_deadline: string;
  sla_status: 'on_time' | 'approaching' | 'overdue';
  notes?: string;
}

export function useRealtimeVettingQueue(initialQueue: VettingItem[] = []) {
  const [queue, setQueue] = useState<VettingItem[]>(initialQueue);
  const [newItemCount, setNewItemCount] = useState(0);

  useEffect(() => {
    setQueue(initialQueue);
  }, [initialQueue]);

  const { isConnected } = useRealtimeSubscription<VettingItem>(
    {
      table: 'vetting_queue',
    },
    {
      onInsert: (newItem) => {
        setQueue((prev) => [newItem, ...prev]);
        setNewItemCount((prev) => prev + 1);
      },
      onUpdate: (updatedItem) => {
        setQueue((prev) =>
          prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      },
      onDelete: (deletedItem) => {
        setQueue((prev) => prev.filter((item) => item.id !== deletedItem.id));
      },
    },
    true
  );

  const clearNewItemCount = () => setNewItemCount(0);

  return { queue, newItemCount, clearNewItemCount, isConnected };
}

export function useRealtimeVettingItem(itemId: string | null, initialItem?: VettingItem) {
  const [item, setItem] = useState<VettingItem | null>(initialItem || null);

  useEffect(() => {
    if (initialItem) {
      setItem(initialItem);
    }
  }, [initialItem]);

  const { isConnected } = useRealtimeSubscription<VettingItem>(
    {
      table: 'vetting_queue',
      filter: itemId ? `id=eq.${itemId}` : undefined,
    },
    {
      onUpdate: (updatedItem) => {
        setItem(updatedItem);
      },
      onDelete: () => {
        setItem(null);
      },
    },
    !!itemId
  );

  return { item, isConnected };
}
