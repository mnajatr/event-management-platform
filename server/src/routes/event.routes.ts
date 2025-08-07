import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware,requireOrganizer, roleMiddleware } from "../middlewares/auth.middleware";

const eventRouter = Router();
const eventController = new EventController();

// POST /api/events -> Membuat event baru
eventRouter.post("/",
  authMiddleware,         // <-- WAJIB ADA
  requireOrganizer,       // <-- Jika hanya organizer yang boleh
  eventController.createEvent.bind(eventController)
);

// GET /api/events -> Mendapatkan semua event (dengan filter)
eventRouter.get("/", eventController.getAllEvents);

eventRouter.get(
  "/my",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  eventController.getMyEvents
);

// GET /api/events/:id -> Mendapatkan detail satu event
eventRouter.get("/:id", eventController.getEventById);

export default eventRouter;
