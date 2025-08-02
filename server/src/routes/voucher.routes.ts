import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";

const voucherRouter = Router();
const voucherController = new VoucherController();

voucherRouter.post("/", voucherController.createVoucher);

export default voucherRouter;
