import prisma from "../prisma";
import { AppError } from "../errors/app.error";
import { addHours } from "date-fns";
import { TransactionStatus } from "../generated/prisma";

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

  async findTransactionById(transactionId: number, customerId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        event: {
          // Sertakan detail event untuk ditampilkan di frontend
          select: { name: true, location: true, startDate: true },
        },
      },
    });

    if (!transaction) {
      throw new AppError("Transaksi tidak ditemukan.", 404);
    }
    // Verifikasi kepemilikan
    if (transaction.customerId !== customerId) {
    }

    return transaction;
  }

  async addPaymentProof(
    transactionId: number,
    customerId: number,
    paymentProofUrl: string
  ) {
    // Pertama, verifikasi kepemilikan transaksi
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction || transaction.customerId !== customerId) {
      throw new AppError("Anda tidak memiliki akses ke transaksi ini.", 403);
    }

    // Pastikan transaksi masih dalam status menunggu pembayaran
    if (transaction.status !== "WAITING_PAYMENT") {
      throw new AppError(
        "Tidak dapat mengunggah bukti untuk transaksi ini.",
        400
      );
    }

    // Update transaksi
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProof: paymentProofUrl,
        status: TransactionStatus.PAID,
        confirmationDeadline: addHours(new Date(), 72), // Batas konfirmasi 3 hari
      },
    });
  }
}
