import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types";
import { mockCampaigns } from "@/lib/mockData";

const CampaignApprovals = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<{
    pending: Campaign[];
    approved: Campaign[];
    rejected: Campaign[];
  }>({
    pending: [],
    approved: [],
    rejected: []
  });
  
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "request_changes">("approve");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get all campaigns from mock data
      setCampaigns(mockCampaigns);
      
      setLoading(false);
    };
    
    loadCampaigns();
    
    // Check if campaign ID is in URL query params
    const params = new URLSearchParams(location.search);
    const campaignId = params.get("id");
    
    if (campaignId) {
      const campaign = mockCampaigns.find(c => c.id === campaignId);
      if (campaign) {
        setSelectedCampaign(campaign);
        setIsReviewOpen(true);
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (campaigns.length > 0) {
      // Apply filters first
      let filtered = campaigns;
      
      // Apply search filter if present
      if (searchTerm) {
        filtered = filtered.filter(
          campaign => 
            campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply category filter if selected
      if (selectedCategory) {
        filtered = filtered.filter(campaign => campaign.category === selectedCategory);
      }
      
      // Categorize campaigns by status
      const pending = filtered.filter(campaign => campaign.status === "pending");
      const approved = filtered.filter(campaign => campaign.status === "active");
      const rejected = filtered.filter(campaign => campaign.status === "failed"); // or another valid status value
      
      setFilteredCampaigns({ pending, approved, rejected });
    }
  }, [campaigns, searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const openReviewDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setReviewNotes("");
    setReviewAction("approve");
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async () => {
    if (!selectedCampaign) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update campaign status in state
      let updatedStatus: string;
      let toastMessage: string;
      
      switch (reviewAction) {
        case "approve":
          updatedStatus = "active";
          toastMessage = "Campaign has been approved";
          break;
        case "reject":
          updatedStatus = "rejected";
          toastMessage = "Campaign has been rejected";
          break;
        case "request_changes":
          updatedStatus = "pending";
          toastMessage = "Changes have been requested from the creator";
          break;
        default:
          updatedStatus = "pending";
          toastMessage = "Review submitted";
      }
      
      const updatedCampaigns = campaigns.map(c => 
        c.id === selectedCampaign.id 
          ? { ...c, status: updatedStatus as any }
          : c
      );
      
      setCampaigns(updatedCampaigns);
      
      // Close dialog
      setIsReviewOpen(false);
      
      // Show success toast
      toast({
        title: "Review Submitted",
        description: toastMessage,
      });
    } catch (error) {
      console.error("Review error:", error);
      toast({
        title: "Review Failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
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

  const categories = Array.from(new Set(campaigns.map(c => c.category)));

  return (
    <AdminLayout>
      <PageHeader
        title="Campaign Approvals"
        description="Review and manage campaign submissions"
        icon={FileText}
      />
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {selectedCategory || "Filter by Category"}
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button type="submit" className="w-full">Search</Button>
          </div>
        </form>
      </div>
      
      <Tabs defaultValue="pending" className="border rounded-lg shadow-sm bg-card">
        <TabsList className="w-full border-b">
          <TabsTrigger value="pending" className="flex-1">
            Pending <span className="ml-1 text-xs">({filteredCampaigns.pending.length})</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">
            Approved <span className="ml-1 text-xs">({filteredCampaigns.approved.length})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">
            Rejected <span className="ml-1 text-xs">({filteredCampaigns.rejected.length})</span>
          </TabsTrigger>
        </TabsList>
        
        {["pending", "approved", "rejected"].map((tab) => (
          <TabsContent key={tab} value={tab} className="p-6">
            {filteredCampaigns[tab as keyof typeof filteredCampaigns].length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {tab} campaigns found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCampaigns[tab as keyof typeof filteredCampaigns].map((campaign) => (
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
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="mb-2 md:mb-0">
                              <div className="flex items-center">
                                <h3 className="font-semibold">{campaign.title}</h3>
                                <Badge 
                                  variant="outline" className="text-yellow-500"
                                  className="ml-2"
                                >
                                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {campaign.shortDescription}
                              </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end text-sm">
                              <div>Submitted: {new Date(campaign.createdAt).toLocaleDateString()}</div>
                              <div>Goal: ${campaign.goalAmount.toLocaleString()}</div>
                              <div>Category: {campaign.category}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                            <div className="text-sm text-muted-foreground">
                              Creator ID: {campaign.creatorId}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/campaigns/${campaign.id}`} target="_blank">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Link>
                              </Button>
                              
                              {tab === "pending" && (
                                <Button 
                                  size="sm"
                                  onClick={() => openReviewDialog(campaign)}
                                >
                                  Review
                                </Button>
                              )}
                              
                              {tab === "approved" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-amber-600"
                                  onClick={() => openReviewDialog(campaign)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-1" />
                                  Take Action
                                </Button>
                              )}
                              
                              {tab === "rejected" && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-blue-600"
                                  onClick={() => openReviewDialog(campaign)}
                                >
                                  Reconsider
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Campaign Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Campaign</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="py-4">
              <div className="grid grid-cols-[100px_1fr] gap-4 mb-4">
                <div className="h-20 rounded-md overflow-hidden">
                  <img 
                    src={selectedCampaign.coverImage} 
                    alt={selectedCampaign.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedCampaign.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Submitted by {selectedCampaign.creatorId} on {new Date(selectedCampaign.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm mt-1">
                    <span className="text-muted-foreground mr-1">Goal:</span> 
                    ${selectedCampaign.goalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <div className="mt-1 text-sm border rounded-md p-3 max-h-48 overflow-y-auto">
                    {selectedCampaign.description}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reviewAction">Action</Label>
                  <Select value={reviewAction} onValueChange={(value) => setReviewAction(value as any)}>
                    <SelectTrigger id="reviewAction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Approve Campaign
                        </div>
                      </SelectItem>
                      <SelectItem value="reject">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                          Reject Campaign
                        </div>
                      </SelectItem>
                      <SelectItem value="request_changes">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          Request Changes
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reviewNotes">Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    placeholder="Provide feedback to the campaign creator..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsReviewOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CampaignApprovals;
