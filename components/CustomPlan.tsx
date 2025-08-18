// /components/CustomPlan.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CreditCard, Package, Shield, Truck } from "lucide-react";
import {
  type CustomPlanUserLimit,
  type SubscriptionPlan,
} from "@/lib/api-service";

interface CustomPlanProps {
  selectedService: string;
  customLimits: CustomPlanUserLimit[];
  selectedUserLimit: number | null;
  setSelectedUserLimit: (val: number) => void;
  customDuration: "1" | "3" | "6" | "12";
  setCustomDuration: (val: "1" | "3" | "6" | "12") => void;
  basePlan: SubscriptionPlan | undefined;
  handleCustomSubscription: () => void;
}

export function CustomPlan({
  selectedService,
  customLimits,
  selectedUserLimit,
  setSelectedUserLimit,
  customDuration,
  setCustomDuration,
  basePlan,
  handleCustomSubscription,
}: CustomPlanProps) {
  const selectedLimit = customLimits.find((u) => u.count === selectedUserLimit);
  const basePrice = basePlan ? parseFloat(basePlan.price) : 0;
  const userLimitPrice = selectedLimit ? parseFloat(selectedLimit.price) : 0;
  const months = parseInt(customDuration);
  const customTotal = (basePrice + userLimitPrice) * months;

  return (
    <div className="flex gap-4">
      {/* Left Side: Selection */}
      <div className="w-2/5 space-y-4">
        <div>
          <label className="block mb-1 font-medium">User Limit</label>
          <Select onValueChange={(val) => setSelectedUserLimit(parseInt(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select user limit" />
            </SelectTrigger>
            <SelectContent>
              {customLimits.map((limit) => (
                <SelectItem key={limit.id} value={limit.count.toString()}>
                  {limit.count} Users
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <div>
                    <label className="block mb-1 font-medium">
                      Select Service
                    </label>
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

        <div>
          <label className="block mb-1 font-medium">Select Duration</label>
          <Select
            onValueChange={(val) => setCustomDuration(val as any)}
            value={customDuration}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {["1", "3", "6", "12"].map((val) => (
                <SelectItem key={val} value={val}>
                  {val === "1" ? "Monthly" : `${val} Months`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Side: Summary */}
      <div className="w-3/5">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm">
              <span>User Limit</span>
              <span>{selectedUserLimit || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service</span>
              <span>{selectedService || "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Duration</span>
              <span>
                {customDuration === "1"
                  ? "1 Month"
                  : `${customDuration} Months`}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₱{customTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Package className="text-primary h-4 w-4" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="text-primary h-4 w-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck className="text-primary h-4 w-4" />
                <span>Fast delivery</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleCustomSubscription}
              disabled={!selectedUserLimit || !selectedService}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
