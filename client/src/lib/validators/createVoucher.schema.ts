import { z } from "zod";

export const createVoucherSchema = z
  .object({
    eventId: z.number().int().positive(),
    voucherCode: z
      .string()
      .min(5, { message: "Kode voucher minimal 5 karakter" }),
    discountValue: z
      .string()
      .min(1, { message: "Nilai diskon tidak boleh kosong." })
      .refine((val) => !isNaN(Number(val)), {
        message: "Nilai diskon harus berupa angka.",
      }),
    usageLimit: z
      .string()
      .min(1, { message: "Batas pemakian tidak boleh kosong." })
      .refine((val) => !isNaN(Number(val)), {
        message: "Batas pemakaian harus bilangan bulat.",
      }),
    startDate: z.date({ message: "Tanggal mulai wajib diisi." }),
    endDate: z.date({ message: "Tanggal berakhir wajib diisi." }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Tanggal berkahir harus setelah tanggal mulai.",
    path: ["endDate"],
  });

export type TCreateVoucherSchema = z.infer<typeof createVoucherSchema>;

export type TCreateVoucherPayload = Omit<
  TCreateVoucherSchema,
  "discountValue" | "usageLimit"
> & {
  discountValue: number;
  usageLimit: number;
};
