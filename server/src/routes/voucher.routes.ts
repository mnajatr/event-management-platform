import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";

const voucherRouter = Router();
const voucherController = new VoucherController();

voucherRouter.post("/", voucherController.createVoucher);
voucherRouter.get("/event/:eventId", voucherController.getVouchersByEventId);

export default voucherRouter;
