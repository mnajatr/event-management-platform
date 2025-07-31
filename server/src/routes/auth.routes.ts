import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.requestPasswordReset);

// Protected routes
// router.get("/profile", authMiddleware, authController.getProfile);
router.get( "/profile", authMiddleware as unknown as express.RequestHandler, authController.getProfile);


export default router;