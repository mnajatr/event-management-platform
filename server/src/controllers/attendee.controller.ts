import { Request, Response } from "express";
import  prisma  from "../prisma";
import { AttendeeStatus } from "../generated/prisma";

export const updateAttendeeStatus = async (req: Request, res: Response) => {
  const { eventId, attendeeId } = req.params;
  const { status } = req.body;
  const organizerId = (req.user as any).id;
  //nanti fix typenya lagi

  try {
    // Validasi status
    if (!Object.values(AttendeeStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Pastikan event-nya milik organizer ini
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
    });

    if (!event || event.organizerId !== organizerId) {
      return res.status(404).json({ message: "Event not found or unauthorized" });
    }

    // Update status attendee
    const updated = await prisma.eventAttendee.update({
      where: { id: Number(attendeeId) },
      data: { status },
    });

    return res.json({
      message: "Attendee status updated",
      data: updated,
    });
  } catch (err) {
    console.error("Update attendee status error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};