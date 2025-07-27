import prisma from "../prisma";
import { Prisma } from "../../src/generated/prisma";

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
}
