
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calendar, Upload, Plus, Minus } from "lucide-react";
import { mockCategories } from "@/lib/mockData";

const CreateCampaign = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Default image URLs for demo purposes
  const defaultImages = [
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const fileUrl = URL.createObjectURL(file);
      setCoverImage(fileUrl);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please enter a title for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!shortDescription.trim()) {
      toast({
        title: "Missing Short Description",
        description: "Please enter a short description for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please enter a detailed description for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!category) {
      toast({
        title: "Missing Category",
        description: "Please select a category for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
      toast({
        title: "Invalid Goal Amount",
        description: "Please enter a valid goal amount greater than zero.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!startDate || !endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    if (endDate <= startDate) {
      toast({
        title: "Invalid End Date",
        description: "End date must be after the start date.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!coverImage) {
      toast({
        title: "Missing Cover Image",
        description: "Please upload or select a cover image for your campaign.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would submit data to a backend API
      
      // Show success toast
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully and is pending review.",
      });
      
      // Redirect to the campaigns list
      navigate("/dashboard/campaigns");
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Campaign Creation Failed",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectDefaultImage = (url: string) => {
    setCoverImage(url);
    setCoverImageFile(null);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Create Campaign"
        description="Start a new crowdfunding campaign"
        icon={FileText}
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling title for your campaign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {title.length}/100
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Write a brief summary of your campaign (shown in campaign cards)"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  maxLength={160}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {shortDescription.length}/160
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign in detail. What are you raising funds for? Why should people support you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Funding Goal ($)</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter your funding goal amount"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="border rounded-md p-2">
                    <DatePicker
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="border rounded-md p-2">
                    <DatePicker
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => startDate ? date <= startDate : date <= new Date()}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverImage" className="block">Upload Image</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended size: 1200x630px (16:9). Max file size: 2MB.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="block">Or Select a Default Image</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {defaultImages.map((url, index) => (
                          <div 
                            key={index}
                            onClick={() => selectDefaultImage(url)}
                            className={`
                              cursor-pointer border h-24 rounded-md overflow-hidden
                              ${coverImage === url ? 'ring-2 ring-primary' : ''}
                            `}
                          >
                            <img src={url} alt={`Default ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {coverImage && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-md overflow-hidden h-64">
                      <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/campaigns")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Campaign...
              </>
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateCampaign;
