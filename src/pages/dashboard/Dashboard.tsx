
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  FileText, 
  Heart, 
  BarChart4,
  Wallet,
  Clock,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import StatCard from "@/components/shared/StatCard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Campaign, UserDashboardStats } from "@/types";
import { mockCampaigns, mockUserDashboardStats } from "@/lib/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user dashboard stats
      setStats(mockUserDashboardStats);
      
      // Get user's campaigns
      if (user) {
        const userCampaigns = mockCampaigns.filter(
          campaign => campaign.creatorId === user.id
        );
        setMyCampaigns(userCampaigns);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/campaigns/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Campaigns"
            value={stats?.createdCampaigns || 0}
            icon={FileText}
            iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
          />
          <StatCard
            title="Backed Projects"
            value={stats?.backedCampaigns || 0}
            icon={Heart}
            iconClassName="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300"
          />
          <StatCard
            title="Total Contributed"
            value={`$${stats?.totalContributed.toLocaleString() || 0}`}
            icon={TrendingUp}
            iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          />
          <StatCard
            title="Wallet Balance"
            value={`$${stats?.walletBalance.toLocaleString() || 0}`}
            icon={Wallet}
            iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="campaigns" className="border rounded-lg bg-card shadow-sm">
          <TabsList className="w-full border-b">
            <TabsTrigger value="campaigns" className="flex-1">My Campaigns</TabsTrigger>
            <TabsTrigger value="contributions" className="flex-1">Recent Contributions</TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">Recent Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns" className="p-6">
            {myCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">You haven't created any campaigns yet</h3>
                <p className="text-muted-foreground mb-6">Start your first crowdfunding campaign today!</p>
                <Button asChild>
                  <Link to="/dashboard/campaigns/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {myCampaigns.slice(0, 3).map(campaign => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-36">
                          <img 
                            src={campaign.coverImage} 
                            alt={campaign.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">{campaign.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {campaign.shortDescription}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="text-sm font-medium">
                                ${campaign.currentAmount.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                of ${campaign.goalAmount.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full mt-2">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ 
                                width: `${Math.min(
                                  Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 
                                  100
                                )}%`
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{campaign.backers || 0} backers</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/dashboard/campaigns/edit/${campaign.id}`}>
                                Manage
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {myCampaigns.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="ghost" asChild>
                      <Link to="/dashboard/campaigns" className="flex items-center">
                        View All Campaigns
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="contributions" className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent contributions</p>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="p-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Funding Progress</h3>
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <BarChart4 className="h-12 w-12" />
                <span className="ml-2">No data available</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/dashboard/campaigns/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Campaign
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/dashboard/wallet">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Wallet
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/explore">
                    <Search className="h-4 w-4 mr-2" />
                    Find Projects to Back
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
