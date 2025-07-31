import { UserRole } from "@/generated/prisma/index.js";

export interface CreateUserInput {
  fullName: string;
  email: string;
  password: string;
  profilePicture?: string;
  role?: UserRole;
  referralCode?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  profilePicture?: string | null;
  role: UserRole;
  referralCode: string;
  pointsBalance: number;
  createdAt: Date;
}

export interface PasswordResetInput {
  email: string;
}

export interface PasswordUpdateInput {
  currentPassword: string;
  newPassword: string;
} 