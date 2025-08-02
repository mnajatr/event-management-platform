import prisma from "../prisma";
import { Prisma } from "../generated/prisma";
import { AppError } from "../errors/app.error";

export class VoucherService {
  async createVoucher(
    organizerId: number,
    data: Omit<Prisma.VoucherUncheckedCreateInput, "organizerId">
  ) {
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw new AppError("Event tidak ditemukan", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Anda tidak berhak membuat voucher ini.", 403);
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        ...data,
        organizerId,
      },
    });

    return newVoucher;
  }
}
