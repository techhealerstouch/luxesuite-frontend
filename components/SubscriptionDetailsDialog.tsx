"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  CreditCard,
  FileText,
  Download,
  CheckIcon,
} from "lucide-react";
import { Subscription, SubscriptionPlan } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api-service";
import ConfirmDialog from "@/components/ConfirmDialog";

interface SubscriptionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: Subscription | null;
  getStatusColor: (
    status: string
  ) => "default" | "secondary" | "destructive" | "outline";
}

const invoices = [
  { id: "INV-001", date: "Mar 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
];

export function SubscriptionDetailsDialog({
  open,
  onOpenChange,
  subscription,
  getStatusColor,
}: SubscriptionDetailsDialogProps) {
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [duration, setDuration] = useState<"1" | "3" | "6" | "12">("1");
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await apiService.getSubscriptionPlans();
        const plans = response.data;

        if (subscription?.plan?.domain) {
          const filtered = plans
            .filter(
              (plan) =>
                plan.domain === subscription.plan.domain && plan.slug !== "base"
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
        }
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
  }, [open, subscription]);

  function calculatePrice(monthlyPrice: number, duration: number): number {
    return monthlyPrice * duration;
  }

  async function handleSubscription(plan: SubscriptionPlan, duration: string) {
    if (!subscription) return;

    try {
      setIsUpgrading(true);

      // Call API to upgrade subscription
      const upgradedSubscription = await apiService.upgradeSubscription(
        subscription.id.toString(),
        plan.id,
        parseInt(duration)
      );

      toast({
        title: "Plan upgraded",
        description: `You've successfully upgraded to the ${plan.name} plan for ${duration} month(s).`,
      });

      setShowUpgrade(false);
      // Optionally refresh subscription data here if needed
      // e.g. setSubscription(upgradedSubscription);
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Something went wrong upgrading your plan.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  }

  const handleCancel = async () => {
    if (!subscription) return;

    try {
      setIsCancelling(true);
      await apiService.cancelSubscription(subscription.id.toString());

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been successfully cancelled.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the subscription.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full sm:max-w-4xl p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>

          {subscription && !showUpgrade && (
            <div className="space-y-6">
              {/* Current Plan */}
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
                        ₱{subscription.plan.price}/month • Renews on{" "}
                        {subscription.end_date}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setShowUpgrade(true)}
                      >
                        Upgrade Plan
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() => setShowCancelConfirm(true)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel Plan"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-muted-foreground size-4" />
                        <span className="text-muted-foreground text-sm">
                          Visa ending in 4242
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">Update Payment Method</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <h2 className="text-lg font-semibold">Billing History</h2>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 size-4" />
                      Download All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b py-3 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-muted rounded-md p-2">
                            <FileText className="text-muted-foreground size-4" />
                          </div>
                          <div>
                            <p className="font-medium">{invoice.id}</p>
                            <p className="text-muted-foreground text-sm">
                              {invoice.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{invoice.status}</Badge>
                          <span className="font-medium">{invoice.amount}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upgrade Plan View */}
          {subscription && showUpgrade && (
            <div className="space-y-6">
              <Button variant="ghost" onClick={() => setShowUpgrade(false)}>
                ← Back to Subscription Details
              </Button>

              <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
                {["1", "3", "6", "12"].map((m) => (
                  <button
                    key={m}
                    className={`px-4 py-2 rounded-md font-semibold text-sm ${
                      duration === m
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                    onClick={() => setDuration(m as any)}
                  >
                    {m === "1" ? "Monthly" : `${m} Months`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {availablePlans.map((plan) => {
                  const price = calculatePrice(plan.price, parseInt(duration));
                  const isCurrent = plan.name === subscription.plan.name;

                  return (
                    <Card
                      key={plan.id}
                      className={`flex flex-col ${
                        plan.name === "Professional" ? "border-primary" : ""
                      }`}
                    >
                      <CardHeader className="text-center pb-2">
                        {plan.name === "Professional" && (
                          <Badge className="uppercase w-max self-center mb-3">
                            Most popular
                          </Badge>
                        )}
                        <CardTitle className="mb-7">{plan.name}</CardTitle>
                        <span className="font-bold text-2xl sm:text-3xl">
                          ₱{price.toFixed(2)}
                        </span>
                      </CardHeader>
                      <CardDescription className="text-center w-11/12 mx-auto mb-4 text-sm">
                        {plan.features?.[0] ?? "Flexible features"}
                      </CardDescription>
                      <CardContent className="flex-1">
                        <ul className="mt-7 space-y-2.5 text-sm">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex space-x-2">
                              <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                              <span className="text-muted-foreground">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {isCurrent ? (
                          <Button className="w-full" disabled>
                            Current Plan
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant={
                              plan.name === "Professional"
                                ? undefined
                                : "outline"
                            }
                            onClick={() => handleSubscription(plan, duration)}
                            disabled={isUpgrading}
                          >
                            {isUpgrading ? "Upgrading..." : "Subscribe"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? This action cannot be undone."
        confirmText="Yes, Cancel It"
        cancelText="No, Keep It"
        onConfirm={handleCancel}
        loading={isCancelling}
      />
    </>
  );
}
