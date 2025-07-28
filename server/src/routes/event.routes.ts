import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const eventRouter = Router();
const eventController = new EventController();

// POST /api/events -> Membuat event baru
eventRouter.post("/", eventController.createEvent);

// GET /api/events -> Mendapatkan semua event (dengan filter)
eventRouter.get("/", eventController.getAllEvents);

// GET /api/events/:id -> Mendapatkan detail satu event
eventRouter.get("/:id", eventController.getEventById);

export default eventRouter;
