import prisma from "../prisma";

export class StatisticService {
  async getDailyStats(organizerId: number, eventId?: number) {
    const today = new Date();
    const days: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const whereClause: any = {
        event: { organizerId },
        status: { in: ["PAID", "COMPLETED"] },
        createdAt: {
          gte: day,
          lt: nextDay,
        },
      };

      if (eventId) {
        whereClause.eventId = eventId;
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        select: { finalAmount: true, quantity: true },
      });

      days.push({
        label: day.toISOString().split("T")[0],
        totalRevenue: transactions.reduce((sum, t) => sum + t.finalAmount, 0),
        attendeeCount: transactions.reduce((sum, t) => sum + t.quantity, 0),
        transactionCount: transactions.length,
      });
    }

    return days;
  }

  async getMonthlyStats(organizerId: number, eventId?: number) {
    const now = new Date();
    const months: any[] = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

      const whereClause: any = {
        event: { organizerId },
        status: { in: ["PAID", "COMPLETED"] },
        createdAt: { gte: date, lt: nextMonth },
      };

      if (eventId) {
        whereClause.eventId = eventId;
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        select: { finalAmount: true, quantity: true },
      });

      months.push({
        label: `${date.getFullYear()}-${date.getMonth() + 1}`,
        totalRevenue: transactions.reduce((sum, t) => sum + t.finalAmount, 0),
        attendeeCount: transactions.reduce((sum, t) => sum + t.quantity, 0),
        transactionCount: transactions.length,
      });
    }

    return months;
  }

  async getYearlyStats(organizerId: number, eventId?: number) {
    const now = new Date();
    const years: any[] = [];

    for (let i = 4; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);

      const whereClause: any = {
        event: { organizerId },
        status: { in: ["PAID", "COMPLETED"] },
        createdAt: { gte: start, lt: end },
      };

      if (eventId) {
        whereClause.eventId = eventId;
      }

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        select: { finalAmount: true, quantity: true },
      });

      years.push({
        label: `${year}`,
        totalRevenue: transactions.reduce((sum, t) => sum + t.finalAmount, 0),
        attendeeCount: transactions.reduce((sum, t) => sum + t.quantity, 0),
        transactionCount: transactions.length,
      });
    }

    return years;
  }
}