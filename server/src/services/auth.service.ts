import prisma from "../prisma";
import type { User } from "../generated/prisma";
import { AppError } from "../errors/app.error";
import { HashUtil } from "../utils/hash";
import { JWTUtil } from "../utils/jwt";
import { generateReferralCode } from "../utils/generated-code";
import { ReferralService } from "./referral.service";
import {
  CreateUserInput,
  LoginInput,
  UserResponse,
} from "../validators/auth.validator";

export class AuthService {
  private referralService = new ReferralService();

  async registerUser(
    input: CreateUserInput
  ): Promise<{ user: UserResponse; token: string }> {
    const { fullName, email, password, profilePicture, role, referralCode } = input;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError("Email already registered", 400);

    const normalizedRole = role || "CUSTOMER";
    if (!["CUSTOMER", "ORGANIZER"].includes(normalizedRole)) {
      throw new AppError("Invalid role. Must be CUSTOMER or ORGANIZER.", 400);
    }

    if (
      referralCode &&
      !(await this.referralService.validateReferralCode(referralCode))
    ) {
      throw new AppError("Invalid referral code", 400);
    }

    const hashedPassword = await HashUtil.hashPassword(password);

    let userReferralCode: string;
    do {
      userReferralCode = generateReferralCode(fullName);
    } while (await prisma.user.findUnique({ where: { referralCode: userReferralCode } }));

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        profilePicture,
        role: normalizedRole,
        referralCode: userReferralCode,
        referralBy: referralCode
          ? (await prisma.user.findUnique({ where: { referralCode } }))?.id
          : undefined,
      },
    });

    if (referralCode) {
      await this.referralService.applyReferral(referralCode, user.id, fullName);
    }

    const token = JWTUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // include coupons for response
    const fullUser = await this.getUserById(user.id);

    return { user: fullUser, token };
  }

  async loginUser(
    input: LoginInput
  ): Promise<{ user: UserResponse; token: string }> {
    const { email, password } = input;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 401);

    const isPasswordValid = await HashUtil.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

    const token = JWTUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const fullUser = await this.getUserById(user.id);

    return { user: fullUser, token };
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        coupons: {
          select: {
            id: true,
            couponCode: true,
            discountValue: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!user) throw new AppError("User not found", 404);

    return this.toUserResponse(user);
  }

  private toUserResponse(user: User & { coupons?: any[] }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
      referralCode: user.referralCode,
      pointsBalance: user.pointsBalance,
      createdAt: user.createdAt,
      coupons: user.coupons || [],
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    console.log(`Password reset requested for ${email}`);
  }

  async updateUserPassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const isMatch = await HashUtil.comparePassword(currentPassword, user.password);
    if (!isMatch) throw new AppError("Current password is incorrect", 400);

    const hashedNew = await HashUtil.hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedNew } });
  }
}
