"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { apiService } from "@/lib/api-service";
import { UserDetailsCard } from "@/components/Users/UserDetailsCard";
import { UserProductsCard } from "@/components/Users/UserProductsCard";

export default function ViewUserPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const user = await apiService.getUserById(id as string);
          setUser(user)
        } catch (error: any) {
          console.error("Fetch user error:", error);
        } finally {
        }
      };

      fetchUser();
    }
  }, [id]);

  if (!user) return <p className="p-4">Loading user...</p>;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <UserDetailsCard user={user} />
          <UserProductsCard />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
