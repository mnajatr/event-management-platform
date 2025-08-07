import prisma from "../prisma";
import { TransactionStatus } from "../../src/generated/prisma"; // enum di Prisma-mu

export class OrganizerService {
  async getRevenueSummary(organizerId: number) {
    // 1. Hitung total event
    const totalEvents = await prisma.event.count({
      where: {
        organizerId,
      },
    });

    // 2. Hitung total transaksi sukses (PAID atau COMPLETED)
    const successfulTransactions = await prisma.transaction.findMany({
      where: {
        event: {
          organizerId,
        },
        status: {
          in: [TransactionStatus.PAID, TransactionStatus.COMPLETED],
        },
      },
      select: {
        finalAmount: true,
      },
    });

    const totalRevenue = successfulTransactions.reduce(
      (acc, trx) => acc + trx.finalAmount,
      0
    );

    return {
      totalEvents,
      successfulTransactions: successfulTransactions.length,
      totalRevenue,
    };
  }
}