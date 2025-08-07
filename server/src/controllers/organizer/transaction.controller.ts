import { Request, Response } from "express";
import prisma from "../../prisma";
import { z } from "zod";
import {
  TransactionStatus,
  PointHistoryType,
  PointSource,
} from "../../generated/prisma";
import { sendEmail } from "../../utils/email"; // asumsi kamu punya ini

export const updateTransactionStatusByOrganizer = async (
  req: Request,
  res: Response
) => {
  const { transactionId } = req.params;
  const organizerId = req.user?.id;

  const bodySchema = z.object({
    status: z.enum(["PAID", "CANCELLED"]), // EO hanya bisa ubah ke ini
  });

  try {
    const { status } = bodySchema.parse(req.body);

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
      include: {
        event: true,
        customer: true,
        voucher: true,
        coupon: true,
        ticketType: true,
      },
    });

    if (
      !transaction ||
      !transaction.event ||
      transaction.event.organizerId !== organizerId
    ) {
      return res
        .status(403)
        .json({ message: "Transaction not found or unauthorized" });
    }

    const previousStatus = transaction.status;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update status transaksi
      const updatedTransaction = await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: status as TransactionStatus },
      });

      // 2. Rollback hanya jika baru dibatalkan
      if (
        !["CANCELLED", "EXPIRED"].includes(previousStatus) &&
        status === "CANCELLED"
      ) {
        const ops = [];

        // a. Refund seat → update Event.availableSeats (bukan TicketType lagi)
        ops.push(
          tx.event.update({
            where: { id: transaction.eventId },
            data: {
              availableSeats: { increment: transaction.quantity },
            },
          })
        );

        // b. Refund voucher
        if (transaction.voucherId) {
          ops.push(
            tx.voucher.update({
              where: { id: transaction.voucherId },
              data: {
                usedCount: { decrement: 1 },
              },
            })
          );
        }

        // c. Refund coupon
        if (transaction.couponId) {
          ops.push(
            tx.coupon.update({
              where: { id: transaction.couponId },
              data: {
                isUsed: false,
                usedAt: null,
              },
            })
          );
        }

        // d. Refund points
        if (transaction.pointUsed && transaction.pointUsed > 0) {
          ops.push(
            tx.user.update({
              where: { id: transaction.customerId },
              data: {
                pointsBalance: { increment: transaction.pointUsed },
              },
            })
          );

          ops.push(
            tx.pointHistory.create({
              data: {
                userId: transaction.customerId,
                transactionId: transaction.id,
                pointsAmount: transaction.pointUsed,
                type: PointHistoryType.EARNED,
                source: PointSource.TRANSACTION,
                description: "Refund from cancelled transaction",
              },
            })
          );
        }

        await Promise.all(ops);
      }

      // 3. Kirim email notifikasi
      await sendEmail({
        to: "amalianadhira@gmail.com", // ganti ke customer.email kalau udah siap
        subject: `Your transaction has been ${status}`,
        html: `
          <p>Hi ${transaction.customer.fullName},</p>
          <p>Your transaction for <b>${transaction.event.name}</b> has been <b>${status}</b>.</p>
          ${
            status === "PAID"
              ? "<p>Thank you for your payment! You can now wait for the event schedule.</p>"
              : "<p>Your booking has been cancelled. We hope to see you in other events.</p>"
          }
        `,
      });

      return updatedTransaction;
    });

    return res.json({
      message: "Transaction status updated and rollback (if needed) executed.",
      data: result,
    });
  } catch (err) {
    console.error(
      "Update transaction by EO error:",
      JSON.stringify(err, null, 2)
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactionsByEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const organizerId = req.user?.id;

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event || event.organizerId !== organizerId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const transactions = await prisma.transaction.findMany({
      where: { eventId: Number(eventId) },
      include: { customer: true },
    });

    return res.json({ data: transactions });
  } catch (error) {
    console.error("Get transactions by event error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};