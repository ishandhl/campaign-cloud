
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  isAdmin: boolean;
  wallet: {
    balance: number;
  };
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  creatorId: string;
  creator?: User;
  status: "draft" | "pending" | "active" | "funded" | "failed";
  updates?: CampaignUpdate[];
  backers?: number;
  createdAt: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentId: string;
  createdAt: string;
  user?: User;
  campaign?: Campaign;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "contribution" | "refund";
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentId?: string;
  campaignId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "campaign_update" | "contribution" | "system";
  relatedId?: string;
  createdAt: string;
}

export interface KhaltiConfig {
  publicKey: string;
  productIdentity: string;
  productName: string;
  productUrl: string;
  amount: number;
  returnUrl?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCampaigns: number;
  totalFundsRaised: number;
  activeUsers: number;
  activeCampaigns: number;
  successRate: number;
}

export interface AdminDashboardStats extends DashboardStats {
  pendingCampaigns: number;
  pendingWithdrawals: number;
  totalTransactions: number;
}

export interface UserDashboardStats {
  createdCampaigns: number;
  backedCampaigns: number;
  totalContributed: number;
  walletBalance: number;
}
