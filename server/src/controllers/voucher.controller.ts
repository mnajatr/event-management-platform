import { Request, Response, NextFunction } from "express";
import { createVoucherSchema } from "../validators/voucher.validator";
import { VoucherService } from "../services/voucher.service";
import { AppError } from "../errors/app.error";

const voucheService = new VoucherService();

export class VoucherController {
  async createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createVoucherSchema.parse(req.body);

      const organizerId = 1; // nanti akan diganti

      const newVoucher = await voucheService.createVoucher(
        organizerId,
        validatedData
      );

      res.status(201).json({
        message: "Voucher berhasil dibuat!",
        data: newVoucher,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVouchersByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = Number(req.params.eventId);
      if (isNaN(eventId)) {
        throw new AppError("Event ID tidak valid.", 400);
      }

      const vouchers = await voucheService.findVouchersByEventId(eventId);

      res.status(200).json({
        message: "Voucher berhasil diambil.",
        data: vouchers,
      });
    } catch (error) {
      next(error);
    }
  }
}
