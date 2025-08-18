"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  Plus,
  CreditCard,
  Package,
  Shield,
  Truck,
} from "lucide-react";
import {
  apiService,
  type SubscriptionPlan,
  type CustomPlanUserLimit,
} from "@/lib/api-service";
import { PendingSubscriptionDialog } from "./PendingSubscriptionDialog";
import { useToast } from "@/hooks/use-toast";
import { CustomPlan } from "@/components/CustomPlan";

interface NewSubscriptionDialogProps {
  onSelectPlan?: (plan: SubscriptionPlan, durationMonths: number) => void;
}

export function NewSubscriptionDialog({
  onSelectPlan,
}: NewSubscriptionDialogProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [customLimits, setCustomLimits] = useState<CustomPlanUserLimit[]>([]);
  const [selectedService, setSelectedService] = useState("luxeproof");
  const [duration, setDuration] = useState<"1" | "3" | "6" | "12">("3");
  const [customDuration, setCustomDuration] = useState<"1" | "3" | "6" | "12">(
    "3"
  );
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog open state
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(
    null
  );
  const [showCustom, setShowCustom] = useState(false);
  const [selectedUserLimit, setSelectedUserLimit] = useState<number | null>(
    null
  );
  const { toast } = useToast();
  useEffect(() => {
    apiService.getSubscriptionPlans().then((res) => setPlans(res.data));
    apiService.getCustomUserLimit().then((res) => setCustomLimits(res.data));
  }, []);

  const getUniqueServices = () =>
    Array.from(new Set(plans.map((plan) => plan.domain)));
  const filteredPlans = plans.filter((plan) => plan.domain === selectedService);
  const getPlanByName = (name: string) =>
    filteredPlans.find(
      (plan) => plan.name.toLowerCase() === name.toLowerCase()
    );
  const calculatePrice = (basePrice: string | number, months: number) =>
    (typeof basePrice === "string" ? parseFloat(basePrice) : basePrice) *
    months;

  const tiers = ["Starter", "Professional", "Enterprise"];

  const selectedLimit = customLimits.find((u) => u.count === selectedUserLimit);

  const basePlan = plans.find(
    (plan) => plan.slug === "base" && plan.domain === selectedService
  );
  const basePrice = basePlan ? parseFloat(basePlan.price) : 0;
  const userLimitPrice = selectedLimit ? parseFloat(selectedLimit.price) : 0;
  const months = customDuration ? parseInt(customDuration) : 0;
  const customTotal = (basePrice + userLimitPrice) * months;

  const handleSubscription = async (
    plan: SubscriptionPlan,
    duration: string
  ) => {
    const today = new Date();
    const start_date = today.toISOString().split("T")[0];

    const end = new Date(today);
    const durationMonths = parseInt(duration);
    end.setMonth(end.getMonth() + durationMonths);
    const end_date = end.toISOString().split("T")[0];

    try {
      const res = await apiService.createSubscription({
        plan_id: plan.id,
        service: selectedService,
        start_date,
        end_date,
        duration: durationMonths,
      });

      if (res.payment_url) {
        console.log("Payment URL:", res.payment_url);
      }
    } catch (error: any) {
      if (error.status === 409) {
        const paymentUrl = error.data?.payment_url || null;
        setPendingPaymentUrl(paymentUrl);
        setConflictDialogOpen(true);
      } else {
        console.error("Subscription failed:", error);
      }
    }
  };

  const handleCustomSubscription = async () => {
    if (
      !selectedService ||
      !selectedUserLimit ||
      !customDuration ||
      !basePlan
    ) {
      console.warn("Missing data for custom plan");
      return;
    }

    const durationMonths = parseInt(customDuration);
    const userLimitId = parseInt(selectedLimit!.id);
    const basePlanId = parseInt(basePlan.id);

    try {
      const res = await apiService.createCustomSubscription({
        plan_id: basePlanId,
        service: selectedService,
        duration: durationMonths,
        user_limit_id: userLimitId,
      });

      // ✅ Close dialog
      setDialogOpen(false);

      // ✅ Show toast message
      toast({
        title: "Success",
        description: res.message || "Subscription created successfully.",
        variant: "default", // or "success" depending on your toast config
      });

      // ✅ Redirect to payment URL
      if (res.payment_url) {
        setTimeout(() => {
          window.location.href = res.payment_url;
        }, 1000); // slight delay so user sees the toast
      }
    } catch (error: any) {
      if (error.status === 409) {
        const paymentUrl = error.data?.payment_url || null;
        setPendingPaymentUrl(paymentUrl);
        setConflictDialogOpen(true);
      } else {
        console.error("Custom Subscription failed:", error);
        toast({
          title: "Error",
          description: "Something went wrong while creating the subscription.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>
              {showCustom
                ? "Customize Your Plan"
                : "Choose Subscription"}
            </DialogTitle>
          </DialogHeader>

          {!showCustom ? (
            <>
              <div className="flex items-center justify-between border rounded-md p-4 mb-6">
                <h2 className="text-lg font-semibold">Customize your plan</h2>
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={() => setShowCustom(true)}
                >
                  Custom Plan
                </Button>
              </div>

              {/* <div className="mb-4">
                <label className="block mb-1 font-medium">Select Service</label>
                <Select
                  onValueChange={setSelectedService}
                  value={selectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select a Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUniqueServices().map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {!selectedService ? (
                <p className="text-center text-muted-foreground mt-8 text-lg font-medium">
                  Please Select a Service
                </p>
              ) : (
                <>
                  <div className="mb-6 flex justify-center space-x-3">
                    {["1", "3", "6", "12"].map((m) => (
                      <button
                        key={m}
                        className={`px-4 py-2 rounded-md font-semibold ${
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

                  <div className="grid sm:grid-cols-3 gap-6">
                    {tiers.map((tier) => {
                      const plan = getPlanByName(tier);
                      if (!plan) return null;
                      const price = calculatePrice(
                        plan.price,
                        parseInt(duration)
                      );
                      return (
                        <Card
                          key={tier}
                          className={`flex flex-col ${
                            tier === "Professional" ? "border-primary" : ""
                          }`}
                        >
                          <CardHeader className="text-center pb-2">
                            {tier === "Professional" && (
                              <Badge className="uppercase w-max self-center mb-3">
                                Most popular
                              </Badge>
                            )}
                            <CardTitle className="mb-7">{tier}</CardTitle>
                            <span className="font-bold text-5xl">
                              ₱{price.toFixed(2)}
                            </span>
                          </CardHeader>
                          <CardDescription className="text-center w-11/12 mx-auto mb-4">
                            {tier === "Starter"
                              ? "Perfect to get started"
                              : tier === "Professional"
                              ? "Ideal for professionals"
                              : "For large enterprises"}
                          </CardDescription>
                          <CardContent className="flex-1">
                            <ul className="mt-7 space-y-2.5 text-sm">
                              <li className="flex space-x-2">
                                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                                <span className="text-muted-foreground">
                                  User limit:{" "}
                                  {plan.sub_user_limit || "Unlimited"}
                                </span>
                              </li>
                              <li className="flex space-x-2">
                                <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                                <span className="text-muted-foreground">
                                  Product limit:{" "}
                                  {plan.product_limit || "Unlimited"}
                                </span>
                              </li>
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button
                              className="w-full"
                              variant={
                                tier === "Professional" ? undefined : "outline"
                              }
                              onClick={() =>
                                plan && handleSubscription(plan, duration)
                              }
                            >
                              Subscribe
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setShowCustom(false)}
              >
                ← Back
              </Button>

              {/* Custom Plan */}
              <CustomPlan
                selectedService={selectedService}
                customLimits={customLimits}
                selectedUserLimit={selectedUserLimit}
                setSelectedUserLimit={setSelectedUserLimit}
                customDuration={customDuration}
                setCustomDuration={setCustomDuration}
                basePlan={basePlan}
                handleCustomSubscription={handleCustomSubscription}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      <PendingSubscriptionDialog
        open={conflictDialogOpen}
        paymentUrl={pendingPaymentUrl}
        onClose={() => setConflictDialogOpen(false)}
      />
    </>
  );
}
