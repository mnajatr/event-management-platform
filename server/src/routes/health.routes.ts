import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy 🚀" });
});

export default router;