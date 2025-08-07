import { z } from "zod";

export const createTransactionSchema = z.object({
  eventId: z.number().int().positive(),
  ticketTypeId: z.number().int().positive(),
  quantity: z.number().int().positive("Jumlah tiket minimal 1"),
});
