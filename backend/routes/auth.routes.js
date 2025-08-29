import express from "express";
// Import the new 'register' function instead of the old ones
import { register, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// --- Authentication Routes ---

// The two registration routes are now replaced by this single route.
// Your frontend will send the 'role' in the request body to this endpoint.
router.post("/register", register);

// The login route remains the same.
router.post("/login", loginUser);

export default router;