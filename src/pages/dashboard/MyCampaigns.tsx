import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Plus, Users, Clock, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types";
import { mockCampaigns } from "@/lib/mockData";

const MyCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<{
    active: Campaign[];
    pending: Campaign[];
    draft: Campaign[];
    ended: Campaign[];
  }>({
    active: [],
    pending: [],
    draft: [],
    ended: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all campaigns created by the user
      if (user) {
        const userCampaigns = mockCampaigns.filter(
          campaign => campaign.creatorId === user.id
        );
        setCampaigns(userCampaigns);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    if (campaigns.length > 0) {
      // Apply search filter if present
      const filtered = searchTerm 
        ? campaigns.filter(
            campaign => 
              campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : campaigns;
      
      // Categorize campaigns by status
      const active = filtered.filter(campaign => campaign.status === "active");
      const pending = filtered.filter(campaign => campaign.status === "pending");
      const draft = filtered.filter(campaign => campaign.status === "draft");
      const ended = filtered.filter(
        campaign => 
          campaign.status === "funded" || 
          campaign.status === "failed" ||
          new Date(campaign.endDate) < new Date()
      );
      
      setFilteredCampaigns({ active, pending, draft, ended });
    }
  }, [campaigns, searchTerm]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!campaignToDelete) return;
    
    // Check confirmation text
    if (deleteConfirmText !== campaignToDelete.title) {
      toast({
        title: "Confirmation Failed",
        description: "The campaign title you entered doesn't match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Remove campaign from state
      setCampaigns(campaigns.filter(c => c.id !== campaignToDelete.id));
      
      // Show success toast
      toast({
        title: "Campaign Deleted",
        description: "Your campaign has been deleted successfully.",
      });
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setCampaignToDelete(null);
      setDeleteConfirmText("");
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error deleting your campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
      <PageHeader
        title="My Campaigns"
        description="Manage your crowdfunding campaigns"
        icon={FileText}
        actionLabel="Create Campaign"
        actionHref="/dashboard/campaigns/create"
      />
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h3 className="text-xl font-medium mb-2">You haven't created any campaigns yet</h3>
          <p className="text-muted-foreground mb-6">Start your first crowdfunding campaign today!</p>
          <Button asChild>
            <Link to="/dashboard/campaigns/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="active" className="border rounded-lg shadow-sm bg-card">
          <TabsList className="w-full border-b">
            <TabsTrigger value="active" className="flex-1">
              Active <span className="ml-1 text-xs">({filteredCampaigns.active.length})</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex-1">
              Pending <span className="ml-1 text-xs">({filteredCampaigns.pending.length})</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex-1">
              Drafts <span className="ml-1 text-xs">({filteredCampaigns.draft.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ended" className="flex-1">
              Ended <span className="ml-1 text-xs">({filteredCampaigns.ended.length})</span>
            </TabsTrigger>
          </TabsList>
          
          {["active", "pending", "draft", "ended"].map((tab) => (
            <TabsContent key={tab} value={tab} className="p-6">
              {filteredCampaigns[tab as keyof typeof filteredCampaigns].length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No {tab} campaigns found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredCampaigns[tab as keyof typeof filteredCampaigns].map(campaign => (
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
                                    variant="default" className="bg-green-500"
                                    className="ml-2"
                                  >
                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {campaign.shortDescription}
                                </p>
                              </div>
                              <div className="flex flex-col items-start md:items-end">
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
                            
                            <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                              <div className="flex flex-wrap gap-4">
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
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/campaigns/${campaign.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/dashboard/campaigns/edit/${campaign.id}`}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Link>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive"
                                  onClick={() => handleDeleteClick(campaign)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
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
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Delete Campaign
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your campaign
              and remove all data associated with it.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4 text-sm">
              To confirm, type <span className="font-semibold">{campaignToDelete?.title}</span> below:
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete} 
              disabled={isDeleting || deleteConfirmText !== campaignToDelete?.title}
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyCampaigns;
