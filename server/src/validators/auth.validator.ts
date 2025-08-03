import { z } from "zod";

// REGISTER SCHEMA
export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  referralCode: z.string().optional(),
  role: z.enum(["CUSTOMER", "ORGANIZER"]).default("CUSTOMER"),
});

// CREATE USER SCHEMA
export const createUserSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  profilePicture: z.string().url().optional(),
  role: z.enum(["CUSTOMER", "ORGANIZER"]).optional(),
  referralCode: z.string().optional(),
});

// LOGIN
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// USER RESPONSE
export const userResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullName: z.string(),
  profilePicture: z.string().nullable().optional(),
  role: z.enum(["CUSTOMER", "ORGANIZER"]),
  referralCode: z.string(),
  pointsBalance: z.number(),
  createdAt: z.date(),

  coupons: z
    .array(
      z.object({
        id: z.number(),
        couponCode: z.string(),
        discountValue: z.number(),
        expiresAt: z.date(), // gunakan z.date() kalau kamu parse ke Date di backend
      })
    )
    .optional(),
});


// PASSWORD RESET
export const passwordResetSchema = z.object({
  email: z.string().email(),
});

// PASSWORD UPDATE
export const passwordUpdateSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character"),
});

// TYPES FROM ZOD SCHEMA
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;