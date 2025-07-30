import { z } from "zod";

const categories = [
  "MUSIC",
  "SPORTS",
  "TECHNOLOGY",
  "BUSINESS",
  "EDUCATION",
  "ENTERTAINMENT",
  "FOOD",
  "HEALTH",
  "ART",
  "OTHER",
] as const;

export const createEventSchema = z
  .object({
    name: z.string().min(1, { message: "Nama event tidak boleh kosong." }),
    category: z.enum(categories),
    location: z.string().min(1, { message: "Lokasi tidak boleh kosong." }),
    startDate: z.date({
      message: "Tanggal mulai wajib diisi.",
    }),
    endDate: z.date({
      message: "Tanggal selesai wajib diisi.",
    }),
    description: z
      .string()
      .min(10, { message: "Deskripsi minimal 10 karakter." }),
    basePrice: z
      .string()
      .min(1, { message: "Harga dasar tidak boleh negatif." })
      .refine((val) => !isNaN(Number(val)), {
        message: "Harga harus berupa angka.",
      }),
    totalSeats: z
      .string()
      .min(1, { message: "Jumlah kursi tidak boleh kosong." })
      .refine((val) => !isNaN(Number(val)), {
        message: "Jumlah kursi harus bilangan bulat.",
      }),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Tanggal berakhir harus setelah tanggal mulai.",
    path: ["endDate"],
  });

export type TCreateEventSchema = z.infer<typeof createEventSchema>;

export type TCreateEventPayload = Omit<
  TCreateEventSchema,
  "basePrice" | "totalSeats"
> & {
  basePrice: number;
  totalSeats: number;
};
