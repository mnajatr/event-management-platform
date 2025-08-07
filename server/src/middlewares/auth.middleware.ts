import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error.js";
import { UserRole } from "../generated/prisma";
import { JWTUtil } from "../utils/jwt";
import jwt from "jsonwebtoken";

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Access token required", 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = JWTUtil.verifyToken(token);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.role !== "string"
    ) {
      throw new AppError("Invalid token payload", 404);
    }

    const isValidRole = Object.values(UserRole).includes(
      decoded.role as UserRole
    );
    if (!isValidRole) {
      throw new AppError("Invalid not specified in token", 401);
    }

    request.user = decoded as { id: number; email: string; role: UserRole };
    next();
  } catch (error) {
    next(error);
  }
}

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    if (!user) {
      throw new AppError("Authentication required", 401);
    }

    if (!allowedRoles.includes(user.role)) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
}
