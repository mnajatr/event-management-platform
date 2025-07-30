import express from "express";
import { register } from "../controllers/auth.controller"; // sesuaikan path

const router = express.Router();

router.post("/register", register);

export default router;
