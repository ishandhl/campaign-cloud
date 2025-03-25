import { supabase, getCurrentUserId } from '@/lib/supabase';
import { Campaign, User, Transaction, Contribution } from '@/types';

// Admin-only API functions

// Check if the current user is an admin
export const isAdmin = async (): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return false;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return !!data.is_admin;
};

// Get all campaigns for admin review
export const getAllCampaigns = async (): Promise<Campaign[]> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required');
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      profiles:creator_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all campaigns:', error);
    throw error;
  }

  // Transform the data to match our Campaign type
  return data.map((item: any): Campaign => ({
    id: item.id,
    title: item.title,
    description: item.description,
    shortDescription: item.short_description,
    coverImage: item.cover_image,
    category: item.category,
    goalAmount: item.goal_amount,
    currentAmount: item.current_amount,
    startDate: item.start_date,
    endDate: item.end_date,
    creatorId: item.creator_id,
    status: item.status,
    backers: item.backers,
    createdAt: item.created_at,
    creator: item.profiles ? {
      id: item.profiles.id,
      name: item.profiles.name,
      email: item.profiles.email,
      isAdmin: false, // Not needed here
      wallet: { balance: 0 }, // Not needed here
      createdAt: ''
    } : undefined
  }));
};

// Update campaign status (approve, reject, etc.)
export const updateCampaignStatus = async (
  campaignId: string, 
  status: 'draft' | 'pending' | 'active' | 'funded' | 'failed',
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const { error } = await supabase
    .from('campaigns')
    .update({ status })
    .eq('id', campaignId);

  if (error) {
    console.error('Error updating campaign status:', error);
    return { success: false, error: error.message };
  }

  // If notes are provided, add an admin note to the campaign
  if (notes) {
    const userId = await getCurrentUserId();
    
    const { error: noteError } = await supabase
      .from('campaign_notes')
      .insert({
        campaign_id: campaignId,
        admin_id: userId,
        note: notes,
        type: status === 'active' ? 'approval' : 
              status === 'failed' ? 'rejection' : 'status_change'
      });

    if (noteError) {
      console.error('Error adding admin note:', noteError);
      // We don't fail the whole operation if just the note fails
    }
  }

  return { success: true };
};

// Get all users for admin management
export const getAllUsers = async (): Promise<User[]> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }

  // Transform the data to match our User type
  return data.map((item: any): User => ({
    id: item.id,
    name: item.name,
    email: item.email,
    profileImage: item.profile_image,
    isAdmin: item.is_admin,
    wallet: {
      balance: item.wallet_balance
    },
    createdAt: item.created_at
  }));
};

// Update user admin status
export const updateUserAdminStatus = async (
  userId: string, 
  isAdmin: boolean
): Promise<{ success: boolean; error?: string }> => {
  // Verify current user is admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user admin status:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Get all transactions for admin review
export const getAllTransactions = async (): Promise<Transaction[]> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required');
  }

  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all transactions:', error);
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
    createdAt: item.created_at,
    user: item.profiles ? {
      id: item.profiles.id,
      name: item.profiles.name,
      email: item.profiles.email,
      isAdmin: false, // Not needed here
      wallet: { balance: 0 }, // Not needed here
      createdAt: ''
    } : undefined
  }));
};

// Update transaction status (approve, reject)
export const updateTransactionStatus = async (
  transactionId: string, 
  status: 'pending' | 'completed' | 'failed',
  notes?: string
): Promise<{ success: boolean; error?: string }> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  // Get the transaction first to determine if additional actions are needed
  const { data: transaction, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (fetchError) {
    console.error('Error fetching transaction:', fetchError);
    return { success: false, error: fetchError.message };
  }

  // Update the transaction status
  const { error } = await supabase
    .from('transactions')
    .update({ status })
    .eq('id', transactionId);

  if (error) {
    console.error('Error updating transaction status:', error);
    return { success: false, error: error.message };
  }

  // If this is a withdrawal and it's being completed, update the user's wallet balance
  if (transaction.type === 'withdrawal' && status === 'completed') {
    const { error: walletError } = await supabase
      .from('profiles')
      .update({ 
        wallet_balance: supabase.rpc('decrement_wallet', { 
          user_id: transaction.user_id, 
          amount: transaction.amount 
        })
      })
      .eq('id', transaction.user_id);

    if (walletError) {
      console.error('Error updating wallet balance:', walletError);
      // We don't fail the whole operation, but this is a serious issue
      // In a real app, you'd want to implement better error handling and possibly rollback
    }
  }

  // If this is a contribution and it's being completed, update the campaign's current amount
  if (transaction.type === 'contribution' && status === 'completed' && transaction.campaign_id) {
    const { error: campaignError } = await supabase
      .from('campaigns')
      .update({ 
        current_amount: supabase.rpc('increment_campaign_amount', { 
          campaign_id: transaction.campaign_id, 
          amount: transaction.amount 
        }),
        backers: supabase.rpc('increment_backers', { 
          campaign_id: transaction.campaign_id
        })
      })
      .eq('id', transaction.campaign_id);

    if (campaignError) {
      console.error('Error updating campaign amount:', campaignError);
      // We don't fail the whole operation, but this is a serious issue
    }
  }

  // If notes are provided, add an admin note
  if (notes) {
    const userId = await getCurrentUserId();
    
    const { error: noteError } = await supabase
      .from('transaction_notes')
      .insert({
        transaction_id: transactionId,
        admin_id: userId,
        note: notes,
        type: status === 'completed' ? 'approval' : 'rejection'
      });

    if (noteError) {
      console.error('Error adding transaction note:', noteError);
      // We don't fail the whole operation if just the note fails
    }
  }

  return { success: true };
};

// Get system statistics for admin dashboard
export const getSystemStats = async (): Promise<{
  totalUsers: number;
  totalCampaigns: number;
  totalFunds: number;
  pendingCampaigns: number;
  pendingWithdrawals: number;
}> => {
  // Verify admin status first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required');
  }

  // Get total users
  const { count: totalUsers, error: usersError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (usersError) {
    console.error('Error fetching user count:', usersError);
    throw usersError;
  }

  // Get campaign stats
  const { data: campaignStats, error: campaignsError } = await supabase
    .rpc('get_campaign_stats');

  if (campaignsError) {
    console.error('Error fetching campaign stats:', campaignsError);
    throw campaignsError;
  }

  // Get pending withdrawals
  const { count: pendingWithdrawals, error: withdrawalsError } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('type', 'withdrawal')
    .eq('status', 'pending');

  if (withdrawalsError) {
    console.error('Error fetching pending withdrawals:', withdrawalsError);
    throw withdrawalsError;
  }

  return {
    totalUsers: totalUsers || 0,
    totalCampaigns: campaignStats?.total_campaigns || 0,
    totalFunds: campaignStats?.total_funds || 0,
    pendingCampaigns: campaignStats?.pending_campaigns || 0,
    pendingWithdrawals: pendingWithdrawals || 0
  };
};
