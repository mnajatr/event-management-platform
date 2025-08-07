import { Router } from "express";
import { OrganizerController } from "../controllers/organizer.controller";
import { EventController } from "../controllers/event.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const organizerRouter = Router();
const organizerController = new OrganizerController();
const eventController = new EventController();

// 📊 Organizer Summary
organizerRouter.get(
  "/summary",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  organizerController.getRevenueSummary
);

// 📅 Upcoming Event
organizerRouter.get(
  "/upcoming-event",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  organizerController.getUpcomingEvent
);

// 📋 All Events milik Organizer
organizerRouter.get(
  "/events",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  organizerController.getMyEvents
);

// 🔍 Detail Event milik Organizer (by ID)
organizerRouter.get(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  eventController.getEventById
);

// ✅ Update Event milik Organizer (PATCH)
organizerRouter.patch(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  eventController.updateEvent
);

organizerRouter.get(
  "/events/:id/attendees",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  eventController.getEventAttendees
);

export default organizerRouter;