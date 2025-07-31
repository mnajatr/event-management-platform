import { Request, Response, NextFunction } from "express";
import { JWTUtil } from "../utils/jwt";
import { AppError } from "../errors/app.error.js";

// export interface AuthenticatedRequest extends Request {
//   user: {
//     id: number;
//     email: string;
//     role: string;
//   };
// }

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

    request.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

export function roleMiddleware(allowedRoles: string[]) {
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
