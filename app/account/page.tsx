"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  apiService,
} from "@/lib/api-service";
import { 
  Subscription, 
  SubscriptionsApiResponse, 
  SubscriptionPlan, 
  CustomPlanUserLimit, 
  NewSubscription 
} from "@/types/api/subscription";
import { AccountSettings } from "@/types/settings/account-settings";
import { useToast } from "@/hooks/use-toast";

import { Sidebar } from "@/components/Account/Sidebar";
import { AccountSection } from "@/components/Account/AccountSection";
import { SubscriptionSection } from "@/components/Account/SubscriptionSection";
import { SettingsSection } from "@/components/Account/SettingsSection";

type ActiveSection = "account" | "subscription" | "settings";

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("account");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlans, setCurrentPlans] = useState<Subscription[]>([]);
  const [accountSettings, setAccountSettings] =
    useState<AccountSettings | null>(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone_number: "",
    timezone: "",
    account: {
      name: "", // maps to businessName maybe
      slug: "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize form data from user data
  useEffect(() => {
    if (user) {
      // Only update if we haven't loaded user data yet, or if timezone is empty
      // This prevents overwriting user changes with stale data
      if (!userDataLoaded) {
        setFormData({
          id: user.account?.id || null,
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          timezone: user.timezone || "", // This will be populated by AccountSection if empty
          account: {
            name: user.account?.name || "",
            slug: user.account?.slug || "",
          },
        });
        setUserDataLoaded(true);
      } else if (user.timezone && !formData.timezone) {
        // If user has a timezone but formData doesn't, update it
        setFormData(prev => ({
          ...prev,
          timezone: user.timezone || "",
        }));
      }
    }
  }, [user, userDataLoaded, formData.timezone]);

  useEffect(() => {
    if (activeSection === "subscription") fetchCurrentPlan();
    else if (activeSection === "settings") fetchAccountSettings();
  }, [activeSection]);

  async function fetchCurrentPlan() {
    setIsLoading(true);
    try {
      const response = await apiService.getSubscriptions();
      setCurrentPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAccountSettings() {
    // Uncomment and implement if needed
    // setIsLoading(true);
    // try {
    //   const settings = await apiService.getSettings();
    //   setAccountSettings(settings);
    // } catch (error) {
    //   console.error(error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to load settings",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  }

  async function handleAccountUpdate(e: React.FormEvent) {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiService.updateAccount(formData);
      toast({
        title: "Success",
        description: "Account information updated successfully",
      });
    } catch (error) {
      console.error('Failed to update account:', error);
      
      // Extract error message if available
      let errorMessage = "Failed to update account information";
      if (typeof error === "object" && error !== null) {
        if ("data" in error && typeof (error as any).data === "object" && (error as any).data !== null) {
          errorMessage = (error as any).data.message ?? errorMessage;
        } else if ("message" in error && typeof (error as any).message === "string") {
          errorMessage = (error as any).message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({
        title: "Validation Error",
        description: "Both current and new passwords are required",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await apiService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast({ 
        title: "Success", 
        description: "Password updated successfully" 
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      let message = "Failed to update password";

      if (typeof error === "object" && error !== null) {
        if (
          "data" in error &&
          typeof (error as any).data === "object" &&
          (error as any).data !== null
        ) {
          message = (error as any).data.message ?? message;
        } else if (
          "message" in error &&
          typeof (error as any).message === "string"
        ) {
          message = (error as any).message;
        }
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSettingsUpdate(newSettings: Partial<AccountSettings>) {
    if (!accountSettings) return;
    setIsSaving(true);
    try {
      const updatedSettings = await apiService.updateSettings({
        ...accountSettings,
        ...newSettings,
      });
      setAccountSettings(updatedSettings);
      toast({ 
        title: "Success", 
        description: "Settings updated successfully" 
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      
      let errorMessage = "Failed to update settings";
      if (typeof error === "object" && error !== null) {
        if ("data" in error && typeof (error as any).data === "object" && (error as any).data !== null) {
          errorMessage = (error as any).data.message ?? errorMessage;
        } else if ("message" in error && typeof (error as any).message === "string") {
          errorMessage = (error as any).message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Account</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Responsive flex container */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/5 space-y-4 px-4 md:px-0">
              <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                user={user}
              />
            </div>

            <div className="w-full md:w-3/5 px-4 md:px-0">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2 text-muted-foreground">Loading...</span>
                </div>
              )}
              {!isLoading && activeSection === "account" && (
                <AccountSection
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleAccountUpdate}
                  isSaving={isSaving}
                />
              )}
              {!isLoading && activeSection === "subscription" && (
                <SubscriptionSection
                  subscriptions={currentPlans}
                  isLoading={isLoading}
                />
              )}
              {!isLoading && activeSection === "settings" && (
                <SettingsSection
                  passwordData={passwordData}
                  setPasswordData={setPasswordData}
                  onPasswordSubmit={handlePasswordChange}
                  isSaving={isSaving}
                  accountSettings={accountSettings}
                  onSettingsUpdate={handleSettingsUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}