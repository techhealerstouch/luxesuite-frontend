import { User, CreditCard, Settings, Building } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { User as UserType } from "@/lib/api-service"

interface SidebarProps {
  activeSection: string
  setActiveSection: (section: "account" | "subscription" | "settings") => void
  user?: UserType
}

export function Sidebar({ activeSection, setActiveSection, user }: SidebarProps) {
  return (
    <>
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

      <Card>
        <CardContent className="p-0">
          <nav className="space-y-1">
            <Button
              variant={activeSection === "account" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("account")}
            >
              <User className="mr-2 h-4 w-4" />
              Account Information
            </Button>
            <Button
              variant={activeSection === "subscription" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("subscription")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Subscription
            </Button>
            <Button
              variant={activeSection === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </CardContent>
      </Card>
    </>
  )
}
