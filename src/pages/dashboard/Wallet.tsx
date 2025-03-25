
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, RefreshCw, CreditCard, Clock, Filter } from "lucide-react";
import { Transaction } from "@/types";
import { mockTransactions } from "@/lib/mockData";

const Wallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("100");
  const [withdrawAmount, setWithdrawAmount] = useState("100");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        // Get transactions for the user
        const userTransactions = mockTransactions.filter(
          transaction => transaction.userId === user.id
        );
        
        // Sort by date, newest first
        userTransactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setTransactions(userTransactions);
        setFilteredTransactions(userTransactions);
      }
      
      setLoading(false);
    };
    
    loadTransactions();
  }, [user]);

  useEffect(() => {
    if (filterType) {
      const filtered = transactions.filter(transaction => transaction.type === filterType);
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [filterType, transactions]);

  const handleDeposit = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success toast
      toast({
        title: "Deposit Successful",
        description: `$${depositAmount} has been added to your wallet.`,
      });
      
      // Close dialog
      setIsDepositOpen(false);
      
      // In a real app, the transaction would be added to the list
      // and the wallet balance would be updated
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if user has enough balance
      if (user && user.wallet.balance < Number(withdrawAmount)) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough funds in your wallet for this withdrawal.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      // Show success toast
      toast({
        title: "Withdrawal Requested",
        description: `Your withdrawal request for $${withdrawAmount} has been submitted for processing.`,
      });
      
      // Close dialog
      setIsWithdrawOpen(false);
      
      // In a real app, the transaction would be added to the list
      // and the wallet balance would be updated
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownToLine className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpFromLine className="h-4 w-4 text-amber-500" />;
      case "contribution":
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type: string) => {
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
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">Pending</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
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
        title="Wallet"
        description="Manage your funds and transactions"
        icon={WalletIcon}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Balance</CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${user?.wallet.balance.toLocaleString()}</div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add funds to your wallet to back campaigns.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="10"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 200, 500].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setDepositAmount(amount.toString())}
                          className={depositAmount === amount.toString() ? "border-primary" : ""}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select defaultValue="khalti">
                        <SelectTrigger id="paymentMethod">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="khalti">Khalti</SelectItem>
                          <SelectItem value="creditCard">Credit Card</SelectItem>
                          <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDepositOpen(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleDeposit} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Deposit $${depositAmount}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your wallet to your bank account.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">Amount ($)</Label>
                      <Input
                        id="withdrawAmount"
                        type="number"
                        min="10"
                        max={user?.wallet.balance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Available balance: ${user?.wallet.balance.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 200, 500].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setWithdrawAmount(amount.toString())}
                          className={withdrawAmount === amount.toString() ? "border-primary" : ""}
                          disabled={user?.wallet.balance && user.wallet.balance < amount}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawMethod">Withdrawal Method</Label>
                      <Select defaultValue="bankTransfer">
                        <SelectTrigger id="withdrawMethod">
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="khalti">Khalti</SelectItem>
                          <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsWithdrawOpen(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleWithdraw} 
                    disabled={isProcessing || (user?.wallet.balance && user.wallet.balance < Number(withdrawAmount))}
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      `Withdraw $${withdrawAmount}`
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Summary of your transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Deposits</div>
              <div className="text-2xl font-bold">
                $
                {transactions
                  .filter(t => t.type === "deposit" && t.status === "completed")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Withdrawals</div>
              <div className="text-2xl font-bold">
                $
                {transactions
                  .filter(t => t.type === "withdrawal" && t.status === "completed")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Contributions</div>
              <div className="text-2xl font-bold">
                $
                {transactions
                  .filter(t => t.type === "contribution" && t.status === "completed")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent activity in your wallet</CardDescription>
            </div>
            <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterType ? `Filter: ${filterType}` : "All Transactions"}
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Transactions</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="contribution">Contributions</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full p-2 bg-muted">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium">{getTransactionLabel(transaction.type)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString()}
                      </div>
                      {transaction.paymentId && (
                        <div className="text-xs text-muted-foreground font-mono">
                          ID: {transaction.paymentId}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`text-lg font-semibold ${
                      transaction.type === "deposit" || transaction.type === "refund" 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {transaction.type === "deposit" || transaction.type === "refund" 
                        ? "+" 
                        : "-"}${transaction.amount.toLocaleString()}
                    </div>
                    <div className="mt-1">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Wallet;
