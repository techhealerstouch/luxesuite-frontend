"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CheckIcon, Plus } from "lucide-react";
import { useState } from "react";  // ✅ add this
import { apiService } from "@/lib/api-service"; // adjust path if needed
import { useToast } from "@/hooks/use-toast";

export default function FreeTrialPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
const handleActivatePlan = async () => {
  try {
    setLoading(true);

    await apiService.createTrialSubscription();

    toast({
      title: "Trial Activated 🎉",
      description: "Your 1 month trial has started.",
    });

    // Delay redirect so toast is visible
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

  } catch (error: any) {
    console.error("Failed to activate trial:", error);
    toast({
      variant: "destructive",
      title: "Activation Failed",
      description: error.response?.data?.message || "Something went wrong.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex h-full items-center justify-center bg-white pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <Card className="shadow-xl rounded-2xl border border-gray-200">
              <CardHeader className="text-center space-y-3">
                <div className="flex justify-center">
                  <Rocket className="h-12 w-12 text-secondary-600" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Start Your Free Trial
                </CardTitle>
                <CardDescription>
                  Unlock premium features and manage your users without limits.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-center">
                <p className="text-gray-600">
                  Enjoy{" "}
                  <span className="font-semibold text-secondary-600">
                    1 month free
                  </span>{" "}
                  — no credit card required. Upgrade anytime to continue
                  enjoying all features.
                </p>
                <div className="bg-white-50 border border-white-100 rounded-xl p-4 text-sm text-primary-700">
                  <span className="font-semibold text-gray-900">
                    Trial Features
                  </span>
                  <ul className="mt-2 space-y-2.5 text-sm w-fit mx-auto">
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">
                        Create up to 2 sub users
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">
                        Create up to 100 products
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">
                        Access to Luxe Database
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckIcon className="flex-shrink-0 mt-0.5 h-4 w-4" />
                      <span className="text-muted-foreground">
                        Access to Luxe Flips
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleActivatePlan}
                  disabled={loading}
                >
                  {loading ? (
                    "Activating..."
                  ) : (
                    <>
                      Activate Free Trial
                    </>
                  )}
                </Button>

                {/* <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  Maybe Later
                </Button> */}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
