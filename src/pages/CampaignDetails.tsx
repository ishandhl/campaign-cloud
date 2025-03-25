
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { 
  Share, 
  Heart, 
  Users, 
  Clock, 
  Tag, 
  Calendar, 
  AlertTriangle,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { Campaign, CampaignUpdate } from "@/types";
import { getCampaignWithCreator, getCampaignWithUpdates, mockCampaigns } from "@/lib/mockData";
import CampaignList from "@/components/campaign/CampaignList";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [similarCampaigns, setSimilarCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState(25);
  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    const loadCampaign = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get campaign with creator and updates
      const campaignWithCreator = getCampaignWithCreator(id);
      const campaignWithUpdates = getCampaignWithUpdates(id);
      
      if (!campaignWithCreator) {
        // Campaign not found
        navigate("/not-found");
        return;
      }
      
      setCampaign({
        ...campaignWithCreator,
        updates: campaignWithUpdates?.updates || []
      });
      
      setUpdates(campaignWithUpdates?.updates || []);
      
      // Get similar campaigns (same category)
      const similar = mockCampaigns
        .filter(c => c.id !== id && c.category === campaignWithCreator.category)
        .slice(0, 3);
      
      setSimilarCampaigns(similar);
      setLoading(false);
    };
    
    loadCampaign();
  }, [id, navigate]);
  
  const percentFunded = campaign 
    ? Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100)
    : 0;
  
  const daysLeft = campaign 
    ? formatDistanceToNow(new Date(campaign.endDate), { addSuffix: true })
    : "";
  
  const handleContribute = async () => {
    if (!user) {
      // Redirect to login
      navigate(`/login?redirect=campaigns/${id}`);
      return;
    }
    
    setIsContributionOpen(true);
  };
  
  const handleSubmitContribution = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close dialog
      setIsContributionOpen(false);
      
      // Show success toast
      toast({
        title: "Contribution Successful!",
        description: `You've successfully backed this project with $${contributionAmount}.`,
      });
      
      // Update campaign data (in a real app, this would be done via API)
      if (campaign) {
        setCampaign({
          ...campaign,
          currentAmount: campaign.currentAmount + contributionAmount,
          backers: (campaign.backers || 0) + 1
        });
      }
    } catch (error) {
      console.error("Contribution error:", error);
      toast({
        title: "Contribution Failed",
        description: "There was an error processing your contribution. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Campaign link copied to clipboard."
    });
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  if (!campaign) {
    return (
      <MainLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/explore">Explore Other Projects</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/explore" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Explore
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Badge variant="outline" className="mb-2">
                {campaign.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{campaign.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{campaign.shortDescription}</p>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${campaign.title}`, '_blank')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`, '_blank')}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden mb-8 shadow-md">
              <img 
                src={campaign.coverImage} 
                alt={campaign.title} 
                className="w-full h-[300px] md:h-[400px] object-cover"
              />
            </div>
            
            <Tabs defaultValue="about" className="mb-8">
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                <TabsTrigger value="updates" className="flex-1">
                  Updates <span className="ml-1 text-xs">({updates.length})</span>
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line">{campaign.description}</p>
                </div>
              </TabsContent>
              
              <TabsContent value="updates" className="mt-4">
                {updates.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {updates.map((update) => (
                      <Card key={update.id}>
                        <CardHeader>
                          <CardTitle>{update.title}</CardTitle>
                          <CardDescription>
                            {new Date(update.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-line">{update.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Comments are coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-lg">${campaign.currentAmount.toLocaleString()}</span>
                      <span className="text-muted-foreground">of ${campaign.goalAmount.toLocaleString()} goal</span>
                    </div>
                    <Progress value={percentFunded} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="font-semibold text-lg">{percentFunded}%</div>
                      <div className="text-xs text-muted-foreground">Funded</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{campaign.backers || 0}</div>
                      <div className="text-xs text-muted-foreground">Backers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{daysLeft.replace("in ", "")}</div>
                      <div className="text-xs text-muted-foreground">
                        {daysLeft.includes("ago") ? "Ended" : "Left"}
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleContribute}
                    disabled={campaign.status !== "active"}
                  >
                    {campaign.status === "active" ? "Back This Project" : "Campaign Ended"}
                  </Button>
                  
                  <Dialog open={isContributionOpen} onOpenChange={setIsContributionOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Back this project</DialogTitle>
                        <DialogDescription>
                          Support {campaign.title} by making a contribution.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Contribution Amount ($)</Label>
                            <Input
                              id="amount"
                              type="number"
                              min="1"
                              value={contributionAmount}
                              onChange={(e) => setContributionAmount(Number(e.target.value))}
                            />
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {[10, 25, 50, 100].map((amount) => (
                              <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                onClick={() => setContributionAmount(amount)}
                                className={contributionAmount === amount ? "border-primary" : ""}
                              >
                                ${amount}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsContributionOpen(false)}
                          disabled={isProcessing}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitContribution} disabled={isProcessing}>
                          {isProcessing ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Processing...
                            </>
                          ) : (
                            `Contribute $${contributionAmount}`
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Campaign Timeline</div>
                      <div className="text-sm text-muted-foreground">
                        Started: {new Date(campaign.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ends: {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Category</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.category}
                      </div>
                    </div>
                  </div>
                  
                  {campaign.creator && (
                    <>
                      <Separator />
                      
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">Created by</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.creator.name}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Similar Projects */}
        {similarCampaigns.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Projects</h2>
            <CampaignList campaigns={similarCampaigns} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CampaignDetails;
