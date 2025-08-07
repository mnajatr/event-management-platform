import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const eventRouter = Router();
const eventController = new EventController();

// POST /api/events -> Membuat event baru
eventRouter.post("/", eventController.createEvent);

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
