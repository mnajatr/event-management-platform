import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { createEventSchema } from "../validators/event.validator";
import { AppError } from "../errors/app.error";

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

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;
      const events = await eventService.findAllEvents(query);
      res.status(200).json({
        message: "Events fetched successfully! 🎉",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id, 10);
      if (isNaN(eventId)) {
        throw new AppError("Invalid event ID format", 400);
      }

      const event = await eventService.findEventById(eventId);
      if (!event) {
        throw new AppError("Event not found", 404);
      }

      res.status(200).json({
        message: "Event fetched successfully! 🎊",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }
}
