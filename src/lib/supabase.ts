
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// Create a single instance of the Supabase client using the integration values
export const supabase = integrationSupabase;

// Utility function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  // The Supabase client from the integration is already properly configured
  return true;
};

// Utility function to get the current user's ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
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
