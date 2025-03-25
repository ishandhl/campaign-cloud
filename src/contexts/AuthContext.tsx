
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AuthError, AuthResponse, Session } from "@supabase/supabase-js";

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
    const initializeAuth = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await fetchAndSetUser(session);
      }
      
      setLoading(false);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            await fetchAndSetUser(session);
          } else {
            setUser(null);
          }
        }
      );
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const fetchAndSetUser = async (session: Session) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }
    
    setUser({
      id: profile.id,
      email: profile.email,
      name: profile.name,
      profileImage: profile.profile_image,
      isAdmin: profile.is_admin,
      wallet: {
        balance: profile.wallet_balance
      },
      createdAt: profile.created_at
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not properly configured. Please set environment variables.");
      return false;
    }

    try {
      const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success("Login successful");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error. Please check your connection.";
      toast.error(errorMessage === "Failed to fetch" ? "Network error. Please check your connection and Supabase configuration." : errorMessage);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not properly configured. Please set environment variables.");
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error instanceof Error ? error.message : "Network error. Please check your connection.";
      toast.error(errorMessage === "Failed to fetch" ? "Network error. Please check your connection and Supabase configuration." : errorMessage);
      return false;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    setUser(null);
    toast.success("Logged out successfully");
  };

  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not properly configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.");
      console.error("Supabase configuration error: URL or API key not properly set");
      return false;
    }

    try {
      const { data, error: signUpError }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        }
      });
      
      if (signUpError) {
        toast.error(signUpError.message);
        return false;
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name,
            is_admin: false,
            wallet_balance: 0,
            created_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Failed to create user profile");
          return false;
        }
        
        toast.success("Registration successful");
        return true;
      } else {
        toast.error("Registration failed: No user was created");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (errorMessage === "Failed to fetch") {
        toast.error("Network error. Please check your connection and Supabase configuration.");
      } else {
        toast.error(`Registration failed: ${errorMessage}`);
      }
      
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
