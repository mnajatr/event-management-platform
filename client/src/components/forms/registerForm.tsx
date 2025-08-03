"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterInput,
} from "@/lib/validators/register.schema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<RegisterInput["role"]>("CUSTOMER");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const { confirmPassword, ...payload } = data;
      await axios.post("http://localhost:8000/api/auth/register", payload);
      toast.success("Register success!");
      router.push("/auth/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message?.toLowerCase();

        if (message?.includes("referral")) {
          toast.error("Referral code is not valid. Please check again.");
        } else {
          toast.error(error.response?.data?.message || "Register failed");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Register failed");
      }
    }
  };

  const roleDescription =
    role === "CUSTOMER"
      ? "As a participant, enjoy access to events, exclusive deals, and secure payments."
      : "As an event organizer, you have robust capabilities to manage events, transactions, and gather feedback from participants.";

  return (
    <div className="w-full max-w-md space-y-6">
      <Tabs
        value={role}
        onValueChange={(val) => {
          setRole(val as RegisterInput["role"]);
          setValue("role", val as RegisterInput["role"]);

          if (val === "ORGANIZER") {
            setValue("referralCode", "");
          }
        }}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="CUSTOMER">Participants</TabsTrigger>
          <TabsTrigger value="ORGANIZER">Organizers</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">
          {role === "CUSTOMER" ? "Participants" : "Organizers"}
        </h2>
        <p className="text-sm text-muted-foreground">{roleDescription}</p>
      </div>
      <div className="min-h-[520px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="mb-2 block">
              Full Name
            </Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="mb-1 block">
              Password
            </Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {role === "CUSTOMER" && (
            <div>
              <Label htmlFor="referralCode" className="mb-2 block">
                Referral Code (optional)
              </Label>
              <Input id="referralCode" {...register("referralCode")} />
              {errors.referralCode && (
                <p className="text-red-500 text-sm">
                  {errors.referralCode.message}
                </p>
              )}
            </div>
          )}

          <input type="hidden" {...register("role")} value={role} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-2">
            Have an account?{" "}
            <a href="/auth/login" className="underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
