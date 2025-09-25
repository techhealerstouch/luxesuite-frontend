"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";

export default function CartPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const { toast } = useToast();

  // ✅ read params directly from props (no suspense needed)
  const planId = searchParams.planId;
  const trial = searchParams.trial || "0";
  const [duration, setDuration] = useState<string>(
    searchParams.duration || "3"
  );

  const [plan, setPlan] = useState<any>(null);
  const [couponVisible, setCouponVisible] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (planId) {
      apiService.getSubscriptionPlans().then((res) => {
        const plans = res.data;
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
    setLoading(true);

    try {
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
        trial: trial,
      });

      console.log("✅ API Response:", res);

      const paymentUrl =
        (res as any)?.payment_url || (res as any)?.actions?.[0]?.url;
      if (paymentUrl) {
        toast({
          title: "Redirecting...",
          description: "Taking you to payment page.",
        });
        window.location.assign(paymentUrl);
        return;
      }

      toast({
        title: "Success",
        description: "Subscription created.",
      });
    } catch (err: any) {
      console.error("❌ API Error raw:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        (typeof err === "string" ? err : null) ||
        JSON.stringify(err);

      toast({
        title: "Subscription Error",
        description: message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    alert(`Coupon "${couponCode}" applied!`);
  };

  if (!plan) return <p className="text-center mt-10">Loading...</p>;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

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
                      <strong>
                        {plan.name} - Luxe Proof{" "}
                        {trial === "1" && "(Free Trial)"}
                      </strong>
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

                {/* Hide total if trial */}
                {trial !== "1" && (
                  <div className="mt-4 font-bold text-lg flex justify-between">
                    <span>Total</span>
                    <Currency
                      amount={calculatePrice(plan.price, parseInt(duration))}
                      from="PHP"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleContinue}>
                  {trial === "1" ? "Start Free Trial" : "Continue"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
