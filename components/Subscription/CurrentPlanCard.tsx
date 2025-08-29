"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { 
  Subscription, 
  SubscriptionPlan, 
} from "@/types/api/subscription";

interface CurrentPlanCardProps {
  subscription: Subscription;
  getStatusColor: (status: string) => "default" | "secondary" | "destructive" | "outline";
  onUpgrade: () => void;
  onCancel: () => void;
}

export default function CurrentPlanCard({
  subscription,
  getStatusColor,
  onUpgrade,
  onCancel,
}: CurrentPlanCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Package className="text-primary size-5" />
              <h2 className="text-lg font-semibold">
                {subscription.plan.name} | {subscription.plan.domain}
              </h2>
              <Badge variant={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              ₱{subscription.plan.price}/month • Renews on {subscription.end_date}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {subscription.status === "pending" ? (
              <Button
                variant="default"
                className="w-full sm:w-auto"
                onClick={() => {
                  if (subscription.payment_url) {
                    window.location.href = subscription.payment_url;
                  }
                }}
              >
                Pay Now
              </Button>
            ) : (
              <>
                <Button
                  variant="default"
                  className="w-full sm:w-auto"
                  onClick={onUpgrade}
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={onCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Plan"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
