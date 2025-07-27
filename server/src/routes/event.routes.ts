import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const eventRouter = Router();
const eventController = new EventController();

eventRouter.post("/", eventController.createEvent);

export default eventRouter;
