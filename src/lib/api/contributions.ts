
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { Contribution, Transaction } from '@/types';

// Get all contributions for the current user
export const getUserContributions = async (): Promise<Contribution[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('contributions')
    .select(`
      *,
      campaigns (
        id,
        title,
        short_description,
        cover_image,
        goal_amount,
        current_amount,
        status
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user contributions:', error);
    throw error;
  }

  // Transform the data to match our Contribution type
  return data.map((item: any): Contribution => ({
    id: item.id,
    userId: item.user_id,
    campaignId: item.campaign_id,
    amount: item.amount,
    status: item.status,
    paymentId: item.payment_id,
    createdAt: item.created_at,
    campaign: item.campaigns ? {
      id: item.campaigns.id,
      title: item.campaigns.title,
      shortDescription: item.campaigns.short_description,
      coverImage: item.campaigns.cover_image,
      goalAmount: item.campaigns.goal_amount,
      currentAmount: item.campaigns.current_amount,
      status: item.campaigns.status,
      description: '', // These fields are not needed in the contribution list
      category: '',
      startDate: '',
      endDate: '',
      creatorId: '',
      createdAt: ''
    } : undefined
  }));
};

// Create a new contribution
export const createContribution = async (
  campaignId: string, 
  amount: number, 
  paymentId: string
): Promise<{ success: boolean; id?: string; error?: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  // Start a transaction to ensure data consistency
  const { data, error } = await supabase.rpc('create_contribution', {
    p_user_id: userId,
    p_campaign_id: campaignId,
    p_amount: amount,
    p_payment_id: paymentId,
    p_status: 'completed'
  });

  if (error) {
    console.error('Error creating contribution:', error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data };
};

// Get user transactions
export const getUserTransactions = async (): Promise<Transaction[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }

  // Transform the data to match our Transaction type
  return data.map((item: any): Transaction => ({
    id: item.id,
    userId: item.user_id,
    type: item.type,
    amount: item.amount,
    status: item.status,
    paymentId: item.payment_id,
    campaignId: item.campaign_id,
    createdAt: item.created_at
  }));
};

// Get all contributions for a specific campaign
export const getCampaignContributions = async (campaignId: string): Promise<Contribution[]> => {
  const { data, error } = await supabase
    .from('contributions')
    .select(`
      *,
      profiles:user_id (
        id,
        name
      )
    `)
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching campaign contributions:', error);
    throw error;
  }

  // Transform the data to match our Contribution type
  return data.map((item: any): Contribution => ({
    id: item.id,
    userId: item.user_id,
    campaignId: item.campaign_id,
    amount: item.amount,
    status: item.status,
    paymentId: item.payment_id,
    createdAt: item.created_at,
    user: item.profiles ? {
      id: item.profiles.id,
      name: item.profiles.name,
      email: '', // Not included for privacy
      isAdmin: false,
      wallet: { balance: 0 },
      createdAt: ''
    } : undefined
  }));
};
