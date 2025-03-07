import express from "express";
import { getDealerProfile, updateDealerProfile } from "../controllers/dealer.controller.js";
import { authMiddleware } from "../utils/auth.middleware.js"
const router = express.Router();

// Dealer Routes
router.get("/profile", authMiddleware, getDealerProfile);
router.put("/profile", authMiddleware, updateDealerProfile);

export default router;
