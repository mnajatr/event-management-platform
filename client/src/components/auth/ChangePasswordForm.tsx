"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordUpdateSchema } from "@/lib/validators/passwordUpdate.schema";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type PasswordFormInput = z.infer<typeof passwordUpdateSchema>;

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormInput>({
    resolver: zodResolver(passwordUpdateSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: PasswordFormInput) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:8000/api/auth/update-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password updated successfully!");
      reset();

      setTimeout(() => {
        router.push("/profile");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-lg">Change Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              type="password"
              id="currentPassword"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
