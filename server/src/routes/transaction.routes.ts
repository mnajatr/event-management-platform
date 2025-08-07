import express from "express";
import {
  getTransactionsByEvent, updateTransactionStatus
} from "../controllers/transaction.controller";
import {
  authMiddleware as verifyToken,
  requireOrganizer,
} from "../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/events/:eventId/transactions",
  verifyToken,
  requireOrganizer,
  getTransactionsByEvent
);

router.patch(
  "/transactions/:transactionId",
  verifyToken,
  requireOrganizer,
  updateTransactionStatus
);

export default router;