"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api-service";
import { useForm } from "react-hook-form";

interface CreateUserDialogProps {
  onUserCreated?: () => void;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  onUserCreated,
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    mode: "onTouched",
  });

const onSubmit = async (data: FormValues) => {
  setLoading(true);
  try {
    await apiService.createSubUser(data);

    toast({ title: "Success", description: "Sub user created successfully" });
    setOpen(false);
    reset();
    onUserCreated?.();
  } catch (err) {
    toast({
      title: "Error",
      description: (err as Error).message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white">+ Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Sub User
          </DialogTitle>
        </DialogHeader>
        <Card>
          <CardHeader>
            <CardTitle>Sub User Creation</CardTitle>
            <CardDescription>
              Fill in the details below to create a new sub user for the
              LuxOffice service.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 mt-2">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full text-white"
          >
            {loading ? "Creating..." : "Create Sub User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
