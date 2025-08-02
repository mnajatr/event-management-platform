import { z } from "zod";

export const createVoucherSchema = z
  .object({
    eventId: z.number().int().positive("Event ID harus valid."),
    voucherCode: z.string().min(5, "Kode voucher minimal 5 karakter"),
    discountValue: z.number().int().positive("Nilai diskon harus lebih dari 0"),
    usageLimit: z.number().int().positive("Batas pemakaian harus lebih dari 0"),
    startDate: z.iso.datetime(),
    endDate: z.iso.datetime(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Tanggal berakhir harus setelah tanggal mulai.",
    path: ["endDate"],
  });
