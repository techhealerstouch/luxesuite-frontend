import { User, CreditCard, Settings, Building, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User as UserType } from "@/types/api/user";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: "account" | "subscription" | "orders" | "settings") => void;
  user?: UserType;
}

export function Sidebar({
  activeSection,
  setActiveSection,
  user,
}: SidebarProps) {
  // Sidebar buttons configuration
  const sections = [
    { id: "account", label: "Account Information", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "orders", label: "Orders", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <>
      {/* User Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user?.account?.name}</span>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-0">
          <nav className="space-y-1">
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <Button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`
                    w-full justify-start
                    rounded-md
                    transition-colors
                    ${
                      isActive
                        ? "bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(var(--secondary))]"
                        : "bg-transparent text-[hsl(var(--white))] hover:bg-[hsl(var(--secondary))] hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`mr-2 h-4 w-4 ${
                      isActive
                        ? "text-white" // icon stays primary when active
                        : "text-[hsl(var(--primary))] group-hover:text-white" // icon changes only on hover when not active
                    }`}
                  />

                  {label}
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </>
  );
}
