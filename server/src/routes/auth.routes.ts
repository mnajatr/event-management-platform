import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  passwordResetSchema,
  passwordUpdateSchema
} from "../validators/auth.validator";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post(
  "/forgot-password",
  validate(passwordResetSchema),
  authController.requestPasswordReset
);

router.patch(
  "/update-password",
  authMiddleware,
  validate(passwordUpdateSchema),
  authController.updatePassword
);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);

export default router;
