
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import {
  Session,
  User,
  AuthChangeEvent,
} from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'student' | 'adult' | 'parent' | 'teacher' | 'admin';

interface ExtendedUser extends User {
  role: UserRole;
  subscribed?: boolean;
  subscriptionTier?: SubscriptionTier;
  name: string;
  avatar?: string;
}

interface AuthContextProps {
  session: Session | null;
  user: ExtendedUser | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  login: (email: string, password: string, captchaToken?: string | null) => Promise<void>;
  updateUser: (data: any) => Promise<void>;
  updateUserProfile: (userData: ExtendedUser) => void;
  logout: () => Promise<void>;
  subscription: UserSubscription | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: Date | null;
}

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      setSession(session);
      if (session?.user) {
        // Create extended user with default values
        const extendedUser: ExtendedUser = {
          ...session.user,
          role: 'student', // default role
          name: session.user.user_metadata?.full_name || session.user.email || 'User',
          avatar: session.user.user_metadata?.avatar_url,
          subscribed: false,
          subscriptionTier: 'free' // default subscription tier
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    loadSession();

    supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        if (session?.user) {
          const extendedUser: ExtendedUser = {
            ...session.user,
            role: 'student', // default role
            name: session.user.user_metadata?.full_name || session.user.email || 'User',
            avatar: session.user.user_metadata?.avatar_url,
            subscribed: false,
            subscriptionTier: 'free' // default subscription tier
          };
          setUser(extendedUser);
        } else {
          setUser(null);
        }
      }
    );
  }, []);

  useEffect(() => {
    const getSubscription = async () => {
      if (user) {
        // Mock subscription check - replace with actual logic
        const mockSubscription: UserSubscription = {
          tier: 'professional',
          isActive: true,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        };
        setSubscription(mockSubscription);
      } else {
        setSubscription(null);
      }
    };

    getSubscription();
  }, [user]);

  const signIn = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the magic link to sign in!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, captchaToken?: string | null) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const signUp = async (email: string, password?: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Check your email to verify your account!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser(data);
      if (error) throw error;
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (userData: ExtendedUser) => {
    setUser(userData);
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signOut,
    signUp,
    login,
    updateUser,
    updateUserProfile,
    logout,
    subscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
