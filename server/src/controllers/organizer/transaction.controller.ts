import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../prisma";
import { TransactionStatus } from "../../generated/prisma";

export const updateTransactionStatusByOrganizer = async (
  req: Request,
  res: Response
) => {
  const { transactionId } = req.params;
  const organizerId = req.user?.id;

  const bodySchema = z.object({
    status: z.enum(["PAID", "CANCELLED"]), // EO hanya bisa ini
  });

  try {
    const { status } = bodySchema.parse(req.body);

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
      include: { event: true },
    });

    if (!transaction || transaction.event.organizerId !== organizerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updated = await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: { status: status as TransactionStatus },
    });

    return res.json({ message: "Status updated by EO", data: updated });
  } catch (error) {
    console.error("EO status update error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactionsByEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const organizerId = req.user?.id;

  try {
    // Cari event milik organizer ini
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event || event.organizerId !== organizerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Ambil semua transaksi untuk event ini
    const transactions = await prisma.transaction.findMany({
      where: { eventId: Number(eventId) },
      include: { customer: true }, // sesuaikan relasi jika perlu
    });

    return res.json({ data: transactions });
  } catch (error) {
    console.error("Get transactions by event error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
