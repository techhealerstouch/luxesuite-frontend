"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserStatusBadge } from "@/components/Users/UserStatusBadge";

interface UserDetailsCardProps {
  user: any;
}

export function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <Card className="mb-6 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Details</CardTitle>
        <CardDescription>Basic information and account details of the user.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Name:</span> {user.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Role:</span>{" "}
          {user.roles?.map((role: any) =>
            role.name === "main_user"
              ? "Main User"
              : role.name === "sub_user"
              ? "Sub User"
              : role.name === "authenticator"
              ? "Authenticator"
              : role.name
          ).join(", ")}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <UserStatusBadge status={user.status} />
        </div>
        <div>
          <span className="font-medium">Service:</span> {user.service || "-"}
        </div>
      </CardContent>
    </Card>
  );
}
