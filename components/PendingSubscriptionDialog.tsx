"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PendingSubscriptionDialogProps {
  open: boolean;
  paymentUrl?: string | null;
  onClose: () => void;
}

export function PendingSubscriptionDialog({
  open,
  paymentUrl,
  onClose,
}: PendingSubscriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pending Subscription Exists</DialogTitle>
        </DialogHeader>
        <p className="mb-4">
          You already have a pending subscription for this plan.
          {paymentUrl && (
            <>
              <br />
              Please complete your payment to activate your subscription.
            </>
          )}
        </p>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {paymentUrl && (
            <Button
              onClick={() => {
                window.open(paymentUrl, "_blank");
                onClose();
              }}
            >
              Pay Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
