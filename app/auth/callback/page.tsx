"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/lib/auth-service";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!;

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleAuth = async () => {
      try {
        localStorage.setItem("justLoggedIn", "true");
        const data = await authService.exchangeAuthorizationCode(code);

        await fetch(`${baseUrl}/api/store-refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: data.refresh_token }),
        });

        localStorage.setItem("accessToken", data.access_token);
        const newToken = await authService.refreshAccessToken();
        localStorage.setItem("accessToken", newToken);

        window.location.href = "/dashboard";
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    handleAuth();
  }, [searchParams, router, baseUrl]);

  return (
    <div className="flex h-screen items-center justify-center flex-col gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
    </div>
  );
}
