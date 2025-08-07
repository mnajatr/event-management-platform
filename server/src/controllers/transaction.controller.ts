import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { createTransactionSchema } from "../validators/transaction.validator";

const transactionService = new TransactionService();

export class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user!.id;
      const validatedData = createTransactionSchema.parse(req.body);
      const transaction = await transactionService.createTransaction(
        customerId,
        validatedData
      );

      res.status(201).json({
        message: "Transaksi berhasil dibuat, menunggu pembayaran.",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }
}
