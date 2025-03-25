
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Home, 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Plus, 
  Wallet, 
  Heart
} from "lucide-react";

const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-primary mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xl font-bold text-gray-900 dark:text-white">FundBoost</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/explore" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              Explore
            </Link>
            {user ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  {isAdmin ? "Admin" : "Dashboard"}
                </Link>
                <Link to="/dashboard/campaigns/create" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Start a Campaign
                </Link>
              </>
            ) : (
              <Link to="/login?redirect=create-campaign" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Start a Campaign
              </Link>
            )}
          </nav>

          {/* Right side buttons and menu */}
          <div className="flex items-center">
            {/* Search button */}
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate("/explore")}>
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/dashboard/notifications")}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/wallet")}>
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>Wallet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/contributions")}>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>My Contributions</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/dashboard/campaigns")}>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>My Campaigns</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Log in
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/explore" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
              Explore
            </Link>
            {user ? (
              <>
                <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  {isAdmin ? "Admin" : "Dashboard"}
                </Link>
                <Link to="/dashboard/campaigns/create" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Start a Campaign
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/register" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Sign up
                </Link>
                <Link to="/login?redirect=create-campaign" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                  Start a Campaign
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
