import express from "express";
import { updateAttendeeStatus } from "../controllers/attendee.controller";
import {
  authMiddleware as verifyToken,
  requireOrganizer,
} from "../middlewares/auth.middleware";

const router = express.Router();

// PATCH /api/organizers/events/:eventId/attendees/:attendeeId
router.patch(
  "/events/:eventId/attendees/:attendeeId",
  verifyToken,
  requireOrganizer,
  updateAttendeeStatus
);

export default router;
