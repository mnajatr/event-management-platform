import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../generated/prisma";

const transactionRouter = Router();
const transactionController = new TransactionController();

// Hanya customer yang sudah login yang bisa membuat transaksi
const customerOnly = [authMiddleware, roleMiddleware([UserRole.CUSTOMER])];

transactionRouter.post(
  "/",
  customerOnly,
  transactionController.createTransaction
);

export default transactionRouter;
