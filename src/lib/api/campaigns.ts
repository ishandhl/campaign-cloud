
import { supabase, getCurrentUserId } from '@/lib/supabase';
import { Campaign } from '@/types';

// Get all campaigns (with optional filters)
export const getCampaigns = async (
  filters: {
    category?: string;
    status?: string;
    searchQuery?: string;
    sortBy?: string;
  } = {}
): Promise<Campaign[]> => {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      profiles:creator_id (
        id,
        name,
        email,
        profile_image
      )
    `);

  // Apply filters
  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.searchQuery) {
    query = query.or(
      `title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    const [field, order] = filters.sortBy.split(':');
    query = query.order(field, { ascending: order === 'asc' });
  } else {
    // Default sort by created_at
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching campaigns:', error);
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
    creator: item.profiles ? {
      id: item.profiles.id,
      name: item.profiles.name,
      email: item.profiles.email,
      profileImage: item.profiles.profile_image,
      isAdmin: false, // This would come from the profiles table
      wallet: {
        balance: 0 // This would also come from the profiles table
      },
      createdAt: '' // This would come from the profiles table
    } : undefined,
    status: item.status,
    backers: item.backers,
    createdAt: item.created_at
  }));
};

// Get a single campaign by ID
export const getCampaignById = async (id: string): Promise<Campaign | null> => {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      *,
      profiles:creator_id (
        id,
        name,
        email,
        profile_image,
        is_admin,
        wallet_balance,
        created_at
      ),
      campaign_updates (
        id,
        title,
        content,
        created_at
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    if (error.code === 'PGRST116') {
      return null; // No campaign found
    }
    throw error;
  }

  // Transform the data to match our Campaign type
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    shortDescription: data.short_description,
    coverImage: data.cover_image,
    category: data.category,
    goalAmount: data.goal_amount,
    currentAmount: data.current_amount,
    startDate: data.start_date,
    endDate: data.end_date,
    creatorId: data.creator_id,
    creator: data.profiles ? {
      id: data.profiles.id,
      name: data.profiles.name,
      email: data.profiles.email,
      profileImage: data.profiles.profile_image,
      isAdmin: data.profiles.is_admin,
      wallet: {
        balance: data.profiles.wallet_balance
      },
      createdAt: data.profiles.created_at
    } : undefined,
    status: data.status,
    updates: data.campaign_updates ? data.campaign_updates.map((update: any) => ({
      id: update.id,
      campaignId: id,
      title: update.title,
      content: update.content,
      createdAt: update.created_at
    })) : [],
    backers: data.backers,
    createdAt: data.created_at
  };
};

// Create a new campaign
export const createCampaign = async (campaignData: Omit<Campaign, 'id' | 'creatorId' | 'currentAmount' | 'status' | 'backers' | 'createdAt'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  // Prepare campaign data for insertion
  const newCampaign = {
    title: campaignData.title,
    description: campaignData.description,
    short_description: campaignData.shortDescription,
    cover_image: campaignData.coverImage,
    category: campaignData.category,
    goal_amount: campaignData.goalAmount,
    current_amount: 0,
    start_date: campaignData.startDate,
    end_date: campaignData.endDate,
    creator_id: userId,
    status: 'pending' as const, // New campaigns are pending approval
    backers: 0,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(newCampaign)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
};

// Update an existing campaign
export const updateCampaign = async (id: string, campaignData: Partial<Campaign>): Promise<{ success: boolean; error?: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  // First check if this user owns the campaign
  const { data: campaign, error: fetchError } = await supabase
    .from('campaigns')
    .select('creator_id')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching campaign for update:', fetchError);
    return { success: false, error: fetchError.message };
  }

  if (campaign.creator_id !== userId) {
    return { success: false, error: 'Not authorized to update this campaign' };
  }

  // Prepare campaign data for update
  const updateData: any = {};

  if (campaignData.title) updateData.title = campaignData.title;
  if (campaignData.description) updateData.description = campaignData.description;
  if (campaignData.shortDescription) updateData.short_description = campaignData.shortDescription;
  if (campaignData.coverImage) updateData.cover_image = campaignData.coverImage;
  if (campaignData.category) updateData.category = campaignData.category;
  if (campaignData.goalAmount) updateData.goal_amount = campaignData.goalAmount;
  if (campaignData.startDate) updateData.start_date = campaignData.startDate;
  if (campaignData.endDate) updateData.end_date = campaignData.endDate;
  
  // Prevent updating sensitive fields
  // (currentAmount, status, backers should be updated through specific operations)

  const { error: updateError } = await supabase
    .from('campaigns')
    .update(updateData)
    .eq('id', id);

  if (updateError) {
    console.error('Error updating campaign:', updateError);
    return { success: false, error: updateError.message };
  }

  return { success: true };
};

// Get campaigns created by the current user
export const getUserCampaigns = async (): Promise<Campaign[]> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user campaigns:', error);
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
    createdAt: item.created_at
  }));
};

// Delete a campaign
export const deleteCampaign = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  // First check if this user owns the campaign
  const { data: campaign, error: fetchError } = await supabase
    .from('campaigns')
    .select('creator_id, current_amount')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching campaign for deletion:', fetchError);
    return { success: false, error: fetchError.message };
  }

  if (campaign.creator_id !== userId) {
    return { success: false, error: 'Not authorized to delete this campaign' };
  }

  // Can't delete a campaign with contributions
  if (campaign.current_amount > 0) {
    return { 
      success: false, 
      error: 'Cannot delete a campaign that has received contributions' 
    };
  }

  const { error: deleteError } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting campaign:', deleteError);
    return { success: false, error: deleteError.message };
  }

  return { success: true };
};
