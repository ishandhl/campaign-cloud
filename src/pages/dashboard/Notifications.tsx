
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Trash2, Campaign, Heart, BarChart, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types";
import { getNotificationsForUser } from "@/lib/mockData";

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<{
    all: Notification[];
    unread: Notification[];
    campaigns: Notification[];
    contributions: Notification[];
    system: Notification[];
  }>({
    all: [],
    unread: [],
    campaigns: [],
    contributions: [],
    system: []
  });

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        // Get notifications for the user
        const userNotifications = getNotificationsForUser(user.id);
        
        // Sort by date, newest first
        userNotifications.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setNotifications(userNotifications);
      }
      
      setLoading(false);
    };
    
    loadNotifications();
  }, [user]);

  useEffect(() => {
    const all = notifications;
    const unread = notifications.filter(n => !n.isRead);
    const campaigns = notifications.filter(n => n.type === "campaign_update");
    const contributions = notifications.filter(n => n.type === "contribution");
    const system = notifications.filter(n => n.type === "system");
    
    setFilteredNotifications({
      all,
      unread,
      campaigns,
      contributions,
      system
    });
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    // Update UI optimistically
    setNotifications(notifications.map(n => 
      n.id === notificationId 
        ? { ...n, isRead: true } 
        : n
    ));
    
    // In a real app, this would make an API call to update the notification
    toast({
      title: "Notification marked as read",
    });
  };

  const markAllAsRead = () => {
    // Update UI optimistically
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    
    // In a real app, this would make an API call to update all notifications
    toast({
      title: "All notifications marked as read",
    });
  };

  const deleteNotification = (notificationId: string) => {
    // Update UI optimistically
    setNotifications(notifications.filter(n => n.id !== notificationId));
    
    // In a real app, this would make an API call to delete the notification
    toast({
      title: "Notification deleted",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "campaign_update":
        return <Campaign className="h-5 w-5 text-blue-500" />;
      case "contribution":
        return <Heart className="h-5 w-5 text-pink-500" />;
      case "system":
        return <BarChart className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRelatedLink = (notification: Notification) => {
    if (notification.type === "campaign_update" && notification.relatedId) {
      return `/campaigns/${notification.relatedId}`;
    }
    
    if (notification.type === "contribution" && notification.relatedId) {
      return `/dashboard/contributions`;
    }
    
    return null;
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
        title="Notifications"
        description="Stay updated with your campaign and contribution activity"
        icon={Bell}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Your Notifications</CardTitle>
          {filteredNotifications.unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">
                All <span className="ml-1 text-xs">({filteredNotifications.all.length})</span>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread <span className="ml-1 text-xs">({filteredNotifications.unread.length})</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns">
                Campaigns <span className="ml-1 text-xs">({filteredNotifications.campaigns.length})</span>
              </TabsTrigger>
              <TabsTrigger value="contributions">
                Contributions <span className="ml-1 text-xs">({filteredNotifications.contributions.length})</span>
              </TabsTrigger>
              <TabsTrigger value="system">
                System <span className="ml-1 text-xs">({filteredNotifications.system.length})</span>
              </TabsTrigger>
            </TabsList>
            
            {["all", "unread", "campaigns", "contributions", "system"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filteredNotifications[tab as keyof typeof filteredNotifications].length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                ) : (
                  filteredNotifications[tab as keyof typeof filteredNotifications].map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-colors ${
                        notification.isRead ? 'bg-card' : 'bg-muted/30'
                      }`}
                    >
                      <div className="flex">
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <h3 className="font-semibold">{notification.title}</h3>
                              <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 sm:mt-0 sm:ml-4 sm:text-right">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="space-x-2">
                              {!notification.isRead && (
                                <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                                  <Check className="mr-1 h-4 w-4" />
                                  Mark as read
                                </Button>
                              )}
                              {getRelatedLink(notification) && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={getRelatedLink(notification) as string}>
                                    <ExternalLink className="mr-1 h-4 w-4" />
                                    View details
                                  </Link>
                                </Button>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Notifications;
