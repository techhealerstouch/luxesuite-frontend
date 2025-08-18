"use client";

import React, { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  apiService,
  type SubscriptionPlan,
  type Subscription,
  type AccountSettings,
} from "@/lib/api-service";
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

  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
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

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.account?.id || "",
        name: user.name || "",
        email: user.email || "",
        account: {
          name: user.account?.name || "",
          slug: user.account?.slug || "",
        },
      });
    }
  }, [user]);

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
      // handle error
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
    setIsSaving(true);
    try {
      await apiService.updateAccount(formData);
      toast({
        title: "Success",
        description: "Account information updated successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update account information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
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
      toast({ title: "Success", description: "Password updated successfully" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      let message = "Something went wrong";

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
      toast({ title: "Success", description: "Settings updated successfully" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update settings",
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
                <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" />
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
