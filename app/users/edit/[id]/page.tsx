"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { apiService, PermissionApi } from "@/lib/api-service";
import { EditUserDetailsCard } from "@/components/Users/EditUserDetailsCard";
import { EditPermissionsCard } from "@/components/Users/EditPermissionsCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch user details + permissions
useEffect(() => {
  if (!id) return;

  const userId = Array.isArray(id) ? id[0] : id;

  const fetchUser = async () => {
    try {
const user = await apiService.getUserById(userId); 

      const userPerms: PermissionApi[] = await apiService.getUserPermissions(userId);

      const initialPermissions: { [key: string]: boolean } = {};
      (userPerms || []).forEach((perm) => {
        if (perm?.name) initialPermissions[perm.name] = true;
      });
      setPermissions(initialPermissions);

      setUserDetails({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Fetch user error:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  fetchUser();
}, [id, toast]);


  const handleSubmit = async () => {
    if (
      userDetails.password &&
      userDetails.password !== userDetails.confirmPassword
    ) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.updateUserWithPermissions(id as string, {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password || undefined, // only send if provided
        permissions: Object.keys(permissions).filter((key) => permissions[key]),
      });

      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
      });

      router.push("/users");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Edit Sub User</CardTitle>
            <CardDescription>
              Update details and manage permissions for this sub user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fetching ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                <EditUserDetailsCard
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                />
                <EditPermissionsCard
                  permissions={permissions}
                  setPermissions={setPermissions}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update User"
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
