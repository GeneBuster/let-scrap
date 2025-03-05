import express from "express";
import { getDealerProfile, updateDealerProfile } from "../controllers/dealercontroller.js";
import { verifyToken } from "../controllers/authcontroller.js";

const router = express.Router();

// Dealer Routes
router.get("/profile", verifyToken, getDealerProfile);
router.put("/profile", verifyToken, updateDealerProfile);

export default router;
