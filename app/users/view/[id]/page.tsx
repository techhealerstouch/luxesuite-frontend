"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { apiService } from "@/lib/api-service";
import { UserDetailsCard } from "@/components/Users/UserDetailsCard";
import { UserProductsCard } from "@/components/Users/UserProductsCard";
import { AuthenticatorProductsCard } from "@/components/Users/Authenticator/AuthenticatorProductsCard";

export default function ViewUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

useEffect(() => {
  if (id) {
    const fetchUser = async () => {
      try {
        const response = await apiService.getUserById(id as string);
        setUser(response); // <-- fix here
      } catch (error: any) {
        console.error("Fetch user error:", error);
      }
    };

    fetchUser();
  }
}, [id]);

if (!id || Array.isArray(id)) return <p>User ID is invalid</p>;

  if (!user) return <p className="p-4">Loading user...</p>;

  const hasRole = (roleName: string) =>
    user?.roles?.some((role: any) => role.name === roleName);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <UserDetailsCard user={user} />

          {hasRole("sub_user") && <UserProductsCard />}
          {hasRole("authenticator") && <AuthenticatorProductsCard userId={id} />}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
