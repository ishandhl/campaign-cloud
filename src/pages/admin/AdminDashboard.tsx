
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight, 
  Users, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  BarChart4,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpFromLine,
  FolderOpen
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/components/shared/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import { AdminDashboardStats, Campaign } from "@/types";
import { mockAdminDashboardStats, mockCampaigns } from "@/lib/mockData";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats(mockAdminDashboardStats);
      
      // Get pending campaigns
      const pending = mockCampaigns.filter(campaign => campaign.status === "pending");
      setPendingCampaigns(pending);
      
      // Create mock pending withdrawals (in a real app, these would come from the API)
      setPendingWithdrawals([
        { id: "w1", userId: "user1", amount: 500, requestedAt: "2023-08-15T10:30:00Z", userName: "John Doe" },
        { id: "w2", userId: "user2", amount: 750, requestedAt: "2023-08-16T14:45:00Z", userName: "Jane Smith" },
      ]);
      
      setLoading(false);
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the platform statistics and pending actions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers.toLocaleString() || "0"}
            icon={Users}
            iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
            change={12}
          />
          <StatCard
            title="Active Campaigns"
            value={stats?.activeCampaigns.toLocaleString() || "0"}
            icon={FileText}
            iconClassName="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
            change={8}
          />
          <StatCard
            title="Total Funds Raised"
            value={`$${stats?.totalFundsRaised.toLocaleString() || "0"}`}
            icon={TrendingUp}
            iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
            change={15}
          />
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingCampaigns.toString() || "0"}
            icon={Clock}
            iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Overview of key platform metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">{stats?.successRate || 0}%</span>
                </div>
                <Progress value={stats?.successRate || 0} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Percentage of campaigns that reach their funding goal
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Funding Rate</span>
                  <div className="text-2xl font-bold">81%</div>
                  <p className="text-xs text-muted-foreground">Average funding percentage across all campaigns</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">New Users (30d)</span>
                  <div className="text-2xl font-bold">+324</div>
                  <p className="text-xs text-muted-foreground">Increase in user registrations</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm font-medium">Top Categories</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between items-center border rounded-md p-2">
                    <span className="text-sm">Technology</span>
                    <Badge variant="secondary">32%</Badge>
                  </div>
                  <div className="flex justify-between items-center border rounded-md p-2">
                    <span className="text-sm">Art & Craft</span>
                    <Badge variant="secondary">24%</Badge>
                  </div>
                  <div className="flex justify-between items-center border rounded-md p-2">
                    <span className="text-sm">Film</span>
                    <Badge variant="secondary">18%</Badge>
                  </div>
                  <div className="flex justify-between items-center border rounded-md p-2">
                    <span className="text-sm">Education</span>
                    <Badge variant="secondary">14%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Approvals</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/campaigns">
                      View All
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pendingCampaigns.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">No pending campaign approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCampaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={campaign.coverImage} 
                              alt={campaign.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{campaign.title}</div>
                            <div className="text-sm text-muted-foreground">
                              By {campaign.creatorId} • ${campaign.goalAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link to={`/admin/campaigns?id=${campaign.id}`}>
                            Review
                          </Link>
                        </Button>
                      </div>
                    ))}
                    
                    {pendingCampaigns.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" asChild>
                          <Link to="/admin/campaigns" className="flex items-center">
                            View All Pending Campaigns
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Withdrawals</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/payments">
                      View All
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {pendingWithdrawals.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">No pending withdrawal requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingWithdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-md">
                            <ArrowUpFromLine className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">${withdrawal.amount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              By {withdrawal.userName} • {new Date(withdrawal.requestedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" className="text-green-600">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="campaigns">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="campaigns" className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-4">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Campaign Approved</div>
                          <div className="text-sm text-muted-foreground">
                            "Eco-friendly Water Bottle" has been approved and is now live.
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-4">
                      <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">New Campaign Submitted</div>
                          <div className="text-sm text-muted-foreground">
                            "Educational STEM Toy for Kids" has been submitted for review.
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">5 hours ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full mr-4">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Campaign Needs Attention</div>
                          <div className="text-sm text-muted-foreground">
                            "Smart Home Energy Monitor" has not been updated in 30 days.
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">1 day ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full mr-4">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">Campaign Rejected</div>
                          <div className="text-sm text-muted-foreground">
                            "Innovative Social App" has been rejected due to policy violations.
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="pt-4">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">User activity will be shown here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions" className="pt-4">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Transaction activity will be shown here</p>
                </div>
              </TabsContent>
              
              <TabsContent value="reports" className="pt-4">
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Report activity will be shown here</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
