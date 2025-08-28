"use client";

import type React from "react";

import { createContext, useEffect, useState } from "react";
import { authService } from "@/lib/auth-service";
import { User } from "@/types/api/user";


interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  businessName: string;
  slug: string;
  fullName: string;
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error("Invalid access token, logging out.");
        localStorage.removeItem("accessToken");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);


  const logout = async () => {
    try {
      await authService.logout();
      // Server will clear the HTTP-only refresh token cookie
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
