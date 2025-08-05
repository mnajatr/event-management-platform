import prisma from "../prisma";
import { Prisma } from "../../src/generated/prisma";
import { AppError } from "../errors/app.error";

interface FindEventsQuery {
  category?: string;
  location?: string;
  search?: string;
}

export class EventService {
  async createEvent(data: Prisma.EventUncheckedCreateInput) {
    const event = await prisma.event.create({
      data: {
        ...data,
        availableSeats: data.totalSeats,
      },
    });
    return event;
  }

  async findAllEvents(query: FindEventsQuery) {
    const { category, location, search } = query;
    const whereClause: Prisma.EventWhereInput = {};

    if (category) {
      whereClause.category = {
        equals: category as Prisma.EnumEventCategoryFilter["equals"],
      };
    }

    if (location) {
      whereClause.location = { contains: location, mode: "insensitive" };
    }

    if (search) {
      whereClause.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        organizer: {
          select: {
            fullName: true,
          },
        },
      },
    });
    return events;
  }

  async findEventById(id: number) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        ticketTypes: true,
      },
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    return event;
  }

  private async verifyEventOwner(eventId: number, organizerId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError("Event tidak ditemukan.", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Anda tidak memiliki akses ke event ini.", 403);
    }
  }

  async updateEvent(
    eventId: number,
    organizerId: number,
    data: Prisma.EventUpdateInput
  ) {
    await this.verifyEventOwner(eventId, organizerId);
    return await prisma.event.update({
      where: { id: eventId },
      data,
    });
  }

  async deleteEvent(eventId: number, organizerId: number) {
    await this.verifyEventOwner(eventId, organizerId);
    return await prisma.event.delete({
      where: { id: eventId },
    });
  }
}
