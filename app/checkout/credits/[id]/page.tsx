"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiService } from "@/lib/api-service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";

export default function CheckoutCreditsPage() {
  const { id } = useParams();
  const [credit, setCredit] = useState<any>(null);
  const [shipping, setShipping] = useState<any>({
    full_name: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    apiService.getAllCredits().then((res: any) => {
      const data = res?.data ?? res;
      const found = data.find((c: any) => String(c.id) === String(id));
      setCredit(found);
    });
  }, [id]);

  const handleBuyNow = async () => {
    if (!credit) return;
    try {
      const res = await apiService.topUpCredits({
        credit_id: credit.id,
        quantity: credit.quantity,
        shipping,
      });
      const data = res?.data ?? res;
      if (data.success && data.invoice_url) {
        window.open(data.invoice_url, "_blank");
      } else {
        alert("Failed to process checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    }
  };

  if (!credit) return <p>Loading...</p>;

const shippingFee = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? 150);
const total = Number(credit.price) + shippingFee;


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left: Shipping Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
              <CardDescription>
                Please provide accurate information for smooth delivery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.full_name}
                    onChange={(e) =>
                      setShipping({ ...shipping, full_name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="border rounded-md px-3 py-2"
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phones */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="border rounded-md px-3 py-2"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, phone: e.target.value })
                    }
                    placeholder="09XXXXXXXXX"
                  />
                </div>

                {/* Address Section Separator */}
                <div className="col-span-2 border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Address Information
                  </h4>
                </div>

                {/* Street */}
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.street}
                    onChange={(e) =>
                      setShipping({ ...shipping, street: e.target.value })
                    }
                    placeholder="House No., Street Name"
                  />
                </div>

                {/* Barangay */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Barangay</label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.barangay}
                    onChange={(e) =>
                      setShipping({ ...shipping, barangay: e.target.value })
                    }
                  />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.city}
                    onChange={(e) =>
                      setShipping({ ...shipping, city: e.target.value })
                    }
                  />
                </div>

                {/* Province */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Province</label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.province}
                    onChange={(e) =>
                      setShipping({ ...shipping, province: e.target.value })
                    }
                  />
                </div>

                {/* Postal Code */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.postal_code}
                    onChange={(e) =>
                      setShipping({ ...shipping, postal_code: e.target.value })
                    }
                  />
                </div>

                {/* Country */}
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping({ ...shipping, country: e.target.value })
                    }
                    placeholder="Philippines"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right: Package Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your package and charges before confirming.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Package Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{credit.name}</span>
                  <span className="font-medium">₱{credit.price}</span>
                </div>
                {/* Child Items */}
                <div className="ml-4 text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>• Authentications</span>
                    <span>{credit.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• NFC Card</span>
                    <span>{credit.quantity}</span>
                  </div>
                </div>
              </div>

              {/* Fees */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>₱{shippingFee}</span>
              </div>

              {/* Total */}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₱{total}</span>
              </div>

              <Button className="w-full mt-4" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
