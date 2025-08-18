import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2 } from "lucide-react"

interface AccountSettings {
  notifications: { email: boolean; sms: boolean }
  privacy: { profileVisible: boolean; analyticsEnabled: boolean }
}

interface SettingsSectionProps {
  passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }
  setPasswordData: React.Dispatch<React.SetStateAction<typeof passwordData>>
  onPasswordSubmit: (e: React.FormEvent) => void
  isSaving: boolean
  accountSettings: AccountSettings | null
  onSettingsUpdate: (newSettings: Partial<AccountSettings>) => void
}

export function SettingsSection({
  passwordData,
  setPasswordData,
  onPasswordSubmit,
  isSaving,
  accountSettings,
  onSettingsUpdate,

  
}: SettingsSectionProps) {
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onPasswordSubmit} className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password" },
              { id: "newPassword", label: "New Password" },
              { id: "confirmPassword", label: "Confirm New Password" },
            ].map(({ id, label }) => (
              <div className="space-y-2" key={id}>
                <Label htmlFor={id}>{label}</Label>
                <Input
                  id={id}
                  type="password"
                  value={passwordData[id as keyof typeof passwordData]}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, [id]: e.target.value }))
                  }
                />
              </div>
            ))}

            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {accountSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notifications</h4>
              {["email", "sms"].map((key) => (
                <div className="flex items-center justify-between" key={key}>
                  <Label htmlFor={`${key}-notifications`}>{`${key.toUpperCase()} notifications`}</Label>
                  <Switch
                    id={`${key}-notifications`}
                    checked={accountSettings.notifications[key as keyof typeof accountSettings.notifications]}
                    onCheckedChange={(checked) =>
                      onSettingsUpdate({
                        notifications: { ...accountSettings.notifications, [key]: checked },
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Privacy</h4>
              {[
                { id: "profileVisible", label: "Profile visible to others" },
                { id: "analyticsEnabled", label: "Enable analytics tracking" },
              ].map(({ id, label }) => (
                <div className="flex items-center justify-between" key={id}>
                  <Label htmlFor={id}>{label}</Label>
                  <Switch
                    id={id}
                    checked={accountSettings.privacy[id as keyof typeof accountSettings.privacy]}
                    onCheckedChange={(checked) =>
                      onSettingsUpdate({
                        privacy: { ...accountSettings.privacy, [id]: checked },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
