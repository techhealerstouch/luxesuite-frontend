"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const invoices = [
  { id: "INV-001", date: "Mar 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-002", date: "Feb 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-003", date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
];

export default function BillingHistoryCard() {
  return (
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
          {invoices.map(invoice => (
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
                  <p className="text-muted-foreground text-sm">{invoice.date}</p>
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
  );
}
