"use client";

import { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UserStatusBadge } from "@/components/Users/UserStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiService } from "@/lib/api-service";
import { Coins, CreditCard, Package, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface UserDetailsCardProps {
  user: any;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [creditsOptions, setCreditsOptions] = useState<any[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const router = useRouter();
    const { user: loggedUser } = useAuth();

  if (!loggedUser) {
    console.error("No logged in user found!");
    return null; // Or render a loading state
  }

  const hasAuthenticatorRole = user.roles?.some(
    (role: any) => role.name === "authenticator"
  );

  useEffect(() => {
    if (showModal) {
      apiService.getAllCredits().then((res: any) => {
        const data = res?.data ?? res;
        setCreditsOptions(data || []);
      });
    }
  }, [showModal]);

  // choose icon based on package name
  const getIcon = (name: string) => {
    if (!name) return <Coins className="w-8 h-8 text-primary mr-4" />;
    const lower = name.toLowerCase();
    if (lower.includes("starter")) return <Gift className="w-8 h-8 text-primary mr-4" />;
    if (lower.includes("basic")) return <Package className="w-8 h-8 text-primary mr-4" />;
    if (lower.includes("standard")) return <CreditCard className="w-8 h-8 text-primary mr-4" />;
    return <Coins className="w-8 h-8 text-primary mr-4" />;
  };

  return (
    <>
      <Card className="mb-6 shadow-lg rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Information</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Overview of user details and account status
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
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

          {hasAuthenticatorRole && user.authenticator_credits && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Credits:</span>
              <span>
                <strong>{user.authenticator_credits.credits}</strong> authentication(s)
              </span>

              <Button
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-white h-6 px-2 py-0 text-xs rounded-full"
                onClick={() => setShowModal(true)}
              >
                + Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select a Credit Package</DialogTitle>
            <DialogDescription>
              Choose from the available credit packages below to top up your account. 
              Each package includes a set number of authentications.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {creditsOptions.map((credit) => (
              <Card
                key={credit.id}
                className={`cursor-pointer border-2 transition-all ${
                  selectedCredit?.id === credit.id
                    ? "border-primary shadow-md"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedCredit(credit)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  {getIcon(credit.name)}
                  <div className="flex-1">
                    <p className="font-semibold">{credit.name}</p>
                    <p className="text-sm text-green-600">
                      {credit.quantity} authentications
                    </p>
                    {credit.description && (
                      <p className="text-xs text-gray-500 mt-2">
                        {credit.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-bold text-primary">
                      ₱{credit.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                if (!selectedCredit) return alert("Select a package first.");
router.push(`/checkout/credits/${selectedCredit.id}?user=${user.id}&added_by=${loggedUser.id}`);


              }}
              disabled={!selectedCredit}
            >
              Check Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
