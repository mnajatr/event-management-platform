import  prisma  from "../prisma";
import { AppError } from "../errors/app.error";
import { generateCouponCode } from "../utils/generated-code";
import { PointHistoryType, PointSource } from "../generated/prisma/index.js";

export class ReferralService {
  async applyReferral(
    referralCode: string,
    newUserId: number,
    newUserFullName: string
  ): Promise<void> {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) {
      throw new AppError("Referral code not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      const threeMonthsFromNow = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30 * 3 // 3 months
      );

      // Give 10,000 points to referrer
      await tx.user.update({
        where: { id: referrer.id },
        data: { pointsBalance: { increment: 10000 } },
      });

      // Create point history for referrer
      await tx.pointHistory.create({
        data: {
          userId: referrer.id,
          pointsAmount: 10000,
          type: PointHistoryType.EARNED,
          source: PointSource.REFERRAL,
          description: `Referral bonus from ${newUserFullName}`,
          expiresAt: threeMonthsFromNow,
        },
      });

      // Create discount coupon for new user
      await tx.coupon.create({
        data: {
          userId: newUserId,
          couponCode: generateCouponCode(newUserFullName),
          discountValue: 25000, // IDR 25,000 discount
          expiresAt: threeMonthsFromNow,
        },
      });
    });
  }

  async validateReferralCode(referralCode: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { referralCode },
    });
    return !!user;
  }
}