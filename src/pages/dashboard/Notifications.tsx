import React, { useState, useEffect } from "react";
import { Bell, FileText as Campaign } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mockData";

const Notifications = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all notifications from mock data
      setNotifications(mockNotifications);
      
      setLoading(false);
    };
    
    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
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
        description="Stay up-to-date on your account activity"
        icon={Bell}
      />
      
      <Card className="w-full">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No notifications found.</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="p-4">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark All as Read
                  </Button>
                </div>
                
                {notifications.map((notification) => (
                  <div key={notification.id} className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`notification-${notification.id}`}
                          checked={notification.isRead}
                          onCheckedChange={() => markAsRead(notification.id)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={`notification-${notification.id}`}
                            className="text-sm font-semibold"
                          >
                            {notification.title}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <Badge variant={notification.type === "system" ? "secondary" : notification.type === "campaign_update" ? "warning" : "default"}>
                        {notification.type === "system" ? "System" : notification.type === "campaign_update" ? "Campaign Update" : "Contribution"}
                      </Badge>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Notifications;
