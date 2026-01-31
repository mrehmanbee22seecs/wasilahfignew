import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are available
const hasCredentials = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasCredentials) {
  console.warn('⚠️ Supabase credentials not found. The app will run in demo mode. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file for full functionality.');
}

// Create a mock client for when credentials are missing
const createMockClient = (): SupabaseClient => {
  const mockResponse = { data: null, error: null };
  const mockAuthResponse = { data: { user: null, session: null }, error: null };
  
  // Create a chainable query builder that returns itself for any method call
  const createChainableQueryBuilder = (): Record<string, unknown> => {
    const builder: Record<string, unknown> = {};
    const handler = {
      get(_target: unknown, prop: string): unknown {
        // Terminal async methods
        if (['single', 'maybeSingle'].includes(prop)) {
          return async () => mockResponse;
        }
        // Promise-like behavior for terminal calls
        if (prop === 'then') {
          return (callback: (result: typeof mockResponse) => void) => Promise.resolve(callback(mockResponse));
        }
        // All other methods return the chainable builder
        return () => new Proxy(builder, handler);
      }
    };
    return new Proxy(builder, handler);
  };

  // Create a chainable channel that handles arbitrary .on() chains
  const createChainableChannel = (): Record<string, unknown> => {
    const channel: Record<string, unknown> = {};
    const handler = {
      get(_target: unknown, prop: string): unknown {
        if (prop === 'on') {
          return () => new Proxy(channel, handler);
        }
        if (prop === 'subscribe') {
          return (callback?: (status: string) => void) => {
            // Call the callback with 'SUBSCRIBED' status to simulate successful subscription
            if (callback) callback('SUBSCRIBED');
          };
        }
        if (prop === 'track') {
          return async () => {};
        }
        if (prop === 'untrack') {
          return () => {};
        }
        if (prop === 'presenceState') {
          return () => ({});
        }
        return () => new Proxy(channel, handler);
      }
    };
    return new Proxy(channel, handler);
  };

  // Create a minimal mock that satisfies the SupabaseClient interface
  const mockClient = {
    auth: {
      getUser: async () => mockAuthResponse,
      getSession: async () => mockAuthResponse,
      signInWithPassword: async () => mockAuthResponse,
      signUp: async () => mockAuthResponse,
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => createChainableQueryBuilder(),
      insert: async () => mockResponse,
      update: () => createChainableQueryBuilder(),
      delete: () => createChainableQueryBuilder(),
      upsert: async () => mockResponse,
    }),
    channel: () => createChainableChannel(),
    removeChannel: () => {},
  } as unknown as SupabaseClient;

  return mockClient;
};

// Only create a real Supabase client if credentials are available
export const supabase: SupabaseClient = hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createMockClient();

// Flag to check if we're using real Supabase
export const isSupabaseConfigured = hasCredentials;

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Helper function to get current session
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Helper function to sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
