"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { apiService } from "@/lib/api-service";

interface PaymentMethodCardProps {
  subscriptionId: string;
  last4?: string;
}

export default function PaymentMethodCard({ subscriptionId, last4 = "4242" }: PaymentMethodCardProps) {
  
  const handleUpdatePaymentMethod = async () => {
    try {
      const { url } = await apiService.addNewPaymentMethod(subscriptionId);
      if (url) {
        window.location.href = url; // redirect user to Xendit account linking
      } else {
        alert("Failed to get account linking URL");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <div className="flex items-center gap-2">
              <CreditCard className="text-muted-foreground size-4" />
              <span className="text-muted-foreground text-sm">
                Visa ending in {last4}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={handleUpdatePaymentMethod}>
            Update Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
