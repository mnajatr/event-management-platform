import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.service";
import { createEventSchema } from "../validators/event.validator";
import { AppError } from "../errors/app.error";
import prisma from "../prisma";

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

  async getMyEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.id;
      if (!organizerId) throw new AppError("Unauthorized", 401);

      const events = await eventService.findEventsByOrganizer(organizerId);

      res.status(200).json({
        message: "Organizer's events fetched successfully",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    //yang ini aku hardcode dulu belum di validasi
    try {
      const rawData = req.body;

      const data = {
        name: rawData.name,
        description: rawData.description,
        location: rawData.location,
        category: rawData.category,
        startDate: rawData.startDate ? new Date(rawData.startDate) : undefined,
        endDate: rawData.endDate ? new Date(rawData.endDate) : undefined,
        basePrice: rawData.basePrice ? Number(rawData.basePrice) : undefined,
        availableSeats: rawData.availableSeats
          ? Number(rawData.availableSeats)
          : undefined,
      };

      // Filter undefined supaya tidak mengubah field yang tidak disubmit
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );

      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: cleanData,
      });

      return res.status(200).json({
        status: "success",
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Failed to update event",
        error: String(error),
      });
    }
  }

  async getEventAttendees(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = parseInt(req.params.id);
      const organizerId = req.user?.id;

      if (!organizerId) throw new AppError("Unauthorized", 401);
      if (isNaN(eventId)) throw new AppError("Invalid event ID", 400);

      // Validasi kalau event ini memang milik organizer yang sedang login
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event || event.organizerId !== organizerId) {
        throw new AppError("Event not found or unauthorized", 404);
      }

      // Ambil semua attendee event ini
      const attendees = await prisma.eventAttendee.findMany({
        where: { eventId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: "Attendees fetched successfully",
        data: attendees,
      });
    } catch (error) {
      next(error);
    }
  }
}
