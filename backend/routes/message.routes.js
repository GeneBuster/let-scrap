import express from "express";
import Message from "../models/message.model.js";
import { authMiddleware } from "../utils/auth.middleware.js";

const router = express.Router();

// GET messages for a specific request (room)
router.get("/:requestId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ requestId: req.params.requestId })
      .sort({ createdAt: 1 }); // oldest to newest
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

export default router;
