
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { mockUsers } from "@/lib/mockData";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem("crowdfund_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, this would be a backend call)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // In a real app, we would verify the password here
        setUser(foundUser);
        localStorage.setItem("crowdfund_user", JSON.stringify(foundUser));
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would integrate with Google OAuth
      // For now, just log in as the first user
      const googleUser = mockUsers[0];
      setUser(googleUser);
      localStorage.setItem("crowdfund_user", JSON.stringify(googleUser));
      toast.success("Google login successful");
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crowdfund_user");
    toast.success("Logged out successfully");
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        toast.error("Email already in use");
        return false;
      }

      // Create a new user (in a real app, this would be a backend call)
      const newUser: User = {
        id: `user${mockUsers.length + 1}`,
        email,
        name,
        isAdmin: false,
        wallet: {
          balance: 0
        },
        createdAt: new Date().toISOString()
      };

      // In a real app, we would add this user to the database
      // For now, just set as current user
      setUser(newUser);
      localStorage.setItem("crowdfund_user", JSON.stringify(newUser));
      toast.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        register,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
