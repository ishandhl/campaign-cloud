
import { Campaign } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const percentFunded = Math.min(Math.round((campaign.currentAmount / campaign.goalAmount) * 100), 100);
  const daysLeft = formatDistanceToNow(new Date(campaign.endDate), { addSuffix: true });
  
  return (
    <Link to={`/campaigns/${campaign.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg card-hover h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={campaign.coverImage} 
            alt={campaign.title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant={
                campaign.status === "active" ? "default" : 
                campaign.status === "funded" ? "success" :
                campaign.status === "pending" ? "warning" : "secondary"
              }
            >
              {campaign.status === "active" ? "Active" :
               campaign.status === "funded" ? "Funded" :
               campaign.status === "pending" ? "Pending" : "Ended"}
            </Badge>
          </div>
        </div>
        <CardContent className="flex-grow p-4">
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-medium">
              {campaign.category}
            </Badge>
            <h3 className="text-lg font-semibold leading-tight line-clamp-2">{campaign.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {campaign.shortDescription}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">${campaign.currentAmount.toLocaleString()}</span>
              <span className="text-muted-foreground">${campaign.goalAmount.toLocaleString()} Goal</span>
            </div>
            <Progress value={percentFunded} className="h-2" />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted-foreground">{percentFunded}% Funded</span>
              <span className="text-muted-foreground">{daysLeft}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 bg-muted/20">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{campaign.backers || 0} backers</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CampaignCard;
