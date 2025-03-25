
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { User, Notification, UserDashboardStats } from '@/types';

// Get current user profile
export const getCurrentUserProfile = async (): Promise<User | null> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Transform the data to match our User type
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    profileImage: data.profile_image,
    isAdmin: data.is_admin,
    wallet: {
      balance: data.wallet_balance
    },
    createdAt: data.created_at
  };
};

// Update user profile
export const updateUserProfile = async (
  profileData: { name?: string; profileImage?: string }
): Promise<{ success: boolean; error?: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  const updates: any = {};
  if (profileData.name) updates.name = profileData.name;
  if (profileData.profileImage) updates.profile_image = profileData.profileImage;

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Get user notifications
export const getUserNotifications = async (): Promise<Notification[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  // Transform the data to match our Notification type
  return data.map((item: any): Notification => ({
    id: item.id,
    userId: item.user_id,
    title: item.title,
    message: item.message,
    isRead: item.is_read,
    type: item.type,
    relatedId: item.related_id,
    createdAt: item.created_at
  }));
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return false;
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }

  return true;
};

// Get user dashboard stats
export const getUserDashboardStats = async (): Promise<UserDashboardStats> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return {
      createdCampaigns: 0,
      backedCampaigns: 0,
      totalContributed: 0,
      walletBalance: 0
    };
  }

  // This would typically be a single RPC call in a real backend
  // For now, we'll make separate calls and combine them

  // Get created campaigns count
  const { count: createdCampaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('id', { count: 'exact', head: true })
    .eq('creator_id', userId);

  // Get backed campaigns and total contributed
  const { data: contributions, error: contributionsError } = await supabase
    .from('contributions')
    .select('campaign_id, amount')
    .eq('user_id', userId)
    .eq('status', 'completed');

  // Get wallet balance
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userId)
    .single();

  if (campaignsError || contributionsError || profileError) {
    console.error('Error fetching dashboard stats');
    return {
      createdCampaigns: 0,
      backedCampaigns: 0,
      totalContributed: 0,
      walletBalance: 0
    };
  }

  // Calculate backed campaigns (unique campaign IDs)
  const uniqueCampaignIds = new Set();
  let totalContributed = 0;

  if (contributions) {
    contributions.forEach((contribution: any) => {
      uniqueCampaignIds.add(contribution.campaign_id);
      totalContributed += contribution.amount;
    });
  }

  return {
    createdCampaigns: createdCampaigns || 0,
    backedCampaigns: uniqueCampaignIds.size,
    totalContributed,
    walletBalance: profile ? profile.wallet_balance : 0
  };
};
