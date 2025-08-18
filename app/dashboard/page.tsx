"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, MoreVertical, RefreshCw } from "lucide-react";
import {
  apiService,
  type Subscription,
  type SubscriptionPlan,
} from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { NewSubscriptionDialog } from "@/components/NewSubscriptionDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      const response = await apiService.getSubscriptions();
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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
              <NewSubscriptionDialog onSelectPlan={handleSelectPlan} />
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
              </CardContent>
            </Card>
          ) : (
            // Website Card
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {subscriptions
                .filter((subscription) => subscription.status !== "pending")
                .map((subscription) => {
                  const serviceImage =
                    subscription.service === "luxeoffice"
                      ? "/placeholder-logo.png"
                      : subscription.service === "luxedb"
                      ? "/placeholder-logo.png"
                      : subscription.service === "luxeflip"
                      ? "/placeholder-logo.png"
                      : "/placeholder-logo.png";

                  return (
                    <Card
                      key={subscription.id}
                      className="relative hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4 w-full">
                          <img
                            src={serviceImage}
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
                  );
                })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
