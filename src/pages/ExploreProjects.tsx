
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CampaignList from "@/components/campaign/CampaignList";
import FilterBar from "@/components/shared/FilterBar";
import PageHeader from "@/components/shared/PageHeader";
import { SearchIcon } from "lucide-react";
import { Campaign } from "@/types";
import { mockCampaigns } from "@/lib/mockData";

const ExploreProjects = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("newest");
  
  const location = useLocation();

  useEffect(() => {
    // Get query parameters
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    const statusParam = queryParams.get("status");
    const sortParam = queryParams.get("sort");
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (statusParam) {
      setSelectedStatus(statusParam);
    }
    
    if (sortParam) {
      setSortOrder(sortParam);
    }
    
    // Simulate loading data
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
      setLoading(false);
    };
    
    loadData();
  }, [location.search]);

  useEffect(() => {
    // Apply filters
    let results = [...campaigns];
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        campaign => 
          campaign.title.toLowerCase().includes(searchLower) ||
          campaign.description.toLowerCase().includes(searchLower) ||
          campaign.shortDescription.toLowerCase().includes(searchLower)
      );
    }
    
    // Category filter
    if (selectedCategory) {
      results = results.filter(campaign => campaign.category === selectedCategory);
    }
    
    // Status filter
    if (selectedStatus) {
      if (selectedStatus === "active") {
        results = results.filter(campaign => campaign.status === "active");
      } else if (selectedStatus === "funded") {
        results = results.filter(campaign => campaign.status === "funded" || campaign.currentAmount >= campaign.goalAmount);
      } else if (selectedStatus === "ending_soon") {
        // Filter campaigns ending in the next 7 days
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        results = results.filter(
          campaign => 
            new Date(campaign.endDate) <= sevenDaysFromNow && 
            new Date(campaign.endDate) >= new Date() &&
            campaign.status === "active"
        );
      } else if (selectedStatus === "new") {
        // Filter campaigns created in the last 14 days
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        results = results.filter(
          campaign => 
            new Date(campaign.createdAt) >= fourteenDaysAgo &&
            campaign.status === "active"
        );
      }
    }
    
    // Apply sort order
    if (sortOrder === "newest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === "oldest") {
      results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "most_funded") {
      results.sort((a, b) => b.currentAmount - a.currentAmount);
    } else if (sortOrder === "least_funded") {
      results.sort((a, b) => a.currentAmount - b.currentAmount);
    } else if (sortOrder === "ending_soon") {
      results.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    } else if (sortOrder === "recently_launched") {
      results.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }
    
    setFilteredCampaigns(results);
  }, [campaigns, searchTerm, selectedCategory, selectedStatus, sortOrder]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Explore Projects"
          description="Discover innovative projects from creators around the world"
          icon={SearchIcon}
        />
        
        <FilterBar
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onStatusChange={handleStatusChange}
        />
        
        {loading ? (
          <CampaignList campaigns={[]} loading={true} />
        ) : (
          <>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search filters or check back later for new projects.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Showing {filteredCampaigns.length} projects
                </p>
                <CampaignList campaigns={filteredCampaigns} />
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ExploreProjects;
