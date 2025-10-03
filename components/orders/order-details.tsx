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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
            Pending
          </span>
        );
      case "PAID":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
            Paid
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
            Expired
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

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
              <p className="font-bold">Order #</p>
              <p>{order.invoice_number}</p>
            </div>
            <div>
              <p className="font-bold">Package</p>
              <p>{order.credit_name}</p>
            </div>
            <div>
              <p className="font-bold">Status</p>
              <p>{getStatusBadge(order.status)}</p>
            </div>
            <div>
              <p className="font-bold">Date</p>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-bold">Added by</p>
              <p>{order.added_by?.name}</p>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-semibold mb-2">Description</h4>
          <p className="text-sm mb-2">
            Authentication credit top up for{" "}
            <strong className="text-green-500">{order.user?.email}</strong> for{" "}
            <strong className="text-green-500">{order.quantity}</strong> total
            authentications.
          </p>
        </div>
        <Separator />

        {/* Payment Info */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Payment Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold">Shipping</p>
              <p>₱{order.shipping_cost}</p>
            </div>
            <div>
              <p className="font-bold">Total</p>
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
