import React, { useState } from "react";
import { Settings, Save, Info, Lock, Languages, Paintbrush, Bell, CreditCard, Smartphone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/shared/PageHeader";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // General settings
  const [platformName, setPlatformName] = useState("FundBoost");
  const [supportEmail, setSupportEmail] = useState("support@fundboost.com");
  const [platformDescription, setPlatformDescription] = useState("A crowdfunding platform for creators and backers");
  const [language, setLanguage] = useState("en");
  const [timeZone, setTimeZone] = useState("UTC");
  
  // Campaign settings
  const [minFundingGoal, setMinFundingGoal] = useState("10");
  const [maxFundingGoal, setMaxFundingGoal] = useState("1000000");
  const [minCampaignDuration, setMinCampaignDuration] = useState("7");
  const [maxCampaignDuration, setMaxCampaignDuration] = useState("90");
  const [platformFeePercentage, setPlatformFeePercentage] = useState("5");
  const [requireApproval, setRequireApproval] = useState(true);
  
  // Payment settings
  const [khaltiPublicKey, setKhaltiPublicKey] = useState("test_public_key_43652716fd734ba3a7cc4db1ae5");
  const [khaltiSecretKey, setKhaltiSecretKey] = useState("••••••••••••••••••••••••••••••••");
  const [minWithdrawal, setMinWithdrawal] = useState("50");
  const [processingFee, setProcessingFee] = useState("2.5");
  
  // Notification settings
  const [sendEmailNotifications, setSendEmailNotifications] = useState(true);
  const [sendCampaignUpdates, setSendCampaignUpdates] = useState(true);
  const [sendContributionNotifications, setSendContributionNotifications] = useState(true);
  const [sendAdminAlerts, setSendAdminAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="System Settings"
        description="Configure platform settings and preferences"
        icon={Settings}
      />
      
      <form onSubmit={handleSaveSettings}>
        <Tabs defaultValue="general" className="space-y-6">
          <Card>
            <CardHeader className="border-b p-0">
              <TabsList className="w-full justify-start rounded-none border-b-0">
                <TabsTrigger value="general" className="rounded-none border-r data-[state=active]:bg-background">
                  <Info className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="campaigns" className="rounded-none border-r data-[state=active]:bg-background">
                  <FileText className="h-4 w-4 mr-2" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="payment" className="rounded-none border-r data-[state=active]:bg-background">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-none border-r data-[state=active]:bg-background">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="appearance" className="rounded-none border-r data-[state=active]:bg-background">
                  <Paintbrush className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-none data-[state=active]:bg-background">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <TabsContent value="general" className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={platformDescription}
                    onChange={(e) => setPlatformDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeZone">Default Time Zone</Label>
                    <Select value={timeZone} onValueChange={setTimeZone}>
                      <SelectTrigger id="timeZone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Kathmandu">Kathmandu (NPT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns" className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minFundingGoal">Minimum Funding Goal ($)</Label>
                    <Input
                      id="minFundingGoal"
                      type="number"
                      min="1"
                      value={minFundingGoal}
                      onChange={(e) => setMinFundingGoal(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxFundingGoal">Maximum Funding Goal ($)</Label>
                    <Input
                      id="maxFundingGoal"
                      type="number"
                      min="1000"
                      value={maxFundingGoal}
                      onChange={(e) => setMaxFundingGoal(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minCampaignDuration">Minimum Campaign Duration (days)</Label>
                    <Input
                      id="minCampaignDuration"
                      type="number"
                      min="1"
                      value={minCampaignDuration}
                      onChange={(e) => setMinCampaignDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxCampaignDuration">Maximum Campaign Duration (days)</Label>
                    <Input
                      id="maxCampaignDuration"
                      type="number"
                      min="7"
                      value={maxCampaignDuration}
                      onChange={(e) => setMaxCampaignDuration(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platformFeePercentage">Platform Fee Percentage (%)</Label>
                  <Input
                    id="platformFeePercentage"
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    value={platformFeePercentage}
                    onChange={(e) => setPlatformFeePercentage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage fee charged on successful campaigns
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requireApproval"
                    checked={requireApproval}
                    onCheckedChange={setRequireApproval}
                  />
                  <Label htmlFor="requireApproval">Require admin approval for new campaigns</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Khalti Payment Gateway</CardTitle>
                    <CardDescription>Configure Khalti integration settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="khaltiPublicKey">Public Key</Label>
                      <Input
                        id="khaltiPublicKey"
                        value={khaltiPublicKey}
                        onChange={(e) => setKhaltiPublicKey(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="khaltiSecretKey">Secret Key</Label>
                      <div className="flex">
                        <Input
                          id="khaltiSecretKey"
                          type="password"
                          value={khaltiSecretKey}
                          onChange={(e) => setKhaltiSecretKey(e.target.value)}
                          className="rounded-r-none"
                        />
                        <Button variant="outline" className="rounded-l-none">
                          Change
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Stored securely in the system. Last changed on September 15, 2023.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="testMode" defaultChecked />
                      <Label htmlFor="testMode">Use Test Mode</Label>
                    </div>
                  </CardContent>
                </Card>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount ($)</Label>
                    <Input
                      id="minWithdrawal"
                      type="number"
                      min="1"
                      value={minWithdrawal}
                      onChange={(e) => setMinWithdrawal(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Processing Fee (%)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={processingFee}
                      onChange={(e) => setProcessingFee(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="manualApproval" defaultChecked />
                  <Label htmlFor="manualApproval">Require manual approval for withdrawals</Label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Configure email notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendEmailNotifications">Enable Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send email notifications to users
                        </p>
                      </div>
                      <Switch
                        id="sendEmailNotifications"
                        checked={sendEmailNotifications}
                        onCheckedChange={setSendEmailNotifications}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendCampaignUpdates">Campaign Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when campaigns are updated
                        </p>
                      </div>
                      <Switch
                        id="sendCampaignUpdates"
                        checked={sendCampaignUpdates}
                        onCheckedChange={setSendCampaignUpdates}
                        disabled={!sendEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendContributionNotifications">Contribution Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications when users contribute to campaigns
                        </p>
                      </div>
                      <Switch
                        id="sendContributionNotifications"
                        checked={sendContributionNotifications}
                        onCheckedChange={setSendContributionNotifications}
                        disabled={!sendEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sendAdminAlerts">Admin Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to admins for important events
                        </p>
                      </div>
                      <Switch
                        id="sendAdminAlerts"
                        checked={sendAdminAlerts}
                        onCheckedChange={setSendAdminAlerts}
                        disabled={!sendEmailNotifications}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Customize email notification templates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Select defaultValue="welcome">
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome Email</SelectItem>
                          <SelectItem value="campaign_approved">Campaign Approved</SelectItem>
                          <SelectItem value="campaign_rejected">Campaign Rejected</SelectItem>
                          <SelectItem value="contribution_received">Contribution Received</SelectItem>
                          <SelectItem value="campaign_funded">Campaign Funded</SelectItem>
                          <SelectItem value="withdrawal_approved">Withdrawal Approved</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="mt-4">
                        <Button variant="outline">Edit Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="p-6">
              <div className="text-center py-12">
                <Paintbrush className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Appearance Settings</h3>
                <p className="text-muted-foreground mb-6">Customize the look and feel of your platform.</p>
                <p className="text-muted-foreground">Appearance settings will be available soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="p-6">
              <div className="text-center py-12">
                <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                <p className="text-muted-foreground mb-6">Configure security and privacy settings.</p>
                <p className="text-muted-foreground">Security settings will be available soon.</p>
              </div>
            </TabsContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </form>
    </AdminLayout>
  );
};

export default SystemSettings;
