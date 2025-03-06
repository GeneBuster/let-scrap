import express from "express";
import { getDealerProfile, updateDealerProfile } from "../controllers/dealer.controller.js";
import { verifyToken } from "../controllers/auth.controller.js";

const router = express.Router();

// Dealer Routes
router.get("/profile", verifyToken, getDealerProfile);
router.put("/profile", verifyToken, updateDealerProfile);

export default router;
