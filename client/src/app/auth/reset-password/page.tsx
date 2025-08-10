"use client";

import * as React from "react";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

import { resetSchema, ResetInput } from "@/lib/validators/forgot.schema";
import { submitNewPassword } from "@/lib/api/auth";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const tokenValid = useMemo(() => token.length > 0, [token]);

  const form = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ResetInput) {
    try {
      await submitNewPassword(token, values.password);
      toast.success("Your password has been updated. Please sign in.");
      form.reset();
      router.push("/auth/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const e = err as AxiosError<{ message?: string }>;
        toast.error(e.response?.data?.message ?? "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    }
  }

  // Reusable password field with show/hide
  function PasswordField({
    label,
    placeholder,
    fieldName,
  }: {
    label: string;
    placeholder: string;
    fieldName: "password" | "confirmPassword";
  }) {
    const [show, setShow] = React.useState(false);
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={show ? "text" : "password"}
                  placeholder={placeholder}
                  className="pl-9 pr-9 h-11"
                  autoComplete="new-password"
                  {...field}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-[80vh] w-full bg-gradient-to-b from-background to-muted/40">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Card className="rounded-2xl shadow-lg border-destructive/30">
            <CardHeader>
              <CardTitle className="text-2xl">Invalid reset link</CardTitle>
              <CardDescription>The link is missing or has already expired.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Request a new reset link
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="rounded-2xl shadow-lg border-muted/60">
          <CardHeader className="space-y-2 pb-3">
            <CardTitle className="text-3xl tracking-tight">Set a new password</CardTitle>
            <CardDescription className="text-base">
              Choose a strong password you don’t use elsewhere.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <PasswordField label="New password" placeholder="Your new password" fieldName="password" />

                <div className="text-xs text-muted-foreground -mt-3">
                  • At least 8 characters • 1 uppercase • 1 lowercase • 1 number
                </div>

                <PasswordField
                  label="Confirm password"
                  placeholder="Re-enter your new password"
                  fieldName="confirmPassword"
                />

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isSubmitting || !tokenValid}
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}