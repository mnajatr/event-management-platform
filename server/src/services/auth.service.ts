import prisma  from "../prisma";
import { AppError } from "../errors/app.error";
import { HashUtil } from "../utils/hash";
import { JWTUtil } from "../utils/jwt";
import { generateReferralCode } from "../utils/generated-code";
import { ReferralService } from "./referral.service";
import { CreateUserInput, LoginInput, UserResponse } from "../types/user.type";

export class AuthService {
  private referralService = new ReferralService();

  async registerUser(input: CreateUserInput): Promise<{ user: UserResponse; token: string }> {
    const { fullName, email, password, profilePicture, role, referralCode } = input;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Validate referral code if provided
    if (referralCode && !(await this.referralService.validateReferralCode(referralCode))) {
      throw new AppError("Invalid referral code", 400);
    }

    // Hash password
    const hashedPassword = await HashUtil.hashPassword(password);

    // Generate unique referral code
    let userReferralCode: string;
    do {
      userReferralCode = generateReferralCode(fullName);
    } while (await prisma.user.findUnique({ where: { referralCode: userReferralCode } }));

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        profilePicture,
        role: role || 'CUSTOMER',
        referralCode: userReferralCode,
        referralBy: referralCode 
          ? (await prisma.user.findUnique({ where: { referralCode } }))?.id 
          : undefined,
      },
    });

    // Apply referral benefits if referral code was used
    if (referralCode) {
      await this.referralService.applyReferral(referralCode, user.id, fullName);
    }

    // Generate JWT token
    const token = JWTUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without password
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
      referralCode: user.referralCode,
      pointsBalance: user.pointsBalance,
      createdAt: user.createdAt,
    };

    return { user: userResponse, token };
  }

  async loginUser(input: LoginInput): Promise<{ user: UserResponse; token: string }> {
    const { email, password } = input;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Verify password
    const isPasswordValid = await HashUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = JWTUtil.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user without password
    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
      referralCode: user.referralCode,
      pointsBalance: user.pointsBalance,
      createdAt: user.createdAt,
    };

    return { user: userResponse, token };
  }

  async getUserById(id: number): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
      referralCode: user.referralCode,
      pointsBalance: user.pointsBalance,
      createdAt: user.createdAt,
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // TODO: Implement email sending logic
    // For now, just log that password reset was requested
    console.log(`Password reset requested for ${email}`);
  }
}