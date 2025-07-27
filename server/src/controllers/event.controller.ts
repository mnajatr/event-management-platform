import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { createEventSchema } from "../validators/event.validator";

const eventService = new EventService();

export class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      // Validasi body request
      const validatedData = createEventSchema.parse(req.body);

      const organizerId = 1; // Placeholder, ganti dengan logic auth nanti

      const newEvent = await eventService.createEvent({
        ...validatedData,
        organizerId,
        availableSeats: validatedData.totalSeats,
      });

      res.status(201).json({
        message: "Event created successfully! 🎪",
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  }
}
