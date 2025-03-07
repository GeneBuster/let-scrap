import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = express.Router();

// User Routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
