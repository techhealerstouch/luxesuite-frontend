"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { apiService } from "@/lib/api-service";
import { CreateUserDetailsCard } from "@/components/Users/CreateUserDetailsCard";
import { PermissionsCard } from "@/components/Users/PermissionsCard";
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

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (userDetails.password !== userDetails.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await apiService.createUserWithPermissions({
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password,
        permissions: Object.keys(permissions).filter((key) => permissions[key]),
      });

      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
      });

      router.push("/users");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to create user",
        description: error?.message || "Failed to create user",
        variant: "default",
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
            <CardTitle>Create Sub User</CardTitle>
            <CardDescription>
              Fill out details and assign permissions for the new sub user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CreateUserDetailsCard
              userDetails={userDetails}
              setUserDetails={setUserDetails}
            />
            <PermissionsCard
              permissions={permissions}
              setPermissions={setPermissions}
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
