import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Subscription, type SubscriptionPlan } from "@/lib/api-service";
import { NewSubscriptionDialog } from "@/components/NewSubscriptionDialog";
import { SubscriptionDetailsDialog } from "@/components/SubscriptionDetailsDialog";

interface SubscriptionSectionProps {
  subscriptions: Subscription[] | null;
  isLoading: boolean;
}

export function SubscriptionSection({
  subscriptions,
  isLoading,
}: SubscriptionSectionProps) {
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          Loading...
        </CardContent>
      </Card>
    );
  }

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "suspended":
        return "destructive";
      case "cancelled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handleSelectPlan = (plan: SubscriptionPlan, durationMonths: number) => {
    console.log("User selected plan:", plan, "for months:", durationMonths);
    // Implement your plan selection logic here
  };

  // Filter out luxeproof and luxeflip services
  const filteredSubscriptions =
    subscriptions?.filter(
      (sub) => sub.service !== "luxeproof" && sub.service !== "luxeflip"
    ) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 sm:gap-0">
          <div>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>
              Manage your subscription and billing information
            </CardDescription>
          </div>
          <NewSubscriptionDialog onSelectPlan={handleSelectPlan} />
        </div>
      </CardHeader>

      <SubscriptionDetailsDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        subscription={selectedSubscription}
        getStatusColor={getStatusColor}
      />

      {/* Subscription List */}
      <CardContent className="space-y-6">
        {filteredSubscriptions.length > 0 ? (
          <>
            {filteredSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                onClick={() => handleViewSubscription(subscription)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleViewSubscription(subscription);
                  }
                }}
                className="border rounded-lg p-4 space-y-4 cursor-pointer hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold text-base sm:text-lg">
                    {subscription.payment_url === "free-trial"
                      ? `Free Trial | ${subscription.service}`
                      : `${subscription.plan?.name ?? "No plan available"} | ${
                          subscription.service
                        }`}
                  </h3>

                  <Badge variant={getStatusColor(subscription.status)}>
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </Badge>
                </div>

                {subscription.features && subscription.features.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      Features Included:
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {subscription.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No active subscription found
            </p>
            <Button className="w-full sm:w-auto">Choose a Plan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
