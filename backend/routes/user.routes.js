import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = express.Router();

// User Routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

export default router;
