import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  passwordUpdateSchema,
} from "../validators/auth.validator";
import { forgotPassword, resetPassword } from "../controllers/password.controller";

const router = express.Router();
const authController = new AuthController();

// ===== Public Routes =====
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ===== Protected Routes =====
router.patch(
  "/update-password",
  authMiddleware,
  validate(passwordUpdateSchema),
  authController.updatePassword
);
router.get("/profile", authMiddleware, authController.getProfile);

export default router;