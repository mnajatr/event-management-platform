import jwt from "jsonwebtoken";
import { AppError } from "../errors/app.error.js";

export class JWTUtil {
  static generateToken(payload: { id: number; email: string; role: string }): string {
    const secret: string = process.env.JWT_SECRET || "admin123";
    const expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";
    
    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  }

  static verifyToken(token: string): { id: number; email: string; role: string } {
    try {
      const secret: string = process.env.JWT_SECRET || "admin123";
      return jwt.verify(token, secret) as { id: number; email: string; role: string };
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }
}