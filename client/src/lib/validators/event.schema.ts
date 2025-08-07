import { z } from "zod";

export const eventFormSchema = z.object({
name: z.string().min(3, "Name is required"),
description: z.string().min(10, "Description is required"),
category: z.string(),
location: z.string(),
startDate: z.string(), // ISO format dari datetime-local
endDate: z.string(),
basePrice: z.coerce.number().min(0),
availableSeats: z.coerce.number().min(1),
});

export type TEventFormValues = z.infer<typeof eventFormSchema>;