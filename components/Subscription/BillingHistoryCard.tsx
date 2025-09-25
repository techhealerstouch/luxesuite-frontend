"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, CreditCard, RefreshCw } from "lucide-react";
import { Invoice } from "@/types/api/invoice";
import { apiService } from "@/lib/api-service";
import { Currency } from "@/components/Currency";
import { useToast } from "@/hooks/use-toast";

interface BillingHistoryCardProps {
  invoices: Invoice[];
  isLoading?: boolean;
  onPaymentSuccess?: () => void;
  onRefresh?: () => void;
}

// Map statuses to badge variants
const statusClasses: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  RETRYING: "bg-red-100 text-red-800",
  FAILED: "bg-red-100 text-red-800",
  SUCCEEDED: "bg-green-100 text-green-800",
  SCHEDULED: "bg-gray-100 text-gray-800",
};

// Map statuses to display text
const statusLabels: Record<string, string> = {
  SUCCEEDED: "Paid",
  SCHEDULED: "Upcoming",
  PENDING: "Pending",
  RETRYING: "Retrying",
  FAILED: "Failed",
};

export default function BillingHistoryCard({
  invoices,
  isLoading,
  onPaymentSuccess,
  onRefresh,
}: BillingHistoryCardProps) {
  const { toast } = useToast();

  const handleAdvancePayment = async (planId: string, cycleId: string) => {
    try {
      const res = await apiService.forceAttempt(planId, cycleId);
      console.log("Advance payment result:", res);

      if (res) {
        toast({
          title: "Payment Success",
          description: "Payment attempted successfully!",
        });
        onPaymentSuccess?.(); // 🔥 trigger refresh
      } else {
        toast({
          title: "Payment Failed",
          description: "Failed to attempt payment.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Billing Cycle</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="size-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" disabled={isLoading}>
            <Download className="mr-2 size-4" />
            Download All
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading invoices...</p>
        ) : invoices.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No billing history found.
          </p>
        ) : (
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
                    <p className="font-medium">{invoice.id.slice(0, 18)}...</p>
                    <p className="text-muted-foreground text-sm">
                      {invoice.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      statusClasses[invoice.status] ||
                      "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[invoice.status] || invoice.status}
                  </span>

                  <Currency
                    amount={Number(invoice.amount.replace(/[^\d.-]/g, ""))}
                    from="PHP"
                  />

                  {invoice.status !== "SUCCEEDED" &&
                    invoice.status !== "CANCELLED" &&
                    invoice.status !== "REFUNDED" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          handleAdvancePayment(invoice.plan_id, invoice.id)
                        }
                      >
                        <CreditCard className="mr-1 size-4" />
                        Pay Now
                      </Button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
