
import { 
  User, 
  Campaign, 
  Contribution, 
  Transaction, 
  Notification,
  CampaignUpdate,
  DashboardStats,
  AdminDashboardStats,
  UserDashboardStats
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user1",
    email: "user@example.com",
    name: "John Doe",
    profileImage: "/assets/users/user1.jpg",
    isAdmin: false,
    wallet: {
      balance: 1500
    },
    createdAt: "2023-05-15T10:30:00Z"
  },
  {
    id: "user2",
    email: "jane@example.com",
    name: "Jane Smith",
    profileImage: "/assets/users/user2.jpg",
    isAdmin: false,
    wallet: {
      balance: 2500
    },
    createdAt: "2023-06-20T14:45:00Z"
  },
  {
    id: "admin1",
    email: "admin@example.com",
    name: "Admin User",
    profileImage: "/assets/users/admin.jpg",
    isAdmin: true,
    wallet: {
      balance: 0
    },
    createdAt: "2023-01-10T09:00:00Z"
  }
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "campaign1",
    title: "Eco-friendly Water Bottle",
    description: "A revolutionary water bottle made from sustainable materials that helps reduce plastic waste in our oceans. Our design uses biodegradable materials that completely break down within 5 years if they end up in landfills, compared to the 450+ years for traditional plastic bottles. Each bottle features a unique filtration system that removes impurities from tap water, making it perfect for everyday use or outdoor adventures. With your support, we can bring this product to market and make a significant impact on reducing single-use plastic consumption worldwide.",
    shortDescription: "Sustainable water bottle to reduce plastic waste",
    coverImage: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww",
    category: "Eco-friendly",
    goalAmount: 25000,
    currentAmount: 18750,
    startDate: "2023-07-01T00:00:00Z",
    endDate: "2023-09-01T00:00:00Z",
    creatorId: "user1",
    status: "active",
    backers: 125,
    createdAt: "2023-06-15T08:30:00Z"
  },
  {
    id: "campaign2",
    title: "Educational STEM Toy for Kids",
    description: "An innovative STEM toy designed to teach children programming concepts through hands-on play. Our toy combines physical building blocks with a simple programming interface that children as young as 5 can understand. As they build and program their creations, they develop critical thinking skills, spatial reasoning, and the foundations of computational thinking. Each set comes with curriculum-aligned activity cards that guide children through progressively complex challenges, ensuring they continue learning as they play. Support our campaign to make coding accessible to young minds!",
    shortDescription: "Interactive toy that teaches kids programming basics",
    coverImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Education",
    goalAmount: 50000,
    currentAmount: 35000,
    startDate: "2023-08-01T00:00:00Z",
    endDate: "2023-10-01T00:00:00Z",
    creatorId: "user2",
    status: "active",
    backers: 210,
    createdAt: "2023-07-20T13:45:00Z"
  },
  {
    id: "campaign3",
    title: "Smart Home Energy Monitor",
    description: "A revolutionary device that tracks and optimizes your home's energy usage in real-time. Our smart energy monitor connects to your electrical panel and provides detailed insights about which appliances are consuming the most power, when energy costs are at their peak, and how you can reduce your carbon footprint. The companion app gives personalized recommendations based on your usage patterns and can even automate certain functions to maximize efficiency. By backing this project, you're not only getting a tool to reduce your utility bills but also making a positive impact on the environment.",
    shortDescription: "Device that helps reduce home energy consumption",
    coverImage: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Technology",
    goalAmount: 100000,
    currentAmount: 15000,
    startDate: "2023-06-15T00:00:00Z",
    endDate: "2023-12-15T00:00:00Z",
    creatorId: "user1",
    status: "active",
    backers: 98,
    createdAt: "2023-06-01T09:15:00Z"
  },
  {
    id: "campaign4",
    title: "Handcrafted Leather Journals",
    description: "Artisanal leather journals made using traditional bookbinding techniques. Each journal features premium full-grain leather covers that develop a beautiful patina over time, acid-free paper that's fountain pen friendly, and a lay-flat binding that makes writing comfortable from the first page to the last. Our small team of craftspeople hand-makes each journal with meticulous attention to detail, creating heirloom-quality items that will last for generations. With your support, we can expand our workshop, train new artisans, and bring these timeless journals to a wider audience while preserving traditional craftsmanship.",
    shortDescription: "Traditional handmade journals with premium materials",
    coverImage: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Art & Craft",
    goalAmount: 15000,
    currentAmount: 12000,
    startDate: "2023-07-15T00:00:00Z",
    endDate: "2023-09-15T00:00:00Z",
    creatorId: "user2",
    status: "active",
    backers: 180,
    createdAt: "2023-07-01T11:30:00Z"
  },
  {
    id: "campaign5",
    title: "Independent Documentary: Ocean Plastic Crisis",
    description: "A feature-length documentary exploring the devastating impact of plastic pollution on marine ecosystems. Our team has spent two years filming across five continents, documenting both the scale of the problem and the innovative solutions being developed by scientists, activists, and communities. The film follows marine biologists studying affected wildlife, engineers designing new biodegradable materials, and grassroots movements fighting for policy change. With your support, we can complete post-production, secure music rights, and distribute this important story to festivals and streaming platforms worldwide.",
    shortDescription: "Documentary about plastic pollution solutions",
    coverImage: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Film",
    goalAmount: 75000,
    currentAmount: 25000,
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2023-11-01T00:00:00Z",
    creatorId: "user1",
    status: "active",
    backers: 310,
    createdAt: "2023-04-15T10:00:00Z"
  }
];

