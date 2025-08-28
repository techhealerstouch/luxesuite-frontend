import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { apiService } from "@/lib/api-service";
import { format, toZonedTime } from "date-fns-tz";

interface AccountSectionProps {
  formData: {
    name: string;
    email: string;
    phone_number?: string;
    timezone: string;
    account: { name: string; slug: string };
  };
  
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

type TimezoneOption = {
  value: string;
  label: string;
};

export function AccountSection({
  formData,
  setFormData,
  onSubmit,
  isSaving,
}: AccountSectionProps) {
  const [timezones, setTimezones] = useState<TimezoneOption[]>([]);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [timezonesLoaded, setTimezonesLoaded] = useState(false);

  // Fetch timezones only once on component mount
  useEffect(() => {
    async function fetchTimezones() {
      try {
        const res = await apiService.getTimezones();
        setTimezones(res);
        setTimezonesLoaded(true);
      } catch (error) {
        console.error('Failed to fetch timezones:', error);
        setTimezonesLoaded(true); // Still mark as loaded to avoid infinite loading
      }
    }
    fetchTimezones();
  }, []);

  // Set default timezone only after timezones are loaded and if user doesn't have one
  useEffect(() => {
    if (timezonesLoaded && timezones.length > 0 && !formData.timezone) {
      // Try to detect user's timezone first, fallback to first option
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const matchingTimezone = timezones.find(tz => tz.value === userTimezone);
      
      const defaultTimezone = matchingTimezone ? userTimezone : timezones[0].value;
      setFormData(prev => ({ ...prev, timezone: defaultTimezone }));
    }
  }, [timezonesLoaded, timezones, formData.timezone, setFormData]);

  // Update current time every second
  useEffect(() => {
    if (!formData.timezone) return;

    const updateTime = () => {
      try {
        const now = new Date();
        const zonedDate = toZonedTime(now, formData.timezone);
        const datePart = format(zonedDate, "MMMM d, yyyy");
        const timePart = format(zonedDate, "hh:mm a");

        const offsetMinutes = zonedDate.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetRemainMinutes = Math.abs(offsetMinutes) % 60;
        const sign = offsetMinutes <= 0 ? "+" : "-";
        const gmtString = `GMT${sign}${offsetHours}${
          offsetRemainMinutes > 0 ? `:${offsetRemainMinutes.toString().padStart(2, '0')}` : ""
        }`;

        setCurrentTime(
          `${datePart} ${timePart} ${formData.timezone} ${gmtString}`
        );
      } catch (error) {
        console.error('Error formatting time:', error);
        setCurrentTime("Invalid timezone");
      }
    };

    // Update immediately
    updateTime();

    // Set up interval
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [formData.timezone]);

  const selectedTimezoneLabel = timezones.find(
    tz => tz.value === formData.timezone
  )?.label ?? "Select timezone";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (id === "businessName" || id === "slug") {
      setFormData((prev) => ({
        ...prev,
        account: {
          ...prev.account,
          [id === "businessName" ? "name" : "slug"]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleTimezoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, timezone: value }));
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Manage your personal and business details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name, Email, Business, Slug */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                type="text"
                value={formData.account.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                type="text"
                value={formData.account.slug}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number || ""}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Timezone Select */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={!timezonesLoaded}
                  >
                    {!timezonesLoaded ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading timezones...
                      </>
                    ) : (
                      <>
                        {selectedTimezoneLabel}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup>
                      {timezones.map(tz => (
                        <CommandItem
                          key={tz.value}
                          onSelect={() => handleTimezoneChange(tz.value)}
                          className={cn(
                            formData.timezone === tz.value ? "bg-blue-100 font-semibold" : ""
                          )}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.timezone === tz.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {tz.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Current Time Display */}
              {currentTime && (
                <div className="mt-2 p-2 bg-gray-100 border border-gray-200 text-gray-800 rounded text-sm font-mono">
                  <span className="text-gray-600">Current time: </span>
                  {currentTime}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}