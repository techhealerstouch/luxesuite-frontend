"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  User,
  Settings,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";


const currencies = ["PHP", "USD", "EUR"];


export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { currency, setCurrency } = useCurrency();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: User },
    { name: "Become Authenticator", href: "/authenticator/apply", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with primary background */}
      <header className="bg-white shadow-sm border-b border-border text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <Image
                  src="/Luxe Vip-06.svg"
                  alt="Luxe Suite Logo"
                  width={150} // adjust width as needed
                  height={100} // adjust height as needed
                  priority // optional: loads faster
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-primary hover:text-primary hover:bg-primary/20"
                }`}
                  >
                    <Icon className="mr-2 h-4 w-4 text-primary" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Currency Dropdown */}
          <div className="mr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{currency}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount>
                {currencies.map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setCurrency(c)}>
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  className="relative h-8 w-8 rounded-full bg-secondary text-primary"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-primary">{user?.name}</p>
                    {/* <p className="w-[200px] truncate text-primary">
                      {user?.email}
                    </p> */}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <User className="mr-2 h-4 w-4 text-primary" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-primary" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="mr-2 h-4 w-4 text-destructive" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
