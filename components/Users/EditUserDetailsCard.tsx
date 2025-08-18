"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface EditUserDetailsCardProps {
  userDetails: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  setUserDetails: Dispatch<
    SetStateAction<{
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>
  >;
}

export function EditUserDetailsCard({ userDetails, setUserDetails }: EditUserDetailsCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const iconClasses = "w-5 h-5 text-gray-500 hover:text-gray-700 transition-colors";

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Enter user information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name</label>
          <Input
            placeholder="Full Name"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <Input
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <div className="flex items-center relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="pr-10"
              value={userDetails.password}
              onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className={iconClasses} /> : <Eye className={iconClasses} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
          <div className="flex items-center relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="pr-10"
              value={userDetails.confirmPassword}
              onChange={(e) =>
                setUserDetails({ ...userDetails, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              className="absolute right-2"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff className={iconClasses} /> : <Eye className={iconClasses} />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
