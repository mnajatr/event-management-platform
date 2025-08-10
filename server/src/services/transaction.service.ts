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


    return await prisma.$transaction(async (tx) => {
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
      const finalAmount = baseAmount; 
      const paymentDeadline = addHours(new Date(), 2); // Batas waktu 2 jam dari sekarang

      await tx.event.update({
        where: { id: eventId },
        data: { availableSeats: { decrement: quantity } },
      });

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
