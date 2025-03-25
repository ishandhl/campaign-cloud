
import React, { useState, useEffect } from "react";
import { BarChart3, LineChart, PieChart, Calendar, Download, RefreshCw, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as ReLineChart, Line } from 'recharts';
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import { mockCampaigns, mockCategories, mockUserDashboardStats } from "@/lib/mockData";

// Mock data for charts
const campaignsByCategoryData = [
  { name: "Technology", value: 45 },
  { name: "Art & Craft", value: 30 },
  { name: "Film", value: 25 },
  { name: "Music", value: 20 },
  { name: "Games", value: 15 },
  { name: "Education", value: 12 },
];

const fundingOverTimeData = [
  { month: "Jan", funds: 32000 },
  { month: "Feb", funds: 45000 },
  { month: "Mar", funds: 38000 },
  { month: "Apr", funds: 52000 },
  { month: "May", funds: 61000 },
  { month: "Jun", funds: 72000 },
  { month: "Jul", funds: 80000 },
  { month: "Aug", funds: 85000 },
  { month: "Sep", funds: 91000 },
  { month: "Oct", funds: 102000 },
  { month: "Nov", funds: 110000 },
  { month: "Dec", funds: 125000 },
];

const successRateByGoalData = [
  { goal: "< $1K", success: 80, failed: 20 },
  { goal: "$1K-$5K", success: 70, failed: 30 },
  { goal: "$5K-$10K", success: 60, failed: 40 },
  { goal: "$10K-$25K", success: 50, failed: 50 },
  { goal: "$25K-$50K", success: 40, failed: 60 },
  { goal: "$50K+", success: 30, failed: 70 },
];

const userActivityData = [
  { month: "Jan", newUsers: 120, activeUsers: 450 },
  { month: "Feb", newUsers: 150, activeUsers: 500 },
  { month: "Mar", newUsers: 180, activeUsers: 550 },
  { month: "Apr", newUsers: 220, activeUsers: 600 },
  { month: "May", newUsers: 250, activeUsers: 650 },
  { month: "Jun", newUsers: 280, activeUsers: 700 },
  { month: "Jul", newUsers: 310, activeUsers: 750 },
  { month: "Aug", newUsers: 340, activeUsers: 800 },
  { month: "Sep", newUsers: 370, activeUsers: 850 },
  { month: "Oct", newUsers: 400, activeUsers: 900 },
  { month: "Nov", newUsers: 430, activeUsers: 950 },
  { month: "Dec", newUsers: 460, activeUsers: 1000 },
];

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("past12Months");
  const [reportType, setReportType] = useState("funding");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert("Report generated and ready for download!");
    }, 2000);
  };

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
      <PageHeader
        title="Reports & Analytics"
        description="Analyze platform performance and generate reports"
        icon={BarChart3}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Time Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past30Days">Past 30 Days</SelectItem>
                <SelectItem value="past3Months">Past 3 Months</SelectItem>
                <SelectItem value="past6Months">Past 6 Months</SelectItem>
                <SelectItem value="past12Months">Past 12 Months</SelectItem>
                <SelectItem value="yearToDate">Year to Date</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funding">Funding Analysis</SelectItem>
                <SelectItem value="campaigns">Campaign Analysis</SelectItem>
                <SelectItem value="users">User Analysis</SelectItem>
                <SelectItem value="transactions">Transaction Analysis</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Button 
                onClick={handleGenerateReport} 
                className="flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="border rounded-lg bg-card">
          <TabsList className="w-full border-b p-0">
            <TabsTrigger value="overview" className="flex-1 rounded-none border-r py-4">
              <LineChart className="h-5 w-5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex-1 rounded-none border-r py-4">
              <BarChart className="h-5 w-5 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 rounded-none border-r py-4">
              <PieChart className="h-5 w-5 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex-1 rounded-none py-4">
              <BarChart3 className="h-5 w-5 mr-2" />
              Financials
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Over Time</CardTitle>
                <CardDescription>Total funds raised per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      data={fundingOverTimeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Funds Raised']}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="funds"
                        stroke="#0088FE"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaigns by Category</CardTitle>
                <CardDescription>Distribution of campaigns across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={campaignsByCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {campaignsByCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Campaigns']} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Success Rate by Funding Goal</CardTitle>
                <CardDescription>Percentage of successful campaigns by goal amount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={successRateByGoalData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="goal" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
                      <Legend />
                      <Bar dataKey="success" name="Success Rate" stackId="a" fill="#4CAF50" />
                      <Bar dataKey="failed" name="Failure Rate" stackId="a" fill="#F44336" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Activity Trends</CardTitle>
                <CardDescription>New and active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      data={userActivityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="newUsers"
                        name="New Users"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Campaign analytics will be shown here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">User analytics will be shown here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="financials" className="space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Financial analytics will be shown here</p>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ReportsAnalytics;
