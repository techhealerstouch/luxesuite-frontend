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
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { XCircle, Clock, Info, Loader2 } from "lucide-react"; // ✅ Loader2 for spinner

export default function CheckoutCreditsPage() {
  const { id } = useParams();
  const { toast } = useToast();
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
  const [errors, setErrors] = useState<any>({});
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✅ new loading state

  useEffect(() => {
    apiService.getAllCredits().then((res: any) => {
      const data = res?.data ?? res;
      const found = data.find((c: any) => String(c.id) === String(id));
      setCredit(found);
    });
  }, [id]);

  const validateShipping = () => {
    const newErrors: any = {};
    if (!shipping.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!shipping.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(shipping.email))
      newErrors.email = "Invalid email format";
    if (!shipping.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,11}$/.test(shipping.phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone number";
    if (!shipping.street.trim())
      newErrors.street = "Street address is required";
    if (!shipping.barangay.trim()) newErrors.barangay = "Barangay is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.province.trim()) newErrors.province = "Province is required";
    if (!shipping.postal_code.trim())
      newErrors.postal_code = "Postal code is required";
    if (!shipping.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyNow = async () => {
    setCheckoutError(null);

    if (!credit) return;

    if (!validateShipping()) {
      toast({
        title: "Validation",
        description: "Please input shipping details",
      });
      return;
    }

    setLoading(true); // ✅ start loading

    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("user");
    const addedBy = searchParams.get("added_by");

    try {
      const res = await apiService.topUpCredits({
        user_id: userId ? Number(userId) : undefined,
        added_by: addedBy ? Number(addedBy) : undefined,
        credit_id: credit.id,
        quantity: credit.quantity,
        source: "luxesuite",
        shipping,
      });

      const data = res?.data ? res.data : res;

      if (data.success && data.invoice_url) {
        window.open(data.invoice_url, "_blank");

        setTimeout(() => {
          window.location.href = "/account?section=orders";
        }, 1000);
      } else {
        setCheckoutError(data?.message || "Failed to process checkout.");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        setCheckoutError(err.response.data.message);
      } else if (err?.message) {
        setCheckoutError(err.message);
      } else {
        setCheckoutError("Checkout failed. Please try again.");
      }
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  if (!credit) return <p>Loading...</p>;

  const shippingFee = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? 150);
  const total = Number(credit.price) + shippingFee;

  const renderInput = (
    label: string,
    value: string,
    field: string,
    type = "text",
    placeholder = ""
  ) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        className={`border rounded-md px-3 py-2 ${
          errors[field] ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => setShipping({ ...shipping, [field]: e.target.value })}
        placeholder={placeholder}
      />
      {errors[field] && (
        <span className="text-red-500 text-xs mt-1">{errors[field]}</span>
      )}
    </div>
  );

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
                <div className="col-span-2">
                  {renderInput(
                    "Full Name",
                    shipping.full_name,
                    "full_name",
                    "text",
                    "Enter your full name"
                  )}
                </div>
                {renderInput(
                  "Email",
                  shipping.email,
                  "email",
                  "email",
                  "you@example.com"
                )}
                {renderInput(
                  "Phone Number",
                  shipping.phone,
                  "phone",
                  "tel",
                  "09XXXXXXXXX"
                )}
                <div className="col-span-2 border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Address Information
                  </h4>
                </div>
                <div className="col-span-2">
                  {renderInput(
                    "Street Address",
                    shipping.street,
                    "street",
                    "text",
                    "House No., Street Name"
                  )}
                </div>
                {renderInput("Barangay", shipping.barangay, "barangay")}
                {renderInput("City", shipping.city, "city")}
                {renderInput("Province", shipping.province, "province")}
                {renderInput("Postal Code", shipping.postal_code, "postal_code")}
                <div className="col-span-2">
                  {renderInput(
                    "Country",
                    shipping.country,
                    "country",
                    "text",
                    "Philippines"
                  )}
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
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{credit.name}</span>
                  <span className="font-medium">₱{credit.price}</span>
                </div>
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

              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping Fee</span>
                <span>₱{shippingFee}</span>
              </div>

              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>₱{total}</span>
              </div>

              {checkoutError && (
                <Alert variant="destructive" className="mt-4">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>{checkoutError}</AlertTitle>
                </Alert>
              )}

              {/* ✅ Updated Button */}
              <Button
                className="w-full mt-4"
                onClick={handleBuyNow}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Buy Now"
                )}
              </Button>

              <div className="mt-3 bg-gray-100 text-gray-700 text-xs p-3 rounded-md flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-0.5 text-gray-600" />
                <p>
                  <strong>Reminder:</strong> Payment gateways remain active for
                  only <span className="font-semibold">3 hours</span>. Similarly,
                  NFC card reservations are also held for{" "}
                  <span className="font-semibold">3 hours</span>.
                </p>
              </div>

              <div className="mt-3 bg-gray-100 text-gray-700 text-xs p-3 rounded-md flex items-start space-x-2">
                <Info className="w-4 h-4 mt-0.5 text-gray-600" />
                <p>
                  <strong>What does reserving an NFC card mean?</strong> During
                  checkout, your order will temporarily{" "}
                  <span className="font-semibold">reserve NFC cards</span>. If
                  payment is not completed within{" "}
                  <span className="font-semibold">3 hours</span>, both the
                  reservation and the payment gateway will expire, and you will
                  need to place a new order.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
