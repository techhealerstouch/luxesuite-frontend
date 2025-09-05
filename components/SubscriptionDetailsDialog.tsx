"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Subscription, SubscriptionPlan } from "@/types/api/subscription";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api-service";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Invoice } from "@/types/api/invoice";

// Components
import CurrentPlanCard from "@/components/Subscription/CurrentPlanCard";
import PaymentMethodCard from "@/components/Subscription/PaymentMethodCard";
import BillingHistoryCard from "@/components/Subscription/BillingHistoryCard";
import UpgradePlanView from "@/components/Subscription/UpgradePlanView";

interface SubscriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  getStatusColor: (
    status: string
  ) => "default" | "secondary" | "destructive" | "outline";
}

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
  getStatusColor,
}: SubscriptionDetailsDialogProps) {
  const { toast } = useToast();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!subscription) return;
      try {
        setIsLoadingPlans(true);
        const response = await apiService.getSubscriptionPlans();
        const plans = response.data;

        const filtered = plans
          .filter(
            (p) => p.domain === subscription.plan.domain && p.slug !== "base"
          )
          .map((plan) => ({
            ...plan,
            price: parseFloat(plan.price),
            features: [
              `Sub-user limit: ${plan.sub_user_limit}`,
              `Product limit: ${plan.product_limit}`,
            ],
          }));

        setAvailablePlans(filtered);
      } catch (error) {
        toast({
          title: "Failed to load plans",
          description: "Unable to fetch subscription plans.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    if (open && subscription) fetchPlans();
  }, [open, subscription, toast]);

  const [billingHistory, setBillingHistory] = useState<Invoice[]>([]);
  const [isLoadingBilling, setIsLoadingBilling] = useState(false);

  useEffect(() => {
    const fetchBilling = async () => {
      if (!subscription) return;
      try {
        setIsLoadingBilling(true);
        const data = await apiService.getBillingHistory(
          subscription.id.toString()
        );
        console.log("Data getBillingHistory", data);

        setBillingHistory(data);
      } catch (err) {
        toast({
          title: "Failed to load billing history",
          description: "Unable to fetch invoices.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBilling(false);
      }
    };

    if (open && subscription) fetchBilling();
  }, [open, subscription, toast]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full sm:max-w-4xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>

          {subscription && !showUpgrade && (
            <div className="space-y-6">
              <CurrentPlanCard
                subscription={subscription}
                getStatusColor={getStatusColor}
                billingHistory={billingHistory} // <- pass invoices here
                onUpgrade={() => setShowUpgrade(true)}
                onCancel={() => setShowCancelConfirm(true)}
              />

              {/* <PaymentMethodCard subscriptionId={subscription.id.toString()} /> */}
              <BillingHistoryCard
                invoices={billingHistory}
                isLoading={isLoadingBilling}
              />
            </div>
          )}

          {subscription && showUpgrade && (
            <UpgradePlanView
              subscription={subscription}
              availablePlans={availablePlans}
              onBack={() => setShowUpgrade(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
