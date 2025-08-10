"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validators/login.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { setSession } from "@/utils/auth";
import { AxiosError } from "axios";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await api.post("/auth/login", data);
      const { token, user } = res.data.data;

      setSession(token, user); 
      toast.success("Login success!");
      router.push("/"); 
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Welcome Back!</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex justify-between items-center mb-1">
            <Label htmlFor="password">Password</Label>
            <a
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-2">
          Don’t have an account?{" "}
          <a href="/auth/register" className="underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}