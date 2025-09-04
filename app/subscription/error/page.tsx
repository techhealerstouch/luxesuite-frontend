"use client";

import Image from "next/image";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function SubscriptionErrorPage() {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            {/* Logo */}
            <Image
              src="/Luxe Vip-06.svg"
              alt="Luxe VIP Logo"
              width={300}
              height={300}
              priority
            />

            {/* Error Icon */}
            <XCircle className="w-16 h-16 text-red-500" />

            {/* Error Message */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Something Went Wrong
            </h2>
            <p className="text-gray-500 text-center">
              We couldn’t link your account. Please try again or contact support if the issue persists.
            </p>

            {/* Redirect Button */}
            <Link href="/dashboard" passHref>
              <Button className="w-full mt-4">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
