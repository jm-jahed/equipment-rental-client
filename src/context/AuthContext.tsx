"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type UserRole = "Customer" | "Owner" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  loginWithGoogle: (name: string, email: string, image?: string) => Promise<boolean>;
  updateProfile: (data: { name?: string; image?: string; phone?: string; address?: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Verify and hydrate existing session from localStorage or BetterAuth session cookie on reload
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      // If no token in localStorage, check if BetterAuth session cookie exists (e.g. after Google OAuth redirect)
      if (!storedToken) {
        try {
          const sessionRes = await fetch(`${API_URL}/auth/session-token`, {
            credentials: "include",
          });
          if (sessionRes.ok) {
            const sessionData = await sessionRes.json();
            if (sessionData.success && sessionData.token && sessionData.user) {
              localStorage.setItem("token", sessionData.token);
              setToken(sessionData.token);
              setUser(sessionData.user);
              setIsLoading(false);
              return;
            }
          }
        } catch (sessionErr) {
          console.debug("No BetterAuth cookie session:", sessionErr);
        }

        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success && data.user) {
          setUser(data.user);
        } else {
          // Token is expired or invalid
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth hydration error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [API_URL]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(data.message || "Logged in successfully!");
      return true;
    } catch (error) {
      console.error("Login request error:", error);
      toast.error("Network error. Could not connect to the server.");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, image?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, image }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Registration failed.");
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(data.message || "Account registered successfully!");
      return true;
    } catch (error) {
      console.error("Registration request error:", error);
      toast.error("Network error during registration.");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (name: string, email: string, image?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, image }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Google sign-in failed.");
        setIsLoading(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success("Signed in with Google successfully!");
      return true;
    } catch (error) {
      console.error("Google auth request error:", error);
      toast.error("Network error during Google sign-in.");
      setIsLoading(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: { name?: string; image?: string; phone?: string; address?: string }): Promise<boolean> => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      toast.error("You must be logged in to update your profile.");
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to update profile.");
        return false;
      }

      setUser(data.user);
      toast.success(data.message || "Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Network error while updating profile.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully.");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
