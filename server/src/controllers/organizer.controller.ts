import { Request, Response, NextFunction } from "express";
import { OrganizerService } from "../services/organizer.service";
import { AppError } from "../errors/app.error";
import prisma from "../prisma"

const organizerService = new OrganizerService();

export class OrganizerController {
  async getRevenueSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) {
        return next(new AppError("Unauthorized", 401));
      }

      const summary = await organizerService.getRevenueSummary(organizerId);
      res.status(200).json({
        message: "Revenue summary fetched successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) {
        return next(new AppError("Unauthorized", 401));
      }

      const upcomingEvent = await prisma.event.findFirst({
        where: {
          organizerId,
          startDate: {
            gte: new Date(),
          },
        },
        orderBy: {
          startDate: "asc",
        },
      });

      res.status(200).json({
        message: "Upcoming event fetched successfully",
        data: upcomingEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const organizerId = req.user?.id;
    if (!organizerId) return next(new AppError("Unauthorized", 401));

    const events = await prisma.event.findMany({
      where: { organizerId },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        location: true,
      },
    });

    return res.status(200).json({ message: "My Events", data: events });
  } catch (error) {
    next(error);
  }
}

}
