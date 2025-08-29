import express from "express";
// 1. Import the new controller function we will create next.
import { getDealerProfile, updateDealerProfile, getDealerStats } from "../controllers/dealer.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js"
const router = express.Router();

// --- Dealer Routes ---

// Profile routes remain unchanged
router.get("/profile", authMiddleware, getDealerProfile);
router.put("/profile", authMiddleware, updateDealerProfile);

// 2. Add the new route for fetching performance statistics.
router.get("/stats", authMiddleware, getDealerStats);

export default router;
