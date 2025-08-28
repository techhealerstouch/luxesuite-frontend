"use client";
import { useEffect, useState, useMemo } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { DashboardLayout } from "@/components/dashboard-layout";
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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { motion } from "framer-motion";

// 🔹 Skeleton shimmer animation
const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
    </TableCell>
    <TableCell>
      <div className="flex gap-2">
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="h-8 w-8 rounded bg-gray-200 animate-pulse flex-shrink-0" />
      </div>
    </TableCell>
  </TableRow>
);

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const pageSize = 10;

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
              <Button
                onClick={() => router.push(`/users/create`)}
                className="mt-2 sm:mt-0"
              >
                Create User
              </Button>
            </div>

            {/* Users table */}
            <div className="overflow-x-auto w-full">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[18%]">Name</TableHead>
                    <TableHead className="w-[22%]">Email</TableHead>
                    <TableHead className="w-[15%]">Role</TableHead>
                    <TableHead className="w-[15%]">Website</TableHead>
                    <TableHead className="w-[12%]">Status</TableHead>
                    <TableHead className="w-[18%] min-w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonRow key={i} />
                      ))
                    : paginatedUsers.map((user, i) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: i * 0.08,
                              duration: 0.35,
                              ease: "easeOut",
                            },
                          }}
                          className="border"
                        >
                          <TableCell className="w-[18%]">{user.name}</TableCell>
                          <TableCell className="w-[22%]">{user.email}</TableCell>
                          <TableCell className="w-[15%]">
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
                          <TableCell className="w-[15%]">
                            <div className="flex items-center gap-1">
                              <Globe className="flex-shrink-0 h-4 w-4" /> 
                              <span className="truncate">{user.service || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="w-[12%]">
                            <UserStatusBadge status={user.status} />
                          </TableCell>
                          <TableCell className="w-[18%] min-w-[140px]">
                            <div className="flex gap-2 items-center justify-start overflow-hidden">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/users/view/${user.id}`)}
                                className="h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/users/edit/${user.id}`)}
                                className="h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="h-8 w-8 p-0 flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination controls */}
            {!isLoading && totalPages > 1 && (
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
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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