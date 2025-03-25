
import React, { useState, useEffect } from "react";
import { CreditCard, Search, Filter, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, XCircle, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";
import { mockTransactions } from "@/lib/mockData";

// Define the TransactionStatus type and use it consistently
type TransactionStatus = "pending" | "completed" | "failed";

// Update the ExtendedTransaction interface to specify valid status values:
interface ExtendedTransaction extends Transaction {
  userName: string;
  campaignTitle?: string;
  status: TransactionStatus;
}

const PaymentManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<{
    all: ExtendedTransaction[];
    pending: ExtendedTransaction[];
    completed: ExtendedTransaction[];
    failed: ExtendedTransaction[];
  }>({
    all: [],
    pending: [],
    completed: [],
    failed: []
  });
  
  const [selectedTransaction, setSelectedTransaction] = useState<ExtendedTransaction | null>(null);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  const [actionNotes, setActionNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  // Mock withdrawal requests
  const withdrawalRequests = [
    {
      id: "w1",
      userId: "user1",
      userName: "John Doe",
      type: "withdrawal" as const,
      amount: 500,
      status: "pending" as TransactionStatus,
      createdAt: "2023-08-15T10:30:00Z"
    },
    {
      id: "w2",
      userId: "user2",
      userName: "Jane Smith",
      type: "withdrawal" as const,
      amount: 750,
      status: "pending" as TransactionStatus,
      createdAt: "2023-08-16T14:45:00Z"
    }
  ];

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a set of mock transactions with added user data
      const extendedTransactions: ExtendedTransaction[] = [
        ...mockTransactions.map(t => ({
          ...t,
          userName: t.userId === "user1" ? "John Doe" : "Jane Smith",
          campaignTitle: t.campaignId === "campaign1" ? "Eco-friendly Water Bottle" : 
                        t.campaignId === "campaign2" ? "Educational STEM Toy for Kids" : 
                        t.campaignId === "campaign3" ? "Smart Home Energy Monitor" : undefined,
          status: t.status as TransactionStatus
        })),
        // Add the mocked withdrawal requests
        ...withdrawalRequests as ExtendedTransaction[]
      ];
      
      // Sort by date, newest first
      extendedTransactions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setTransactions(extendedTransactions);
      
      setLoading(false);
    };
    
    loadTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      // Apply filters
      let filtered = transactions;
      
      // Apply search filter if present
      if (searchTerm) {
        filtered = filtered.filter(
          transaction => 
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transaction.paymentId && transaction.paymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (transaction.campaignTitle && transaction.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Apply type filter if selected
      if (filterType) {
        filtered = filtered.filter(transaction => transaction.type === filterType);
      }
      
      // Categorize transactions by status
      const all = filtered;
      const pending = filtered.filter(transaction => transaction.status === "pending");
      const completed = filtered.filter(transaction => transaction.status === "completed");
      const failed = filtered.filter(transaction => transaction.status === "failed");
      
      setFilteredTransactions({ all, pending, completed, failed });
    }
  }, [transactions, searchTerm, filterType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const openActionDialog = (transaction: ExtendedTransaction, type: "approve" | "reject") => {
    setSelectedTransaction(transaction);
    setActionType(type);
    setActionNotes("");
    setIsActionOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!selectedTransaction) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update transaction status in state
      const updatedTransactions = transactions.map(t => 
        t.id === selectedTransaction.id 
          ? { 
              ...t, 
              status: actionType === "approve" ? "completed" : "failed" 
            }
          : t
      );
      
      setTransactions(updatedTransactions);
      
      // Close dialog
      setIsActionOpen(false);
      
      // Show success toast
      toast({
        title: actionType === "approve" ? "Transaction Approved" : "Transaction Rejected",
        description: actionType === "approve" 
          ? `Transaction #${selectedTransaction.id} has been approved.`
          : `Transaction #${selectedTransaction.id} has been rejected.`,
      });
    } catch (error) {
      console.error("Action error:", error);
      toast({
        title: "Action Failed",
        description: "There was an error processing this transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownToLine className="h-5 w-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUpFromLine className="h-5 w-5 text-amber-500" />;
      case "contribution":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "refund":
        return <ArrowDownToLine className="h-5 w-5 text-purple-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "deposit":
        return "Deposit";
      case "withdrawal":
        return "Withdrawal";
      case "contribution":
        return "Campaign Contribution";
      case "refund":
        return "Refund";
      default:
        return "Transaction";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
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
        title="Payment Management"
        description="Manage payments, withdrawals, and transaction history"
        icon={CreditCard}
      />
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search transactions by ID, user, or payment reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterType ? `Filter: ${getTransactionTypeLabel(filterType)}` : "All Transaction Types"}
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Transaction Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="contribution">Contributions</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button type="submit" className="w-full">Search</Button>
          </div>
        </form>
      </div>
      
      <Tabs defaultValue="all" className="border rounded-lg shadow-sm bg-card">
        <TabsList className="w-full border-b">
          <TabsTrigger value="all" className="flex-1">
            All Transactions <span className="ml-1 text-xs">({filteredTransactions.all.length})</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">
            Pending <span className="ml-1 text-xs">({filteredTransactions.pending.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed <span className="ml-1 text-xs">({filteredTransactions.completed.length})</span>
          </TabsTrigger>
          <TabsTrigger value="failed" className="flex-1">
            Failed <span className="ml-1 text-xs">({filteredTransactions.failed.length})</span>
          </TabsTrigger>
        </TabsList>
        
        {["all", "pending", "completed", "failed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="p-6">
            {filteredTransactions[tab as keyof typeof filteredTransactions].length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions[tab as keyof typeof filteredTransactions].map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start">
                          <div className="mr-4 p-2 rounded-full bg-muted">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <div className="font-medium">{getTransactionTypeLabel(transaction.type)}</div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.userName} • {new Date(transaction.createdAt).toLocaleString()}
                            </div>
                            {transaction.campaignTitle && (
                              <div className="text-sm mt-1">
                                Campaign: {transaction.campaignTitle}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start md:items-end">
                          <div className="text-lg font-semibold">
                            ${transaction.amount.toLocaleString()}
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Transaction ID:</span> {transaction.id}
                          </div>
                          {transaction.paymentId && (
                            <div>
                              <span className="text-muted-foreground">Payment Ref:</span> {transaction.paymentId}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {transaction.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="text-green-600"
                                variant="outline"
                                onClick={() => openActionDialog(transaction, "approve")}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="text-red-600"
                                variant="outline"
                                onClick={() => openActionDialog(transaction, "reject")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
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
      
      {/* Transaction Action Dialog */}
      <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Transaction" : "Reject Transaction"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "This will process the transaction and update the user's account."
                : "This will reject the transaction and notify the user."
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Transaction Type</div>
                    <div className="font-medium">{getTransactionTypeLabel(selectedTransaction.type)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Amount</div>
                    <div className="font-medium">${selectedTransaction.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">User</div>
                    <div className="font-medium">{selectedTransaction.userName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">{new Date(selectedTransaction.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="actionNotes">Notes</Label>
                  <Textarea
                    id="actionNotes"
                    placeholder="Add any notes about this transaction..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                
                {actionType === "approve" && selectedTransaction.type === "withdrawal" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payment Verification</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="verifyId" />
                          <label
                            htmlFor="verifyId"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            User identity verified
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="verifyFunds" />
                          <label
                            htmlFor="verifyFunds"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Sufficient funds available
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="verifyBank" />
                          <label
                            htmlFor="verifyBank"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Bank account details verified
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select defaultValue="bank">
                        <SelectTrigger id="paymentMethod">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="khalti">Khalti</SelectItem>
                        </SelectContent>
                      </Select>
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
              variant={actionType === "reject" ? "destructive" : undefined}
            >
              {isProcessing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                actionType === "approve" ? "Approve Transaction" : "Reject Transaction"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PaymentManagement;
