import express from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/user.controller.js"; // Import the new controller
import { authMiddleware } from "../utils/auth.middleware.js";

const router = express.Router();

// User Routes
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

// --- New Route for Changing Password ---
router.put("/change-password", authMiddleware, changePassword);
// ---------------------------------------

export default router;
