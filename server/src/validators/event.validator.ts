import { z } from "zod";
import { EventCategory } from "../generated/prisma";

export const createEventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  category: z.enum(EventCategory),
  location: z.string().min(3, "Location is required"),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  basePrice: z.number().int().min(0, "Price cannot be negative"),
  totalSeats: z
    .number()
    .int()
    .positive("Total seats must be a positive numbers"),
});
