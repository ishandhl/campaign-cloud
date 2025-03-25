
import React, { useState, useEffect } from "react";
import { Users, Search, Filter, UserCheck, UserMinus, AlertTriangle, Shield, UserX, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { User } from "@/types";
import { mockUsers } from "@/lib/mockData";

const UserManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{
    all: User[];
    admin: User[];
    suspended: User[];
  }>({
    all: [],
    admin: [],
    suspended: []
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"suspend" | "unsuspend" | "makeAdmin" | "removeAdmin">("suspend");
  const [actionNotes, setActionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get all users from mock data and add some mock suspended users
      const userData = [
        ...mockUsers,
        {
          id: "user3",
          email: "suspended@example.com",
          name: "Suspended User",
          profileImage: "/assets/users/user3.jpg",
          isAdmin: false,
          isSuspended: true,
          wallet: {
            balance: 0
          },
          createdAt: "2023-07-05T14:20:00Z"
        }
      ];
      
      setUsers(userData);
      
      setLoading(false);
    };
    
    loadUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      // Apply search filter if present
      let filtered = users;
      
      if (searchTerm) {
        filtered = filtered.filter(
          user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Categorize users
      const all = filtered;
      const admin = filtered.filter(user => user.isAdmin);
      const suspended = filtered.filter(user => (user as any).isSuspended);
      
      setFilteredUsers({ all, admin, suspended });
    }
  }, [users, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const openActionDialog = (user: User, type: "suspend" | "unsuspend" | "makeAdmin" | "removeAdmin") => {
    setSelectedUser(user);
    setActionType(type);
    setActionNotes("");
    setIsActionOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!selectedUser) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user status in state
      let updatedUsers = [...users];
      let toastMessage = "";
      
      switch (actionType) {
        case "suspend":
          updatedUsers = users.map(u => 
            u.id === selectedUser.id 
              ? { ...u, isSuspended: true }
              : u
          );
          toastMessage = `${selectedUser.name} has been suspended`;
          break;
        case "unsuspend":
          updatedUsers = users.map(u => 
            u.id === selectedUser.id 
              ? { ...u, isSuspended: false }
              : u
          );
          toastMessage = `${selectedUser.name} has been unsuspended`;
          break;
        case "makeAdmin":
          updatedUsers = users.map(u => 
            u.id === selectedUser.id 
              ? { ...u, isAdmin: true }
              : u
          );
          toastMessage = `${selectedUser.name} has been given admin privileges`;
          break;
        case "removeAdmin":
          updatedUsers = users.map(u => 
            u.id === selectedUser.id 
              ? { ...u, isAdmin: false }
              : u
          );
          toastMessage = `${selectedUser.name}'s admin privileges have been removed`;
          break;
      }
      
      setUsers(updatedUsers);
      
      // Close dialog
      setIsActionOpen(false);
      
      // Show success toast
      toast({
        title: "Action Completed",
        description: toastMessage,
      });
    } catch (error) {
      console.error("Action error:", error);
      toast({
        title: "Action Failed",
        description: "There was an error performing this action. Please try again.",
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

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        description="Manage users, admins, and user permissions"
        icon={Users}
      />
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>
      
      <Tabs defaultValue="all" className="border rounded-lg shadow-sm bg-card">
        <TabsList className="w-full border-b">
          <TabsTrigger value="all" className="flex-1">
            All Users <span className="ml-1 text-xs">({filteredUsers.all.length})</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex-1">
            Admins <span className="ml-1 text-xs">({filteredUsers.admin.length})</span>
          </TabsTrigger>
          <TabsTrigger value="suspended" className="flex-1">
            Suspended <span className="ml-1 text-xs">({filteredUsers.suspended.length})</span>
          </TabsTrigger>
        </TabsList>
        
        {["all", "admin", "suspended"].map((tab) => (
          <TabsContent key={tab} value={tab} className="p-6">
            {filteredUsers[tab as keyof typeof filteredUsers].length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers[tab as keyof typeof filteredUsers].map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={user.profileImage} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center">
                              {user.name}
                              {user.isAdmin && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Admin
                                </Badge>
                              )}
                              {(user as any).isSuspended && (
                                <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Suspended
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          {user.isAdmin ? (
                            user.id !== "admin1" && ( // Don't allow removing admin privileges from the main admin
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600"
                                onClick={() => openActionDialog(user, "removeAdmin")}
                              >
                                <Shield className="h-4 w-4 mr-1" />
                                Remove Admin
                              </Button>
                            )
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActionDialog(user, "makeAdmin")}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Make Admin
                            </Button>
                          )}
                          
                          {(user as any).isSuspended ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => openActionDialog(user, "unsuspend")}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Unsuspend
                            </Button>
                          ) : (
                            user.id !== "admin1" && ( // Don't allow suspending the main admin
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                onClick={() => openActionDialog(user, "suspend")}
                              >
                                <UserX className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">User ID:</span> {user.id}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Wallet Balance:</span> ${user.wallet.balance.toLocaleString()}
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
      
      {/* User Action Dialog */}
      <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" && "Suspend User"}
              {actionType === "unsuspend" && "Unsuspend User"}
              {actionType === "makeAdmin" && "Make User Admin"}
              {actionType === "removeAdmin" && "Remove Admin Privileges"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend" && "This will prevent the user from logging in or using the platform."}
              {actionType === "unsuspend" && "This will restore the user's access to the platform."}
              {actionType === "makeAdmin" && "This will grant the user admin privileges and access to the admin dashboard."}
              {actionType === "removeAdmin" && "This will remove the user's admin privileges."}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={selectedUser.profileImage} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                {(actionType === "suspend" || actionType === "unsuspend") && (
                  <div className="space-y-2">
                    <Label htmlFor="actionNotes">Reason</Label>
                    <Textarea
                      id="actionNotes"
                      placeholder="Provide a reason for this action..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                )}
                
                {actionType === "suspend" && (
                  <div className="space-y-2">
                    <Label htmlFor="suspensionDuration">Suspension Duration</Label>
                    <Select defaultValue="indefinite">
                      <SelectTrigger id="suspensionDuration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {actionType === "makeAdmin" && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Important: Admin Privileges</p>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Admins have access to sensitive platform data and can perform critical actions. 
                          Only grant admin privileges to trusted individuals.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsActionOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleActionSubmit} 
              disabled={isProcessing}
              variant={actionType === "suspend" ? "destructive" : undefined}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                actionType === "suspend" ? "Suspend User" :
                actionType === "unsuspend" ? "Unsuspend User" :
                actionType === "makeAdmin" ? "Grant Admin Access" :
                "Remove Admin Access"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default UserManagement;
