import prisma from "../prisma";
import { AppError } from "../errors/app.error";
import { addHours } from "date-fns";

export class TransactionService {
  async createTransaction(
    customerId: number,
    data: {
      eventId: number;
      ticketTypeId: number;
      quantity: number;
    }
  ) {
    const { eventId, ticketTypeId, quantity } = data;

    // Gunakan Prisma Transaction untuk operasi atomik
    return await prisma.$transaction(async (tx) => {
      // 1. Ambil data event dan tiket, lalu kunci record event untuk update
      const event = await tx.event.findFirst({
        where: { id: eventId },
      });

      const ticketType = await tx.ticketType.findFirst({
        where: { id: ticketTypeId, eventId: eventId },
      });

      if (!event || !ticketType) {
        throw new AppError("Event atau jenis tiket tidak ditemukan.", 404);
      }
      if (event.availableSeats < quantity) {
        throw new AppError("Kursi tidak mencukupi.", 400);
      }

      // 2. Hitung total harga dan batas waktu pembayaran
      const baseAmount = ticketType.price * quantity;
      const finalAmount = baseAmount; // Untuk saat ini, tanpa diskon
      const paymentDeadline = addHours(new Date(), 2); // Batas waktu 2 jam dari sekarang

      // 3. Kurangi jumlah kursi yang tersedia di event
      await tx.event.update({
        where: { id: eventId },
        data: { availableSeats: { decrement: quantity } },
      });

      // 4. Buat record transaksi baru
      const newTransaction = await tx.transaction.create({
        data: {
          customerId,
          eventId,
          ticketTypeId,
          quantity,
          baseAmount,
          finalAmount,
          paymentDeadline,
          status: "WAITING_PAYMENT", // Status awal
        },
      });

      return newTransaction;
    });
  }
}
