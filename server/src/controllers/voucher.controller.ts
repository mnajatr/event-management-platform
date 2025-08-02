import { Request, Response, NextFunction } from "express";
import { createVoucherSchema } from "../validators/voucher.validator";
import { VoucherService } from "../services/voucher.service";

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
}
