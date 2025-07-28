import prisma from "../prisma";
import { Prisma } from "../../src/generated/prisma";
import { HttpException } from "../exceptions/http.exception";

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
      throw new HttpException(404, "Event not found");
    }

    return event;
  }
}
