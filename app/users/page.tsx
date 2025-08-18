"use client";
import { useEffect, useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import { apiService } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { UserStatusBadge } from "@/components/Users/UserStatusBadge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { CreateUserDialog } from "@/components/Users/CreateUserDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const pageSize = 10; // rows per page

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Card className="shadow-lg rounded-2xl border border-gray-200 p-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Users</CardTitle>
            <CardDescription>
              Manage all users for your account. Search, view, edit, or remove
              users below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search + create */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="border p-2 rounded w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <Button
                  onClick={fetchUsers}
                  disabled={isLoading}
                  className="mt-2 sm:mt-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <CreateUserDialog onUserCreated={fetchUsers} />
            </div>

            {/* Users table */}
            {isLoading ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles
                            ?.map((role: string) =>
                              role === "main_user"
                                ? "Main User"
                                : role === "sub_user"
                                ? "Sub User"
                                : role === "authenticator"
                                ? "Authenticator"
                                : role
                            )
                            .join(", ")}
                        </TableCell>
                        <TableCell className="flex items-center gap-1">
                          <Globe /> {user.service || "-"}
                        </TableCell>
                        <TableCell>
                          <UserStatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/users/view/${user.id}`)
                            }
                          >
                            <Eye />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
