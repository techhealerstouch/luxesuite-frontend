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
  Package
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border text-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Desktop Logo */}
            <div className="hidden md:flex items-center">
              <Link href="/dashboard">
                <Image
                  src="/Luxe Vip-06.svg"
                  alt="Luxe Suite Logo"
                  width={150}
                  height={100}
                  priority
                />
              </Link>
            </div>

            {/* Mobile Logo (Triggers Sheet) */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent focus-visible:ring-0"
                  >
                    <Image
                      src="/Luxe Vip-08.svg"
                      alt="Menu Logo"
                      width={50}
                      height={50}
                      priority
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  {/* Logo inside Sheet */}
                  <div className="mb-6">
                    <Image
                      src="/Luxe Vip-06.svg"
                      alt="Luxe Suite Logo"
                      width={150}
                      height={100}
                      priority
                    />
                  </div>
                  {/* Navigation */}
                  <nav className="flex flex-col space-y-2">
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
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Navigation */}
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
                    href="/account?section=settings"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <Settings className="mr-2 h-4 w-4 text-primary" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account?section=subscription"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-primary" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/account?section=orders"
                    className="cursor-pointer text-primary hover:text-accent"
                  >
                    <Package className="mr-2 h-4 w-4 text-primary" />
                    Orders
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
