import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../generated/prisma";

const eventRouter = Router();
const eventController = new EventController();
const organizerOnly = [authMiddleware, roleMiddleware([UserRole.ORGANIZER])];

// GET /api/events -> Mendapatkan semua event (dengan filter)
eventRouter.get("/", eventController.getAllEvents);

// GET /api/events/:id -> Mendapatkan detail satu event
eventRouter.get("/:id", eventController.getEventById);

// POST /api/events -> Membuat event baru
eventRouter.post("/", organizerOnly, eventController.createEvent);

export default eventRouter;
