"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Package } from "lucide-react";
import { Subscription, SubscriptionPlan } from "@/types/api/subscription";
import { apiService } from "@/lib/api-service";
import { Invoice } from "@/types/api/invoice";
import { Currency } from "@/components/Currency";
import { format } from "date-fns";

interface CurrentPlanCardProps {
  subscription: Subscription;
  getStatusColor: (
    status: string
  ) => "default" | "secondary" | "destructive" | "outline";
  onUpgrade: () => void;
  onCancel: () => void;
}

export default function CurrentPlanCard({
  subscription,
  getStatusColor,
  onUpgrade,
  onCancel,
  billingHistory, // add billingHistory as prop
}: CurrentPlanCardProps & { billingHistory: Invoice[] }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await apiService.cancelSubscription(
        subscription.id.toString()
      );
      console.log("Cancel response:", res);
      window.location.reload();
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter only SCHEDULED invoices
  const nextInvoice = billingHistory.find((inv) => inv.status === "SCHEDULED");

  return (
    <>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Package className="text-primary size-5" />
<h2 className="text-lg font-semibold">
  {subscription.payment_url === "free-trial"
    ? "Free Trial"
    : `${subscription.plan.name} | ${subscription.plan.domain}`}
</h2>

                <Badge variant={getStatusColor(subscription.status)}>
                  {subscription.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">
                <Currency
                  amount={Number(
                    subscription.plan.price.replace(/[^\d.-]/g, "")
                  )}
                  from="PHP"
                />
                /month • Access to Luxe Proof ends on{" "}
                {subscription.end_date
                  ? format(new Date(subscription.end_date), "MMM dd, yyyy")
                  : ""}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Show Pay Now if pending */}
              {subscription.status === "pending" && (
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
              )}

              {/* Show Upgrade + Deactivate if not pending or cancelled */}
              {subscription.status !== "pending" &&
                subscription.status !== "cancelled" &&
                subscription.payment_url !== "free-trial" && (
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
                      onClick={() => setShowDialog(true)}
                    >
                      Deactivate Plan
                    </Button>
                  </>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel your subscription? This action
            cannot be undone. Remaining paid months/cycles will be refunded to the payment method you've linked.
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isCancelling}
            >
              No, Keep Plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
