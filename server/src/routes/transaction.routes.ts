import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../generated/prisma";
import { upload } from "../middlewares/upload.middleware";

const transactionRouter = Router();
const transactionController = new TransactionController();

// Hanya customer yang sudah login yang bisa membuat transaksi
const customerOnly = [authMiddleware, roleMiddleware([UserRole.CUSTOMER])];

transactionRouter.post(
  "/",
  customerOnly,
  transactionController.createTransaction
);

transactionRouter.get(
  "/:id",
  customerOnly,
  transactionController.getTransactionById
);

transactionRouter.post(
  "/:id/proof",
  customerOnly,
  upload.single("paymentProof"),
  transactionController.uploadPaymentProof
);

export default transactionRouter;
