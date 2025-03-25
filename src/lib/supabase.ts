
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client initialization with environment variables
// These are automatically available from your Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are not set.');
}

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient<Database>(
  supabaseUrl as string,
  supabaseAnonKey as string
);

// Utility function to get the current user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

// Types for database tables
export interface Tables {
  users: User;
  campaigns: Campaign;
  contributions: Contribution;
  transactions: Transaction;
  notifications: Notification;
}