// Mock Campaign Updates
export const mockCampaignUpdates: CampaignUpdate[] = [
  {
    id: "update1",
    campaignId: "campaign1",
    title: "Production Update: First Prototype Complete!",
    content: "We're excited to share that our first working prototype has been completed. The design team has finalized the ergonomic shape, and our engineers have perfected the filtration system. Initial testing shows excellent results for removing contaminants while maintaining good water flow. Next week, we'll begin durability testing. Thank you for your continued support!",
    createdAt: "2023-07-15T14:30:00Z"
  },
  {
    id: "update2",
    campaignId: "campaign1",
    title: "New Color Options Available",
    content: "Based on your feedback, we've added three new color options to our lineup: Ocean Blue, Forest Green, and Sunset Orange. All backers will be able to select their preferred color before shipping. We've also secured a partnership with a sustainable packaging supplier to ensure our entire product experience is eco-friendly.",
    createdAt: "2023-08-01T09:15:00Z"
  },
  {
    id: "update3",
    campaignId: "campaign2",
    title: "Curriculum Development Milestone",
    content: "Our education team has finished developing the first 20 learning modules that will accompany the STEM toy. These activities have been tested with over 50 children in various age groups, and the feedback has been overwhelmingly positive. We're particularly excited about how quickly children are grasping basic programming concepts through our block-based interface.",
    createdAt: "2023-08-10T16:45:00Z"
  }
];

// Mock Contributions
export const mockContributions: Contribution[] = [
  {
    id: "contribution1",
    userId: "user2",
    campaignId: "campaign1",
    amount: 150,
    status: "completed",
    paymentId: "pmt_123456",
    createdAt: "2023-07-05T10:15:00Z"
  },
  {
    id: "contribution2",
    userId: "user1",
    campaignId: "campaign2",
    amount: 200,
    status: "completed",
    paymentId: "pmt_234567",
    createdAt: "2023-08-10T14:30:00Z"
  },
  {
    id: "contribution3",
    userId: "user2",
    campaignId: "campaign3",
    amount: 500,
    status: "completed",
    paymentId: "pmt_345678",
    createdAt: "2023-06-20T09:45:00Z"
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "transaction1",
    userId: "user1",
    type: "deposit",
    amount: 1000,
    status: "completed",
    paymentId: "pmt_987654",
    createdAt: "2023-05-20T11:30:00Z"
  },
  {
    id: "transaction2",
    userId: "user1",
    type: "contribution",
    amount: 200,
    status: "completed",
    paymentId: "pmt_234567",
    campaignId: "campaign2",
    createdAt: "2023-08-10T14:30:00Z"
  },
  {
    id: "transaction3",
    userId: "user2",
    type: "withdrawal",
    amount: 500,
    status: "completed",
    createdAt: "2023-07-25T16:15:00Z"
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "notification1",
    userId: "user1",
    title: "Campaign Funded!",
    message: "Your campaign 'Eco-friendly Water Bottle' has reached its funding goal. Congratulations!",
    isRead: false,
    type: "campaign_update",
    relatedId: "campaign1",
    createdAt: "2023-08-15T09:30:00Z"
  },
  {
    id: "notification2",
    userId: "user2",
    title: "New Contribution",
    message: "Someone just backed your campaign 'Educational STEM Toy for Kids' with $150.",
    isRead: true,
    type: "contribution",
    relatedId: "contribution2",
    createdAt: "2023-08-11T10:45:00Z"
  },
  {
    id: "notification3",
    userId: "user1",
    title: "New Campaign Update",
    message: "A campaign you backed 'Educational STEM Toy for Kids' has posted a new update.",
    isRead: false,
    type: "campaign_update",
    relatedId: "campaign2",
    createdAt: "2023-08-10T17:00:00Z"
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 2500,
  totalCampaigns: 560,
  totalFundsRaised: 3250000,
  activeUsers: 1800,
  activeCampaigns: 320,
  successRate: 68
};

// Mock Admin Dashboard Stats
export const mockAdminDashboardStats: AdminDashboardStats = {
  ...mockDashboardStats,
  pendingCampaigns: 45,
  pendingWithdrawals: 12,
  totalTransactions: 8750
};

// Mock User Dashboard Stats
export const mockUserDashboardStats: UserDashboardStats = {
  createdCampaigns: 2,
  backedCampaigns: 8,
  totalContributed: 1250,
  walletBalance: 1500
};

// Mock Categories
export const mockCategories = [
  "Technology",
  "Art & Craft",
  "Film",
  "Music",
  "Food",
  "Games",
  "Design",
  "Education",
  "Eco-friendly",
  "Fashion",
  "Health",
  "Community"
];

// Helper functions to get data with relationships
export const getCampaignWithCreator = (campaignId: string) => {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign) return null;
  
  const creator = mockUsers.find(u => u.id === campaign.creatorId);
  return {
    ...campaign,
    creator
  };
};

export const getCampaignWithUpdates = (campaignId: string) => {
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign) return null;
  
  const updates = mockCampaignUpdates.filter(u => u.campaignId === campaignId);
  return {
    ...campaign,
    updates
  };
};

export const getContributionsForUser = (userId: string) => {
  return mockContributions.filter(c => c.userId === userId).map(contribution => {
    const campaign = mockCampaigns.find(c => c.id === contribution.campaignId);
    return {
      ...contribution,
      campaign
    };
  });
};

export const getContributionsForCampaign = (campaignId: string) => {
  return mockContributions.filter(c => c.campaignId === campaignId).map(contribution => {
    const user = mockUsers.find(u => u.id === contribution.userId);
    return {
      ...contribution,
      user
    };
  });
};

export const getNotificationsForUser = (userId: string) => {
  return mockNotifications.filter(n => n.userId === userId);
};
