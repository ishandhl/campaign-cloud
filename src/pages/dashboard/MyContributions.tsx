
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, Search } from "lucide-react";
import { Contribution, Campaign } from "@/types";
import { mockContributions, mockCampaigns } from "@/lib/mockData";

interface ContributionWithCampaign extends Contribution {
  campaign: Campaign;
}

const MyContributions = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<ContributionWithCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContributions, setFilteredContributions] = useState<ContributionWithCampaign[]>([]);

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        // Get contributions made by the user
        const userContributions = mockContributions.filter(
          contribution => contribution.userId === user.id
        );
        
        // Add campaign details to each contribution
        const contributionsWithCampaigns = userContributions.map(contribution => {
          const campaign = mockCampaigns.find(c => c.id === contribution.campaignId);
          return {
            ...contribution,
            campaign: campaign as Campaign
          };
        });
        
        setContributions(contributionsWithCampaigns);
        setFilteredContributions(contributionsWithCampaigns);
      }
      
      setLoading(false);
    };
    
    loadContributions();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contributions.filter(
        contribution => 
          contribution.campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contribution.campaign.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContributions(filtered);
    } else {
      setFilteredContributions(contributions);
    }
  }, [searchTerm, contributions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
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
        title="My Contributions"
        description="View all the campaigns you've backed"
        icon={Heart}
      />
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search contributions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      {filteredContributions.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h3 className="text-xl font-medium mb-2">You haven't backed any campaigns yet</h3>
          <p className="text-muted-foreground mb-6">Discover and support campaigns that inspire you!</p>
          <Button asChild>
            <Link to="/explore">
              <Search className="h-4 w-4 mr-2" />
              Explore Projects
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredContributions.map(contribution => (
            <Card key={contribution.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-36">
                    <img 
                      src={contribution.campaign.coverImage} 
                      alt={contribution.campaign.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{contribution.campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {contribution.campaign.shortDescription}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end">
                        <div className="text-lg font-semibold text-primary">
                          ${contribution.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Contributed on {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1">
                          <Badge className={getStatusColor(contribution.status)}>
                            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-4">
                        <div className="text-sm">
                          <Label className="text-muted-foreground mr-1">Campaign Status:</Label>
                          <Badge variant={
                            contribution.campaign.status === "active" ? "default" : 
                            contribution.campaign.status === "funded" ? "success" :
                            contribution.campaign.status === "pending" ? "warning" : "secondary"
                          }>
                            {contribution.campaign.status.charAt(0).toUpperCase() + contribution.campaign.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <Label className="text-muted-foreground mr-1">Payment ID:</Label>
                          <span className="font-mono text-xs">{contribution.paymentId}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/campaigns/${contribution.campaignId}`}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Campaign
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyContributions;
