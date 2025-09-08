"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserStatusBadge } from "@/components/Users/UserStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api-service"; // adjust path if needed

interface UserDetailsCardProps {
  user: any;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const hasAuthenticatorRole = user.roles?.some(
    (role: any) => role.name === "authenticator"
  );

  const handleTopUp = async () => {
    try {
      const res = await apiService.topUpCredits({
        user_id: user.id,
        credits: parseInt(topUpAmount, 10),
      });

      // If apiService already unwraps .data, use res directly
      const data = res?.data ?? res;

      if (data.success && data.invoice_url) {
        window.open(data.invoice_url, "_blank");
        setShowModal(false);
        setTopUpAmount("");
      } else {
        alert("Failed to create invoice. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Top up failed. Please try again.");
    }
  };

  return (
    <>
      <Card className="mb-6 shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Details</CardTitle>
          <CardDescription>
            Basic information and account details of the user.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium">Role:</span>{" "}
            {user.roles
              ?.map((role: any) =>
                role.name === "main_user"
                  ? "Main User"
                  : role.name === "sub_user"
                  ? "Sub User"
                  : role.name === "authenticator"
                  ? "Authenticator"
                  : role.name
              )
              .join(", ")}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <UserStatusBadge status={user.status} />
          </div>
          <div>
            <span className="font-medium">Service:</span> {user.service || "-"}
          </div>

          {/* Show credits only if roles contain "authenticator" */}
          {hasAuthenticatorRole && user.authenticator_credits && (
<div className="flex items-center gap-2">
  <span className="font-medium">Credits:</span>
  <span>{user.authenticator_credits.credits}</span>

  <Button
    variant="outline"
    className="text-primary border-primary hover:bg-primary hover:text-white h-6 px-2 py-0 text-xs rounded-full"
    onClick={() => setShowModal(true)}
  >
    + Top up
  </Button>
</div>

          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="block text-sm font-medium">Credits</label>
            <Input
              type="number"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter credits amount"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleTopUp}>Top up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
