import { Router } from "express";
import { StatisticController } from "../controllers/statistic.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new StatisticController();

router.get("/daily", authMiddleware, roleMiddleware(["ORGANIZER"]), controller.getDaily);
router.get("/monthly", authMiddleware, roleMiddleware(["ORGANIZER"]), controller.getMonthly);
router.get("/yearly", authMiddleware, roleMiddleware(["ORGANIZER"]), controller.getYearly);

export default router;