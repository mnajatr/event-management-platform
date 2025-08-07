import express from "express";
import { updateTransactionStatusBySystem } from "../../controllers/system/transaction.controller";

const router = express.Router();

router.patch("/transactions/:transactionId", updateTransactionStatusBySystem);

export default router;