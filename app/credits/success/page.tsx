"use client";

import Image from "next/image";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CreditsSuccessPage() {
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

            {/* Success Checkmark */}
            <CheckCircle className="w-16 h-16 text-green-500" />

            {/* Success Message */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center">
              Order paid successfully
            </h2>
            <p className="text-gray-500 text-center">
              You have successfully paid your order
            </p>

            {/* Redirect Button */}
            <Link href="/dashboard" passHref>
              <Button className="w-full mt-4">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
