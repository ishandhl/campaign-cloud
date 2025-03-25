
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public Pages
import Homepage from "./pages/Homepage";
import ExploreProjects from "./pages/ExploreProjects";
import CampaignDetails from "./pages/CampaignDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Protected Pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyCampaigns from "./pages/dashboard/MyCampaigns";
import CreateCampaign from "./pages/dashboard/CreateCampaign";
import EditCampaign from "./pages/dashboard/EditCampaign";
import MyContributions from "./pages/dashboard/MyContributions";
import Wallet from "./pages/dashboard/Wallet";
import MyProfile from "./pages/dashboard/MyProfile";
import Notifications from "./pages/dashboard/Notifications";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CampaignApprovals from "./pages/admin/CampaignApprovals";
import UserManagement from "./pages/admin/UserManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import ReportsAnalytics from "./pages/admin/ReportsAnalytics";

// Auth Guards
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/explore" element={<ExploreProjects />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard/campaigns" element={<PrivateRoute><MyCampaigns /></PrivateRoute>} />
            <Route path="/dashboard/campaigns/create" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
            <Route path="/dashboard/campaigns/edit/:id" element={<PrivateRoute><EditCampaign /></PrivateRoute>} />
            <Route path="/dashboard/contributions" element={<PrivateRoute><MyContributions /></PrivateRoute>} />
            <Route path="/dashboard/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/dashboard/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
            <Route path="/dashboard/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/campaigns" element={<AdminRoute><CampaignApprovals /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/admin/payments" element={<AdminRoute><PaymentManagement /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><ReportsAnalytics /></AdminRoute>} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
