import { Request, Response, NextFunction } from "express";
import { StatisticService } from "../services/statistic.service";
import { AppError } from "../errors/app.error";

const statisticService = new StatisticService();

export class StatisticController {
  async getDaily(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) return next(new AppError("Unauthorized", 401));

      const daily = await statisticService.getDailyStats(organizerId);
      return res.status(200).json({ message: "Daily stats", data: daily });
    } catch (error) {
      next(error);
    }
  }

  async getMonthly(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) return next(new AppError("Unauthorized", 401));

      const monthly = await statisticService.getMonthlyStats(organizerId);
      return res.status(200).json({ message: "Monthly stats", data: monthly });
    } catch (error) {
      next(error);
    }
  }

  async getYearly(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) return next(new AppError("Unauthorized", 401));

      const yearly = await statisticService.getYearlyStats(organizerId);
      return res.status(200).json({ message: "Yearly stats", data: yearly });
    } catch (error) {
      next(error);
    }
  }
}