import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase client initialization with environment variables or fallback values for development
// In production, these should be properly set in your deployment environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// For development purposes only - log a warning instead of throwing an error
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables are not set. Using fallback values for development.');
  console.warn('⚠️ Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  console.warn('⚠️ Visit https://docs.lovable.dev/integrations/supabase/ to learn how to set up Supabase with Lovable.');
}

// Create a single instance of the Supabase client to be used throughout the app
// We provide fallback values that will be valid for createClient but will throw more meaningful errors when used
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-for-error-handling.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Utility function to get the current user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Check if Supabase is properly configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase not properly configured: Missing URL or API key');
      return null;
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Types for database tables
export interface Tables {
  profiles: {
    id: string;
    email: string;
    name: string;
    profile_image?: string;
    is_admin: boolean;
    wallet_balance: number;
    created_at: string;
  };
  campaigns: {
    id: string;
    title: string;
    description: string;
    short_description: string;
    cover_image: string;
    category: string;
    goal_amount: number;
    current_amount: number;
    start_date: string;
    end_date: string;
    creator_id: string;
    status: "draft" | "pending" | "active" | "funded" | "failed";
    backers: number;
    created_at: string;
  };
  contributions: {
    id: string;
    user_id: string;
    campaign_id: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    payment_id: string;
    created_at: string;
  };
  transactions: {
    id: string;
    user_id: string;
    type: "deposit" | "withdrawal" | "contribution" | "refund";
    amount: number;
    status: "pending" | "completed" | "failed";
    payment_id?: string;
    campaign_id?: string;
    created_at: string;
  };
  notifications: {
    id: string;
    user_id: string;
    title: string;
    message: string;
    is_read: boolean;
    type: "campaign_update" | "contribution" | "system";
    related_id?: string;
    created_at: string;
  };
}
