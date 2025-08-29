"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function PaymentMethodCard() {
  return (
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
  );
}
