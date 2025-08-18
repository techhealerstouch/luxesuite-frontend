"use client";
import { Badge } from "@/components/ui/badge";

interface UserStatusBadgeProps {
  status: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ status }) => {
  let colorClass = "bg-orange-500 text-white"; // default

  if (status === "active") colorClass = "bg-green-500 text-white";
  else if (status === "inactive") colorClass = "bg-red-500 text-white";

  return (
    <Badge className={colorClass}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
