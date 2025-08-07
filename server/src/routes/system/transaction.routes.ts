// routes/system/transaction.route.ts
import express from "express";
import { updateTransactionStatusBySystem } from "../../controllers/system/transaction.controller";
import { systemMiddleware } from "../../middlewares/system.middleware";

const router = express.Router();

router.patch("/transactions/:transactionId", systemMiddleware, updateTransactionStatusBySystem);

export default router;