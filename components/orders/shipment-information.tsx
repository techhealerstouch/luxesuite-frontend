"use client";

import React, { useState } from "react";
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
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";

export function ShipmentInformation({ order }: { order: Order }) {
  const { toast } = useToast();
  const [shipment, setShipment] = useState(order.shipment);

  if (!shipment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shipment Information</CardTitle>
          <CardDescription>No shipment details available.</CardDescription>
        </CardHeader>
        <CardContent>No shipment information available.</CardContent>
      </Card>
    );
  }

  const steps = [
    { key: "pending", label: "Processing", icon: CheckCircle2 },
    { key: "confirmed", label: "Confirmed", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Home },
  ];

  const currentStepIndex = (() => {
    switch (shipment.status.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -2;
      default:
        return -1;
    }
  })();

  const handleMarkAsDelivered = async () => {
    try {
      const res = await apiService.updateDeliverShipment(shipment.id);
      if (res.success) {
        setShipment({ ...shipment, status: "delivered" });
        toast({
          title: "Shipment Updated",
          description: "The shipment has been marked as delivered.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update shipment status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while updating.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Shipment Information</CardTitle>
          <CardDescription>
            Tracking details and recipient information.
          </CardDescription>
        </div>

        {/* ✅ Only show button if status is shipped */}
        {shipment.status.toLowerCase() === "shipped" && (
        <Button
        onClick={handleMarkAsDelivered}
        className="bg-primary hover:bg-primary/90 text-white"
        >
        Mark as Delivered
        </Button>

        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Shipment Progress Tracker */}
        {shipment.status.toLowerCase() !== "cancelled" ? (
          <div className="overflow-x-auto">
            <div className="flex justify-center mb-4 min-w-max">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <Icon
                        className={`h-6 w-6 ${
                          isActive ? "text-green-500" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs sm:text-sm ${
                          isActive ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 w-12 mx-2 ${
                          index < currentStepIndex
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-red-500 font-semibold">Shipment Cancelled</p>
        )}

        <Separator />

        {/* Recipient Info */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Recipient</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Name</p>
              <p>{shipment.full_name}</p>
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <p>{shipment.phone_number}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Address */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Address</h4>
          <p className="text-sm">
            {shipment.street}, {shipment.city}, {shipment.province},{" "}
            {shipment.postal_code}, {shipment.country}
          </p>
        </div>

        <Separator />

        {/* Courier & Tracking */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Courier Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Courier</p>
              <p>{shipment.courier}</p>
            </div>
            <div>
              <p className="font-medium">Tracking #</p>
              <p>{shipment.tracking_number}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Item */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Item</h4>
          <p className="text-sm">NFC Card {order.quantity} pcs</p>
        </div>
      </CardContent>
    </Card>
  );
}
