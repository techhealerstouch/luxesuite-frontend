"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ add router
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MoreVertical, RefreshCw } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { Subscription, SubscriptionPlan } from "@/types/api/subscription";
import { useToast } from "@/hooks/use-toast";
import { NewSubscriptionDialog } from "@/components/NewSubscriptionDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authService } from "@/lib/auth-service";
import { User } from "@/types/api/user";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter(); // ✅ initialize router

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    setIsRefreshing(true);

    try {
      const response = await apiService.getSubscriptions();
      setSubscriptions(response.data);
    } catch (error: any) {
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchSubscriptions();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubscriptions();
  };

  const handleSelectPlan = (plan: SubscriptionPlan, durationMonths: number) => {
    console.log("User selected plan:", plan, "for months:", durationMonths);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                {subscriptions.length > 0
                  ? `Managing ${subscriptions.length} service${
                      subscriptions.length !== 1 ? "s" : ""
                    }`
                  : "Welcome back! Create your first service to get started."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>

              {/* ✅ Show Start Free Trial button if trial_subscription === 1 */}
            </div>
          </div>

          {subscriptions.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No subscriptions yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Subscribe to our services to get started with Luxe Suite.
                </p>

                {Number(user?.account?.trial_subscription) === 1 ? (
                  <Button onClick={() => router.push("/free-trial")}>
                    Start Free Trial
                  </Button>
                ) : (
                  <NewSubscriptionDialog
                    onSelectPlan={handleSelectPlan}
                    user={user}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions
                .filter((subscription) => subscription.status !== "pending")
                .map((subscription) => (
                  <Card
                    key={subscription.id}
                    className="relative hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 w-full">
                        <img
                          src={"/placeholder-logo.png"}
                          alt={`${subscription.service} logo`}
                          className="w-16 h-16 object-contain rounded"
                        />
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Domain
                            </p>
                            <p className="font-medium">
                              {subscription.service}.com
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={`https://${subscription.service}.com`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Website
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
