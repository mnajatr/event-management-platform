import { z } from "zod";

export const forgotSchema = z.object({
  email: z.string().email("Invalid email"),
});
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "At least 1 uppercase")
      .regex(/[a-z]/, "At least 1 lowercase")
      .regex(/[0-9]/, "At least 1 number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type ResetInput = z.infer<typeof resetSchema>;