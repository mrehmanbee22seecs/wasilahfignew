/**
 * Real-Time Integration Tests
 * 
 * Tests for real-time data updates with React Query integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimeQuery } from '../../hooks/useRealtimeQuery';
import { useProjects } from '../../hooks/queries/useProjects';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn((callback) => {
        callback('SUBSCRIBED');
        return { unsubscribe: vi.fn() };
      }),
    })),
    removeChannel: vi.fn(),
  },
}));

// Mock API
vi.mock('../../lib/api/projects', () => ({
  projectsApi: {
    list: vi.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          data: [{ id: '1', name: 'Project 1' }],
          total: 1,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      })
    ),
  },
}));

describe('Real-Time Integration', () => {
  let queryClient: QueryClient;
  let wrapper: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  afterEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should fetch data with real-time enabled', async () => {
    const { result } = renderHook(() => useProjects({}, {}, true), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(1);
  });

  it('should work without real-time', async () => {
    const { result } = renderHook(() => useProjects({}, {}, false), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data).toHaveLength(1);
  });
});
