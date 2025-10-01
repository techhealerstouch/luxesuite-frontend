"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/api/order";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
        <CardDescription>
          Summary of your order and payment status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* General Info */}
        <div>
          <h4 className="text-sm font-semibold mb-2">General Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order #</p>
              <p>{order.invoice_number}</p>
            </div>
            <div>
              <p className="font-medium">Credit Name</p>
              <p>{order.credit_name}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p>{order.status}</p>
            </div>
            <div>
              <p className="font-medium">Date</p>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Info */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Payment Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Shipping</p>
              <p>₱{order.shipping_cost}</p>
            </div>
            <div>
              <p className="font-medium">Total</p>
              <p>₱{order.amount}</p>
            </div>
          </div>

          {order.status === "PENDING" && order.payment_url && (
            <div className="mt-4">
              <Button
                variant="default"
                className="bg-primary text-white w-full sm:w-auto"
                asChild
              >
                <a
                  href={order.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pay Now
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
