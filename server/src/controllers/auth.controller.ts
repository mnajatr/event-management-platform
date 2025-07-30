import { Request, Response, NextFunction } from "express";
import { registerService } from "../services/auth.services";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerService(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};