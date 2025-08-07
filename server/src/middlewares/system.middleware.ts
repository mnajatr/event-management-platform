// middlewares/system.middleware.ts
import { Request, Response, NextFunction } from "express";

export function systemMiddleware(req: Request, res: Response, next: NextFunction) {
  // Dummy logic, bisa nanti pakai API key atau internal service
  const systemKey = req.headers['x-system-key'];
  if (systemKey !== process.env.SYSTEM_KEY) {
    return res.status(403).json({ message: "Unauthorized system access" });
  }
  next();
}