import express from "express";
import {
  authMiddleware,
  requireOrganizer,
} from "../../middlewares/auth.middleware";
import {
  getTransactionsByEvent,
  updateTransactionStatusByOrganizer,
} from "../../controllers/organizer/transaction.controller";

const router = express.Router();

// Route untuk mengambil semua transaksi pada event tertentu
router.get(
  "/events/:eventId/transactions",
  authMiddleware,
  requireOrganizer,
  getTransactionsByEvent
);

// Route untuk update status transaksi
router.patch(
  "/transactions/:transactionId",
  authMiddleware,
  requireOrganizer,
  updateTransactionStatusByOrganizer
);

export default router;
