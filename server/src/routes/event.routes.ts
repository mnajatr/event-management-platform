import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../generated/prisma";

const eventRouter = Router();
const eventController = new EventController();
const organizerOnly = [authMiddleware, roleMiddleware([UserRole.ORGANIZER])];

// Rute GET /api/events/my-events (harus diletakkan SEBELUM /:id)
eventRouter.get("/my-events", organizerOnly, eventController.getMyEvents);

// Rute GET publik
eventRouter.get("/", eventController.getAllEvents);
eventRouter.get("/:id", eventController.getEventById);

// Rute yang diproteksi
eventRouter.post("/", organizerOnly, eventController.createEvent);
eventRouter.put("/:id", organizerOnly, eventController.updateEvent);
eventRouter.delete("/:id", organizerOnly, eventController.deleteEvent);

export default eventRouter;
