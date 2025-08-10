import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";
import { createTransactionSchema } from "../validators/transaction.validator";
import { AppError } from "../errors/app.error";

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

  async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionId = Number(req.params.id);
      const customerId = req.user!.id;

      const transaction = await transactionService.findTransactionById(
        transactionId,
        customerId
      );

      res.status(200).json({
        message: "Detail transaksi berhasil diambil.",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadPaymentProof(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Bukti pembayaran wajib diunggah.", 400);
      }

      const transactionId = Number(req.params.id);
      const customerId = req.user!.id;
      const paymentProofUrl = req.file.path; // URL dari Cloudinary

      const updatedTransaction = await transactionService.addPaymentProof(
        transactionId,
        customerId,
        paymentProofUrl
      );

      res.status(200).json({
        message: "Bukti pembayaran berhasil diunggah.",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  }
}
