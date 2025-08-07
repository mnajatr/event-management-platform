import { Request, Response } from "express";
import prisma from "../../prisma";
import { z } from "zod";
import { TransactionStatus } from "../../generated/prisma";

export const updateTransactionStatusBySystem = async (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const bodySchema = z.object({
    status: z.enum([
      "WAITING_PAYMENT",
      "COMPLETED",
      "EXPIRED",
      "CANCELLED",
    ]),
  });

  try {
    const { status } = bodySchema.parse(req.body);

    const transaction = await prisma.transaction.findUnique({
      where: { id: Number(transactionId) },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updated = await prisma.transaction.update({
      where: { id: Number(transactionId) },
      data: { status: status as TransactionStatus },
    });

    return res.json({
      message: "Transaction status updated by system",
      data: updated,
    });
  } catch (err) {
    console.error("System update error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};