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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, Plus } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { PendingSubscriptionDialog } from "./PendingSubscriptionDialog";
import { useToast } from "@/hooks/use-toast";
import { CustomPlan } from "@/components/CustomPlan";
import {
  CustomPlanUserLimit,
  SubscriptionPlan,
} from "@/types/api/subscription";
import { Currency } from "@/components/Currency";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/api-service"; // ✅ type import

interface NewSubscriptionDialogProps {
  onSelectPlan?: (plan: SubscriptionPlan, durationMonths: number) => void;
  user: User | null; // ✅ new prop
}

export function NewSubscriptionDialog({
  onSelectPlan,
  user,
}: NewSubscriptionDialogProps) {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [customLimits, setCustomLimits] = useState<CustomPlanUserLimit[]>([]);
  const [selectedService, setSelectedService] = useState("luxeoffice");
  const [duration, setDuration] = useState<"1" | "3" | "6" | "12">("1");
  const [customDuration, setCustomDuration] = useState<"1" | "3" | "6" | "12">(
    "3"
  );
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [pendingPaymentUrl, setPendingPaymentUrl] = useState<string | null>(
    null
  );
  const [showCustom, setShowCustom] = useState(false);
  const [selectedUserLimit, setSelectedUserLimit] = useState<number | null>(
    null
  );
  const { toast } = useToast();
  console.log(user);
  useEffect(() => {
    apiService.getSubscriptionPlans().then((res) => setPlans(res.data));
    apiService.getCustomUserLimit().then((res) => setCustomLimits(res.data));
  }, []);

  const getPlanByName = (name: string) =>
    plans.find(
      (plan) =>
        plan.name.toLowerCase() === name.toLowerCase() &&
        plan.domain === selectedService
    );

  const calculatePrice = (basePrice: string | number, months: number) =>
    (typeof basePrice === "string" ? parseFloat(basePrice) : basePrice) *
    months;

  const tiers = ["Starter", "Professional", "Enterprise"];

  return (
    <>
      <Dialog>
  <DialogTrigger asChild>
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Subscribe
    </Button>
  </DialogTrigger>
        <DialogContent className="max-w-6xl">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>
              {showCustom ? "Customize Your Plan" : "Subscribe to Luxe Office"}
            </DialogTitle>
          </DialogHeader>

          {!showCustom ? (
            <>
              {/* Duration Buttons */}
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
                    {m === "1" ? "1 Month" : `${m} Months`}
                  </button>
                ))}
              </div>

              {/* Subscription Plans */}
              <div className="grid sm:grid-cols-3 gap-6">
                {tiers.map((tier) => {
                  const plan = getPlanByName(tier);
                  if (!plan) return null;
                  const price = calculatePrice(plan.price, parseInt(duration));
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
                        <div className="text-5xl font-bold">
                          <Currency amount={price} from="PHP" />
                        </div>
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
                              Create up to {plan.sub_user_limit || "Unlimited"}{" "}
                              users
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Create up to {plan.product_limit || "Unlimited"}{" "}
                              products
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Access to Luxe Database
                            </span>
                          </li>
                          <li className="flex space-x-2">
                            <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                            <span className="text-muted-foreground">
                              Access to Luxe Flips
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
                            router.push(
                              `/cart?planId=${plan.id}&duration=${duration}&userId=${user?.id}`
                            )
                          }
                        >
                          Select Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Customize Plan */}
              <div className="flex items-center justify-between border rounded-md p-4 mt-6">
                <h2 className="text-lg font-semibold">Customize your plan</h2>
                <Button
                  variant="outline"
                  className="w-fit"
                  onClick={() => setShowCustom(true)}
                >
                  Custom Plan
                </Button>
              </div>
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

              <CustomPlan
                selectedService={selectedService}
                customLimits={customLimits}
                selectedUserLimit={selectedUserLimit}
                setSelectedUserLimit={setSelectedUserLimit}
                customDuration={customDuration}
                setCustomDuration={setCustomDuration}
                basePlan={plans.find(
                  (plan) =>
                    plan.slug === "base" && plan.domain === selectedService
                )}
                handleCustomSubscription={() => {}}
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
