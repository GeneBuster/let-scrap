import express from "express";
import { registerUser, registerDealer, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// Authentication Routes
router.post("/register/user", registerUser);
router.post("/register/dealer", registerDealer);
router.post("/login", loginUser);

export default router;