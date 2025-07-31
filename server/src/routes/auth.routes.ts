import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema } from "../validators/auth.validator";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/register/customer", validate(registerSchema), authController.registerCustomer);
router.post("/register/organizer", validate(registerSchema), authController.registerOrganizer);
router.post("/login", authController.login);
router.post("/forgot-password", authController.requestPasswordReset);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);

export default router;
