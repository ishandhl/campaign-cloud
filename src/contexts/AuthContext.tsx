
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AuthError, AuthResponse, Session, User as SupabaseUser } from "@supabase/supabase-js";

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

  // Initialize user session on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await fetchAndSetUser(session);
      }
      
      setLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            await fetchAndSetUser(session);
          } else {
            setUser(null);
          }
        }
      );
      
      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Fetch user profile data and set the user state
  const fetchAndSetUser = async (session: Session) => {
    // Get user profile from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }
    
    // Set user state with profile data
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

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
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
      toast.error("Login failed");
      return false;
    }
  };

  // Login with Google OAuth
  const loginWithGoogle = async (): Promise<boolean> => {
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
      toast.error("Google login failed");
      return false;
    }
  };

  // Logout
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error(error.message);
      return;
    }
    
    setUser(null);
    toast.success("Logged out successfully");
  };

  // Register new user
  const register = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      // Create user in Supabase Auth
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
      
      // Create user profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
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
