import { Router } from "express";
import { OrganizerController } from "../controllers/organizer.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const organizerRouter = Router();
const organizerController = new OrganizerController();

organizerRouter.get(
  "/summary",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  organizerController.getRevenueSummary
);

organizerRouter.get(
  "/upcoming-event",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  organizerController.getUpcomingEvent
);

export default organizerRouter;