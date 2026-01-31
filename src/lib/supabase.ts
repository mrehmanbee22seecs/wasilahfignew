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
      select: () => ({
        eq: () => ({
          single: async () => mockResponse,
          maybeSingle: async () => mockResponse,
        }),
        in: () => ({ then: async (cb: any) => cb(mockResponse) }),
        gte: () => ({ then: async (cb: any) => cb(mockResponse) }),
        order: () => ({
          limit: async () => mockResponse,
        }),
        limit: async () => mockResponse,
      }),
      insert: async () => mockResponse,
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => mockResponse,
          }),
        }),
      }),
      delete: () => ({
        eq: () => mockResponse,
        in: () => mockResponse,
      }),
      upsert: async () => mockResponse,
    }),
    channel: () => ({
      on: () => ({ on: () => ({ on: () => ({ subscribe: () => {} }) }) }),
      subscribe: () => {},
      track: async () => {},
      untrack: () => {},
      presenceState: () => ({}),
    }),
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
