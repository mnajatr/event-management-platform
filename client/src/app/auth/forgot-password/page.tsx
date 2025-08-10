"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Mail, ArrowLeft, Copy, CheckCircle2 } from "lucide-react";

import { forgotSchema, ForgotInput } from "@/lib/validators/forgot.schema";
import { requestPasswordReset, ForgotPasswordResponse } from "@/lib/api/auth";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [devLink, setDevLink] = React.useState<string | null>(null);

  const form = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ForgotInput) {
    setDevLink(null);
    try {
      const res = await requestPasswordReset(values.email.trim());
      const body: ForgotPasswordResponse = res.data;

      if (body.data?.dev_link) {
        setDevLink(body.data.dev_link);
        toast.success("Reset link (dev) is shown below.");
      } else {
        toast.success("If the email is registered, we’ve sent a reset link.");
      }

      form.reset();
    } catch (err) {
      const e = err as AxiosError<{ message?: string }>;
      toast.error(e.response?.data?.message ?? "Failed to request reset");
    }
  }

  const handleCopy = async () => {
    if (!devLink) return;
    await navigator.clipboard.writeText(devLink);
    toast.success("Link copied to clipboard");
  };

  // Developer panel (persistent, not a toast)
  const DevPanel = devLink ? (
    <Card className="border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Developer Preview</CardTitle>
        <CardDescription>Only visible in development.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div className="space-y-2 w-full">
            <p className="text-sm break-all">{devLink}</p>
            <div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null;

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-background to-muted/40">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card className="border-muted/60 shadow-lg rounded-2xl">
          <CardHeader className="space-y-2 pb-3">
            <CardTitle className="text-3xl tracking-tight">Forgot password</CardTitle>
            <CardDescription className="text-base">
              Enter your email address. If it’s registered, we’ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-9 h-11"
                            autoComplete="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </Form>

            {DevPanel}
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            {/* Optional secondary action */}
            {/* <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">
              Need help?
            </Link> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}