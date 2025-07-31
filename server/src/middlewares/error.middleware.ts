import logger  from "../utils/logger";
import { AppError } from "../errors/app.error.js";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.error(error);

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    if (error.code === 'P2002') {
      return response.status(400).json({
        success: false,
        message: "Data already exists",
      });
    }
  }

  // Default error
  response.status(500).json({
    success: false,
    message: error instanceof Error ? error.message : "Internal server error",
  });
}