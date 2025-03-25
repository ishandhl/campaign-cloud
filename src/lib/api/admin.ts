
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { AdminDashboardStats } from '@/types';

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

  return data.is_admin === true;
};

// Get admin dashboard stats
export const getAdminDashboardStats = async (): Promise<AdminDashboardStats | null> => {
  // Check if the user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return null;
  }

  // This would typically be a single RPC call in a real backend
  // For now, we'll make separate calls and combine them

  // Get total users
  const { count: totalUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  // Get total campaigns
  const { count: totalCampaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true });

  // Get total funds raised
  const { data: fundsData, error: fundsError } = await supabase
    .from('contributions')
    .select('amount')
    .eq('status', 'completed');

  // Get active users (users who have contributed in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count: activeUsers, error: activeUsersError } = await supabase
    .from('contributions')
    .select('user_id', { count: 'exact', head: true })
    .eq('status', 'completed')
    .gt('created_at', thirtyDaysAgo.toISOString());

  // Get active campaigns
  const { count: activeCampaigns, error: activeCampaignsError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get pending campaigns
  const { count: pendingCampaigns, error: pendingCampaignsError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get transactions
  const { count: totalTransactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true });

  // Get pending withdrawals
  const { count: pendingWithdrawals, error: withdrawalsError } = await supabase
    .from('transactions')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'withdrawal')
    .eq('status', 'pending');

  // Calculate success rate (funded campaigns / total completed campaigns)
  const { count: successfulCampaigns, error: successError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'funded');

  const { count: completedCampaigns, error: completedError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .or('status.eq.funded,status.eq.failed');

  if (
    usersError || campaignsError || fundsError || activeUsersError || 
    activeCampaignsError || pendingCampaignsError || transactionsError || 
    withdrawalsError || successError || completedError
  ) {
    console.error('Error fetching admin stats');
    return null;
  }

  // Calculate total funds raised
  const totalFundsRaised = fundsData?.reduce((sum, item) => sum + item.amount, 0) || 0;

  // Calculate success rate
  const successRate = completedCampaigns > 0 
    ? (successfulCampaigns / completedCampaigns) * 100 
    : 0;

  return {
    totalUsers: totalUsers || 0,
    totalCampaigns: totalCampaigns || 0,
    totalFundsRaised,
    activeUsers: activeUsers || 0,
    activeCampaigns: activeCampaigns || 0,
    successRate,
    pendingCampaigns: pendingCampaigns || 0,
    pendingWithdrawals: pendingWithdrawals || 0,
    totalTransactions: totalTransactions || 0
  };
};

// Approve a campaign
export const approveCampaign = async (campaignId: string): Promise<{ success: boolean; error?: string }> => {
  // Check if the user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Not authorized' };
  }

  const { error } = await supabase
    .from('campaigns')
    .update({ status: 'active' })
    .eq('id', campaignId);

  if (error) {
    console.error('Error approving campaign:', error);
    return { success: false, error: error.message };
  }

  // Add notification for the campaign creator
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('creator_id, title')
    .eq('id', campaignId)
    .single();

  if (campaign) {
    await supabase
      .from('notifications')
      .insert({
        user_id: campaign.creator_id,
        title: 'Campaign Approved',
        message: `Your campaign "${campaign.title}" has been approved and is now live.`,
        is_read: false,
        type: 'system',
        related_id: campaignId,
        created_at: new Date().toISOString()
      });
  }

  return { success: true };
};

// Reject a campaign
export const rejectCampaign = async (
  campaignId: string, 
  reason: string
): Promise<{ success: boolean; error?: string }> => {
  // Check if the user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Not authorized' };
  }

  const { error } = await supabase
    .from('campaigns')
    .update({ status: 'draft' })
    .eq('id', campaignId);

  if (error) {
    console.error('Error rejecting campaign:', error);
    return { success: false, error: error.message };
  }

  // Add notification for the campaign creator
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('creator_id, title')
    .eq('id', campaignId)
    .single();

  if (campaign) {
    await supabase
      .from('notifications')
      .insert({
        user_id: campaign.creator_id,
        title: 'Campaign Requires Changes',
        message: `Your campaign "${campaign.title}" has been returned to draft status. Reason: ${reason}`,
        is_read: false,
        type: 'system',
        related_id: campaignId,
        created_at: new Date().toISOString()
      });
  }

  return { success: true };
};

// Get all users (admin only)
export const getAllUsers = async () => {
  // Check if the user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Not authorized', data: [] };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message, data: [] };
  }

  return { 
    success: true, 
    data: data.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      profileImage: user.profile_image,
      isAdmin: user.is_admin,
      wallet: {
        balance: user.wallet_balance
      },
      createdAt: user.created_at
    }))
  };
};

// Update a user's admin status (admin only)
export const updateUserAdminStatus = async (
  userId: string, 
  isAdmin: boolean
): Promise<{ success: boolean; error?: string }> => {
  // Check if the current user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Not authorized' };
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

// Get pending campaigns for approval
export const getPendingCampaigns = async () => {
  // Check if the user is an admin first
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    return { success: false, error: 'Not authorized', data: [] };
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
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending campaigns:', error);
    return { success: false, error: error.message, data: [] };
  }

  return { 
    success: true, 
    data: data.map((campaign: any) => ({
      id: campaign.id,
      title: campaign.title,
      shortDescription: campaign.short_description,
      description: campaign.description,
      coverImage: campaign.cover_image,
      category: campaign.category,
      goalAmount: campaign.goal_amount,
      currentAmount: campaign.current_amount,
      startDate: campaign.start_date,
      endDate: campaign.end_date,
      creatorId: campaign.creator_id,
      creator: campaign.profiles ? {
        id: campaign.profiles.id,
        name: campaign.profiles.name,
        email: campaign.profiles.email,
        isAdmin: false,
        wallet: { balance: 0 },
        createdAt: ''
      } : undefined,
      status: campaign.status,
      backers: campaign.backers,
      createdAt: campaign.created_at
    }))
  };
};
