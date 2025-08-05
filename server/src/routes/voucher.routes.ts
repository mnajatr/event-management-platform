import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../generated/prisma";

const voucherRouter = Router();
const voucherController = new VoucherController();

const organizerOnly = [authMiddleware, roleMiddleware([UserRole.ORGANIZER])];

// POST /api/vouchers -> Membuat vouchers baru
voucherRouter.post("/", organizerOnly, voucherController.createVoucher);

// GET /api/event/:eventId -> Mendapatkan detail satu vouchers
voucherRouter.get("/event/:eventId", voucherController.getVouchersByEventId);

export default voucherRouter;
