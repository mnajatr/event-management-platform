import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/, "Harus ada huruf kecil")
    .regex(/[A-Z]/, "Harus ada huruf besar")
    .regex(/[0-9]/, "Harus ada angka")
    .regex(/[^a-zA-Z0-9]/, "Harus ada simbol"),
  fullName: z.string().min(3),
  referralCode: z.string().optional(), 
});