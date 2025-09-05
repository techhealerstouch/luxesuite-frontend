"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency } from "@/components/Currency";
import { apiService } from "@/lib/api-service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";

export default function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [plan, setPlan] = useState<any>(null);
  const [duration, setDuration] = useState<string>(
    searchParams.get("duration") || "3"
  );
  const [couponVisible, setCouponVisible] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const planId = searchParams.get("planId");

  useEffect(() => {
    if (planId) {
      apiService.getSubscriptionPlans().then((res) => {
        const plans = res.data; // ✅ extract array
        const found = plans.find((p: any) => String(p.id) === String(planId));
        setPlan(found);
      });
    }
  }, [planId]);

  const calculatePrice = (basePrice: string | number, months: number) =>
    (typeof basePrice === "string" ? parseFloat(basePrice) : basePrice) *
    months;

  const handleContinue = async () => {
    if (!plan) return;
    const today = new Date();
    const start_date = today.toISOString().split("T")[0];
    const end = new Date(today);
    const durationMonths = parseInt(duration);
    end.setMonth(end.getMonth() + durationMonths);
    const end_date = end.toISOString().split("T")[0];

    const res = await apiService.createSubscription({
      plan_id: plan.id,
      service: plan.domain,
      start_date,
      end_date,
      duration: durationMonths,
      //coupon_code: couponCode || null, // send coupon if applied
    });

    const paymentUrl =
      (res as any).payment_url || (res as any).actions?.[0]?.url;
    if (paymentUrl) {
      window.location.assign(paymentUrl);
    }
  };

  const applyCoupon = () => {
    // Optionally, you can verify the coupon via API
    alert(`Coupon "${couponCode}" applied!`);
  };

  if (!plan) return <p className="text-center mt-10">Loading...</p>;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto p-6">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          {/* Grid for cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>{plan.name} - Luxe Proof</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 font-semibold text-lg flex justify-between items-center">
                  <span>Monthly price</span>
                  <Currency amount={plan.price} from="PHP" />
                  /month
                </div>

                <hr className="my-4 border-gray-300" />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration
                  </label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-gray-500 text-sm mt-2">
                    Renews at <Currency amount={plan.price} from="PHP" />
                    /mo. Cancel anytime.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm divide-y divide-gray-200">
                  <li className="flex justify-between py-2">
                    <span className="text-md">
                      <strong>{plan.name} - Luxe Proof</strong>
                    </span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>Grant access to</span>
                    <span>Luxe DB & Luxe Flips</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>Maximum users</span>
                    <span>{plan.sub_user_limit}</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>Maximum products</span>
                    <span>{plan.product_limit}</span>
                  </li>
                </ul>

                {/* Coupon Section */}
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary px-0 hover:text-primary hover:bg-transparent focus:ring-0"
                    onClick={() => setCouponVisible(!couponVisible)}
                  >
                    Have a coupon code?
                  </Button>

                  {couponVisible && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 flex-1"
                      />
                      <Button size="sm" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="mt-4 font-bold text-lg flex justify-between">
                  <span>Total</span>
                  <Currency
                    amount={calculatePrice(plan.price, parseInt(duration))}
                    from="PHP"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleContinue}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
