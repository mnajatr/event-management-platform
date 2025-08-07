import { Request, Response } from "express";
import prisma from "../prisma";
import { z } from "zod";
import { TransactionStatus } from "../generated/prisma";

export const getTransactionsByEvent = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const organizerId = req.user?.id;

  if (!organizerId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: Number(eventId),
        organizerId,
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ message: "Event not found or unauthorized" });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        eventId: event.id,
      },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePicture: true,
          },
        },
        ticketType: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTransactionStatus = async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const organizerId = req.user?.id;

  const bodySchema = z.object({
    status: z.enum(["PENDING", "WAITING_PAYMENT", "PAID", "COMPLETED", "CANCELLED", "EXPIRED"]),
  });

  try {
    const { status } = bodySchema.parse(req.body);

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
      include: { event: true },
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

    const updated = await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: {
        status: TransactionStatus[status as keyof typeof TransactionStatus],
      },
    });

    return res.json({
      message: "Transaction status updated",
      data: updated,
    });
  } catch (err) {
    console.error(
      "Update transaction error:",
      err instanceof Error ? err.message : err
    );
    console.error("Raw error:", JSON.stringify(err, null, 2));
    return res.status(500).json({ message: "Internal server error" });
  }
};
