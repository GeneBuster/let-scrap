import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/usercontroller.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

// User Routes
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);

export default router;
